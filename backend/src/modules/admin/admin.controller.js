const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const adminService = require("./admin.service");
const ApiError = require("../../utils/ApiError");

// ─────────────────────────────────────────────────────────────
// AFFILIATE MANAGEMENT
// ─────────────────────────────────────────────────────────────

/** GET /api/admin/affiliates */
const getAffiliates = asyncHandler(async (req, res) => {
  const { status, page, limit, search } = req.query;
  const { affiliates, total } = await adminService.getAffiliates({
    status,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
  });
  return ApiResponse.paginated(
    res, "Affiliates fetched successfully.", affiliates,
    parseInt(page, 10) || 1, parseInt(limit, 10) || 10, total
  );
});

/** PATCH /api/admin/affiliates/:id/approve */
const approveAffiliate = asyncHandler(async (req, res) => {
  const data = await adminService.approveAffiliate(req.params.id, req.user.id);
  return ApiResponse.ok(res, "Affiliate approved successfully.", data);
});

/** PATCH /api/admin/affiliates/:id/reject */
const rejectAffiliate = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const data = await adminService.rejectAffiliate(req.params.id, reason);
  return ApiResponse.ok(res, "Affiliate rejected.", data);
});

// ─────────────────────────────────────────────────────────────
// BUSINESS MANAGEMENT
// ─────────────────────────────────────────────────────────────

/** POST /api/admin/businesses */
const createBusiness = asyncHandler(async (req, res) => {
  const data = await adminService.createBusiness(req.body, req.user.id);
  return ApiResponse.created(res, "Business created successfully.", data);
});

/** GET /api/admin/businesses */
const getBusinesses = asyncHandler(async (req, res) => {
  const { page, limit, search, isActive } = req.query;
  const { businesses, total } = await adminService.getBusinesses({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    isActive: isActive !== undefined ? isActive === "true" : undefined,
  });
  return ApiResponse.paginated(
    res, "Businesses fetched successfully.", businesses,
    parseInt(page, 10) || 1, parseInt(limit, 10) || 10, total
  );
});

/** GET /api/admin/businesses/:id */
const getBusinessById = asyncHandler(async (req, res) => {
  const data = await adminService.getBusinessById(req.params.id);
  return ApiResponse.ok(res, "Business fetched successfully.", data);
});

/** PUT /api/admin/businesses/:id */
const updateBusiness = asyncHandler(async (req, res) => {
  const data = await adminService.updateBusiness(req.params.id, req.body);
  return ApiResponse.ok(res, "Business updated successfully.", data);
});

/** DELETE /api/admin/businesses/:id */
const deleteBusiness = asyncHandler(async (req, res) => {
  await adminService.deleteBusiness(req.params.id);
  return ApiResponse.ok(res, "Business deactivated successfully.");
});

// ─────────────────────────────────────────────────────────────
// REFERRAL MANAGEMENT
// ─────────────────────────────────────────────────────────────

/** GET /api/admin/referrals */
const getAllReferrals = asyncHandler(async (req, res) => {
  const { status, page, limit, search, assignedTo } = req.query;
  const { referrals, total } = await adminService.getAllReferrals({
    status,
    assignedTo,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search: search?.trim() || undefined,
  });
  return ApiResponse.paginated(
    res, "Referrals fetched successfully.", referrals,
    parseInt(page, 10) || 1, parseInt(limit, 10) || 10, total
  );
});

/** PATCH /api/admin/referrals/:id/status */
const updateReferralStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const data = await adminService.updateReferralStatus(
    req.params.id, status, req.user.id, note
  );
  return ApiResponse.ok(res, `Referral status updated to '${status}'.`, data);
});

/** PATCH /api/admin/referrals/:id/assign */
const assignReferral = asyncHandler(async (req, res) => {
  const { businessId, note } = req.body;
  const data = await adminService.assignReferral(
    req.params.id, businessId, req.user.id, note
  );
  return ApiResponse.ok(res, "Referral assigned to business successfully.", data);
});

/** GET /api/admin/affiliates/:id */
const getAffiliateById = asyncHandler(async (req, res) => {
  const data = await adminService.getAffiliateById(req.params.id);
  return ApiResponse.ok(res, "Affiliate fetched successfully.", data);
});

/** PUT /api/admin/affiliates/:id */
const updateAffiliate = asyncHandler(async (req, res) => {
  const data = await adminService.updateAffiliate(req.params.id, req.body);
  return ApiResponse.ok(res, "Affiliate updated successfully.", data);
});

/** DELETE /api/admin/affiliates/:id */
const deleteAffiliate = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    throw ApiError.badRequest("You cannot delete your own account.");
  }
  await adminService.deleteAffiliate(req.params.id);
  return ApiResponse.ok(res, "Affiliate deleted successfully.");
});

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
