// ==========================================
// SERVER.JS — Application entry point
// Run with: npm start  (or npm run dev for auto-restart)
// ==========================================

// Load environment variables FIRST
require('dotenv').config();

// Validate required environment configuration at startup
const requiredEnv = ['JWT_SECRET'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = require('./app');
const { initDatabase } = require('./config/db');
const { startReminderScheduler } = require('./services/reminderScheduler');

const PORT = process.env.PORT || 3000;

// Initialize database, then start listening
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      // Start reminder scheduler
      startReminderScheduler();
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  });