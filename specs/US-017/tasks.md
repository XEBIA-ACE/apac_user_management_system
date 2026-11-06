# Tasks: US-017

> **Design status: DEGRADED** — See plan.md Design Step 9 for full disclosure of CAST evidence gaps. All tasks below must be resolved or explicitly accepted before release.

## Implementation Tasks

- [ ] **T001** [FR-001 / US-017-ac-1 / F-005-R3] Modify `UserProfileController` (CAST id:2961, `§{main_sources}§/New_Prompt_UMS-develop/BACKEND/src/controllers/user-profile.controller.ts`) to ensure the GET handler returns all four required fields — Name, Email Address, Registration Date, and Account Status — in the response payload. Verify that `UserProfileResult` and `UserProfileResponse` DTOs declare all four fields; add any missing field declarations. Evidence: `provider-object:2961`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. ⚠️ NOTE: end-to-end latency (1-second SLA, F-005-R3) cannot be verified from CAST structural facts alone — a dedicated performance test is required.

- [ ] **T002** [FR-005 / US-017-ac-5 / F-005-R2] Modify `UserProfileController` (CAST id:2961) to enforce server-side ownership scoping: apply an authentication guard and a user-identity filter so that the controller/service layer returns only the authenticated user's own record. Coordinate with `DefaultUserProfileService` to ensure the user-scoped query is implemented. Evidence: `provider-object:2961`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. ⚠️ NOTE: CAST structural facts do not confirm the presence of an authentication guard or ownership filter; a security/integration test is required to verify cross-user data access is prevented.

- [ ] **T003** [FR-004 / US-017-ac-4 / F-005] Modify `createUserProfileRouter` (CAST id:2445) to confirm the GET endpoint is registered with the correct HTTP method and JSON Content-Type, and that HTTPS enforcement is applied at the middleware/infrastructure layer. Evidence: `provider-object:2445`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. ⚠️ NOTE: CAST api_inventory query returned errors — the exact endpoint path and HTTP method are not structurally confirmed; verification must be performed at the infrastructure/middleware layer.

- [ ] **T004** [FR-001 / US-017-ac-1] Modify `UserProfileService` (CAST id:1475, Typescript Interface) to ensure the service interface contract exposes all four required fields (Name, Email Address, Registration Date, Account Status) and that `DefaultUserProfileService` implements the updated contract. Coordinate with T001. Evidence: `component:UserProfileService`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`.

- [ ] **T005** [FR-002 / US-017-ac-2 / F-005-R4] Modify `AccountDashboardTemplate_fragment_1` (CAST id:3101, HTML Fragment) to render each of the four profile fields with a clear, visible, programmatically associated label ('Name', 'Email Address', 'Registration Date', 'Account Status'). Use `@radix-ui/react-label@2.1.2` to satisfy F-005-R4 and WCAG label obligations. Evidence: `component:AccountDashboardTemplate_fragment_1`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. ⚠️ NOTE: CAST structural facts do not confirm that label components are currently rendered for each field; frontend component verification is required.

- [ ] **T006** [FR-003 / US-017-ac-3 / F-005-R1 | FR-006 / US-017-ac-6] Modify `AccountDashboardTemplate_fragment_1` (CAST id:3101, HTML Fragment) to ensure all four profile fields are rendered as read-only display elements with zero editable controls (no text inputs, dropdowns, or checkboxes) and no UI affordance that allows field value modification. Evidence: `component:AccountDashboardTemplate_fragment_1`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`. ⚠️ NOTE: no CAST frontend component structural facts were returned; verification requires UI-layer inspection or automated DOM assertion.

- [ ] **T007** [US-017-ac-1 / session context] Verify `getSessionEmail` (CAST id:2942, Typescript Function) is invoked correctly within the AccountDetails pivot to supply the authenticated user's session identity to the profile data fetch. No changes expected unless the session identity is not being passed to the ownership filter added in T002. Evidence: `component:getSessionEmail`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`.

- [ ] **T008** [US-017-ac-5 / session context] Verify `useCurrentUser` (CAST id:2948, Typescript Function) is invoked correctly within the AccountDetails pivot and that the resolved user identity is propagated to the ownership-scoping logic added in T002. No changes expected unless the current-user hook is not wired to the authentication guard. Evidence: `component:useCurrentUser`, `60b54710194b777d`, `sha256:a24217c1af8b05f87b9d7085998c56d96d4582ec0f8dc6a8fb3a8bff50f7dac1`.

---

## Verification Tasks

- [ ] **T009** [Verify US-017-ac-1] Given an authenticated user navigates to the Profile page, When the page loads, Then all four fields — Name, Email Address, Registration Date, and Account Status — are displayed within 1 second under normal conditions (F-005-R3). Test type: characterization. Required before: release. Environment: ci. Obligation ID: `4d99982b-3368-5a90-8a61-ec949df9f148:test:characterization:US-017-ac-1`.

- [ ] **T010** [Verify US-017-ac-2] Given the Profile page is rendered, When the user inspects the page, Then each field is accompanied by a clear, visible label: 'Name', 'Email Address', 'Registration Date', and 'Account Status' (F-005-R4). Test type: characterization. Required before: release. Environment: ci. Obligation ID: `4d99982b-3368-5a90-8a61-ec949df9f148:test:characterization:US-017-ac-2`.

- [ ] **T011** [Verify US-017-ac-3] Given the Profile page is rendered, When the user inspects all profile fields, Then zero editable controls (text inputs, dropdowns, checkboxes) are present for any profile field (F-005-R1). Test type: characterization. Required before: release. Environment: ci. Obligation ID: `4d99982b-3368-5a90-8a61-ec949df9f148:test:characterization:US-017-ac-3`.

- [ ] **T012** [Verify US-017-ac-4] Given the Profile page makes an API call, When the request is issued, Then it is executed over HTTPS and the JSON REST API contract is honoured (F-005). Test type: characterization. Required before: release. Environment: ci. Obligation ID: `4d99982b-3368-5a90-8a61-ec949df9f148:test:characterization:US-017-ac-4`.

- [ ] **T013** [Verify US-017-ac-5] Given the Profile page is rendered, When the data is displayed, Then only the authenticated user's own record is shown — no other user's data is accessible (F-005-R2). Test type: characterization. Required before: release. Environment: ci. Obligation ID: `4d99982b-3368-5a90-8a61-ec949df9f148:test:characterization:US-017-ac-5`.

- [ ] **T014** [Verify US-017-ac-6] Given the Profile page is rendered, When the user attempts to interact with any profile field, Then no field value can be modified through the UI. Test type: characterization. Required before: release. Environment: ci. Obligation ID: `4d99982b-3368-5a90-8a61-ec949df9f148:test:characterization:US-017-ac-6`.

- [ ] **T015** [Verify IMPACT / F-005-R3] Verify all four fields render within 1 second under normal load — performance test required.

- [ ] **T016** [Verify IMPACT / F-005-R1] Verify zero editable controls (inputs, dropdowns, checkboxes) are present in the rendered DOM.

- [ ] **T017** [Verify IMPACT / F-005-R2] Verify that a request authenticated as User A cannot retrieve User B's profile record — security/integration test required.

- [ ] **T018** [Verify IMPACT / F-005] Verify the API call is issued over HTTPS and returns a valid JSON REST response.

- [ ] **T019** [Verify IMPACT / F-005-R4] Verify field labels are visible and correctly associated with their values.

- [ ] **T020** [Verify IMPACT / US-017-ac-6] Verify no field value can be modified through the UI.
