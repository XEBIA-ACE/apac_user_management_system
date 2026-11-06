# Feature Specification: US-001 — View Delete Account Option on Dashboard

## Story

**ID**: US-001  
**Title**: View Delete Account Option on Dashboard  
**Description**: This story covers the session-gated visibility of the 'Delete Account' entry point on the Dashboard. The option is displayed exclusively when the user holds a valid, active session. If no valid session exists, the option is not presented and the user is directed to re-authenticate. In scope: rendering/hiding the 'Delete Account' UI element based on session validity. Out of scope: the actual deletion API call (US-02), ownership verification (EP-002), and the confirmation/execution step (downstream scope).

---

## Functional Behavior

The /dashboard route in the ums-web module renders a 'Delete Account' entry point exclusively when the user holds a valid, active session, as confirmed by a successful authenticated response from GET /api/dashboard. The entry point is implemented using ums-design-system components, visually conforms to the approved Dashboard UI wireframe, and is wired to initiate the DELETE /api/users/me flow. When no valid session exists — either because the user is not logged in or because the session has expired (indicated by a 401 response from GET /api/dashboard) — the 'Delete Account' entry point is suppressed at all times and the user is redirected to /login. The actual deletion API call, ownership verification, and the confirmation/execution step are explicitly out of scope for this story.

---

## Functional Requirements

- **FR-001**: The ums-web module must render a 'Delete Account' entry point on the /dashboard route that is visible and interactable when and only when the user holds a valid active session, in accordance with the approved Dashboard UI wireframe. [Derived from AC: US-001-ac-1]
- **FR-002**: The ums-web module must issue a GET /api/dashboard request to retrieve dashboard data on route load; the 'Delete Account' entry point must be rendered if and only if this request returns a successful, authenticated response. The entry point must not be rendered on any non-successful or unauthenticated response. [Derived from AC: US-001-ac-2]
- **FR-003**: When a user navigates to /dashboard without an active session, the ums-web router must immediately redirect the user to /login. The 'Delete Account' entry point must not be rendered at any point during this redirect flow, including any intermediate rendering states. [Derived from AC: US-001-ac-3]
- **FR-004**: When the ums-web module detects an expired session while accessing /dashboard — for example by receiving a 401 response from GET /api/dashboard — it must redirect the user to /login for re-authentication and must suppress rendering of the 'Delete Account' entry point throughout the detection and redirect sequence. [Derived from AC: US-001-ac-4]
- **FR-005**: The 'Delete Account' entry point on /dashboard must be built exclusively from ums-design-system components. Its placement, labeling, and accessibility attributes (including but not limited to ARIA roles, labels, and focus management) must conform to the approved Dashboard UI wireframe. Any deviation from the wireframe in placement, labeling, or accessibility attributes constitutes a failure of this requirement. [Derived from AC: US-001-ac-5]
- **FR-006**: The ums-web module must list DELETE /api/users/me as a consumed API and must wire the 'Delete Account' entry point on /dashboard to initiate that flow. For authenticated users, the entry point must be both visible and actionable (i.e., capable of triggering the initiation of the deletion flow). The actual execution of the deletion call, ownership verification, and confirmation step are out of scope for this story. [Derived from AC: US-001-ac-6]

---

## Acceptance Criteria

| ID | Criterion | Tier | Trust Status |
|----|-----------|------|--------------|
| US-001-ac-1 | The /dashboard route (owned by the ums-web module) must render a 'Delete Account' entry point that is visible and interactable when the user holds a valid active session, consistent with the approved Dashboard UI wireframe. | B | HYPOTHESIS |
| US-001-ac-2 | The ums-web module must invoke GET /api/dashboard to retrieve dashboard data; the 'Delete Account' option must only be rendered when this call returns a successful, authenticated response. | B | HYPOTHESIS |
| US-001-ac-3 | When a user navigates to /dashboard without an active session (not logged in), the ums-web router must redirect the user to /login and must not render the 'Delete Account' entry point at any point during the redirect flow. | B | HYPOTHESIS |
| US-001-ac-4 | When a user's session has expired and they access /dashboard, the ums-web module must detect the expired session (e.g., via a 401 response from GET /api/dashboard), redirect the user to /login for re-authentication, and suppress rendering of the 'Delete Account' entry point. | B | HYPOTHESIS |
| US-001-ac-5 | The 'Delete Account' entry point rendered on /dashboard must be implemented using ums-design-system components and must visually conform to the approved Dashboard UI wireframe, including correct placement, labeling, and accessibility attributes. | B | HYPOTHESIS |
| US-001-ac-6 | The DELETE /api/users/me endpoint is listed as a consumed API in the ums-web module; the 'Delete Account' entry point on /dashboard must be wired to initiate this flow, ensuring the UI element is both visible and actionable for authenticated users. | B | HYPOTHESIS |

