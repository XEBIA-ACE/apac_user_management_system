import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type Redis from 'ioredis';

const KEY_PREFIX = 'ums:token-blacklist:';

// TODO(stakeholder): token blacklist backend is unresolved — Redis (this default) vs. a PostgreSQL
// sessions table (JWT STATELESS MODEL vs. SESSION STORE gap, COMP-003 vs. US-016/US-017).
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
