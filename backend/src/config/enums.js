/**
 * Centralized Enum Constants
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all enum values used across:
 *   - Knex migrations (CHECK constraints)
 *   - Validators (express-validator .isIn())
 *   - Services (business logic)
 *
 * NEVER hardcode enum strings elsewhere — import from here.
 */

const ENUMS = {
  USER_ROLE: ['superadmin', 'affiliate'],
  USER_STATUS: ['pending', 'approved', 'rejected'],
  REFERRAL_STATUS: ['pending', 'assigned', 'contacted', 'converted', 'rejected'],
  CREDIT_STATUS: ['escrow', 'released', 'cancelled'],
  TRANSACTION_TYPE: ['escrow', 'release', 'cancel'],
  CHANGED_BY_MODEL: ['User', 'Business'],
  LOGIN_ROLE: ['superadmin', 'affiliate', 'business'],
  NOTIFICATION_TYPE: ['info', 'success', 'warning', 'error'],
};

/**
 * Valid referral status transitions (admin perspective)
 */
const REFERRAL_TRANSITIONS = {
  pending: ['assigned', 'rejected'],
  assigned: ['contacted', 'rejected'],
  contacted: ['converted', 'rejected'],
  converted: [],
  rejected: [],
};

/**
 * Valid lead status transitions (business perspective)
 */
const BUSINESS_LEAD_TRANSITIONS = {
  assigned: ['contacted'],
  contacted: ['converted', 'rejected'],
  converted: [],
  rejected: [],
  pending: [],
};

module.exports = { ENUMS, REFERRAL_TRANSITIONS, BUSINESS_LEAD_TRANSITIONS };
