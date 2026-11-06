# Feature Specification: US-017

## Story

**US-017 — View Read-Only Profile Page with All Four Account Detail Fields**

As a Registered User, I want to view my profile page displaying my Name, Email Address, Registration Date, and Account Status in a read-only format, so that I can review my consolidated account details quickly without any risk of accidental edits.

---

## User Scenarios & Acceptance Criteria

- **US-017-ac-1**: Given an authenticated user navigates to the Profile page, When the page loads, Then all four fields — Name, Email Address, Registration Date, and Account Status — are displayed within 1 second under normal conditions (F-005-R3).
- **US-017-ac-2**: Given the Profile page is rendered, When the user inspects the page, Then each field is accompanied by a clear, visible label: 'Name', 'Email Address', 'Registration Date', and 'Account Status' (F-005-R4).
- **US-017-ac-3**: Given the Profile page is rendered, When the user inspects all profile fields, Then zero editable controls (text inputs, dropdowns, checkboxes) are present for any profile field (F-005-R1).
- **US-017-ac-4**: Given the Profile page makes an API call, When the request is issued, Then it is executed over HTTPS and the JSON REST API contract is honoured (F-005).
- **US-017-ac-5**: Given the Profile page is rendered, When the data is displayed, Then only the authenticated user's own record is shown — no other user's data is accessible (F-005-R2).
- **US-017-ac-6**: Given the Profile page is rendered, When the user attempts to interact with any profile field, Then no field value can be modified through the UI.

---

## Functional Requirements

- **FR-001** [US-017-ac-1 / F-005-R3]: The Profile page SHALL retrieve and render all four fields — Name, Email Address, Registration Date, and Account Status — within 1 second of navigation under normal operating conditions. The UserProfileResult and UserProfileResponse DTOs must carry all four fields; end-to-end latency cannot be verified from CAST structural facts alone and requires a dedicated performance test.
- **FR-002** [US-017-ac-2 / F-005-R4]: Each of the four profile fields SHALL be accompanied by a clear, visible, programmatically associated label rendered in the UI: 'Name', 'Email Address', 'Registration Date', and 'Account Status'. The dependency @radix-ui/react-label@2.1.2 is available in the inventory and SHOULD be used to satisfy this requirement and WCAG label obligations. CAST structural facts do not confirm that label components are actually rendered for each field in the UI layer; frontend component verification is required.
- **FR-003** [US-017-ac-3 / F-005-R1]: The rendered Profile page SHALL contain zero editable controls — no text inputs, dropdowns, or checkboxes — for any profile field. This is a frontend rendering constraint. No CAST frontend component structural facts were returned for this object; verification requires UI-layer inspection or automated DOM assertion.
- **FR-004** [US-017-ac-4 / F-005]: The Profile page SHALL issue its data request exclusively over HTTPS, and the backend endpoint registered by createUserProfileRouter SHALL honour the JSON REST API contract (correct HTTP method, JSON Content-Type, well-formed response body). Note: the CAST api_inventory query returned errors; the exact endpoint path and HTTP method are not structurally confirmed and must be verified at the infrastructure/middleware layer.
- **FR-005** [US-017-ac-5 / F-005-R2]: The system SHALL enforce server-side ownership scoping such that the Profile page returns only the authenticated user's own record. UserProfileController and DefaultUserProfileService must apply an authentication guard and user-identity filter; cross-user data access must be prevented. CAST structural facts do not confirm the presence of an authentication guard or ownership filter; a security/integration test is required to verify that a request authenticated as User A cannot retrieve User B's profile record.
- **FR-006** [US-017-ac-6]: The Profile page UI SHALL prevent modification of any profile field value through user interaction. No mechanism (direct input, keyboard shortcut, or other UI affordance) shall allow the user to alter the displayed values. This is a frontend rendering concern; no CAST frontend component structural facts were returned and verification requires UI-layer or automated DOM testing.

---

## Success Criteria

