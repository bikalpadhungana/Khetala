const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const authService = require("./auth.service");

/**
 * POST /api/auth/register
 * Public — registers a new affiliate partner (status: pending)
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const data = await authService.registerAffiliate({ name, email, password, phone, address });
  return ApiResponse.created(
    res,
    "Registration successful. Your account is pending approval by the administrator.",
    data
  );
});

/**
 * POST /api/auth/login
 * Public — unified login for superadmin, affiliate, and business
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const data = await authService.login({ email, password, role });
  return ApiResponse.ok(res, "Login successful.", data);
});

/**
 * GET /api/auth/me
 * Protected — returns the authenticated user's profile
 */
const getMe = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req);
  return ApiResponse.ok(res, "Profile fetched successfully.", data);
});

/**
 * PUT /api/auth/me
 * Protected — updates the authenticated user's profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone, address } = req.body;
  const data = await authService.updateProfile(userId, { name, phone, address });
  return ApiResponse.ok(res, "Profile updated successfully.", data);
});

/**
 * POST /api/auth/forgot-password
 * Public — generates and sends an OTP for password reset
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.generatePasswordResetOtp({ email });
  // Always return success to prevent email enumeration
  return ApiResponse.ok(res, "If an account with that email exists, an OTP has been sent.");
});

/**
 * POST /api/auth/reset-password
 * Public — verifies OTP and resets the user's password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPasswordWithOtp({ email, otp, newPassword });
  return ApiResponse.ok(res, "Password has been successfully reset.");
});

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword };
