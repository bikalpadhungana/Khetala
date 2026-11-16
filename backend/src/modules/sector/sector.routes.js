const express = require("express");
const router = express.Router();

const {
  createSector,
  getAllSectors,
  getSectorById,
  updateSector,
  deleteSector,
} = require("./sector.controller");
const {
  createSectorValidator,
  updateSectorValidator,
  mongoIdValidator,
} = require("./sector.validator");
const { validate } = require("../../middleware/validate.middleware");
const { protect } = require("../../middleware/auth.middleware");
const { authorizeRoles } = require("../../middleware/role.middleware");

const adminOnly = [protect, authorizeRoles("superadmin")];

/**
 * @route   POST /api/admin/sectors
 * @access  Superadmin
 */
router.post("/", adminOnly, createSectorValidator, validate, createSector);

/**
 * @route   GET /api/admin/sectors
 * @access  Superadmin (all), also mounted publicly at /api/sectors
 */
router.get("/", protect, getAllSectors);

/**
 * @route   GET /api/admin/sectors/:id
 * @access  Superadmin
 */
router.get("/:id", adminOnly, mongoIdValidator, validate, getSectorById);

/**
 * @route   PUT /api/admin/sectors/:id
 * @access  Superadmin
 */
router.put("/:id", adminOnly, updateSectorValidator, validate, updateSector);

/**
 * @route   DELETE /api/admin/sectors/:id
 * @access  Superadmin
 */
router.delete("/:id", adminOnly, mongoIdValidator, validate, deleteSector);

module.exports = router;
