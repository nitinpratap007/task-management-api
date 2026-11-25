# Task Management REST API — WA-5 Authentication System

A complete, functional REST API for personal task management with JWT authentication, email verification, and password reset, built with Node.js, Express, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js
- **Database:** PostgreSQL (via `pg`)
- **Authentication:** JWT (`jsonwebtoken`)
- **Password Hashing:** `bcryptjs`
- **Input Validation:** `express-validator`
- **Email:** `nodemailer`
- **Environment:** `dotenv`

## Features

### WA-2 (Original)
- User registration and login with JWT authentication
- Passwords hashed with bcrypt (never stored or returned as plaintext)
- Full CRUD operations for tasks
- Protected routes require a valid `Authorization: Bearer <token>` header
- Per-user task ownership
- Input validation with clear error messages
- Consistent HTTP status codes
- Persistent PostgreSQL database
- Centralized error handling

### WA-5 (New)
- **Email verification on registration** — account starts unverified
- **Unverified users cannot log in** — must verify email first
- **Forgot password** — sends reset link via email
- **Reset password** — validates reset token, updates password
- **Secure token handling** — SHA-256 hashed tokens, single-use, expiry
- **Protected `/me` route** — returns authenticated user info
- **Resend verification** — with generic response (no account enumeration)
- **Generic error messages** — login/forgot-password don't reveal account existence

## Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL database (local or hosted)
- SMTP email service (Mailtrap for local testing)

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env from template
copy .env.example .env   (Windows)
# cp .env.example .env   (macOS/Linux)

# 3. Edit .env with your values
```

## Environment Setup

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your_random_secret_minimum_32_characters
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require

# Email (use Mailtrap for local testing: https://mailtrap.io)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@taskmanagement.com
APP_BASE_URL=http://localhost:3000

# Optional
# ALLOWED_ORIGINS=http://localhost:5173
```

## Database Setup

Tables are created automatically on first startup. Migration adds auth columns.

### Manual Migration (if needed)
```sql
-- Run in your PostgreSQL database
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;
```

## How to Start

```bash
# Production mode
npm start

# Development mode (auto-restart)
npm run dev
```

Server runs at `http://localhost:3000`.

## Email Setup (Mailtrap)

1. Go to https://mailtrap.io → Sign up (free)
2. Create an inbox
3. Copy SMTP credentials
4. Set in `.env`:
   - `EMAIL_HOST=smtp.mailtrap.io`
   - `EMAIL_PORT=2525`
   - `EMAIL_USER=your_username`
   - `EMAIL_PASS=your_password`
5. Test: Register a user → check Mailtrap inbox for verification email

## API Endpoints

### Auth (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register (unverified) | No |
| POST | `/api/auth/login` | Login (verified only) | No |
| GET/POST | `/api/auth/verify-email` | Verify email token | No |
| POST | `/api/auth/resend-verification` | Resend verification | No |
| POST | `/api/auth/forgot-password` | Request reset link | No |
| POST | `/api/auth/reset-password` | Reset password | No |

### Auth (Protected)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/auth/me` | Get current user | Bearer |

### Tasks (Protected)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks` | Create a task | Yes |
| GET | `/api/tasks` | List user's tasks | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |

## Authentication Flow

### 1. Registration
```
POST /api/auth/register
{ "name": "John", "email": "john@test.com", "password": "TestPass123" }
→ 201: Account created (unverified), verification email sent
```

### 2. Email Verification
```
GET /api/auth/verify-email?token=<raw-token-from-email>
→ 200: Email verified successfully
```

### 3. Login (after verification)
```
POST /api/auth/login
{ "email": "john@test.com", "password": "TestPass123" }
→ 200: JWT token returned
```

### 4. Login (before verification)
```
POST /api/auth/login
→ 403: Please verify your email before logging in
```

### 5. Forgot Password
```
POST /api/auth/forgot-password
{ "email": "john@test.com" }
→ 200: Generic response (doesn't reveal if email exists)
```

### 6. Reset Password
```
POST /api/auth/reset-password
{ "token": "<raw-token-from-email>", "newPassword": "NewPass123!" }
→ 200: Password reset successfully
```

### 7. Protected Route
```
GET /api/auth/me
Authorization: Bearer <jwt-token>
→ 200: User info (no password hash)
```

## Security Notes

- Passwords hashed with bcrypt (12 salt rounds)
- Verification/reset tokens stored as SHA-256 hashes (raw token only in email)
- Tokens are single-use (cleared after use)
- Token expiry: verification 24h, reset 1h
- JWT expiry: 24h (configurable)
- Generic error messages for login/forgot-password (no account enumeration)
- No secrets in source code
- No raw tokens in API responses or logs

## Known Limitations

- Email delivery requires SMTP configuration (Mailtrap for local testing)
- No rate limiting on auth endpoints
- No refresh token mechanism
- No email verification for existing (legacy) users
- No account lockout after failed attempts

## Future Improvements

- Add rate limiting (express-rate-limit)
- Add refresh token support
- Add email verification for legacy users
- Add account lockout
- Add 2FA support
- Add OAuth (Google, GitHub)

## Automated Tests (WA-7)

### Testing Stack
- **Jest** — test runner, assertions, coverage
- **Supertest** — HTTP integration testing against the Express app
- **pg-mem** — in-memory PostgreSQL for isolated, repeatable tests

### Environment Configuration
Tests never use the production database. `NODE_ENV=test` is set automatically by Jest setup.

1. Test env file: `.env.test` (committed, test-only values, no secrets).
2. In-memory database: `pg-mem` (no external Postgres needed for tests).
3. Email delivery is mocked in integration tests; raw tokens are captured privately.

### Running Tests
```bash
npm test
```
Runs the Jest suite. Returns non-zero exit code on failure.

### Running Coverage
```bash
npm run test:coverage
```
Generates a coverage report. HTML report: `coverage/lcov-report/index.html`.

### Watch Mode
```bash
npm run test:watch
```

### Test Architecture
- `tests/setupEnv.js` — sets `NODE_ENV=test`, loads `.env.test`, safety guards.
- `tests/setupDb.js` — initializes in-memory schema, closes pool.
- `tests/unit/` — unit tests for `tokenUtils`, validators, email service, auth middleware, reminder scheduler, app CORS, db safety.
- `tests/integration/` — Supertest tests for health, auth, and tasks endpoints.
- `tests/helpers/emailMock.js` — test-only email mock capturing verification/reset tokens.

### Database Isolation
- Tests use an in-memory `pg-mem` database; production Neon `DATABASE_URL` is never used.
- A safety guard throws if a production Neon URL is detected in test mode.
- Each test file uses a fresh in-memory database.

### Mocking External Services
- Email sending is mocked (`tests/helpers/emailMock.js`); no real emails are sent.
- Verification/reset tokens are captured in-memory for assertions only.

### Troubleshooting
- **"SAFETY: Production DATABASE_URL detected"**: Remove `DATABASE_URL` from `.env.test` or environment.
- **Missing JWT_SECRET**: Ensure `.env.test` exists with `JWT_SECRET`.
- **Legacy tests**: `test/api.test.js` is outdated (SQLite-based) and is not run by `npm test`.

## Git Workflow

```bash
# Create feature branch
git checkout -b wa-5-authentication

# Make changes
git add .
git commit -m "feat: add email verification and password reset"

# Push feature branch
git push origin wa-5-authentication
```

Do not merge to main without review.
