const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const affiliateService = require("./affiliate.service");

/**
 * POST /api/affiliate/referrals
 * Submit a new referral lead
 */
const submitReferral = asyncHandler(async (req, res) => {
  const { name, email, phone, address, description, sector } = req.body;
  const data = await affiliateService.submitReferral(
    { name, email, phone, address, description, sector },
    req.user.id
  );
  return ApiResponse.created(res, "Referral submitted successfully.", data);
});

/**
 * GET /api/affiliate/referrals
 * Get all referrals submitted by the authenticated affiliate
 */
const getMyReferrals = asyncHandler(async (req, res) => {
  const { status, page, limit, search } = req.query;
  const { referrals, total, stats } = await affiliateService.getMyReferrals(req.user.id, {
    status,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search: search?.trim() || undefined,
  });
  return ApiResponse.paginated(
    res, "Referrals fetched successfully.", { referrals, stats },
    parseInt(page, 10) || 1, parseInt(limit, 10) || 10, total
  );
});

/**
 * GET /api/affiliate/credits
 * Get credit wallet summary and recent transactions
 */
const getCreditSummary = asyncHandler(async (req, res) => {
  const data = await affiliateService.getCreditSummary(req.user.id);
  return ApiResponse.ok(res, "Credit summary fetched successfully.", data);
});

/**
 * GET /api/affiliate/referrals/:id
 * Get details of a specific referral submitted by the authenticated affiliate
 */
const getReferralDetail = asyncHandler(async (req, res) => {
  const data = await affiliateService.getReferralDetail(req.params.id, req.user.id);
  return ApiResponse.ok(res, "Referral fetched successfully.", data);
});

module.exports = { submitReferral, getMyReferrals, getCreditSummary, getReferralDetail };
