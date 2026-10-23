# Task Management REST API

A complete, functional REST API for personal task management with JWT authentication, built with Node.js, Express, and SQLite.

## Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js
- **Database:** SQLite (`better-sqlite3`) — file-based, zero configuration
- **Authentication:** JWT (`jsonwebtoken`)
- **Password Hashing:** `bcryptjs`
- **Input Validation:** `express-validator`
- **Environment:** `dotenv`
- **Dev:** `nodemon`

## Features

- User registration and login with JWT authentication
- Passwords hashed with bcrypt (never stored or returned as plaintext)
- Full CRUD operations for tasks
- Protected routes require a valid `Authorization: Bearer <token>` header
- Per-user task ownership — users can only access their own tasks
- Input validation with clear error messages
- Consistent HTTP status codes (200, 201, 400, 401, 404, 409, 500)
- Persistent SQLite database (survives server restarts)
- Centralized error handling and 404 handling

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env from the example template
copy .env.example .env   (Windows)
# or
cp .env.example .env     (macOS/Linux)

# 3. Edit .env and set a strong JWT_SECRET (minimum 32 characters)
```

## Environment Setup

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your_random_secret_minimum_32_characters
JWT_EXPIRES_IN=24h
# Optional: comma-separated list of allowed CORS origins (e.g. http://localhost:5173)
# ALLOWED_ORIGINS=http://localhost:5173
# Optional: custom SQLite database file path (defaults to data/app.db)
# DB_PATH=data/app.db
```

- `PORT` — port the server listens on (default 3000)
- `JWT_SECRET` — secret key used to sign and verify JWT tokens. **Never share this.** Generate a strong random string (32+ characters).
- `JWT_EXPIRES_IN` — token expiration (e.g. `24h`)

`.env` is excluded from version control via `.gitignore`. Only `.env.example` (with placeholders) is committed.

## How to Start

```bash
# Production mode
npm start

# Development mode (auto-restart on file changes)
npm run dev
```

The server runs at `http://localhost:3000`.

## API Endpoints

All task endpoints require header: `Authorization: Bearer <token>`

### Auth (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |

### Tasks (Protected)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks` | Create a task | Yes |
| GET | `/api/tasks` | List the authenticated user's tasks | Yes |
| GET | `/api/tasks/:id` | Retrieve a single task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

### Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |

## Example Requests & Responses

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nitin Pratap",
  "email": "nitin@example.com",
  "password": "MyPassword123"
}
```
Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "name": "Nitin Pratap", "email": "nitin@example.com" },
    "token": "eyJhbGciOi..."
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "nitin@example.com",
  "password": "MyPassword123"
}
```
Response (200): returns `token` and user info (no password hash).

### Create Task
```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Complete REST API",
  "description": "Build WA-2 project",
  "completed": false
}
```
Response (201): created task object.

### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```
Response (200): `{ "count": N, "tasks": [ ... ] }` — only the authenticated user's tasks.

### Get Single Task
```http
GET /api/tasks/1
Authorization: Bearer <token>
```
Response (200): single task object. (404 if not found or not owned by user.)

### Update Task
```http
PUT /api/tasks/1
Content-Type: application/json
Authorization: Bearer <token>

{
  "completed": true
}
```
Response (200): updated task object.

### Delete Task
```http
DELETE /api/tasks/1
Authorization: Bearer <token>
```
Response (200): `{ "success": true, "message": "Task deleted successfully" }`.

### Health Check
```http
GET /api/health
```
Response (200): `{ "status": "ok", "timestamp": "..." }`

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing, invalid, or expired token) |
| 404 | Not found |
| 409 | Conflict (duplicate email on register) |
| 500 | Internal server error |

## JWT Authentication

1. Register or log in via `/api/auth/register` or `/api/auth/login`.
2. Copy the `token` from the response.
3. Include it in every protected request header: `Authorization: Bearer <token>`.
4. Tokens expire after `JWT_EXPIRES_IN` (default 24h). Log in again to get a new token.

## Postman Setup

A Postman collection is included at `postman/Task-Management-API.postman_collection.json`.

1. Import the collection into Postman.
2. Create a Postman environment with variables:
   - `baseUrl` — e.g. `http://localhost:3000`
   - `token` — set after login
   - `taskId` — set after creating a task
3. Run requests in sequence: Health → Register → Login → Create Task → List/Get/Update/Delete Task.
4. Use the "Tests" tab in each request to assert status codes and save `token`/`taskId` as environment variables.

## Database Location & Persistence

- Database file: `data/app.db`
- Tables: `users` and `tasks`
- The database is **never** deleted or reset on server startup — data persists across restarts.
- Passwords are stored only as bcrypt hashes.
- `data/` is excluded from version control via `.gitignore`.

## Automated Tests

A real automated test suite is included at `test/api.test.js` (44 tests). It uses Node's built-in `http` module and an isolated test database (`data/test.db`) so real user data is never touched.

Run:

```bash
npm test
```

The suite verifies:
- Health endpoint
- Valid/invalid registration, duplicate email rejection
- Password stored as bcrypt hash (not plaintext)
- Valid/invalid login, JWT issuance
- Missing/invalid/expired token rejection on protected routes
- Full task CRUD (create, list, get, update, delete)
- Invalid task data rejection
- Nonexistent task handling (404)
- Cross-user access prevention (User A cannot read/update/delete User B's task)
- Task persistence across server restarts
- Malformed request handling without crashing

Expected output: `Total: 44 | Passed: 44 | Failed: 0`

## Project Structure

```
├── server.js              # Entry point
├── .env                   # Local environment (gitignored)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── package.json
├── package-lock.json
├── config/
│   └── db.js              # SQLite setup + tables
├── controllers/
│   ├── authController.js  # Register & Login
│   └── taskController.js  # Task CRUD
├── middleware/
│   └── auth.js            # JWT verification
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── taskRoutes.js      # Task endpoints
├── validators/
│   └── validators.js      # Input validation rules
├── data/
│   └── app.db             # SQLite database (gitignored)
├── postman/
│   └── Task-Management-API.postman_collection.json
└── README.md
```

## Security Limitations & Future Improvements

This project implements practical security measures (bcrypt hashing, JWT expiration, parameterized queries, per-user ownership, env-based secrets), but it is **not** production-secure as-is. Known limitations:

- No rate limiting on auth endpoints (brute-force login/register possible)
- No refresh token mechanism
- No password complexity requirements beyond length
- No email verification
- `better-sqlite3` is synchronous; suitable for low-to-moderate concurrency
- No HTTPS (use a reverse proxy / TLS in production)
- CORS not configured — configure `cors` with allowed origins for production

Do not commit `.env`, `node_modules/`, or `data/` to Git.
