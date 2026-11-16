const { PrismaClient } = require('../generated-client')
const { NODE_ENV } = require("./env");

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const connectDB = async () => {
  try {
    await prisma.$connect();

    // MongoDB has no SQL — ping the server to verify the connection.
    await prisma.$runCommandRaw({ ping: 1 });

    console.log(`[INFO] MongoDB connected via Prisma: ${new Date().toISOString()}`);
    return prisma;
  } catch (error) {
    console.error(`[ERROR] MongoDB connection error: ${error.message}`);
    throw error; // ← was process.exit(1). Let server.js handle it.
  }
};

const closeDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("[INFO] Prisma connection closed.");
  } catch (error) {
    console.error(`[ERROR] Error closing database: ${error.message}`);
  }
};

module.exports = { prisma, connectDB, closeDB };