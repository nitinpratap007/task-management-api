# WA-3 React Frontend — Zero to Hero Complete Handbook

> **For:** Valentius Kryptix Internship — WA-3 React Frontend Task
> **Backend:** WA-2 Task Management REST API (Node.js + Express + SQLite)
> **Goal:** Build a genuinely working React frontend connected to your real backend, test it, document it, publish it, and submit it.
> **Audience:** Complete beginner — no prior React, JSX, Router, API, npm, Git, or deployment experience required.

---

## TABLE OF CONTENTS

1. [Part 1 — Understand the Assignment](#part-1--understand-the-assignment)
2. [Part 2 — Prepare Your Computer](#part-2--prepare-your-computer)
3. [Part 3 — Inspect and Run WA-2 Backend](#part-3--inspect-and-run-wa-2-backend)
4. [Part 4 — Design the Project Architecture](#part-4--design-the-project-architecture)
5. [Part 5 — Create the React Application](#part-5--create-the-react-application)
6. [Part 6 — Configure the API URL](#part-6--configure-the-api-url)
7. [Part 7 — Implement the API Service](#part-7--implement-the-api-service)
8. [Part 8 — Implement Routing](#part-8--implement-routing)
9. [Part 9 — Build Reusable UI Components](#part-9--build-reusable-ui-components)
10. [Part 10 — Build the Task List Page](#part-10--build-the-task-list-page)
11. [Part 11 — Build the Task Details Page](#part-11--build-the-task-details-page)
12. [Part 12 — Build the Create/Edit Form](#part-12--build-the-createedit-form)
13. [Part 13 — Styling and Responsive Design](#part-13--styling-and-responsive-design)
14. [Part 14 — Complete Application Entry Point](#part-14--complete-application-entry-point)
15. [Part 15 — Run the Application](#part-15--run-the-application)
16. [Part 16 — Functional Testing](#part-16--functional-testing)
17. [Part 17 — Debugging Handbook](#part-17--debugging-handbook)
18. [Part 18 — Code Quality and Maintainability](#part-18--code-quality-and-maintainability)
19. [Part 19 — Build and Verify Production Output](#part-19--build-and-verify-production-output)
20. [Part 20 — README Documentation](#part-20--readme-documentation)
21. [Part 21 — Git and GitHub](#part-21--git-and-github)
22. [Part 22 — Deployment (Optional)](#part-22--deployment-optional)
23. [Part 23 — Internship Submission](#part-23--internship-submission)
24. [Part 24 — Learn and Explain Your Project](#part-24--learn-and-explain-your-project)
25. [Part 25 — Final Execution Roadmap](#part-25--final-execution-roadmap)
26. [Appendix A — Glossary](#appendix-a--glossary)
27. [Appendix B — Verified API Contract](#appendix-b--verified-api-contract)
28. [Appendix C — Unresolved Items](#appendix-c--unresolved-items)

---

# PART 1 — UNDERSTAND THE ASSIGNMENT

## 1.1 What WA-3 Requires

WA-3 is the **frontend** counterpart to your WA-2 backend. You must build a **React web application** that lets a user interact with the Task Management API you built in WA-2 through a browser interface.

**In simple English:** Instead of using Postman to create, view, edit, and delete tasks, you build a website (with buttons, forms, and pages) that does the same thing by talking to your backend API.

### What the Final Product Should Do

1. A user opens the website in a browser.
2. The user registers an account (name, email, password).
3. The user logs in and receives a JWT token.
4. The website stores the token and uses it for all subsequent requests.
5. The user sees a list of their tasks (fetched from the backend).
6. The user can view details of a single task.
7. The user can create a new task (title, description, completed status).
8. The user can edit an existing task.
9. The user can delete a task.
10. The website shows loading spinners while waiting for the API.
11. The website shows error messages when something goes wrong.
12. The website shows an empty state when there are no tasks.
13. The website works on both desktop and mobile screens.

### Core Concepts You Will Learn

| Concept | Simple Explanation |
|---------|-------------------|
| **React** | A JavaScript library for building user interfaces. Instead of writing HTML directly, you write JavaScript functions that return HTML-like code (JSX). |
| **Component** | A reusable piece of UI. Think of it like a LEGO brick — a button, a card, a navbar. You compose pages from components. |
| **JSX** | JavaScript XML. It looks like HTML but lives inside JavaScript. Example: `const element = <h1>Hello</h1>;` |
| **Props** | Data passed from a parent component to a child component. Like function arguments. |
| **State** | Data that changes over time inside a component. When state changes, React re-renders the component. |
| **React Router** | A library that lets you navigate between pages (URLs) without reloading the entire page. |
| **REST API** | A way for your frontend to talk to your backend over HTTP using URLs and JSON. |
| **CRUD** | Create, Read, Update, Delete — the four basic operations on data. |
| **Client-side validation** | Checking user input in the browser before sending it to the server. |
| **Loading state** | Showing a spinner or message while waiting for data from the API. |
| **Error state** | Showing an error message when the API request fails. |
| **Empty state** | Showing a helpful message when there is no data to display. |
| **Responsive design** | Making the UI look good on both large desktop screens and small mobile screens. |
| **Production build** | A optimized, minified version of your code ready for deployment. |

### Glossary

| Term | Definition |
|------|-----------|
| **npm** | Node Package Manager. Installs JavaScript libraries. |
| **Vite** | A fast build tool and dev server for modern web projects. |
| **fetch** | A browser API for making HTTP requests. |
| **useState** | A React Hook for managing state in a function component. |
| **useEffect** | A React Hook for running side effects (like API calls) after render. |
| **useParams** | A React Router Hook for reading URL parameters (like `:id`). |
| **useNavigate** | A React Router Hook for programmatically navigating to another page. |
| **Token** | A JWT string that proves the user is authenticated. |
| **Bearer token** | A token sent in the `Authorization: Bearer <token>` header. |
| **CORS** | Cross-Origin Resource Sharing. A browser security feature that controls which origins can access your API. |
| **SPA** | Single Page Application. The page doesn't fully reload when navigating. |
| **DOM** | Document Object Model. The browser's representation of the HTML page. |
| **JSX** | JavaScript XML. Syntax for writing HTML-like code in JavaScript. |
| **Hook** | A special function in React that lets you use state and other features in function components. |
| **Re-render** | When React updates the UI after state or props change. |
| **Dependency array** | The second argument to `useEffect` that controls when the effect runs. |

---

# PART 2 — PREPARE YOUR COMPUTER

## 2.1 What You Need

Before starting, you need:
1. **Node.js** (v18 or higher) — already installed (you used it for WA-2)
2. **npm** — comes with Node.js
3. **Git** — already installed (you used it for WA-2)
4. **Visual Studio Code** — code editor
5. **A web browser** — Chrome, Firefox, or Edge (for testing)

## 2.2 Verify Installations

Open PowerShell and run each command. You should see version numbers.

```powershell
node -v
```
Expected: `v24.13.0` (or similar v18+)

```powershell
npm -v
```
Expected: `11.6.2` (or similar)

```powershell
git --version
```
Expected: `git version 2.x.x`

If any command says "not recognized", install the tool:
- **Node.js**: https://nodejs.org → Download LTS → Install
- **Git**: https://git-scm.com → Download → Install

## 2.3 Open VS Code

1. Press `Windows key` → type `Visual Studio Code` → press Enter
2. If not installed: https://code.visualstudio.com → Download → Install

## 2.4 Open a Terminal in VS Code

1. In VS Code, press `` Ctrl + ` `` (backtick) to open the terminal
2. Or: Menu → Terminal → New Terminal
3. The terminal should show your current directory

## 2.5 Understand Terminal Directories

```powershell
# Show current directory
pwd

# List files in current directory
Get-ChildItem

# Move to a folder
cd "C:\path\to\folder"

# Move up one level
cd ..

# Move to a specific drive
E:
```

**Important:** Always check which folder you are in before running commands. The terminal prompt shows your current directory.

---

# PART 3 — INSPECT AND RUN WA-2 BACKEND

## 3.1 Locate Your Backend

Your WA-2 backend is at:
```
E:\web internship\task-management-api
```

## 3.2 Read package.json

Open `package.json` in VS Code. Key fields:

| Field | Value | Meaning |
|-------|-------|---------|
| `main` | `server.js` | Entry point |
| `scripts.start` | `node server.js` | Production start |
| `scripts.dev` | `nodemon server.js` | Development start (auto-restart) |
| `scripts.test` | `node test/api.test.js` | Run 44 automated tests |
| `type` | `commonjs` | Uses `require()` not `import` |

## 3.3 Server Entry Point

File: `server.js`

- Loads `.env` variables
- Validates `JWT_SECRET` exists
- Creates Express app
- Sets up security headers, CORS, JSON parser
- Mounts routes at `/api/auth` and `/api/tasks`
- Health check at `/api/health`
- Listens on port `3000` (or `PORT` env var)

## 3.4 Start the Backend

```powershell
cd "E:\web internship\task-management-api"
npm run dev
```

Expected output:
```
✅ Server is running at http://localhost:3000
📋 Health check: http://localhost:3000/api/health
```

## 3.5 Test the Backend

Open browser: http://localhost:3000/api/health

Expected: `{"status":"ok","timestamp":"..."}`

## 3.6 Verified API Contract

### Auth Endpoints (Public — No Token Required)

#### POST /api/auth/register

**Request:**
```json
{
  "name": "Nitin Pratap",
  "email": "nitin@example.com",
  "password": "MyPassword123"
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "name": "Nitin Pratap", "email": "nitin@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error (400) — Validation failed:**
```json
{
  "success": false,
  "errors": [
    { "field": "name", "message": "Name is required" },
    { "field": "email", "message": "Valid email is required" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

**Error (409) — Duplicate email:**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Validation rules:**
- `name`: required, max 100 characters, trimmed
- `email`: required, valid email format, normalized (lowercase)
- `password`: required, 8-72 characters

#### POST /api/auth/login

**Request:**
```json
{
  "email": "nitin@example.com",
  "password": "MyPassword123"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "name": "Nitin Pratap", "email": "nitin@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error (401) — Invalid credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error (400) — Validation failed:**
```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

### Task Endpoints (Protected — Requires Bearer Token)

All task endpoints require header: `Authorization: Bearer <token>`

#### GET /api/tasks

**Success (200):**
```json
{
  "success": true,
  "data": {
    "count": 2,
    "tasks": [
      {
        "id": 1,
        "userId": 1,
        "title": "Complete REST API",
        "description": "Build WA-2 project",
        "completed": false,
        "createdAt": "2026-10-23 07:40:40",
        "updatedAt": "2026-10-23 07:40:40"
      }
    ]
  }
}
```

**Error (401) — No token:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### GET /api/tasks/:id

**Success (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "userId": 1,
      "title": "Complete REST API",
      "description": "Build WA-2 project",
      "completed": false,
      "createdAt": "2026-10-23 07:40:40",
      "updatedAt": "2026-10-23 07:40:40"
    }
  }
}
```

**Error (400) — Invalid ID:**
```json
{
  "success": false,
  "message": "Invalid task ID"
}
```

**Error (404) — Not found:**
```json
{
  "success": false,
  "message": "Task not found"
}
```

#### POST /api/tasks

**Request:**
```json
{
  "title": "Learn React",
  "description": "Build WA-3 frontend",
  "completed": false
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 2,
      "userId": 1,
      "title": "Learn React",
      "description": "Build WA-3 frontend",
      "completed": false,
      "createdAt": "2026-10-23 08:00:00",
      "updatedAt": "2026-10-23 08:00:00"
    }
  }
}
```

**Validation rules:**
- `title`: required, max 200 characters, trimmed
- `description`: optional, max 2000 characters, trimmed
- `completed`: optional, boolean (true/false)

**Error (400) — Empty title:**
```json
{
  "success": false,
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

#### PUT /api/tasks/:id

**Request (partial update — only send fields you want to change):**
```json
{
  "title": "Learn React (updated)",
  "completed": true
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": 2,
      "userId": 1,
      "title": "Learn React (updated)",
      "description": "Build WA-3 frontend",
      "completed": true,
      "createdAt": "2026-10-23 08:00:00",
      "updatedAt": "2026-10-23 08:00:00"
    }
  }
}
```

#### DELETE /api/tasks/:id

**Success (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error (404) — Not found:**
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Health Check (Public)

#### GET /api/health

**Success (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-10-23T07:40:30.937Z"
}
```

### Summary API Contract Table

| Operation | Method | Path | Auth | Request Body | Success Response | Error Codes |
|-----------|--------|------|------|-------------|-----------------|-------------|
| Health | GET | `/api/health` | No | None | `{ status, timestamp }` | — |
| Register | POST | `/api/auth/register` | No | `{ name, email, password }` | `{ success, data: { user, token } }` | 400, 409 |
| Login | POST | `/api/auth/login` | No | `{ email, password }` | `{ success, data: { user, token } }` | 400, 401 |
| List Tasks | GET | `/api/tasks` | Bearer | None | `{ success, data: { count, tasks } }` | 401 |
| Get Task | GET | `/api/tasks/:id` | Bearer | None | `{ success, data: { task } }` | 400, 401, 404 |
| Create Task | POST | `/api/tasks` | Bearer | `{ title, description?, completed? }` | `{ success, data: { task } }` | 400, 401 |
| Update Task | PUT | `/api/tasks/:id` | Bearer | `{ title?, description?, completed? }` | `{ success, data: { task } }` | 400, 401, 404 |
| Delete Task | DELETE | `/api/tasks/:id` | Bearer | None | `{ success, message }` | 400, 401, 404 |

### Task Object Fields

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `id` | number | Backend (auto) | Unique task ID |
| `userId` | number | Backend (from JWT) | Owner's user ID |
| `title` | string | Client (required) | Task title (1-200 chars) |
| `description` | string | Client (optional) | Task description (0-2000 chars) |
| `completed` | boolean | Client (optional) | Completion status (default false) |
| `createdAt` | string | Backend (auto) | Creation timestamp |
| `updatedAt` | string | Backend (auto) | Last update timestamp |

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `JWT_SECRET` | Yes | — | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | No | 24h | Token expiration |
| `ALLOWED_ORIGINS` | No | (all in dev) | Comma-separated CORS origins |
| `DB_PATH` | No | data/app.db | SQLite database file path |

### Backend Known Limitations

- No rate limiting on auth endpoints
- No refresh token mechanism
- No email verification
- `better-sqlite3` is synchronous
- CORS defaults to permissive in development
- No HTTPS (use reverse proxy in production)

---

# PART 4 — DESIGN THE PROJECT ARCHITECTURE

## 4.1 Recommended Folder Structure

Create a **separate** frontend project (not inside the backend folder). This keeps frontend and backend independent.

```
E:\web internship\
├── task-management-api\          (WA-2 backend — DO NOT MODIFY)
└── task-management-frontend\     (WA-3 frontend — NEW)
    ├── public\
    ├── src\
    │   ├── components\
    │   │   ├── Navbar.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── ErrorMessage.jsx
    │   │   └── EmptyState.jsx
    │   ├── pages\
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── TaskListPage.jsx
    │   │   ├── TaskDetailsPage.jsx
    │   │   └── TaskFormPage.jsx
    │   ├── services\
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── README.md
```

## 4.2 Why This Structure

| Folder/File | Purpose |
|-------------|---------|
| `src/components/` | Reusable UI pieces (navbar, cards, spinners) |
| `src/pages/` | Full page components (one per route) |
| `src/services/` | API communication (all fetch calls in one place) |
| `src/App.jsx` | Root component with routing |
| `src/main.jsx` | Entry point — mounts React into HTML |
| `src/index.css` | Global styles |
| `.env` | Environment variables (API URL) |
| `.env.example` | Template for other developers |
| `vite.config.js` | Vite build configuration |

## 4.3 How to Create Folders in VS Code

1. Open VS Code
2. Open the `task-management-frontend` folder (File → Open Folder)
3. In the Explorer panel (left sidebar), right-click → **New Folder**
4. Create: `src`, `src/components`, `src/pages`, `src/services`
5. Right-click → **New File** to create files

---

# PART 5 — CREATE THE REACT APPLICATION

## 5.1 Goal

Create a new React project using Vite and install React Router.

## 5.2 Why Vite

Vite is a modern build tool that:
- Starts the dev server instantly (no 10-second wait)
- Provides Hot Module Replacement (changes appear instantly)
- Builds optimized production bundles
- Is the recommended way to create React apps in 2025/2026

## 5.3 Commands

Open PowerShell. Navigate to your workspace (NOT inside the backend folder):

```powershell
cd "E:\web internship"
```

Create the React app:

```powershell
npm create vite@latest task-management-frontend -- --template react
```

**What this does:**
- `npm create vite@latest` — runs the Vite scaffolding tool
- `task-management-frontend` — your project folder name
- `-- --template react` — uses the React template (JavaScript, not TypeScript)

When prompted:
- **Select a framework:** React
- **Select a variant:** JavaScript

Then:

```powershell
cd task-management-frontend
npm install
```

**What this does:**
- `cd task-management-frontend` — enters the project folder
- `npm install` — installs all dependencies listed in package.json (React, ReactDOM, Vite, etc.)

Install React Router:

```powershell
npm install react-router-dom
```

**What this does:**
- Installs React Router v7 (the latest version) for client-side routing

## 5.4 Verify

```powershell
npm run dev
```

Expected output:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open http://localhost:5173/ in your browser. You should see the Vite + React starter page.

Press `Ctrl + C` to stop the server.

## 5.5 What Was Created

| File/Folder | Purpose |
|-------------|---------|
| `package.json` | Project metadata and dependencies |
| `package-lock.json` | Exact dependency versions (auto-generated) |
| `node_modules/` | Installed packages (auto-generated, gitignored) |
| `vite.config.js` | Vite configuration |
| `index.html` | HTML entry point (React mounts here) |
| `src/main.jsx` | JavaScript entry point |
| `src/App.jsx` | Root React component |
| `src/App.css` | Default styles (we'll replace) |
| `src/index.css` | Global styles (we'll replace) |
| `public/` | Static assets (favicon, etc.) |
| `.gitignore` | Git ignore rules (auto-generated) |

## 5.6 package.json Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `vite` | Start development server with HMR |
| `npm run build` | `vite build` | Create production build in `dist/` |
| `npm run preview` | `vite preview` | Preview the production build locally |
| `npm run lint` | `eslint .` | Check code for errors |

---

# PART 6 — CONFIGURE THE API URL

## 6.1 Goal

Tell the frontend where the backend API is located.

## 6.2 Why Environment Variables

Hardcoding `http://localhost:3000` in your code works for development but breaks when you deploy. Environment variables let you change the URL without editing code.

## 6.3 Vite Environment Variables

Vite uses `.env` files. Variables must start with `VITE_` to be accessible in the browser.

**Important:** Vite env vars are **public** (visible in the browser). Never put secrets in them.

## 6.4 Create .env

In the `task-management-frontend` folder, create `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## 6.5 Create .env.example

Create `.env.example` (committed to Git, no real values):

```env
VITE_API_URL=http://localhost:3000
```

## 6.6 Update .gitignore

Verify `.gitignore` contains:
```
# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build output
dist/

# Editor
.vscode/
```

Vite's default `.gitignore` already includes most of these. Add `.env` if missing.

## 6.7 How to Access in Code

```javascript
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL); // "http://localhost:3000"
```

**Important:** After changing `.env`, you must **restart** the Vite dev server (`Ctrl + C`, then `npm run dev`).

## 6.8 Verify

Create a temporary test in `src/App.jsx`:

```jsx
function App() {
  console.log('API URL:', import.meta.env.VITE_API_URL);
  return <h1>Check Console</h1>;
}
export default App;
```

Run `npm run dev`, open browser, open DevTools (F12) → Console. You should see `API URL: http://localhost:3000`.

Remove this test code after verifying.

---

# PART 7 — IMPLEMENT THE API SERVICE

## 7.1 Goal

Create a single file that handles all communication with the backend API.

## 7.2 Why a Service Layer

Instead of calling `fetch()` in every component, put all API calls in one file (`src/services/api.js`). This makes your code:
- Easier to maintain (change URL in one place)
- Easier to test
- Cleaner (components focus on UI, not HTTP details)

## 7.3 Complete Code: src/services/api.js

Create `src/services/api.js`:

```javascript
// ==========================================
// API SERVICE — All communication with WA-2 backend
// ==========================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper: get auth token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Helper: build headers with optional auth
function getHeaders(includeAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

// Helper: handle response
async function handleResponse(response) {
  // 204 No Content — no body to parse
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    // Throw an error with the backend's error message
    const message = data.message || data.errors?.[0]?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ==========================================
// AUTH ENDPOINTS
// ==========================================

export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

// ==========================================
// TASK ENDPOINTS (Protected)
// ==========================================

export async function getTasks() {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  return handleResponse(response);
}

export async function getTask(id) {
  const response = await fetch(`${API_URL}/api/tasks/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  return handleResponse(response);
}

export async function createTask(title, description, completed) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ title, description, completed }),
  });
  return handleResponse(response);
}

export async function updateTask(id, updates) {
  const response = await fetch(`${API_URL}/api/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/api/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return handleResponse(response);
}

// ==========================================
// HEALTH CHECK
// ==========================================

export async function checkHealth() {
  const response = await fetch(`${API_URL}/api/health`);
  return handleResponse(response);
}
```

## 7.4 Explanation

| Function | What It Does |
|----------|-------------|
| `getToken()` | Reads JWT from `localStorage` (browser storage) |
| `getHeaders()` | Builds HTTP headers. Adds `Authorization: Bearer <token>` for protected routes |
| `handleResponse()` | Parses JSON response. If not OK (status >= 400), throws an Error with the backend's message |
| `register()` | POST to `/api/auth/register` with name, email, password |
| `login()` | POST to `/api/auth/login` with email, password |
| `getTasks()` | GET `/api/tasks` — returns all user's tasks |
| `getTask(id)` | GET `/api/tasks/:id` — returns one task |
| `createTask()` | POST `/api/tasks` — creates a new task |
| `updateTask(id, updates)` | PUT `/api/tasks/:id` — updates task fields |
| `deleteTask(id)` | DELETE `/api/tasks/:id` — deletes a task |
| `checkHealth()` | GET `/api/health` — health check |

## 7.5 Why encodeURIComponent

Task IDs are numbers, but `encodeURIComponent` ensures that if an ID contains special characters, it won't break the URL. This is a safety measure.

## 7.6 How Errors Work

When the backend returns an error (e.g., 400 with `{ success: false, errors: [...] }`), `handleResponse` throws an `Error` with:
- `error.message` — the human-readable error message
- `error.status` — the HTTP status code (400, 401, 404, etc.)
- `error.data` — the full error response from the backend

Components can catch this error and display `error.message` to the user.

---

# PART 8 — IMPLEMENT ROUTING

## 8.1 Goal

Set up navigation between pages using React Router.

## 8.2 Complete Code: src/App.jsx

Replace the contents of `src/App.jsx`:

```jsx
// ==========================================
// APP.JSX — Root component with routing
// ==========================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskListPage from './pages/TaskListPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import TaskFormPage from './pages/TaskFormPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/tasks/:id/edit" element={<TaskFormPage />} />

          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
```

## 8.3 Explanation

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Landing page with links |
| `/login` | LoginPage | Login form |
| `/register` | RegisterPage | Registration form |
| `/tasks` | TaskListPage | List all tasks |
| `/tasks/new` | TaskFormPage | Create new task |
| `/tasks/:id` | TaskDetailsPage | View one task |
| `/tasks/:id/edit` | TaskFormPage | Edit existing task |
| `*` | Navigate to `/` | Unknown URL → redirect home |

## 8.4 How React Router Works

- `<BrowserRouter>` — wraps the app, enables URL-based routing
- `<Routes>` — container for all route definitions
- `<Route path="..." element={<Component />} />` — maps a URL to a component
- `<Navigate to="/" replace />` — redirects to another page
- `:id` — URL parameter (e.g., `/tasks/5` → `id = "5"`)

## 8.5 Navigation Links

In components, use `<Link>` from React Router (not `<a>`):

```jsx
import { Link } from 'react-router-dom';

<Link to="/tasks">View Tasks</Link>
<Link to="/tasks/new">Create Task</Link>
<Link to={`/tasks/${task.id}`}>View Details</Link>
```

**Why not `<a>`?** `<a>` causes a full page reload. `<Link>` navigates without reloading (SPA behavior).

---

# PART 9 — BUILD REUSABLE UI COMPONENTS

## 9.1 Goal

Create small, reusable components that handle common UI patterns.

## 9.2 Complete Code: src/components/Navbar.jsx

```jsx
// ==========================================
// NAVBAR — Top navigation bar
// ==========================================

import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Task Manager</Link>
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <Link to="/tasks">Tasks</Link>
            <Link to="/tasks/new">New Task</Link>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

## 9.3 Complete Code: src/components/LoadingSpinner.jsx

```jsx
// ==========================================
// LOADING SPINNER — Shows while waiting for API
// ==========================================

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
```

## 9.4 Complete Code: src/components/ErrorMessage.jsx

```jsx
// ==========================================
// ERROR MESSAGE — Shows when something goes wrong
// ==========================================

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <p className="error-text">⚠️ {message || 'Something went wrong'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-retry">Try Again</button>
      )}
    </div>
  );
}

export default ErrorMessage;
```

## 9.5 Complete Code: src/components/EmptyState.jsx

```jsx
// ==========================================
// EMPTY STATE — Shows when there is no data
// ==========================================

import { Link } from 'react-router-dom';

function EmptyState({ message = 'No tasks yet', showCreateLink = true }) {
  return (
    <div className="empty-container">
      <p className="empty-text">📭 {message}</p>
      {showCreateLink && (
        <Link to="/tasks/new" className="btn btn-primary">Create Your First Task</Link>
      )}
    </div>
  );
}

export default EmptyState;
```

## 9.6 Complete Code: src/components/TaskCard.jsx

```jsx
// ==========================================
// TASK CARD — Displays a single task summary
// ==========================================

import { Link } from 'react-router-dom';

function TaskCard({ task, onDelete }) {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <span className={`status-badge ${task.completed ? 'done' : 'pending'}`}>
          {task.completed ? '✅ Done' : '⏳ Pending'}
        </span>
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-card-footer">
        <small>Created: {task.createdAt}</small>
        <div className="task-actions">
          <Link to={`/tasks/${task.id}`} className="btn btn-sm btn-view">View</Link>
          <Link to={`/tasks/${task.id}/edit`} className="btn btn-sm btn-edit">Edit</Link>
          <button onClick={() => onDelete(task.id)} className="btn btn-sm btn-delete">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
```

---

# PART 10 — BUILD THE TASK LIST PAGE

## 10.1 Goal

Create a page that fetches and displays all tasks from the backend.

## 10.2 Complete Code: src/pages/TaskListPage.jsx

```jsx
// ==========================================
// TASK LIST PAGE — Shows all tasks
// ==========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/api';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch tasks when page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data.data.tasks || []);
    } catch (err) {
      if (err.status === 401) {
        // Token expired or invalid — redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(taskId) {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await deleteTask(taskId);
      // Remove from local state
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  // Error state
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTasks} />;
  }

  // Empty state
  if (tasks.length === 0) {
    return <EmptyState message="No tasks yet. Create your first task!" />;
  }

  // Success state
  return (
    <div className="task-list-page">
      <h1>My Tasks ({tasks.length})</h1>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default TaskListPage;
```

## 10.3 Explanation

| Concept | Explanation |
|---------|-------------|
| `useState` | Creates state variables. `tasks` holds the list, `loading` tracks if data is being fetched, `error` holds error messages. |
| `useEffect` | Runs `fetchTasks()` once when the component mounts (empty dependency array `[]` means "run once"). |
| `fetchTasks()` | Calls `getTasks()` from the API service. On success, updates `tasks` state. On error, sets `error` state. |
| `setTasks((prev) => ...)` | Functional update — filters out the deleted task from the list without re-fetching. |
| `window.confirm` | Browser dialog asking "Are you sure?" before deleting. |
| `key={task.id}` | React needs a unique key for each item in a list. Using `task.id` ensures correct rendering. |

## 10.4 Why `key={task.id}` Matters

React uses keys to identify which items changed. If you use array index as key, React might render the wrong data after deletions. Always use a unique, stable ID.

---

# PART 11 — BUILD THE TASK DETAILS PAGE

## 11.1 Goal

Create a page that shows one task's full details.

## 11.2 Complete Code: src/pages/TaskDetailsPage.jsx

```jsx
// ==========================================
// TASK DETAILS PAGE — Shows one task
// ==========================================

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTask, deleteTask } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTask();
  }, [id]);

  async function fetchTask() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTask(id);
      setTask(data.data.task);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.status === 404) {
        setError('Task not found');
      } else {
        setError(err.message || 'Failed to load task');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading task..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTask} />;
  }

  if (!task) {
    return <ErrorMessage message="Task not found" />;
  }

  return (
    <div className="task-details-page">
      <Link to="/tasks" className="back-link">← Back to Tasks</Link>
      <h1>{task.title}</h1>

      <div className="task-details-card">
        <div className="detail-row">
          <strong>Status:</strong>
          <span className={task.completed ? 'status-done' : 'status-pending'}>
            {task.completed ? '✅ Completed' : '⏳ Pending'}
          </span>
        </div>

        <div className="detail-row">
          <strong>Description:</strong>
          <p>{task.description || 'No description provided'}</p>
        </div>

        <div className="detail-row">
          <strong>Created:</strong>
          <span>{task.createdAt}</span>
        </div>

        <div className="detail-row">
          <strong>Last Updated:</strong>
          <span>{task.updatedAt}</span>
        </div>
      </div>

      <div className="task-actions">
        <Link to={`/tasks/${id}/edit`} className="btn btn-primary">Edit Task</Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete Task</button>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
```

## 11.3 Explanation

| Concept | Explanation |
|---------|-------------|
| `useParams()` | Reads URL parameters. For `/tasks/5`, `useParams()` returns `{ id: "5" }`. |
| `useEffect(() => {...}, [id])` | Re-fetches when the `id` changes (e.g., navigating from task 1 to task 2). |
| `navigate('/tasks')` | After deleting, redirect to the task list. |
| `Link to="/tasks"` | Back link to return to the list. |

---

# PART 12 — BUILD THE CREATE/EDIT FORM

## 12.1 Goal

Create one form component that handles both creating and editing tasks.

## 12.2 Complete Code: src/pages/TaskFormPage.jsx

```jsx
// ==========================================
// TASK FORM PAGE — Create or Edit a task
// ==========================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, createTask, updateTask } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // In edit mode, fetch existing task
  useEffect(() => {
    if (isEditMode) {
      fetchTask();
    }
  }, [id]);

  async function fetchTask() {
    setFetching(true);
    try {
      const data = await getTask(id);
      const task = data.data.task;
      setTitle(task.title);
      setDescription(task.description || '');
      setCompleted(task.completed);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load task');
      }
    } finally {
      setFetching(false);
    }
  }

  // Client-side validation
  function validate() {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.trim().length > 200) {
      errors.title = 'Title must be under 200 characters';
    }
    if (description.length > 2000) {
      errors.description = 'Description must be under 2000 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent page reload

    if (!validate()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateTask(id, {
          title: title.trim(),
          description: description.trim(),
          completed,
        });
      } else {
        await createTask(title.trim(), description.trim(), completed);
      }
      navigate('/tasks');
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.data && err.data.errors) {
        // Server-side validation errors
        const errors = {};
        err.data.errors.forEach((e) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors);
      } else {
        setError(err.message || 'Failed to save task');
      }
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <LoadingSpinner message="Loading task..." />;
  }

  if (error && !title) {
    return <ErrorMessage message={error} onRetry={fetchTask} />;
  }

  return (
    <div className="task-form-page">
      <Link to="/tasks" className="back-link">← Back to Tasks</Link>
      <h1>{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            disabled={loading}
          />
          {fieldErrors.title && (
            <span className="field-error">{fieldErrors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows={4}
            disabled={loading}
          />
          {fieldErrors.description && (
            <span className="field-error">{fieldErrors.description}</span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={loading}
            />
            Completed
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
          </button>
          <Link to="/tasks" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default TaskFormPage;
```

## 12.3 Explanation

| Concept | Explanation |
|---------|-------------|
| `useParams()` | Gets `:id` from URL. If present, it's edit mode. |
| `isEditMode` | `true` if `id` exists (editing), `false` if not (creating). |
| Controlled inputs | Input value is tied to React state (`value={title}`). Every keystroke calls `setTitle`. |
| `e.preventDefault()` | Stops the browser from reloading the page on form submit. |
| Client-side validation | `validate()` checks title is not empty and within limits before sending to server. |
| Server-side errors | If the backend returns validation errors (400), they're displayed under the relevant field. |
| `disabled={loading}` | Prevents editing while the request is in progress (prevents duplicate submissions). |
| `fetching` state | Shows spinner while loading existing task data in edit mode. |

---

# PART 13 — STYLING AND RESPONSIVE DESIGN

## 13.1 Complete Code: src/index.css

Replace the contents of `src/index.css`:

```css
/* ==========================================
   GLOBAL STYLES — Task Management Frontend
   ========================================== */

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 10px;
}

.navbar-brand {
  color: white;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.navbar-links a {
  color: #ecf0f1;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}

.navbar-links a:hover {
  background-color: #34495e;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #c0392b;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s, transform 0.1s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.85rem;
}

.btn-view {
  background-color: #3498db;
  color: white;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-retry {
  background-color: #3498db;
  color: white;
  margin-top: 10px;
}

/* Task Card */
.task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.task-card.completed {
  opacity: 0.7;
  border-left: 4px solid #27ae60;
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.task-card-header h3 {
  font-size: 1.1rem;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.done {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.task-description {
  color: #666;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.task-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.task-actions {
  display: flex;
  gap: 6px;
}

/* Task Details */
.task-details-page {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.back-link {
  color: #3498db;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 16px;
}

.back-link:hover {
  text-decoration: underline;
}

.task-details-card {
  margin: 16px 0;
}

.detail-row {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-row strong {
  display: inline-block;
  width: 120px;
}

.status-done {
  color: #27ae60;
  font-weight: bold;
}

.status-pending {
  color: #f39c12;
  font-weight: bold;
}

/* Form */
.task-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.field-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
  display: block;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error */
.error-container {
  text-align: center;
  padding: 40px;
  background: #fdecea;
  border-radius: 8px;
  color: #c0392b;
}

/* Empty */
.empty-container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-text {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 16px;
}

/* Home Page */
.home-page {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.home-page h1 {
  margin-bottom: 16px;
}

.home-page p {
  color: #666;
  margin-bottom: 24px;
}

.home-links {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Auth Pages */
.auth-page {
  max-width: 400px;
  margin: 40px auto;
  background: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.auth-page h1 {
  text-align: center;
  margin-bottom: 24px;
}

.auth-page .form-group {
  margin-bottom: 16px;
}

.auth-page .auth-link {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.auth-page .auth-link a {
  color: #3498db;
  text-decoration: none;
}

/* Responsive — Mobile */
@media (max-width: 600px) {
  .container {
    padding: 12px;
  }

  .navbar {
    flex-direction: column;
    text-align: center;
  }

  .navbar-links {
    justify-content: center;
  }

  .task-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-card-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }

  .detail-row strong {
    width: auto;
    display: block;
  }
}

/* Responsive — Tablet */
@media (min-width: 601px) and (max-width: 900px) {
  .container {
    max-width: 700px;
  }
}
```

## 13.2 Responsive Testing Steps

1. Open the app in Chrome
2. Press `F12` → click the device icon (Toggle device toolbar) or press `Ctrl + Shift + M`
3. Test these widths:
   - **375px** (iPhone SE) — mobile
   - **768px** (iPad) — tablet
   - **1024px** (laptop) — desktop
   - **1440px** (desktop) — large screen
4. Check for:
   - No horizontal scrolling
   - Text readable
   - Buttons tappable
   - Forms usable
   - Navigation accessible

---

# PART 14 — COMPLETE APPLICATION ENTRY POINT

## 14.1 Complete Code: src/main.jsx

```jsx
// ==========================================
// MAIN.JSX — Application entry point
// ==========================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## 14.2 Complete Code: index.html

Vite generates this. Verify it has `<div id="root"></div>`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Management Frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## 14.3 Complete Code: src/pages/HomePage.jsx

```jsx
// ==========================================
// HOME PAGE — Landing page
// ==========================================

import { Link } from 'react-router-dom';

function HomePage() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="home-page">
      <h1>📋 Task Management App</h1>
      <p>Manage your tasks efficiently. Create, view, edit, and delete tasks.</p>
      <div className="home-links">
        {isLoggedIn ? (
          <>
            <Link to="/tasks" className="btn btn-primary">View My Tasks</Link>
            <Link to="/tasks/new" className="btn btn-secondary">Create New Task</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
```

## 14.4 Complete Code: src/pages/LoginPage.jsx

```jsx
// ==========================================
// LOGIN PAGE
// ==========================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Login</h1>
      {error && <div className="error-container"><p className="error-text">⚠️ {error}</p></div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
```

## 14.5 Complete Code: src/pages/RegisterPage.jsx

```jsx
// ==========================================
// REGISTER PAGE
// ==========================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  function validate() {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await register(name, email, password);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      navigate('/tasks');
    } catch (err) {
      if (err.data && err.data.errors) {
        const errors = {};
        err.data.errors.forEach((e) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors);
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Register</h1>
      {error && <div className="error-container"><p className="error-text">⚠️ {error}</p></div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading}
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            disabled={loading}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
```

---

# PART 15 — RUN THE APPLICATION

## 15.1 Goal

Run both the backend and frontend simultaneously.

## 15.2 Before Starting

- Backend must be running on port 3000
- Frontend will run on port 5173 (Vite default)

## 15.3 Commands

**Terminal 1 — Backend:**
```powershell
cd "E:\web internship\task-management-api"
npm run dev
```
Expected: `✅ Server is running at http://localhost:3000`

**Terminal 2 — Frontend:**
```powershell
cd "E:\web internship\task-management-frontend"
npm run dev
```
Expected: `➜  Local:   http://localhost:5173/`

## 15.4 Open the Application

Open browser: http://localhost:5173/

You should see the Task Management homepage.

## 15.5 How to Debug

### Browser DevTools (F12)

| Tab | What to Look For |
|-----|-----------------|
| **Console** | JavaScript errors, warnings, `console.log` output |
| **Network** | HTTP requests, status codes, request/response bodies |
| **Application** | localStorage (token, user) |
| **Elements** | HTML structure, CSS styles |

### Network Tab — How to Inspect API Calls

1. Open DevTools (F12) → Network tab
2. Filter by "Fetch/XHR"
3. Perform an action (e.g., login)
4. Click on the request
5. Check:
   - **Headers** → Request URL, Method, Authorization header
   - **Payload** → Request body (JSON)
   - **Response** → Response body (JSON)
   - **Status** → HTTP status code (200, 201, 400, 401, etc.)

### Backend Logs

The backend terminal shows:
- Server start message
- Any `console.error` from controllers
- Database errors

### Frontend vs Backend Issues

| Symptom | Likely Cause | Where to Look |
|---------|-------------|---------------|
| "Failed to fetch" | Backend not running or wrong URL | Network tab, backend terminal |
| CORS error | Backend CORS not configured | Browser console, backend CORS code |
| 401 Unauthorized | Token missing/expired/invalid | Network tab (Authorization header), localStorage |
| 400 Bad Request | Validation failed | Network tab (response body), form data |
| 404 Not Found | Wrong URL or task doesn't exist | Network tab (request URL) |
| 500 Server Error | Backend crash | Backend terminal logs |
| Blank page | React error | Browser console |
| Data not showing | Wrong response shape | Network tab (response body) |

---

# PART 16 — FUNCTIONAL TESTING

## 16.1 Manual Testing Table

| Test ID | Feature | Steps | Expected Result | Actual | Pass/Fail |
|---------|---------|-------|-----------------|--------|-----------|
| T01 | Home page loads | Open http://localhost:5173/ | Homepage with links visible | | |
| T02 | Register new user | Go to /register, fill form, submit | Redirect to /tasks, token saved | | |
| T03 | Register duplicate email | Register with same email again | Error: "Email already registered" | | |
| T04 | Register empty fields | Submit empty form | Validation errors shown | | |
| T05 | Register weak password | Password "123" | "Password must be at least 8 characters" | | |
| T06 | Login valid | Go to /login, enter valid credentials | Redirect to /tasks, token saved | | |
| T07 | Login invalid password | Wrong password | "Invalid email or password" | | |
| T08 | Login invalid email | Non-existent email | "Invalid email or password" | | |
| T09 | Task list loads | Go to /tasks (logged in) | Tasks displayed or empty state | | |
| T10 | Task list empty | Delete all tasks, go to /tasks | Empty state with "Create" link | | |
| T11 | Create task | /tasks/new, fill title, submit | Redirect to /tasks, new task visible | | |
| T12 | Create task empty title | Submit without title | "Title is required" error | | |
| T13 | Create task long title | Title > 200 chars | Validation error | | |
| T14 | View task details | Click "View" on a task | Details page shows all fields | | |
| T15 | View nonexistent task | Navigate to /tasks/99999 | "Task not found" error | | |
| T16 | Edit task | /tasks/:id/edit, change title, submit | Redirect to /tasks, updated title | | |
| T17 | Edit task completed | Check "completed", submit | Task shows as completed | | |
| T18 | Delete task | Click "Delete", confirm | Task removed from list | | |
| T19 | Delete cancel | Click "Delete", cancel dialog | Task remains | | |
| T20 | Unauthenticated access | Go to /tasks without token | Redirect to /login | | |
| T21 | Expired token | Use expired token, go to /tasks | Redirect to /login | | |
| T22 | Logout | Click Logout | Redirect to /login, token removed | | |
| T23 | Browser refresh on /tasks | Refresh while on /tasks | Tasks still load (token in localStorage) | | |
| T24 | Direct URL navigation | Type /tasks in address bar | Page loads correctly | | |
| T25 | Mobile layout | Resize to 375px | No horizontal scroll, usable UI | | |
| T26 | Desktop layout | Resize to 1440px | Proper spacing, readable text | | |
| T27 | Loading state | Throttle network in DevTools | Spinner shows during fetch | | |
| T28 | Error state | Stop backend, go to /tasks | Error message with retry button | | |
| T29 | Retry button | Click "Try Again" after error | Re-fetches data | | |
| T30 | Unknown route | Navigate to /random | Redirect to home | | |

## 16.2 How to Test Destructive Actions Safely

1. Create a task specifically for testing (title: "TEST — delete me")
2. Test edit on this task
3. Test delete on this task
4. This way you don't lose real data

## 16.3 Network Failure Testing

1. Open DevTools → Network tab
2. Check "Offline" checkbox (or use "Slow 3G")
3. Navigate to /tasks
4. Verify: error message appears, retry button works
5. Uncheck "Offline"
6. Click retry → data loads

---

# PART 17 — DEBUGGING HANDBOOK

## 17.1 Failed to Fetch

**What it means:** The browser couldn't connect to the backend.

**How to identify:** Console shows `TypeError: Failed to fetch`

**How to investigate:**
1. Is the backend running? Check terminal.
2. Is the backend URL correct? Check `.env` → `VITE_API_URL`
3. Is the port correct? Backend default is 3000.

**Fix:**
1. Start backend: `cd "E:\web internship\task-management-api" && npm run dev`
2. Verify URL: http://localhost:3000/api/health in browser
3. Restart Vite after changing `.env`

## 17.2 CORS Errors

**What it means:** Browser blocked the request due to CORS policy.

**How to identify:** Console shows `Access to fetch at ... has been blocked by CORS policy`

**How to investigate:**
1. Check backend CORS configuration in `server.js`
2. In development, backend allows all origins (ALLOWED_ORIGINS not set)
3. In production, set ALLOWED_ORIGINS in backend `.env`

**Fix:**
- Ensure backend is running
- Ensure `ALLOWED_ORIGINS` includes your frontend URL (if set)
- Never disable browser security as a fix

## 17.3 400 Bad Request

**What it means:** The request data failed validation.

**How to investigate:**
1. Network tab → Response body → read `errors` array
2. Check which field failed and why

**Fix:** Fix the form data to match backend validation rules.

## 17.4 401 Unauthorized

**What it means:** Token is missing, invalid, or expired.

**How to investigate:**
1. Network tab → Request Headers → check `Authorization: Bearer <token>`
2. Application tab → localStorage → check `token` exists
3. Check token expiration (default 24h)

**Fix:**
- Log in again to get a new token
- Check `localStorage` in browser DevTools

## 17.5 404 Not Found

**What it means:** The URL doesn't match any route, or the task doesn't exist.

**How to investigate:**
1. Network tab → Request URL → verify path
2. Check if task ID exists in the database

**Fix:** Verify the URL and task ID.

## 17.6 500 Server Error

**What it means:** Backend crashed or had an internal error.

**How to investigate:**
1. Backend terminal → read error logs
2. Check database file exists and is not corrupted

**Fix:** Fix the backend error (check terminal logs).

## 17.7 Invalid JSON

**What it means:** The request or response body is not valid JSON.

**How to investigate:**
1. Network tab → Payload → check JSON format
2. Network tab → Response → check if response is JSON

**Fix:** Ensure `Content-Type: application/json` header is set and body is valid JSON.

## 17.8 Wrong Response Shape

**What it means:** Frontend expects a different structure than backend returns.

**How to investigate:**
1. Network tab → Response → note the actual structure
2. Compare with your frontend code (e.g., `data.data.tasks` vs `data.tasks`)

**Fix:** Update frontend to match backend response shape.

## 17.9 Missing Environment Variables

**What it means:** `VITE_API_URL` is undefined.

**How to investigate:**
1. Console: `console.log(import.meta.env.VITE_API_URL)`
2. Check `.env` file exists and has `VITE_` prefix

**Fix:**
1. Create `.env` with `VITE_API_URL=http://localhost:3000`
2. Restart Vite dev server

## 17.10 Wrong Port

**What it means:** Frontend or backend running on unexpected port.

**How to investigate:**
1. Backend terminal → check port number
2. Frontend terminal → check URL
3. Check `.env` for PORT (backend) and Vite config (frontend)

**Fix:** Use correct ports or update configuration.

## 17.11 Incorrect HTTP Method

**What it means:** Using GET instead of POST, etc.

**How to investigate:**
1. Network tab → Method column
2. Compare with backend route definition

**Fix:** Use correct method in fetch call.

## 17.12 Missing or Incorrect Fields

**What it means:** Request body doesn't match backend expectations.

**How to investigate:**
1. Network tab → Payload → check field names
2. Compare with backend validation rules

**Fix:** Ensure field names match (e.g., `title` not `name`, `completed` not `isCompleted`).

## 17.13 Blank React Page

**What it means:** React failed to render.

**How to investigate:**
1. Browser console → look for errors
2. Check `main.jsx` and `App.jsx` for syntax errors
3. Check if `#root` div exists in `index.html`

**Fix:** Fix the JavaScript error shown in console.

## 17.14 JSX Syntax Errors

**What it means:** Invalid JSX syntax.

**How to investigate:** Console shows specific line number and error.

**Common mistakes:**
- Forgetting to close tags: `<div>` needs `</div>`
- Using `class` instead of `className`
- Not wrapping multiple elements in a parent
- Using `if` statements inside JSX (use ternary `? :` instead)

## 17.15 Import Errors

**What it means:** Module not found.

**How to investigate:** Console shows `Cannot find module './Component'`

**Fix:**
- Check file path and name (case-sensitive on some systems)
- Check if file exists
- Check export/import names match

## 17.16 Missing Packages

**What it means:** A dependency is not installed.

**How to investigate:** Console or terminal shows `Cannot find module 'react-router-dom'`

**Fix:** `npm install react-router-dom`

## 17.17 Port Already in Use

**What it means:** Another process is using the port.

**Fix:**
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
# Kill it
Stop-Process -Id <PID> -Force
```

## 17.18 Vite Build Errors

**What it means:** Production build failed.

**How to investigate:** Terminal shows specific error.

**Common causes:**
- Unused imports (if ESLint is configured as error)
- Syntax errors
- Missing files

**Fix:** Fix the error shown in terminal.

## 17.19 React Warnings

**What it means:** React detected a potential issue (not an error).

**Common warnings:**
- "Each child in a list should have a unique key prop" → Add `key` prop
- "Can't perform a React state update on an unmounted component" → Clean up useEffect

## 17.20 Database Connection Failures

**What it means:** Backend can't connect to SQLite.

**How to investigate:** Backend terminal shows database error.

**Fix:**
- Ensure `data/` folder exists
- Check file permissions
- Delete `data/app.db` and restart (creates fresh)

## 17.21 Git Push Errors

**What it means:** Push to GitHub failed.

**Common errors:**
- `Authentication failed` → Use Personal Access Token
- `rejected (non-fast-forward)` → `git pull origin main --rebase` then push
- `remote origin already exists` → `git remote remove origin` then re-add

---

# PART 18 — CODE QUALITY AND MAINTAINABILITY

## 18.1 Key Principles

1. **Meaningful names:** Use `taskList` not `tl`, `isLoading` not `flag`
2. **Separation of concerns:** API calls in `services/api.js`, not in components
3. **Reusable components:** LoadingSpinner, ErrorMessage, EmptyState used across pages
4. **No unused imports:** Remove imports you don't use
5. **Consistent formatting:** Use 2-space indentation
6. **Accessible labels:** Every form input has a `<label>` with `htmlFor`
7. **Error handling:** Every API call has try/catch
8. **Loading states:** Every async operation shows a spinner

## 18.2 Frontend vs Backend Responsibilities

| Responsibility | Frontend | Backend |
|---------------|----------|---------|
| Display data | ✅ | |
| Form validation (UX) | ✅ | |
| HTTP requests | ✅ | |
| Authentication (token storage) | ✅ | |
| Data persistence | | ✅ |
| Password hashing | | ✅ |
| Business logic | | ✅ |
| Data validation (security) | | ✅ |
| Database access | | ✅ |

---

# PART 19 — BUILD AND VERIFY PRODUCTION OUTPUT

## 19.1 Goal

Create an optimized production build and verify it works.

## 19.2 Commands

```powershell
cd "E:\web internship\task-management-frontend"
npm run build
```

Expected output:
```
vite v6.x.x building for production...
✓ xxx modules transformed.
dist/index.html                  0.xx kB
dist/assets/index-xxxxx.css      x.xx kB
dist/assets/index-xxxxx.js       x.xx kB
✓ built in xxxms
```

## 19.3 What `dist/` Contains

| File | Purpose |
|------|---------|
| `index.html` | Entry HTML (minified) |
| `assets/index-*.css` | Minified CSS |
| `assets/index-*.js` | Minified JavaScript (bundled) |
| `vite.svg` | Favicon |

## 19.4 Preview the Build

```powershell
npm run preview
```

Expected: `➜  Local:   http://localhost:4173/`

Open this URL and verify the app works (same as dev, but using production build).

**Note:** The API URL from `.env` is baked into the build. If you change `.env`, rebuild.

## 19.5 Common Build Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module` | Missing import | Check file path and name |
| `Unexpected token` | Syntax error | Fix JSX/JS syntax |
| `Failed to resolve import` | Wrong import path | Verify file exists at path |
| `'X' is defined but never used` | Unused variable | Remove or use the variable |

## 19.6 Important Note

A successful build does **not** prove that API operations work. The build only checks that code compiles. You must still test in the browser.

---

# PART 20 — README DOCUMENTATION

## 20.1 Complete README.md Template

Create `README.md` in the frontend folder:

```markdown
# Task Management Frontend

A React frontend for the Task Management REST API, built with Vite and React Router.

## Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Routing:** React Router v7
- **HTTP Client:** fetch (native)
- **Styling:** Plain CSS (responsive)

## Prerequisites

- Node.js v18 or higher
- npm
- WA-2 backend running on http://localhost:3000

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/task-management-frontend.git
cd task-management-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux

# 4. Edit .env and set VITE_API_URL
```

## Environment Setup

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:3000
```

## Running Locally

### Start Backend (Terminal 1)
```bash
cd ../task-management-api
npm run dev
```

### Start Frontend (Terminal 2)
```bash
npm run dev
```

Open http://localhost:5173/ in your browser.

## Features

- User registration and login
- JWT token storage in localStorage
- View all tasks
- View task details
- Create new tasks
- Edit existing tasks
- Delete tasks with confirmation
- Loading, error, and empty states
- Responsive design (mobile + desktop)
- Client-side form validation

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/tasks | List tasks |
| GET | /api/tasks/:id | Get task details |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Production Build

```bash
npm run build
npm run preview
```

## Known Limitations

- No refresh token mechanism (token expires after 24h)
- No offline support
- No real-time updates
- Token stored in localStorage (XSS risk in production)

## Future Improvements

- Add refresh token support
- Add task filtering and search
- Add task categories/tags
- Add dark mode
- Add unit tests with React Testing Library
```

---

# PART 21 — GIT AND GITHUB

## 21.1 Create a Public Repository

1. Go to https://github.com
2. Click **+** → **New repository**
3. Name: `task-management-frontend`
4. **Public** (required for internship)
5. Do NOT initialize with README (we already have one)
6. Click **Create repository**
7. Copy the repository URL

## 21.2 Initialize Git (if not already)

Vite already creates a `.gitignore`. Check if Git is initialized:

```powershell
cd "E:\web internship\task-management-frontend"
git status
```

If "not a git repository":
```powershell
git init
git branch -M main
```

## 21.3 Verify .gitignore

Ensure `.gitignore` contains:
```
node_modules/
dist/
.env
.env.local
```

## 21.4 Stage and Commit

```powershell
git add .
git status
```

Verify `.env` and `node_modules/` are NOT staged.

```powershell
git commit -m "Build React frontend for Task Management API"
```

## 21.5 Add Remote and Push

```powershell
git remote add origin https://github.com/YOUR_USERNAME/task-management-frontend.git
git push -u origin main
```

## 21.6 Verify

Open https://github.com/YOUR_USERNAME/task-management-frontend in browser. Files should be visible. `.env` should NOT be visible.

---

# PART 22 — DEPLOYMENT (OPTIONAL)

Deployment is **optional** unless your assignment explicitly requires a live URL. Check your assignment instructions.

If required, here is a high-level overview:

## Backend Deployment

1. Host backend on a service like Render, Railway, or Heroku
2. Set environment variables (JWT_SECRET, PORT, etc.)
3. Ensure database file persists (use a volume or migrate to PostgreSQL)
4. Note the public API URL (e.g., `https://your-api.onrender.com`)

## Frontend Deployment

1. Update `.env` with the production API URL:
   ```
   VITE_API_URL=https://your-api.onrender.com
   ```
2. Rebuild: `npm run build`
3. Deploy `dist/` folder to Vercel, Netlify, or GitHub Pages
4. For SPA routing, configure a fallback to `index.html`

## CORS in Production

Set `ALLOWED_ORIGINS` in backend `.env`:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## SPA Route Fallback

On Netlify, create `public/_redirects`:
```
/*    /index.html   200
```

On Vercel, create `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

# PART 23 — INTERNSHIP SUBMISSION

## 23.1 What to Submit

Based on typical internship requirements:

1. **GitHub Repository URL** — The frontend repo URL
2. **Backend Repository URL** — Your WA-2 repo URL (if required)
3. **Notes/Description** — Brief description of what you built
4. **Evidence/Screenshots** — If required

## 23.2 Submission Checklist

- [ ] Frontend repo is **public**
- [ ] Backend repo is **public** (if required)
- [ ] README.md is complete and accurate
- [ ] `.env` is NOT in the repo
- [ ] `node_modules/` is NOT in the repo
- [ ] `npm run build` succeeds
- [ ] All manual tests pass (Part 16)
- [ ] All API calls use real backend (no mock data)
- [ ] Token is handled correctly
- [ ] No console errors in production build

## 23.3 GitHub Profile URL vs Repository URL

- **Profile URL:** `https://github.com/nitinpratap007` (your account)
- **Repository URL:** `https://github.com/nitinpratap007/task-management-frontend` (your project)

Submit the **repository URL**, not the profile URL.

## 23.4 AI Usage Declaration

If your internship requires disclosing AI usage, be honest:
- "I used AI assistance for code generation and documentation, but I tested all functionality myself and understand the code."

---

# PART 24 — LEARN AND EXPLAIN YOUR PROJECT

## 24.1 Self-Test Questions (Try Before Reading Answers)

1. What is React and why use it instead of plain HTML/JS?
2. What is JSX and how is it different from HTML?
3. What is a component? Give an example from this project.
4. What is the difference between props and state?
5. What does `useState` do? Give an example.
6. What does `useEffect` do? When does it run?
7. What is `useParams` used for?
8. What is React Router and why do we need it?
9. What is the difference between `<Link>` and `<a>`?
10. What is a REST API?
11. What HTTP methods does our app use and for what?
12. What is a Bearer token and how is it sent?
13. What is CORS and why does it matter?
14. What is an environment variable? Why use `VITE_` prefix?
15. What is localStorage and why do we store the token there?
16. What is a production build and why is it different from dev?
17. What is Git and why do we use it?
18. What is the difference between `git add`, `git commit`, and `git push`?
19. What is a component's lifecycle in React?
20. How does error handling work in our API service?

## 24.2 Answers

1. **React** is a JavaScript library for building UIs. It lets you create reusable components and efficiently updates the DOM when data changes, instead of manually manipulating HTML.

2. **JSX** is JavaScript XML. It looks like HTML but is actually JavaScript. Example: `<h1>Hello</h1>` becomes `React.createElement('h1', null, 'Hello')`. JSX allows you to write UI declaratively.

3. A **component** is a reusable piece of UI. Example: `LoadingSpinner` — used on multiple pages to show a loading indicator.

4. **Props** are data passed from parent to child (read-only). **State** is data managed inside a component (can change). Props are like function arguments; state is like local variables.

5. **`useState`** creates a state variable and a setter function. Example: `const [tasks, setTasks] = useState([])` creates `tasks` (initially empty array) and `setTasks` (to update it).

6. **`useEffect`** runs side effects after render. It runs when the component mounts (if dependency array is `[]`) or when dependencies change (if array has values).

7. **`useParams`** reads URL parameters. For `/tasks/5`, it returns `{ id: "5" }`.

8. **React Router** enables client-side routing — navigating between pages without full page reloads.

9. **`<Link>`** navigates without page reload (SPA). **`<a>`** causes full page reload.

10. **REST API** is a way to communicate with a server over HTTP using URLs and JSON data.

11. **GET** (read), **POST** (create), **PUT** (update), **DELETE** (delete).

12. **Bearer token** is sent in the `Authorization: Bearer <token>` header to prove authentication.

13. **CORS** (Cross-Origin Resource Sharing) is a browser security feature. It blocks requests from different origins unless the server allows them.

14. **Environment variables** store configuration outside code. `VITE_` prefix makes them accessible in the browser (they're public).

15. **localStorage** is browser storage that persists across page refreshes. We store the JWT there so the user stays logged in.

16. **Production build** is minified, optimized code ready for deployment. It's smaller and faster than dev.

17. **Git** is version control — tracks changes to your code over time.

18. **`git add`** stages changes. **`git commit`** saves a snapshot. **`git push`** uploads to GitHub.

19. **Component lifecycle:** Mount → Render → Update (on state/props change) → Unmount.

20. **Error handling:** `handleResponse` in `api.js` checks `response.ok`. If not OK, it throws an Error with the backend's message. Components catch this in try/catch.

## 24.3 Key Code Explanations

### How `fetch` Works in Our API Service

```javascript
const response = await fetch(`${API_URL}/api/tasks`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

1. `fetch` makes an HTTP request to the URL
2. `await` waits for the response
3. `response.json()` parses the JSON body
4. `response.ok` is true if status is 200-299

### How State Updates Work

```javascript
setTasks((prev) => prev.filter((t) => t.id !== taskId));
```

This is a **functional update**. Instead of using the current `tasks` state directly, it receives `prev` (the previous state) and returns the new state. This is safer because state updates may be batched.

### How Routing Works

```jsx
<Route path="/tasks/:id" element={<TaskDetailsPage />} />
```

When the URL is `/tasks/5`, React Router:
1. Matches the pattern `/tasks/:id`
2. Extracts `id = "5"`
3. Renders `<TaskDetailsPage />`
4. Inside the component, `useParams()` returns `{ id: "5" }`

---

# PART 25 — FINAL EXECUTION ROADMAP

## Phase 1: Setup (Day 1)

| Step | Action | Command | Expected Result | If Fails |
|------|--------|---------|-----------------|----------|
| 1 | Verify Node.js | `node -v` | v18+ | Install Node.js |
| 2 | Verify npm | `npm -v` | 10+ | Comes with Node.js |
| 3 | Verify Git | `git --version` | 2.x | Install Git |
| 4 | Start backend | `cd backend && npm run dev` | Server running on :3000 | Check .env, port |
| 5 | Test backend | Open http://localhost:3000/api/health | `{"status":"ok"}` | Check backend logs |

## Phase 2: Create Frontend (Day 1)

| Step | Action | Command | Expected Result | If Fails |
|------|--------|---------|-----------------|----------|
| 6 | Create React app | `npm create vite@latest task-management-frontend -- --template react` | Project created | Check Node.js version |
| 7 | Install deps | `cd task-management-frontend && npm install` | node_modules created | Check internet |
| 8 | Install router | `npm install react-router-dom` | Added to package.json | Check internet |
| 9 | Start dev server | `npm run dev` | http://localhost:5173/ | Check port conflicts |
| 10 | Verify starter | Open http://localhost:5173/ | Vite + React page | Check console |

## Phase 3: Configure API (Day 1)

| Step | Action | File | Expected Result | If Fails |
|------|--------|------|-----------------|----------|
| 11 | Create .env | `.env` | `VITE_API_URL=http://localhost:3000` | Check file location |
| 12 | Create .env.example | `.env.example` | Template file | — |
| 13 | Create api.js | `src/services/api.js` | All API functions | Check imports |
| 14 | Test API URL | Add console.log in App.jsx | URL printed in console | Check .env prefix |

## Phase 4: Build Components (Day 2)

| Step | Action | File | Expected Result | If Fails |
|------|--------|------|-----------------|----------|
| 15 | Create Navbar | `src/components/Navbar.jsx` | Navigation bar | Check imports |
| 16 | Create LoadingSpinner | `src/components/LoadingSpinner.jsx` | Spinner | — |
| 17 | Create ErrorMessage | `src/components/ErrorMessage.jsx` | Error display | — |
| 18 | Create EmptyState | `src/components/EmptyState.jsx` | Empty state | — |
| 19 | Create TaskCard | `src/components/TaskCard.jsx` | Task card | Check props |

## Phase 5: Build Pages (Day 2-3)

| Step | Action | File | Expected Result | If Fails |
|------|--------|------|-----------------|----------|
| 20 | Create HomePage | `src/pages/HomePage.jsx` | Landing page | Check Link import |
| 21 | Create LoginPage | `src/pages/LoginPage.jsx` | Login form | Check api import |
| 22 | Create RegisterPage | `src/pages/RegisterPage.jsx` | Register form | Check validation |
| 23 | Create TaskListPage | `src/pages/TaskListPage.jsx` | Task list | Check getTasks |
| 24 | Create TaskDetailsPage | `src/pages/TaskDetailsPage.jsx` | Task details | Check useParams |
| 25 | Create TaskFormPage | `src/pages/TaskFormPage.jsx` | Create/edit form | Check createTask/updateTask |

## Phase 6: Wire Up (Day 3)

| Step | Action | File | Expected Result | If Fails |
|------|--------|------|-----------------|----------|
| 26 | Update App.jsx | `src/App.jsx` | Routing works | Check imports |
| 27 | Update main.jsx | `src/main.jsx` | App mounts | Check root div |
| 28 | Update index.css | `src/index.css` | Styling applied | Check file path |
| 29 | Update index.html | `index.html` | Title correct | — |

## Phase 7: Test (Day 3-4)

| Step | Action | Expected Result | If Fails |
|------|--------|-----------------|----------|
| 30 | Run dev server | http://localhost:5173/ | Page loads |
| 31 | Test registration | Register new user | Redirect to /tasks |
| 32 | Test login | Login with credentials | Redirect to /tasks |
| 33 | Test task list | View tasks | Tasks displayed |
| 34 | Test create | Create new task | Task appears in list |
| 35 | Test details | Click view | Details shown |
| 36 | Test edit | Edit task | Changes saved |
| 37 | Test delete | Delete task | Task removed |
| 38 | Test validation | Submit empty form | Errors shown |
| 39 | Test empty state | Delete all tasks | Empty message shown |
| 40 | Test error state | Stop backend | Error message shown |
| 41 | Test mobile | Resize to 375px | Responsive layout |

## Phase 8: Build (Day 4)

| Step | Action | Command | Expected Result | If Fails |
|------|--------|---------|-----------------|----------|
| 42 | Build | `npm run build` | dist/ created | Fix errors |
| 43 | Preview | `npm run preview` | http://localhost:4173/ | Check build |

## Phase 9: Document (Day 4)

| Step | Action | File | Expected Result | If Fails |
|------|--------|------|-----------------|----------|
| 44 | Write README | `README.md` | Complete docs | — |

## Phase 10: Publish (Day 5)

| Step | Action | Command | Expected Result | If Fails |
|------|--------|---------|-----------------|----------|
| 45 | Init Git | `git init` | .git created | — |
| 46 | Stage | `git add .` | Files staged | Check .gitignore |
| 47 | Commit | `git commit -m "..."` | Commit created | Check git config |
| 48 | Add remote | `git remote add origin <URL>` | Remote added | Check URL |
| 49 | Push | `git push -u origin main` | Code on GitHub | Check auth |

## Phase 11: Submit (Day 5)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 50 | Verify repo public | Public badge on GitHub |
| 51 | Verify .env not in repo | Not visible on GitHub |
| 52 | Submit URL | Internship portal accepts URL |

---

# APPENDIX A — GLOSSARY

| Term | Definition |
|------|-----------|
| **React** | JavaScript library for building user interfaces |
| **JSX** | JavaScript XML — HTML-like syntax in JavaScript |
| **Component** | Reusable UI piece (function returning JSX) |
| **Props** | Data passed from parent to child component |
| **State** | Data managed inside a component (useState) |
| **Hook** | Special function for state/effects (useState, useEffect) |
| **Vite** | Fast build tool and dev server |
| **npm** | Node Package Manager |
| **fetch** | Browser API for HTTP requests |
| **REST** | Representational State Transfer — API design pattern |
| **CRUD** | Create, Read, Update, Delete |
| **JWT** | JSON Web Token — authentication token |
| **Bearer** | Token type sent in Authorization header |
| **CORS** | Cross-Origin Resource Sharing |
| **SPA** | Single Page Application |
| **DOM** | Document Object Model |
| **HMR** | Hot Module Replacement — instant updates in dev |
| **localStorage** | Browser storage (persists across sessions) |
| **Git** | Version control system |
| **GitHub** | Code hosting platform |
| **Commit** | Snapshot of code changes |
| **Push** | Upload commits to remote repository |
| **Clone** | Download a repository |
| **Repository** | Project folder tracked by Git |
| **Branch** | Parallel version of code (main = primary) |
| **Merge** | Combine changes from different branches |
| **Remote** | Online copy of your repository |
| **Origin** | Default name for remote repository |
| **.env** | Environment variables file (secrets) |
| **.gitignore** | Files Git should ignore |
| **node_modules** | Installed npm packages (auto-generated) |
| **package.json** | Project metadata and dependencies |
| **package-lock.json** | Exact dependency versions |
| **dist/** | Production build output |
| **localhost** | Your own computer (127.0.0.1) |
| **Port** | Network endpoint number (3000, 5173) |
| **Endpoint** | API URL path (/api/tasks) |
| **Middleware** | Function that runs before route handler |
| **Controller** | Function that handles request logic |
| **Route** | URL pattern mapped to a controller |
| **Schema** | Structure of data (fields, types) |
| **Validation** | Checking data correctness |
| **Hash** | One-way encrypted password |
| **bcrypt** | Password hashing algorithm |
| **SQLite** | File-based database |
| **Express** | Node.js web framework |
| **CommonJS** | Module system using require/module.exports |
| **ES Modules** | Module system using import/export |
| **Async/Await** | Syntax for handling promises |
| **Promise** | Object representing future value |
| **Callback** | Function passed as argument |
| **Arrow function** | Concise function syntax: `() => {}` |
| **Destructuring** | Extracting values from objects/arrays |
| **Template literal** | String with embedded expressions: `` `Hello ${name}` `` |
| **Ternary** | Conditional expression: `condition ? a : b` |
| **Spread operator** | `...` to expand arrays/objects |
| **Array methods** | map, filter, reduce, forEach |
| **JSON** | JavaScript Object Notation — data format |
| **HTTP** | HyperText Transfer Protocol |
| **HTTPS** | Secure HTTP (encrypted) |
| **Status code** | HTTP response code (200, 404, 500) |
| **Header** | HTTP metadata (Content-Type, Authorization) |
| **Body** | HTTP request/response data |
| **Query param** | URL parameter (?key=value) |
| **Path param** | URL segment (/tasks/:id) |
| **Payload** | Data sent in request body |
| **Response** | Data returned by server |
| **Client** | Frontend (browser) |
| **Server** | Backend (Node.js) |
| **Full-stack** | Frontend + Backend combined |
| **SPA** | Single Page Application (no full reloads) |
| **MVC** | Model-View-Controller pattern |
| **API** | Application Programming Interface |
| **SDK** | Software Development Kit |
| **CLI** | Command Line Interface |
| **IDE** | Integrated Development Environment (VS Code) |
| **HMR** | Hot Module Replacement |
| **Minification** | Removing whitespace from code |
| **Bundling** | Combining files into one |
| **Tree shaking** | Removing unused code |
| **Linting** | Code quality checking |
| **Debugging** | Finding and fixing errors |
| **Breakpoint** | Pause execution for inspection |
| **Console** | Browser developer tool for logs |
| **DevTools** | Browser developer tools |
| **Network tab** | DevTools tab for HTTP requests |
| **Elements tab** | DevTools tab for HTML/CSS |
| **Application tab** | DevTools tab for storage/cookies |

---

# APPENDIX B — VERIFIED API CONTRACT

## Backend Details

| Property | Value |
|----------|-------|
| Language | JavaScript (CommonJS) |
| Framework | Express.js 5.x |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs (12 salt rounds) |
| Validation | express-validator |
| Port | 3000 (configurable via PORT env) |
| Base URL | http://localhost:3000 |
| CORS | Permissive in dev, configurable in prod |
| Node.js Version | v24.13.0 (tested) |

## Complete Endpoint Table

| # | Method | Path | Auth | Request Body | Success | Error Codes |
|---|--------|------|------|-------------|---------|-------------|
| 1 | GET | `/api/health` | No | None | 200 `{ status, timestamp }` | — |
| 2 | POST | `/api/auth/register` | No | `{ name, email, password }` | 201 `{ success, data: { user, token } }` | 400, 409, 500 |
| 3 | POST | `/api/auth/login` | No | `{ email, password }` | 200 `{ success, data: { user, token } }` | 400, 401, 500 |
| 4 | GET | `/api/tasks` | Bearer | None | 200 `{ success, data: { count, tasks } }` | 401, 500 |
| 5 | GET | `/api/tasks/:id` | Bearer | None | 200 `{ success, data: { task } }` | 400, 401, 404, 500 |
| 6 | POST | `/api/tasks` | Bearer | `{ title, description?, completed? }` | 201 `{ success, data: { task } }` | 400, 401, 500 |
| 7 | PUT | `/api/tasks/:id` | Bearer | `{ title?, description?, completed? }` | 200 `{ success, data: { task } }` | 400, 401, 404, 500 |
| 8 | DELETE | `/api/tasks/:id` | Bearer | None | 200 `{ success, message }` | 400, 401, 404, 500 |

## Task Object (Response)

```json
{
  "id": 1,
  "userId": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "createdAt": "2026-10-23 07:40:40",
  "updatedAt": "2026-10-23 07:40:40"
}
```

## User Object (Response — never includes password)

```json
{
  "id": 1,
  "name": "Nitin Pratap",
  "email": "nitin@example.com"
}
```

## Validation Rules

### Register
- `name`: required, trimmed, max 100 chars
- `email`: required, valid email, normalized to lowercase
- `password`: required, 8-72 chars

### Login
- `email`: required, valid email
- `password`: required

### Create Task
- `title`: required, trimmed, max 200 chars
- `description`: optional, trimmed, max 2000 chars
- `completed`: optional, boolean

### Update Task
- `title`: optional, trimmed, not empty if provided, max 200 chars
- `description`: optional, trimmed, max 2000 chars
- `completed`: optional, boolean

---

# APPENDIX C — UNRESOLVED ITEMS

## Items That Could Not Be Verified

1. **WA-3 Assignment Screenshots:** I could not read the assignment screenshots (image input not supported). The handbook is based on the detailed requirements in your prompt and the verified backend API. **You must verify** that the handbook covers all requirements in your actual assignment screenshot.

2. **Node.js Version for Frontend:** The guide uses React 18+ and Vite 6+. These require Node.js 18+. Your system has Node.js 24.13.0, which is compatible.

3. **React Router Version:** The guide uses React Router v7. If your assignment specifies a different version, adjust accordingly.

4. **Live Deployment:** Not implemented. If your assignment requires deployment, follow Part 22.

5. **Automated Frontend Tests:** Not included. If required, add React Testing Library tests.

6. **AI Usage Declaration:** Check your internship portal for specific requirements.

## How to Discover Missing Information

1. **Read the assignment screenshot** carefully and compare with the handbook's requirements table.
2. **Run the backend** and test endpoints manually to confirm response shapes.
3. **Check the internship portal** for submission requirements.
4. **Ask your internship coordinator** if any requirement is unclear.

---

# END OF HANDBOOK

> **Remember:** This handbook is your guide, not a magic solution. Read it, understand it, type the code yourself, and test everything. The goal is to learn, not just to submit.

> **If something doesn't work:** Check Part 17 (Debugging Handbook) first. If still stuck, check the browser console, network tab, and backend terminal logs.

> **Final advice:** Build it, break it, fix it, understand it. That's how you learn.
