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



export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // Ensure authenticateToken has run first
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }

        const userRole = req.user.role;
        if (Array.isArray(allowedRoles) && allowedRoles.includes(userRole)) {
            next(); // User has one of the allowed roles, proceed
        } else if (userRole === allowedRoles) {
             next(); // User has the single allowed role, proceed
        }
        else {
            res.status(403).json({ success: false, message: 'Forbidden: You do not have the required permissions.' });
        }
    };
};