import { z } from 'zod';

const booleanFlag = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => value === 'true');

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string({ required_error: 'VITE_API_BASE_URL is required' })
    .url('VITE_API_BASE_URL must be a valid URL'),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  VITE_FEATURE_SCAFFOLD_AUTH_BYPASS: booleanFlag,
});

export interface AppConfig {
  apiBaseUrl: string;
  apiTimeoutMs: number;
  features: {
    scaffoldAuthBypass: boolean;
  };
}

export function loadConfig(env: Record<string, string | boolean | undefined>): AppConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  const parsed = result.data;
  return {
    apiBaseUrl: parsed.VITE_API_BASE_URL,
    apiTimeoutMs: parsed.VITE_API_TIMEOUT_MS,
    features: {
      scaffoldAuthBypass: parsed.VITE_FEATURE_SCAFFOLD_AUTH_BYPASS,
    },
  };
}

let cachedConfig: AppConfig | undefined;

export function getConfig(): AppConfig {
  cachedConfig ??= loadConfig(import.meta.env);
  return cachedConfig;
}
