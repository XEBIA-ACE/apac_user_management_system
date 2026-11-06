import type { Logger } from 'winston';
import { AuthService } from './application/AuthService';
import { OtpFactory } from './application/OtpFactory';
import { OtpService } from './application/OtpService';
import { UserService } from './application/UserService';
import type { AppDependencies } from './app';
import type { AppConfig } from './config';
import { createRedisClient } from './infrastructure/cache/redis';
import { TokenBlacklist } from './infrastructure/cache/TokenBlacklist';
import {
  createDatabaseHealthCheck,
  disconnectPrisma,
  getPrismaClient,
} from './infrastructure/database/prisma';
import { EmailDispatcher } from './infrastructure/messaging/EmailDispatcher';
import type { IOtpRepository } from './infrastructure/repositories/IOtpRepository';
import type { IUserRepository } from './infrastructure/repositories/IUserRepository';
import { PostgresOtpRepository } from './infrastructure/repositories/PostgresOtpRepository';
import { PostgresUserRepository } from './infrastructure/repositories/PostgresUserRepository';
import { AuthController } from './presentation/controllers/AuthController';
import { HealthController } from './presentation/controllers/HealthController';
import { UserController } from './presentation/controllers/UserController';
import { AuthMiddleware } from './presentation/middleware/AuthMiddleware';
import { GlobalExceptionHandler } from './presentation/middleware/GlobalExceptionHandler';
import { ValidationMiddleware } from './presentation/middleware/ValidationMiddleware';

export interface Container {
  deps: AppDependencies;
  shutdown: () => Promise<void>;
}

/** Composition root: binds concrete infrastructure to the interfaces services depend on (PAT-003). */
export function buildContainer(config: AppConfig, logger: Logger): Container {
  const prisma = getPrismaClient(config.databaseUrl);
  const redis = createRedisClient(config.redisUrl);
  redis.on('error', (err: Error) => logger.warn('Redis connection error', { error: err.message }));

  const userRepository: IUserRepository = new PostgresUserRepository(prisma);
  const otpRepository: IOtpRepository = new PostgresOtpRepository(prisma);
  const tokenBlacklist = new TokenBlacklist(redis);
  const emailDispatcher = new EmailDispatcher(config.smtp, config.redisUrl);

  const otpService = new OtpService(otpRepository, new OtpFactory(), emailDispatcher);
  const userService = new UserService(userRepository, otpRepository, otpService, tokenBlacklist);
  const authService = new AuthService(userRepository, tokenBlacklist, config.jwt);

  const deps: AppDependencies = {
    authController: new AuthController(userService, authService),
    userController: new UserController(userService, authService),
    healthController: new HealthController(createDatabaseHealthCheck(prisma)),
    authMiddleware: new AuthMiddleware(authService, tokenBlacklist, logger),
    validationMiddleware: new ValidationMiddleware(),
    exceptionHandler: new GlobalExceptionHandler(logger),
  };

  return {
    deps,
    shutdown: async () => {
      redis.disconnect();
      await disconnectPrisma();
    },
  };
}
