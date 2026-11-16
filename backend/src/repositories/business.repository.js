/**
 * Business Repository (Prisma)
 * ─────────────────────────────────────────────────────────────
 * All database operations for the businesses table.
 * Handles contactPerson nesting for API contract compatibility.
 */

const { prisma } = require('../config/db');
const { BUSINESS_SELECT, BUSINESS_SELECT_WITH_PASSWORD } = require('./helpers');

/**
 * Nest flattened contact_person columns into a contactPerson object.
 * Maintains the existing API contract.
 */
const nestContactPerson = (row) => {
  if (!row) return null;
  const result = { ...row };
  result.contactPerson = {
    name: result.contactPersonName || null,
    phone: result.contactPersonPhone || null,
    email: result.contactPersonEmail || null,
    designation: result.contactPersonDesignation || null,
  };
  delete result.contactPersonName;
  delete result.contactPersonPhone;
  delete result.contactPersonEmail;
  delete result.contactPersonDesignation;
  return result;
};

/**
 * Flatten contactPerson sub-object into top-level fields for DB write.
 */
const flattenContactPerson = (data) => {
  const result = { ...data };
  if (result.contactPerson) {
    result.contactPersonName = result.contactPerson.name || null;
    result.contactPersonPhone = result.contactPerson.phone || null;
    result.contactPersonEmail = result.contactPerson.email || null;
    result.contactPersonDesignation = result.contactPerson.designation || null;
    delete result.contactPerson;
  }
  return result;
};

/**
 * Find business by ID (password excluded by default)
 */
const findById = async (id, { includePassword = false } = {}) => {
  const row = await prisma.business.findUnique({
    where: { id },
    select: includePassword ? BUSINESS_SELECT_WITH_PASSWORD : BUSINESS_SELECT,
  });
  return nestContactPerson(row);
};

/**
 * Find business by ID with sector populated
 */
const findByIdWithSector = async (id) => {
  const row = await prisma.business.findUnique({
    where: { id },
    include: {
      sector: { select: { id: true, name: true, description: true } },
    },
  });

  if (!row) return null;
  const business = nestContactPerson(row);
  // sector is already nested by Prisma include
  return business;
};

/**
 * Find business by email (password excluded by default, case-insensitive)
 */
const findByEmail = async (email, { includePassword = false } = {}) => {
  const row = await prisma.business.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: includePassword ? BUSINESS_SELECT_WITH_PASSWORD : BUSINESS_SELECT,
  });
  return nestContactPerson(row);
};

/**
 * Create a new business. Returns created business (without password).
 */
const create = async (data) => {
  if (data.sector && !data.sectorId) {
    data = { ...data, sectorId: data.sector };
    delete data.sector;
  }
  const flatData = flattenContactPerson(data);

  // Remove fields that aren't in the Prisma schema
  delete flatData.createdAt;
  delete flatData.updatedAt;

  const row = await prisma.business.create({
    data: flatData,
    select: BUSINESS_SELECT,
  });
  return nestContactPerson(row);
};

/**
 * Update a business by ID. Returns updated business.
 */
const updateById = async (id, updates) => {
  if (updates.sector && !updates.sectorId) {
    updates = { ...updates, sectorId: updates.sector };
    delete updates.sector;
  }
  const flatUpdates = flattenContactPerson(updates);

  // Remove fields Prisma manages automatically
  delete flatUpdates.createdAt;
  delete flatUpdates.updatedAt;

  const row = await prisma.business.update({
    where: { id },
    data: flatUpdates,
    select: BUSINESS_SELECT,
  });
  return nestContactPerson(row);
};

/**
 * Find a business with a different email (for uniqueness check).
 */
const findByEmailExcluding = async (email, excludeId) => {
  return prisma.business.findFirst({
    where: {
      email: { equals: email, mode: 'insensitive' },
      id: { not: excludeId },
    },
    select: { id: true },
  });
};

/**
 * Find all businesses with filtering, search, and pagination.
 * Includes sector join.
 */
const findAll = async ({ page = 1, limit = 10, search, isActive } = {}) => {
  const where = {};

  if (typeof isActive === 'boolean') {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const offset = (page - 1) * limit;

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      include: {
        sector: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.business.count({ where }),
  ]);

  return {
    businesses: businesses.map((row) => nestContactPerson(row)),
    total,
    page,
    limit,
  };
};

module.exports = {
  findById,
  findByIdWithSector,
  findByEmail,
  findByEmailExcluding,
  create,
  updateById,
  findAll,
};
