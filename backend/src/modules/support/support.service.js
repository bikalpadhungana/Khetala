const { supportTicketRepo } = require("../../repositories");
const notificationRepo = require("../notification/notification.repository");
const ApiError = require("../../utils/ApiError");

/**
 * Create a new support ticket (affiliate)
 * Also creates an admin notification so superadmins see new tickets immediately.
 */
const createTicket = async ({ userId, category, subject, message }) => {
  if (!category || !message) {
    throw ApiError.badRequest("Category and message are required fields.");
  }

  const ticket = await supportTicketRepo.create({
    userId,
    category,
    subject,
    message,
    status: "open",
  });

  // ── Notify all admins (userId: null = global notification) ──
  try {
    await notificationRepo.createNotification({
      userId: null,
      title: "New Support Ticket",
      message: `A new ${category} support ticket has been submitted${subject ? `: "${subject}"` : ""}.`,
      type: "info",
      link: "/inquiries",
    });
  } catch (err) {
    // Non-critical — log but don't fail the ticket creation
    console.error("[SupportService] Failed to create admin notification:", err.message);
  }

  return ticket;
};

/**
 * Get tickets submitted by logged-in affiliate
 */
const getMyTickets = async (userId, { page = 1, limit = 50 } = {}) => {
  return await supportTicketRepo.findByUserId(userId, { page, limit });
};

/**
 * Get ticket details by ID (ensuring authorization for the affiliate)
 */
const getTicketById = async (id, userId, userRole) => {
  const ticket = await supportTicketRepo.findById(id);
  if (!ticket) throw ApiError.notFound("Support ticket not found.");

  // Check if owner or admin
  if (userRole !== "superadmin" && ticket.userId !== userId) {
    throw ApiError.forbidden("You are not authorized to view this support ticket.");
  }

  return ticket;
};

/**
 * Admin: Get all tickets from all users
 */
const getAllTicketsAdmin = async ({ status, category, page = 1, limit = 50 } = {}) => {
  return await supportTicketRepo.findAll({ status, category, page, limit });
};

/**
 * Admin: Update ticket status or add resolution notes.
 * Also notifies the affiliate user about the status change.
 */
const updateTicketAdmin = async (id, updates) => {
  const existing = await supportTicketRepo.findById(id);
  if (!existing) throw ApiError.notFound("Support ticket not found.");

  const updated = await supportTicketRepo.updateById(id, updates);

  // ── Notify the affiliate if status changed ──
  if (updates.status && updates.status !== existing.status) {
    try {
      const statusLabels = {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
      };
      const label = statusLabels[updates.status] || updates.status;

      await notificationRepo.createNotification({
        userId: existing.userId,
        title: "Support Ticket Updated",
        message: `Your support ticket has been updated to "${label}".${updates.adminNotes ? " The admin has added a note." : ""}`,
        type: updates.status === "resolved" ? "success" : "info",
        link: "/affiliate/support",
      });
    } catch (err) {
      console.error("[SupportService] Failed to create user notification:", err.message);
    }
  }

  return updated;
};

/**
 * Admin: Reply to a support ticket.
 * Appends the reply message to adminNotes with a timestamp,
 * auto-transitions status from 'open' to 'in_progress',
 * and notifies the affiliate user.
 */
const replyToTicket = async (id, replyMessage) => {
  if (!replyMessage || !replyMessage.trim()) {
    throw ApiError.badRequest("Reply message cannot be empty.");
  }

  const existing = await supportTicketRepo.findById(id);
  if (!existing) throw ApiError.notFound("Support ticket not found.");

  // Build the timestamped reply entry
  const timestamp = new Date().toISOString();
  const replyEntry = `[ADMIN_REPLY][${timestamp}] ${replyMessage.trim()}`;

  // Append to existing adminNotes
  const currentNotes = existing.adminNotes || "";
  const updatedNotes = currentNotes
    ? `${currentNotes}\n\n${replyEntry}`
    : replyEntry;

  // Auto-transition status from 'open' → 'in_progress'
  const updates = { adminNotes: updatedNotes };
  if (existing.status === "open") {
    updates.status = "in_progress";
  }

  const updated = await supportTicketRepo.updateById(id, updates);

  // ── Notify the affiliate about the reply ──
  try {
    await notificationRepo.createNotification({
      userId: existing.userId,
      title: "New Reply on Your Support Ticket",
      message: `An admin has replied to your support ticket${existing.subject ? ` "${existing.subject}"` : ""}.`,
      type: "info",
      link: "/affiliate/support",
    });
  } catch (err) {
    console.error("[SupportService] Failed to create reply notification:", err.message);
  }

  return updated;
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTicketsAdmin,
  updateTicketAdmin,
  replyToTicket,
};
