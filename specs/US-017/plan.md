# Implementation Plan: US-017

## Technical Context

- **Codebase grounding snapshot**: `60b54710194b777d`
- **Accepted impact analysis**: `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1` (revision 1)
- **Determinism snapshot**: `determinism-snapshot:sha256:8cb8ed4fb9c174c6ca89c43bdd98a3470423e9c25e3e0dd5e46b104e1ab21a19`
- **Provider objects in scope**:
  - `provider-object:2961` — UserProfileController (Typescript Class)
  - `provider-object:2445` — createUserProfileRouter (Typescript Function)
  - `provider-object:1475` — UserProfileService (Typescript Interface)
  - `provider-object:3101` — AccountDashboardTemplate_fragment_1 (HTML Fragment)
  - `provider-object:2942` — getSessionEmail (Typescript Function)
  - `provider-object:2948` — useCurrentUser (Typescript Function)
- **Components in scope**:
  - `component:AccountDashboardTemplate_fragment_1`
  - `component:UserProfileController`
  - `component:UserProfileService`
  - `component:createUserProfileRouter`
  - `component:getSessionEmail`
  - `component:useCurrentUser`
  - `component:§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts`
- **Implement only against**: Accepted impact analysis (revision 1), fingerprint `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`

---

## Design Steps

1. **[FR-001 / US-017-ac-1]** Modify provider-confirmed component `UserProfileController` (CAST id:2961) to ensure the GET handler returns all four required fields — Name, Email Address, Registration Date, and Account Status — in the response payload. Verify that `UserProfileResult` and `UserProfileResponse` DTOs declare all four fields; add any missing field declarations. Source file: `§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts`. Evidence: `provider-object:2961`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. **NOTE**: end-to-end latency (1-second SLA, F-005-R3) cannot be verified from CAST structural facts alone — a dedicated performance test is required.

2. **[FR-005 / US-017-ac-5]** Modify provider-confirmed component `UserProfileController` (CAST id:2961) to enforce server-side ownership scoping: apply an authentication guard and a user-identity filter so that the controller/service layer returns only the authenticated user's own record. Coordinate with `DefaultUserProfileService` to ensure the user-scoped query is implemented. Source file: `§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts`. Evidence: `provider-object:2961`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. **NOTE**: CAST structural facts do not confirm the presence of an authentication guard or ownership filter; a security/integration test is required to verify cross-user data access is prevented (F-005-R2).

3. **[FR-004 / US-017-ac-4]** Modify provider-confirmed component `createUserProfileRouter` (CAST id:2445) to confirm the GET endpoint is registered with the correct HTTP method and JSON Content-Type, and that HTTPS enforcement is applied at the middleware/infrastructure layer. Evidence: `provider-object:2445`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. **NOTE**: CAST api_inventory query returned errors — the exact endpoint path and HTTP method are not structurally confirmed; verification must be performed at the infrastructure/middleware layer.

4. **[FR-001 / US-017-ac-1]** Modify provider-confirmed component `UserProfileService` (CAST id:1475, Typescript Interface) to ensure the service interface contract exposes all four required fields (Name, Email Address, Registration Date, Account Status) and that `DefaultUserProfileService` implements the updated contract. Coordinate with the UserProfileController step above. Evidence: `component:UserProfileService`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`.

5. **[FR-002 / US-017-ac-2]** Modify provider-confirmed component `AccountDashboardTemplate_fragment_1` (CAST id:3101, HTML Fragment) to render each of the four profile fields with a clear, visible, programmatically associated label ('Name', 'Email Address', 'Registration Date', 'Account Status'). Use the available dependency `@radix-ui/react-label@2.1.2` to satisfy F-005-R4 and WCAG label obligations. Evidence: `component:AccountDashboardTemplate_fragment_1`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. **NOTE**: CAST structural facts do not confirm that label components are currently rendered for each field; frontend component verification is required.

6. **[FR-003 / US-017-ac-3 | FR-006 / US-017-ac-6]** Modify provider-confirmed component `AccountDashboardTemplate_fragment_1` (CAST id:3101, HTML Fragment) to ensure all four profile fields are rendered as read-only display elements with zero editable controls (no text inputs, dropdowns, or checkboxes) and no UI affordance that allows field value modification. Evidence: `component:AccountDashboardTemplate_fragment_1`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. **NOTE**: no CAST frontend component structural facts were returned; verification requires UI-layer inspection or automated DOM assertion.

7. **[US-017-ac-1 / session context]** Verify provider-confirmed component `getSessionEmail` (CAST id:2942, Typescript Function) is invoked correctly within the AccountDetails pivot to supply the authenticated user's session identity to the profile data fetch. No changes expected unless the session identity is not being passed to the ownership filter added in the UserProfileController step. Evidence: `component:getSessionEmail`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`.

