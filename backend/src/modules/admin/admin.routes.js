const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");

const {
  getAffiliates,
  approveAffiliate,
  rejectAffiliate,
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getAllReferrals,
  updateReferralStatus,
  assignReferral,
  getAffiliateById,
  updateAffiliate,
  deleteAffiliate,
} = require("./admin.controller");

const { validate } = require("../../middleware/validate.middleware");
const { protect } = require("../../middleware/auth.middleware");
const { authorizeRoles } = require("../../middleware/role.middleware");

// All admin routes require superadmin role
const adminOnly = [protect, authorizeRoles("superadmin")];

const mongoId = (field = "id") => [
  param(field).isMongoId().withMessage(`Invalid ${field} format`),
];

// ─────────────────────────────────────────────────────────────
// AFFILIATE MANAGEMENT
// ─────────────────────────────────────────────────────────────

/** GET /api/admin/affiliates?status=pending&page=1&limit=10&search= */
router.get("/affiliates", adminOnly, getAffiliates);

/** PATCH /api/admin/affiliates/:id/approve */
router.patch(
  "/affiliates/:id/approve",
  adminOnly,
  mongoId(),
  validate,
  approveAffiliate
);

/** PATCH /api/admin/affiliates/:id/reject */
router.patch(
  "/affiliates/:id/reject",
  adminOnly,
  mongoId(),
  validate,
  rejectAffiliate
);

/** GET /api/admin/affiliates/:id */
router.get(
  "/affiliates/:id",
  adminOnly,
  mongoId(),
  validate,
  getAffiliateById
);

const affiliateUpdateValidator = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("phone").optional().trim(),
  body("address").optional().trim(),
  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Invalid status value"),
  body("availableCredits").optional().isInt({ min: 0 }).withMessage("Available credits must be a positive integer"),
  body("escrowCredits").optional().isInt({ min: 0 }).withMessage("Escrow credits must be a positive integer"),
];

/** PUT /api/admin/affiliates/:id */
router.put(
  "/affiliates/:id",
  adminOnly,
  mongoId(),
  affiliateUpdateValidator,
  validate,
  updateAffiliate
);

/** DELETE /api/admin/affiliates/:id */
router.delete(
  "/affiliates/:id",
  adminOnly,
  mongoId(),
  validate,
  deleteAffiliate
);


// ─────────────────────────────────────────────────────────────
// BUSINESS MANAGEMENT
// ─────────────────────────────────────────────────────────────

const businessCreateValidator = [
  body("name").trim().notEmpty().withMessage("Business name is required"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("phone").optional().trim(),
  body("address").optional().trim(),
  body("sector").optional().isMongoId().withMessage("Invalid sector ID"),
  body("contactPerson.name").optional().trim(),
  body("contactPerson.phone").optional().trim(),
  body("contactPerson.email").optional().isEmail().withMessage("Invalid contact person email"),
  body("contactPerson.designation").optional().trim(),
  body("subService").optional().trim(),
  body("website").optional().trim().isURL().withMessage("Invalid website URL"),
  body("description").optional().trim().isLength({ max: 500 }),
];

const businessUpdateValidator = [
  body("name").optional().trim().isLength({ min: 2 }),
  body("email").optional().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("phone").optional().trim(),
  body("address").optional().trim(),
  body("sector").optional().isMongoId().withMessage("Invalid sector ID"),
  body("isActive").optional().isBoolean(),
  body("contactPerson.name").optional().trim(),
  body("contactPerson.phone").optional().trim(),
  body("contactPerson.email").optional().isEmail().withMessage("Invalid contact person email"),
  body("contactPerson.designation").optional().trim(),
  body("subService").optional().trim(),
];

/** POST /api/admin/businesses */
router.post("/businesses", adminOnly, businessCreateValidator, validate, createBusiness);

/** GET /api/admin/businesses */
router.get("/businesses", adminOnly, getBusinesses);

/** GET /api/admin/businesses/:id */
router.get("/businesses/:id", adminOnly, mongoId(), validate, getBusinessById);

/** PUT /api/admin/businesses/:id */
router.put("/businesses/:id", adminOnly, mongoId(), businessUpdateValidator, validate, updateBusiness);

/** DELETE /api/admin/businesses/:id */
router.delete("/businesses/:id", adminOnly, mongoId(), validate, deleteBusiness);

// ─────────────────────────────────────────────────────────────
// REFERRAL MANAGEMENT
// ─────────────────────────────────────────────────────────────

const referralStatusValidator = [
  param("id").isMongoId().withMessage("Invalid referral ID"),
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["assigned", "contacted", "converted", "rejected"])
    .withMessage("Invalid status value"),
  body("note").optional().trim().isLength({ max: 500 }),
];

const referralAssignValidator = [
  param("id").isMongoId().withMessage("Invalid referral ID"),
  body("businessId")
    .notEmpty().withMessage("businessId is required")
    .isMongoId().withMessage("Invalid business ID"),
  body("note").optional().trim().isLength({ max: 500 }),
];

/** GET /api/admin/referrals */
router.get("/referrals", adminOnly, getAllReferrals);

/** PATCH /api/admin/referrals/:id/status */
router.patch("/referrals/:id/status", adminOnly, referralStatusValidator, validate, updateReferralStatus);

/** PATCH /api/admin/referrals/:id/assign */
router.patch("/referrals/:id/assign", adminOnly, referralAssignValidator, validate, assignReferral);

module.exports = router;
