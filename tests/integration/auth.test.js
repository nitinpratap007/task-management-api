jest.mock('../../services/emailService', () => require('../helpers/emailMock'));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const db = require('../../config/db');
const emailMock = require('../helpers/emailMock');

const JWT_SECRET = process.env.JWT_SECRET;

function clearTokens() {
  Object.keys(emailMock.__verificationTokens).forEach((k) => delete emailMock.__verificationTokens[k]);
  Object.keys(emailMock.__resetTokens).forEach((k) => delete emailMock.__resetTokens[k]);
  emailMock.sendVerificationEmail.mockClear();
  emailMock.sendPasswordResetEmail.mockClear();
}

async function clearDb() {
  await db.query('DELETE FROM tasks');
  await db.query('DELETE FROM categories');
  await db.query('DELETE FROM users');
}

async function registerUser(email, password = 'TestPass123') {
  const res = await request(app).post('/api/auth/register').send({ name: 'Test User', email, password });
  return res;
}

async function verifyUser(email) {
  const token = emailMock.__verificationTokens[email];
  return request(app).get('/api/auth/verify-email').query({ token });
}

async function loginUser(email, password = 'TestPass123') {
  return request(app).post('/api/auth/login').send({ email, password });
}

beforeEach(async () => {
  await clearDb();
  clearTokens();
});

