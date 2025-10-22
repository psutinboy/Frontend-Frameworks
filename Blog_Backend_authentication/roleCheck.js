// roleCheck.js
const jwt = require('jsonwebtoken');

// Role check middleware function
const roleCheck = (requiredRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
            if (!requiredRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied. Insufficient privileges.' });
            }

            req.user = decoded; // Attach user info to request
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
    };
};

module.exports = roleCheck; // Make sure this is the default export