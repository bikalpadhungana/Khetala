const ApiError = require("../utils/ApiError");
const { NODE_ENV } = require("../config/env");

/**
 * Centralized error handling middleware.
 * Must be the LAST middleware registered in app.js.
 *
 * Handles:
 *  - ApiError (custom operational errors)
 *  - Prisma/MongoDB errors (unique constraints, invalid ObjectIDs, missing records)
 *  - JWT errors
 *  - Generic errors
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // ── Prisma (MongoDB) known request errors ───────────────────
  switch (err.code) {
    // Unique constraint violation
    case "P2002": {
      const target = err.meta?.target;
      const field = Array.isArray(target)
        ? target.join(", ")
        : (typeof target === "string" ? target.replace(/^.*_(\w+)_unique$/, "$1") : "field");
      error = ApiError.conflict(
        `Duplicate value for '${field}'. Please use a different value.`
      );
      break;
    }
    // Malformed ObjectID / inconsistent column data
    case "P2023":
      error = ApiError.badRequest("Invalid ID format provided.");
      break;
    // Related record missing / required relation violation
    case "P2003":
    case "P2014":
    case "P2018":
      error = ApiError.badRequest("Referenced record does not exist.");
      break;
    // Record to update/delete not found
    case "P2025":
      error = ApiError.notFound(err.meta?.cause || "Record not found.");
      break;
    // MongoDB transactions require a replica set
    case "P2031":
      error = ApiError.internal(
        "Database misconfiguration: MongoDB must run as a replica set (e.g. MongoDB Atlas)."
      );
      break;
    default:
      break;
  }

  // ── Prisma validation errors (bad query input) ──────────────
  if (err.name === "PrismaClientValidationError") {
    error = ApiError.badRequest(
      NODE_ENV === "development" ? err.message : "Invalid request data."
    );
  }

  // ── JWT errors ──────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token.");
  }
  if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token has expired.");
  }

  // ── Fallback to generic 500 ─────────────────────────────────
  if (!(error instanceof ApiError)) {
    error = ApiError.internal(
      NODE_ENV === "development" ? err.message : "Something went wrong."
    );
  }

  // Always log the error so we can debug the 500 issue
  console.error(`[ERROR] ${error.statusCode} — ${error.message}`);
  if (err.stack && !(error instanceof ApiError)) console.error(err.stack);

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors?.length > 0 ? error.errors : undefined,
    stack: err.stack,
  });
};

module.exports = { errorHandler };
