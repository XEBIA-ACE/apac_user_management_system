# Tasks: US-001 — View Delete Account Option on Dashboard

> ⚠️ **Degraded design notice**: `spec_technical_design` is marked `degraded=true`. The generated_context artifacts for SVC-002 (`artifact-SVC-002-c3`, `artifact-SVC-002-c4`, `artifact-SVC-002-api_spec`) were regenerated but returned empty content. All implementation tasks below are grounded in `spec_service_identification.services[SVC-002]` and the functional specification. Reconcile against provider-confirmed artifacts once available.

## Implementation Tasks

- [ ] **T001** [FR-001 / US-001-ac-1] Register GET /api/v1/dashboard on the SVC-002 router with AuthMiddleware as the first middleware in the chain. Verify the route path is exactly `/api/v1/dashboard`. Implement UserController.getDashboard() to return HTTP 200 with `DashboardResponse { user: UserDTO, features: { delete_account_visible: true } }` when the session is valid. [evidence: service:SVC-002, FR-001:US-001-ac-1, artifact-SVC-002-c3, artifact-SVC-002-api_spec]

- [ ] **T002** [FR-002 / US-001-ac-2] Implement the missing-token guard in AuthMiddleware: if the Authorization header is absent or does not carry a Bearer token, return HTTP 401 with `ErrorResponse { code: 'UNAUTHORIZED', message: '...', correlationId: '<uuid>' }` without invoking the controller. [evidence: service:SVC-002, FR-002:US-001-ac-2]

- [ ] **T003** [FR-003 / US-001-ac-3] Implement JWT exp-claim validation in AuthMiddleware: decode the Bearer token and inspect the `exp` claim; if the current time is at or past `exp`, return HTTP 401 `ErrorResponse { code: 'UNAUTHORIZED' }` without invoking the controller. Use `jsonwebtoken.verify()` / `PyJWT.decode()` with clock-skew tolerance ≤ 0. [evidence: service:SVC-002, FR-003:US-001-ac-3]

- [ ] **T004** [FR-004 / US-001-ac-4] Implement or wire the TokenBlacklist component within SVC-002. AuthMiddleware must call `TokenBlacklist.isBlacklisted(token)` after expiry validation; if the token is blacklisted, return HTTP 401 `ErrorResponse { code: 'UNAUTHORIZED' }` without invoking the controller. Ensure the blacklist is populated on POST /api/auth/logout and on DELETE /api/account completion. Resolve the backing store choice (in-process vs. Redis) and capture any new external dependency. [evidence: service:SVC-002, FR-004:US-001-ac-4]

- [ ] **T005** [FR-005 / US-001-ac-5] Define and enforce the DashboardResponse schema: `{ user: UserDTO, features: { delete_account_visible: boolean } }`. Validate with Zod/Joi (Node.js) or Pydantic (Python) at the controller output boundary. Ensure `delete_account_visible` is always set to boolean `true` in every HTTP 200 response from GET /api/v1/dashboard. [evidence: service:SVC-002, FR-005:US-001-ac-5]

- [ ] **T006** [FR-006 / US-001-ac-6] Implement UserController.getDashboard() to read user identity exclusively from `req.user` (JwtPayload set by AuthMiddleware). It must never read user identity from query parameters or request body. Fetch UserDTO fields (`id`, `name`, `email`, `is_verified`, `created_at`) for the user identified by `JwtPayload.sub`. Return HTTP 200 with `DashboardResponse { user: UserDTO, features: { delete_account_visible: true } }`. [evidence: service:SVC-002, FR-006:US-001-ac-6]

- [ ] **T007** [FR-007 / US-001-ac-7] Instrument the AuthMiddleware validation path for GET /api/v1/dashboard with timing metrics. Apply connection pooling on the PostgreSQL session store client and set appropriate query timeouts. Add a load test gate (e.g., k6 or Artillery) targeting 500 VUs on GET /api/v1/dashboard to validate the 1-second end-to-end SLA before merge. [evidence: service:SVC-002, FR-007:US-001-ac-7]

