# Feature Specification: US-001 — View Delete Account Option on Dashboard

## Story

**ID**: US-001  
**Title**: View Delete Account Option on Dashboard  
**Description**: This story covers the session-gated visibility of the 'Delete Account' entry point on the Dashboard. The option is displayed exclusively when the user holds a valid, active session. If no valid session exists, the option is not presented and the user is directed to re-authenticate.  
**In scope**: Rendering/hiding the 'Delete Account' UI element based on session validity.  
**Out of scope**: The actual deletion API call (US-02), ownership verification (EP-002), and the confirmation/execution step (downstream scope).

---

## Functional Behavior

The GET /api/v1/dashboard endpoint gates visibility of the 'Delete Account' entry point exclusively on the presence of a valid, active session. AuthMiddleware validates the JWT Bearer token on every request — checking expiry, blacklist status, and session-store availability — before the controller is invoked. On successful validation, UserController.getDashboard() derives user identity solely from the JwtPayload attached to req.user by AuthMiddleware and returns a DashboardResponse containing UserDTO fields and a 'features.delete_account_visible: true' flag, which signals the client to render the Delete Account option. Any failure in token validation (missing token, expired token, blacklisted token, or unavailable PostgreSQL session store) causes AuthMiddleware to return HTTP 401 before the controller executes, ensuring the Delete Account option is never presented on an invalid or unverifiable session. Session validation must complete within a 1-second SLA under approximately 500 concurrent users. The actual account-deletion API call (US-02), ownership verification (EP-002), and the confirmation/execution step are explicitly out of scope for this story.

---

## Functional Requirements

- **FR-001** [US-001-ac-1]: GET /api/v1/dashboard, when presented with a valid, non-expired, non-blacklisted JWT Bearer token in the Authorization header, must return HTTP 200 with a DashboardResponse body that includes the field 'features.delete_account_visible' set to boolean true, signalling the client to render the Delete Account option.
- **FR-002** [US-001-ac-2]: GET /api/v1/dashboard, when called without an Authorization header, must return HTTP 401 with an ErrorResponse body whose 'code' field equals 'UNAUTHORIZED'; the response must not include any dashboard content or the 'delete_account_visible' flag.
- **FR-003** [US-001-ac-3]: AuthMiddleware must inspect the JWT 'exp' claim on every request to GET /api/v1/dashboard; if the claim is in the past (token expired), AuthMiddleware must reject the request with HTTP 401 before UserController.getDashboard() is invoked, and the response must not contain any dashboard content.
- **FR-004** [US-001-ac-4]: AuthMiddleware must call TokenBlacklist.isBlacklisted() for every JWT presented to GET /api/v1/dashboard; if the token is found in the blacklist (e.g., invalidated after logout or account deletion), AuthMiddleware must return HTTP 401 without invoking the controller, ensuring the Delete Account option is never served on a revoked session.
- **FR-005** [US-001-ac-5]: The DashboardResponse schema must define a 'features' object containing a boolean field 'delete_account_visible'. Every HTTP 200 response from GET /api/v1/dashboard must set this field to true; its presence serves as the authoritative server-side signal that the session is valid and the Delete Account entry point should be rendered.
- **FR-006** [US-001-ac-6]: UserController.getDashboard() must derive the authenticated user's identity exclusively from the JwtPayload object attached to req.user by AuthMiddleware. It must never read user identity from any client-supplied query parameter or request body field. The DashboardResponse must include the UserDTO fields alongside the 'features.delete_account_visible' flag.
- **FR-007** [US-001-ac-7]: The full session-validation path executed by AuthMiddleware for GET /api/v1/dashboard must complete within a 1-second end-to-end SLA under a load of approximately 500 concurrent users, ensuring no perceptible delay for authenticated users when the Delete Account option is rendered.
- **FR-008** [US-001-ac-8]: If the PostgreSQL session store is unavailable at the time AuthMiddleware performs JWT validation for GET /api/v1/dashboard, the endpoint must fail securely by returning HTTP 401 rather than granting access; the Delete Account option must never be displayed when session integrity cannot be confirmed due to a store outage.

