-- Migration: Add categories table and link tasks to categories
-- Date: 2026-11-27
-- Description: Introduces a third related table (categories) owned by users,
--              and an optional category_id FK on tasks (SET NULL on delete).

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT categories_user_name_unique UNIQUE (user_id, name)
);

-- Link tasks to categories (nullable; category deletion sets NULL)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);

-- Rollback (run manually if needed):
-- DROP INDEX IF EXISTS idx_tasks_category_id;
-- DROP INDEX IF EXISTS idx_tasks_user_id;
-- DROP INDEX IF EXISTS idx_categories_user_id;
-- ALTER TABLE tasks DROP COLUMN IF EXISTS category_id;
-- DROP TABLE IF EXISTS categories;