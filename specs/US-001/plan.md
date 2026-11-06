# Implementation Plan: US-001 — View Delete Account Option on Dashboard

## Technical Context

> ⚠️ **Degraded design notice**: `spec_technical_design` is marked `degraded=true`. The generated_context artifacts for SVC-002 (`artifact-SVC-002-c3`, `artifact-SVC-002-c4`, `artifact-SVC-002-api_spec`) were regenerated but returned empty content. No provider-confirmed C4 diagrams or detailed API spec content was available. All component and API surface decisions are grounded in `spec_service_identification.services[SVC-002]` and the functional specification, not in regenerated architecture artifacts. Review and reconcile once those artifacts are populated.

### Unresolved Evidence References

The following references were cited in the specification but could not be resolved against provider-scanned artifacts at export time:

- `service:SVC-002`
- `artifact-SVC-002-c3`
- `artifact-SVC-002-c4`
- `artifact-SVC-002-api_spec`
- `spec_functional:US-001`
- `FR-001:US-001-ac-1`
- `FR-002:US-001-ac-2`
- `FR-003:US-001-ac-3`
- `FR-004:US-001-ac-4`
- `FR-005:US-001-ac-5`
- `FR-006:US-001-ac-6`
- `FR-007:US-001-ac-7`
- `FR-008:US-001-ac-8`
- `spec_service_identification:SVC-002`
- `spec_gap_resolution:artifact-SVC-002-c3:auto_generate`
- `spec_gap_resolution:artifact-SVC-002-c4:auto_generate`
- `spec_gap_resolution:artifact-SVC-002-api_spec:auto_generate`

### Open Implementation-Readiness Items

The following items must be resolved or explicitly accepted before implementation is considered ready:

1. **Empty generated_context artifacts**: The generated_context artifacts for SVC-002 (`artifact-SVC-002-c3`, `artifact-SVC-002-c4`, `artifact-SVC-002-api_spec`) were regenerated but returned empty content. No provider-confirmed C4 diagrams or detailed API spec content was available. All component and API surface decisions are grounded in `spec_service_identification.services[SVC-002]` and the functional specification, not in regenerated architecture artifacts. Review and reconcile once `artifact-SVC-002-c3`, `artifact-SVC-002-c4`, and `artifact-SVC-002-api_spec` are populated.
2. **Degraded technical design**: `spec_technical_design` is marked `degraded=true` due to empty generated_context artifacts; contract decisions derived from this design carry elevated uncertainty until the artifacts are confirmed by a provider scan.
3. **TokenBlacklist backing store unresolved**: The design states 'in-process store or Redis' but does not commit to one. If Redis is chosen, it introduces a new external dependency and a separate availability/contract surface that is not yet captured.
4. **JWT clock-skew tolerance unconfirmed**: The exact clock-skew tolerance for JWT exp-claim validation is stated as '≤ 0' in the design steps but is not confirmed in any provider-scanned artifact; this could affect interoperability with clients that have minor clock drift.
5. **PostgreSQL session store query timeout unspecified**: The fail-secure path (HTTP 401 on timeout) depends on a concrete timeout threshold that has not been defined or validated.
6. **1-second SLA unverified**: The 1-second SLA under ~500 concurrent users (US-001-ac-7) has no load-test baseline or benchmark evidence from the current environment; the SLA is an acceptance criterion but has not been verified against the chosen infrastructure.
7. **DELETE /api/account contract out of scope**: DELETE /api/account is listed as a protected endpoint that also populates the TokenBlacklist, but its contract details (request/response schema, cascade-delete behaviour) are out of scope for US-001 and remain unspecified in this story's grounding.
8. **Rate-limiting policy undefined for dashboard endpoint**: No explicit rate-limiting policy is defined for GET /api/v1/dashboard; the design mentions rate limiting on auth endpoints but does not confirm whether the dashboard endpoint is included.
9. **API contract registry not populated**: The `architecture_context.api_contracts` field was not populated in the input payload; contract grounding is therefore derived solely from `spec_technical_design` and the functional specification rather than a provider-confirmed API contract registry.

