# Implementation Plan: US-005

## Technical Context

All implementation decisions must be grounded against the following evidence references. Unresolved references must be confirmed before code is merged.

| Reference | Type | Notes |
|-----------|------|-------|
| `determinism-snapshot:60b54710194b777d` | Codebase grounding snapshot | Authoritative baseline |
| `provider-object:2961` | UserProfileController (Typescript Class) | Focus object; file: `§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts` |
| `provider-object:2445` | createUserProfileRouter (Typescript Function) | Sole Level 1 caller / router entry point |
| `provider-object:3101` | AccountDashboardTemplate_fragment_1 (HTML Fragment) | Frontend fragment called by accountDetails handler |
| `provider-object:2942` | getSessionEmail (Typescript Function) | Session identity resolver |
| `provider-object:2948` | useCurrentUser (Typescript Function) | Session identity resolver |
| `provider-object:3010` | DefaultUserProfileService (Typescript Class) | Service layer implementation |
| `provider-object:1475` | UserProfileService (Typescript Interface) | Service layer interface |
| `provider-object:1559` | UserProfileResponse (Typescript Interface) | Data-transfer type |
| `provider-object:1503` | UserProfileResult (Typescript Interface) | Result type |
| `component:AccountDashboardTemplate_fragment_1` | HTML Fragment | Unresolved reference |
| `component:UserProfileController` | Typescript Class | Unresolved reference |
| `component:UserProfileService` | Typescript Interface | Unresolved reference |
| `component:createUserProfileRouter` | Typescript Function | Unresolved reference |
| `component:getSessionEmail` | Typescript Function | Unresolved reference |
| `component:useCurrentUser` | Typescript Function | Unresolved reference |
| `component:§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts` | Source file | Unresolved reference |
| `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9` | Accepted impact analysis (revision 1) | Implement only against this revision |

## Measured Blast Radius

- **Direct callers**: 1 (createUserProfileRouter)
- **Transitive callers**: 0 (depth beyond createUserProfileRouter unconfirmed — may reflect incomplete graph traversal)
- **Callees**: 4 (AccountDashboardTemplate_fragment_1, getSessionEmail, useCurrentUser, UserProfileService)
- **Transactions**: 3 (AccountDashboardTemplate, AccountDashboardTemplate.tsx, AccountDashboardTemplate_fragment_1)
- **Data objects**: 6 (DefaultUserProfileService, UserProfileController, UserProfileResponse, UserProfileResult, UserProfileService, createUserProfileRouter)

## Design Steps

1. **[FR-001 / US-005-ac-1]** Modify `UserProfileController` (CAST object 2961, file: `§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts`): ensure the `accountDetails` handler returns all four required fields (Name, Email Address, Registration Date, Account Status) in the response payload. Confirm the exact HTTP method and path registered by `createUserProfileRouter` (CAST object 2445) and document it. The frontend heading 'User Details (Read Only)' is not confirmed in the CAST inventory; the implementation team must locate and verify the frontend component responsible for rendering this heading.

2. **[FR-001 / US-005-ac-1]** Modify `AccountDashboardTemplate_fragment_1` (CAST object 3101, HTML Fragment): verify that the rendered section carries the exact heading text 'User Details (Read Only)' implemented as a semantic heading element (e.g., `<h2>`) to satisfy accessibility obligations. This step is partially grounded — no frontend component object was present in the CAST inventory; the team must confirm the file path and component identity before modifying.

3. **[FR-002 / US-005-ac-2]** Modify `UserProfileService` (CAST interface 1475) and its implementation `DefaultUserProfileService` (CAST object 3010): confirm that the service interface exposes all four fields (Name, Email Address, Registration Date, Account Status) and that `DefaultUserProfileService` retrieves them from the correct SQLite table(s). Document the precise SQLite table name(s) and column bindings for each field, as these were not resolved by CAST structural analysis.

4. **[FR-002 / US-005-ac-2]** Modify `UserProfileController` (CAST object 2961): ensure `UserProfileResponse` (CAST interface 1559) and `UserProfileResult` (CAST interface 1503) data-transfer types include all four required fields. Validate that the controller's response serialisation projects all four fields to the frontend without omission.

