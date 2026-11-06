import bcrypt from 'bcryptjs';
import { AccountStatus } from '../domain/AccountStatus';
import { AppError } from '../domain/AppError';
import type { RegisterRequest, UserDTO, UserResponse, VerifyOtpRequest } from '../domain/dtos';
import type { TokenBlacklist } from '../infrastructure/cache/TokenBlacklist';
import type { IOtpRepository } from '../infrastructure/repositories/IOtpRepository';
import type { IUserRepository } from '../infrastructure/repositories/IUserRepository';
import type { OtpService } from './OtpService';
import { SESSION_STORE_QUERY_TIMEOUT_MS } from './AuthService';
import { withTimeout } from './withTimeout';

// TODO(stakeholder): exact bcrypt work factor is unresolved (>= 12 required; benchmark on target
// hardware).
export const BCRYPT_WORK_FACTOR = 12;

export class UserService {
  constructor(
    protected readonly userRepository: IUserRepository,
    protected readonly otpRepository: IOtpRepository,
    protected readonly otpService: OtpService,
    protected readonly tokenBlacklist: TokenBlacklist,
  ) {}

  /**
   * Ensures email uniqueness, hashes the password (hashPassword) before any persistence call,
   * persists the user as PENDING and triggers OtpService.generateAndDispatch().
   */
  async register(_dto: RegisterRequest): Promise<UserResponse> {
    throw AppError.notImplemented();
  }

  /** Delegates to OtpService.verify() and transitions the user PENDING → ACTIVE. */
  async verifyOtp(_dto: VerifyOtpRequest): Promise<void> {
    throw AppError.notImplemented();
  }

  /**
   * Returns the UserDTO for the authenticated user. userId must come only from JwtPayload.sub set
   * by AuthMiddleware (US-001-ac-6). A missing or deleted account is treated as an invalid session.
   */
  async getDashboardUser(userId: string): Promise<UserDTO> {
    const user = await withTimeout(
      this.userRepository.findById(userId),
      SESSION_STORE_QUERY_TIMEOUT_MS,
      'User lookup',
    );
    if (!user || user.status === AccountStatus.DELETED) {
      throw AppError.unauthorized();
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      is_verified: user.status === AccountStatus.ACTIVE,
      created_at: user.createdAt.toISOString(),
    };
  }

  /**
   * userId must come only from the authenticated JWT payload (US-004). Token invalidation, OTP
   * deletion and user hard-delete must run in a single database transaction and roll back on any
   * failure (US-005, F-03).
   * TODO(stakeholder): data retention period for deleted-account audit trails is unresolved.
   */
  async deleteAccount(_userId: string): Promise<void> {
    throw AppError.notImplemented();
  }

  protected async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, BCRYPT_WORK_FACTOR);
  }
}
