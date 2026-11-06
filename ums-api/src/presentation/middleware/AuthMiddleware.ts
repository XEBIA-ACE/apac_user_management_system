import type { NextFunction, Request, Response } from 'express';
import type { AuthService } from '../../application/AuthService';
import { AppError } from '../../domain/AppError';
import type { JwtPayload } from '../../domain/JwtPayload';
import type { TokenBlacklist } from '../../infrastructure/cache/TokenBlacklist';
import { sendError } from './errorResponse';

const BEARER = /^Bearer ([A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+)$/;

/**
 * Protects routes: AuthService.validateToken() then TokenBlacklist.isBlacklisted() must both pass
 * before req.user is populated. Any failure — including an unavailable blacklist store — yields
 * HTTP 401 (fail-secure; US-002, US-004, US-005).
 */
export class AuthMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklist: TokenBlacklist,
  ) {}

  validate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = this.extractBearerToken(req.get('Authorization'));
    if (!token) {
      this.reject(req, res);
      return;
    }

    let payload: JwtPayload;
    try {
      payload = this.verifyJwt(token);
      if (await this.tokenBlacklist.isBlacklisted(token)) {
        this.reject(req, res);
        return;
      }
    } catch {
      this.reject(req, res);
      return;
    }

    req.user = payload;
    req.token = token;
    next();
  };

  private extractBearerToken(header: string | undefined): string | null {
    const match = header ? BEARER.exec(header) : null;
    return match ? match[1] : null;
  }

  private verifyJwt(token: string): JwtPayload {
    return this.authService.validateToken(token);
  }

  private reject(req: Request, res: Response): void {
    const err = AppError.unauthorized();
    sendError(req, res, err.statusCode, err.code, err.message);
  }
}
