# Think Tank Backend - Codebase Guidelines

This document provides a comprehensive overview of the Think Tank Backend (`affiliate-referral-platform`) architecture, technology stack, file structure, and development workflow. It serves as a reference for current and future development.

## 1. Technology Stack
- **Runtime:** Node.js (>= 18.0.0)
- **Framework:** Express.js
- **Database:** MongoDB (via Prisma ORM — run `npm run prisma:push` to sync indexes after schema changes)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing
- **Security Middlewares:** Helmet, CORS, Express Rate Limit
- **Validation:** express-validator
- **Logging:** Morgan

## 2. Architecture & Workflow

The application follows a **Modular (Feature-Based) Architecture** incorporating the **Controller-Service-Route** pattern. This separation of concerns ensures scalability and maintainability.

### Request Lifecycle
1. **Entry Point (`src/server.js`):** Connects to the database and starts the Express server. It also handles graceful shutdowns.
2. **App Configuration (`src/app.js`):** Sets up global middlewares (Helmet, CORS, Rate Limiting, body parsing, Morgan logging) and mounts API routes under `/api`.
3. **Routing (`src/routes/index.js`):** Acts as the central router, mapping base paths (e.g., `/api/auth`, `/api/admin`) to their respective feature module routes.
4. **Feature Modules (`src/modules/`):**
   - **Validator (`*.validator.js`):** Uses `express-validator` to validate incoming request payloads before they reach the controller.
   - **Route (`*.routes.js`):** Maps HTTP methods and endpoints to specific controller functions, applying middlewares (like auth and validation) along the way.
   - **Controller (`*.controller.js`):** Extracts data from the request (`req.body`, `req.params`), calls the appropriate Service function, and sends the HTTP response. Keeps logic minimal.
   - **Service (`*.service.js`):** Contains the core business logic. It interacts with the database (Models) and processes data.
5. **Data Access (`src/models/` or `prisma/`):** Centralized directory for Prisma schema.

## 3. File Structure

```text
backend/
├── package.json          # Project metadata and dependencies
├── .env.example          # Example environment variables
├── src/
│   ├── server.js         # Entry point, DB connection, and server startup
│   ├── app.js            # Express app setup and global middlewares
│   ├── config/           # Configuration files (e.g., env variables, db connection)
│   ├── middleware/       # Global middlewares (e.g., error handler, auth middleware)
│   ├── prisma/           # Prisma schema and migrations
│   ├── routes/           # Central API router mapping (index.js)
│   ├── utils/            # Shared utility functions and helpers
│   ├── scripts/          # Standalone scripts (e.g., DB seeding)
│   └── modules/          # Feature-based modular directories
│       ├── admin/        # Admin-specific logic
│       ├── affiliate/    # Affiliate-specific logic
│       ├── auth/         # Authentication and authorization
│       │   ├── auth.controller.js
│       │   ├── auth.routes.js
│       │   ├── auth.service.js
│       │   └── auth.validator.js
│       ├── business/     # Business-specific logic
│       ├── referral/     # Referral tracking and management
│       └── sector/       # Sector/category management
```

## 4. Development Guidelines

### Adding a New Feature
1. **Model:** If the feature requires new data, update the Prisma schema in `prisma/schema.prisma`.
2. **Module Directory:** Create a new folder under `src/modules/` (e.g., `src/modules/payments`).
3. **Files:** Inside the new module folder, create the Controller, Route, Service, and (optional) Validator files.
4. **Business Logic:** Keep all business logic and database queries in the **Service** file.
5. **Controllers:** Keep controllers lean—they should only handle HTTP concerns (extracting request data and formatting responses).
6. **Routes Registration:** Import the new module's routes into `src/routes/index.js` and mount it to a base path.
7. **Validation:** Always validate incoming data using `express-validator` in the route layer before passing to the controller.

### Error Handling
- Use the centralized error handler (`src/middleware/error.middleware.js`).
- Throw standard Error objects or custom error classes from Services, allowing Controllers to catch them (usually via `try/catch` or an async wrapper) and pass them to the `next()` function.

### Security
- Ensure `helmet` and `cors` are correctly configured.
- Rate limits are applied globally and specifically stricter on authentication routes to prevent brute force attacks.
