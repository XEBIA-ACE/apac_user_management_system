import bcrypt from 'bcryptjs';
import { AppError } from '../domain/AppError';
import type { RegisterRequest, UserResponse, VerifyOtpRequest } from '../domain/dtos';
import type { TokenBlacklist } from '../infrastructure/cache/TokenBlacklist';
import type { IOtpRepository } from '../infrastructure/repositories/IOtpRepository';
import type { IUserRepository } from '../infrastructure/repositories/IUserRepository';
import type { OtpService } from './OtpService';

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
