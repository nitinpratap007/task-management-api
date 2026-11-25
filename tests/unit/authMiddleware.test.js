jest.mock('../../config/db', () => ({ query: jest.fn() }));

const db = require('../../config/db');
const authMiddleware = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function make(authHeader) {
    const req = { headers: { authorization: authHeader } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    return { req, res, next };
  }

  it('missing header -> 401', async () => {
    const { req, res, next } = make(undefined);
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('malformed header -> 401', async () => {
    const { req, res, next } = make('Token abc');
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('invalid token -> 401', async () => {
    const { req, res, next } = make('Bearer not.a.token');
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('expired token -> 401', async () => {
    const expired = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: -10 });
    const { req, res, next } = make(`Bearer ${expired}`);
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('valid token but user missing -> 401', async () => {
    const token = jwt.sign({ userId: 999 }, JWT_SECRET, { expiresIn: '1h' });
    db.query.mockResolvedValue({ rows: [] });
    const { req, res, next } = make(`Bearer ${token}`);
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Token is valid but user no longer exists.' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('valid token and user -> sets req.user and calls next', async () => {
    const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '1h' });
    db.query.mockResolvedValue({ rows: [{ id: 1, name: 'N', email: 'e@e.com' }] });
    const { req, res, next } = make(`Bearer ${token}`);
    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1, name: 'N', email: 'e@e.com' });
  });
});