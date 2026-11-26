jest.mock('../../services/emailService', () => require('../helpers/emailMock'));

const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');
const emailMock = require('../helpers/emailMock');

async function clearDb() {
  await db.query('DELETE FROM tasks');
  await db.query('DELETE FROM categories');
  await db.query('DELETE FROM users');
}

function clearTokens() {
  Object.keys(emailMock.__verificationTokens).forEach((k) => delete emailMock.__verificationTokens[k]);
  Object.keys(emailMock.__resetTokens).forEach((k) => delete emailMock.__resetTokens[k]);
}

async function registerVerifyLogin(email, password = 'TestPass123') {
  await request(app).post('/api/auth/register').send({ name: 'Cat User', email, password });
  const token = emailMock.__verificationTokens[email];
  await request(app).get('/api/auth/verify-email').query({ token });
  const login = await request(app).post('/api/auth/login').send({ email, password });
  return login.body.data.token;
}

beforeEach(async () => {
  await clearDb();
  clearTokens();
});

describe('Categories API', () => {
  let token;
  let tokenB;

  beforeEach(async () => {
    token = await registerVerifyLogin('usera@test.com');
    tokenB = await registerVerifyLogin('userb@test.com');
  });

  describe('Auth guard', () => {
    it('GET /categories without token -> 401', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(401);
    });
    it('POST /categories without token -> 401', async () => {
      const res = await request(app).post('/api/categories').send({ name: 'X' });
      expect(res.status).toBe(401);
    });
  });

  describe('Create', () => {
    it('POST valid -> 201', async () => {
      const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Work' });
      expect(res.status).toBe(201);
      expect(res.body.data.category.name).toBe('Work');
      expect(res.body.data.category.userId).toBeTruthy();
    });
    it('POST missing name -> 400', async () => {
      const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({});
      expect(res.status).toBe(400);
    });
    it('POST empty name -> 400', async () => {
      const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: '' });
      expect(res.status).toBe(400);
    });
    it('POST too-long name -> 400', async () => {
      const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'a'.repeat(101) });
      expect(res.status).toBe(400);
    });
    it('POST duplicate name for same user -> 409', async () => {
      await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Dup' });
      const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Dup' });
      expect(res.status).toBe(409);
    });
    it('same name allowed for different users', async () => {
      await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Shared' });
      const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${tokenB}`).send({ name: 'Shared' });
      expect(res.status).toBe(201);
    });
  });

  describe('List', () => {
    it('GET returns own categories only', async () => {
      await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'A' });
      const res = await request(app).get('/api/categories').set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(0);
    });
    it('GET returns count and array', async () => {
      await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'A' });
      await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'B' });
      const res = await request(app).get('/api/categories').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(2);
      expect(Array.isArray(res.body.data.categories)).toBe(true);
    });
  });

  describe('Get single', () => {
    it('GET valid -> 200', async () => {
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Single' });
      const id = created.body.data.category.id;
      const res = await request(app).get(`/api/categories/${id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.category.id).toBe(id);
    });
    it('GET nonexistent -> 404', async () => {
      const res = await request(app).get('/api/categories/999999').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
    it('GET invalid id -> 400', async () => {
      const res = await request(app).get('/api/categories/abc').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });
    it('GET other user -> 404', async () => {
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Private' });
      const id = created.body.data.category.id;
      const res = await request(app).get(`/api/categories/${id}`).set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(404);
    });
  });

  describe('Update', () => {
    it('PUT valid -> 200', async () => {
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Orig' });
      const id = created.body.data.category.id;
      const res = await request(app).put(`/api/categories/${id}`).set('Authorization', `Bearer ${token}`).send({ name: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body.data.category.name).toBe('Updated');
    });
    it('PUT nonexistent -> 404', async () => {
      const res = await request(app).put('/api/categories/999999').set('Authorization', `Bearer ${token}`).send({ name: 'X' });
      expect(res.status).toBe(404);
    });
    it('PUT invalid id -> 400', async () => {
      const res = await request(app).put('/api/categories/abc').set('Authorization', `Bearer ${token}`).send({ name: 'X' });
      expect(res.status).toBe(400);
    });
    it('PUT other user -> 404', async () => {
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Private' });
      const id = created.body.data.category.id;
      const res = await request(app).put(`/api/categories/${id}`).set('Authorization', `Bearer ${tokenB}`).send({ name: 'Hacked' });
      expect(res.status).toBe(404);
    });
    it('PUT empty name -> 400', async () => {
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Orig' });
      const id = created.body.data.category.id;
      const res = await request(app).put(`/api/categories/${id}`).set('Authorization', `Bearer ${token}`).send({ name: '' });
      expect(res.status).toBe(400);
    });
    it('PUT duplicate name -> 409', async () => {
      await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'A' });
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'B' });
      const id = created.body.data.category.id;
      const res = await request(app).put(`/api/categories/${id}`).set('Authorization', `Bearer ${token}`).send({ name: 'A' });
      expect(res.status).toBe(409);
    });
  });

  describe('Delete', () => {
    it('DELETE valid -> 200 then 404', async () => {
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'ToDelete' });
      const id = created.body.data.category.id;
      const del = await request(app).delete(`/api/categories/${id}`).set('Authorization', `Bearer ${token}`);
      expect(del.status).toBe(200);
      const get = await request(app).get(`/api/categories/${id}`).set('Authorization', `Bearer ${token}`);
      expect(get.status).toBe(404);
    });
    it('DELETE nonexistent -> 404', async () => {
      const res = await request(app).delete('/api/categories/999999').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
    it('DELETE invalid id -> 400', async () => {
      const res = await request(app).delete('/api/categories/abc').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });
    it('DELETE other user -> 404', async () => {
      const created = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Private' });
      const id = created.body.data.category.id;
      const res = await request(app).delete(`/api/categories/${id}`).set('Authorization', `Bearer ${tokenB}`);
      expect(res.status).toBe(404);
    });
  });

  describe('Category-task relationship', () => {
    it('deleting a category sets task.category_id to null', async () => {
      const cat = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Work' });
      const catId = cat.body.data.category.id;
      const task = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'T', categoryId: catId });
      const taskId = task.body.data.task.id;
      expect(task.body.data.task.categoryId).toBe(catId);
      await request(app).delete(`/api/categories/${catId}`).set('Authorization', `Bearer ${token}`);
      const row = await db.query('SELECT category_id FROM tasks WHERE id = $1', [taskId]);
      expect(row.rows[0].category_id).toBeNull();
    });
    it('creating task with categoryId stores it', async () => {
      const cat = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Work' });
      const catId = cat.body.data.category.id;
      const task = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'T', categoryId: catId });
      expect(task.status).toBe(201);
      expect(task.body.data.task.categoryId).toBe(catId);
    });
    it('creating task with invalid categoryId -> 500 or FK error (expect non-201)', async () => {
      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'T', categoryId: 999999 });
      // FK violation should not create the task
      expect(res.status).not.toBe(201);
    });
  });

  describe('Root & health', () => {
    it('GET /api/health -> 200', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
    });
  });
});