// ==========================================
// DATABASE SETUP — SQLite Connection + Tables
// Persistent file-based database using better-sqlite3
// ==========================================

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Database file path: configurable via DB_PATH env var, defaults to project_root/data/app.db
// Making this configurable allows automated tests to use an isolated database.
const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '..', 'data', 'app.db');

// Ensure the data folder exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Open (or create) the database file
const db = new Database(dbPath);

// Enable foreign key constraints (off by default in SQLite)
db.pragma('foreign_keys = ON');

// Create tables if they do not already exist.
// Data survives server restarts; we never DROP or reset on startup.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    completed   INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
