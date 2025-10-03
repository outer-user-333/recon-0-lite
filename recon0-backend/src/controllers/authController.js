// src/controllers/authController.js
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { email, password, username, fullName, role } = req.body;

    // Basic validation
    if (!email || !password || !username || !role) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email or username already in use.' });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                fullName, // Prisma handles mapping this to full_name
                role, // e.g., 'hacker' or 'organization'
            },
        });

        // 4. Generate a JWT
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 5. Send the successful response
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: { id: newUser.id, username: newUser.username, role: newUser.role },
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};






// src/controllers/authController.js

// ... (keep the existing registerUser function above this)

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    try {
        // 1. Find the user by their email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // If no user is found, or if password doesn't match, send a generic error
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // 2. Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // 3. If credentials are valid, generate a new JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 4. Send the successful response
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: { id: user.id, username: user.username, role: user.role },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};