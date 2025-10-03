// src/routes/reportRoutes.js
import express from 'express';
import upload from '../config/cloudinary.js';
// 1. Import the new functions
import { submitReport, getMyReports, getReportById } from '../controllers/reportController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();


// The order of these routes matters. More specific routes should come first.

// 2. Add the route for "my-reports"
router.get('/my-reports', authenticateToken, authorizeRole('hacker'), getMyReports);

// This is the original route for submitting a report
router.post(
    '/',
    authenticateToken,
    authorizeRole('hacker'),
    upload.array('attachments', 5),
    submitReport
);

// 3. Add the dynamic route for getting a report by its ID
// This must come AFTER /my-reports, otherwise 'my-reports' would be treated as an ID
router.get('/:id', authenticateToken, getReportById);


export default router;