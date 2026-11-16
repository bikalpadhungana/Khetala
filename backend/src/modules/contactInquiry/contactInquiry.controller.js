const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const contactInquiryService = require("./contactInquiry.service");

/** POST /api/contact */
const createInquiry = asyncHandler(async (req, res) => {
  const { name, organization, email, phone, inquiryType, leadSector, message } = req.body;

  const data = await contactInquiryService.createInquiry({
    name,
    organization,
    email,
    phone,
    inquiryType,
    leadSector,
    message,
  });

  return ApiResponse.created(res, "Your inquiry has been submitted successfully.", data);
});

/** GET /api/admin/contact-inquiries */
const getAllInquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  const { inquiries, total } = await contactInquiryService.getAllInquiries({
    status,
    page,
    limit,
  });

  return ApiResponse.paginated(res, "Contact inquiries fetched successfully.", inquiries, page, limit, total);
});

/** GET /api/admin/contact-inquiries/:id */
const getInquiryById = asyncHandler(async (req, res) => {
  const data = await contactInquiryService.getInquiryById(req.params.id);
  return ApiResponse.ok(res, "Contact inquiry fetched successfully.", data);
});

/** PUT /api/admin/contact-inquiries/:id */
const updateInquiry = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const data = await contactInquiryService.updateInquiry(req.params.id, {
    status,
    adminNotes,
  });

  return ApiResponse.ok(res, "Contact inquiry updated successfully.", data);
});

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
};
