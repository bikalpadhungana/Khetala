/**
 * Seed Superadmin (Prisma)
 * Run: node src/scripts/seedSuperadmin.js
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { prisma, closeDB } = require("../config/db");
const { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, SUPERADMIN_NAME } = require("../config/env");

const seedSuperadmin = async () => {
  try {
    if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.error("[WARN] SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be defined in .env");
      process.exit(1);
    }

    console.log("[INFO] Seeding superadmin to MongoDB via Prisma...");

    const existingAdmin = await prisma.user.findFirst({
      where: { email: { equals: SUPERADMIN_EMAIL, mode: "insensitive" } },
    });

    if (existingAdmin) {
      console.log("[INFO] Superadmin already exists. Skipping.");
    } else {
      const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 12);

      await prisma.user.create({
        data: {
          name: SUPERADMIN_NAME || "Super Admin",
          email: SUPERADMIN_EMAIL,
          password: hashedPassword,
          role: "superadmin",
          status: "approved",
          availableCredits: 0,
          escrowCredits: 0,
        },
      });

      console.log(`[SUCCESS] Superadmin created: ${SUPERADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error("[ERROR] Failed to seed superadmin:", error);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

seedSuperadmin();
