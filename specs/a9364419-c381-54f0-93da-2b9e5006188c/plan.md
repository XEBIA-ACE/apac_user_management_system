# Implementation Plan: a9364419-c381-54f0-93da-2b9e5006188c

## Technical Context
- **Codebase grounding snapshot**: `60b54710194b777d`
- **Accepted impact analysis**: `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`
- **Repository**: `https://github.com/XEBIA-ACE/apac_user_management_system` (ref: `main`, commit: `810fe751f082b675b4b572e9d05c965676508a6e`)
- **CAST application**: `User_Management` (20,063 LOC; Node.js/TypeScript backend, Express 4.19.2, better-sqlite3, ioredis, yamljs, cors, bcrypt; no Java/Maven/Spring/JPA/Hibernate evidence in snapshot)
- **Modernisation task**: `a9364419-c381-54f0-93da-2b9e5006188c`
- **Upgrade option**: `OPT-SCOPE-CLARIFY` — Resolve Objective–Stack Mismatch Before Any Upgrade Planning
- **Impact analysis evidence**: `impact_analysis:determinism-snapshot:sha256:68f5c0eec05f30a6d8c92709c6673789cc8a4b54a1b8c460a688906b796c3a3f`
- **Story**: `story:a9364419-c381-54f0-93da-2b9e5006188c`

> **Implement only against Accepted impact analysis (revision 1) (fingerprint sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580)**

## Implementation-Readiness Items (Must Be Resolved or Explicitly Accepted)

The following items were flagged during impact analysis and API impact assessment. Each must be resolved or explicitly accepted before implementation proceeds:

1. **API inventory errors**: API inventory query returned errors ('Invalid arguments for function', 'NoneType' error) — no API endpoint data is available for this object.
2. **Implausible focus object**: Candidate verification found the selected focus object implausible for this requirement. The requirement is about rewriting a project charter's modernisation objective to match the confirmed Node.js/TypeScript technology stack (Express, SQLite, Redis, etc.), which is a documentation/configuration-level concern with no connection to a frontend UI component. The selected object, `IdentityVerificationCard`, is a React/TypeScript frontend UI component for identity verification display, which has no semantic relationship to charter modernisation objectives, technology stack declarations, or any of the upgrade targets mentioned (Express 5.x, js-yaml, PostgreSQL, CI/CD). None of the other candidates are a better match either, as they are repository classes for deletion notifications, deletion requests, email records, and OTP requests — all unrelated to the charter rewrite requirement.
3. **Missing backend inventory**: No backend dependency modules (Express, better-sqlite3, ioredis, yamljs, cors, bcrypt) appear in the CAST application-level inventory — only @radix-ui frontend packages are measured. Backend stack confirmation relies on story description references (F77, F47, F43) not directly visible in the provided inventory facts.
4. **No database objects**: No database objects were returned for the focus object, consistent with it being a frontend UI component, but backend DB exposure cannot be assessed from this object alone.
5. **No named sponsor/product owner**: No named sponsor or product owner is identified in the CAST facts or story metadata.
6. **No pre-existing implementation**: No pre-existing implementation was found for this requirement; scope is derived solely from the requirement text, not from measured code evidence.
7. **No-match classification**: The requirement describes formally rewriting a project charter's modernisation objective to reflect the confirmed technology stack — a planning/documentation artifact that does not yet exist in any codebase. The searched terms (projectCharter, modernisationObjective, technologyStack, upgradeTarget, repositoryIdentity) returning nothing is entirely expected, as this is a new governance/documentation deliverable, not an existing code construct.
8. **S1 outcome absent**: S1 outcome artefact is not present in the provided facts — cannot confirm whether the Node.js-only or Java-service branch of the acceptance criteria applies. Steps 2a (S2-AC2) and 2b (S2-AC3) of the technical design remain conditional branches pending S1 resolution.
9. **No code object match**: Searched 5 term(s) derived from this requirement (projectCharter, modernisationObjective, technologyStack, upgradeTarget, repositoryIdentity) against Cast; none resolved to an existing code object.
10. **Empty transaction call graphs**: Transaction call graphs returned empty (CAST MCP returned no data), limiting confidence in full transaction scope.
11. **Unknown components**: Which components will need to be built to implement each acceptance criterion, since no existing implementation was found?
12. **Degraded architecture context**: Architecture context is degraded (missing_core: api_contracts, source: determinism_cast) — no API contract data is available to assess contract impact against the target service.
13. **Degraded impact analysis**: The accepted_impact_hash attests to a degraded impact analysis; the hash confirms acceptance of the degraded state, not a fully grounded analysis. All downstream readiness assessments inherit this degradation.

## Design Steps

