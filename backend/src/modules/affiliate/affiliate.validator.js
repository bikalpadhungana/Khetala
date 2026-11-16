const { body, param } = require("express-validator");

const submitReferralValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Lead name is required")
    .isLength({ max: 100 }).withMessage("Name must not exceed 100 characters"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage("Please provide a valid phone number"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ max: 1000 }).withMessage("Description must not exceed 1000 characters"),

  body("sector")
    .notEmpty().withMessage("Sector is required")
    .isString().withMessage("Invalid sector ID"),

  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("address")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage("Address must not exceed 200 characters"),
];

const referralIdValidator = [
  param("id").isMongoId().withMessage("Invalid Referral ID format."),
];

module.exports = { submitReferralValidator, referralIdValidator };
