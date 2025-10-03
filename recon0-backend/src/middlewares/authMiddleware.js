// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Forbidden: Token is not valid.' });
        }
        // If token is valid, attach the decoded user payload to the request object
        req.user = user;
        next(); // Proceed to the next function in the chain (the controller)
    });
};