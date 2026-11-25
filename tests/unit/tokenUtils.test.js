const {
  generateSecureToken,
  hashToken,
  generateTokenWithExpiry
} = require('../../utils/tokenUtils');
const crypto = require('crypto');

describe('tokenUtils', () => {
  describe('generateSecureToken', () => {
    it('returns a 64-char hex string', () => {
      const t = generateSecureToken();
      expect(typeof t).toBe('string');
      expect(t).toMatch(/^[0-9a-f]{64}$/);
    });

    it('returns unique values', () => {
      const a = generateSecureToken();
      const b = generateSecureToken();
      expect(a).not.toBe(b);
    });
  });

  describe('hashToken', () => {
    it('returns sha256 hex digest', () => {
      const h = hashToken('abc');
      expect(h).toBe(crypto.createHash('sha256').update('abc').digest('hex'));
      expect(h).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is deterministic', () => {
      expect(hashToken('same')).toBe(hashToken('same'));
    });

    it('differs for different input', () => {
      expect(hashToken('a')).not.toBe(hashToken('b'));
    });

    it('handles empty string', () => {
      expect(hashToken('')).toBe(crypto.createHash('sha256').update('').digest('hex'));
    });
  });

  describe('generateTokenWithExpiry', () => {
    it('returns rawToken, tokenHash, expiry', () => {
      const r = generateTokenWithExpiry();
      expect(r.rawToken).toMatch(/^[0-9a-f]{64}$/);
      expect(r.tokenHash).toBe(hashToken(r.rawToken));
      expect(r.expiry).toBeInstanceOf(Date);
    });

    it('expiry defaults to ~60 minutes in the future', () => {
      const before = Date.now();
      const r = generateTokenWithExpiry();
      const after = Date.now();
      const mins = (r.expiry.getTime() - before) / 60000;
      expect(mins).toBeGreaterThan(59);
      expect(mins).toBeLessThan(61);
      expect(r.expiry.getTime()).toBeGreaterThan(after);
    });

    it('respects custom expiry minutes', () => {
      const r = generateTokenWithExpiry(5);
      const mins = (r.expiry.getTime() - Date.now()) / 60000;
      expect(mins).toBeGreaterThan(4.9);
      expect(mins).toBeLessThan(5.1);
    });

    it('respects 24h expiry', () => {
      const r = generateTokenWithExpiry(24 * 60);
      const hours = (r.expiry.getTime() - Date.now()) / 3600000;
      expect(hours).toBeGreaterThan(23.9);
      expect(hours).toBeLessThan(24.1);
    });

    it('raw token differs each call', () => {
      const a = generateTokenWithExpiry();
      const b = generateTokenWithExpiry();
      expect(a.rawToken).not.toBe(b.rawToken);
      expect(a.tokenHash).not.toBe(b.tokenHash);
    });
  });
});