import jwt from 'jsonwebtoken';
import winston from 'winston';
import { AuthService } from '../src/application/AuthService';
import { OtpFactory } from '../src/application/OtpFactory';
import { OtpService } from '../src/application/OtpService';
import { UserService } from '../src/application/UserService';
import { createApp } from '../src/app';
import { AccountStatus } from '../src/domain/AccountStatus';
import { User } from '../src/domain/User';
import { TokenBlacklist } from '../src/infrastructure/cache/TokenBlacklist';
import { EmailDispatcher } from '../src/infrastructure/messaging/EmailDispatcher';
import type { IOtpRepository } from '../src/infrastructure/repositories/IOtpRepository';
import type { IUserRepository } from '../src/infrastructure/repositories/IUserRepository';
import { AuthController } from '../src/presentation/controllers/AuthController';
import { HealthController } from '../src/presentation/controllers/HealthController';
import { UserController } from '../src/presentation/controllers/UserController';
import { AuthMiddleware } from '../src/presentation/middleware/AuthMiddleware';
import { GlobalExceptionHandler } from '../src/presentation/middleware/GlobalExceptionHandler';
import { ValidationMiddleware } from '../src/presentation/middleware/ValidationMiddleware';

// Obviously fake placeholder, repeated to satisfy the 32-character minimum enforced by config.
const FAKE_JWT_SIGNING_KEY = process.env.TEST_JWT_SECRET ?? 'test-token'.repeat(4);

export const TEST_JWT = { secret: FAKE_JWT_SIGNING_KEY, expiresInSeconds: 900 };

export const TEST_ENV = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://localhost:5432/ums',
  REDIS_URL: 'redis://localhost:6379',
  JWT_SECRET: TEST_JWT.secret,
  JWT_EXPIRES_IN: '3600',
  SMTP_HOST: 'smtp.example.test',
  SMTP_PORT: '587',
  SMTP_USER: 'user',
  SMTP_PASS: 'test-token',
};

export const DEFAULT_CLAIMS = { sub: 'user-1', email: 'user-1@example.com' };

export function signToken(claims: object = DEFAULT_CLAIMS, expiresIn = 900): string {
  return jwt.sign(claims, TEST_JWT.secret, { algorithm: 'HS256', expiresIn });
}

export const testUser = (id: string, status = AccountStatus.ACTIVE): User =>
  new User(
    id,
    `Name ${id}`,
    `${id}@example.com`,
    'hashed',
    status,
    new Date('2026-01-02T03:04:05Z'),
  );

/** In-memory stand-in for the PostgreSQL users table (the session store). */
export class FakeUserRepository {
  readonly users = new Map<string, User>(
    ['user-1', 'owner'].map((id) => [id, testUser(id)] as const),
  );
  failing = false;
  delayMs = 0;
  readonly findByIdCalls: string[] = [];

  async findById(id: string): Promise<User | null> {
    this.findByIdCalls.push(id);
    if (this.delayMs) await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    if (this.failing) throw new Error('connect ECONNREFUSED 10.0.0.5:5432');
    return this.users.get(id) ?? null;
  }
}

export class FakeRedis {
  readonly store = new Map<string, string>();
  failing = false;

  async set(key: string, value: string): Promise<'OK'> {
    if (this.failing) throw new Error('redis down');
    this.store.set(key, value);
    return 'OK';
  }

  async exists(key: string): Promise<number> {
    if (this.failing) throw new Error('redis down');
    return this.store.has(key) ? 1 : 0;
  }
}

const otpRepository = {} as IOtpRepository;

export function buildTestApp(options: { databaseUp?: boolean } = {}) {
  const redis = new FakeRedis();
  const users = new FakeUserRepository();
  const userRepository = users as unknown as IUserRepository;
  const tokenBlacklist = new TokenBlacklist(redis as never);
  const otpService = new OtpService(
    otpRepository,
    new OtpFactory(),
    new EmailDispatcher({ host: 'h', port: 1, user: 'u', pass: 'test-token' }, TEST_ENV.REDIS_URL),
  );
  const userService = new UserService(userRepository, otpRepository, otpService, tokenBlacklist);
  const authService = new AuthService(userRepository, tokenBlacklist, TEST_JWT);
  const logger = winston.createLogger({ silent: true, level: 'debug' });
  const checkDatabase = async () => options.databaseUp ?? true;

  const app = createApp({
    authController: new AuthController(userService, authService),
    userController: new UserController(userService, authService),
    healthController: new HealthController(checkDatabase),
    authMiddleware: new AuthMiddleware(authService, tokenBlacklist, logger),
    validationMiddleware: new ValidationMiddleware(),
    exceptionHandler: new GlobalExceptionHandler(logger),
  });

  return { app, redis, users, tokenBlacklist, userService, authService, logger };
}
