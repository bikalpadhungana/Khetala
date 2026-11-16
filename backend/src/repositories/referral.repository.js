/**
 * Referral Repository (Prisma)
 * ─────────────────────────────────────────────────────────────
 * All database operations for referrals and referral_status_history tables.
 * Prisma's `include` replaces all the verbose leftJoin + shapePopulated logic.
 */

const { prisma } = require('../config/db');

/**
 * Prisma include block for populated referral queries.
 * Replaces the old buildPopulatedQuery() + shapePopulated() pattern.
 */
const POPULATED_INCLUDE = {
  submitter: { select: { id: true, name: true, email: true, phone: true } },
  assignee: { select: { id: true, name: true, email: true } },
  sector: { select: { id: true, name: true, description: true } },
};

/**
 * Shape a Prisma-included referral to match the existing API contract.
 * Converts Prisma's nested relation objects to the flat shape services expect.
 *
 * Prisma returns: { submitter: { id, name, email }, assignee: { id, name }, sector: { id, name } }
 * API expects:    { submittedBy: { id, name, email }, assignedTo: { id, name }, sector: { id, name } }
 */
const shapeForAPI = (referral) => {
  if (!referral) return null;
  const result = { ...referral };

  // submitter → submittedBy (nested object)
  if (result.submitter) {
    result.submittedBy = result.submitter;
    delete result.submitter;
  }

  // assignee → assignedTo (nested object or null)
  if (result.assignee) {
    result.assignedTo = result.assignee;
  }
  delete result.assignee;

  return result;
};

/**
 * Find referral by ID (raw, no joins)
 */
const findById = async (id) => {
  return prisma.referral.findUnique({ where: { id } });
};

/**
 * Find referral by ID with all relations populated
 */
const findByIdPopulated = async (id, { ownerFilter } = {}) => {
  const where = { id };

  // ownerFilter maps to: { submitted_by: affiliateId } or { assigned_to: businessId }
  if (ownerFilter) {
    if (ownerFilter.submitted_by) where.submittedBy = ownerFilter.submitted_by;
    if (ownerFilter.assigned_to) where.assignedTo = ownerFilter.assigned_to;
  }

  const referral = await prisma.referral.findFirst({
    where,
    include: {
      ...POPULATED_INCLUDE,
      statusHistories: { orderBy: { changedAt: 'asc' } },
    },
  });

  if (!referral) return null;

  const shaped = shapeForAPI(referral);
  // Rename statusHistories → statusHistory for API consistency
  shaped.statusHistory = shaped.statusHistories || [];
  delete shaped.statusHistories;

  return shaped;
};

/**
 * Create a new referral
 */
const create = async (data) => {
  return prisma.referral.create({
    data: {
      submittedBy: data.submittedBy,
      assignedTo: data.assignedTo || null,
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      address: data.address || null,
      description: data.description,
      sectorId: data.sector || data.sectorId,
      status: data.status || 'pending',
      totalCredits: data.totalCredits,
      creditStatus: data.creditStatus || 'escrow',
      adminNotes: data.adminNotes || null,
      assignedAt: data.assignedAt || null,
      convertedAt: data.convertedAt || null,
      rejectedAt: data.rejectedAt || null,
    },
  });
};

/**
 * Update a referral by ID
 */
const updateById = async (id, updates) => {
  const data = {};

  const allowedFields = [
    'assignedTo', 'status', 'creditStatus',
    'adminNotes', 'assignedAt', 'convertedAt', 'rejectedAt',
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      data[field] = updates[field];
    }
  }

  return prisma.referral.update({ where: { id }, data });
};

/**
 * Add an entry to the referral status history
 */
const addStatusHistory = async (data) => {
  return prisma.referralStatusHistory.create({
    data: {
      referralId: data.referralId,
      status: data.status,
      changedBy: data.changedBy,
      changedByModel: data.changedByModel,
      note: data.note || '',
      changedAt: data.changedAt || new Date(),
    },
  });
};

/**
 * Find all referrals with filters, search, and pagination.
 * Includes submittedBy, assignedTo, and sector relations.
 */
const findAll = async ({ status, page = 1, limit = 10, search, assignedTo, submittedBy } = {}) => {
  const where = {};

  if (status) where.status = status;
  if (assignedTo) where.assignedTo = assignedTo;
  if (submittedBy) where.submittedBy = submittedBy;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { submitter: { name: { contains: search, mode: 'insensitive' } } },
      { submitter: { phone: { contains: search } } },
      { sector: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const offset = (page - 1) * limit;

  const [referrals, total] = await Promise.all([
    prisma.referral.findMany({
      where,
      include: POPULATED_INCLUDE,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.referral.count({ where }),
  ]);

  return {
    referrals: referrals.map(shapeForAPI),
    total,
    page,
    limit,
  };
};

/**
 * Find referrals for a business (leads) with optional sort by assigned_at
 */
const findBusinessLeads = async (businessId, { status, page = 1, limit = 10, search } = {}) => {
  const where = { assignedTo: businessId };

  if (status) where.status = status;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ];
  }

  const offset = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    prisma.referral.findMany({
      where,
      include: {
        submitter: { select: { id: true, name: true, email: true, phone: true } },
        sector: { select: { id: true, name: true } },
      },
      orderBy: { assignedAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.referral.count({ where }),
  ]);

  return {
    leads: leads.map((lead) => {
      const result = { ...lead };
      if (result.submitter) {
        result.submittedBy = result.submitter;
        delete result.submitter;
      }
      return result;
    }),
    total,
    page,
    limit,
  };
};

/**
 * Get lead counts / stats for a specific affiliate
 */
const getAffiliateStats = async (affiliateId) => {
  const [totalCount, convertedCount, pendingEscrowCount] = await Promise.all([
    prisma.referral.count({ where: { submittedBy: affiliateId } }),
    prisma.referral.count({ where: { submittedBy: affiliateId, status: 'converted' } }),
    prisma.referral.count({ where: { submittedBy: affiliateId, creditStatus: 'escrow' } }),
  ]);

  return {
    total: totalCount,
    converted: convertedCount,
    pendingTransactionsCount: pendingEscrowCount,
  };
};

module.exports = {
  findById,
  findByIdPopulated,
  create,
  updateById,
  addStatusHistory,
  findAll,
  findBusinessLeads,
  getAffiliateStats,
};

