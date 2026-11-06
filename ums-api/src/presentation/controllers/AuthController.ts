import type { Request, Response } from 'express';
import type { AuthService } from '../../application/AuthService';
import type { UserService } from '../../application/UserService';
import { AppError } from '../../domain/AppError';
import { LoginRequest, RegisterRequest, VerifyOtpRequest } from '../../domain/dtos';

// Thin HTTP adapter: depends on services only, never repositories (PAT-002).
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body ?? {};
    const result = await this.userService.register(new RegisterRequest(name, email, password));
    res.status(201).json(result);
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body ?? {};
    await this.userService.verifyOtp(new VerifyOtpRequest(email, code));
    res.status(200).json({ message: 'Account verified.' });
  };

  // TODO(stakeholder): login rate-limiting threshold (US-012) is unresolved; see LOGIN_RATE_LIMIT.
  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body ?? {};
    const result = await this.authService.login(new LoginRequest(email, password));
    res.status(200).json(result);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.token) {
      throw AppError.unauthorized();
    }
    await this.authService.logout(req.user.sub, req.token);
    res.status(200).json({ message: 'Logged out.' });
  };
}
