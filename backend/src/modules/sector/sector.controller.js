const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const sectorService = require("./sector.service");

/** POST /api/admin/sectors */
const createSector = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  const data = await sectorService.createSector({
    name,
    description,
    isActive,
    createdBy: req.user.id,
  });
  return ApiResponse.created(res, "Sector created successfully.", data);
});

/** GET /api/admin/sectors  |  GET /api/service (public) */
const getAllSectors = asyncHandler(async (req, res) => {
  const adminView = req.role === "superadmin";
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  const { sectors, total } = await sectorService.getAllSectors({ adminView, page, limit });
  return ApiResponse.paginated(res, "Sectors fetched successfully.", sectors, page, limit, total);
});

/** GET /api/admin/sectors/:id */
const getSectorById = asyncHandler(async (req, res) => {
  const data = await sectorService.getSectorById(req.params.id);
  return ApiResponse.ok(res, "Sector fetched successfully.", data);
});

/** PUT /api/admin/sectors/:id */
const updateSector = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  const data = await sectorService.updateSector(req.params.id, { name, description, isActive });
  return ApiResponse.ok(res, "Sector updated successfully.", data);
});

/** DELETE /api/admin/sectors/:id */
const deleteSector = asyncHandler(async (req, res) => {
  await sectorService.deleteSector(req.params.id);
  return ApiResponse.ok(res, "Service deleted successfully.");
});

module.exports = { createSector, getAllSectors, getSectorById, updateSector, deleteSector };
