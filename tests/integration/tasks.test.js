jest.mock('../../services/emailService', () => require('../helpers/emailMock'));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const db = require('../../config/db');
const emailMock = require('../helpers/emailMock');

const JWT_SECRET = process.env.JWT_SECRET;

async function clearDb() {
  await db.query('DELETE FROM tasks');
  await db.query('DELETE FROM users');
}

function clearTokens() {
  Object.keys(emailMock.__verificationTokens).forEach((k) => delete emailMock.__verificationTokens[k]);
  Object.keys(emailMock.__resetTokens).forEach((k) => delete emailMock.__resetTokens[k]);
}

async function registerVerifyLogin(email, password = 'TestPass123') {
  await request(app).post('/api/auth/register').send({ name: 'Task User', email, password });
  const token = emailMock.__verificationTokens[email];
  await request(app).get('/api/auth/verify-email').query({ token });
  const login = await request(app).post('/api/auth/login').send({ email, password });
  return login.body.data.token;
}

beforeEach(async () => {
  await clearDb();
  clearTokens();
});

describe('Tasks API', () => {
  let token;
  let tokenB;

  beforeEach(async () => {
    token = await registerVerifyLogin('usera@test.com');
    tokenB = await registerVerifyLogin('userb@test.com');
  });

  describe('Create', () => {
    it('POST /tasks valid -> 201', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'My Task', description: 'desc', completed: false });
      expect(res.status).toBe(201);
      expect(res.body.data.task.title).toBe('My Task');
      expect(res.body.data.task.completed).toBe(false);
    });

    it('POST /tasks minimal (title only) -> 201', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Minimal' });
      expect(res.status).toBe(201);
      expect(res.body.data.task.description).toBe('');
    });

    it('POST /tasks with dueDate -> 201', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Dated', dueDate: '2026-12-01T00:00:00.000Z' });
      expect(res.status).toBe(201);
      expect(res.body.data.task.dueDate).toBeTruthy();
    });

    it('POST /tasks empty title -> 400', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: '' });
      expect(res.status).toBe(400);
    });

    it('POST /tasks missing title -> 400', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({});
      expect(res.status).toBe(400);
    });

    it('POST /tasks too-long title -> 400', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'a'.repeat(201) });
      expect(res.status).toBe(400);
    });

    it('POST /tasks invalid completed -> 400', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'T', completed: 'yes' });
      expect(res.status).toBe(400);
    });

    it('POST /tasks invalid dueDate -> 400', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'T', dueDate: 'not-date' });
      expect(res.status).toBe(400);
    });

    it('POST /tasks without token -> 401', async () => {
      const res = await request(app).post('/api/tasks').send({ title: 'T' });
      expect(res.status).toBe(401);
    });

    it('POST /tasks malformed JSON -> 400', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json').send('{bad');
      expect(res.status).toBe(400);
    });
  });

  describe('List', () => {
    it('GET /tasks -> 200 with count and array', async () => {
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'A' });
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'B' });
      const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(2);
      expect(Array.isArray(res.body.data.tasks)).toBe(true);
    });

    it('GET /tasks without token -> 401', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });

    it('GET /tasks only own tasks', async () => {
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'A private' });
      const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(0);
    });
  });

  describe('Get single', () => {
    it('GET /tasks/:id valid -> 200', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Single' });
      const id = created.body.data.task.id;
      const res = await request(app).get(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.task.id).toBe(id);
    });

    it('GET /tasks/:id nonexistent -> 404', async () => {
      const res = await request(app).get('/api/tasks/999999').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it('GET /tasks/:id invalid id -> 400', async () => {
      const res = await request(app).get('/api/tasks/abc').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });

    it('GET /tasks/:id other user -> 404', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Private' });
      const id = created.body.data.task.id;
      const res = await request(app).get(`/api/tasks/${id}`).set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(404);
    });

    it('GET /tasks/:id without token -> 401', async () => {
      const res = await request(app).get('/api/tasks/1');
      expect(res.status).toBe(401);
    });
  });

  describe('Update', () => {
    it('PUT /tasks/:id valid -> 200 updated', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Orig', completed: false });
      const id = created.body.data.task.id;
      const res = await request(app).put(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated', completed: true });
      expect(res.status).toBe(200);
      expect(res.body.data.task.title).toBe('Updated');
      expect(res.body.data.task.completed).toBe(true);
    });

    it('PUT /tasks/:id partial update preserves fields', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Orig', description: 'd', completed: false });
      const id = created.body.data.task.id;
      const res = await request(app).put(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`).send({ completed: true });
      expect(res.status).toBe(200);
      expect(res.body.data.task.title).toBe('Orig');
      expect(res.body.data.task.description).toBe('d');
      expect(res.body.data.task.completed).toBe(true);
    });

    it('PUT /tasks/:id nonexistent -> 404', async () => {
      const res = await request(app).put('/api/tasks/999999').set('Authorization', `Bearer ${token}`).send({ title: 'X' });
      expect(res.status).toBe(404);
    });

    it('PUT /tasks/:id invalid id -> 400', async () => {
      const res = await request(app).put('/api/tasks/abc').set('Authorization', `Bearer ${token}`).send({ title: 'X' });
      expect(res.status).toBe(400);
    });

    it('PUT /tasks/:id other user -> 404', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Private' });
      const id = created.body.data.task.id;
      const res = await request(app).put(`/api/tasks/${id}`).set('Authorization', `Bearer ${tokenB}`).send({ title: 'Hacked' });
      expect(res.status).toBe(404);
    });

    it('PUT /tasks/:id invalid data -> 400', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Orig' });
      const id = created.body.data.task.id;
      const res = await request(app).put(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`).send({ title: '' });
      expect(res.status).toBe(400);
    });

    it('PUT /tasks/:id without token -> 401', async () => {
      const res = await request(app).put('/api/tasks/1').send({ title: 'X' });
      expect(res.status).toBe(401);
    });

    it('PUT dueDate change resets reminder_sent', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'T', dueDate: '2026-12-01T00:00:00.000Z' });
      const id = created.body.data.task.id;
      // set reminder_sent true directly
      await db.query('UPDATE tasks SET reminder_sent = TRUE WHERE id = $1', [id]);
      const res = await request(app).put(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`).send({ dueDate: '2026-12-02T00:00:00.000Z' });
      expect(res.status).toBe(200);
      const row = await db.query('SELECT reminder_sent FROM tasks WHERE id = $1', [id]);
      expect(row.rows[0].reminder_sent).toBe(false);
    });
  });

  describe('Delete', () => {
    it('DELETE /tasks/:id valid -> 200 then 404', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'ToDelete' });
      const id = created.body.data.task.id;
      const del = await request(app).delete(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`);
      expect(del.status).toBe(200);
      const get = await request(app).get(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`);
      expect(get.status).toBe(404);
    });

    it('DELETE /tasks/:id nonexistent -> 404', async () => {
      const res = await request(app).delete('/api/tasks/999999').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it('DELETE /tasks/:id invalid id -> 400', async () => {
      const res = await request(app).delete('/api/tasks/abc').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });

    it('DELETE /tasks/:id other user -> 404', async () => {
      const created = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'Private' });
      const id = created.body.data.task.id;
      const res = await request(app).delete(`/api/tasks/${id}`).set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(404);
      // still exists for owner
      const get = await request(app).get(`/api/tasks/${id}`).set('Authorization', `Bearer ${token}`);
      expect(get.status).toBe(200);
    });

    it('DELETE /tasks/:id without token -> 401', async () => {
      const res = await request(app).delete('/api/tasks/1');
      expect(res.status).toBe(401);
    });
  });

  describe('Root & health & 404', () => {
    it('GET / -> 200', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
    it('GET /api/health -> 200', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
    it('unknown route -> 404', async () => {
      const res = await request(app).get('/api/nope');
      expect(res.status).toBe(404);
    });
  });
});