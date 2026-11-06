import type { NextFunction, Request, Response } from 'express';

/**
 * Schema validation and sanitisation (Joi) applied before AuthMiddleware and controllers
 * (PAT-006). Placeholders pass through until the rules below are confirmed.
 */
export class ValidationMiddleware {
  // TODO(stakeholder): password complexity rules (minimum length, required character classes) and
  // maximum field lengths for `name`, `email`, `password` are unresolved.
  validateRegister = (_req: Request, _res: Response, next: NextFunction): void => {
    next();
  };

  validateVerifyOtp = (_req: Request, _res: Response, next: NextFunction): void => {
    next();
  };

  validateLogin = (_req: Request, _res: Response, next: NextFunction): void => {
    next();
  };

  /** Protected routes (logout, dashboard, account deletion) carry no client-supplied ids. */
  validateAuthenticatedRequest = (_req: Request, _res: Response, next: NextFunction): void => {
    next();
  };
}
