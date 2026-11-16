// ==========================================
// REMINDER SCHEDULER — Checks for due tasks and sends email reminders
// ==========================================

const db = require('../config/db');
const { sendTaskReminderEmail } = require('../services/emailService');

// Check every 60 seconds for tasks that need reminders
const REMINDER_CHECK_INTERVAL = 60 * 1000; // 1 minute

let schedulerInterval = null;

const checkReminders = async () => {
  try {
    // Find tasks with due_date in the past or now, not yet reminded, and not completed
    const result = await db.query(`
      SELECT t.id, t.title, t.description, t.due_date, t.user_id,
             u.name, u.email
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE t.due_date IS NOT NULL
        AND t.due_date <= NOW()
        AND t.reminder_sent = FALSE
        AND t.completed = FALSE
    `);

    for (const task of result.rows) {
      try {
        await sendTaskReminderEmail(task.email, task.name, task.title, task.description, task.due_date);
        await db.query('UPDATE tasks SET reminder_sent = TRUE WHERE id = $1', [task.id]);
        console.log(`Reminder sent for task "${task.title}" (id: ${task.id}) to ${task.email}`);
      } catch (err) {
        console.error(`Failed to send reminder for task ${task.id}:`, err.message);
      }
    }
  } catch (error) {
    console.error('Reminder check error:', error.message);
  }
};

const startReminderScheduler = () => {
  if (schedulerInterval) return;
  schedulerInterval = setInterval(checkReminders, REMINDER_CHECK_INTERVAL);
  console.log('Reminder scheduler started (checking every 60 seconds)');
  // Run immediately on start
  checkReminders();
};

const stopReminderScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('Reminder scheduler stopped');
  }
};

module.exports = { startReminderScheduler, stopReminderScheduler, checkReminders };
