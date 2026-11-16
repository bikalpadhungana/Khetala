const ApiError = require("../utils/ApiError");

/**
 * authorizeRoles — Role-based access control middleware
 *
 * Usage:
 *   router.get("/admin-only", protect, authorizeRoles("superadmin"), handler)
 *   router.get("/multi",      protect, authorizeRoles("superadmin", "affiliate"), handler)
 *
 * @param {...string} roles - Allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.role}' is not authorized to access this resource.`
        )
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
