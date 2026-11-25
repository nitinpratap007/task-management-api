// Runs before test framework and before any test file requires app modules.
process.env.NODE_ENV = 'test';

const path = require('path');
const dotenv = require('dotenv');

// Load test-only env (never production values).
dotenv.config({ path: path.join(__dirname, '..', '.env.test'), override: true });

// Safety guard: refuse to run tests against the production Neon database.
const dbUrl = process.env.DATABASE_URL || '';
if (/neon\.tech/i.test(dbUrl) || /ep-.*-pooler/i.test(dbUrl)) {
  throw new Error('SAFETY: Production DATABASE_URL detected in test environment. Aborting.');
}

if (!process.env.JWT_SECRET) {
  throw new Error('SAFETY: JWT_SECRET missing in test environment.');
}