# Tasks: a9364419-c381-54f0-93da-2b9e5006188c

> **Story**: Rewrite Modernisation Objective to Match Confirmed Technology Stack
> **Effort estimate**: S
> **Dependency**: Story 66c13290-8591-5dce-968e-98f706f6a88e (S1) must be completed before this story begins.

## Implementation Tasks

- [ ] **T001** [FR-001 / S2-AC1] Gate check — Confirm S1 completion before any work begins. Retrieve the S1 outcome artefact from the project's authoritative planning store. Record in writing: (a) the confirmed stack identity of the scanned User_Management repository (https://github.com/XEBIA-ACE/apac_user_management_system, commit 810fe751f082b675b4b572e9d05c965676508a6e, ref main) and (b) a definitive answer on whether a separate Java/Spring Boot service exists. This written record becomes the documented input basis for all subsequent steps. Do not proceed to T002/T003 until this record exists.

- [ ] **T002** [FR-002 / S2-AC2] *(Conditional: execute only if S1 confirms Node.js/TypeScript is the sole target)* Draft a revised objective statement that: (a) names Node.js/TypeScript as the target runtime; (b) explicitly references Express 4.x, better-sqlite3, ioredis, yamljs, and cors as the upgrade surface (Express 4.x → 5.x, yamljs → js-yaml, cors replacement, SQLite → PostgreSQL if scaling required, containerisation, CI/CD); and (c) contains no reference to Spring Boot 3.x or Java 17/21. Store the draft in the project's authoritative planning artefact.

- [ ] **T003** [FR-003 / S2-AC3] *(Conditional: execute only if S1 confirms a separate Java/Spring Boot service exists)* Draft a revised objective statement that: (a) explicitly names that Java service as the Spring Boot upgrade target; and (b) scopes the Node.js/TypeScript User_Management service separately, ensuring the two services are not conflated in any planning artefact. Store the draft in the project's authoritative planning artefact.

- [ ] **T004** [FR-005 / S2-AC5] Create an open-risk register entry alongside the drafted revised objective that explicitly lists the three accepted evidence limitations: (a) the CAST analysis snapshot may be stale (fingerprint 60b54710194b777d); (b) no commit verification was performed against the live repository; and (c) no migration evidence is present in the snapshot. These must be characterised as open risks, not as evidence of absence. Attach this risk record to or alongside the updated charter.

- [ ] **T005** [FR-004 / S2-AC4] Present the drafted revised objective (from T002 or T003) together with the open-risk record (from T004) to a named project sponsor or product owner for review. Obtain sign-off in a durable, attributable written form (email, Confluence comment, Jira approval, or equivalent). The sign-off record must identify the approver's name and the date of approval. Do not proceed to T006 until this record exists.

- [ ] **T006** [FR-006 / S2-AC6] Once sign-off is confirmed, update the project's authoritative planning artefact (Confluence page, Jira epic description, or project charter document) so that: (a) the approved revised objective is directly accessible to all project stakeholders; and (b) the superseded Spring Boot/Java 17-21 objective is either removed from the artefact or explicitly marked as superseded with a reference to the replacement, leaving no ambiguity about which objective is current.

## Verification Tasks

- [ ] **T007** Verify S2-AC1: Given S1 has been completed and its outcome is available, when this story begins, then the S1 outcome (confirmed stack identity and whether a Java service exists) is documented as the input basis for the revised objective.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC1`

- [ ] **T008** Verify S2-AC2: Given the S1 outcome confirms the Node.js/TypeScript service is the correct and sole target, when the revised objective is written, then it names Node.js/TypeScript as the target runtime, references Express 4.x and the other confirmed dependencies (better-sqlite3, ioredis, yamljs, cors) as the upgrade surface, and contains no reference to Spring Boot 3.x or Java 17/21.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC2`

- [ ] **T009** Verify S2-AC3: Given the S1 outcome confirms a separate Java/Spring Boot service exists, when the revised objective is written, then it explicitly names that Java service as the Spring Boot upgrade target and scopes the Node.js/TypeScript service separately, so the two are not conflated.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC3`

- [ ] **T010** Verify S2-AC4: Given the revised objective has been drafted, when it is presented for approval, then a named project sponsor or product owner has reviewed and signed off on it in writing (email, Confluence comment, Jira approval, or equivalent).
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC4`

