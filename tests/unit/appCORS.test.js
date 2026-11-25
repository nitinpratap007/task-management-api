describe('app CORS branches', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('handles preflight and allowed origin when ALLOWED_ORIGINS set', async () => {
    process.env.ALLOWED_ORIGINS = 'http://allowed.com';
    const app = require('../../app');
    const request = require('supertest');
    const preflight = await request(app).options('/api/health').set('Origin', 'http://allowed.com');
    expect(preflight.status).toBe(204);
    const ok = await request(app).get('/api/health').set('Origin', 'http://allowed.com');
    expect(ok.headers['access-control-allow-origin']).toBe('http://allowed.com');
    const blocked = await request(app).get('/api/health').set('Origin', 'http://evil.com');
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('reflects request origin in development mode', async () => {
    delete process.env.ALLOWED_ORIGINS;
    const app = require('../../app');
    const request = require('supertest');
    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    const noOrigin = await request(app).get('/api/health');
    expect(noOrigin.status).toBe(200);
  });
});