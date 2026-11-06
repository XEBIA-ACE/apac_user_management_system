import type { OtpEntity } from '../../domain/OtpEntity';

export interface IOtpRepository {
  save(otp: OtpEntity): Promise<OtpEntity>;
  findLatestByUserId(userId: string): Promise<OtpEntity | null>;
  markUsed(otpId: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
