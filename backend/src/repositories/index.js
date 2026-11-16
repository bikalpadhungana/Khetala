/**
 * Repository Index
 * ─────────────────────────────────────────────────────────────
 * Re-exports all repositories for clean imports.
 *
 * Usage:
 *   const { userRepo, businessRepo } = require('../repositories');
 */

const userRepo = require('./user.repository');
const businessRepo = require('./business.repository');
const sectorRepo = require('./sector.repository');
const referralRepo = require('./referral.repository');
const creditTransactionRepo = require('./creditTransaction.repository');
const contactInquiryRepo = require('./contactInquiry.repository');
const supportTicketRepo = require('./supportTicket.repository');

module.exports = {
  userRepo,
  businessRepo,
  sectorRepo,
  referralRepo,
  creditTransactionRepo,
  contactInquiryRepo,
  supportTicketRepo,
};
