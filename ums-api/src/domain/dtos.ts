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
