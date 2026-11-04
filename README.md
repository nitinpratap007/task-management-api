# Task Management REST API

A complete, functional REST API for personal task management with JWT authentication, built with Node.js, Express, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js
- **Database:** PostgreSQL (via `pg`)
- **Authentication:** JWT (`jsonwebtoken`)
- **Password Hashing:** `bcryptjs`
- **Input Validation:** `express-validator`
- **Environment:** `dotenv`

## Features

- User registration and login with JWT authentication
- Passwords hashed with bcrypt (never stored or returned as plaintext)
- Full CRUD operations for tasks
- Protected routes require a valid `Authorization: Bearer <token>` header
- Per-user task ownership — users can only access their own tasks
- Input validation with clear error messages
- Consistent HTTP status codes (200, 201, 400, 401, 404, 409, 500)
- Persistent PostgreSQL database (survives server restarts)
- Centralized error handling and 404 handling
- Configurable CORS
- Security headers

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- PostgreSQL database (local or hosted, e.g., Neon, Supabase, Railway, Render)

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env from the example template
copy .env.example .env   (Windows)
# or
cp .env.example .env     (macOS/Linux)

# 3. Edit .env and set DATABASE_URL and JWT_SECRET
```

## Environment Setup

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your_random_secret_minimum_32_characters
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require
# Optional: comma-separated list of allowed CORS origins
# ALLOWED_ORIGINS=http://localhost:5173
```

- `PORT` — port the server listens on (default 3000)
- `JWT_SECRET` — secret key for JWT tokens. **Never share this.**
- `JWT_EXPIRES_IN` — token expiration (e.g. `24h`)
- `DATABASE_URL` — PostgreSQL connection string
- `ALLOWED_ORIGINS` — comma-separated CORS origins (optional in dev)

## How to Start

```bash
# Production mode
npm start

# Development mode (auto-restart)
npm run dev
```

The server runs at `http://localhost:3000`.

## Database Setup

The database tables are created automatically on first startup. No manual migration needed.

Tables:
- `users` (id, name, email, password_hash, created_at)
- `tasks` (id, user_id, title, description, completed, created_at, updated_at)

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
Response (200): `{ "count": N, "tasks": [ ... ] }`

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

## Automated Tests

```bash
npm test
```

## Deploy to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up (GitHub login recommended)

### Step 2: Create Web Service
1. Dashboard → **New** → **Web Service**
2. Connect your GitHub repo: `task-management-api`
3. Configure:
   - **Name:** `task-management-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 3: Set Environment Variables
In Render dashboard → Environment:
| Key | Value |
|-----|-------|
| `PORT` | `10000` (Render sets this automatically, but you can override) |
| `JWT_SECRET` | Your strong secret (generate one) |
| `JWT_EXPIRES_IN` | `24h` |
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL (e.g., `https://your-app.vercel.app`) |

### Step 4: Deploy
Click **Create Web Service**. Render will build and deploy.

Your backend URL will be: `https://task-management-api.onrender.com`

### Step 5: Verify
Open: `https://task-management-api.onrender.com/api/health`
Expected: `{"status":"ok","timestamp":"..."}`

## Security Limitations & Future Improvements

- No rate limiting on auth endpoints
- No refresh token mechanism
- No email verification
- No HTTPS configuration (handled by Render)
- CORS configured via ALLOWED_ORIGINS env var

Do not commit `.env`, `node_modules/`, or `data/` to Git.
