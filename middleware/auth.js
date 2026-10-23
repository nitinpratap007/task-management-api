// ==========================================
// AUTH MIDDLEWARE — JWT Token Verification
// Protects routes: validates Bearer token, sets req.user
// ==========================================

const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Reject missing or malformed Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token signature and expiration using JWT_SECRET from env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm the user still exists in the database
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.'
      });
    }

    // Attach authenticated user to the request (never trust client-supplied IDs)
    req.user = user;

    next();
  } catch (error) {
    // Invalid signature, malformed token, or expired token
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

module.exports = authMiddleware;
