// Acceptance tests for US-005 — View Account Details on Profile Page (GET /api/v1/users/me).
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildTestApp, signToken, testUser } from './helpers';

const PROFILE = '/api/v1/users/me';
const bearer = (t: string) => `Bearer ${t}`;

describe('US-005 GET /api/v1/users/me', () => {
  it('[US-005-ac-2] returns name, email, registration date and account status', async () => {
    const { app } = buildTestApp();
    const res = await request(app).get(PROFILE).set('Authorization', bearer(signToken()));
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      name: 'Name user-1',
      email: 'user-1@example.com',
      created_at: '2026-01-02T03:04:05.000Z',
      account_status: 'ACTIVE',
    });
    expect(JSON.stringify(res.body)).not.toMatch(/hashed/i);
  });

  it('[US-005-ac-5] values match the record of the session identity only (cross-user isolation)', async () => {
    const { app, users } = buildTestApp();
    const res = await request(app)
      .get(`${PROFILE}?id=owner&email=owner@example.com`)
      .set('Authorization', bearer(signToken({ sub: 'user-1', email: 'user-1@example.com' })));
    expect(res.body.user.email).toBe(users.users.get('user-1')!.email);
    expect(res.body.user.email).not.toBe(testUser('owner').email);
    expect(users.findByIdCalls).toEqual(['user-1']);
  });

  it('[US-005-ac-3] exposes no mutation endpoints for the profile', async () => {
    const { app } = buildTestApp();
    for (const method of ['post', 'put', 'patch'] as const) {
      const res = await request(app)[method](PROFILE).set('Authorization', bearer(signToken()));
      expect(res.status).toBeGreaterThanOrEqual(400);
    }
  });

  it('[US-005-ac-1] unauthenticated requests are rejected before any data lookup', async () => {
    const { app, users } = buildTestApp();
    const res = await request(app).get(PROFILE);
    expect(res.status).toBe(401);
    expect(users.findByIdCalls).toEqual([]);
  });

  it('[US-005-ac-4] responds within 1 second', async () => {
    const { app } = buildTestApp();
    const start = Date.now();
    await request(app).get(PROFILE).set('Authorization', bearer(signToken())).expect(200);
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