---

## Service: SVC-002 — User Management API Backend

**Technologies**: Node.js with TypeScript (or Python with FastAPI), Express.js (or FastAPI), jsonwebtoken / PyJWT, bcryptjs / passlib[bcrypt], Zod / Joi (Node.js) or Pydantic (Python), Prisma / TypeORM (Node.js) or SQLAlchemy (Python), Winston (Node.js) or structlog (Python), Helmet.js, express-rate-limit or SlowApi, Docker + Docker Compose, dotenv.

### Design Steps

**Step 1** [SVC-002 — Route]: Confirm GET /api/v1/dashboard is registered on the Express/FastAPI router in SVC-002 with AuthMiddleware applied as the first middleware in the chain, before UserController.getDashboard() is invoked. Verify the route path matches the acceptance criteria exactly (/api/v1/dashboard, not /api/dashboard). [evidence: service:SVC-002, artifact-SVC-002-c3, artifact-SVC-002-api_spec]

**Step 2** [SVC-002 — AuthMiddleware: token presence check]: Implement the missing-token guard in AuthMiddleware for GET /api/v1/dashboard. If the Authorization header is absent or does not carry a Bearer token, AuthMiddleware must immediately return HTTP 401 with ErrorResponse { code: 'UNAUTHORIZED', message: '...', correlationId: '<uuid>' } and must not invoke UserController.getDashboard(). [evidence: service:SVC-002, FR-002, US-001-ac-2]

**Step 3** [SVC-002 — AuthMiddleware: expiry check]: Implement JWT exp-claim validation in AuthMiddleware. After extracting the Bearer token, decode and inspect the exp claim; if the current time is at or past exp, return HTTP 401 ErrorResponse { code: 'UNAUTHORIZED' } without invoking the controller. Use jsonwebtoken.verify() / PyJWT.decode() with clock-skew tolerance ≤ 0. [evidence: service:SVC-002, FR-003, US-001-ac-3]

**Step 4** [SVC-002 — TokenBlacklist.isBlacklisted()]: Implement or wire the TokenBlacklist component within SVC-002. AuthMiddleware must call TokenBlacklist.isBlacklisted(token) after expiry validation; if the token is found in the blacklist, return HTTP 401 ErrorResponse { code: 'UNAUTHORIZED' } without invoking the controller. The blacklist must be populated on POST /api/auth/logout and on DELETE /api/account completion. [evidence: service:SVC-002, FR-004, US-001-ac-4]

**Step 5** [SVC-002 — AuthMiddleware: PostgreSQL session store fail-secure]: Implement the fail-secure path in AuthMiddleware for PostgreSQL session store unavailability. If the session store query throws or times out during JWT validation, AuthMiddleware must catch the error and return HTTP 401 ErrorResponse { code: 'UNAUTHORIZED' } rather than granting access. Log the store outage with a correlation ID. [evidence: service:SVC-002, FR-008, US-001-ac-8]

**Step 6** [SVC-002 — AuthMiddleware: JwtPayload attachment]: On successful validation (token present, not expired, not blacklisted, session store available), AuthMiddleware must decode the JWT and attach the JwtPayload { sub, email, iat, exp } to req.user before calling next(), making it available to UserController.getDashboard(). [evidence: service:SVC-002, FR-006, US-001-ac-6]

**Step 7** [SVC-002 — UserController.getDashboard()]: Implement UserController.getDashboard() to read user identity exclusively from req.user (JwtPayload set by AuthMiddleware). It must never read user identity from query parameters or request body. Fetch UserDTO fields (id, name, email, is_verified, created_at) for the user identified by JwtPayload.sub. Return HTTP 200 with DashboardResponse { user: UserDTO, features: { delete_account_visible: true } }. [evidence: service:SVC-002, FR-001, FR-005, FR-006, US-001-ac-1, US-001-ac-5, US-001-ac-6]