**STEP 1 [FR-001 / S2-AC1] — Gate check: Confirm S1 completion before any work begins.**
Retrieve the S1 outcome artefact from the project's authoritative planning store. Record in writing: (a) the confirmed stack identity of the scanned User_Management repository (https://github.com/XEBIA-ACE/apac_user_management_system, commit 810fe751f082b675b4b572e9d05c965676508a6e, ref main) and (b) a definitive answer on whether a separate Java/Spring Boot service exists. This written record becomes the documented input basis for all subsequent steps. Do not proceed to Step 2 until this record exists.
- Evidence: determinism-snapshot `60b54710194b777d`; accepted_impact_hash `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`

**STEP 2a [FR-002 / S2-AC2] — Branch: Node.js/TypeScript is confirmed sole target.**
If S1 confirms the User_Management Node.js/TypeScript service is the correct and sole modernisation target, draft a revised objective statement that: (a) names Node.js/TypeScript as the target runtime; (b) explicitly references Express 4.x, better-sqlite3, ioredis, yamljs, and cors as the upgrade surface (Express 4.x → 5.x, yamljs → js-yaml, cors replacement, SQLite → PostgreSQL if scaling required, containerisation, CI/CD); and (c) contains no reference to Spring Boot 3.x or Java 17/21. Store the draft in the project's authoritative planning artefact.
- Evidence: determinism-snapshot `60b54710194b777d`; CAST application `User_Management`; accepted_impact_hash `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`

**STEP 2b [FR-003 / S2-AC3] — Branch: Separate Java/Spring Boot service confirmed.**
If S1 confirms a separate Java/Spring Boot service exists, draft a revised objective statement that: (a) explicitly names that Java service as the Spring Boot upgrade target; and (b) scopes the Node.js/TypeScript User_Management service separately, ensuring the two services are not conflated in any planning artefact. Store the draft in the project's authoritative planning artefact.
- Evidence: determinism-snapshot `60b54710194b777d`; accepted_impact_hash `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`

**STEP 3 [FR-005 / S2-AC5] — Record accepted evidence limitations as open risks.**
Alongside the drafted revised objective, create an open-risk register entry that explicitly lists the three accepted evidence limitations: (a) the CAST analysis snapshot may be stale (fingerprint 60b54710194b777d, no verified commit alignment beyond 810fe751f082b675b4b572e9d05c965676508a6e); (b) no commit verification was performed against the live repository; and (c) no migration evidence is present in the snapshot. These must be characterised as open risks, not as evidence of absence. Attach this risk record to or alongside the updated charter.
- Evidence: determinism-snapshot `60b54710194b777d`; impact_analysis evidence_gaps; accepted_impact_hash `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`

**STEP 4 [FR-004 / S2-AC4] — Obtain named stakeholder sign-off.**
Present the drafted revised objective (from Step 2a or 2b) together with the open-risk record (from Step 3) to a named project sponsor or product owner for review. Obtain sign-off in a durable, attributable written form (email, Confluence comment, Jira approval, or equivalent). The sign-off record must identify the approver's name and the date of approval. Do not proceed to Step 5 until this record exists.
- Evidence: accepted_impact_hash `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`

**STEP 5 [FR-006 / S2-AC6] — Publish approved objective and supersede old objective.**
Once sign-off is confirmed, update the project's authoritative planning artefact (Confluence page, Jira epic description, or project charter document) so that: (a) the approved revised objective is directly accessible to all project stakeholders; and (b) the superseded Spring Boot/Java 17-21 objective is either removed from the artefact or explicitly marked as superseded with a reference to the replacement, leaving no ambiguity about which objective is current. Confirm the artefact is accessible to all project stakeholders.
- Evidence: determinism-snapshot `60b54710194b777d`; accepted_impact_hash `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`

> **DEGRADED DESIGN NOTICE**: This design is marked degraded because (1) the architecture context is degraded (missing_core: api_contracts, source: determinism_cast); (2) the CAST inventory returned no backend dependency modules — backend stack confirmation relies on story description references F77, F47, F43 not directly visible in provider inventory; (3) the S1 outcome artefact is absent from available evidence, so the applicable branch of acceptance criteria (S2-AC2 vs S2-AC3) cannot be determined; (4) transaction call graphs returned empty; and (5) API inventory queries returned errors. Steps 2a and 2b are presented as conditional branches pending S1 resolution. No components are fabricated beyond those grounded in the CAST determinism snapshot (60b54710194b777d) and the modernisation task description.

