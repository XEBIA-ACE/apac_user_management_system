# Tasks: US-005

> All tasks implement against accepted impact analysis revision 1 (`sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9`).
> Unresolved implementation-readiness items must be resolved or explicitly accepted before any task is marked complete.

## Implementation Tasks

- [ ] **T001** `[FR-001 / US-005-ac-1]` Modify `UserProfileController` (CAST object 2961, file: `§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts`): ensure the `accountDetails` handler returns all four required fields (Name, Email Address, Registration Date, Account Status) in the response payload. Confirm the exact HTTP method and path registered by `createUserProfileRouter` (CAST object 2445) and document it. The frontend heading 'User Details (Read Only)' is not confirmed in the CAST inventory; the implementation team must locate and verify the frontend component responsible for rendering this heading.

- [ ] **T002** `[FR-001 / US-005-ac-1]` Modify `AccountDashboardTemplate_fragment_1` (CAST object 3101, HTML Fragment): verify that the rendered section carries the exact heading text 'User Details (Read Only)' implemented as a semantic heading element (e.g., `<h2>`) to satisfy accessibility obligations. This step is partially grounded — no frontend component object was present in the CAST inventory; the team must confirm the file path and component identity before modifying.

- [ ] **T003** `[FR-002 / US-005-ac-2]` Modify `UserProfileService` (CAST interface 1475) and its implementation `DefaultUserProfileService` (CAST object 3010): confirm that the service interface exposes all four fields (Name, Email Address, Registration Date, Account Status) and that `DefaultUserProfileService` retrieves them from the correct SQLite table(s). Document the precise SQLite table name(s) and column bindings for each field, as these were not resolved by CAST structural analysis.

- [ ] **T004** `[FR-002 / US-005-ac-2]` Modify `UserProfileController` (CAST object 2961): ensure `UserProfileResponse` (CAST interface 1559) and `UserProfileResult` (CAST interface 1503) data-transfer types include all four required fields. Validate that the controller's response serialisation projects all four fields to the frontend without omission.

- [ ] **T005** `[FR-003 / US-005-ac-3]` Modify `AccountDashboardTemplate_fragment_1` (CAST object 3101): confirm by UI inspection and test that the rendered section contains no input fields, edit buttons, or save controls for any of the four account fields. No frontend template objects were present in the CAST inventory to structurally confirm this; the team must perform a manual UI audit and add a test assertion.

- [ ] **T006** `[FR-003 / US-005-ac-3]` Modify `UserProfileController` (CAST object 2961): enforce read-only semantics server-side — the controller must not expose any mutation endpoint (POST/PUT/PATCH/DELETE) for Name, Email Address, Registration Date, or Account Status. Confirm via route inspection of `createUserProfileRouter` (CAST object 2445) that no writable routes are registered for these fields.

- [ ] **T007** `[FR-004 / US-005-ac-4]` Modify `UserProfileController` (CAST object 2961) and `DefaultUserProfileService` (CAST object 3010): assess and document any caching behaviour in `DefaultUserProfileService` that could affect data freshness or latency. Instrument the end-to-end Profile page response path and execute a performance test to confirm the ≤1s SLA under normal load. No CAST transaction timing evidence is available; this SLA can only be validated at runtime.

- [ ] **T008** `[FR-005 / US-005-ac-5]` Modify `UserProfileController` (CAST object 2961): verify that the `accountDetails` handler uses `getSessionEmail` (CAST object 2942) and `useCurrentUser` (CAST object 2948) to resolve the authenticated session identity and passes it as the query predicate to `DefaultUserProfileService`, ensuring all four field values are scoped to the correct user record. Confirm no cross-user data leakage is possible (security obligation). CAST did not confirm the session-identity predicate from structural facts alone; the implementation must include a negative test for cross-user isolation.

- [ ] **T009** `[FR-005 / US-005-ac-5]` Modify `createUserProfileRouter` (CAST object 2445): confirm that session authentication middleware is applied before `UserProfileController` handles any request, so that unauthenticated requests are rejected prior to any data retrieval.

