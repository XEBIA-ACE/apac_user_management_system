import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type Redis from 'ioredis';

const KEY_PREFIX = 'ums:token-blacklist:';

// Backing store: Redis (US-001 T011 decision). Redis is already a declared dependency of this
// service (REDIS_URL, Bull queue), so no new external dependency is introduced; an in-process
// store was rejected because revocations would not be shared across API instances or survive
// restarts. Redis unavailability fails closed (HTTP 401) in AuthMiddleware.
// TODO(stakeholder): session timeout and concurrent session limits are unresolved.
export class TokenBlacklist {
  constructor(private readonly redis: Pick<Redis, 'set' | 'exists'>) {}

  /** Revokes a token until its natural expiry (logout US-016, account deletion US-017). */
  async invalidate(token: string, _userId: string): Promise<void> {
    await this.redis.set(this.key(token), '1', 'EX', this.remainingTtlSeconds(token));
  }

  /** Throws when the store is unavailable so callers fail closed. */
  async isBlacklisted(token: string): Promise<boolean> {
    return (await this.redis.exists(this.key(token))) > 0;
  }

  private key(token: string): string {
    return KEY_PREFIX + createHash('sha256').update(token).digest('hex');
  }

  private remainingTtlSeconds(token: string): number {
    const decoded = jwt.decode(token);
    const exp = decoded && typeof decoded === 'object' ? decoded.exp : undefined;
    const remaining = typeof exp === 'number' ? exp - Math.floor(Date.now() / 1000) : 0;
    return Math.max(remaining, 1);
  }
}
