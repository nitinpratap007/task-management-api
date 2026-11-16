// ==========================================
// TOKEN UTILITIES — Secure token generation and hashing
// Uses Node.js built-in crypto module
// ==========================================

const crypto = require('crypto');

// Generate a cryptographically secure random token
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash a token using SHA-256 for safe database storage
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate a token with its hash and expiry
const generateTokenWithExpiry = (expiryMinutes = 60) => {
  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
  return { rawToken, tokenHash, expiry };
};

module.exports = {
  generateSecureToken,
  hashToken,
  generateTokenWithExpiry
};
