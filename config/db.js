// ==========================================
// DATABASE SETUP — PostgreSQL Connection
// Uses pg (node-postgres) for hosted PostgreSQL
// ==========================================

const { Pool } = require('pg');

// Connection string from environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL environment variable');
  process.exit(1);
}

// Create connection pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }, // Required for Neon/Render/Railway
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
});

// Initialize database tables
async function initDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create tasks table
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

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Initialize on startup
initDatabase().catch((err) => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});

// Export pool and a query helper
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
