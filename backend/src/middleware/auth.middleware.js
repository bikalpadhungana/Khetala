const { verifyToken } = require("../utils/jwt.utils");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { userRepo, businessRepo } = require("../repositories");

/**
 * protect — Verifies JWT token and attaches user to req.user
 *
 * Supports tokens from both User and Business models.
 * Token payload: { id, role }
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw ApiError.unauthorized("Access denied. No token provided.");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Token expired. Please log in again.");
    }
    throw ApiError.unauthorized("Invalid token.");
  }

  // Resolve actor based on role
  let currentUser;

  if (decoded.role === "business") {
    currentUser = await businessRepo.findById(decoded.id);
    if (!currentUser) throw ApiError.unauthorized("Business account not found.");
    if (!currentUser.isActive) throw ApiError.forbidden("Business account is deactivated.");
  } else {
    currentUser = await userRepo.findById(decoded.id);
    if (!currentUser) throw ApiError.unauthorized("User account not found.");

    // Affiliate must be approved to access protected routes
    if (currentUser.role === "affiliate" && currentUser.status !== "approved") {
      throw ApiError.forbidden(
        currentUser.status === "pending"
          ? "Your account is pending approval."
          : "Your account has been rejected."
      );
    }
  }

  req.user = currentUser;
  req.role = decoded.role;
  next();
});

module.exports = { protect };