---

## User Scenarios & Acceptance Criteria

- **US-001-ac-1**: When GET /api/v1/dashboard is called with a valid, non-expired, non-blacklisted JWT Bearer token, the endpoint must return HTTP 200 with a DashboardResponse body that includes the 'features.delete_account_visible: true' flag, signalling the client to render the Delete Account option.
- **US-001-ac-2**: When GET /api/v1/dashboard is called without an Authorization header (no active session), the endpoint must return HTTP 401 with an ErrorResponse body containing code 'UNAUTHORIZED', and must not include any dashboard content or the delete_account_visible flag.
- **US-001-ac-3**: When GET /api/v1/dashboard is called with an expired JWT token (exp claim in the past), the AuthMiddleware must reject the request with HTTP 401 before the controller processes it, and must not return any dashboard content.
- **US-001-ac-4**: When GET /api/v1/dashboard is called with a token that has been invalidated via the TokenBlacklist (e.g., after logout or account deletion), the AuthMiddleware must detect the blacklisted token via TokenBlacklist.isBlacklisted() and return HTTP 401, ensuring the Delete Account option is never served on a revoked session.
- **US-001-ac-5**: The DashboardResponse schema must include a 'features' object with a boolean field 'delete_account_visible'; this field must be true in every HTTP 200 response from GET /api/v1/dashboard, as its presence is the server-side signal that the authenticated session is valid and the Delete Account entry point should be rendered.
- **US-001-ac-6**: The UserController.getDashboard() method must derive the user identity exclusively from the JwtPayload attached to req.user by AuthMiddleware — never from any client-supplied query parameter or request body — and must return the UserDTO fields alongside the features flag in the DashboardResponse.
- **US-001-ac-7**: Session validation performed by AuthMiddleware on GET /api/v1/dashboard must complete within the 1-second SLA under approximately 500 concurrent users, as specified for the dashboard endpoint, so that authenticated users experience no perceptible delay when the Delete Account option is rendered.
- **US-001-ac-8**: If the PostgreSQL session store is unavailable during JWT validation for GET /api/v1/dashboard, the endpoint must fail securely by returning HTTP 401 rather than granting access, ensuring the Delete Account option is never displayed when session integrity cannot be confirmed.

---

## API & Data Contracts

### Endpoint: GET /api/v1/dashboard
- **Service**: SVC-002
- **Auth**: JWT Bearer
- **Middleware**: AuthMiddleware
- **SLA**: 1000 ms under ~500 concurrent users
- **Response 200**: `DashboardResponse: { user: UserDTO, features: { delete_account_visible: boolean } }`
- **Response 401**: `ErrorResponse: { code: 'UNAUTHORIZED', message: string, correlationId: string }`
- **Evidence**: service:SVC-002, FR-001:US-001-ac-1, FR-002:US-001-ac-2, FR-003:US-001-ac-3, FR-004:US-001-ac-4, FR-005:US-001-ac-5, FR-006:US-001-ac-6, FR-007:US-001-ac-7, FR-008:US-001-ac-8

### Endpoint: POST /api/auth/logout
- **Service**: SVC-002
- **Auth**: JWT Bearer
- **Note**: TokenBlacklist must be populated on logout completion; this is a contract dependency for the blacklist check on GET /api/v1/dashboard (US-001-ac-4).
- **Evidence**: service:SVC-002, FR-004:US-001-ac-4

### Data Contract: DashboardResponse
- **Definition**: `{ user: UserDTO, features: { delete_account_visible: boolean } }`
- **Constraint**: delete_account_visible MUST be boolean true in every HTTP 200 response from GET /api/v1/dashboard
- **Evidence**: FR-005:US-001-ac-5, spec_technical_design:SVC-002

