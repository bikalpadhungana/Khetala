const express = require("express");
const router = express.Router();

const { submitReferral, getMyReferrals, getCreditSummary, getReferralDetail } = require("./affiliate.controller");
const { submitReferralValidator, referralIdValidator } = require("./affiliate.validator");
const { validate } = require("../../middleware/validate.middleware");
const { protect } = require("../../middleware/auth.middleware");
const { authorizeRoles } = require("../../middleware/role.middleware");

// All affiliate routes: must be authenticated + approved affiliate
const affiliateOnly = [protect, authorizeRoles("affiliate")];

/**
 * @route   POST /api/affiliate/referrals
 * @desc    Submit a new referral lead
 * @access  Affiliate (approved)
 */
router.post("/referrals", affiliateOnly, submitReferralValidator, validate, submitReferral);

/**
 * @route   GET /api/affiliate/referrals
 * @desc    Get all referrals submitted by this affiliate
 * @access  Affiliate (approved)
 */
router.get("/referrals", affiliateOnly, getMyReferrals);

/**
 * @route   GET /api/affiliate/referrals/:id
 * @desc    Get a specific referral details
 * @access  Affiliate (approved)
 */
router.get("/referrals/:id", affiliateOnly, referralIdValidator, validate, getReferralDetail);

/**
 * @route   GET /api/affiliate/credits
 * @desc    Get credit wallet summary and recent transactions
 * @access  Affiliate (approved)
 */
router.get("/credits", affiliateOnly, getCreditSummary);

module.exports = router;
