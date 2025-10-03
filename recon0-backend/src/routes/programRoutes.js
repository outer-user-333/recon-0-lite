// src/routes/programRoutes.js
import express from 'express';
import { createProgram, getAllPrograms } from '../controllers/programController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get all programs (accessible by any authenticated user)
router.get('/', authenticateToken, getAllPrograms);

// Route to create a program (accessible only by users with 'organization' role)
router.post('/', authenticateToken, authorizeRole('organization'), createProgram);

export default router;