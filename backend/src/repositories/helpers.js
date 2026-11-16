/**
 * Repository Helpers (Prisma)
 * ─────────────────────────────────────────────────────────────
 * Prisma handles snake_case ↔ camelCase via @map() in schema.
 * These select objects define which fields to return (excluding password).
 */

/**
 * Default user select (excludes password).
 */
const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  availableCredits: true,
  escrowCredits: true,
  address: true,
  rejectionReason: true,
  approvedAt: true,
  approvedBy: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * User select WITH password (for auth).
 */
const USER_SELECT_WITH_PASSWORD = {
  ...USER_SELECT,
  password: true,
  resetOtp: true,
  resetOtpExpiry: true,
};

/**
 * Default business select (excludes password).
 */
const BUSINESS_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  sectorId: true,
  contactPersonName: true,
  contactPersonPhone: true,
  contactPersonEmail: true,
  contactPersonDesignation: true,
  subService: true,
  website: true,
  description: true,
  isActive: true,
  createdBy: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Business select WITH password (for auth).
 */
const BUSINESS_SELECT_WITH_PASSWORD = {
  ...BUSINESS_SELECT,
  password: true,
  resetOtp: true,
  resetOtpExpiry: true,
};

module.exports = {
  USER_SELECT,
  USER_SELECT_WITH_PASSWORD,
  BUSINESS_SELECT,
  BUSINESS_SELECT_WITH_PASSWORD,
};
