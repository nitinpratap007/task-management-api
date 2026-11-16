// ==========================================
// EMAIL SERVICE — Nodemailer wrapper
// Configuration from environment variables
// ==========================================

const nodemailer = require('nodemailer');

// Create transporter from env config
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const secure = process.env.EMAIL_SECURE === 'true';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, name, rawToken) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('Email not configured. Verification token not sent.');
    return false;
  }

  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@taskmanagement.com',
    to: email,
    subject: 'Verify Your Email — Task Management API',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>Or use this token: <code>${rawToken}</code></p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create this account, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error.message);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, rawToken) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('Email not configured. Reset token not sent.');
    return false;
  }

  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/api/auth/reset-password?token=${encodeURIComponent(rawToken)}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@taskmanagement.com',
    to: email,
    subject: 'Reset Your Password — Task Management API',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested a password reset. Use the token below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>Or use this token: <code>${rawToken}</code></p>
      <p>This token expires in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send reset email:', error.message);
    return false;
  }
};

// Send task reminder email
const sendTaskReminderEmail = async (email, name, taskTitle, taskDescription, dueDate) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('Email not configured. Reminder not sent.');
    return false;
  }

  const formattedDate = new Date(dueDate).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@taskmanagement.com',
    to: email,
    subject: `Reminder: ${taskTitle} — Task Management API`,
    html: `
      <h2>Task Reminder</h2>
      <p>Hi ${name},</p>
      <p>This is a reminder for your task:</p>
      <div style="background: #f5f7fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${taskTitle}</h3>
        ${taskDescription ? `<p style="margin: 0 0 8px 0; color: #666;">${taskDescription}</p>` : ''}
        <p style="margin: 0; color: #e74c3c; font-weight: bold;">Due: ${formattedDate}</p>
      </div>
      <p>Don't forget to complete this task!</p>
      <p style="color: #999; font-size: 0.85rem;">This is an automated reminder from Task Management API.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send reminder email:', error.message);
    return false;
  }
};

module.exports = {
  createTransporter,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTaskReminderEmail
};