| Criterion ID | Obligation |
|---|---|
| US-017-ac-1 | Given an authenticated user navigates to the Profile page, When the page loads, Then all four fields — Name, Email Address, Registration Date, and Account Status — are displayed within 1 second under normal conditions (F-005-R3). |
| US-017-ac-2 | Given the Profile page is rendered, When the user inspects the page, Then each field is accompanied by a clear, visible label: 'Name', 'Email Address', 'Registration Date', and 'Account Status' (F-005-R4). |
| US-017-ac-3 | Given the Profile page is rendered, When the user inspects all profile fields, Then zero editable controls (text inputs, dropdowns, checkboxes) are present for any profile field (F-005-R1). |
| US-017-ac-4 | Given the Profile page makes an API call, When the request is issued, Then it is executed over HTTPS and the JSON REST API contract is honoured (F-005). |
| US-017-ac-5 | Given the Profile page is rendered, When the data is displayed, Then only the authenticated user's own record is shown — no other user's data is accessible (F-005-R2). |
| US-017-ac-6 | Given the Profile page is rendered, When the user attempts to interact with any profile field, Then no field value can be modified through the UI. |
| IMPACT | Verify all four fields render within 1 second under normal load (F-005-R3) — performance test required |
| IMPACT | Verify zero editable controls (inputs, dropdowns, checkboxes) are present in the rendered DOM (F-005-R1) |
| IMPACT | Verify that a request authenticated as User A cannot retrieve User B's profile record (F-005-R2) — security/integration test required |
| IMPACT | Verify the API call is issued over HTTPS and returns a valid JSON REST response (F-005) |
| IMPACT | Verify field labels are visible and correctly associated with their values (F-005-R4) |
| IMPACT | Verify no field value can be modified through the UI (US-017-ac-6) |

---

## API & Data Contract Touchpoints

- **GET** `/user-profile` (inferred from UserProfileController + createUserProfileRouter) — CAST api_inventory query returned errors; no endpoint path or HTTP method is structurally confirmed.
- **UserProfileResponse DTO** — must carry all four required fields (Name, Email Address, Registration Date, Account Status) for the acceptance criteria to be satisfiable; current field coverage is unconfirmed.
- **UserProfileResult DTO** — must carry all four required fields (Name, Email Address, Registration Date, Account Status) for the acceptance criteria to be satisfiable; current field coverage is unconfirmed.
- **CAST DB-objects query result** — CAST DB-objects query returned six TypeScript application objects (services, DTOs, router) rather than relational tables — no confirmed relational DB table exposure.
- **SQL construction check** — No SQL-in-loop or direct SQL construction was detected in the intra-object structural facts.

---

## Requirement Traceability

| Criterion ID | Status | Components | Gap |
|---|---|---|---|
| US-017-ac-1 | partially_mapped | UserProfileController (2961), DefaultUserProfileService (no ID returned), UserProfileResult (no ID returned) | No CAST transaction data confirms end-to-end latency or that all four fields are present in the response payload. The 1-second performance requirement cannot be verified from structural facts alone — a performance test is required. |
| US-017-ac-2 | partially_mapped | dependency:@radix-ui/react-label@2.1.2, UserProfileResponse (no ID returned) | CAST structural facts do not confirm that label components are actually rendered for each of the four fields in the UI layer. Frontend component structure is not visible in the CAST data provided. |
| US-017-ac-3 | unmapped | (none) | Whether editable controls are absent from the rendered profile page is a frontend/UI concern. No frontend component structural facts (e.g., React component tree, form element usage) were returned by CAST for this object. Cannot be verified from backend controller or DTO facts alone. |
| US-017-ac-4 | partially_mapped | UserProfileController (2961), createUserProfileRouter (2445) | CAST api_inventory query returned errors — no endpoint path, HTTP method, or HTTPS enforcement is structurally confirmed. JSON REST contract shape cannot be verified from available CAST facts. |
| US-017-ac-5 | partially_mapped | UserProfileController (2961), DefaultUserProfileService (no ID returned) | CAST structural facts do not confirm the presence of an authentication guard or ownership filter on the controller or service. No transaction or security-rule evidence is available to verify that cross-user data access is prevented. |
| US-017-ac-6 | unmapped | (none) | Read-only enforcement in the UI (no field value modifiable through the UI) is a frontend rendering concern. No frontend component structural facts were returned by CAST. Cannot be verified from backend controller or DTO facts alone. |

---

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Accepted impact analysis revision**: `1`
- **Accepted impact analysis**: `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`
- **Repository baseline commit**: `810fe751f082b675b4b572e9d05c965676508a6e`
- **Deterministic grounding reference**: `60b54710194b777d`
- **Run ID**: `4d99982b-3368-5a90-8a61-ec949df9f148`
- **Project ID**: `5ce89a73-9683-44c2-bd73-5eeca4371c5b`
- **CAST focus object**: `UserProfileController` (id: 2961, file: `§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts`)
- **Grounding fingerprint**: `60b54710194b777d` (provider: cast, commit: `810fe751f082b675b4b572e9d05c965676508a6e`, ref: main)
