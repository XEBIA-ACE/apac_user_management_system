import * as crypto from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { OTP_TTL_MS, OtpFactory } from '../src/application/OtpFactory';

vi.mock('node:crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:crypto')>();
  return { ...actual, randomInt: vi.fn(actual.randomInt) };
});

describe('OtpFactory (PAT-008)', () => {
  it('creates an unused 6-digit OTP expiring in 5 minutes', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const otp = new OtpFactory(() => now).create('user-1', 'a@example.com');
    expect(otp.userId).toBe('user-1');
    expect(otp.code).toMatch(/^\d{6}$/);
    expect(otp.isUsed).toBe(false);
    expect(otp.createdAt).toEqual(now);
    expect(otp.expiresAt.getTime() - now.getTime()).toBe(OTP_TTL_MS);
    expect(OTP_TTL_MS).toBe(5 * 60 * 1000);
  });

  it('uses crypto.randomInt, never Math.random', () => {
    const mathRandom = vi.spyOn(Math, 'random');
    new OtpFactory().create('user-1', 'a@example.com');
    expect(crypto.randomInt).toHaveBeenCalledWith(100000, 1000000);
    expect(mathRandom).not.toHaveBeenCalled();
  });
});
