// ==========================================
// AUTH CONTROLLER — Registration, Login, Verification, Password Reset
// ==========================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { hashToken, generateTokenWithExpiry } = require('../utils/tokenUtils');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Generate verification token
    const { rawToken, tokenHash, expiry } = generateTokenWithExpiry(24 * 60); // 24 hours

    // Insert user (unverified)
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, is_verified, verification_token_hash, verification_token_expiry)
       VALUES ($1, $2, $3, FALSE, $4, $5)
       RETURNING id, name, email`,
      [name, normalizedEmail, hashedPassword, tokenHash, expiry]
    );

    const user = result.rows[0];

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, user.name, rawToken);

    res.status(201).json({
      success: true,
      message: emailSent
        ? 'User registered successfully. Please check your email to verify your account.'
        : 'User registered successfully. Email delivery is not configured — verification token generated but not sent.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: false
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification link.'
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.is_verified
        },
        token: token
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/verify-email (token from body)
// GET /api/auth/verify-email?token=... (token from query)
const verifyEmail = async (req, res) => {
  try {
    // Accept token from query params or request body
    const token = req.query.token || (req.body && req.body.token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const tokenHash = hashToken(token);

    const result = await db.query(
      `SELECT id, name, email FROM users
       WHERE verification_token_hash = $1
       AND verification_token_expiry > NOW()`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    const user = result.rows[0];

    // Mark as verified and clear token
    await db.query(
      `UPDATE users
       SET is_verified = TRUE,
           verification_token_hash = NULL,
           verification_token_expiry = NULL
       WHERE id = $1`,
      [user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error) {
    console.error('Verify email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await db.query(
      'SELECT id, name, email, is_verified FROM users WHERE email = $1',
      [normalizedEmail]
    );

    // Generic response to not reveal account existence
    const genericResponse = {
      success: true,
      message: 'If an unverified account exists with this email, a new verification link has been sent.'
    };

    if (result.rows.length === 0) {
      return res.status(200).json(genericResponse);
    }

    const user = result.rows[0];

    if (user.is_verified) {
      return res.status(200).json(genericResponse);
    }

    // Generate new verification token
    const { rawToken, tokenHash, expiry } = generateTokenWithExpiry(24 * 60);

    await db.query(
      `UPDATE users
       SET verification_token_hash = $1, verification_token_expiry = $2
       WHERE id = $3`,
      [tokenHash, expiry, user.id]
    );

    await sendVerificationEmail(user.email, user.name, rawToken);

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Resend verification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await db.query(
      'SELECT id, name, email, is_verified FROM users WHERE email = $1',
      [normalizedEmail]
    );

    // Generic response — don't reveal whether email exists
    const genericResponse = {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    };

    if (result.rows.length === 0) {
      return res.status(200).json(genericResponse);
    }

    const user = result.rows[0];

    if (!user.is_verified) {
      return res.status(200).json(genericResponse);
    }

    // Generate reset token (1 hour expiry)
    const { rawToken, tokenHash, expiry } = generateTokenWithExpiry(60);

    await db.query(
      `UPDATE users
       SET reset_token_hash = $1, reset_token_expiry = $2
       WHERE id = $3`,
      [tokenHash, expiry, user.id]
    );

    await sendPasswordResetEmail(user.email, user.name, rawToken);

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    const tokenHash = hashToken(token);

    const result = await db.query(
      `SELECT id, name, email FROM users
       WHERE reset_token_hash = $1
       AND reset_token_expiry > NOW()`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const user = result.rows[0];

    // Hash new password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update password and clear reset token
    await db.query(
      `UPDATE users
       SET password_hash = $1,
           reset_token_hash = NULL,
           reset_token_expiry = NULL
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/auth/me (Protected)
const getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.is_verified,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe
};
