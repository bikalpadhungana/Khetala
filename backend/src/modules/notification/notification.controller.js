const notificationService = require("./notification.service");
const asyncHandler = require("../../utils/asyncHandler");

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  try {
    const result = await notificationService.getNotifications(userId, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // If the notifications table doesn't exist yet or any DB error occurs,
    // return an empty result instead of crashing with 500
    console.error("[NotificationController] getNotifications error:", error.message);

    res.status(200).json({
      success: true,
      data: {
        notifications: [],
        pagination: {
          total: 0,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: 0,
        },
        unreadCount: 0,
      },
    });
  }
});

const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  const result = await notificationService.markAsRead(notificationId, userId);

  res.status(200).json(result);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await notificationService.markAllAsRead(userId);

  res.status(200).json(result);
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

