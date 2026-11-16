const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const supportController = require("./support.controller");
const { protect } = require("../../middleware/auth.middleware");
const { authorizeRoles } = require("../../middleware/role.middleware");
const { validate } = require("../../middleware/validate.middleware");

// --- Affiliate endpoints ---

router.post(
  "/tickets",
  protect,
  authorizeRoles("affiliate"),
  [
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required.")
      .isIn(["lead", "commission", "account", "bug", "other"])
      .withMessage("Invalid category."),
    body("subject").optional().trim().isLength({ max: 150 }).withMessage("Subject is too long."),
    body("message").trim().notEmpty().withMessage("Message is required."),
  ],
  validate,
  supportController.createTicket
);

router.get(
  "/tickets",
  protect,
  authorizeRoles("affiliate"),
  supportController.getMyTickets
);

router.get(
  "/tickets/:id",
  protect,
  authorizeRoles("affiliate", "superadmin"),
  supportController.getTicketById
);

// --- Admin endpoints ---

router.get(
  "/admin/support-tickets",
  protect,
  authorizeRoles("superadmin"),
  supportController.getAllTicketsAdmin
);

router.put(
  "/admin/support-tickets/:id",
  protect,
  authorizeRoles("superadmin"),
  [
    body("status")
      .optional()
      .isIn(["open", "in_progress", "resolved", "closed"])
      .withMessage("Status must be open, in_progress, resolved, or closed."),
    body("adminNotes").optional().trim(),
  ],
  validate,
  supportController.updateTicketAdmin
);

router.post(
  "/admin/support-tickets/:id/reply",
  protect,
  authorizeRoles("superadmin"),
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Reply message is required.")
      .isLength({ max: 2000 })
      .withMessage("Reply message must be under 2000 characters."),
  ],
  validate,
  supportController.replyToTicket
);

module.exports = router;
