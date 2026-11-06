// Minimal claims only — no PII (US-022, PAT-005).
export interface JwtPayload {
  userId: string;
  isVerified: boolean;
  iat: number;
  exp: number;
}

// Runtime marker so the JwtPayload contract is importable as a value.
export const JWT_PAYLOAD_CLAIMS = ['userId', 'isVerified', 'iat', 'exp'] as const;