### Data Contract: UserDTO
- **Definition**: `{ id: string, name: string, email: string, is_verified: boolean, created_at: string }`
- **Constraint**: Derived exclusively from JwtPayload.sub via req.user; never from client-supplied query parameters or request body
- **Evidence**: FR-006:US-001-ac-6, spec_technical_design:SVC-002

### Data Contract: JwtPayload
- **Definition**: `{ sub: string, email: string, iat: number, exp: number }`
- **Constraint**: Attached to req.user by AuthMiddleware; sole source of user identity for UserController.getDashboard()
- **Evidence**: FR-006:US-001-ac-6, spec_technical_design:SVC-002

### Data Contract: ErrorResponse
- **Definition**: `{ code: string, message: string, correlationId: string }`
- **Constraint**: code MUST equal 'UNAUTHORIZED' for all auth failures on GET /api/v1/dashboard
- **Evidence**: FR-002:US-001-ac-2, spec_technical_design:SVC-002

---

## Success Criteria

| Criterion ID   | Statement |
|----------------|-----------|
| US-001-ac-1 | When GET /api/v1/dashboard is called with a valid, non-expired, non-blacklisted JWT Bearer token, the endpoint must return HTTP 200 with a DashboardResponse body that includes the 'features.delete_account_visible: true' flag, signalling the client to render the Delete Account option. |
| US-001-ac-2 | When GET /api/v1/dashboard is called without an Authorization header (no active session), the endpoint must return HTTP 401 with an ErrorResponse body containing code 'UNAUTHORIZED', and must not include any dashboard content or the delete_account_visible flag. |
| US-001-ac-3 | When GET /api/v1/dashboard is called with an expired JWT token (exp claim in the past), the AuthMiddleware must reject the request with HTTP 401 before the controller processes it, and must not return any dashboard content. |
| US-001-ac-4 | When GET /api/v1/dashboard is called with a token that has been invalidated via the TokenBlacklist (e.g., after logout or account deletion), the AuthMiddleware must detect the blacklisted token via TokenBlacklist.isBlacklisted() and return HTTP 401, ensuring the Delete Account option is never served on a revoked session. |
| US-001-ac-5 | The DashboardResponse schema must include a 'features' object with a boolean field 'delete_account_visible'; this field must be true in every HTTP 200 response from GET /api/v1/dashboard, as its presence is the server-side signal that the authenticated session is valid and the Delete Account entry point should be rendered. |
| US-001-ac-6 | The UserController.getDashboard() method must derive the user identity exclusively from the JwtPayload attached to req.user by AuthMiddleware — never from any client-supplied query parameter or request body — and must return the UserDTO fields alongside the features flag in the DashboardResponse. |
| US-001-ac-7 | Session validation performed by AuthMiddleware on GET /api/v1/dashboard must complete within the 1-second SLA under approximately 500 concurrent users, as specified for the dashboard endpoint, so that authenticated users experience no perceptible delay when the Delete Account option is rendered. |
| US-001-ac-8 | If the PostgreSQL session store is unavailable during JWT validation for GET /api/v1/dashboard, the endpoint must fail securely by returning HTTP 401 rather than granting access, ensuring the Delete Account option is never displayed when session integrity cannot be confirmed. |

---

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Repository**: `https://github.com/XEBIA-ACE/apac_user_management_system`
- **Repository baseline commit**: `c1b9f2d94dd72fcec98637fd446de38bf97bb044`
- **Run ID**: `abcced4f-1b15-4aab-8725-f0adf10b291b`
- **Project ID**: `7e681a6f-20f6-4a19-99bd-09e678ff8493`
- **Source hash**: `sha256:f8e12930666c626cfc26979c840c71fcadc1363f26417086cce1ea48c772a97f`
- **Generation mode**: greenfield
- **Accepted impact hash**: null (no prior accepted impact baseline)
