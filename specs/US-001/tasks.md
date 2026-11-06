# Tasks: US-001 — View Delete Account Option on Dashboard

> **Note**: This design is marked degraded (no provider-scanned architecture context; no `accepted_impact_hash`). All component and API surface references are grounded in regenerated C3 (`artifact-SVC-001-c3`) and C4 (`artifact-SVC-001-c4`) artifacts. Resolve implementation-readiness items in plan.md before beginning implementation.

---

## Implementation Tasks

- [ ] **T001** [FR-001 / US-001-ac-1] Implement session-gated rendering of the 'Delete Account' entry point on the /dashboard route in ums-web: the entry point must be visible and interactable when and only when the user holds a valid active session, in accordance with the approved Dashboard UI wireframe. [Evidence: artifact-SVC-001-c3, artifact-SVC-001-c4, service:SVC-001]

- [ ] **T002** [FR-002 / US-001-ac-2] Implement GET /api/dashboard invocation on /dashboard route load in ums-web: the 'Delete Account' entry point must be rendered if and only if this request returns a successful, authenticated (HTTP 200) response. The entry point must not be rendered on any non-successful or unauthenticated response. [Evidence: artifact-SVC-001-c4, service:SVC-001]

- [ ] **T003** [FR-003 / US-001-ac-3] Implement unauthenticated-session redirect in ums-web router: when a user navigates to /dashboard without an active session, immediately redirect to /login. The 'Delete Account' entry point must not be rendered at any point during this redirect flow, including any intermediate rendering states. [Evidence: artifact-SVC-001-c3, artifact-SVC-001-c4]

- [ ] **T004** [FR-004 / US-001-ac-4] Implement expired-session detection and redirect in ums-web: when a 401 response is received from GET /api/dashboard, redirect the user to /login for re-authentication and suppress rendering of the 'Delete Account' entry point throughout the detection and redirect sequence. [Evidence: artifact-SVC-001-c4]

- [ ] **T005** [FR-005 / US-001-ac-5] Implement the 'Delete Account' entry point on /dashboard using exclusively ums-design-system components. Placement, labeling, and accessibility attributes (ARIA roles, labels, focus management) must conform to the approved Dashboard UI wireframe. Any deviation in placement, labeling, or accessibility attributes constitutes a failure of this requirement. [Evidence: artifact-SVC-001-c3; frontend-scoped design required — EXT-004 is outside SVC-001 scope]

- [ ] **T006** [FR-006 / US-001-ac-6] Wire the 'Delete Account' entry point on /dashboard to initiate the DELETE /api/users/me flow. List DELETE /api/users/me as a consumed API in the ums-web module. For authenticated users, the entry point must be both visible and actionable. The actual execution of the deletion call, ownership verification, and confirmation step are out of scope for this story. [Evidence: artifact-SVC-001-c4, service:SVC-001]

---

## Backend Contract Confirmation Tasks

- [ ] **T007** [STEP 1 / FR-001, FR-002] Confirm UserController handles GET /api/dashboard (aliased as GET /api/users/me/dashboard) and the route is registered behind AuthMiddleware in the Express router. Confirm the controller derives user context exclusively from `req.user.userId` (JWT payload), never from client-supplied parameters. [Evidence: artifact-SVC-001-c4, service:SVC-001]

- [ ] **T008** [STEP 2 / FR-002, FR-003, FR-004] Verify AuthMiddleware is applied to GET /api/dashboard: (a) extracts Bearer token from Authorization header or HttpOnly cookie, (b) calls `AuthService.validateToken()`, (c) calls `TokenBlacklist.isBlacklisted()`, (d) attaches decoded JwtPayload to `req.user` on success, (e) returns HTTP 401 immediately on any failure. [Evidence: artifact-SVC-001-c4, artifact-SVC-001-c3]

- [ ] **T009** [STEP 3 / FR-001, FR-002] Confirm `UserService.getDashboardData(userId)` retrieves the authenticated user's profile from IUserRepository and constructs `DashboardResponseDTO: { userId, name, email, isVerified, createdAt }`. Confirm UserController maps the result to HTTP 200 OK with the DashboardResponseDTO payload. [Evidence: artifact-SVC-001-c4, artifact-SVC-001-c3]

- [ ] **T010** [STEP 4 / FR-003, FR-004] Confirm GlobalExceptionHandler maps authentication failures (AppError with 401 status) to a standardised ErrorResponseDTO with HTTP 401. Confirm no stack traces, PII, or credential data appear in the 401 response body. [Evidence: artifact-SVC-001-c4]

