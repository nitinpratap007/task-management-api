// Runs after Jest test framework is installed.
const db = require('../config/db');

beforeAll(async () => {
  await db.initDatabase();
});

afterAll(async () => {
  try {
    await db.pool.end();
  } catch (e) {
    // ignore
  }
});