const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const businessService = require("./business.service");

/**
 * GET /api/business/leads
 * Get all leads assigned to the authenticated business
 */
const getMyLeads = asyncHandler(async (req, res) => {
  const { status, page, limit, search } = req.query;
  const { leads, total } = await businessService.getMyLeads(req.user.id, {
    status,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
  });
  return ApiResponse.paginated(
    res, "Leads fetched successfully.", leads,
    parseInt(page, 10) || 1, parseInt(limit, 10) || 10, total
  );
});

/**
 * GET /api/business/leads/:id
 * Get a specific lead assigned to this business
 */
const getLeadById = asyncHandler(async (req, res) => {
  const data = await businessService.getLeadById(req.params.id, req.user.id);
  return ApiResponse.ok(res, "Lead fetched successfully.", data);
});

/**
 * PATCH /api/business/leads/:id/status
 * Update lead status (business-allowed transitions only)
 */
const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const data = await businessService.updateLeadStatus(
    req.params.id,
    req.user.id,
    status,
    note
  );
  return ApiResponse.ok(res, `Lead status updated to '${status}'.`, data);
});

module.exports = { getMyLeads, getLeadById, updateLeadStatus };
