import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildTestApp, signToken } from './helpers';

describe('GET /api/v1/health (EP-API-007)', () => {
  it('returns 200 healthy when the database is reachable', async () => {
    const { app } = buildTestApp({ databaseUp: true });
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
      dependencies: { database: 'up' },
    });
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });

  it('returns 503 unhealthy when the database is unreachable', async () => {
    const { app } = buildTestApp({ databaseUp: false });
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('unhealthy');
    expect(res.body.dependencies).toEqual({ database: 'down' });
  });
});

const expectEnvelope = (body: unknown, code: string) => {
  expect(body).toEqual({
    error: { code, message: expect.any(String), request_id: expect.any(String) },
  });
};

describe('public placeholder routes', () => {
  it.each([
    ['/api/v1/auth/register', { name: 'A', email: 'a@example.com', password: 'x' }],
    ['/api/v1/auth/verify-otp', { email: 'a@example.com', code: '123456' }],
    ['/api/v1/auth/login', { email: 'a@example.com', password: 'x' }],
  ])('POST %s returns 501 in the error envelope', async (path, body) => {
    const { app } = buildTestApp();
    const res = await request(app).post(path).send(body);
    expect(res.status).toBe(501);
    expectEnvelope(res.body, 'NOT_IMPLEMENTED');
    expect(res.headers['x-request-id']).toBe(res.body.error.request_id);
  });
});

const protectedRoutes = [
  ['post', '/api/v1/auth/logout'],
  ['get', '/api/v1/dashboard'],
  ['delete', '/api/v1/users/me'],
] as const;

describe('protected placeholder routes (AuthMiddleware)', () => {
  it.each(protectedRoutes)('%s %s returns 401 without a bearer token', async (method, path) => {
    const { app } = buildTestApp();
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expectEnvelope(res.body, 'UNAUTHORIZED');
  });

  it.each(protectedRoutes)('%s %s returns 401 for a tampered token', async (method, path) => {
    const { app } = buildTestApp();
    const res = await request(app)[method](path).set('Authorization', `Bearer ${signToken()}x`);
    expect(res.status).toBe(401);
  });

  it.each(protectedRoutes)('%s %s returns 401 for a blacklisted token', async (method, path) => {
    const { app, tokenBlacklist } = buildTestApp();
    const token = signToken();
    await tokenBlacklist.invalidate(token, 'user-1');
    const res = await request(app)[method](path).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it.each(protectedRoutes)(
    '%s %s fails closed (401) when the blacklist store is down',
    async (method, path) => {
      const { app, redis } = buildTestApp();
      redis.failing = true;
      const res = await request(app)[method](path).set('Authorization', `Bearer ${signToken()}`);
      expect(res.status).toBe(401);
    },
  );

  it.each(protectedRoutes)('%s %s returns 501 for a valid token', async (method, path) => {
    const { app } = buildTestApp();
    const res = await request(app)[method](path).set('Authorization', `Bearer ${signToken()}`);
    expect(res.status).toBe(501);
    expectEnvelope(res.body, 'NOT_IMPLEMENTED');
  });

  it('rejects a token carrying unexpected claim types', async () => {
    const { app } = buildTestApp();
    const token = signToken({ userId: 42, isVerified: 'yes' });
    const res = await request(app).get('/api/v1/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/v1/users/me ownership (US-004)', () => {
  it('passes only req.user.userId from the JWT to UserService.deleteAccount', async () => {
    const { app, userService } = buildTestApp();
    const calls: unknown[][] = [];
    userService.deleteAccount = async (...args: unknown[]) => {
      calls.push(args);
    };
    const res = await request(app)
      .delete('/api/v1/users/me?userId=attacker')
      .set('Authorization', `Bearer ${signToken({ userId: 'owner', isVerified: true })}`)
      .send({ userId: 'attacker' });
    expect(res.status).toBe(200);
    expect(calls).toEqual([['owner']]);
  });
});

describe('GlobalExceptionHandler', () => {
  it('returns 404 in the error envelope for unknown routes', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get('/api/v1/unknown');
    expect(res.status).toBe(404);
    expectEnvelope(res.body, 'NOT_FOUND');
  });

  it('returns 400 without internal details for malformed JSON', async () => {
    const { app } = buildTestApp();
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":');
    expect(res.status).toBe(400);
    expectEnvelope(res.body, 'VALIDATION_ERROR');
    expect(JSON.stringify(res.body)).not.toMatch(/at |stack|SyntaxError/);
  });

  it('maps unexpected errors to a sanitised 500', async () => {
    const { app, userService } = buildTestApp();
    userService.register = async () => {
      throw new Error('connect ECONNREFUSED 10.0.0.5:5432');
    };
    const res = await request(app).post('/api/v1/auth/register').send({});
    expect(res.status).toBe(500);
    expectEnvelope(res.body, 'INTERNAL_ERROR');
    expect(JSON.stringify(res.body)).not.toContain('ECONNREFUSED');
  });
});
