const { contactInquiryRepo } = require("../../repositories");
const ApiError = require("../../utils/ApiError");

/**
 * Submit a new contact inquiry
 */
const createInquiry = async (data) => {
  if (!data.name || !data.email || !data.phone || !data.inquiryType || !data.message) {
    throw ApiError.badRequest("Name, email, phone, inquiry type, and message are required fields.");
  }
  
  return await contactInquiryRepo.create(data);
};

/**
 * Get all inquiries (admin only)
 */
const getAllInquiries = async ({ status, page = 1, limit = 50 } = {}) => {
  return await contactInquiryRepo.findAll({ status, page, limit });
};

/**
 * Get a single inquiry (admin only)
 */
const getInquiryById = async (id) => {
  const inquiry = await contactInquiryRepo.findById(id);
  if (!inquiry) throw ApiError.notFound("Contact inquiry not found.");
  return inquiry;
};

/**
 * Update an inquiry status or notes (admin only)
 */
const updateInquiry = async (id, updates) => {
  const existing = await contactInquiryRepo.findById(id);
  if (!existing) throw ApiError.notFound("Contact inquiry not found.");

  return await contactInquiryRepo.updateById(id, updates);
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
};
