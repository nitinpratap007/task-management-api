const emailService = require('../../services/emailService');

describe('emailService', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    // restore
    process.env = { ...originalEnv };
  });

  describe('createTransporter', () => {
    it('returns null when email not configured', () => {
      delete process.env.EMAIL_HOST;
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;
      expect(emailService.createTransporter()).toBeNull();
    });

    it('returns a transporter when configured', () => {
      process.env.EMAIL_HOST = 'smtp.example.com';
      process.env.EMAIL_PORT = '587';
      process.env.EMAIL_SECURE = 'false';
      process.env.EMAIL_USER = 'user';
      process.env.EMAIL_PASS = 'pass';
      const t = emailService.createTransporter();
      expect(t).not.toBeNull();
      expect(typeof t.sendMail).toBe('function');
    });
  });

  describe('send functions (unconfigured)', () => {
    beforeEach(() => {
      delete process.env.EMAIL_HOST;
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;
    });

    it('sendVerificationEmail returns false', async () => {
      const r = await emailService.sendVerificationEmail('a@b.com', 'Name', 'token');
      expect(r).toBe(false);
    });

    it('sendPasswordResetEmail returns false', async () => {
      const r = await emailService.sendPasswordResetEmail('a@b.com', 'Name', 'token');
      expect(r).toBe(false);
    });

    it('sendTaskReminderEmail returns false', async () => {
      const r = await emailService.sendTaskReminderEmail('a@b.com', 'Name', 'Title', 'Desc', new Date());
      expect(r).toBe(false);
    });
  });
});