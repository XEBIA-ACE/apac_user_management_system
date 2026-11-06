import jwt from 'jsonwebtoken';
import type { AppConfig } from '../config';
import { AppError } from '../domain/AppError';
import type { AuthResponse, LoginRequest } from '../domain/dtos';
import type { JwtPayload } from '../domain/JwtPayload';
import type { TokenBlacklist } from '../infrastructure/cache/TokenBlacklist';
import type { IUserRepository } from '../infrastructure/repositories/IUserRepository';

const JWT_ALGORITHM = 'HS256';

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
  async logout(_userId: string, _token: string): Promise<void> {
    throw AppError.notImplemented();
  }

  /** Verifies HS256 signature and expiry; returns only the minimal claims (PAT-005). */
  validateToken(token: string): JwtPayload {
    let decoded: string | jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, this.jwtConfig.secret, { algorithms: [JWT_ALGORITHM] });
    } catch {
      throw AppError.unauthorized();
    }

    if (
      typeof decoded !== 'object' ||
      typeof decoded.userId !== 'string' ||
      typeof decoded.isVerified !== 'boolean' ||
      typeof decoded.iat !== 'number' ||
      typeof decoded.exp !== 'number'
    ) {
      throw AppError.unauthorized();
    }

    return {
      userId: decoded.userId,
      isVerified: decoded.isVerified,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  }
}