5. **[FR-003 / US-005-ac-3]** Modify `AccountDashboardTemplate_fragment_1` (CAST object 3101): confirm by UI inspection and test that the rendered section contains no input fields, edit buttons, or save controls for any of the four account fields. No frontend template objects were present in the CAST inventory to structurally confirm this; the team must perform a manual UI audit and add a test assertion.

6. **[FR-003 / US-005-ac-3]** Modify `UserProfileController` (CAST object 2961): enforce read-only semantics server-side — the controller must not expose any mutation endpoint (POST/PUT/PATCH/DELETE) for Name, Email Address, Registration Date, or Account Status. Confirm via route inspection of `createUserProfileRouter` (CAST object 2445) that no writable routes are registered for these fields.

7. **[FR-004 / US-005-ac-4]** Modify `UserProfileController` (CAST object 2961) and `DefaultUserProfileService` (CAST object 3010): assess and document any caching behaviour in `DefaultUserProfileService` that could affect data freshness or latency. Instrument the end-to-end Profile page response path and execute a performance test to confirm the ≤1s SLA under normal load. No CAST transaction timing evidence is available; this SLA can only be validated at runtime.

8. **[FR-005 / US-005-ac-5]** Modify `UserProfileController` (CAST object 2961): verify that the `accountDetails` handler uses `getSessionEmail` (CAST object 2942) and `useCurrentUser` (CAST object 2948) to resolve the authenticated session identity and passes it as the query predicate to `DefaultUserProfileService`, ensuring all four field values are scoped to the correct user record. Confirm no cross-user data leakage is possible (security obligation). CAST did not confirm the session-identity predicate from structural facts alone; the implementation must include a negative test for cross-user isolation.

9. **[FR-005 / US-005-ac-5]** Modify `createUserProfileRouter` (CAST object 2445): confirm that session authentication middleware is applied before `UserProfileController` handles any request, so that unauthenticated requests are rejected prior to any data retrieval.

10. **[Accessibility]** Modify `AccountDashboardTemplate_fragment_1` (CAST object 3101): ensure all four field labels and values are associated correctly for assistive technology (e.g., via `<dl>`/`<dt>`/`<dd>` definition list or explicit label/value pairs) per the accessibility obligations carried forward from impact analysis.

11. **[Test obligations]** Add unit tests for `UserProfileController` (CAST object 2961): (a) returns all four fields for a valid authenticated session; (b) rejects unauthenticated requests; (c) exposes no mutation endpoints. Add integration test for end-to-end Profile page load from SQLite. Add performance test for ≤1s SLA. Add regression test that `createUserProfileRouter` correctly registers the controller route after any controller changes.

## Contract Changes

`contract_change_required: true` — the following touchpoints require contract review:

- **API**: `unknown — api_inventory query returned errors; no endpoint paths confirmed by CAST` (method: unknown) — change required
- **Data**: Six database-layer objects (DefaultUserProfileService, UserProfileController, UserProfileResponse, UserProfileResult, UserProfileService, createUserProfileRouter) were returned by CAST's DB-object query; their exact SQLite table bindings were not resolved (IDs unknown), so the precise SQLite table(s) backing the four account fields cannot be confirmed from CAST data alone. — change required
- **Data**: The enhancement requires read access to at least one SQLite table containing user Name, Email Address, Registration Date, and Account Status columns for the authenticated session identity. — change required

## Security and Quality Obligations

- The Profile page must only return data for the authenticated user's own session identity; no cross-user data leakage must be possible.
- Account Status and Registration Date must not be modifiable via this endpoint; the controller must enforce read-only semantics server-side.
- Session authentication must be validated before UserProfileController serves any response.
- Validate credential and personal-data handling against the Jira requirement.
- Validate credential and personal-data handling against the story's acceptance criteria.
- Preserve the availability, reliability, and observability constraints grounded by `60b54710194b777d`.

## Implementation-Readiness Items (must be resolved or explicitly accepted before merge)

