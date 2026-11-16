const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { NODE_ENV, CLIENT_URL, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = require("./config/env");
const routes = require("./routes/index");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
app.set('trust proxy', 1);
// security headers
app.use(helmet());

// cors
// cors
app.use(
  cors({
    origin: [
      "https://ttfreelancinghub.com",
      "https://www.ttfreelancinghub.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://admin.ttfreelancinghub.com"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
});
app.use("/api", limiter);

// auth specific stricter tate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// http logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// api routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
