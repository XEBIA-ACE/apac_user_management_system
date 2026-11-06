# Implementation Plan: US-001 — View Delete Account Option on Dashboard

## Technical Context

> ⚠️ **Degraded Mode Disclosure**: This design is marked degraded. No provider-scanned architecture context or `accepted_impact_hash` is present. All component and API surface references are grounded exclusively in the regenerated C3 (`artifact-SVC-001-c3`) and C4 (`artifact-SVC-001-c4`) artifacts produced by the Architecture Agent during gap resolution. A live repository scan has not been performed; implementation conformance cannot be verified from static artifacts alone.

**Evidence references (unresolved — must be resolved before implementation):**
- `service:SVC-001` — unresolved reference
- `artifact-SVC-001-c3` — unresolved reference (C3 component diagram for SVC-001)
- `artifact-SVC-001-c4` — unresolved reference (C4 code-level diagram for SVC-001)

**Architecture references grounded in:**
- `artifact-SVC-001-c3`: C3 component diagram for SVC-001 (User Management System API) — defines COMP-001 through COMP-013 and EXT-001 through EXT-004
- `artifact-SVC-001-c4`: C4 code-level diagram for SVC-001 — defines AuthController, UserController, AuthMiddleware, ValidationMiddleware, GlobalExceptionHandler, UserService, AuthService, OtpService, OtpFactory, IUserRepository, IOtpRepository, PostgresUserRepository, PostgresOtpRepository, EmailDispatcher, TokenBlacklist and their code relationships

---

## Implementation-Readiness Items (Must Be Resolved or Explicitly Accepted)

1. **Canonical path ambiguity — GET /api/dashboard vs GET /api/users/me/dashboard**: The design references both as aliases for the same endpoint (UserController). The canonical path must be confirmed and locked in the API contract before implementation to avoid routing ambiguity in the Express router and in ums-web's API client.

2. **Canonical path ambiguity — DELETE /api/users/me vs DELETE /api/account**: The design references both as aliases. The canonical path must be confirmed; the alias must be documented as a redirect or removed to prevent dual-route maintenance burden.

3. **DashboardResponseDTO visibility flag**: DashboardResponseDTO does not include an explicit boolean flag (e.g., `canDeleteAccount`) to signal 'Delete Account' entry point visibility — ums-web currently derives visibility from a successful 200 response alone. If future business rules require finer-grained control (e.g., account type restrictions), the DTO shape will need to be extended. This assumption should be validated with the product owner.

4. **JWT transport mechanism**: The JWT transport mechanism (HttpOnly cookie vs. Authorization Bearer header) is listed as both options in the design. The ums-web client must align with whichever mechanism SVC-001 implements; this choice must be finalised before frontend integration to avoid CORS and CSRF policy mismatches.

5. **Degraded design — no live repository scan**: The design is marked degraded: no provider-scanned architecture context or `accepted_impact_hash` is present. All component and API surface references are grounded exclusively in the regenerated C3 (`artifact-SVC-001-c3`) and C4 (`artifact-SVC-001-c4`) artifacts. A live repository scan has not been performed; implementation conformance cannot be verified from static artifacts alone.

6. **Frontend scope boundary (EXT-004 / ums-web)**: The ums-web frontend module (EXT-004) implementation details — ums-design-system component usage, Dashboard UI wireframe conformance, ARIA accessibility attributes (US-001-ac-5) — are outside the scope of SVC-001 and must be addressed in a separate frontend-scoped design. No frontend contract has been grounded here.

7. **TokenBlacklist storage backend**: TokenBlacklist storage backend is listed as 'Redis or PostgreSQL sessions table' — the concrete choice affects latency of `isBlacklisted()` checks on every GET /api/dashboard request and must be decided before infrastructure provisioning.

8. **Rate-limiting policy for GET /api/dashboard**: Rate-limiting rules on COMP-012 (Nginx) are confirmed absent for normal authenticated dashboard access, but no explicit rate-limit policy for GET /api/dashboard has been specified. If abuse vectors exist (e.g., credential-stuffing via repeated dashboard polling), a rate-limit policy should be defined.

---

## Design Steps

**STEP 1** [SVC-001 / UserController — artifact-SVC-001-c4]: Confirm that UserController handles GET /api/users/me/dashboard (aliased as GET /api/dashboard per service identification) and that the route is registered behind AuthMiddleware in the Express router. The controller must derive the user context exclusively from `req.user.userId` (JWT payload injected by AuthMiddleware) and never from client-supplied path, query, or body parameters. [US-001 / FR-001, FR-002; evidence: artifact-SVC-001-c4, service:SVC-001]

**STEP 2** [SVC-001 / AuthMiddleware — artifact-SVC-001-c4, COMP-007]: Verify that AuthMiddleware is applied to GET /api/dashboard as a protected route. AuthMiddleware must: (a) extract the Bearer token from the Authorization header or HttpOnly cookie, (b) call `AuthService.validateToken()` for JWT signature and expiry validation, (c) call `TokenBlacklist.isBlacklisted()` for revocation check, (d) attach the decoded JwtPayload to `req.user` on success, and (e) return HTTP 401 immediately on any failure — missing token, expired token, or blacklisted token. The 401 response is the signal that suppresses the 'Delete Account' entry point on the ums-web client. [US-001 / FR-002, FR-003, FR-004; evidence: artifact-SVC-001-c4, artifact-SVC-001-c3]

