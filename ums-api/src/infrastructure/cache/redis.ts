import Redis from 'ioredis';

/**
 * Creates a Redis client configured exclusively from REDIS_URL. The offline queue is disabled so
 * commands fail immediately while Redis is unreachable (fail-secure token checks), and every
 * command is bounded by REDIS_COMMAND_TIMEOUT_MS so a slow Redis cannot breach the 1 s dashboard
 * SLA (US-001-ac-7).
 */
export const REDIS_COMMAND_TIMEOUT_MS = 500;

export function createRedisClient(redisUrl: string): Redis {
  return new Redis(redisUrl, {
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    commandTimeout: REDIS_COMMAND_TIMEOUT_MS,
  });
}
