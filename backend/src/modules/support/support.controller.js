const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const supportService = require("./support.service");

/** POST /api/support/tickets */
const createTicket = asyncHandler(async (req, res) => {
  const { category, subject, message } = req.body;
  const userId = req.user.id; // From protect middleware

  const data = await supportService.createTicket({
    userId,
    category,
    subject,
    message,
  });

  return ApiResponse.created(res, "Support ticket submitted successfully.", data);
});

/** GET /api/support/tickets */
const getMyTickets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  const { tickets, total } = await supportService.getMyTickets(userId, { page, limit });
  return ApiResponse.paginated(res, "Support tickets fetched successfully.", tickets, page, limit, total);
});

/** GET /api/support/tickets/:id */
const getTicketById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.role;
  const data = await supportService.getTicketById(req.params.id, userId, userRole);
  return ApiResponse.ok(res, "Support ticket fetched successfully.", data);
});

/** GET /api/support/admin/support-tickets */
const getAllTicketsAdmin = asyncHandler(async (req, res) => {
  const { status, category } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  const { tickets, total } = await supportService.getAllTicketsAdmin({
    status,
    category,
    page,
    limit,
  });

  return ApiResponse.paginated(res, "Support tickets fetched successfully.", tickets, page, limit, total);
});

/** PUT /api/support/admin/support-tickets/:id */
const updateTicketAdmin = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const data = await supportService.updateTicketAdmin(req.params.id, {
    status,
    adminNotes,
  });

  return ApiResponse.ok(res, "Support ticket updated successfully.", data);
});

/** POST /api/support/admin/support-tickets/:id/reply */
const replyToTicket = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const data = await supportService.replyToTicket(req.params.id, message);

  return ApiResponse.ok(res, "Reply sent successfully.", data);
});

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTicketsAdmin,
  updateTicketAdmin,
  replyToTicket,
};
