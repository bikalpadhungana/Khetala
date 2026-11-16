/**
 * Contact Inquiry Repository (Prisma)
 * ─────────────────────────────────────────────────────────────
 * Database operations for public contact inquiries.
 */

const { prisma } = require('../config/db');

/**
 * Create a new contact inquiry
 */
const create = async (data) => {
  return prisma.contactInquiry.create({
    data: {
      name: data.name,
      organization: data.organization || null,
      email: data.email,
      phone: data.phone,
      inquiryType: data.inquiryType,
      leadSector: data.leadSector || null,
      message: data.message,
      status: data.status || 'pending',
      adminNotes: data.adminNotes || null,
    },
  });
};

/**
 * Find inquiry by ID
 */
const findById = async (id) => {
  return prisma.contactInquiry.findUnique({ where: { id } });
};

/**
 * Find all inquiries with filters & pagination
 */
const findAll = async ({ status, page = 1, limit = 50 } = {}) => {
  const where = {};
  if (status) where.status = status;

  const offset = (page - 1) * limit;

  const [inquiries, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.contactInquiry.count({ where }),
  ]);

  return {
    inquiries,
    total,
    page,
    limit,
  };
};

/**
 * Update an inquiry by ID
 */
const updateById = async (id, updates) => {
  const data = {};
  if (updates.status !== undefined) data.status = updates.status;
  if (updates.adminNotes !== undefined) data.adminNotes = updates.adminNotes;

  return prisma.contactInquiry.update({ where: { id }, data });
};

module.exports = {
  create,
  findById,
  findAll,
  updateById,
};
