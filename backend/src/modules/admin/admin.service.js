const { userRepo, businessRepo, referralRepo, creditTransactionRepo } = require("../../repositories");
const notificationRepo = require("../notification/notification.repository");
const ApiError = require("../../utils/ApiError");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../../utils/mailer");

// ─────────────────────────────────────────────────────────────
// AFFILIATE MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * Get all affiliate partners with optional filtering and pagination
 */
const getAffiliates = async ({ status, page = 1, limit = 10, search } = {}) => {
  return await userRepo.findAffiliates({ status, page, limit, search });
};

/**
 * Approve an affiliate partner
 */
const approveAffiliate = async (affiliateId, adminId) => {
  const affiliate = await userRepo.findOne({ id: affiliateId, role: "affiliate" });
  if (!affiliate) throw ApiError.notFound("Affiliate not found.");

  if (affiliate.status === "approved") {
    throw ApiError.badRequest("This affiliate is already approved.");
  }

  const result = await userRepo.updateById(affiliateId, {
    status: "approved",
    approvedAt: new Date(),
    approvedBy: adminId,
    rejectionReason: null, // clear rejection reason
  });

  // Notify affiliate
  await notificationRepo.createNotification({
    userId: affiliateId,
    title: "Account Approved! 🎉",
    message: "Your affiliate partner account has been approved. You can now start referring leads and earning commissions.",
    type: "success",
  });

  // Send Email Notification
  try {
    if (affiliate.email) {
      await sendMail({
        to: affiliate.email,
        subject: "Welcome to Think Tank - Account Approved!",
        text: "Congratulations! Your affiliate partner account has been approved. You can now log in to the dashboard, start referring leads, and earn commissions.",
        html: `
          <h2>Account Approved! 🎉</h2>
          <p>Hi ${affiliate.name || 'Partner'},</p>
          <p>Congratulations! Your affiliate partner account with Think Tank has been approved.</p>
          <p>You can now log in to your dashboard to start submitting leads and tracking your commissions.</p>
          <br/>
          <p>Best regards,<br/>The Think Tank Team</p>
        `,
      });
    }
  } catch (error) {
    console.error("Failed to send affiliate approval email:", error);
  }

  return result;
};

/**
 * Reject an affiliate partner
 */
const rejectAffiliate = async (affiliateId, reason) => {
  const affiliate = await userRepo.findOne({ id: affiliateId, role: "affiliate" });
  if (!affiliate) throw ApiError.notFound("Affiliate not found.");

  if (affiliate.status === "rejected") {
    throw ApiError.badRequest("This affiliate is already rejected.");
  }

  const result = await userRepo.updateById(affiliateId, {
    status: "rejected",
    rejectionReason: reason || "No reason provided.",
  });

  // Notify affiliate
  await notificationRepo.createNotification({
    userId: affiliateId,
    title: "Account Application Rejected",
    message: `Your affiliate account application was rejected. Reason: ${reason || "No reason provided."}`,
    type: "error",
  });

  return result;
};

// ─────────────────────────────────────────────────────────────
// BUSINESS MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * Create a new business account (admin only)
 */
const createBusiness = async (businessData, adminId) => {
  const existing = await businessRepo.findByEmail(businessData.email);
  if (existing) throw ApiError.conflict("A business with this email already exists.");

  const existingUser = await userRepo.findByEmail(businessData.email);
  if (existingUser) throw ApiError.conflict("An account with this email already exists.");

  const hashedPassword = await bcrypt.hash(businessData.password, 12);
  
  return await businessRepo.create({ 
    ...businessData, 
    password: hashedPassword,
    createdBy: adminId 
  });
};

/**
 * Get all businesses with pagination
 */
const getBusinesses = async ({ page = 1, limit = 10, search, isActive } = {}) => {
  return await businessRepo.findAll({ page, limit, search, isActive });
};

/**
 * Get a single business by ID
 */
const getBusinessById = async (id) => {
  const business = await businessRepo.findByIdWithSector(id);
  if (!business) throw ApiError.notFound("Business not found.");
  return business;
};

/**
 * Update a business
 */
const updateBusiness = async (id, updates) => {
  if (updates.email) {
    const existing = await businessRepo.findByEmailExcluding(updates.email, id);
    if (existing) throw ApiError.conflict("A business with this email already exists.");
  }

  const business = await businessRepo.updateById(id, updates);
  if (!business) throw ApiError.notFound("Business not found.");
  
  // Re-fetch with sector for consistent return shape
  return await businessRepo.findByIdWithSector(id);
};

/**
 * Soft-delete a business (deactivate)
 */
const deleteBusiness = async (id) => {
  const business = await businessRepo.updateById(id, { isActive: false });
  if (!business) throw ApiError.notFound("Business not found.");
  return business;
};

// ─────────────────────────────────────────────────────────────
// REFERRAL MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * Get all referrals with filters and pagination
 */
const getAllReferrals = async ({ status, page = 1, limit = 10, search, assignedTo } = {}) => {
  return await referralRepo.findAll({ status, page, limit, search, assignedTo });
};

/**
 * Update referral status (admin action)
 * Handles credit lifecycle: converted → release, rejected → cancel
 */
