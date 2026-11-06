import { AppError } from '../domain/AppError';
import type { User } from '../domain/User';
import type { EmailDispatcher } from '../infrastructure/messaging/EmailDispatcher';
import type { IOtpRepository } from '../infrastructure/repositories/IOtpRepository';
import type { OtpFactory } from './OtpFactory';

// TODO(stakeholder): OTP resend rate-limiting policy is unresolved.
export class OtpService {
  constructor(
    protected readonly otpRepository: IOtpRepository,
    protected readonly otpFactory: OtpFactory,
    protected readonly emailDispatcher: EmailDispatcher,
  ) {}

  /** OtpFactory.create() → IOtpRepository.save() → EmailDispatcher.enqueue() (async, PAT-007). */
  async generateAndDispatch(_user: User): Promise<void> {
    throw AppError.notImplemented();
  }

  /** Checks existence, 5-minute expiry and single-use flag; marks the OTP as used on success. */
  async verify(_userId: string, _code: string): Promise<void> {
    throw AppError.notImplemented();
  }
}
