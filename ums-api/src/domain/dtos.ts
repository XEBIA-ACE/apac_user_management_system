// Inbound and outbound DTOs (PAT-004). Response DTOs never carry hashedPassword, OTP codes or
// internal flags (isUsed, deletedAt).

// TODO(stakeholder): password complexity rules (minimum length, required character classes) and
// maximum field lengths for `name`, `email` and `password` are unresolved.
export class RegisterRequest {
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}
}

export class LoginRequest {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

// The API specification (EP-API-002) identifies the user by email; the C4 diagram lists userId.
// The wire contract follows the API specification.
export class VerifyOtpRequest {
  constructor(
    public email: string,
    public code: string,
  ) {}
}

export class AuthResponse {
  constructor(
    public token: string,
    public expiresIn: number,
  ) {}
}

export class UserResponse {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public status: string,
  ) {}
}

/** User identity fields returned in DashboardResponse (US-001). Never carries hashedPassword. */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
}

/** HTTP 200 body of GET /api/v1/dashboard; delete_account_visible is always true (US-001-ac-5). */
export interface DashboardResponse {
  user: UserDTO;
  features: { delete_account_visible: boolean };
}

/** Error body; `code` is 'UNAUTHORIZED' for every auth failure. Sent wrapped as `{ error }`. */
export interface ErrorResponse {
  code: string;
  message: string;
  correlationId: string;
}
