import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'winston';
import type { AuthService } from '../../application/AuthService';
import { AppError } from '../../domain/AppError';
import type { JwtPayload } from '../../domain/JwtPayload';
import type { TokenBlacklist } from '../../infrastructure/cache/TokenBlacklist';
import { sendError } from './errorResponse';

const BEARER = /^Bearer ([A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+)$/;

/** Metric name used in the Server-Timing header and logs for the session-validation path. */
export const AUTH_TIMING_METRIC = 'auth';

type Rejection =
  'missing_token' | 'invalid_token' | 'blacklisted' | 'inactive_session' | 'store_unavailable';

/**
 * Protects routes. In order: Bearer token present → signature + exp (AuthService.validateToken)
 * → TokenBlacklist.isBlacklisted() → PostgreSQL session store (AuthService.isSessionActive). Only
 * then is req.user populated with the JwtPayload. Any failure — including an unavailable blacklist
 * or session store — yields HTTP 401 before the controller runs (fail-secure; US-001-ac-2…ac-4,
 * ac-8). The validation duration is exposed as `Server-Timing: auth;dur=<ms>` (US-001-ac-7).
 */
export class AuthMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklist: TokenBlacklist,
    private readonly logger?: Logger,
  ) {}

  validate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const startedAt = process.hrtime.bigint();
    const outcome = await this.authenticate(req);
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    res.setHeader('Server-Timing', `${AUTH_TIMING_METRIC};dur=${durationMs.toFixed(2)}`);
    this.logger?.debug('Session validation', {
      metric: AUTH_TIMING_METRIC,
      duration_ms: durationMs,
      outcome: 'payload' in outcome ? 'ok' : outcome.rejection,
      correlationId: req.requestId,
    });

    if (!('payload' in outcome)) {
      const err = AppError.unauthorized();
      sendError(req, res, err.statusCode, err.code, err.message);
      return;
    }

    req.user = outcome.payload;
    req.token = outcome.token;
    next();
  };

  private async authenticate(
    req: Request,
  ): Promise<{ payload: JwtPayload; token: string } | { rejection: Rejection }> {
    const token = this.extractBearerToken(req.get('Authorization'));
    if (!token) {
      return { rejection: 'missing_token' };
    }

    let payload: JwtPayload;
    try {
      payload = this.authService.validateToken(token);
    } catch {
      return { rejection: 'invalid_token' };
    }

    try {
      if (await this.tokenBlacklist.isBlacklisted(token)) {
        return { rejection: 'blacklisted' };
      }
    } catch (err) {
      this.logOutage(req, 'token_blacklist', err);
      return { rejection: 'store_unavailable' };
    }

    try {
      if (!(await this.authService.isSessionActive(payload))) {
        return { rejection: 'inactive_session' };
      }
    } catch (err) {
      this.logOutage(req, 'postgresql_session_store', err);
      return { rejection: 'store_unavailable' };
    }

    return { payload, token };
  }

  private extractBearerToken(header: string | undefined): string | null {
    const match = header ? BEARER.exec(header) : null;
    return match ? match[1] : null;
  }

  private logOutage(req: Request, store: string, err: unknown): void {
    this.logger?.error('Session store unavailable; request rejected (fail-secure)', {
      store,
      correlationId: req.requestId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
