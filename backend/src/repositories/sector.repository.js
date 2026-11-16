/**
 * Sector Repository (Prisma)
 * ─────────────────────────────────────────────────────────────
 * All database operations for the sectors table.
 */

const { prisma } = require('../config/db');

/**
 * Find sector by ID
 */
const findById = async (id) => {
  return prisma.sector.findUnique({ where: { id } });
};

/**
 * Find sector by ID with createdBy user joined
 */
const findByIdWithCreator = async (id) => {
  const sector = await prisma.sector.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
    },
  });

  if (!sector) return null;

  // Reshape createdBy to match existing API contract
  const result = { ...sector };
  result.createdBy = sector.creator
    ? { id: sector.creator.id, name: sector.creator.name, email: sector.creator.email }
    : null;
  delete result.creator;
  return result;
};

/**
 * Find sector by name (case-insensitive)
 */
const findByName = async (name, { excludeId } = {}) => {
  const where = { name: { equals: name, mode: 'insensitive' } };
  if (excludeId) where.id = { not: excludeId };

  return prisma.sector.findFirst({ where });
};

/**
 * Create a new sector
 */
const create = async (data) => {
  return prisma.sector.create({
    data: {
      name: data.name,
      description: data.description || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdBy: data.createdBy || null,
    },
  });
};

/**
 * Update a sector by ID
 */
const updateById = async (id, updates) => {
  const data = {};
  if (updates.name !== undefined) data.name = updates.name;
  if (updates.description !== undefined) data.description = updates.description;
  if (updates.isActive !== undefined) data.isActive = updates.isActive;

  return prisma.sector.update({ where: { id }, data });
};

/**
 * Find all sectors with optional filtering and pagination.
 * Includes createdBy user join.
 */
const findAll = async ({ adminView = false, page = 1, limit = 50 } = {}) => {
  const where = adminView ? {} : { isActive: true };
  const offset = (page - 1) * limit;

  const [sectors, total] = await Promise.all([
    prisma.sector.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { name: 'asc' },
      skip: offset,
      take: limit,
    }),
    prisma.sector.count({ where }),
  ]);

  return {
    sectors: sectors.map((sector) => {
      const result = { ...sector };
      result.createdBy = sector.creator
        ? { id: sector.creator.id, name: sector.creator.name, email: sector.creator.email }
        : null;
      delete result.creator;
      return result;
    }),
    total,
    page,
    limit,
  };
};

/**
 * Check if a sector has dependent businesses or referrals
 */
const hasDependents = async (id) => {
  const [businessCount, referralCount] = await Promise.all([
    prisma.business.count({ where: { sectorId: id } }),
    prisma.referral.count({ where: { sectorId: id } }),
  ]);
  return { businessCount, referralCount, hasDependents: businessCount > 0 || referralCount > 0 };
};

/**
 * Hard-delete a sector by ID
 */
const deleteById = async (id) => {
  return prisma.sector.delete({ where: { id } });
};

module.exports = {
  findById,
  findByIdWithCreator,
  findByName,
  create,
  updateById,
  findAll,
  hasDependents,
  deleteById,
};
