-- Migration: Add authentication fields to users table
-- Date: 2026-11-16
-- Description: Adds email verification and password reset token fields

-- Add is_verified column (default false for new accounts)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Add verification token hash (SHA-256 of raw token)
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_hash TEXT;

-- Add verification token expiry
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMPTZ;

-- Add reset token hash (SHA-256 of raw token)
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT;

-- Add reset token expiry
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;

-- Rollback (run manually if needed):
-- ALTER TABLE users DROP COLUMN IF EXISTS is_verified;
-- ALTER TABLE users DROP COLUMN IF EXISTS verification_token_hash;
-- ALTER TABLE users DROP COLUMN IF EXISTS verification_token_expiry;
-- ALTER TABLE users DROP COLUMN IF EXISTS reset_token_hash;
-- ALTER TABLE users DROP COLUMN IF EXISTS reset_token_expiry;
