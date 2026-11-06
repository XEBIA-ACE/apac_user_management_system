import type { PrismaClient } from '@prisma/client';
import { AppError } from '../../domain/AppError';
import type { OtpEntity } from '../../domain/OtpEntity';
import type { IOtpRepository } from './IOtpRepository';

// All SQL/ORM logic for the otps table lives here (PAT-003).
export class PostgresOtpRepository implements IOtpRepository {
  constructor(protected readonly db: PrismaClient) {}

  async save(_otp: OtpEntity): Promise<OtpEntity> {
    throw AppError.notImplemented();
  }

  async findLatestByUserId(_userId: string): Promise<OtpEntity | null> {
    throw AppError.notImplemented();
  }

  async markUsed(_otpId: string): Promise<void> {
    throw AppError.notImplemented();
  }

  async deleteByUserId(_userId: string): Promise<void> {
    throw AppError.notImplemented();
  }

  async deleteExpired(): Promise<void> {
    throw AppError.notImplemented();
  }
}
