import winston from 'winston';

// Structured JSON logger. Never log plaintext PII (name, email), passwords, OTP codes or tokens
// (US-022).
export function createLogger(level: string): winston.Logger {
  return winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    defaultMeta: { service: 'ums-api' },
    transports: [new winston.transports.Console()],
  });
}
