import { describe, expect, it } from 'vitest';
import { createDatabaseHealthCheck } from '../src/infrastructure/database/prisma';

describe('createDatabaseHealthCheck (T004)', () => {
  it('reports up when SELECT 1 succeeds', async () => {
    const check = createDatabaseHealthCheck({ $queryRaw: (async () => [1]) as never });
    await expect(check()).resolves.toBe(true);
  });

  it('reports down when the query fails', async () => {
    const check = createDatabaseHealthCheck({
      $queryRaw: (async () => {
        throw new Error('unreachable');
      }) as never,
    });
    await expect(check()).resolves.toBe(false);
  });

  it('reports down when the query exceeds the timeout', async () => {
    const check = createDatabaseHealthCheck(
      { $queryRaw: (() => new Promise(() => undefined)) as never },
      20,
    );
    await expect(check()).resolves.toBe(false);
  });
});