---

## User Scenarios & Testing

- **US-001-ac-1**: The /dashboard route (owned by the ums-web module) must render a 'Delete Account' entry point that is visible and interactable when the user holds a valid active session, consistent with the approved Dashboard UI wireframe.
- **US-001-ac-2**: The ums-web module must invoke GET /api/dashboard to retrieve dashboard data; the 'Delete Account' option must only be rendered when this call returns a successful, authenticated response.
- **US-001-ac-3**: When a user navigates to /dashboard without an active session (not logged in), the ums-web router must redirect the user to /login and must not render the 'Delete Account' entry point at any point during the redirect flow.
- **US-001-ac-4**: When a user's session has expired and they access /dashboard, the ums-web module must detect the expired session (e.g., via a 401 response from GET /api/dashboard), redirect the user to /login for re-authentication, and suppress rendering of the 'Delete Account' entry point.
- **US-001-ac-5**: The 'Delete Account' entry point rendered on /dashboard must be implemented using ums-design-system components and must visually conform to the approved Dashboard UI wireframe, including correct placement, labeling, and accessibility attributes.
- **US-001-ac-6**: The DELETE /api/users/me endpoint is listed as a consumed API in the ums-web module; the 'Delete Account' entry point on /dashboard must be wired to initiate this flow, ensuring the UI element is both visible and actionable for authenticated users.

---

## API Contracts

### GET /api/dashboard
- **Alias**: GET /api/users/me/dashboard
- **Controller**: UserController
- **Auth**: JWT Bearer (HttpOnly cookie or Authorization header)
- **Middleware**: AuthMiddleware, ValidationMiddleware
- **Response 200**: `DashboardResponseDTO: { userId: string, name: string, email: string, isVerified: boolean, createdAt: string }`
- **Response 401**: `ErrorResponseDTO: { error: { code: string, message: string, correlationId: string } }` — triggers /login redirect and suppresses 'Delete Account' entry point on ums-web
- **Notes**: A 200 OK response is the affirmative signal to ums-web to render the 'Delete Account' entry point. A 401 response (missing token, expired token, or blacklisted token) suppresses the entry point and triggers redirect to /login. AuthMiddleware calls AuthService.validateToken() and TokenBlacklist.isBlacklisted() on every request to this route.
- **AC Refs**: US-001-ac-2, US-001-ac-3, US-001-ac-4
- **FR Refs**: FR-001, FR-002, FR-003, FR-004
- **Evidence**: artifact-SVC-001-c3, artifact-SVC-001-c4, service:SVC-001

### DELETE /api/users/me
- **Alias**: DELETE /api/account
- **Controller**: UserController
- **Auth**: JWT Bearer (HttpOnly cookie or Authorization header)
- **Middleware**: AuthMiddleware
- **Response 200**: HTTP 200 OK — account and all associated OTP data permanently deleted; session revoked via TokenBlacklist
- **Response 401**: `ErrorResponseDTO: { error: { code: string, message: string, correlationId: string } }`
- **Notes**: US-001 scope is limited to confirming the endpoint contract is present and wired to the 'Delete Account' entry point on /dashboard. Actual deletion execution, ownership verification, and confirmation step are out of scope for US-001 (downstream stories). UserController.deleteAccount() derives target account exclusively from req.user.userId (JWT payload), never from client-supplied identifiers.
- **AC Refs**: US-001-ac-6
- **FR Refs**: FR-006
- **Evidence**: artifact-SVC-001-c3, artifact-SVC-001-c4, service:SVC-001

