import type { Request, Response } from 'express';
import type { AuthService } from '../../application/AuthService';
import type { UserService } from '../../application/UserService';
import { AppError } from '../../domain/AppError';

// Thin HTTP adapter: depends on services only, never repositories (PAT-002).
export class UserController {
  constructor(
    private readonly userService: UserService,
    protected readonly authService: AuthService,
  ) {}

  getDashboard = async (req: Request, _res: Response): Promise<void> => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    throw AppError.notImplemented();
  };

  /**
   * The target account is derived only from req.user.userId (JWT payload set by AuthMiddleware);
   * path params, query params and body are never consulted (US-004).
   */
  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    await this.userService.deleteAccount(req.user.userId);
    res.status(200).json({ message: 'Account deleted.' });
  };
}
