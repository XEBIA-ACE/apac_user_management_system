import express, { type Express } from 'express';
import type { GlobalExceptionHandler } from './presentation/middleware/GlobalExceptionHandler';
import { requestId } from './presentation/middleware/requestId';
import { API_PREFIX, createApiRouter, type RouteDependencies } from './routes';

export interface AppDependencies extends RouteDependencies {
  exceptionHandler: GlobalExceptionHandler;
}

export function createApp(deps: AppDependencies): Express {
  const app = express();

  app.disable('x-powered-by');
  // TLS terminates at the Nginx reverse proxy; trust its X-Forwarded-* headers (one hop).
  app.set('trust proxy', 1);

  app.use(requestId);
  app.use(express.json({ limit: '10kb' }));
  app.use(API_PREFIX, createApiRouter(deps));
  app.use(deps.exceptionHandler.notFound);
  app.use(deps.exceptionHandler.handle);

  return app;
}
