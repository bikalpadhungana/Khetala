const careerRepository = require('./career.repository');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');
const { sendMail } = require('../../utils/mailer');

exports.createJobPosting = asyncHandler(async (req, res) => {
  const job = await careerRepository.createJobPosting(req.body);
  ApiResponse.created(res, 'Job posting created successfully', job);
});

exports.getAllJobPostings = asyncHandler(async (req, res) => {
  const { status, department } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (department) filters.department = department;

  const jobs = await careerRepository.getAllJobPostings(filters);
  ApiResponse.ok(res, 'Job postings retrieved successfully', jobs);
});

exports.getJobPostingById = asyncHandler(async (req, res) => {
  const job = await careerRepository.getJobPostingById(req.params.id);
  if (!job) throw new ApiError(404, 'Job posting not found');
  ApiResponse.ok(res, 'Job posting retrieved successfully', job);
});

exports.updateJobPosting = asyncHandler(async (req, res) => {
  const job = await careerRepository.updateJobPosting(req.params.id, req.body);
  ApiResponse.ok(res, 'Job posting updated successfully', job);
});

exports.deleteJobPosting = asyncHandler(async (req, res) => {
  await careerRepository.deleteJobPosting(req.params.id);
  ApiResponse.ok(res, 'Job posting deleted successfully', null);
});

exports.submitApplication = asyncHandler(async (req, res) => {
  const { jobId, fullName, email, phone, resumeUrl, coverLetter, linkedinUrl } = req.body;
  
  if (!jobId || !fullName || !email || !phone) {
    throw new ApiError(400, 'Required fields missing');
  }

  const job = await careerRepository.getJobPostingById(jobId);
  if (!job) throw new ApiError(404, 'Job posting not found');

  const application = await careerRepository.createJobApplication({
    jobId,
    fullName,
    email,
    phone,
    resumeUrl,
    coverLetter,
    linkedinUrl,
  });

  // Send Email Notification
  try {
    const adminEmail = process.env.SMTP_USER || 'admin@thinktank.com';
    await sendMail({
      to: adminEmail,
      subject: `New Job Application: ${fullName} for ${job.title}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Applicant:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Job Applied:</strong> ${job.title} (${job.department})</p>
        <p><strong>LinkedIn:</strong> ${linkedinUrl || 'N/A'}</p>
        <p><strong>Resume URL:</strong> <a href="${resumeUrl}">${resumeUrl}</a></p>
        <p><strong>Cover Letter:</strong></p>
        <p>${coverLetter || 'N/A'}</p>
      `
    });

    await sendMail({
      to: email,
      subject: `Application Received: ${job.title}`,
      html: `
        <h2>Thank you for applying!</h2>
        <p>Hi ${fullName},</p>
        <p>We have successfully received your application for the <strong>${job.title}</strong> position at Think Tank.</p>
        <p>Our recruitment team will review your application and get back to you shortly.</p>
        <br>
        <p>Best Regards,</p>
        <p>Think Tank HR Team</p>
      `
    });
  } catch (error) {
    console.error("Email sending failed for application:", error);
    // Proceed anyway as application is saved
  }

  ApiResponse.created(res, 'Application submitted successfully', application);
});

exports.getAllJobApplications = asyncHandler(async (req, res) => {
  const { jobId, status } = req.query;
  const filters = {};
  if (jobId) filters.jobId = jobId;
  if (status) filters.status = status;

  const applications = await careerRepository.getAllJobApplications(filters);
  ApiResponse.ok(res, 'Applications retrieved successfully', applications);
});

exports.updateJobApplicationStatus = asyncHandler(async (req, res) => {
  const application = await careerRepository.updateJobApplication(req.params.id, { status: req.body.status });
  ApiResponse.ok(res, 'Application status updated successfully', application);
});
