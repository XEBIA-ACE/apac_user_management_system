import { PrismaClient } from '@prisma/client';

let client: PrismaClient | undefined;

/**
 * Returns the process-wide Prisma client, configured exclusively from DATABASE_URL. The client
 * connects lazily on first query so the service can start (and report unhealthy) while the
 * database is unreachable.
 */
export function getPrismaClient(databaseUrl: string): PrismaClient {
  if (!client) {
    client = new PrismaClient({ datasourceUrl: databaseUrl });
  }
  return client;
}

export async function disconnectPrisma(): Promise<void> {
  if (client) {
    await client.$disconnect();
    client = undefined;
  }
}

export type DatabaseHealthCheck = () => Promise<boolean>;

const DEFAULT_HEALTH_TIMEOUT_MS = 2000;

/** Builds a connectivity probe (`SELECT 1`) used by GET /api/v1/health. */
export function createDatabaseHealthCheck(
  db: Pick<PrismaClient, '$queryRaw'>,
  timeoutMs: number = DEFAULT_HEALTH_TIMEOUT_MS,
): DatabaseHealthCheck {
  return async () => {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Database health check timed out')), timeoutMs);
    });
    try {
      await Promise.race([db.$queryRaw`SELECT 1`, timeout]);
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  };
}
