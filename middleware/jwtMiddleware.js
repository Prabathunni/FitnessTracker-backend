const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtMiddleware = (req, res, next) => {
    console.log("Inside JWT middleware (cookie-based)");

    try {
        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided in cookie" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.jwt_secret);
        console.log(decoded);
        
        // Attach userId to request for downstream use
        req.userId = decoded.userId;
        

        next(); // Pass control to next middleware/route

    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid or expired token", error: error.message });
    }
};

module.exports = jwtMiddleware;