**Step 8** [SVC-002 — DashboardResponse schema]: Define and enforce the DashboardResponse schema: { user: UserDTO, features: { delete_account_visible: boolean } }. Validate with Zod/Joi (Node.js) or Pydantic (Python) at the controller output boundary. Ensure delete_account_visible is always set to boolean true in every HTTP 200 response from GET /api/v1/dashboard. [evidence: service:SVC-002, FR-005, US-001-ac-5]

**Step 9** [SVC-002 — ErrorResponse schema]: Define and enforce the ErrorResponse schema for HTTP 401 responses: { code: string, message: string, correlationId: string }. The code field must equal 'UNAUTHORIZED' for all auth failures on GET /api/v1/dashboard. Wire this into the centralized error handler so all AuthMiddleware rejections produce a consistent response body. [evidence: service:SVC-002, FR-002, US-001-ac-2]

**Step 10** [SVC-002 — Performance: 1-second SLA]: Instrument the AuthMiddleware validation path for GET /api/v1/dashboard with timing metrics. Ensure the full session-validation path (token decode + blacklist check + session store query) completes within 1 second end-to-end under ~500 concurrent users. Apply connection pooling on the PostgreSQL session store client and set appropriate query timeouts. Add a load test gate (e.g., k6 or Artillery) targeting 500 VUs on GET /api/v1/dashboard to validate the SLA before merge. [evidence: service:SVC-002, FR-007, US-001-ac-7]

**Step 11** [SVC-002 — Degraded notice — generated_context gaps]: The generated_context artifacts for SVC-002 (artifact-SVC-002-c3, artifact-SVC-002-c4, artifact-SVC-002-api_spec) were regenerated but returned empty content. No provider-confirmed C4 diagrams or detailed API spec content was available. This design is therefore marked degraded: all component and API surface decisions above are grounded in spec_service_identification.services[SVC-002] and the functional specification (spec_functional), not in regenerated architecture artifacts. Review and reconcile once artifact-SVC-002-c3, artifact-SVC-002-c4, and artifact-SVC-002-api_spec are populated. [evidence: artifact-SVC-002-c3, artifact-SVC-002-c4, artifact-SVC-002-api_spec]

---

## Contract Changes Required

**contract_change_required**: true  
**Impacted services**: SVC-002

### Reasons

1. Greenfield API impact identified: GET /api/v1/dashboard is a new endpoint on SVC-002 with a defined DashboardResponse contract ({ user: UserDTO, features: { delete_account_visible: boolean } }) that does not exist in any prior accepted contract baseline, requiring a new API contract to be established.
2. New HTTP 401 ErrorResponse contract ({ code: string, message: string, correlationId: string }) is introduced for all authentication failures on GET /api/v1/dashboard, constituting a new error-response contract surface.
3. AuthMiddleware is applied as a new contract-enforcing gate on GET /api/v1/dashboard, adding token-presence, expiry, blacklist, and PostgreSQL session-store-availability checks as observable contract behaviour for callers.

### Affected Touchpoints

| Kind | Method | Path | Service | Notes |
|------|--------|------|---------|-------|
| api_contract | GET | /api/v1/dashboard | SVC-002 | New endpoint; DashboardResponse 200, ErrorResponse 401; AuthMiddleware; SLA 1000 ms / 500 VUs |
| api_contract | POST | /api/auth/logout | SVC-002 | TokenBlacklist must be populated on logout completion (dependency for US-001-ac-4) |
| data_contract | — | DashboardResponse | SVC-002 | delete_account_visible MUST be boolean true in every HTTP 200 |
| data_contract | — | UserDTO | SVC-002 | Derived exclusively from JwtPayload.sub via req.user |
| data_contract | — | JwtPayload | SVC-002 | Attached to req.user by AuthMiddleware; sole identity source |
| data_contract | — | ErrorResponse | SVC-002 | code MUST equal 'UNAUTHORIZED' for all auth failures |

