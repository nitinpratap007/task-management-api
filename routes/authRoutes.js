// ==========================================
// AUTH ROUTES — Public (no token required) + Protected
// ==========================================

const router = require('express').Router();
const { register, login, verifyEmail, resendVerification, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { validate, registerRules, loginRules, verifyEmailRules, forgotPasswordRules, resetPasswordRules, resendVerificationRules } = require('../validators/validators');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmailRules, validate, verifyEmail);
router.post('/resend-verification', resendVerificationRules, validate, resendVerification);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, resetPassword);

// Protected routes
router.get('/me', authMiddleware, getMe);

module.exports = router;