- [ ] **T011** [STEP 5 / FR-006] Confirm DELETE /api/users/me (registered as DELETE /api/account) is protected by AuthMiddleware and that `UserController.deleteAccount()` passes only `req.user.userId` to `UserService.deleteAccount()`. Confirm endpoint contract is present and wired. [Evidence: artifact-SVC-001-c4, service:SVC-001]

- [ ] **T012** [STEP 6 / FR-001–FR-006] Confirm Nginx (COMP-012) routes GET /api/dashboard and DELETE /api/account through to the REST API Controller Layer (COMP-001) over HTTPS. Confirm no rate-limiting rules block normal authenticated dashboard access. [Evidence: artifact-SVC-001-c3]

- [ ] **T013** [STEP 8 / FR-003, FR-004] Confirm `TokenBlacklist.isBlacklisted()` is invoked by AuthMiddleware on every request to GET /api/dashboard. Confirm tokens revoked via logout or account deletion are immediately rejected. [Evidence: artifact-SVC-001-c4]

---

## Readiness Resolution Tasks

- [ ] **T014** [Readiness Item 1] Resolve canonical path ambiguity: confirm and lock the canonical path for GET /api/dashboard vs GET /api/users/me/dashboard in the API contract and Express router before implementation.

- [ ] **T015** [Readiness Item 2] Resolve canonical path ambiguity: confirm and lock the canonical path for DELETE /api/users/me vs DELETE /api/account; document alias as redirect or remove to prevent dual-route maintenance burden.

- [ ] **T016** [Readiness Item 3] Validate with product owner whether DashboardResponseDTO requires an explicit `canDeleteAccount` boolean flag, or whether deriving 'Delete Account' visibility from a successful 200 response alone is acceptable for all foreseeable business rules.

- [ ] **T017** [Readiness Item 4] Finalise JWT transport mechanism (HttpOnly cookie vs. Authorization Bearer header) for SVC-001 and align ums-web client accordingly before frontend integration, to avoid CORS and CSRF policy mismatches.

- [ ] **T018** [Readiness Item 7] Decide TokenBlacklist storage backend (Redis vs. PostgreSQL sessions table) before infrastructure provisioning; document the decision and its latency implications for `isBlacklisted()` checks on GET /api/dashboard.

- [ ] **T019** [Readiness Item 8] Define and document a rate-limit policy for GET /api/dashboard on COMP-012 (Nginx) if abuse vectors (e.g., credential-stuffing via repeated dashboard polling) are identified as a risk.

---

## Verification Tasks

- [ ] **T020** [Verify US-001-ac-1 / obligation: 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-1] The /dashboard route (owned by the ums-web module) must render a 'Delete Account' entry point that is visible and interactable when the user holds a valid active session, consistent with the approved Dashboard UI wireframe. _(acceptance test, required before release, environment: ci)_

- [ ] **T021** [Verify US-001-ac-2 / obligation: 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-2] The ums-web module must invoke GET /api/dashboard to retrieve dashboard data; the 'Delete Account' option must only be rendered when this call returns a successful, authenticated response. _(acceptance test, required before release, environment: ci)_

- [ ] **T022** [Verify US-001-ac-3 / obligation: 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-3] When a user navigates to /dashboard without an active session (not logged in), the ums-web router must redirect the user to /login and must not render the 'Delete Account' entry point at any point during the redirect flow. _(acceptance test, required before release, environment: ci)_

- [ ] **T023** [Verify US-001-ac-4 / obligation: 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-4] When a user's session has expired and they access /dashboard, the ums-web module must detect the expired session (e.g., via a 401 response from GET /api/dashboard), redirect the user to /login for re-authentication, and suppress rendering of the 'Delete Account' entry point. _(acceptance test, required before release, environment: ci)_

- [ ] **T024** [Verify US-001-ac-5 / obligation: 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-5] The 'Delete Account' entry point rendered on /dashboard must be implemented using ums-design-system components and must visually conform to the approved Dashboard UI wireframe, including correct placement, labeling, and accessibility attributes. _(acceptance test, required before release, environment: ci)_

- [ ] **T025** [Verify US-001-ac-6 / obligation: 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-6] The DELETE /api/users/me endpoint is listed as a consumed API in the ums-web module; the 'Delete Account' entry point on /dashboard must be wired to initiate this flow, ensuring the UI element is both visible and actionable for authenticated users. _(acceptance test, required before release, environment: ci)_