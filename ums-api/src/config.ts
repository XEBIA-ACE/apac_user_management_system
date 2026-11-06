import Joi from 'joi';

export type NodeEnv = 'development' | 'test' | 'production';

export interface AppConfig {
  nodeEnv: NodeEnv;
  port: number;
  logLevel: string;
  databaseUrl: string;
  redisUrl: string;
  jwt: {
    secret: string;
    expiresInSeconds: number;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

export class ConfigError extends Error {
  constructor(readonly issues: string[]) {
    super(`Invalid environment configuration: ${issues.join('; ')}`);
    this.name = 'ConfigError';
  }
}

// TODO(stakeholder): JWT expiry duration is unresolved; the allowed range is 15–60 minutes.
export const JWT_EXPIRES_IN_MIN_SECONDS = 15 * 60;
export const JWT_EXPIRES_IN_MAX_SECONDS = 60 * 60;

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  PORT: Joi.number().port().default(3000),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.number()
    .integer()
    .min(JWT_EXPIRES_IN_MIN_SECONDS)
    .max(JWT_EXPIRES_IN_MAX_SECONDS)
    .required(),
  SMTP_HOST: Joi.string().hostname().required(),
  SMTP_PORT: Joi.number().port().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
}).unknown(true);

/**
 * Reads and validates configuration from environment variables. Throws a ConfigError listing
 * every missing or invalid variable so the process can fail fast at startup.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const { value, error } = envSchema.validate(env, {
    abortEarly: false,
    convert: true,
    errors: { wrap: { label: false } },
  });

  if (error) {
    throw new ConfigError(error.details.map((detail) => detail.message));
  }

  return {
    nodeEnv: value.NODE_ENV,
    port: value.PORT,
    logLevel: value.LOG_LEVEL,
    databaseUrl: value.DATABASE_URL,
    redisUrl: value.REDIS_URL,
    jwt: {
      secret: value.JWT_SECRET,
      expiresInSeconds: value.JWT_EXPIRES_IN,
    },
    smtp: {
      host: value.SMTP_HOST,
      port: value.SMTP_PORT,
      user: value.SMTP_USER,
      pass: value.SMTP_PASS,
    },
  };
}
