// Acceptance tests for US-001 — View Delete Account Option on Dashboard (GET /api/v1/dashboard).
// Each test references its acceptance criterion and test obligation id
// (abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-N).
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import {
  JWT_CLOCK_TOLERANCE_SECONDS,
  SESSION_STORE_QUERY_TIMEOUT_MS,
} from '../src/application/AuthService';
import { AccountStatus } from '../src/domain/AccountStatus';
import { dashboardResponseSchema, errorResponseSchema } from '../src/presentation/schemas';
import { TEST_JWT, buildTestApp, signToken, testUser } from './helpers';

const DASHBOARD = '/api/v1/dashboard';
const bearer = (token: string) => `Bearer ${token}`;

const expectUnauthorized = (res: request.Response) => {
  expect(res.status).toBe(401);
  expect(Object.keys(res.body)).toEqual(['error']);
  expect(errorResponseSchema.validate(res.body.error).error).toBeUndefined();
  expect(res.body.error.code).toBe('UNAUTHORIZED');
  expect(res.body.error.correlationId).toBe(res.headers['x-request-id']);
  expect(JSON.stringify(res.body)).not.toMatch(/delete_account_visible|features|"user"/);
};

/** Spies on UserController.getDashboard's only collaborator to prove the controller never ran. */
const spyController = (userService: { getDashboardUser: (id: string) => Promise<unknown> }) =>
  vi.spyOn(userService, 'getDashboardUser');

