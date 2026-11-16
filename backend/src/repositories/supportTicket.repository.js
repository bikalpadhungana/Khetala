/**
 * Support Ticket Repository (Prisma)
 * ─────────────────────────────────────────────────────────────
 * Database operations for support tickets.
 */

const { prisma } = require('../config/db');

/**
 * Create a new support ticket
 */
const create = async (data) => {
  return prisma.supportTicket.create({
    data: {
      userId: data.userId,
      category: data.category,
      subject: data.subject || null,
      message: data.message,
      status: data.status || 'open',
      adminNotes: data.adminNotes || null,
    },
  });
};

/**
 * Find support ticket by ID
 */
const findById = async (id) => {
  return prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

/**
 * Find support tickets by user ID (for affiliate dashboard)
 */
const findByUserId = async (userId, { page = 1, limit = 50 } = {}) => {
  const offset = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.supportTicket.count({
      where: { userId },
    }),
  ]);

  return {
    tickets,
    total,
    page,
    limit,
  };
};

/**
 * Find all support tickets (for admin panel)
 */
const findAll = async ({ status, category, page = 1, limit = 50 } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const offset = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return {
    tickets,
    total,
    page,
    limit,
  };
};

/**
 * Update a support ticket by ID
 */
const updateById = async (id, updates) => {
  const data = {};
  if (updates.status !== undefined) data.status = updates.status;
  if (updates.adminNotes !== undefined) data.adminNotes = updates.adminNotes;

  return prisma.supportTicket.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

module.exports = {
  create,
  findById,
  findByUserId,
  findAll,
  updateById,
};
