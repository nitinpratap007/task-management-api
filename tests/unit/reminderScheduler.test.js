jest.mock('../../config/db', () => ({ query: jest.fn() }));
jest.mock('../../services/emailService', () => ({ sendTaskReminderEmail: jest.fn() }));

const db = require('../../config/db');
const emailService = require('../../services/emailService');
const {
  checkReminders,
  startReminderScheduler,
  stopReminderScheduler
} = require('../../services/reminderScheduler');

describe('reminderScheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.query.mockReset();
    emailService.sendTaskReminderEmail.mockReset();
    emailService.sendTaskReminderEmail.mockResolvedValue(true);
  });

  afterEach(() => {
    stopReminderScheduler();
  });

  it('sends reminder and marks task when due tasks exist', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 1, title: 'T', description: 'd', due_date: new Date(), user_id: 1, name: 'N', email: 'e@e.com' }] })
      .mockResolvedValueOnce({ rows: [] }); // update
    await checkReminders();
    expect(emailService.sendTaskReminderEmail).toHaveBeenCalled();
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it('does nothing when no due tasks', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    await checkReminders();
    expect(emailService.sendTaskReminderEmail).not.toHaveBeenCalled();
  });

  it('handles db query failure gracefully', async () => {
    db.query.mockRejectedValueOnce(new Error('db down'));
    await expect(checkReminders()).resolves.toBeUndefined();
  });

  it('handles email send failure gracefully and continues', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [
        { id: 1, title: 'T1', description: '', due_date: new Date(), user_id: 1, name: 'N', email: 'e@e.com' },
        { id: 2, title: 'T2', description: '', due_date: new Date(), user_id: 1, name: 'N', email: 'e@e.com' }
      ] })
      .mockResolvedValue({ rows: [] });
    emailService.sendTaskReminderEmail
      .mockRejectedValueOnce(new Error('send fail'))
      .mockResolvedValueOnce(true);
    await expect(checkReminders()).resolves.toBeUndefined();
  });

  it('startReminderScheduler and stopReminderScheduler run without error', () => {
    db.query.mockResolvedValue({ rows: [] });
    jest.useFakeTimers();
    startReminderScheduler();
    stopReminderScheduler();
    jest.useRealTimers();
  });

  it('startReminderScheduler is idempotent', () => {
    db.query.mockResolvedValue({ rows: [] });
    jest.useFakeTimers();
    startReminderScheduler();
    startReminderScheduler();
    stopReminderScheduler();
    jest.useRealTimers();
  });
});