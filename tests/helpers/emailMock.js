// Test-only mock for emailService. Captures raw tokens privately for assertions.
const verificationTokens = {};
const resetTokens = {};

const mock = {
  __verificationTokens: verificationTokens,
  __resetTokens: resetTokens,
  createTransporter: jest.fn(() => null),
  sendVerificationEmail: jest.fn(async (email, name, rawToken) => {
    verificationTokens[email] = rawToken;
    return true;
  }),
  sendPasswordResetEmail: jest.fn(async (email, name, rawToken) => {
    resetTokens[email] = rawToken;
    return true;
  }),
  sendTaskReminderEmail: jest.fn(async () => true)
};

module.exports = mock;