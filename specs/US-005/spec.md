# Feature Specification: US-005

## Story
**US-005 — View Account Details on Profile Page**

As an Authenticated User, I want to view my account details (Name, Email Address, Registration Date, and Account Status) on my Profile page, so that I can confirm my stored account information at a glance without contacting support. The Profile page must render a clearly labelled read-only section containing all four account fields sourced from SQLite for the authenticated session identity, with no editable controls present, and must respond within 1 second under normal conditions.

## User Scenarios & Acceptance Criteria

- **US-005-ac-1**: Given an authenticated user navigates to the Profile page, When the page loads, Then the 'User Details (Read Only)' section is displayed with the heading 'User Details (Read Only)'.
- **US-005-ac-2**: Given the 'User Details (Read Only)' section is rendered, When the user views the section, Then Name, Email Address, Registration Date, and Account Status are all displayed with values sourced from SQLite.
- **US-005-ac-3**: Given the 'User Details (Read Only)' section is rendered, When the user inspects the section, Then no input fields, edit buttons, or save controls are present for any of the four account fields.
- **US-005-ac-4**: Given an authenticated user loads the Profile page under normal conditions, When the page response is measured, Then the full page response is delivered within 1 second (≤1s SLA).
- **US-005-ac-5**: Given the Profile page is loaded, When the four fields are displayed, Then each field value matches the corresponding record stored in SQLite for the authenticated user's session identity.

## Functional Requirements

- **FR-001 [US-005-ac-1]**: When an authenticated user navigates to the Profile page and the page loads, the page must render a section with the exact heading text 'User Details (Read Only)'. This heading must be implemented as a semantic heading element to support screen readers (per accessibility obligations). The backend entry point for this page is UserProfileController (CAST object 2961), wired via createUserProfileRouter (CAST object 2445); however, the frontend component responsible for rendering the heading is not confirmed in the CAST object inventory and must be verified during implementation.
- **FR-002 [US-005-ac-2]**: The 'User Details (Read Only)' section must display all four account fields — Name, Email Address, Registration Date, and Account Status — with values sourced from SQLite via the service layer (DefaultUserProfileService / UserProfileService). The UserProfileResponse and UserProfileResult data-transfer types must include all four fields. Note: the exact SQLite table name(s) and column bindings were not resolved by CAST structural analysis; the implementation must confirm and document the precise table/column mapping for each field.
- **FR-003 [US-005-ac-3]**: The 'User Details (Read Only)' section must not contain any input fields, edit buttons, or save controls for any of the four account fields (Name, Email Address, Registration Date, Account Status). The read-only constraint must be enforced both in the frontend rendering and server-side within UserProfileController, which must not expose any mutation endpoint for these fields. Note: no frontend template or component objects were present in the CAST inventory to structurally confirm the absence of writable controls; this must be verified by UI inspection and test.
- **FR-004 [US-005-ac-4]**: Under normal load conditions, the full Profile page response must be delivered to the authenticated user within 1 second (≤1s SLA). This is a runtime performance criterion; no CAST structural or transaction timing evidence is available to pre-validate this threshold. A performance test must be executed to confirm compliance. Any caching behaviour in DefaultUserProfileService that could affect data freshness or latency must be documented and assessed against this SLA.
- **FR-005 [US-005-ac-5]**: Each of the four displayed field values (Name, Email Address, Registration Date, Account Status) must exactly match the corresponding record stored in SQLite for the authenticated user's session identity. UserProfileController must use the session identity (resolved via getSessionEmail, CAST object 2942, and useCurrentUser, CAST object 2948) as the query predicate to scope the data retrieval to the correct user record. Note: CAST did not confirm the SQLite table or the session-identity predicate from structural facts alone; the implementation must verify that no cross-user data leakage is possible (per security obligations).

## Accessibility Obligations

- The 'User Details (Read Only)' section heading must be rendered as a semantic heading element to support screen readers.
- All four field labels and values must be associated correctly (e.g., via label/value pairs or definition lists) for assistive technology compatibility.

## Security Obligations

- The Profile page must only return data for the authenticated user's own session identity; no cross-user data leakage must be possible.
- Account Status and Registration Date must not be modifiable via this endpoint; the controller must enforce read-only semantics server-side.
- Session authentication must be validated before UserProfileController serves any response.
- Validate credential and personal-data handling against the Jira requirement.
- Validate credential and personal-data handling against the story's acceptance criteria.

## Success Criteria

- **US-005-ac-1**: Given an authenticated user navigates to the Profile page, When the page loads, Then the 'User Details (Read Only)' section is displayed with the heading 'User Details (Read Only)'.
- **US-005-ac-2**: Given the 'User Details (Read Only)' section is rendered, When the user views the section, Then Name, Email Address, Registration Date, and Account Status are all displayed with values sourced from SQLite.
- **US-005-ac-3**: Given the 'User Details (Read Only)' section is rendered, When the user inspects the section, Then no input fields, edit buttons, or save controls are present for any of the four account fields.
- **US-005-ac-4**: Given an authenticated user loads the Profile page under normal conditions, When the page response is measured, Then the full page response is delivered within 1 second (≤1s SLA).
- **US-005-ac-5**: Given the Profile page is loaded, When the four fields are displayed, Then each field value matches the corresponding record stored in SQLite for the authenticated user's session identity.
- **IMPACT**: Unit test: UserProfileController returns all four fields (Name, Email Address, Registration Date, Account Status) for a valid authenticated session.
- **IMPACT**: Unit test: UserProfileController returns no writable controls or mutation endpoints.
- **IMPACT**: Integration test: end-to-end Profile page load retrieves correct field values from SQLite for the authenticated user.
- **IMPACT**: Performance test: Profile page response time is ≤1 second under normal load conditions.
- **IMPACT**: Negative test: unauthenticated requests to the profile endpoint are rejected.
- **IMPACT**: Regression test: createUserProfileRouter correctly registers the UserProfileController route after any controller changes.

## Requirement Coverage Gaps (from Impact Analysis)

| Criterion | Status | Gap |
|-----------|--------|-----|
| US-005-ac-1 | partially_mapped | CAST structural facts confirm the controller and its router entry point exist, but no frontend component rendering the 'User Details (Read Only)' heading is present in the CAST object inventory. The heading rendering is a UI concern not evidenced by backend structural facts. |
| US-005-ac-2 | partially_mapped | CAST did not resolve SQLite table names or column bindings; it cannot be confirmed from structural facts alone that all four fields (Name, Email Address, Registration Date, Account Status) are present and sourced from SQLite. No transaction call graphs were available to trace the full data path. |
| US-005-ac-3 | unmapped | This criterion requires evidence that no input fields, edit buttons, or save controls are rendered. CAST structural analysis covers backend TypeScript objects only; no frontend component or template objects are present in the measured inventory to confirm the absence of writable UI controls. |
| US-005-ac-4 | unmapped | The ≤1s SLA is a runtime performance criterion. CAST structural facts include no performance measurements, transaction timing data, or load test results. Zero transactions were measured through UserProfileController, so no latency evidence exists in the CAST data. |
| US-005-ac-5 | partially_mapped | CAST did not resolve the SQLite table or confirm that session identity is used as the query predicate. No transaction call graphs or SQL statements were available to verify that field values are scoped to the authenticated user's record. |

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