const jwt = require('jsonwebtoken');
const JWT_SECRET = 'atchu2659';
const JWT_EXPIRES_IN='1h'  // Replace with your actual secret

module.exports = (req, res, next) => {
    // Step 1: Check if the session exists
    if (!req.session || !req.session.userId) {
        return res.redirect('/auth/login'); // Redirect to login if session is missing
    }

    // Step 2: Verify JWT from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'JWT token missing' });
    }

    const token = authHeader.split(' ')[1]; // Assuming "Bearer <token>"
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired JWT token' });
        }

        if (decoded.userId !== req.session.userId) {
            return res.status(403).json({ message: 'Session and JWT mismatch' });
        }

        req.user = decoded;
        next();
    });
};