- API endpoint paths for UserProfileController are unconfirmed — api_inventory returned errors.
- Are there any frontend components (e.g., React page components) that consume the UserProfileController endpoint, and are they within CAST scope?
- Does DefaultUserProfileService perform any caching that could affect the ≤1s SLA or data freshness?
- Requirement traceability incomplete for US-005-ac-1, US-005-ac-2, US-005-ac-3, US-005-ac-4, US-005-ac-5.
- SQLite table names backing the four account fields are unresolved — CAST DB-object IDs were all 'unknown'.
- The API endpoint path(s) served by UserProfileController could not be confirmed because the api_inventory query returned errors; endpoint paths are assumed to exist but are unverified.
- The constructor intra-object fact (CAST ID 1056) indicates standard dependency injection; no SQL-in-loop or loop anomalies were flagged.
- The six objects returned under 'Database objects accessed' are CAST-classified service/type objects, not raw SQLite tables; actual SQLite table names were not resolved.
- Transaction call graphs are unavailable — transactions_using_object and transaction_details both returned empty.
- Transitive caller depth beyond createUserProfileRouter is unconfirmed — 0 Level 2+ callers returned, but this may reflect incomplete graph traversal.
- What is the exact HTTP method and path of the profile endpoint registered by createUserProfileRouter?
- Which SQLite table(s) and column names store Name, Email Address, Registration Date, and Account Status for the user profile?
- Zero CAST violations on UserProfileController indicate no currently measured quality debt on the focus object.

## Evidence Gaps (from Impact Analysis)

- API endpoint paths for UserProfileController are unconfirmed — api_inventory returned errors.
- SQLite table names backing the four account fields are unresolved — CAST DB-object IDs were all 'unknown'.
- Transaction call graphs are unavailable — transactions_using_object and transaction_details both returned empty.
- Transitive caller depth beyond createUserProfileRouter is unconfirmed — 0 Level 2+ callers returned, but this may reflect incomplete graph traversal.

## Verification Plan

| Criterion | Type | Assertion |
|-----------|------|-----------|
| US-005-ac-1 | characterization | Given an authenticated user navigates to the Profile page, When the page loads, Then the 'User Details (Read Only)' section is displayed with the heading 'User Details (Read Only)'. |
| US-005-ac-2 | characterization | Given the 'User Details (Read Only)' section is rendered, When the user views the section, Then Name, Email Address, Registration Date, and Account Status are all displayed with values sourced from SQLite. |
| US-005-ac-3 | characterization | Given the 'User Details (Read Only)' section is rendered, When the user inspects the section, Then no input fields, edit buttons, or save controls are present for any of the four account fields. |
| US-005-ac-4 | characterization | Given an authenticated user loads the Profile page under normal conditions, When the page response is measured, Then the full page response is delivered within 1 second (≤1s SLA). |
| US-005-ac-5 | characterization | Given the Profile page is loaded, When the four fields are displayed, Then each field value matches the corresponding record stored in SQLite for the authenticated user's session identity. |
| IMPACT | unit | UserProfileController returns all four fields (Name, Email Address, Registration Date, Account Status) for a valid authenticated session. |
| IMPACT | unit | UserProfileController returns no writable controls or mutation endpoints. |
| IMPACT | integration | End-to-end Profile page load retrieves correct field values from SQLite for the authenticated user. |
| IMPACT | performance | Profile page response time is ≤1 second under normal load conditions. |
| IMPACT | negative | Unauthenticated requests to the profile endpoint are rejected. |
| IMPACT | regression | createUserProfileRouter correctly registers the UserProfileController route after any controller changes. |

All test obligations are required before release and must run in the `ci` environment.

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Accepted impact analysis revision**: `1`
- **Accepted impact analysis**: `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9`
- **Repository baseline commit**: `810fe751f082b675b4b572e9d05c965676508a6e`
- **Repository**: `https://github.com/XEBIA-ACE/apac_user_management_system` (branch: `main`)
- **Deterministic grounding reference**: `60b54710194b777d`
- **Run ID**: `3abdaac4-276f-52ab-ac62-44f62982808f`
- **Project ID**: `5ce89a73-9683-44c2-bd73-5eeca4371c5b`
- **Generation mode**: `enhancement`
- **Provider**: `cast`