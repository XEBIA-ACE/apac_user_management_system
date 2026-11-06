import { AppError } from '../../domain/AppError';
import type { AppConfig } from '../../config';

/**
 * Enqueues OTP emails on a Bull (Redis) queue and sends them via SMTP (Nodemailer) from a worker,
 * keeping SMTP latency out of the registration request (PAT-007). OTP codes must never be logged.
 */
export class EmailDispatcher {
  constructor(
    protected readonly smtp: AppConfig['smtp'],
    protected readonly redisUrl: string,
  ) {}

  async enqueue(_to: string, _otpCode: string): Promise<void> {
    throw AppError.notImplemented();
  }
}
