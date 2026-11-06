import jwt from 'jsonwebtoken';
import type { AppConfig } from '../config';
import { AppError } from '../domain/AppError';
import type { AuthResponse, LoginRequest } from '../domain/dtos';
import { AccountStatus } from '../domain/AccountStatus';
import type { JwtPayload } from '../domain/JwtPayload';
import type { TokenBlacklist } from '../infrastructure/cache/TokenBlacklist';
import type { IUserRepository } from '../infrastructure/repositories/IUserRepository';
import { withTimeout } from './withTimeout';

const JWT_ALGORITHM = 'HS256';

/**
 * exp is enforced with zero clock skew: a token is rejected at or after its exp second (US-001-ac-3).
 * TODO(stakeholder): confirm 0 s tolerance against client clock drift (US-001 open item #4).
 */
export const JWT_CLOCK_TOLERANCE_SECONDS = 0;

/**
 * Upper bound for the PostgreSQL session-store lookup performed on every protected request. A
 * slower or failing lookup is treated as an outage and the request is rejected with 401
 * (US-001-ac-8). 500 ms leaves headroom inside the 1 s dashboard SLA (US-001-ac-7).
 */
export const SESSION_STORE_QUERY_TIMEOUT_MS = 500;

// TODO(stakeholder): login rate-limiting threshold (US-012) is unresolved. Documented conservative
// default until confirmed: 5 failed attempts per 15-minute window per IP (HTTP 429, generic message).
export const LOGIN_RATE_LIMIT = { maxFailedAttempts: 5, windowMs: 15 * 60 * 1000 } as const;

export class AuthService {
  constructor(
    protected readonly userRepository: IUserRepository,
    protected readonly tokenBlacklist: TokenBlacklist,
    private readonly jwtConfig: AppConfig['jwt'],
  ) {}

  /**
   * Must throw AppError.invalidCredentials() — the identical generic 401 — for every failure:
   * non-existent email, wrong password, unverified account, deleted account (US-011).
   */
  async login(_dto: LoginRequest): Promise<AuthResponse> {
    throw AppError.notImplemented();
  }

  /** Revokes the token via TokenBlacklist.invalidate(); fails secure if the store is down. */
  async logout(userId: string, token: string): Promise<void> {
    await this.tokenBlacklist.invalidate(token, userId);
  }

  /** Verifies HS256 signature and expiry; returns only the minimal claims (PAT-005). */
  validateToken(token: string): JwtPayload {
    let decoded: string | jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, this.jwtConfig.secret, {
        algorithms: [JWT_ALGORITHM],
        clockTolerance: JWT_CLOCK_TOLERANCE_SECONDS,
      });
    } catch {
      throw AppError.unauthorized();
    }

    if (
      typeof decoded !== 'object' ||
      typeof decoded.sub !== 'string' ||
      decoded.sub.length === 0 ||
      typeof decoded.email !== 'string' ||
      typeof decoded.iat !== 'number' ||
      typeof decoded.exp !== 'number'
    ) {
      throw AppError.unauthorized();
    }

    return { sub: decoded.sub, email: decoded.email, iat: decoded.iat, exp: decoded.exp };
  }

  /**
   * Confirms against the PostgreSQL session store that the token's account still exists and has
   * not been deleted. Returns false for an inactive session; throws when the store is unavailable
   * or slower than SESSION_STORE_QUERY_TIMEOUT_MS so callers fail closed (US-001-ac-8).
   */
  async isSessionActive(payload: JwtPayload): Promise<boolean> {
    const user = await withTimeout(
      this.userRepository.findById(payload.sub),
      SESSION_STORE_QUERY_TIMEOUT_MS,
      'Session store query',
    );
    return user !== null && user.status !== AccountStatus.DELETED;
  }
}
