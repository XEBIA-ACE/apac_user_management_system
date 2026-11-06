import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import type { ErrorCode } from '../../domain/AppError';
import type { ErrorResponse } from '../../domain/dtos';

/** Writes the standard `{ error: ErrorResponse }` envelope (`{ code, message, correlationId }`). */
export function sendError(
  req: Request,
  res: Response,
  status: number,
  code: ErrorCode,
  message: string,
): void {
  const error: ErrorResponse = { code, message, correlationId: req.requestId ?? randomUUID() };
  res.status(status).json({ error });
}
