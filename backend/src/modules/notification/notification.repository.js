const { prisma } = require("../../config/db");

class NotificationRepository {
  /**
   * Get notifications for a user, paginated.
   * If userId is provided, it gets global notifications (userId IS NULL) and user-specific ones.
   */
  async getNotifications(userId, limit = 20, offset = 0) {
    const where = userId 
      ? { OR: [{ userId }, { userId: null }] }
      : { userId: null };

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId) {
    const where = { isRead: false };
    if (userId) {
      where.OR = [{ userId }, { userId: null }];
    } else {
      where.userId = null;
    }

    return prisma.notification.count({ where });
  }

  /**
   * Create a new notification
   */
  async createNotification(notificationData) {
    return prisma.notification.create({
      data: notificationData,
    });
  }

  /**
   * Find by ID
   */
  async findById(id) {
    return prisma.notification.findUnique({ where: { id } });
  }

  /**
   * Mark as read
   */
  async markAsRead(id, userId) {
    // Note: To be safe, if userId check needs to be strictly enforced on the update itself,
    // we could add it to the where clause. The service layer handles this.
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Mark all as read for a user
   */
  async markAllAsRead(userId) {
    const where = { isRead: false };
    if (userId) {
      where.userId = userId;
    } else {
      where.userId = null;
    }

    return prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });
  }
}

module.exports = new NotificationRepository();