**STEP 3** [SVC-001 / UserService + UserController — artifact-SVC-001-c4, COMP-002]: Confirm that `UserService.getDashboardData(userId)` retrieves the authenticated user's profile from IUserRepository and constructs a `DashboardResponseDTO: { userId, name, email, isVerified, createdAt }`. UserController maps the result to HTTP 200 OK with the DashboardResponseDTO payload. A successful 200 response is the affirmative signal to ums-web to render the 'Delete Account' entry point. [US-001 / FR-001, FR-002; evidence: artifact-SVC-001-c4, artifact-SVC-001-c3]

**STEP 4** [SVC-001 / GlobalExceptionHandler — artifact-SVC-001-c4]: Confirm that GlobalExceptionHandler maps authentication failures (AppError with 401 status) to a standardised ErrorResponseDTO response with HTTP 401. This ensures that expired-session detection (FR-004) and unauthenticated-access detection (FR-003) both produce a consistent 401 that the ums-web module can reliably detect to trigger the /login redirect and suppress the 'Delete Account' entry point. No stack traces, PII, or credential data must appear in the 401 response body. [US-001 / FR-003, FR-004; evidence: artifact-SVC-001-c4]

**STEP 5** [SVC-001 / UserController + DELETE /api/account — artifact-SVC-001-c4, service:SVC-001]: Confirm that DELETE /api/users/me (registered as DELETE /api/account in the service's API surface) is protected by AuthMiddleware and that `UserController.deleteAccount()` passes only `req.user.userId` to `UserService.deleteAccount()`. This satisfies FR-006: the 'Delete Account' entry point on /dashboard is wired to initiate this flow, and the endpoint is both visible and actionable for authenticated users. The actual execution of the deletion, ownership verification, and confirmation step remain out of scope for US-001 but the endpoint contract must be confirmed present. [US-001 / FR-006; evidence: artifact-SVC-001-c4, service:SVC-001]

**STEP 6** [SVC-001 / COMP-012 Reverse Proxy / TLS Gateway — artifact-SVC-001-c3]: Confirm that Nginx routes GET /api/dashboard and DELETE /api/account (DELETE /api/users/me) through to the REST API Controller Layer (COMP-001) over HTTPS. No rate-limiting rules should block normal authenticated dashboard access. TLS termination ensures all session tokens (JWT in HttpOnly cookie or Authorization header) are transmitted exclusively over encrypted channels. [US-001 / FR-001 through FR-006; evidence: artifact-SVC-001-c3]

**STEP 7** [SVC-001 / EXT-004 Frontend Web Client (ums-web) — artifact-SVC-001-c3]: Document the ums-web client-side contract that this backend design supports. The ums-web /dashboard route must: (a) issue GET /api/dashboard on route load, (b) render the 'Delete Account' entry point (using ums-design-system components, conforming to the approved Dashboard UI wireframe with correct placement, labeling, and ARIA accessibility attributes) if and only if the response is HTTP 200 OK, (c) redirect to /login and suppress the entry point if the response is HTTP 401 (covers both unauthenticated and expired-session cases), and (d) wire the 'Delete Account' entry point to initiate the DELETE /api/users/me flow. NOTE: ums-web UI implementation (FR-005 design-system compliance, wireframe conformance, ARIA attributes) is a frontend concern not directly implemented in SVC-001; this step records the API contract boundary. [US-001 / FR-001, FR-002, FR-003, FR-004, FR-005, FR-006; evidence: artifact-SVC-001-c3, service:SVC-001]

**STEP 8** [SVC-001 / TokenBlacklist — artifact-SVC-001-c4]: Confirm that `TokenBlacklist.isBlacklisted()` is invoked by AuthMiddleware on every request to GET /api/dashboard. This ensures that tokens revoked via logout (POST /api/auth/logout) or account deletion (DELETE /api/account) are immediately rejected, preventing a revoked-token holder from accessing the dashboard and seeing the 'Delete Account' entry point after session invalidation. [US-001 / FR-003, FR-004; evidence: artifact-SVC-001-c4]

**STEP 9** [SVC-001 / Degraded-mode disclosure]: This design is marked degraded because the greenfield run does not carry a provider-scanned architecture context (no `accepted_impact_hash`, no live repository scan). All component and API surface references are grounded in the regenerated C3 (`artifact-SVC-001-c3`) and C4 (`artifact-SVC-001-c4`) artifacts produced by the Architecture Agent during gap resolution. No unresolved_blocking gaps exist for SVC-001. The ums-web frontend module (EXT-004) is referenced as an external client boundary; its internal implementation (ums-design-system usage, wireframe conformance per FR-005) is outside the scope of SVC-001 and must be addressed in a separate frontend-scoped design. [evidence: artifact-SVC-001-c3, artifact-SVC-001-c4, service:SVC-001]

---

## Contract Changes Required

| Endpoint | Service | Change Type | Notes |
|----------|---------|-------------|-------|
| GET /api/dashboard | SVC-001 | New (greenfield) | Net-new endpoint; protected by AuthMiddleware; returns DashboardResponseDTO on 200, ErrorResponseDTO on 401 |
| DELETE /api/users/me (alias: DELETE /api/account) | SVC-001 | New (greenfield) | Net-new endpoint; protected by AuthMiddleware; account deletion flow |
| POST /api/auth/login | SVC-001 | No change required | Pre-existing; indirectly implicated as /login redirect target |

**Contract change reason**: Greenfield grounding identifies two net-new API endpoints on SVC-001 that are required by US-001: GET /api/dashboard (session-gated dashboard data retrieval, returning DashboardResponseDTO) and DELETE /api/users/me (alias DELETE /api/account, authenticated account deletion), both protected by AuthMiddleware — these endpoints constitute new API contract surface that must be formally defined.

---

## Security Obligations

- Validate credential and personal-data handling against the story's acceptance criteria.
- AuthMiddleware must call `AuthService.validateToken()` and `TokenBlacklist.isBlacklisted()` on every request to GET /api/dashboard.
- HTTP 401 responses must not contain stack traces, PII, or credential data (enforced by GlobalExceptionHandler).
- UserController.deleteAccount() must derive target account exclusively from `req.user.userId` (JWT payload), never from client-supplied identifiers.
- All session tokens (JWT in HttpOnly cookie or Authorization header) must be transmitted exclusively over TLS-encrypted channels (enforced by COMP-012 Nginx).

## Quality Attribute Obligations

- Verify the changed user flow against the stated accessibility criteria (US-001-ac-5: ARIA roles, labels, focus management per ums-design-system and Dashboard UI wireframe).
- TokenBlacklist storage backend choice (Redis vs. PostgreSQL sessions table) must be decided before infrastructure provisioning, as it affects latency of `isBlacklisted()` checks on every GET /api/dashboard request.

---

## Verification Plan

| Obligation ID | Criterion | Test Type | Required Before | Environment |
|---------------|-----------|-----------|-----------------|-------------|
| 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-1 | The /dashboard route (owned by the ums-web module) must render a 'Delete Account' entry point that is visible and interactable when the user holds a valid active session, consistent with the approved Dashboard UI wireframe. | acceptance | release | ci |
| 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-2 | The ums-web module must invoke GET /api/dashboard to retrieve dashboard data; the 'Delete Account' option must only be rendered when this call returns a successful, authenticated response. | acceptance | release | ci |
| 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-3 | When a user navigates to /dashboard without an active session (not logged in), the ums-web router must redirect the user to /login and must not render the 'Delete Account' entry point at any point during the redirect flow. | acceptance | release | ci |
| 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-4 | When a user's session has expired and they access /dashboard, the ums-web module must detect the expired session (e.g., via a 401 response from GET /api/dashboard), redirect the user to /login for re-authentication, and suppress rendering of the 'Delete Account' entry point. | acceptance | release | ci |
| 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-5 | The 'Delete Account' entry point rendered on /dashboard must be implemented using ums-design-system components and must visually conform to the approved Dashboard UI wireframe, including correct placement, labeling, and accessibility attributes. | acceptance | release | ci |
| 5df64424-81b7-4a3e-8607-44ff83fe1ba3:test:acceptance:US-001-ac-6 | The DELETE /api/users/me endpoint is listed as a consumed API in the ums-web module; the 'Delete Account' entry point on /dashboard must be wired to initiate this flow, ensuring the UI element is both visible and actionable for authenticated users. | acceptance | release | ci |

**Expected evidence required before release:**
- test result for US-001-ac-1
- test result for US-001-ac-2
- test result for US-001-ac-3
- test result for US-001-ac-4
- test result for US-001-ac-5
- test result for US-001-ac-6

---

## Traceability Matrix

| Criterion ID | Functional Spec Ref | Accepted Impact Hash |
|--------------|--------------------|-----------------------|
| US-001-ac-1 | spec_functional | null |
| US-001-ac-2 | spec_functional | null |
| US-001-ac-3 | spec_functional | null |
| US-001-ac-4 | spec_functional | null |
| US-001-ac-5 | spec_functional | null |
| US-001-ac-6 | spec_functional | null |

---

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Repository**: `https://github.com/XEBIA-ACE/apac_user_management_system`
- **Base branch**: `main`
- **Repository baseline commit**: `6224f58d3d3d9ccd8f069f41a73f4220cf88f4b1`
- **Run ID**: `5df64424-81b7-4a3e-8607-44ff83fe1ba3`
- **Project ID**: `7e681a6f-20f6-4a19-99bd-09e678ff8493`
- **Generation mode**: greenfield
- **Accepted impact hash**: null (degraded mode)
- **Evidence refs**: service:SVC-001, artifact-SVC-001-c3, artifact-SVC-001-c4