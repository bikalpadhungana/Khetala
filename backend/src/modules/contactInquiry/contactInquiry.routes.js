const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const contactInquiryController = require("./contactInquiry.controller");
const { protect } = require("../../middleware/auth.middleware");
const { authorizeRoles } = require("../../middleware/role.middleware");
const { validate } = require("../../middleware/validate.middleware");

// Public routes
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").trim().isEmail().withMessage("Valid email address is required."),
    body("phone").trim().notEmpty().withMessage("Phone number is required."),
    body("inquiryType").trim().notEmpty().withMessage("Inquiry type is required."),
    body("message").trim().notEmpty().withMessage("Message is required."),
  ],
  validate,
  contactInquiryController.createInquiry
);

// Admin-only protected routes
router.get(
  "/admin/contact-inquiries",
  protect,
  authorizeRoles("superadmin"),
  contactInquiryController.getAllInquiries
);

router.get(
  "/admin/contact-inquiries/:id",
  protect,
  authorizeRoles("superadmin"),
  contactInquiryController.getInquiryById
);

router.put(
  "/admin/contact-inquiries/:id",
  protect,
  authorizeRoles("superadmin"),
  [
    body("status")
      .optional()
      .isIn(["pending", "reviewed", "ignored"])
      .withMessage("Status must be pending, reviewed, or ignored."),
    body("adminNotes").optional().trim(),
  ],
  validate,
  contactInquiryController.updateInquiry
);

module.exports = router;
