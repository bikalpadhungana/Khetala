/**
 * Credit Configuration
 * ─────────────────────────────────────────────────────────────
 * Each referral field has a configurable credit value.
 * Change values here to adjust the credit calculation globally.
 * Max possible credits = sum of all field credits.
 */

const CREDIT_CONFIG = {
  fields: {
    name: { credits: 10, required: true },
    phone: { credits: 15, required: true },
    description: { credits: 10, required: true },
    sector: { credits: 5, required: true },
    email: { credits: 5, required: false },
    address: { credits: 5, required: false },
  },

  // Computed max — keeps it in sync with fields automatically
  get maxCredits() {
    return Object.values(this.fields).reduce((sum, f) => sum + f.credits, 0);
  },
};

module.exports = CREDIT_CONFIG;
