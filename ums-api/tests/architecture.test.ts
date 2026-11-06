import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as AuthServiceModule from '../src/application/AuthService';
import * as OtpFactoryModule from '../src/application/OtpFactory';
import * as OtpServiceModule from '../src/application/OtpService';
import * as UserServiceModule from '../src/application/UserService';
import * as domain from '../src/domain';
import type { JwtPayload } from '../src/domain';
import * as TokenBlacklistModule from '../src/infrastructure/cache/TokenBlacklist';
import * as EmailDispatcherModule from '../src/infrastructure/messaging/EmailDispatcher';
import type { IOtpRepository } from '../src/infrastructure/repositories/IOtpRepository';
import type { IUserRepository } from '../src/infrastructure/repositories/IUserRepository';
import * as PgOtpRepoModule from '../src/infrastructure/repositories/PostgresOtpRepository';
import * as PgUserRepoModule from '../src/infrastructure/repositories/PostgresUserRepository';
import * as AuthControllerModule from '../src/presentation/controllers/AuthController';
import * as UserControllerModule from '../src/presentation/controllers/UserController';
import * as AuthMiddlewareModule from '../src/presentation/middleware/AuthMiddleware';
import * as GlobalExceptionHandlerModule from '../src/presentation/middleware/GlobalExceptionHandler';
import * as ValidationMiddlewareModule from '../src/presentation/middleware/ValidationMiddleware';

const SRC = join(__dirname, '..', 'src');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? sourceFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

describe('C4 classes (T005)', () => {
  it('are present and importable', () => {
    const classes = {
      AuthController: AuthControllerModule.AuthController,
      UserController: UserControllerModule.UserController,
      AuthMiddleware: AuthMiddlewareModule.AuthMiddleware,
      ValidationMiddleware: ValidationMiddlewareModule.ValidationMiddleware,
      GlobalExceptionHandler: GlobalExceptionHandlerModule.GlobalExceptionHandler,
      UserService: UserServiceModule.UserService,
      AuthService: AuthServiceModule.AuthService,
      OtpService: OtpServiceModule.OtpService,
      OtpFactory: OtpFactoryModule.OtpFactory,
      PostgresUserRepository: PgUserRepoModule.PostgresUserRepository,
      PostgresOtpRepository: PgOtpRepoModule.PostgresOtpRepository,
      EmailDispatcher: EmailDispatcherModule.EmailDispatcher,
      TokenBlacklist: TokenBlacklistModule.TokenBlacklist,
      User: domain.User,
      OtpEntity: domain.OtpEntity,
      RegisterRequest: domain.RegisterRequest,
      LoginRequest: domain.LoginRequest,
      VerifyOtpRequest: domain.VerifyOtpRequest,
      AuthResponse: domain.AuthResponse,
      UserResponse: domain.UserResponse,
      AppError: domain.AppError,
    };
    for (const [name, value] of Object.entries(classes)) {
      expect(typeof value, name).toBe('function');
    }
    expect(Object.values(domain.AccountStatus)).toEqual(['PENDING', 'ACTIVE', 'DELETED']);
  });

  it('expose the repository interfaces and minimal JwtPayload claims', () => {
    const userRepo: IUserRepository = new PgUserRepoModule.PostgresUserRepository({} as never);
    const otpRepo: IOtpRepository = new PgOtpRepoModule.PostgresOtpRepository({} as never);
    const payload: JwtPayload = { sub: 'u', email: 'u@example.com', iat: 1, exp: 2 };
    expect(userRepo).toBeDefined();
    expect(otpRepo).toBeDefined();
    expect(Object.keys(payload)).toEqual([...domain.JWT_PAYLOAD_CLAIMS]);
  });

  it('use bcrypt work factor >= 12 (US-018)', () => {
    expect(UserServiceModule.BCRYPT_WORK_FACTOR).toBeGreaterThanOrEqual(12);
  });
});

describe('layer boundaries', () => {
  it('controllers never import repositories or the database (PAT-002)', () => {
    for (const file of sourceFiles(join(SRC, 'presentation', 'controllers'))) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(
        /infrastructure\/(repositories|database)/,
      );
    }
  });

  it('services depend on repository interfaces, not concrete implementations (PAT-003)', () => {
    for (const file of sourceFiles(join(SRC, 'application'))) {
      const source = readFileSync(file, 'utf8');
      expect(source, file).not.toMatch(/Postgres(User|Otp)Repository|@prisma\/client/);
    }
  });

  it('never uses Math.random for OTP generation (PAT-008)', () => {
    for (const file of sourceFiles(SRC)) {
      const code = readFileSync(file, 'utf8').replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '');
      expect(code, file).not.toContain('Math.random');
    }
  });
});
