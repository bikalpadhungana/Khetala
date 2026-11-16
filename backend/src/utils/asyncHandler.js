/**
 * asyncHandler — wraps async route handlers to forward errors to next()
 * Eliminates repetitive try/catch in every controller.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res, next) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
