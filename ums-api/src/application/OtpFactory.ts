import { randomInt, randomUUID } from 'node:crypto';
import { OtpEntity } from '../domain/OtpEntity';

export const OTP_TTL_MS = 5 * 60 * 1000;

/** Single source of truth for OTP construction (PAT-008). */
export class OtpFactory {
  constructor(private readonly now: () => Date = () => new Date()) {}

  create(userId: string, _email: string): OtpEntity {
    const createdAt = this.now();
    return new OtpEntity(
      randomUUID(),
      userId,
      this.generateCode(),
      this.computeExpiry(createdAt),
      false,
      createdAt,
    );
  }

  // Cryptographically secure 6-digit code — never Math.random() (PAT-008).
  private generateCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  private computeExpiry(from: Date): Date {
    return new Date(from.getTime() + OTP_TTL_MS);
  }
}
