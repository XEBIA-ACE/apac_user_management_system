// Decoded token claims attached to req.user by AuthMiddleware; the sole source of user identity
// on protected routes (US-001-ac-6). `sub` is the user id.
// TODO(stakeholder): US-001 requires the `email` claim, while US-022 / PAT-005 asked for no PII in
// tokens. The US-001 contract is followed here; confirm whether `email` may stay in the token.
export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

// Runtime marker so the JwtPayload contract is importable as a value.
export const JWT_PAYLOAD_CLAIMS = ['sub', 'email', 'iat', 'exp'] as const;
