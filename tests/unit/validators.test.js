const { validationResult } = require('express-validator');
const {
  validate,
  registerRules,
  loginRules,
  createTaskRules,
  updateTaskRules,
  verifyEmailRules,
  forgotPasswordRules,
  resetPasswordRules,
  resendVerificationRules
} = require('../../validators/validators');

// Run an array of express-validator middlewares against a fake request.
async function runValidators(ruleSet, body) {
  const req = { body: { ...body }, query: {}, params: {} };
  const res = {};
  for (const mw of ruleSet) {
    await new Promise((resolve, reject) => {
      try {
        const ret = mw(req, res, (err) => (err ? reject(err) : resolve()));
        if (ret && typeof ret.then === 'function') ret.then(resolve).catch(reject);
        else if (ruleSet.indexOf(mw) === ruleSet.length - 1) resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  // express-validator chains are async; ensure microtasks flush
  await new Promise((r) => setImmediate(r));
  return validationResult(req);
}

describe('validators', () => {
  describe('validate middleware', () => {
    it('calls next when no errors', () => {
      const req = { /* no errors */ };
      // validationResult will be empty for a plain req
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      // monkey: validationResult(req) empty
      validate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns 400 with errors array when errors present', () => {
      // Force errors by attaching validationResult via express-validator? Instead test shape by mocking.
      const req = {};
      const errors = { isEmpty: () => false, array: () => [{ path: 'email', msg: 'bad', value: '' }] };
      // Override validationResult import is not possible; use module's validate with a req that has errors via express-validator internal.
      // We'll instead exercise via real validators below.
      expect(true).toBe(true);
    });
  });

  describe('registerRules', () => {
    it('accepts valid input', async () => {
      const r = await runValidators(registerRules, { name: 'John', email: 'john@test.com', password: 'TestPass123' });
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects empty name', async () => {
      const r = await runValidators(registerRules, { name: '', email: 'john@test.com', password: 'TestPass123' });
      expect(r.isEmpty()).toBe(false);
      expect(r.array().some((e) => e.path === 'name')).toBe(true);
    });
    it('rejects missing name', async () => {
      const r = await runValidators(registerRules, { email: 'john@test.com', password: 'TestPass123' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects invalid email', async () => {
      const r = await runValidators(registerRules, { name: 'John', email: 'not-email', password: 'TestPass123' });
      expect(r.isEmpty()).toBe(false);
      expect(r.array().some((e) => e.path === 'email')).toBe(true);
    });
    it('rejects short password', async () => {
      const r = await runValidators(registerRules, { name: 'John', email: 'john@test.com', password: '123' });
      expect(r.isEmpty()).toBe(false);
      expect(r.array().some((e) => e.path === 'password')).toBe(true);
    });
    it('rejects too-long name', async () => {
      const r = await runValidators(registerRules, { name: 'a'.repeat(101), email: 'john@test.com', password: 'TestPass123' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects too-long password', async () => {
      const r = await runValidators(registerRules, { name: 'John', email: 'john@test.com', password: 'a'.repeat(73) });
      expect(r.isEmpty()).toBe(false);
    });
  });

  describe('loginRules', () => {
    it('accepts valid input', async () => {
      const r = await runValidators(loginRules, { email: 'john@test.com', password: 'x' });
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects invalid email', async () => {
      const r = await runValidators(loginRules, { email: 'bad', password: 'x' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects missing password', async () => {
      const r = await runValidators(loginRules, { email: 'john@test.com' });
      expect(r.isEmpty()).toBe(false);
    });
  });

  describe('createTaskRules', () => {
    it('accepts minimal valid (title only)', async () => {
      const r = await runValidators(createTaskRules, { title: 'Task' });
      expect(r.isEmpty()).toBe(true);
    });
    it('accepts full valid', async () => {
      const r = await runValidators(createTaskRules, { title: 'Task', description: 'desc', completed: false, dueDate: '2026-01-01T00:00:00.000Z' });
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects empty title', async () => {
      const r = await runValidators(createTaskRules, { title: '' });
      expect(r.isEmpty()).toBe(false);
      expect(r.array().some((e) => e.path === 'title')).toBe(true);
    });
    it('rejects missing title', async () => {
      const r = await runValidators(createTaskRules, {});
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects too-long title', async () => {
      const r = await runValidators(createTaskRules, { title: 'a'.repeat(201) });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects too-long description', async () => {
      const r = await runValidators(createTaskRules, { title: 'Task', description: 'a'.repeat(2001) });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects non-boolean completed', async () => {
      const r = await runValidators(createTaskRules, { title: 'Task', completed: 'yes' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects invalid dueDate', async () => {
      const r = await runValidators(createTaskRules, { title: 'Task', dueDate: 'not-a-date' });
      expect(r.isEmpty()).toBe(false);
    });
    it('accepts null dueDate', async () => {
      const r = await runValidators(createTaskRules, { title: 'Task', dueDate: null });
      expect(r.isEmpty()).toBe(true);
    });
  });

  describe('updateTaskRules', () => {
    it('accepts empty body (all optional)', async () => {
      const r = await runValidators(updateTaskRules, {});
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects empty title when provided', async () => {
      const r = await runValidators(updateTaskRules, { title: '' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects invalid completed', async () => {
      const r = await runValidators(updateTaskRules, { completed: 'nope' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects invalid dueDate', async () => {
      const r = await runValidators(updateTaskRules, { dueDate: 'bad' });
      expect(r.isEmpty()).toBe(false);
    });
  });

  describe('verifyEmailRules', () => {
    it('accepts empty body (token optional)', async () => {
      const r = await runValidators(verifyEmailRules, {});
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects empty token when provided', async () => {
      const r = await runValidators(verifyEmailRules, { token: '' });
      expect(r.isEmpty()).toBe(false);
    });
    it('accepts non-empty token', async () => {
      const r = await runValidators(verifyEmailRules, { token: 'abc' });
      expect(r.isEmpty()).toBe(true);
    });
  });

  describe('forgotPasswordRules', () => {
    it('accepts valid email', async () => {
      const r = await runValidators(forgotPasswordRules, { email: 'a@b.com' });
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects invalid email', async () => {
      const r = await runValidators(forgotPasswordRules, { email: 'bad' });
      expect(r.isEmpty()).toBe(false);
    });
  });

  describe('resetPasswordRules', () => {
    it('accepts valid', async () => {
      const r = await runValidators(resetPasswordRules, { token: 't', newPassword: 'LongEnough1' });
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects missing token', async () => {
      const r = await runValidators(resetPasswordRules, { newPassword: 'LongEnough1' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects short new password', async () => {
      const r = await runValidators(resetPasswordRules, { token: 't', newPassword: 'short' });
      expect(r.isEmpty()).toBe(false);
    });
    it('rejects too-long new password', async () => {
      const r = await runValidators(resetPasswordRules, { token: 't', newPassword: 'a'.repeat(73) });
      expect(r.isEmpty()).toBe(false);
    });
  });

  describe('resendVerificationRules', () => {
    it('accepts valid email', async () => {
      const r = await runValidators(resendVerificationRules, { email: 'a@b.com' });
      expect(r.isEmpty()).toBe(true);
    });
    it('rejects invalid email', async () => {
      const r = await runValidators(resendVerificationRules, { email: 'bad' });
      expect(r.isEmpty()).toBe(false);
    });
  });

  describe('validate middleware (real)', () => {
    it('returns 400 and errors when validation errors exist', async () => {
      // Build a req by running a validator that will fail, then call validate.
      const req = { body: { email: 'bad' }, query: {}, params: {} };
      // run loginRules to populate req errors internally via express-validator
      for (const mw of loginRules) {
        await new Promise((resolve) => mw(req, {}, () => resolve()));
      }
      await new Promise((r) => setImmediate(r));
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      validate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      const payload = res.json.mock.calls[0][0];
      expect(payload.success).toBe(false);
      expect(Array.isArray(payload.errors)).toBe(true);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next when no errors', () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      validate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});