describe('Auth API', () => {
  describe('Registration', () => {
    it('POST /register valid -> 201, unverified, no token', async () => {
      const res = await registerUser('a@test.com');
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.isVerified).toBe(false);
      expect(res.body.data.token).toBeUndefined();
      expect(emailMock.sendVerificationEmail).toHaveBeenCalled();
    });

    it('POST /register duplicate email -> 409', async () => {
      await registerUser('dup@test.com');
      const res = await registerUser('dup@test.com');
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('POST /register invalid data -> 400', async () => {
      const res = await request(app).post('/api/auth/register').send({ name: '', email: 'bad', password: '123' });
      expect(res.status).toBe(400);
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('POST /register missing fields -> 400', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
    });

    it('normalizes email to lowercase', async () => {
      await registerUser('Mixed@TEST.com');
      const res = await request(app).post('/api/auth/register').send({ name: 'x', email: 'mixed@test.com', password: 'TestPass123' });
      expect(res.status).toBe(409);
    });
  });

  describe('Email verification', () => {
    it('GET verify-email valid token -> 200 and login works', async () => {
      await registerUser('v@test.com');
      const res = await verifyUser('v@test.com');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const login = await loginUser('v@test.com');
      expect(login.status).toBe(200);
      expect(login.body.data.token).toBeTruthy();
    });

    it('GET verify-email missing token -> 400', async () => {
      const res = await request(app).get('/api/auth/verify-email');
      expect(res.status).toBe(400);
    });

    it('GET verify-email invalid token -> 400', async () => {
      const res = await request(app).get('/api/auth/verify-email').query({ token: 'not-a-real-token' });
      expect(res.status).toBe(400);
    });

    it('GET verify-email expired token -> 400', async () => {
      await registerUser('exp@test.com');
      // expire the stored token
      await db.query('UPDATE users SET verification_token_expiry = $1 WHERE email = $2', [new Date(Date.now() - 1000), 'exp@test.com']);
      const res = await verifyUser('exp@test.com');
      expect(res.status).toBe(400);
    });

    it('POST verify-email with body token -> 200', async () => {
      await registerUser('pv@test.com');
      const token = emailMock.__verificationTokens['pv@test.com'];
      const res = await request(app).post('/api/auth/verify-email').send({ token });
      expect(res.status).toBe(200);
    });

    it('verification token is single-use', async () => {
      await registerUser('su@test.com');
      const token = emailMock.__verificationTokens['su@test.com'];
      const first = await request(app).get('/api/auth/verify-email').query({ token });
      expect(first.status).toBe(200);
      const second = await request(app).get('/api/auth/verify-email').query({ token });
      expect(second.status).toBe(400);
    });
  });

  describe('Resend verification', () => {
    it('unverified account -> 200 generic', async () => {
      await registerUser('r@test.com');
      const res = await request(app).post('/api/auth/resend-verification').send({ email: 'r@test.com' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('verified account -> 200 generic', async () => {
      await registerUser('rv@test.com');
      await verifyUser('rv@test.com');
      const res = await request(app).post('/api/auth/resend-verification').send({ email: 'rv@test.com' });
      expect(res.status).toBe(200);
    });

    it('nonexistent account -> 200 generic (no enumeration)', async () => {
      const res = await request(app).post('/api/auth/resend-verification').send({ email: 'nope@test.com' });
      expect(res.status).toBe(200);
    });

    it('invalid email -> 400', async () => {
      const res = await request(app).post('/api/auth/resend-verification').send({ email: 'bad' });
      expect(res.status).toBe(400);
    });
  });

  describe('Login', () => {
    it('before verification -> 403', async () => {
      await registerUser('l@test.com');
      const res = await loginUser('l@test.com');
      expect(res.status).toBe(403);
    });

    it('correct credentials after verification -> 200 with token', async () => {
      await registerUser('ok@test.com');
      await verifyUser('ok@test.com');
      const res = await loginUser('ok@test.com');
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeTruthy();
      expect(res.body.data.user.isVerified).toBe(true);
    });

    it('wrong password -> 401', async () => {
      await registerUser('w@test.com');
      await verifyUser('w@test.com');
      const res = await loginUser('w@test.com', 'WrongPass123');
      expect(res.status).toBe(401);
    });

    it('nonexistent user -> 401', async () => {
      const res = await loginUser('ghost@test.com');
      expect(res.status).toBe(401);
    });

    it('invalid data -> 400', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'bad', password: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('Protected /me', () => {
    it('valid token -> 200 user without password hash', async () => {
      await registerUser('me@test.com');
      await verifyUser('me@test.com');
      const login = await loginUser('me@test.com');
      const token = login.body.data.token;
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('me@test.com');
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.user.password_hash).toBeUndefined();
    });

    it('missing token -> 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('invalid token -> 401', async () => {
      const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not.a.token');
      expect(res.status).toBe(401);
    });

    it('expired token -> 401', async () => {
      await registerUser('exptok@test.com');
      await verifyUser('exptok@test.com');
      const login = await loginUser('exptok@test.com');
      // craft expired token with same secret
      const expired = jwt.sign({ userId: login.body.data.user.id }, JWT_SECRET, { expiresIn: -10 });
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${expired}`);
      expect(res.status).toBe(401);
    });
  });

  describe('Forgot / reset password', () => {
    async function setupVerified(email) {
      await registerUser(email);
      await verifyUser(email);
    }

    it('forgot password valid -> 200 generic', async () => {
      await setupVerified('fp@test.com');
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'fp@test.com' });
      expect(res.status).toBe(200);
      expect(emailMock.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('forgot password nonexistent -> 200 generic', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'ghost@test.com' });
      expect(res.status).toBe(200);
    });

    it('forgot password unverified -> 200 generic, no email', async () => {
      await registerUser('unv@test.com');
      emailMock.sendPasswordResetEmail.mockClear();
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'unv@test.com' });
      expect(res.status).toBe(200);
      expect(emailMock.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('forgot password invalid email -> 400', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'bad' });
      expect(res.status).toBe(400);
    });

    it('reset password valid -> 200; new password works, old fails', async () => {
      await setupVerified('rp@test.com');
      await request(app).post('/api/auth/forgot-password').send({ email: 'rp@test.com' });
      const rawToken = emailMock.__resetTokens['rp@test.com'];
      const res = await request(app).post('/api/auth/reset-password').send({ token: rawToken, newPassword: 'NewPass123!' });
      expect(res.status).toBe(200);
      const oldLogin = await loginUser('rp@test.com', 'TestPass123');
      expect(oldLogin.status).toBe(401);
      const newLogin = await loginUser('rp@test.com', 'NewPass123!');
      expect(newLogin.status).toBe(200);
    });

    it('reset password invalid token -> 400', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({ token: 'bad', newPassword: 'NewPass123!' });
      expect(res.status).toBe(400);
    });

    it('reset password expired token -> 400', async () => {
      await setupVerified('rpe@test.com');
      await request(app).post('/api/auth/forgot-password').send({ email: 'rpe@test.com' });
      await db.query('UPDATE users SET reset_token_expiry = $1 WHERE email = $2', [new Date(Date.now() - 1000), 'rpe@test.com']);
      const rawToken = emailMock.__resetTokens['rpe@test.com'];
      const res = await request(app).post('/api/auth/reset-password').send({ token: rawToken, newPassword: 'NewPass123!' });
      expect(res.status).toBe(400);
    });

    it('reset password missing fields -> 400', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({});
      expect(res.status).toBe(400);
    });

    it('reset password short new password -> 400', async () => {
      await setupVerified('rps@test.com');
      await request(app).post('/api/auth/forgot-password').send({ email: 'rps@test.com' });
      const rawToken = emailMock.__resetTokens['rps@test.com'];
      const res = await request(app).post('/api/auth/reset-password').send({ token: rawToken, newPassword: 'short' });
      expect(res.status).toBe(400);
    });

    it('reset token is single-use', async () => {
      await setupVerified('rpu@test.com');
      await request(app).post('/api/auth/forgot-password').send({ email: 'rpu@test.com' });
      const rawToken = emailMock.__resetTokens['rpu@test.com'];
      const first = await request(app).post('/api/auth/reset-password').send({ token: rawToken, newPassword: 'NewPass123!' });
      expect(first.status).toBe(200);
      const second = await request(app).post('/api/auth/reset-password').send({ token: rawToken, newPassword: 'AnotherPass123!' });
      expect(second.status).toBe(400);
    });
  });
});