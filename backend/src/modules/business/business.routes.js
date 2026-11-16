const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");

const { getMyLeads, getLeadById, updateLeadStatus } = require("./business.controller");
const { validate } = require("../../middleware/validate.middleware");
const { protect } = require("../../middleware/auth.middleware");
const { authorizeRoles } = require("../../middleware/role.middleware");

const businessOnly = [protect, authorizeRoles("business")];

const leadStatusValidator = [
  param("id").isMongoId().withMessage("Invalid Lead ID format."),
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["contacted", "converted", "rejected"])
    .withMessage("Status must be one of: contacted, converted, rejected"),
  body("note").optional().trim().isLength({ max: 500 }),
];

/**
 * @route   GET /api/business/leads
 * @desc    Get all leads assigned to this business
 * @access  Business
 */
router.get("/leads", businessOnly, getMyLeads);

/**
 * @route   GET /api/business/leads/:id
 * @desc    Get a single assigned lead by ID
 * @access  Business
 */
router.get("/leads/:id", businessOnly, param("id").isMongoId().withMessage("Invalid lead ID"), validate, getLeadById);

/**
 * @route   PATCH /api/business/leads/:id/status
 * @desc    Update lead progress status
 * @access  Business
 */
router.patch("/leads/:id/status", businessOnly, leadStatusValidator, validate, updateLeadStatus);

module.exports = router;
