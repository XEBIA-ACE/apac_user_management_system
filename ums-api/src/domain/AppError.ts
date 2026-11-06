export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'OTP_EXPIRED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'SERVICE_UNAVAILABLE';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static unauthorized(): AppError {
    return new AppError(401, 'UNAUTHORIZED', 'Authentication required.');
  }

  /**
   * Single generic login failure used for every failure condition (non-existent email, wrong
   * password, unverified account, deleted account) to prevent user enumeration (US-011).
   */
  static invalidCredentials(): AppError {
    return new AppError(401, 'UNAUTHORIZED', 'Invalid email or password.');
  }

  static notImplemented(): AppError {
    return new AppError(501, 'NOT_IMPLEMENTED', 'This operation is not implemented yet.');
  }

  static notFound(): AppError {
    return new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
  }

  static internal(): AppError {
    return new AppError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  }

  static serviceUnavailable(): AppError {
    return new AppError(503, 'SERVICE_UNAVAILABLE', 'A required service is unavailable.');
  }
}
