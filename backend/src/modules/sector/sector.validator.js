const { body, param } = require("express-validator");

const createSectorValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Sector name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Sector name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Description must not exceed 300 characters"),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),
];

const updateSectorValidator = [
  param("id")
    .isMongoId().withMessage("Invalid sector ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Sector name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Description must not exceed 300 characters"),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),
];

const mongoIdValidator = [
  param("id").isMongoId().withMessage("Invalid Sector ID format."),
];

module.exports = { createSectorValidator, updateSectorValidator, mongoIdValidator };
