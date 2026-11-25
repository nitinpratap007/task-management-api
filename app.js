// ==========================================
// APP.JS — Express application (no listening)
// Imported by server.js for startup and by tests (Supertest).
// Does not start a server, scheduler, or other side effects.
// ==========================================

const express = require('express');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ---- Basic security headers (no external dependency needed) ----
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// ---- Configurable CORS ----
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : null;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins === null) {
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// JSON body parser with size limit
app.use(express.json({
  limit: '20kb',
  verify: (req, res, buf) => {
    // no-op: validation happens in the error handler below
  }
}));

// Handle JSON parse errors (e.g., malformed request bodies) as 400 Bad Request
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body'
    });
  }
  next(err);
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Management API is running',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      health: '/api/health'
    }
  });
});

// Health check endpoint (required: GET /api/health)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Centralized error handler (4 parameters = Express error middleware)
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;