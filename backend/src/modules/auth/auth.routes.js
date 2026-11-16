const express = require("express");
const router = express.Router();

const { register, login, getMe, updateProfile, forgotPassword, resetPassword } = require("./auth.controller");
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require("./auth.validator");
const { validate } = require("../../middleware/validate.middleware");
const { protect } = require("../../middleware/auth.middleware");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new affiliate partner
 * @access  Public
 */
router.post("/register", registerValidator, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login — superadmin / affiliate / business
 * @access  Public
 */
router.post("/login", loginValidator, validate, login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate OTP for password reset
 * @access  Public
 */
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Verify OTP and reset password
 * @access  Public
 */
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user profile
 * @access  Protected (all roles)
 */
router.get("/me", protect, getMe);

/**
 * @route   PUT /api/auth/me
 * @desc    Update authenticated user profile
 * @access  Protected (all roles)
 */
router.put("/me", protect, updateProfile);

module.exports = router;
