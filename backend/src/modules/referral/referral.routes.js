const express = require("express");
const router = express.Router();
const { param } = require("express-validator");

const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const { referralRepo } = require("../../repositories");
const { validate } = require("../../middleware/validate.middleware");
const { protect } = require("../../middleware/auth.middleware");

const mongoId = [param("id").isMongoId().withMessage("Invalid Referral ID format.")];

/**
 * @route   GET /api/referrals/:id
 * @desc    Get a single referral by ID
 *          - Superadmin: any referral
 *          - Affiliate: only their own
 *          - Business: only assigned to them
 * @access  All authenticated roles
 */
router.get(
  "/:id",
  protect,
  mongoId,
  validate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const role = req.role;

    let referral;

    if (role === "superadmin") {
      referral = await referralRepo.findByIdPopulated(id);
    } else if (role === "affiliate") {
      referral = await referralRepo.findByIdPopulated(id, { ownerFilter: { submitted_by: req.user.id } });
    } else if (role === "business") {
      referral = await referralRepo.findByIdPopulated(id, { ownerFilter: { assigned_to: req.user.id } });
    }

    if (!referral) throw ApiError.notFound("Referral not found.");
    return ApiResponse.ok(res, "Referral fetched successfully.", referral);
  })
);

module.exports = router;
