// ==========================================
// DATABASE SETUP — PostgreSQL Connection
// Uses pg (node-postgres) for hosted PostgreSQL
// In test mode (NODE_ENV=test) uses an in-memory pg-mem database.
// ==========================================

const isTest = process.env.NODE_ENV === 'test';

let pool;

if (isTest) {
  // SAFETY: never use the production DATABASE_URL in tests.
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    if (/neon\.tech/i.test(url) || /ep-.*-pooler/i.test(url)) {
      throw new Error('SAFETY: Refusing to use production DATABASE_URL in test mode.');
    }
  }
  const { newDb } = require('pg-mem');
  const memDb = newDb();
  const adapter = memDb.adapters.createPg();
  pool = new adapter.Pool();
} else {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL environment variable');
  }
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }, // Required for Neon/Render/Railway
  });
}

// Test connection (real DB only; pg-mem pool also supports events)
if (pool && typeof pool.on === 'function') {
  pool.on('connect', () => {
    if (!isTest) console.log('✅ Connected to PostgreSQL database');
  });
  pool.on('error', (err) => {
    console.error('❌ PostgreSQL pool error:', err.message);
  });
}

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Third related table: categories (user-owned grouping for tasks)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT categories_user_name_unique UNIQUE (user_id, name)
      );
    `);

    // Link tasks to categories (nullable; SET NULL when category deleted)
    await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;`);

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_hash TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMPTZ;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;`);

    await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;`);
    await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN NOT NULL DEFAULT FALSE;`);

    // Indexes for FK and frequent lookup columns
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);`);

    if (!isTest) console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Export pool and a query helper
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDatabase,
  isTest,
};