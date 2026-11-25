jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));

const nodemailer = require('nodemailer');
const emailService = require('../../services/emailService');

describe('emailService send paths', () => {
  const baseEnv = { ...process.env };
  beforeEach(() => {
    process.env.EMAIL_HOST = 'smtp.example.com';
    process.env.EMAIL_PORT = '587';
    process.env.EMAIL_SECURE = 'false';
    process.env.EMAIL_USER = 'user';
    process.env.EMAIL_PASS = 'pass';
    process.env.EMAIL_FROM = 'noreply@test.com';
    process.env.APP_BASE_URL = 'http://localhost:3000';
  });
  afterEach(() => {
    process.env = { ...baseEnv };
    jest.clearAllMocks();
  });

  it('sendVerificationEmail success -> true', async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: jest.fn().mockResolvedValue(true) });
    const r = await emailService.sendVerificationEmail('a@b.com', 'Name', 'tok');
    expect(r).toBe(true);
  });

  it('sendVerificationEmail failure -> false', async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: jest.fn().mockRejectedValue(new Error('boom')) });
    const r = await emailService.sendVerificationEmail('a@b.com', 'Name', 'tok');
    expect(r).toBe(false);
  });

  it('sendPasswordResetEmail success -> true', async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: jest.fn().mockResolvedValue(true) });
    const r = await emailService.sendPasswordResetEmail('a@b.com', 'Name', 'tok');
    expect(r).toBe(true);
  });

  it('sendPasswordResetEmail failure -> false', async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: jest.fn().mockRejectedValue(new Error('boom')) });
    const r = await emailService.sendPasswordResetEmail('a@b.com', 'Name', 'tok');
    expect(r).toBe(false);
  });

  it('sendTaskReminderEmail success -> true', async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: jest.fn().mockResolvedValue(true) });
    const r = await emailService.sendTaskReminderEmail('a@b.com', 'Name', 'Title', 'Desc', new Date());
    expect(r).toBe(true);
  });

  it('sendTaskReminderEmail failure -> false', async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: jest.fn().mockRejectedValue(new Error('boom')) });
    const r = await emailService.sendTaskReminderEmail('a@b.com', 'Name', 'Title', 'Desc', new Date());
    expect(r).toBe(false);
  });
});