describe('US-001 GET /api/v1/dashboard', () => {
  it('[US-001-ac-1] valid, non-expired, non-blacklisted token → 200 DashboardResponse with features.delete_account_visible: true', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get(DASHBOARD).set('Authorization', bearer(signToken()));
    expect(res.status).toBe(200);
    expect(res.body.features).toEqual({ delete_account_visible: true });
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('[US-001-ac-2] no Authorization header → 401 ErrorResponse UNAUTHORIZED, no dashboard content', async () => {
    const { app, userService } = buildTestApp();
    const controller = spyController(userService);
    const res = await request(app).get(DASHBOARD);
    expectUnauthorized(res);
    expect(controller).not.toHaveBeenCalled();
  });

  it.each(['Basic dXNlcjpwYXNz', 'Bearer', 'Bearer not-a-jwt', signToken()])(
    '[US-001-ac-2] non-Bearer / malformed Authorization header %j → 401 UNAUTHORIZED',
    async (header) => {
      const { app } = buildTestApp();
      expectUnauthorized(await request(app).get(DASHBOARD).set('Authorization', header));
    },
  );

  it('[US-001-ac-3] expired token (exp in the past) → 401 before the controller runs', async () => {
    const { app, userService, users } = buildTestApp();
    const controller = spyController(userService);
    const expired = signToken(undefined, -1);
    expectUnauthorized(await request(app).get(DASHBOARD).set('Authorization', bearer(expired)));
    expect(controller).not.toHaveBeenCalled();
    expect(users.findByIdCalls).toEqual([]);
  });

  it('[US-001-ac-3] token is rejected at exactly its exp second (clock-skew tolerance 0)', async () => {
    expect(JWT_CLOCK_TOLERANCE_SECONDS).toBe(0);
    const { app } = buildTestApp();
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      { sub: 'user-1', email: 'user-1@example.com', iat: now - 60, exp: now },
      TEST_JWT.secret,
      { algorithm: 'HS256' },
    );
    expectUnauthorized(await request(app).get(DASHBOARD).set('Authorization', bearer(token)));
  });

  it('[US-001-ac-4] token blacklisted after logout → TokenBlacklist.isBlacklisted() → 401, controller not invoked', async () => {
    const { app, userService, tokenBlacklist } = buildTestApp();
    const token = signToken();
    const isBlacklisted = vi.spyOn(tokenBlacklist, 'isBlacklisted');
    const logout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', bearer(token));
    expect(logout.status).toBe(200);

    const controller = spyController(userService);
    expectUnauthorized(await request(app).get(DASHBOARD).set('Authorization', bearer(token)));
    expect(isBlacklisted).toHaveBeenLastCalledWith(token);
    expect(controller).not.toHaveBeenCalled();
  });

  it('[US-001-ac-4] token blacklisted after account deletion (TokenBlacklist.invalidate) → 401', async () => {
    const { app, tokenBlacklist } = buildTestApp();
    const token = signToken();
    await tokenBlacklist.invalidate(token, 'user-1');
    expectUnauthorized(await request(app).get(DASHBOARD).set('Authorization', bearer(token)));
  });

  it('[US-001-ac-5] every HTTP 200 matches the DashboardResponse schema with delete_account_visible === true', async () => {
    const { app, users } = buildTestApp();
    users.users.set('pending-user', testUser('pending-user', AccountStatus.PENDING));
    for (const sub of ['user-1', 'owner', 'pending-user']) {
      const token = signToken({ sub, email: `${sub}@example.com` });
      const res = await request(app).get(DASHBOARD).set('Authorization', bearer(token));
      expect(res.status).toBe(200);
      expect(dashboardResponseSchema.validate(res.body).error).toBeUndefined();
      expect(res.body.features.delete_account_visible).toBe(true);
    }
    expect(
      dashboardResponseSchema.validate({
        user: (await request(app).get(DASHBOARD).set('Authorization', bearer(signToken()))).body
          .user,
        features: { delete_account_visible: false },
      }).error,
    ).toBeDefined();
  });

  it('[US-001-ac-6] identity comes only from req.user (JwtPayload.sub); query and body are ignored; UserDTO returned', async () => {
    const { app, users } = buildTestApp();
    const res = await request(app)
      .get(`${DASHBOARD}?userId=owner&sub=owner&id=owner`)
      .set('Authorization', bearer(signToken({ sub: 'user-1', email: 'user-1@example.com' })))
      .send({ userId: 'owner', sub: 'owner', id: 'owner' });
    expect(res.status).toBe(200);
    expect(users.findByIdCalls.every((id) => id === 'user-1')).toBe(true);
    expect(res.body).toEqual({
      user: {
        id: 'user-1',
        name: 'Name user-1',
        email: 'user-1@example.com',
        is_verified: true,
        created_at: '2026-01-02T03:04:05.000Z',
      },
      features: { delete_account_visible: true },
    });
    expect(JSON.stringify(res.body)).not.toMatch(/hashed|password/i);
  });

  it('[US-001-ac-6] a token for a deleted or unknown account never receives the dashboard', async () => {
    const { app, users } = buildTestApp();
    users.users.set('gone', testUser('gone', AccountStatus.DELETED));
    for (const sub of ['gone', 'missing']) {
      const token = signToken({ sub, email: `${sub}@example.com` });
      expectUnauthorized(await request(app).get(DASHBOARD).set('Authorization', bearer(token)));
    }
  });

  it('[US-001-ac-7] session validation completes within the 1 s SLA under 500 concurrent requests', async () => {
    const { app } = buildTestApp();
    const server = app.listen(0);
    try {
      const token = signToken();
      const results = await Promise.all(
        Array.from({ length: 500 }, async () => {
          const startedAt = performance.now();
          const res = await request(server).get(DASHBOARD).set('Authorization', bearer(token));
          return { res, elapsed: performance.now() - startedAt };
        }),
      );
      for (const { res, elapsed } of results) {
        expect(res.status).toBe(200);
        expect(res.body.features.delete_account_visible).toBe(true);
        const authDuration = Number(/auth;dur=([\d.]+)/.exec(res.headers['server-timing'])?.[1]);
        expect(authDuration).toBeLessThan(1000);
        expect(elapsed).toBeLessThan(1000);
      }
    } finally {
      server.close();
    }
  }, 20_000);

  it('[US-001-ac-7] AuthMiddleware exposes its validation duration as a Server-Timing metric', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get(DASHBOARD).set('Authorization', bearer(signToken()));
    expect(res.headers['server-timing']).toMatch(/^auth;dur=\d+\.\d{2}$/);
  });

  it('[US-001-ac-8] PostgreSQL session store unavailable → 401 fail-secure, outage logged with correlation id', async () => {
    const { app, users, userService, logger } = buildTestApp();
    users.failing = true;
    const controller = spyController(userService);
    const logError = vi.spyOn(logger, 'error');
    const res = await request(app).get(DASHBOARD).set('Authorization', bearer(signToken()));
    expectUnauthorized(res);
    expect(controller).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith(
      expect.stringContaining('fail-secure'),
      expect.objectContaining({
        store: 'postgresql_session_store',
        correlationId: res.body.error.correlationId,
      }),
    );
  });

  it(`[US-001-ac-8] PostgreSQL session store slower than ${SESSION_STORE_QUERY_TIMEOUT_MS} ms → 401 fail-secure`, async () => {
    const { app, users, userService } = buildTestApp();
    users.delayMs = SESSION_STORE_QUERY_TIMEOUT_MS + 200;
    const controller = spyController(userService);
    const startedAt = performance.now();
    const res = await request(app).get(DASHBOARD).set('Authorization', bearer(signToken()));
    expectUnauthorized(res);
    expect(performance.now() - startedAt).toBeLessThan(SESSION_STORE_QUERY_TIMEOUT_MS + 150);
    expect(controller).not.toHaveBeenCalled();
  });

  it('[US-001-ac-8] token blacklist store unavailable → 401 fail-secure', async () => {
    const { app, redis } = buildTestApp();
    redis.failing = true;
    expectUnauthorized(await request(app).get(DASHBOARD).set('Authorization', bearer(signToken())));
  });
});
