import Redis from 'ioredis';

/**
 * Creates a Redis client configured exclusively from REDIS_URL. The offline queue is disabled so
 * commands fail immediately while Redis is unreachable (fail-secure token checks).
 */
export function createRedisClient(redisUrl: string): Redis {
  return new Redis(redisUrl, {
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
  });
}