- [ ] **T010** `[Accessibility]` Modify `AccountDashboardTemplate_fragment_1` (CAST object 3101): ensure all four field labels and values are associated correctly for assistive technology (e.g., via `<dl>`/`<dt>`/`<dd>` definition list or explicit label/value pairs) per the accessibility obligations carried forward from impact analysis.

## Verification Tasks

- [ ] **T011** `[Verify US-005-ac-1]` Given an authenticated user navigates to the Profile page, When the page loads, Then the 'User Details (Read Only)' section is displayed with the heading 'User Details (Read Only)'. — Obligation ID: `3abdaac4-276f-52ab-ac62-44f62982808f:test:characterization:US-005-ac-1` — required before release, environment: ci

- [ ] **T012** `[Verify US-005-ac-2]` Given the 'User Details (Read Only)' section is rendered, When the user views the section, Then Name, Email Address, Registration Date, and Account Status are all displayed with values sourced from SQLite. — Obligation ID: `3abdaac4-276f-52ab-ac62-44f62982808f:test:characterization:US-005-ac-2` — required before release, environment: ci

- [ ] **T013** `[Verify US-005-ac-3]` Given the 'User Details (Read Only)' section is rendered, When the user inspects the section, Then no input fields, edit buttons, or save controls are present for any of the four account fields. — Obligation ID: `3abdaac4-276f-52ab-ac62-44f62982808f:test:characterization:US-005-ac-3` — required before release, environment: ci

- [ ] **T014** `[Verify US-005-ac-4]` Given an authenticated user loads the Profile page under normal conditions, When the page response is measured, Then the full page response is delivered within 1 second (≤1s SLA). — Obligation ID: `3abdaac4-276f-52ab-ac62-44f62982808f:test:characterization:US-005-ac-4` — required before release, environment: ci

- [ ] **T015** `[Verify US-005-ac-5]` Given the Profile page is loaded, When the four fields are displayed, Then each field value matches the corresponding record stored in SQLite for the authenticated user's session identity. — Obligation ID: `3abdaac4-276f-52ab-ac62-44f62982808f:test:characterization:US-005-ac-5` — required before release, environment: ci

- [ ] **T016** `[Verify IMPACT — unit]` Unit test: UserProfileController returns all four fields (Name, Email Address, Registration Date, Account Status) for a valid authenticated session.

- [ ] **T017** `[Verify IMPACT — unit]` Unit test: UserProfileController returns no writable controls or mutation endpoints.

- [ ] **T018** `[Verify IMPACT — integration]` Integration test: end-to-end Profile page load retrieves correct field values from SQLite for the authenticated user.

- [ ] **T019** `[Verify IMPACT — performance]` Performance test: Profile page response time is ≤1 second under normal load conditions.

- [ ] **T020** `[Verify IMPACT — negative]` Negative test: unauthenticated requests to the profile endpoint are rejected.

- [ ] **T021** `[Verify IMPACT — regression]` Regression test: createUserProfileRouter correctly registers the UserProfileController route after any controller changes.

## Traceability Matrix

| Criterion | Functional Spec Ref | Accepted Impact Hash |
|-----------|--------------------|-----------------------|
| US-005-ac-1 | spec_functional | `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9` |
| US-005-ac-2 | spec_functional | `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9` |
| US-005-ac-3 | spec_functional | `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9` |
| US-005-ac-4 | spec_functional | `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9` |
| US-005-ac-5 | spec_functional | `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9` |

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Accepted impact analysis revision**: `1`
- **Accepted impact analysis**: `sha256:05d2a404b2a5a0656af2812aa4be533ee8d54cb694ec71f0855e70928a9228c9`
- **Repository baseline commit**: `810fe751f082b675b4b572e9d05c965676508a6e`
- **Deterministic grounding reference**: `60b54710194b777d`
- **Run ID**: `3abdaac4-276f-52ab-ac62-44f62982808f`