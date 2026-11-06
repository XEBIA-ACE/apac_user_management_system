import type { Request, Response } from 'express';
import type { AuthService } from '../../application/AuthService';
import type { UserService } from '../../application/UserService';
import { AppError } from '../../domain/AppError';
import type { DashboardResponse } from '../../domain/dtos';
import { dashboardResponseSchema } from '../schemas';

// Thin HTTP adapter: depends on services only, never repositories (PAT-002).
export class UserController {
  constructor(
    private readonly userService: UserService,
    protected readonly authService: AuthService,
  ) {}

  /**
   * GET /api/v1/dashboard (US-001). Identity comes only from req.user.sub (JwtPayload set by
   * AuthMiddleware); query params and body are never consulted (US-001-ac-6). The response is
   * validated against DashboardResponse before it is sent (US-001-ac-5).
   */
  getDashboard = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    const user = await this.userService.getDashboardUser(req.user.sub);
    const body: DashboardResponse = { user, features: { delete_account_visible: true } };
    const { error, value } = dashboardResponseSchema.validate(body, { stripUnknown: true });
    if (error) {
      throw AppError.internal();
    }
    res.status(200).json(value);
  };

  /**
   * The target account is derived only from req.user.sub (JWT payload set by AuthMiddleware);
   * path params, query params and body are never consulted (US-004).
   */
  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    await this.userService.deleteAccount(req.user.sub);
    res.status(200).json({ message: 'Account deleted.' });
  };
}
