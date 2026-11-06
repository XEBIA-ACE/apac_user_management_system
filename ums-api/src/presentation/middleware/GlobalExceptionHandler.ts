import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'winston';
import { AppError } from '../../domain/AppError';
import { sendError } from './errorResponse';

/**
 * Single error boundary. Maps AppError to its HTTP status and the standard envelope; never
 * returns stack traces or internal details.
 */
export class GlobalExceptionHandler {
  constructor(private readonly logger: Logger) {}

  handle = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    const appError = this.toAppError(err);
    if (appError.statusCode >= 500 && appError.code !== 'NOT_IMPLEMENTED') {
      this.logger.error('Unhandled error', {
        request_id: req.requestId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    sendError(req, res, this.mapToHttpStatus(appError), appError.code, appError.message);
  };

  notFound = (req: Request, res: Response): void => {
    const err = AppError.notFound();
    sendError(req, res, err.statusCode, err.code, err.message);
  };

  private toAppError(err: unknown): AppError {
    if (err instanceof AppError) {
      return err;
    }
    if (this.isBodyParserError(err)) {
      return new AppError(400, 'VALIDATION_ERROR', 'Malformed request body.');
    }
    return AppError.internal();
  }

  private mapToHttpStatus(err: AppError): number {
    return err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;
  }

  private isBodyParserError(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'type' in err &&
      typeof (err as { type: unknown }).type === 'string' &&
      (err as { type: string }).type.startsWith('entity.')
    );
  }
}
