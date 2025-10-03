// src/routes/userRoutes.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getProfile } from '../controllers/userController.js';

const router = express.Router();

// This route is protected. The authenticateToken middleware will run first.
router.get('/profile', authenticateToken, getProfile);

export default router;