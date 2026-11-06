import cron, { type ScheduledTask } from 'node-cron';
import type { Logger } from 'winston';
import type { IOtpRepository } from '../repositories/IOtpRepository';

const EVERY_15_MINUTES = '*/15 * * * *';

/** In-process cron job that purges expired OTP records (C3 OTP Cleanup Scheduler). */
export class OtpCleanupScheduler {
  private task: ScheduledTask | undefined;

  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly logger: Logger,
    private readonly schedule: string = EVERY_15_MINUTES,
  ) {}

  start(): void {
    this.task = cron.schedule(this.schedule, () => {
      this.otpRepository.deleteExpired().catch((err: unknown) => {
        this.logger.warn('OTP cleanup failed', { error: (err as Error).message });
      });
    });
  }

  stop(): void {
    this.task?.stop();
    this.task = undefined;
  }
}
