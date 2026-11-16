const { referralRepo, userRepo, creditTransactionRepo } = require("../../repositories");
const notificationRepo = require("../notification/notification.repository");
const ApiError = require("../../utils/ApiError");

/**
 * Get all leads assigned to this business.
 */
const getMyLeads = async (businessId, { status, page = 1, limit = 10, search } = {}) => {
  return await referralRepo.findBusinessLeads(businessId, { status, page, limit, search });
};

/**
 * Get a single lead detail — only if assigned to this business.
 */
const getLeadById = async (referralId, businessId) => {
  const referral = await referralRepo.findByIdPopulated(referralId, { ownerFilter: { assigned_to: businessId } });
  if (!referral) throw ApiError.notFound("Lead not found or not assigned to your business.");
  return referral;
};

/**
 * Business can update status of their assigned leads.
 * Allowed transitions: assigned → contacted, contacted → converted | rejected
 * Business CANNOT convert — only superadmin can finalize conversion.
 */
const updateLeadStatus = async (referralId, businessId, newStatus, note) => {
  const referral = await referralRepo.findById(referralId);

  if (!referral || referral.assignedTo !== businessId) {
    throw ApiError.notFound("Lead not found or not assigned to your business.");
  }

  // Business-allowed transitions
  const businessTransitions = {
    assigned: ["contacted"],
    contacted: ["converted", "rejected"],
    converted: [],
    rejected: [],
    pending: [],
  };

  if (!businessTransitions[referral.status]?.includes(newStatus)) {
    throw ApiError.badRequest(
      `Cannot update lead status from '${referral.status}' to '${newStatus}'.`
    );
  }

  const updates = { status: newStatus };

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
      description: `Credits released for converted referral: ${referral.name} (by Business)`,
      balanceAfter: {
        availableCredits: affiliate.availableCredits,
        escrowCredits: affiliate.escrowCredits,
      },
    });
  }

  if (newStatus === "rejected") {
    updates.creditStatus = "cancelled";
    updates.rejectedAt = new Date();

    // Remove escrow credits
    const affiliate = await userRepo.incrementCredits(referral.submittedBy, {
      escrowCredits: -referral.totalCredits,
    });

    // Log credit transaction
    await creditTransactionRepo.create({
      user: referral.submittedBy,
      referral: referral.id,
      type: "cancel",
      amount: referral.totalCredits,
      description: `Credits cancelled for rejected referral: ${referral.name} (by Business)`,
      balanceAfter: {
        availableCredits: affiliate.availableCredits,
        escrowCredits: affiliate.escrowCredits,
      },
    });
  }

  await referralRepo.updateById(referralId, updates);

  await referralRepo.addStatusHistory({
    referralId,
    status: newStatus,
    changedBy: businessId,
    changedByModel: "Business",
    note: note || "",
    changedAt: new Date(),
  });

  // Notify affiliate
  let title = "Lead Status Update";
  let message = `Your lead ${referral.name} has been marked as '${newStatus}' by the partner business.`;
  let type = "info";

  if (newStatus === "converted") {
    title = "Lead Converted! 💎";
    message = `Congratulations! Your lead ${referral.name} has been successfully converted. ${referral.totalCredits} credits have been added to your available balance.`;
    type = "success";
  } else if (newStatus === "rejected") {
    title = "Lead Rejected";
    message = `Your lead ${referral.name} was rejected. ${referral.totalCredits} escrow credits have been cancelled.`;
    type = "error";
  } else if (newStatus === "contacted") {
    title = "Lead Contacted";
    message = `The partner business has contacted your lead ${referral.name}.`;
    type = "info";
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

module.exports = { getMyLeads, getLeadById, updateLeadStatus };