---

## Security Obligations

- Validate credential and personal-data handling against the story's acceptance criteria.
- AuthMiddleware must never grant access when the PostgreSQL session store is unavailable (fail-secure, HTTP 401).
- User identity must be derived exclusively from the server-set JwtPayload on req.user; client-supplied query parameters and request body fields must never be used as identity sources.
- Blacklisted tokens (post-logout, post-deletion) must be rejected before the controller is invoked.

## Quality Attribute Obligations

- Verify the changed user flow against the stated accessibility criteria.
- Session validation on GET /api/v1/dashboard must complete within 1-second end-to-end SLA under ~500 concurrent users (US-001-ac-7); validate with a load test gate (k6 or Artillery) before merge.

---

## Verification Plan

| Obligation ID | Criterion | Type | Environment | Required Before |
|---------------|-----------|------|-------------|----------------|
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-1 | US-001-ac-1 | acceptance | ci | release |
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-2 | US-001-ac-2 | acceptance | ci | release |
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-3 | US-001-ac-3 | acceptance | ci | release |
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-4 | US-001-ac-4 | acceptance | ci | release |
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-5 | US-001-ac-5 | acceptance | ci | release |
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-6 | US-001-ac-6 | acceptance | ci | release |
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-7 | US-001-ac-7 | acceptance | ci | release |
| abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-8 | US-001-ac-8 | acceptance | ci | release |

### Assertion Details

- **US-001-ac-1**: When GET /api/v1/dashboard is called with a valid, non-expired, non-blacklisted JWT Bearer token, the endpoint must return HTTP 200 with a DashboardResponse body that includes the 'features.delete_account_visible: true' flag, signalling the client to render the Delete Account option.
- **US-001-ac-2**: When GET /api/v1/dashboard is called without an Authorization header (no active session), the endpoint must return HTTP 401 with an ErrorResponse body containing code 'UNAUTHORIZED', and must not include any dashboard content or the delete_account_visible flag.
- **US-001-ac-3**: When GET /api/v1/dashboard is called with an expired JWT token (exp claim in the past), the AuthMiddleware must reject the request with HTTP 401 before the controller processes it, and must not return any dashboard content.
- **US-001-ac-4**: When GET /api/v1/dashboard is called with a token that has been invalidated via the TokenBlacklist (e.g., after logout or account deletion), the AuthMiddleware must detect the blacklisted token via TokenBlacklist.isBlacklisted() and return HTTP 401, ensuring the Delete Account option is never served on a revoked session.
- **US-001-ac-5**: The DashboardResponse schema must include a 'features' object with a boolean field 'delete_account_visible'; this field must be true in every HTTP 200 response from GET /api/v1/dashboard, as its presence is the server-side signal that the authenticated session is valid and the Delete Account entry point should be rendered.
- **US-001-ac-6**: The UserController.getDashboard() method must derive the user identity exclusively from the JwtPayload attached to req.user by AuthMiddleware — never from any client-supplied query parameter or request body — and must return the UserDTO fields alongside the features flag in the DashboardResponse.
- **US-001-ac-7**: Session validation performed by AuthMiddleware on GET /api/v1/dashboard must complete within the 1-second SLA under approximately 500 concurrent users, as specified for the dashboard endpoint, so that authenticated users experience no perceptible delay when the Delete Account option is rendered.
- **US-001-ac-8**: If the PostgreSQL session store is unavailable during JWT validation for GET /api/v1/dashboard, the endpoint must fail securely by returning HTTP 401 rather than granting access, ensuring the Delete Account option is never displayed when session integrity cannot be confirmed.

### Expected Evidence

- test result for US-001-ac-1
- test result for US-001-ac-2
- test result for US-001-ac-3
- test result for US-001-ac-4
- test result for US-001-ac-5
- test result for US-001-ac-6
- test result for US-001-ac-7
- test result for US-001-ac-8