## Affected Components
- User_Management Node.js/TypeScript backend service (Express 4.19.2)
- Project charter / authoritative planning artefact (Confluence page, Jira epic description, or equivalent)
- S1 outcome artefact (confirmed stack identity and Java-service determination)
- Open-risk register entry (stale snapshot, no commit verification, no migration evidence)
- Stakeholder sign-off record (named sponsor/product owner approval in durable written form)

## Contract Changes
- No material API, event, or data contract change is evidenced.
- API readiness check status: **blocked** — API inventory queries returned errors; no API endpoint data is available. No touchpoints or contract changes identified.

## Security and Quality Obligations
- Validate credential and personal-data handling against the Jira requirement.
- Validate credential and personal-data handling against the story's acceptance criteria.
- Verify the changed user flow against the stated accessibility criteria.

## Migration and Rollback Obligations
- Document dependency and configuration migration.
- Provide a tested rollback path.

## Verification Plan
- **S2-AC1** (characterization, required before release, environment: ci): Given S1 has been completed and its outcome is available, when this story begins, then the S1 outcome (confirmed stack identity and whether a Java service exists) is documented as the input basis for the revised objective.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC1`
- **S2-AC2** (characterization, required before release, environment: ci): Given the S1 outcome confirms the Node.js/TypeScript service is the correct and sole target, when the revised objective is written, then it names Node.js/TypeScript as the target runtime, references Express 4.x and the other confirmed dependencies (better-sqlite3, ioredis, yamljs, cors) as the upgrade surface, and contains no reference to Spring Boot 3.x or Java 17/21.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC2`
- **S2-AC3** (characterization, required before release, environment: ci): Given the S1 outcome confirms a separate Java/Spring Boot service exists, when the revised objective is written, then it explicitly names that Java service as the Spring Boot upgrade target and scopes the Node.js/TypeScript service separately, so the two are not conflated.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC3`
- **S2-AC4** (characterization, required before release, environment: ci): Given the revised objective has been drafted, when it is presented for approval, then a named project sponsor or product owner has reviewed and signed off on it in writing (email, Confluence comment, Jira approval, or equivalent).
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC4`
- **S2-AC5** (characterization, required before release, environment: ci): Given the accepted evidence limitations (stale analysis, no commit verification, no migration evidence), when the revised objective is finalised, then those limitations are recorded as open risks in or alongside the updated charter, not treated as evidence of absence.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC5`
- **S2-AC6** (characterization, required before release, environment: ci): Given the revised objective is approved, when it is stored, then it is accessible in the project's authoritative planning artefact (e.g. Confluence page, Jira epic description, or project charter document) and the old Spring Boot/Java 17-21 objective is either removed or explicitly superseded.
  - Obligation ID: `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC6`
- **IMPACT**: Verify acceptance criterion: Given S1 has been completed and its outcome is available, when this story begins, then the S1 outcome (confirmed stack identity and whether a Java service exists) is documented as the input basis for the revised objective.
- **IMPACT**: Verify acceptance criterion: Given the S1 outcome confirms the Node.js/TypeScript service is the correct and sole target, when the revised objective is written, then it names Node.js/TypeScript as the target runtime, references Express 4.x and the other confirmed dependencies (better-sqlite3, ioredis, yamljs, cors) as the upgrade surface, and contains no reference to Spring Boot 3.x or Java 17/21.
- **IMPACT**: Verify acceptance criterion: Given the S1 outcome confirms a separate Java/Spring Boot service exists, when the revised objective is written, then it explicitly names that Java service as the Spring Boot upgrade target and scopes the Node.js/TypeScript service separately, so the two are not conflated.
- **IMPACT**: Verify acceptance criterion: Given the revised objective has been drafted, when it is presented for approval, then a named project sponsor or product owner has reviewed and signed off on it in writing (email, Confluence comment, Jira approval, or equivalent).
- **IMPACT**: Verify acceptance criterion: Given the accepted evidence limitations (stale analysis, no commit verification, no migration evidence), when the revised objective is finalised, then those limitations are recorded as open risks in or alongside the updated charter, not treated as evidence of absence.
- **IMPACT**: Verify acceptance criterion: Given the revised objective is approved, when it is stored, then it is accessible in the project's authoritative planning artefact (e.g. Confluence page, Jira epic description, or project charter document) and the old Spring Boot/Java 17-21 objective is either removed or explicitly superseded.

## Traceability Matrix
| Criterion | Functional Spec Ref | Accepted Impact Hash |
|-----------|--------------------|-----------------------|
| S2-AC1 | spec_functional | sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580 |
| S2-AC2 | spec_functional | sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580 |
| S2-AC3 | spec_functional | sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580 |
| S2-AC4 | spec_functional | sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580 |
| S2-AC5 | spec_functional | sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580 |
| S2-AC6 | spec_functional | sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580 |