8. **[US-017-ac-5 / session context]** Verify provider-confirmed component `useCurrentUser` (CAST id:2948, Typescript Function) is invoked correctly within the AccountDetails pivot and that the resolved user identity is propagated to the ownership-scoping logic added in the UserProfileController step. No changes expected unless the current-user hook is not wired to the authentication guard. Evidence: `component:useCurrentUser`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`.

9. **[Disclosure — degraded design]** This design is marked **degraded** for the following reasons:
   - CAST api_inventory query returned errors — endpoint path, HTTP method, and HTTPS enforcement are not structurally confirmed.
   - Zero CAST transactions were found passing through UserProfileController — runtime call-path coverage is unconfirmed.
   - CAST 'database objects accessed' returned only TypeScript application objects, not relational tables — actual DB schema exposure is unconfirmed.
   - No transitive callers were found — upstream consumer scope beyond createUserProfileRouter is unconfirmed.
   - Frontend component structural facts (React component tree, form element usage) were not returned by CAST — US-017-ac-3 and US-017-ac-6 cannot be verified from backend facts alone.
   - All gaps are carried forward from impact_analysis evidence. Evidence: `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`.

---

## Contract Changes Required

| Touchpoint | Kind | Note |
|---|---|---|
| GET `/user-profile` (inferred from UserProfileController + createUserProfileRouter) | api | CAST api_inventory query returned errors; no endpoint path or HTTP method is structurally confirmed |
| UserProfileResponse DTO | data | Must carry all four required fields (Name, Email Address, Registration Date, Account Status); current field coverage is unconfirmed |
| UserProfileResult DTO | data | Must carry all four required fields (Name, Email Address, Registration Date, Account Status); current field coverage is unconfirmed |
| CAST DB-objects query result | data | CAST DB-objects query returned six TypeScript application objects (services, DTOs, router) rather than relational tables — no confirmed relational DB table exposure |
| SQL construction check | data | No SQL-in-loop or direct SQL construction was detected in the intra-object structural facts |

---

## Security Obligations

- The Profile page must only return the authenticated user's own record — server-side ownership check required on the controller/service layer (F-005-R2); not verifiable from CAST structural facts alone.
- All API calls must be issued over HTTPS — TLS enforcement must be confirmed at the infrastructure/middleware layer; CAST structural facts do not confirm this.
- Authentication guard must be applied to the route registered by `createUserProfileRouter` (2445).
- Validate credential and personal-data handling against the Jira requirement.
- Validate credential and personal-data handling against the story's acceptance criteria.

## Accessibility Obligations

- Each of the four profile fields must be accompanied by a visible, programmatic label ('Name', 'Email Address', 'Registration Date', 'Account Status') — dependency `@radix-ui/react-label@2.1.2` is available in the inventory and should be used to satisfy F-005-R4 and WCAG label requirements.
- Verify the changed user flow against the stated accessibility criteria.

---

## Implementation-Readiness Items (must be resolved or explicitly accepted)

- Requirement traceability incomplete for US-017-ac-1, US-017-ac-2, US-017-ac-3, US-017-ac-4, US-017-ac-5, US-017-ac-6.
- CAST api_inventory query failed — no confirmed endpoint path, HTTP method, or HTTPS enforcement evidence.
- The profile GET endpoint path is not structurally confirmed because the CAST api_inventory query returned errors; the endpoint inferred from controller/router naming is an assumption.
- What is the exact API endpoint path and HTTP method registered by `createUserProfileRouter` (2445)? CAST api_inventory returned errors.
- Do `UserProfileResponse` and `UserProfileResult` DTOs already include all four required fields (Name, Email Address, Registration Date, Account Status)?
- Is an authentication/authorization guard already applied to the route, or does it need to be added as part of this story?
- Why did CAST transaction discovery return zero transactions for UserProfileController — is this a new controller not yet covered by transaction seeds?
- Zero CAST transactions found — runtime call-path coverage cannot be assessed.
- No CAST transactions were found passing through UserProfileController — this may indicate the transaction discovery scope did not cover this controller, or it is a new/unexercised path.
- CAST 'database objects accessed' returned only TypeScript objects, not relational tables — actual DB schema exposure is unconfirmed.
- The six objects returned by the CAST 'database objects accessed' query are TypeScript application-layer objects (services, DTOs, router), not relational database tables — CAST type metadata was 'unknown' for all six.
- No transitive callers found — upstream consumer scope beyond createUserProfileRouter is unconfirmed.
- CAST structural facts do not confirm the presence of an authentication guard or ownership filter on the controller or service — no transaction or security-rule evidence is available to verify that cross-user data access is prevented (US-017-ac-5 / F-005-R2).
- Frontend component structural facts (React component tree, form element usage) were not returned by CAST — US-017-ac-3 and US-017-ac-6 cannot be verified from backend facts alone.
- CAST structural facts do not confirm that label components are currently rendered for each of the four fields in the UI layer — US-017-ac-2 cannot be verified from backend facts alone.

---

## Verification Plan

- **US-017-ac-1**: Given an authenticated user navigates to the Profile page, When the page loads, Then all four fields — Name, Email Address, Registration Date, and Account Status — are displayed within 1 second under normal conditions (F-005-R3).
- **US-017-ac-2**: Given the Profile page is rendered, When the user inspects the page, Then each field is accompanied by a clear, visible label: 'Name', 'Email Address', 'Registration Date', and 'Account Status' (F-005-R4).
- **US-017-ac-3**: Given the Profile page is rendered, When the user inspects all profile fields, Then zero editable controls (text inputs, dropdowns, checkboxes) are present for any profile field (F-005-R1).
- **US-017-ac-4**: Given the Profile page makes an API call, When the request is issued, Then it is executed over HTTPS and the JSON REST API contract is honoured (F-005).
- **US-017-ac-5**: Given the Profile page is rendered, When the data is displayed, Then only the authenticated user's own record is shown — no other user's data is accessible (F-005-R2).
- **US-017-ac-6**: Given the Profile page is rendered, When the user attempts to interact with any profile field, Then no field value can be modified through the UI.
- **IMPACT**: Verify all four fields render within 1 second under normal load (F-005-R3) — performance test required.
- **IMPACT**: Verify zero editable controls (inputs, dropdowns, checkboxes) are present in the rendered DOM (F-005-R1).
- **IMPACT**: Verify that a request authenticated as User A cannot retrieve User B's profile record (F-005-R2) — security/integration test required.
- **IMPACT**: Verify the API call is issued over HTTPS and returns a valid JSON REST response (F-005).
- **IMPACT**: Verify field labels are visible and correctly associated with their values (F-005-R4).
- **IMPACT**: Verify no field value can be modified through the UI (US-017-ac-6).