### POST /api/auth/login
- **Controller**: AuthController
- **Auth**: None (public endpoint)
- **Middleware**: ValidationMiddleware
- **Response 200**: `AuthResponseDTO: { userId: string, email: string, name: string, token: string }` — JWT also set as HttpOnly cookie
- **Response 401**: ErrorResponseDTO — anti-enumeration: identical generic error for all four failure conditions
- **Notes**: Indirectly implicated by US-001: the /login redirect target for unauthenticated and expired-session flows. Contract is pre-existing within SVC-001 greenfield design; no change required to this endpoint for US-001.
- **AC Refs**: US-001-ac-3, US-001-ac-4
- **FR Refs**: FR-003, FR-004
- **Evidence**: artifact-SVC-001-c3, artifact-SVC-001-c4, service:SVC-001

---

## Data Contracts

### DashboardResponseDTO
- **Direction**: response
- **Endpoint**: GET /api/dashboard
- **Shape**: `{ userId: string, name: string, email: string, isVerified: boolean, createdAt: string }`
- **Notes**: HTTP 200 with this DTO is the session-validity signal consumed by ums-web (EXT-004) to render the 'Delete Account' entry point. Fields sourced from User entity via UserService.getDashboardData(userId) → IUserRepository.
- **AC Refs**: US-001-ac-2
- **FR Refs**: FR-001, FR-002
- **Evidence**: artifact-SVC-001-c4, service:SVC-001

### ErrorResponseDTO
- **Direction**: response
- **Endpoint**: GET /api/dashboard (401), DELETE /api/users/me (401)
- **Shape**: `{ error: { code: string, message: string, correlationId: string } }`
- **Notes**: HTTP 401 with this DTO is the session-failure signal consumed by ums-web to suppress the 'Delete Account' entry point and redirect to /login. GlobalExceptionHandler maps AppError(401) to this shape; no stack traces or PII permitted.
- **AC Refs**: US-001-ac-3, US-001-ac-4
- **FR Refs**: FR-003, FR-004
- **Evidence**: artifact-SVC-001-c4, service:SVC-001

---

## Success Criteria

- **US-001-ac-1**: The /dashboard route (owned by the ums-web module) must render a 'Delete Account' entry point that is visible and interactable when the user holds a valid active session, consistent with the approved Dashboard UI wireframe.
- **US-001-ac-2**: The ums-web module must invoke GET /api/dashboard to retrieve dashboard data; the 'Delete Account' option must only be rendered when this call returns a successful, authenticated response.
- **US-001-ac-3**: When a user navigates to /dashboard without an active session (not logged in), the ums-web router must redirect the user to /login and must not render the 'Delete Account' entry point at any point during the redirect flow.
- **US-001-ac-4**: When a user's session has expired and they access /dashboard, the ums-web module must detect the expired session (e.g., via a 401 response from GET /api/dashboard), redirect the user to /login for re-authentication, and suppress rendering of the 'Delete Account' entry point.
- **US-001-ac-5**: The 'Delete Account' entry point rendered on /dashboard must be implemented using ums-design-system components and must visually conform to the approved Dashboard UI wireframe, including correct placement, labeling, and accessibility attributes.
- **US-001-ac-6**: The DELETE /api/users/me endpoint is listed as a consumed API in the ums-web module; the 'Delete Account' entry point on /dashboard must be wired to initiate this flow, ensuring the UI element is both visible and actionable for authenticated users.

---

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Repository**: `https://github.com/XEBIA-ACE/apac_user_management_system`
- **Base branch**: `main`
- **Repository baseline commit**: `6224f58d3d3d9ccd8f069f41a73f4220cf88f4b1`
- **Run ID**: `5df64424-81b7-4a3e-8607-44ff83fe1ba3`
- **Project ID**: `7e681a6f-20f6-4a19-99bd-09e678ff8493`
- **Generation mode**: greenfield
- **Accepted impact hash**: null (degraded mode — no provider-scanned architecture context present)
- **Evidence refs**: service:SVC-001, artifact-SVC-001-c3, artifact-SVC-001-c4