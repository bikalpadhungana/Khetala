/**
 * User Repository (Prisma)
 * ─────────────────────────────────────────────────────────────
 * All database operations for the users table.
 * Services should NEVER access the DB directly — always go through this.
 */

const { prisma } = require('../config/db');
const { USER_SELECT, USER_SELECT_WITH_PASSWORD } = require('./helpers');

/**
 * Find user by ID (password excluded by default)
 */
const findById = async (id, { includePassword = false } = {}) => {
  return prisma.user.findUnique({
    where: { id },
    select: includePassword ? USER_SELECT_WITH_PASSWORD : USER_SELECT,
  });
};

/**
 * Find user by email (password excluded by default, case-insensitive)
 */
const findByEmail = async (email, { includePassword = false } = {}) => {
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: includePassword ? USER_SELECT_WITH_PASSWORD : USER_SELECT,
  });
};

/**
 * Find one user matching conditions
 */
const findOne = async (conditions, { includePassword = false } = {}) => {
  return prisma.user.findFirst({
    where: conditions,
    select: includePassword ? USER_SELECT_WITH_PASSWORD : USER_SELECT,
  });
};

/**
 * Create a new user. Returns the created user (without password).
 */
const create = async (data) => {
  return prisma.user.create({
    data,
    select: USER_SELECT,
  });
};

/**
 * Update a user by ID. Returns updated user (without password).
 */
const updateById = async (id, updates) => {
  return prisma.user.update({
    where: { id },
    data: updates,
    select: USER_SELECT,
  });
};

/**
 * Increment credit fields atomically (for escrow/release/cancel operations).
 * @param {string} id - User ID
 * @param {object} increments - e.g. { escrowCredits: 50, availableCredits: -50 }
 * @returns {object} Updated user
 */
const incrementCredits = async (id, increments) => {
  const data = {};
  if (increments.escrowCredits !== undefined) {
    data.escrowCredits = { increment: increments.escrowCredits };
  }
  if (increments.availableCredits !== undefined) {
    data.availableCredits = { increment: increments.availableCredits };
  }

  return prisma.user.update({
    where: { id },
    data,
    select: USER_SELECT,
  });
};

/**
 * Find affiliates with filtering, searching, and pagination.
 */
const findAffiliates = async ({ status, page = 1, limit = 10, search } = {}) => {
  const where = { role: 'affiliate' };

  if (status) where.status = status;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const offset = (page - 1) * limit;

  const [affiliates, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { affiliates, total, page, limit };
};

/**
 * Delete user by ID.
 */
const deleteById = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

/**
 * Find user by email excluding a specific ID (for uniqueness check).
 */
const findByEmailExcluding = async (email, excludeId) => {
  return prisma.user.findFirst({
    where: {
      email: { equals: email, mode: 'insensitive' },
      id: { not: excludeId },
    },
    select: { id: true },
  });
};

module.exports = {
  findById,
  findByEmail,
  findOne,
  create,
  updateById,
  incrementCredits,
  findAffiliates,
  deleteById,
  findByEmailExcluding,
};

