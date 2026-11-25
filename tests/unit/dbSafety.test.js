describe('config/db safety and error paths', () => {
  it('throws in test mode when production DATABASE_URL is set', () => {
    process.env.DATABASE_URL = 'postgresql://u:p@ep-foo-pooler.neon.tech/db';
    jest.resetModules();
    let thrown = null;
    try {
      require('../../config/db');
    } catch (e) {
      thrown = e;
    } finally {
      delete process.env.DATABASE_URL;
    }
    expect(thrown).not.toBeNull();
    expect(thrown.message).toMatch(/SAFETY/);
  });

  it('initDatabase throws on query failure', async () => {
    jest.resetModules();
    const db = require('../../config/db');
    const originalQuery = db.pool.query.bind(db.pool);
    db.pool.query = jest.fn().mockRejectedValue(new Error('boom'));
    await expect(db.initDatabase()).rejects.toThrow();
    db.pool.query = originalQuery;
  });
});