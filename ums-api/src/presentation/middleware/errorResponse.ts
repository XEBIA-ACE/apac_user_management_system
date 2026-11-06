import type { Request, Response } from 'express';
import type { ErrorCode } from '../../domain/AppError';

/** Writes the standard `{ error: { code, message, request_id } }` envelope. */
export function sendError(
  req: Request,
  res: Response,
  status: number,
  code: ErrorCode,
  message: string,
): void {
  res.status(status).json({ error: { code, message, request_id: req.requestId ?? null } });
}
