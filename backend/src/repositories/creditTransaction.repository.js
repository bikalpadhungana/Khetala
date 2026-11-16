/**
 * Credit Transaction Repository (Prisma)
 * ─────────────────────────────────────────────────────────────
 * All database operations for the credit_transactions table.
 */

const { prisma } = require('../config/db');

/**
 * Create a new credit transaction
 */
const create = async (data) => {
  return prisma.creditTransaction.create({
    data: {
      userId: data.userId || data.user,
      referralId: data.referralId || data.referral,
      type: data.type,
      amount: data.amount,
      description: data.description || null,
      balanceAfterAvailable: data.balanceAfter?.availableCredits ?? null,
      balanceAfterEscrow: data.balanceAfter?.escrowCredits ?? null,
    },
  });
};

/**
 * Find credit transactions for a user with referral join.
 * Sorted by most recent first.
 */
const findByUser = async (userId, { limit = 20 } = {}) => {
  const transactions = await prisma.creditTransaction.findMany({
    where: { userId },
    include: {
      referral: { select: { id: true, name: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return transactions.map((tx) => {
    const result = { ...tx };
    
    // Nest balanceAfter
    result.balanceAfter = {
      availableCredits: result.balanceAfterAvailable,
      escrowCredits: result.balanceAfterEscrow,
    };
    delete result.balanceAfterAvailable;
    delete result.balanceAfterEscrow;

    return result;
  });
};

module.exports = { create, findByUser };
