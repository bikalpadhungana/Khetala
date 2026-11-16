const express = require("express");
const router = express.Router();

const authRoutes      = require("../modules/auth/auth.routes");
const adminRoutes     = require("../modules/admin/admin.routes");
const affiliateRoutes = require("../modules/affiliate/affiliate.routes");
const businessRoutes  = require("../modules/business/business.routes");
const referralRoutes  = require("../modules/referral/referral.routes");
const sectorRoutes    = require("../modules/sector/sector.routes");
const notificationRoutes = require("../modules/notification/notification.routes");
const contactInquiryRoutes = require("../modules/contactInquiry/contactInquiry.routes");
const supportRoutes = require("../modules/support/support.routes");
const careerRoutes = require("../modules/career/career.routes");

// ── Health check ──────────────────────────────────────────────
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Affiliate Referral Platform API is running.",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── Module routes ─────────────────────────────────────────────
router.use("/auth",      authRoutes);
router.use("/admin",     adminRoutes);
router.use("/affiliate", affiliateRoutes);
router.use("/business",  businessRoutes);
router.use("/referrals", referralRoutes);
router.use("/notifications", notificationRoutes);
router.use("/contact",   contactInquiryRoutes);
router.use("/support",   supportRoutes);

// Sectors also accessible under /sectors (public dropdown)
router.use("/sectors",   sectorRoutes);
router.use("/career",    careerRoutes);

module.exports = router;
