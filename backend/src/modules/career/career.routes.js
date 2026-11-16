const express = require('express');
const router = express.Router();
const careerController = require('./career.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorizeRoles } = require('../../middleware/role.middleware');

// Public Routes
router.get('/jobs', careerController.getAllJobPostings);
router.get('/jobs/:id', careerController.getJobPostingById);
router.post('/apply', careerController.submitApplication);

// Admin Routes (Protected)
router.post('/jobs', protect, authorizeRoles('admin', 'superadmin'), careerController.createJobPosting);
router.put('/jobs/:id', protect, authorizeRoles('admin', 'superadmin'), careerController.updateJobPosting);
router.delete('/jobs/:id', protect, authorizeRoles('admin', 'superadmin'), careerController.deleteJobPosting);

router.get('/applications', protect, authorizeRoles('admin', 'superadmin'), careerController.getAllJobApplications);
router.put('/applications/:id/status', protect, authorizeRoles('admin', 'superadmin'), careerController.updateJobApplicationStatus);

module.exports = router;
