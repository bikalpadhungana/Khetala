const notificationRepo = require("./notification.repository");
const ApiError = require("../../utils/ApiError");

class NotificationService {
  async getNotifications(userId, page = 1, limit = 20) {
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 20;
    const offset = (parsedPage - 1) * parsedLimit;
    const { data, total } = await notificationRepo.getNotifications(userId, parsedLimit, offset);
    const unreadCount = await notificationRepo.getUnreadCount(userId);

    return {
      notifications: data,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
      unreadCount,
    };
  }

  async markAsRead(id, userId) {
    const notification = await notificationRepo.findById(id);
    if (!notification) {
      throw ApiError.notFound("Notification not found.");
    }
    
    // Simplistic check: If it belongs to someone else, forbid
    if (notification.user_id && notification.user_id !== userId) {
      throw ApiError.forbidden("You do not have permission to modify this notification.");
    }

    await notificationRepo.markAsRead(id, userId);
    return { success: true, message: "Notification marked as read." };
  }

  async markAllAsRead(userId) {
    await notificationRepo.markAllAsRead(userId);
    return { success: true, message: "All notifications marked as read." };
  }
}

module.exports = new NotificationService();
