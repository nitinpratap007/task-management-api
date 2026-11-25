jest.mock('pg', () => {
  const mPool = { on: jest.fn(), query: jest.fn() };
  return { Pool: jest.fn(() => mPool) };
});

describe('config/db production branch', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://u:p@localhost/db';
  });
  afterEach(() => {
    process.env.NODE_ENV = 'test';
    delete process.env.DATABASE_URL;
  });

  it('creates a pool and exports helpers', () => {
    const db = require('../../config/db');
    expect(db.pool).toBeDefined();
    expect(typeof db.query).toBe('function');
    expect(typeof db.initDatabase).toBe('function');
    expect(db.isTest).toBe(false);
  });

  it('initDatabase runs schema queries', async () => {
    const db = require('../../config/db');
    const pg = require('pg');
    const pool = pg.Pool.mock.results[pg.Pool.mock.results.length - 1].value;
    pool.query.mockResolvedValue({ rows: [] });
    await db.initDatabase();
    expect(pool.query).toHaveBeenCalled();
  });

  it('throws when DATABASE_URL missing', () => {
    delete process.env.DATABASE_URL;
    expect(() => require('../../config/db')).toThrow();
  });
});