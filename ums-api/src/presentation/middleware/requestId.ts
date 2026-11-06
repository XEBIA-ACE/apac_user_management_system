import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

const HEADER = 'X-Request-Id';
const SAFE_REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/;

/** Assigns the correlation id (honouring a well-formed upstream X-Request-Id) for log correlation. */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.get(HEADER);
  req.requestId = incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
  res.setHeader(HEADER, req.requestId);
  next();
}
