const CREDIT_CONFIG = require("../config/credits.config");

/**
 * Calculate credits earned for a referral submission.
 *
 * Credits are awarded per field based on CREDIT_CONFIG.
 * Required fields always contribute their credits (enforced by validation).
 * Optional fields contribute only when provided and non-empty.
 *
 * @param {object} referralData - The referral fields submitted
 * @returns {number} Total credits earned
 */
const calculateReferralCredits = (referralData) => {
  let totalCredits = 0;

  for (const [field, config] of Object.entries(CREDIT_CONFIG.fields)) {
    const value = referralData[field];
    const hasValue = value !== undefined && value !== null && String(value).trim() !== "";

    if (hasValue) {
      totalCredits += config.credits;
    }
  }

  return totalCredits;
};

/**
 * Get the maximum possible credits for a referral
 * @returns {number}
 */
const getMaxCredits = () => CREDIT_CONFIG.maxCredits;

/**
 * Get credit breakdown for a referral (for transparency/display)
 * @param {object} referralData
 * @returns {object} Field-level credit breakdown
 */
const getCreditBreakdown = (referralData) => {
  const breakdown = {};

  for (const [field, config] of Object.entries(CREDIT_CONFIG.fields)) {
    const value = referralData[field];
    const hasValue = value !== undefined && value !== null && String(value).trim() !== "";
    breakdown[field] = {
      credits: hasValue ? config.credits : 0,
      maxCredits: config.credits,
      provided: hasValue,
      required: config.required,
    };
  }

  return breakdown;
};

module.exports = {
  calculateReferralCredits,
  getMaxCredits,
  getCreditBreakdown,
};
