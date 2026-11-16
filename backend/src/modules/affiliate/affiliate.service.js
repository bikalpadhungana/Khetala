const { referralRepo, sectorRepo, userRepo, creditTransactionRepo } = require("../../repositories");
const notificationRepo = require("../notification/notification.repository");
const ApiError = require("../../utils/ApiError");
const { calculateReferralCredits, getCreditBreakdown } = require("../../utils/credit.utils");

/**
 * Submit a new referral.
 * Credits are calculated dynamically and placed into escrowCredits.
 */
const submitReferral = async ({ name, email, phone, address, description, sector }, affiliateId) => {
  // The frontend passes a slug (e.g. 'abroad-study-services'), so we need to match it against DB sectors
  let sectorDoc;
  const isObjectId = /^[0-9a-f]{24}$/i.test(sector);
  
  if (isObjectId) {
    sectorDoc = await sectorRepo.findById(sector);
  } else {
    // Fetch all sectors and match by standardizing the name to a slug
    const allSectorsResult = await sectorRepo.findAll({ adminView: true, limit: 100 });
    sectorDoc = allSectorsResult.sectors.find(s => 
      s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === sector
    );
  }

  if (!sectorDoc) throw ApiError.notFound("Selected sector not found.");
  if (!sectorDoc.isActive) throw ApiError.badRequest("Selected sector is no longer active.");

  // Calculate credits
  const referralData = { name, email, phone, address, description, sector };
  const totalCredits = calculateReferralCredits(referralData);
  const breakdown = getCreditBreakdown(referralData);

  // Create referral
  const referral = await referralRepo.create({
    submittedBy: affiliateId,
    name,
    email,
    phone,
    address,
    description,
    sector: sectorDoc.id,
    totalCredits,
    creditStatus: "escrow",
    status: "pending",
  });

  // Log initial status history
  await referralRepo.addStatusHistory({
    referralId: referral.id,
    status: "pending",
    changedBy: affiliateId,
    changedByModel: "User",
    note: "Referral submitted by affiliate",
  });

  // Add credits to affiliate's escrow wallet
  const affiliate = await userRepo.incrementCredits(affiliateId, {
    escrowCredits: totalCredits,
  });

  // Log credit transaction
  await creditTransactionRepo.create({
    user: affiliateId,
    referral: referral.id,
    type: "escrow",
    amount: totalCredits,
    description: `Credits escrowed for referral: ${name}`,
    balanceAfter: {
      availableCredits: affiliate.availableCredits,
      escrowCredits: affiliate.escrowCredits,
    },
  });

  // Notify affiliate
  await notificationRepo.createNotification({
    userId: affiliateId,
    title: "Lead Submitted Successfully",
    message: `Your referral for ${name} has been received. ${totalCredits} credits are now held in escrow pending verification.`,
    type: "success",
    link: `/affiliate/my-leads`,
  });

  return {
    referral: await referralRepo.findByIdPopulated(referral.id),
    creditBreakdown: breakdown,
    totalCredits,
  };
};

/**
 * Get all referrals submitted by the authenticated affiliate.
 */
const getMyReferrals = async (affiliateId, { status, page = 1, limit = 10, search } = {}) => {
  const result = await referralRepo.findAll({
    submittedBy: affiliateId,
    status,
    page,
    limit,
    search,
  });

  const stats = await referralRepo.getAffiliateStats(affiliateId);

  return {
    referrals: result.referrals,
    total: result.total,
    page: result.page,
    limit: result.limit,
    stats: {
      total: stats.total,
      converted: stats.converted,
    },
  };
};

/**
 * Get credit summary for the authenticated affiliate.
 */
const getCreditSummary = async (affiliateId) => {
  const affiliate = await userRepo.findById(affiliateId);
  if (!affiliate) throw ApiError.notFound("Affiliate not found.");

  const transactions = await creditTransactionRepo.findByUser(affiliateId, { limit: 20 });
  const stats = await referralRepo.getAffiliateStats(affiliateId);

  return {
    wallet: {
      availableCredits: affiliate.availableCredits,
      escrowCredits: affiliate.escrowCredits,
      totalEarned: affiliate.availableCredits + affiliate.escrowCredits,
      pending_balance: affiliate.escrowCredits,
      total_earned: affiliate.availableCredits + affiliate.escrowCredits,
    },
    stats: {
      pendingTransactionsCount: stats.pendingTransactionsCount,
    },
    recentTransactions: transactions,
  };
};

/**
 * Get a single referral detail — only if submitted by this affiliate.
 */
const getReferralDetail = async (referralId, affiliateId) => {
  const referral = await referralRepo.findByIdPopulated(referralId, {
    ownerFilter: { submitted_by: affiliateId }
  });

  if (!referral) {
    throw ApiError.notFound("Referral not found or not submitted by you.");
  }

  return referral;
};

module.exports = { submitReferral, getMyReferrals, getCreditSummary, getReferralDetail };
