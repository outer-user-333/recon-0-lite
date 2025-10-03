// src/controllers/userController.js
import prisma from '../lib/prisma.js';

export const getProfile = async (req, res) => {
    try {
        // The user's ID is attached to req.user by the authenticateToken middleware
        const userId = req.user.id; 

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // IMPORTANT: Never send the password hash back to the client
        const { password, ...userProfile } = user;

        res.status(200).json({ success: true, data: userProfile });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};