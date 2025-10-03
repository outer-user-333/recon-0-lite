// src/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);


// 2. Add the new login route
router.post('/login', loginUser);

export default router;