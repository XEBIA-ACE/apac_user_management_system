import { describe, expect, it } from 'vitest';
import { ConfigError, loadConfig } from '../src/config';
import { TEST_ENV } from './helpers';

describe('loadConfig (T002)', () => {
  it('reads every setting from environment variables', () => {
    const config = loadConfig({ ...TEST_ENV, PORT: '4000' });
    expect(config).toEqual({
      nodeEnv: 'test',
      port: 4000,
      logLevel: 'info',
      databaseUrl: TEST_ENV.DATABASE_URL,
      redisUrl: TEST_ENV.REDIS_URL,
      jwt: { secret: TEST_ENV.JWT_SECRET, expiresInSeconds: 3600 },
      smtp: { host: 'smtp.example.test', port: 587, user: 'user', pass: 'test-token' },
    });
  });

  it('fails fast listing every missing required variable', () => {
    expect.assertions(2);
    try {
      loadConfig({});
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigError);
      const required = [
        'NODE_ENV',
        'DATABASE_URL',
        'REDIS_URL',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
      ];
      expect(required.every((name) => (err as ConfigError).message.includes(name))).toBe(true);
    }
  });

  it.each(['899', '3601'])('rejects JWT_EXPIRES_IN=%s outside the 15–60 minute range', (value) => {
    expect(() => loadConfig({ ...TEST_ENV, JWT_EXPIRES_IN: value })).toThrow(ConfigError);
  });

  it('rejects a short JWT secret', () => {
    expect(() => loadConfig({ ...TEST_ENV, JWT_SECRET: 'short' })).toThrow(ConfigError);
  });
});