- [ ] **T008** [FR-008 / US-001-ac-8] Implement the fail-secure path in AuthMiddleware for PostgreSQL session store unavailability: if the session store query throws or times out during JWT validation, catch the error and return HTTP 401 `ErrorResponse { code: 'UNAUTHORIZED' }` rather than granting access. Log the store outage with a correlation ID. Define and document the concrete query timeout threshold. [evidence: service:SVC-002, FR-008:US-001-ac-8]

- [ ] **T009** Define and enforce the ErrorResponse schema for HTTP 401 responses: `{ code: string, message: string, correlationId: string }`. The `code` field must equal `'UNAUTHORIZED'` for all auth failures on GET /api/v1/dashboard. Wire into the centralized error handler so all AuthMiddleware rejections produce a consistent response body. [evidence: service:SVC-002, FR-002:US-001-ac-2]

- [ ] **T010** On successful AuthMiddleware validation (token present, not expired, not blacklisted, session store available), decode the JWT and attach `JwtPayload { sub, email, iat, exp }` to `req.user` before calling `next()`. [evidence: service:SVC-002, FR-006:US-001-ac-6]

- [ ] **T011** Resolve and document the TokenBlacklist backing store choice (in-process store vs. Redis). If Redis is chosen, capture the new external dependency, its availability contract surface, and update the service dependency list for SVC-002. [evidence: service:SVC-002, open item #3]

- [ ] **T012** Define and document the PostgreSQL session store query timeout value used by AuthMiddleware. Confirm the fail-secure path (HTTP 401 on timeout) is triggered at this threshold. [evidence: service:SVC-002, open item #5]

- [ ] **T013** Reconcile `artifact-SVC-002-c3`, `artifact-SVC-002-c4`, and `artifact-SVC-002-api_spec` once provider-confirmed content is available. Update any component or API surface decisions that diverge from the regenerated artifacts. [evidence: artifact-SVC-002-c3, artifact-SVC-002-c4, artifact-SVC-002-api_spec]

## Verification Tasks

- [ ] **T014** [Verify US-001-ac-1 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-1] Write and pass acceptance test: GET /api/v1/dashboard with a valid, non-expired, non-blacklisted JWT Bearer token returns HTTP 200 with `DashboardResponse` body including `features.delete_account_visible: true`.

- [ ] **T015** [Verify US-001-ac-2 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-2] Write and pass acceptance test: GET /api/v1/dashboard without an Authorization header returns HTTP 401 with `ErrorResponse { code: 'UNAUTHORIZED' }`; response must not include any dashboard content or the `delete_account_visible` flag.

- [ ] **T016** [Verify US-001-ac-3 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-3] Write and pass acceptance test: GET /api/v1/dashboard with an expired JWT token (exp claim in the past) returns HTTP 401 from AuthMiddleware before the controller processes it; response must not contain any dashboard content.

- [ ] **T017** [Verify US-001-ac-4 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-4] Write and pass acceptance test: GET /api/v1/dashboard with a blacklisted token (e.g., after logout) causes AuthMiddleware to call `TokenBlacklist.isBlacklisted()` and return HTTP 401; the Delete Account option must not be served.

- [ ] **T018** [Verify US-001-ac-5 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-5] Write and pass acceptance test: every HTTP 200 response from GET /api/v1/dashboard includes a `features` object with `delete_account_visible` set to boolean `true`.

- [ ] **T019** [Verify US-001-ac-6 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-6] Write and pass acceptance test: UserController.getDashboard() derives user identity exclusively from `req.user` (JwtPayload); passing a different user ID in query parameters or request body does not affect the identity used; DashboardResponse includes UserDTO fields alongside the features flag.

- [ ] **T020** [Verify US-001-ac-7 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-7] Execute load test (k6 or Artillery) at 500 concurrent VUs against GET /api/v1/dashboard; confirm the full session-validation path completes within 1-second end-to-end SLA. Gate merge on passing result.

- [ ] **T021** [Verify US-001-ac-8 / obligation: abcced4f-1b15-4aab-8725-f0adf10b291b:test:acceptance:US-001-ac-8] Write and pass acceptance test: when the PostgreSQL session store is unavailable during JWT validation, GET /api/v1/dashboard returns HTTP 401 rather than granting access; the Delete Account option must not be displayed.
