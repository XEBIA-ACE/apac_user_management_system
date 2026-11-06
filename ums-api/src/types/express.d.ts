import type { JwtPayload } from '../domain/JwtPayload';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      /** Populated only by AuthMiddleware after token validation and blacklist check. */
      user?: JwtPayload;
      /** Raw bearer token, populated alongside `user` by AuthMiddleware. */
      token?: string;
    }
  }
}

export {};
