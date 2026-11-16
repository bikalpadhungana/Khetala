const { userRepo, businessRepo } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const { generateToken } = require("../../utils/jwt.utils");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendMail } = require("../../utils/mailer");

/**
 * Register a new affiliate partner.
 * Status defaults to 'pending' — superadmin must approve before login is allowed.
 */
const registerAffiliate = async ({ name, email, password, phone, address }) => {
  // Check for existing user or business with same email
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) throw ApiError.conflict("An account with this email already exists.");

  const existingBusiness = await businessRepo.findByEmail(email);
  if (existingBusiness) throw ApiError.conflict("An account with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, 12); // BCRYPT_SALT_ROUNDS=12

  const user = await userRepo.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    role: "affiliate",
    status: "pending",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
};

/**
 * Unified login — works for superadmin, affiliate, and business.
 * Role is determined by the 'role' field in request body (optional hint).
 * Affiliates must be 'approved' to receive a token.
 */
const login = async ({ email, password, role }) => {
  let actor = null;
  let actorRole = null;

  // Try business login first if role hint is 'business'
  if (role === "business") {
    actor = await businessRepo.findByEmail(email, { includePassword: true });
    if (actor) actorRole = "business";
  } else {
    // Try User (superadmin or affiliate)
    actor = await userRepo.findByEmail(email, { includePassword: true });
    if (actor) actorRole = actor.role;
  }

  // Fallback: if no role hint, try both
  if (!actor && role !== "business") {
    actor = await businessRepo.findByEmail(email, { includePassword: true });
    if (actor) actorRole = "business";
  }

  if (!actor) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, actor.password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password.");

  // Business: check active status
  if (actorRole === "business") {
    if (!actor.isActive) {
      throw ApiError.forbidden("Your business account has been deactivated. Contact support.");
    }

    // Update last login
    await businessRepo.updateById(actor.id, { lastLoginAt: new Date() });

    const token = generateToken({ id: actor.id, role: "business" });
    return {
      token,
      user: {
        id: actor.id,
        name: actor.name,
        email: actor.email,
        role: "business",
      },
    };
  }

  // User (superadmin / affiliate)
  if (actorRole === "affiliate") {
    if (actor.status === "pending") {
      throw ApiError.forbidden("Your account is pending approval by the administrator.");
    }
    if (actor.status === "rejected") {
      throw ApiError.forbidden("Your account has been rejected. Please contact support.");
    }
  }

  // Update last login
  await userRepo.updateById(actor.id, { lastLoginAt: new Date() });

  const token = generateToken({ id: actor.id, role: actorRole });

  return {
    token,
    user: {
      id: actor.id,
      name: actor.name,
      email: actor.email,
      role: actorRole,
      status: actor.status,
      availableCredits: actor.availableCredits,
      escrowCredits: actor.escrowCredits,
      phone: actor.phone,
      address: actor.address,
    },
  };
};

/**
 * Get currently authenticated user profile.
 */
const getMe = async (req) => {
  // req.user is already populated by auth middleware
  return req.user;
};

/**
 * Update authenticated user's profile.
 */
const updateProfile = async (userId, { name, phone, address }) => {
  if (!name) throw ApiError.badRequest("Name is required.");

  return await userRepo.updateById(userId, {
    name,
    phone,
    address,
  });
};

/**
 * Generate OTP for password reset
 */
const generatePasswordResetOtp = async ({ email }) => {
  let isBusiness = false;
  let actor = await userRepo.findByEmail(email);
  
  if (!actor) {
    actor = await businessRepo.findByEmail(email);
    if (actor) isBusiness = true;
  }

  if (!actor) {
    // Return success to prevent email enumeration
    return { success: true };
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 12);
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  if (isBusiness) {
    await businessRepo.updateById(actor.id, { resetOtp: hashedOtp, resetOtpExpiry: expiry });
  } else {
    await userRepo.updateById(actor.id, { resetOtp: hashedOtp, resetOtpExpiry: expiry });
  }

  await sendMail({
    to: email,
    subject: "Think Tank - Password Reset OTP",
    text: `Your password reset OTP is: ${otp}. It is valid for 15 minutes.`,
    html: `
      <h2>Password Reset Request</h2>
      <p>Your One-Time Password (OTP) to reset your password is:</p>
      <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">${otp}</h3>
      <p>This code will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });

  return { success: true };
};

/**
 * Verify OTP and reset password
 */
const resetPasswordWithOtp = async ({ email, otp, newPassword }) => {
  let isBusiness = false;
  let actor = await userRepo.findByEmail(email, { includePassword: true });
  
  if (!actor) {
    actor = await businessRepo.findByEmail(email, { includePassword: true });
    if (actor) isBusiness = true;
  }

  if (!actor) {
    throw ApiError.badRequest("Invalid or expired OTP.");
  }

  if (!actor.resetOtp || !actor.resetOtpExpiry || actor.resetOtpExpiry < new Date()) {
    throw ApiError.badRequest("Invalid or expired OTP.");
  }

  const isMatch = await bcrypt.compare(otp, actor.resetOtp);
  if (!isMatch) {
    throw ApiError.badRequest("Invalid or expired OTP.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  if (isBusiness) {
    await businessRepo.updateById(actor.id, { 
      password: hashedPassword, 
      resetOtp: null, 
      resetOtpExpiry: null 
    });
  } else {
    await userRepo.updateById(actor.id, { 
      password: hashedPassword, 
      resetOtp: null, 
      resetOtpExpiry: null 
    });
  }

  return { success: true };
};

module.exports = { registerAffiliate, login, getMe, updateProfile, generatePasswordResetOtp, resetPasswordWithOtp };
