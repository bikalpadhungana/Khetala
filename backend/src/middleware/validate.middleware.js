const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

/**
 * validate — Runs accumulated express-validator checks and returns 400 on failure.
 *
 * Usage:
 *   router.post("/register", [...validatorRules], validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return next(ApiError.badRequest("Validation failed", formattedErrors));
  }

  next();
};

module.exports = { validate };
