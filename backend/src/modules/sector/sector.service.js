const { sectorRepo } = require("../../repositories");
const ApiError = require("../../utils/ApiError");

/**
 * Create a new sector (admin only)
 */
const createSector = async ({ name, description, isActive, createdBy }) => {
  const existing = await sectorRepo.findByName(name);
  if (existing) throw ApiError.conflict(`Sector '${name}' already exists.`);

  return await sectorRepo.create({ name, description, isActive, createdBy });
};

/**
 * Get all sectors (active only for public/affiliate, all for admin)
 */
const getAllSectors = async ({ adminView = false, page = 1, limit = 50 } = {}) => {
  return await sectorRepo.findAll({ adminView, page, limit });
};

/**
 * Get a single sector by ID
 */
const getSectorById = async (id) => {
  const sector = await sectorRepo.findByIdWithCreator(id);
  if (!sector) throw ApiError.notFound("Sector not found.");
  return sector;
};

/**
 * Update a sector (admin only)
 */
const updateSector = async (id, updates) => {
  // Check name uniqueness if being updated
  if (updates.name) {
    const existing = await sectorRepo.findByName(updates.name, { excludeId: id });
    if (existing) throw ApiError.conflict(`Sector '${updates.name}' already exists.`);
  }

  const sector = await sectorRepo.updateById(id, updates);
  if (!sector) throw ApiError.notFound("Sector not found.");
  return sector;
};

/**
 * Delete a sector (admin only)
 * Hard-delete if no businesses or referrals reference it;
 * otherwise reject with a clear conflict message.
 */
const deleteSector = async (id) => {
  // Verify sector exists first
  const sector = await sectorRepo.findById(id);
  if (!sector) throw ApiError.notFound("Sector not found.");

  // Check for dependent records before hard-deleting
  const deps = await sectorRepo.hasDependents(id);
  if (deps.hasDependents) {
    const parts = [];
    if (deps.businessCount > 0) parts.push(`${deps.businessCount} business(es)`);
    if (deps.referralCount > 0) parts.push(`${deps.referralCount} referral(s)`);
    throw ApiError.conflict(
      `Cannot delete this service. It is still referenced by ${parts.join(" and ")}. Please reassign or remove them first.`
    );
  }

  await sectorRepo.deleteById(id);
  return { deleted: true };
};

module.exports = { createSector, getAllSectors, getSectorById, updateSector, deleteSector };
