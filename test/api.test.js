// test/api.test.js
// Automated API tests using Node's built-in http module (no external test libs).
// Run with: node test/api.test.js
// Uses an isolated test database (data/test.db) so real user data is never touched.

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');

const PORT = 3999;
const DB_PATH = path.join(__dirname, '..', 'data', 'test.db');
const BASE_URL = `http://localhost:${PORT}`;
const JWT_SECRET = 'test_secret_key_minimum_32_characters_long!!';
const JWT_EXPIRES_IN = '1h';

// Clean slate: remove old test database
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

// Environment for the spawned server
const env = Object.assign({}, process.env, {
  PORT: String(PORT),
  DB_PATH: DB_PATH,
  JWT_SECRET: JWT_SECRET,
  JWT_EXPIRES_IN: JWT_EXPIRES_IN
});

// Start server as a child process
const server = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, '..'),
  env: env,
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverOutput = '';
server.stdout.on('data', (d) => { serverOutput += d.toString(); });
server.stderr.on('data', (d) => { serverOutput += d.toString(); });

// ---- Test harness ----
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, name) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  ❌ FAIL: ${name}`);
  }
}

// HTTP request helper
function request(method, urlPath, body, token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: urlPath,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = 'Bearer ' + token;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (e) { parsed = null; }
        resolve({ status: res.statusCode, body: data, json: parsed });
      });
    });
    req.on('error', (e) => {
      resolve({ status: 0, body: '', json: null, error: e.message });
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Wait for server to be ready
async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const r = await request('GET', '/api/health', null, null);
      if (r.status === 200) return true;
    } catch (e) { /* not ready yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function runTests() {
  console.log('\n=== Task Management REST API — Automated Tests ===\n');

  // 1. Health endpoint
  console.log('[1] Health endpoint');
  let r = await request('GET', '/api/health', null, null);
  assert(r.status === 200, 'Health returns 200');
  assert(r.json && r.json.status === 'ok', 'Health returns status ok');

  // 2. Valid registration
  console.log('\n[2] Valid registration');
  r = await request('POST', '/api/auth/register', { name: 'Test User', email: 'test@example.com', password: 'TestPass123' }, null);
  assert(r.status === 201, 'Register returns 201');
  assert(r.json && r.json.success === true, 'Register success true');
  assert(r.json && r.json.data && r.json.data.token, 'Register returns token');
  assert(r.json && r.json.data.user && !r.json.data.user.password_hash, 'Register does not return password hash');
  const token1 = r.json.data.token;

  // 3. Invalid registration
  console.log('\n[3] Invalid registration');
  r = await request('POST', '/api/auth/register', { name: '', email: 'bademail', password: '123' }, null);
  assert(r.status === 400, 'Invalid register returns 400');
  assert(r.json && Array.isArray(r.json.errors), 'Invalid register returns errors array');

  // 4. Duplicate email
  console.log('\n[4] Duplicate email registration');
  r = await request('POST', '/api/auth/register', { name: 'Test User', email: 'test@example.com', password: 'TestPass123' }, null);
  assert(r.status === 409, 'Duplicate email returns 409');
  assert(r.json && r.json.success === false, 'Duplicate email success false');

  // 5. Password stored as hash
  console.log('\n[5] Password stored as hash');
  const db = new Database(DB_PATH);
  const userRow = db.prepare('SELECT password_hash FROM users WHERE email = ?').get('test@example.com');
  assert(userRow && userRow.password_hash.startsWith('$2'), 'Password stored as bcrypt hash');
  assert(userRow && userRow.password_hash !== 'TestPass123', 'Password not stored as plaintext');
  db.close();

  // 6. Valid login
  console.log('\n[6] Valid login');
  r = await request('POST', '/api/auth/login', { email: 'test@example.com', password: 'TestPass123' }, null);
  assert(r.status === 200, 'Login returns 200');
  assert(r.json && r.json.data && r.json.data.token, 'Login returns token');
  const loginToken = r.json.data.token;

  // 7. Invalid login
  console.log('\n[7] Invalid login');
  r = await request('POST', '/api/auth/login', { email: 'test@example.com', password: 'WrongPass' }, null);
  assert(r.status === 401, 'Invalid login returns 401');
  r = await request('POST', '/api/auth/login', { email: 'nope@example.com', password: 'TestPass123' }, null);
  assert(r.status === 401, 'Unknown email login returns 401');

  // 8. Missing token
  console.log('\n[8] Missing token');
  r = await request('GET', '/api/tasks', null, null);
  assert(r.status === 401, 'Missing token returns 401');

  // 9. Invalid token
  console.log('\n[9] Invalid and expired tokens');
  r = await request('GET', '/api/tasks', null, 'not.a.valid.token');
  assert(r.status === 401, 'Invalid token returns 401');

  // Expired token (manually signed with past exp)
  const expiredToken = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: -10 });
  r = await request('GET', '/api/tasks', null, expiredToken);
  assert(r.status === 401, 'Expired token returns 401');

  // 10. Task CRUD
  console.log('\n[10] Task CRUD');
  // Create
  r = await request('POST', '/api/tasks', { title: 'My Task', description: 'desc', completed: false }, loginToken);
  assert(r.status === 201, 'Create task returns 201');
  assert(r.json && r.json.data && r.json.data.task && r.json.data.task.title === 'My Task', 'Created task has correct title');
  const taskId = r.json.data.task.id;

  // List
  r = await request('GET', '/api/tasks', null, loginToken);
  assert(r.status === 200, 'List tasks returns 200');
  assert(r.json && r.json.data && r.json.data.count >= 1, 'List tasks returns count');
  assert(r.json && Array.isArray(r.json.data.tasks), 'List tasks returns array');

  // Get single
  r = await request('GET', `/api/tasks/${taskId}`, null, loginToken);
  assert(r.status === 200, 'Get single task returns 200');
  assert(r.json && r.json.data.task.id === taskId, 'Get single returns correct task');

  // Update
  r = await request('PUT', `/api/tasks/${taskId}`, { title: 'Updated', completed: true }, loginToken);
  assert(r.status === 200, 'Update task returns 200');
  assert(r.json && r.json.data.task.completed === true, 'Update sets completed true');
  assert(r.json && r.json.data.task.title === 'Updated', 'Update sets title');

  // Delete
  r = await request('DELETE', `/api/tasks/${taskId}`, null, loginToken);
  assert(r.status === 200, 'Delete task returns 200');

  // Get deleted
  r = await request('GET', `/api/tasks/${taskId}`, null, loginToken);
  assert(r.status === 404, 'Get deleted task returns 404');

  // 11. Invalid task data
  console.log('\n[11] Invalid task data');
  r = await request('POST', '/api/tasks', { title: '' }, loginToken);
  assert(r.status === 400, 'Empty title returns 400');
  r = await request('POST', '/api/tasks', { title: 'X'.repeat(300) }, loginToken);
  assert(r.status === 400, 'Too-long title returns 400');

  // 12. Nonexistent task
  console.log('\n[12] Nonexistent task');
  r = await request('GET', '/api/tasks/999999', null, loginToken);
  assert(r.status === 404, 'Nonexistent task GET returns 404');
  r = await request('PUT', '/api/tasks/999999', { title: 'X' }, loginToken);
  assert(r.status === 404, 'Nonexistent task PUT returns 404');
  r = await request('DELETE', '/api/tasks/999999', null, loginToken);
  assert(r.status === 404, 'Nonexistent task DELETE returns 404');

  // 13. User isolation
  console.log('\n[13] User isolation (User A vs User B)');
  // Register User B
  r = await request('POST', '/api/auth/register', { name: 'User B', email: 'userb@example.com', password: 'UserBPass123' }, null);
  const tokenB = r.json.data.token;

  // User A creates a task
  r = await request('POST', '/api/tasks', { title: 'User A private task' }, loginToken);
  const privateTaskId = r.json.data.task.id;

  // User B cannot read it
  r = await request('GET', `/api/tasks/${privateTaskId}`, null, tokenB);
  assert(r.status === 404, 'User B cannot read User A task (404)');

  // User B cannot update it
  r = await request('PUT', `/api/tasks/${privateTaskId}`, { title: 'Hacked' }, tokenB);
  assert(r.status === 404, 'User B cannot update User A task (404)');

  // User B cannot delete it
  r = await request('DELETE', `/api/tasks/${privateTaskId}`, null, tokenB);
  assert(r.status === 404, 'User B cannot delete User A task (404)');

  // Verify User A's task is unchanged
  r = await request('GET', `/api/tasks/${privateTaskId}`, null, loginToken);
  assert(r.status === 200 && r.json.data.task.title === 'User A private task', 'User A task unchanged after B attempts');

  // 14. Tasks persist after restart
  console.log('\n[14] Tasks persist after server restart');
  // Create a task
  r = await request('POST', '/api/tasks', { title: 'Persistent task' }, loginToken);
  const persistTaskId = r.json.data.task.id;

  // Kill server
  server.kill();
  await new Promise((r) => setTimeout(r, 2000));

  // Restart server
  const server2 = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: env,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  await new Promise((resolve) => {
    server2.stdout.on('data', (d) => {
      if (d.toString().includes('running')) resolve();
    });
    server2.stderr.on('data', () => {});
    setTimeout(resolve, 5000);
  });
  await new Promise((r) => setTimeout(r, 1000));

  r = await request('GET', `/api/tasks/${persistTaskId}`, null, loginToken);
  assert(r.status === 200, 'Task persists after server restart');
  assert(r.json && r.json.data.task.title === 'Persistent task', 'Persisted task has correct title');

  // Cleanup
  server2.kill();

  // 15. Malformed request doesn't crash
  console.log('\n[15] Malformed request handling');
  // Restart a fresh server for this test
  const server3 = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: env,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  await new Promise((resolve) => {
    server3.stdout.on('data', (d) => {
      if (d.toString().includes('running')) resolve();
    });
    server3.stderr.on('data', () => {});
    setTimeout(resolve, 5000);
  });
  await new Promise((r) => setTimeout(r, 1000));

  r = await request('POST', '/api/auth/register', null, null);
  // send raw malformed body
  const malformedRes = await new Promise((resolve) => {
    const options = { hostname: 'localhost', port: PORT, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.write('{invalid json');
    req.end();
  });
  assert(malformedRes.status === 400, 'Malformed JSON returns 400');
  // Server still alive after malformed request
  const healthRes = await request('GET', '/api/health', null, null);
  assert(healthRes.status === 200, 'Server still alive after malformed request');

  server3.kill();

  // ---- Summary ----
  console.log('\n========================================');
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailed tests:');
    failures.forEach((f) => console.log('  - ' + f));
  }
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

waitForServer().then((ready) => {
  if (!ready) {
    console.error('Server did not start in time.');
    console.error(serverOutput);
    server.kill();
    process.exit(1);
  }
  runTests().catch((e) => {
    console.error('Test runner error:', e);
    server.kill();
    process.exit(1);
  });
});
