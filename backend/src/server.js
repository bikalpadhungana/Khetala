const app = require("./app");
const { connectDB, closeDB } = require("./config/db");
const { PORT, NODE_ENV } = require("./config/env");

const startServer = async () => {
  try {
    // 1. START THE HTTP SERVER FIRST
    // This ensures cPanel registers the app as online and stops showing the 503 error page.
    const server = app.listen(PORT, () => {
      console.log("─────────────────────────────────────────────");
      console.log(`[INFO] Server running in ${NODE_ENV} mode`);
      console.log(`[INFO] Listening on target: ${PORT}`);
      console.log(`[INFO] API base: /api`);
      console.log("─────────────────────────────────────────────");
    });

    // 2. ATTEMPT DATABASE CONNECTION ASYNCHRONOUSLY
    // If it fails, log the error but DO NOT call process.exit(1) so the server stays alive.
    connectDB()
      .then(() => {
        console.log("[INFO] MongoDB connected successfully.");
      })
      .catch((err) => {
        console.error("[ERROR] Database connection failed on startup:", err.message);
        console.warn("[WARN] Server is running in degraded mode without database access.");
      });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log("[INFO] HTTP server closed.");
        try {
          await closeDB();
        } catch (dbErr) {
          console.error("[ERROR] Error closing database:", dbErr.message);
        }
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        console.error("[WARN] Forced shutdown after timeout.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Handle unexpected rejections without instantly killing the process
    process.on("unhandledRejection", (reason, promise) => {
      console.error("[ERROR] Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("[ERROR] Uncaught Exception:", err.message);
    });

  } catch (error) {
    // Catches errors during the initial app.listen setup
    console.error("[ERROR] Failed to initialize server listener:", error.message);
  }
};

startServer();