const updateReferralStatus = async (referralId, newStatus, adminId, note) => {
  let referral = await referralRepo.findById(referralId);
  if (!referral) throw ApiError.notFound("Referral not found.");

  const validTransitions = {
    pending: ["assigned", "rejected"],
    assigned: ["contacted", "rejected"],
    contacted: ["converted", "rejected"],
    converted: [],
    rejected: [],
  };

  if (!validTransitions[referral.status].includes(newStatus)) {
    throw ApiError.badRequest(
      `Cannot transition referral from '${referral.status}' to '${newStatus}'.`
    );
  }

  const updates = { status: newStatus };

  // Append to status history
  await referralRepo.addStatusHistory({
    referralId,
    status: newStatus,
    changedBy: adminId,
    changedByModel: "User",
    note: note || "",
    changedAt: new Date(),
  });

  // ── Credit lifecycle ────────────────────────────────────────
  if (newStatus === "converted") {
    updates.creditStatus = "released";
    updates.convertedAt = new Date();

    // Move escrow → available for the affiliate
    const affiliate = await userRepo.incrementCredits(referral.submittedBy, {
      escrowCredits: -referral.totalCredits,
      availableCredits: referral.totalCredits,
    });

    // Log credit transaction
    await creditTransactionRepo.create({
      user: referral.submittedBy,
      referral: referral.id,
      type: "release",
      amount: referral.totalCredits,
      description: `Credits released for converted referral: ${referral.name}`,
      balanceAfter: {
        availableCredits: affiliate.availableCredits,
        escrowCredits: affiliate.escrowCredits,
      },
    });
  }

  if (newStatus === "rejected") {
    updates.creditStatus = "cancelled";
    updates.rejectedAt = new Date();

    // Remove escrow credits (not moved to available)
    const affiliate = await userRepo.incrementCredits(referral.submittedBy, {
      escrowCredits: -referral.totalCredits,
    });

    // Log credit transaction
    await creditTransactionRepo.create({
      user: referral.submittedBy,
      referral: referral.id,
      type: "cancel",
      amount: referral.totalCredits,
      description: `Credits cancelled for rejected referral: ${referral.name}`,
      balanceAfter: {
        availableCredits: affiliate.availableCredits,
        escrowCredits: affiliate.escrowCredits,
      },
    });
  }

  await referralRepo.updateById(referralId, updates);

  // Notify affiliate
  let title = "Lead Status Update";
  let message = `Your lead ${referral.name} is now in '${newStatus}' status.`;
  let type = "info";

  if (newStatus === "converted") {
    title = "Lead Converted! 💎";
    message = `Congratulations! Your lead ${referral.name} has been successfully converted. ${referral.totalCredits} credits have been added to your available balance.`;
    type = "success";
  } else if (newStatus === "rejected") {
    title = "Lead Rejected";
    message = `Your lead ${referral.name} was rejected. ${referral.totalCredits} escrow credits have been cancelled.`;
    type = "error";
  }

  await notificationRepo.createNotification({
    userId: referral.submittedBy,
    title,
    message,
    type,
    link: `/affiliate/my-leads`,
  });
  
  return await referralRepo.findByIdPopulated(referralId);
};

/**
 * Assign a referral to a business
 */
const assignReferral = async (referralId, businessId, adminId, note) => {
  const referral = await referralRepo.findById(referralId);
  if (!referral) throw ApiError.notFound("Referral not found.");

  if (!["pending", "assigned"].includes(referral.status)) {
    throw ApiError.badRequest(
      `Only pending or already-assigned referrals can be assigned. Current status: '${referral.status}'.`
    );
  }

  const business = await businessRepo.findById(businessId);
  if (!business) throw ApiError.notFound("Business not found.");
  if (!business.isActive) throw ApiError.badRequest("Cannot assign referral to an inactive business.");

  await referralRepo.updateById(referralId, {
    assignedTo: businessId,
    status: "assigned",
    assignedAt: new Date(),
  });

  await referralRepo.addStatusHistory({
    referralId,
    status: "assigned",
    changedBy: adminId,
    changedByModel: "User",
    note: note || `Assigned to ${business.name}`,
    changedAt: new Date(),
  });

  // Notify affiliate
  await notificationRepo.createNotification({
    userId: referral.submittedBy,
    title: "Lead Assigned",
    message: `Your lead ${referral.name} has been assigned to a partner business (${business.name}) for processing.`,
    type: "info",
    link: `/affiliate/my-leads`,
  });

  return await referralRepo.findByIdPopulated(referralId);
};

/**
 * Get detailed profile of an affiliate (admin only)
 */
const getAffiliateById = async (affiliateId) => {
  const affiliate = await userRepo.findOne({ id: affiliateId, role: "affiliate" });
  if (!affiliate) throw ApiError.notFound("Affiliate not found.");
  return affiliate;
};

/**
 * Update an affiliate's details (admin only)
 */
const updateAffiliate = async (affiliateId, updates) => {
  const affiliate = await userRepo.findOne({ id: affiliateId, role: "affiliate" });
  if (!affiliate) throw ApiError.notFound("Affiliate not found.");

  if (updates.email) {
    // Check if email already exists for another user
    const existingUser = await userRepo.findByEmailExcluding(updates.email, affiliateId);
    if (existingUser) {
      throw ApiError.conflict("An account with this email already exists.");
    }

    // Check if email already exists for a business
    const existingBusiness = await businessRepo.findByEmail(updates.email);
    if (existingBusiness) {
      throw ApiError.conflict("A business with this email already exists.");
    }
  }

  const result = await userRepo.updateById(affiliateId, updates);
  return result;
};

/**
 * Delete an affiliate partner (admin only)
 */
const deleteAffiliate = async (affiliateId) => {
  const affiliate = await userRepo.findOne({ id: affiliateId, role: "affiliate" });
  if (!affiliate) throw ApiError.notFound("Affiliate not found.");

  const result = await userRepo.deleteById(affiliateId);
  return result;
};

module.exports = {
  getAffiliates,
  approveAffiliate,
  rejectAffiliate,
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getAllReferrals,
  updateReferralStatus,
  assignReferral,
  getAffiliateById,
  updateAffiliate,
  deleteAffiliate,
};

