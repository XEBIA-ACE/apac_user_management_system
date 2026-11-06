import { Router } from 'express';
import type { AuthController } from '../presentation/controllers/AuthController';
import type { HealthController } from '../presentation/controllers/HealthController';
import type { UserController } from '../presentation/controllers/UserController';
import type { AuthMiddleware } from '../presentation/middleware/AuthMiddleware';
import type { ValidationMiddleware } from '../presentation/middleware/ValidationMiddleware';

export interface RouteDependencies {
  authController: AuthController;
  userController: UserController;
  healthController: HealthController;
  authMiddleware: AuthMiddleware;
  validationMiddleware: ValidationMiddleware;
}

export const API_PREFIX = '/api/v1';

/** Registers EP-API-001 … EP-API-007. Protected routes: Validation → Auth → handler (PAT-006). */
export function createApiRouter(deps: RouteDependencies): Router {
  const { authController, userController, healthController, authMiddleware, validationMiddleware } =
    deps;
  const router = Router();

  // EP-API-001
  router.post('/auth/register', validationMiddleware.validateRegister, authController.register);
  // EP-API-002
  router.post('/auth/verify-otp', validationMiddleware.validateVerifyOtp, authController.verifyOtp);
  // EP-API-003
  router.post('/auth/login', validationMiddleware.validateLogin, authController.login);
  // EP-API-004
  router.post(
    '/auth/logout',
    validationMiddleware.validateAuthenticatedRequest,
    authMiddleware.validate,
    authController.logout,
  );
  // EP-API-005
  router.get(
    '/dashboard',
    validationMiddleware.validateAuthenticatedRequest,
    authMiddleware.validate,
    userController.getDashboard,
  );
  // EP-API-006
  router.delete(
    '/users/me',
    validationMiddleware.validateAuthenticatedRequest,
    authMiddleware.validate,
    userController.deleteAccount,
  );
  // EP-API-007
  router.get('/health', healthController.getHealth);

  return router;
}