- [ ] **T011** Verify S2-AC5: Given the accepted evidence limitations (stale analysis, no commit verification, no migration evidence), when the revised objective is finalised, then those limitations are recorded as open risks in or alongside the updated charter, not treated as evidence of absence.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC5`

- [ ] **T012** Verify S2-AC6: Given the revised objective is approved, when it is stored, then it is accessible in the project's authoritative planning artefact (e.g. Confluence page, Jira epic description, or project charter document) and the old Spring Boot/Java 17-21 objective is either removed or explicitly superseded.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC6`

- [ ] **T013** Verify IMPACT: Verify acceptance criterion: Given S1 has been completed and its outcome is available, when this story begins, then the S1 outcome (confirmed stack identity and whether a Java service exists) is documented as the input basis for the revised objective.

- [ ] **T014** Verify IMPACT: Verify acceptance criterion: Given the S1 outcome confirms the Node.js/TypeScript service is the correct and sole target, when the revised objective is written, then it names Node.js/TypeScript as the target runtime, references Express 4.x and the other confirmed dependencies (better-sqlite3, ioredis, yamljs, cors) as the upgrade surface, and contains no reference to Spring Boot 3.x or Java 17/21.

- [ ] **T015** Verify IMPACT: Verify acceptance criterion: Given the S1 outcome confirms a separate Java/Spring Boot service exists, when the revised objective is written, then it explicitly names that Java service as the Spring Boot upgrade target and scopes the Node.js/TypeScript service separately, so the two are not conflated.

- [ ] **T016** Verify IMPACT: Verify acceptance criterion: Given the revised objective has been drafted, when it is presented for approval, then a named project sponsor or product owner has reviewed and signed off on it in writing (email, Confluence comment, Jira approval, or equivalent).

- [ ] **T017** Verify IMPACT: Verify acceptance criterion: Given the accepted evidence limitations (stale analysis, no commit verification, no migration evidence), when the revised objective is finalised, then those limitations are recorded as open risks in or alongside the updated charter, not treated as evidence of absence.

- [ ] **T018** Verify IMPACT: Verify acceptance criterion: Given the revised objective is approved, when it is stored, then it is accessible in the project's authoritative planning artefact (e.g. Confluence page, Jira epic description, or project charter document) and the old Spring Boot/Java 17-21 objective is either removed or explicitly superseded.

## Open Implementation-Readiness Items

The following items from the impact analysis and API impact assessment remain unresolved and must be explicitly accepted or resolved before implementation is considered complete:

1. API inventory query returned errors ('Invalid arguments for function', 'NoneType' error) — no API endpoint data is available for this object.
2. Candidate verification found the selected focus object (`IdentityVerificationCard`) implausible for this requirement — no code object maps to this governance/documentation deliverable.
3. No backend dependency modules (Express, better-sqlite3, ioredis, yamljs, cors, bcrypt) appear in the CAST application-level inventory — backend stack confirmation relies on story description references (F77, F47, F43).
4. No database objects were returned for the focus object.
5. No named sponsor or product owner is identified in the CAST facts or story metadata.
6. No pre-existing implementation was found for this requirement; scope is derived solely from the requirement text.
7. No-match classification: this is a net-new governance/documentation deliverable, not an existing code construct.
8. S1 outcome artefact is not present — Steps T002 (S2-AC2) and T003 (S2-AC3) remain conditional branches pending S1 resolution.
9. Searched 5 term(s) against Cast (projectCharter, modernisationObjective, technologyStack, upgradeTarget, repositoryIdentity); none resolved to an existing code object.
10. Transaction call graphs returned empty (CAST MCP returned no data).
11. Which components will need to be built to implement each acceptance criterion, since no existing implementation was found?
12. Architecture context is degraded (missing_core: api_contracts, source: determinism_cast) — no API contract data is available.
13. The accepted_impact_hash attests to a degraded impact analysis; all downstream readiness assessments inherit this degradation.