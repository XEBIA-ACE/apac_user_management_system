# Tasks: Confirm Repository Identity and Intended Upgrade Scope

**Story ID**: `66c13290-8591-5dce-968e-98f706f6a88e`  
**Codegen target**: `manual`  

> All tasks below are investigation/process tasks only. No code changes, configuration changes, or upgrade planning are in scope for this story. The sole deliverable is a completed, attributable decision log entry.

---

## Implementation Tasks

- [ ] **T001** — FR-001: The system (process) must support a structured inquiry directed at the project team that poses two explicit, unambiguous questions: (Q1) Is the repository 'User_Management' (Node.js/TypeScript, 20,063 LOC, no Java evidence per F77) the intended scan target for this modernisation engagement? (Q2) Does a separate Java/Spring Boot service exist that was omitted from the scan? Both questions must be answered in writing by a named team member, and both answers must be recorded in the project decision log (Jira comment, Confluence page, ADR, or equivalent dated artefact). Answering only one question does not satisfy this requirement. [Traces to S1-AC1, S1-AC2]

- [ ] **T002** — FR-002: When the team confirms that a separate Java/Spring Boot service does exist, the decision log entry must additionally capture the repository name and location (URL or path) of that Java service, so that a follow-on scan can be scoped without further clarification. The entry is not considered complete until this repository reference is present and non-empty. [Traces to S1-AC3]

- [ ] **T003** — FR-003: When the team confirms that no separate Java service exists and that 'User_Management' is the correct scan target, the decision log entry must contain an explicit statement that the Spring Boot 3.x / Java 17/21 modernisation objective is inapplicable to this codebase. This statement is a prerequisite for unblocking story S2; S2 must not be started until this story is marked done and the decision log entry is linked from the S2 ticket. [Traces to S1-AC4]

- [ ] **T004** — FR-004: Regardless of the outcome of Q1 and Q2, every decision log entry produced by this story must acknowledge the accepted evidence limitations — specifically that the CAST snapshot (Onboarding-[REDACTED-PHONE]) is stale and was not verified against a repository commit — and must include a recommendation that a fresh scan be performed. This acknowledgement is mandatory and must appear in the same artefact as the team's answers. [Traces to S1-AC5]

- [ ] **T005** — FR-005: The decision log entry must be attributable: it must be dated and must name the specific team member who provided the confirmation. An anonymous or undated entry does not satisfy this requirement. The entry must be reachable by a reviewer reading the artefact (Jira, Confluence, ADR, or equivalent). [Traces to S1-AC1, S1-AC2 — verification expectation derived from story verification_expectations]

- [ ] **T006** — FR-006: No implementation work, code changes, configuration changes, or upgrade planning activities are in scope for this story. The sole deliverable is the completed, attributable decision log entry described in FR-001 through FR-005. Any work beyond that scope must be deferred to subsequent stories (S2, S3, S4, or a follow-on scan story). [Traces to story exclusions and investigation-only shared constraint]

---

## Verification Tasks

- [ ] **T007** — Verify S1-AC1: Given the scanned repository is 'User_Management' (Node.js/TypeScript, 20,063 LOC, no Java evidence per F77), when the project team is asked whether this is the intended scan target, then a named team member provides a written yes/no answer that is recorded in the project decision log.  
  _Obligation ID_: `ca677d0b-3c45-5510-a8c5-cc8f58571232:test:characterization:S1-AC1` | _Type_: characterization | _Required before_: release | _Environment_: ci

- [ ] **T008** — Verify S1-AC2: Given the declared objective references Spring Boot 3.x and Java 17/21 but no Java components exist in the scanned repository (F77), when the project team is asked whether a separate Java/Spring Boot service exists that was omitted from the scan, then a named team member provides a written yes/no answer that is recorded in the project decision log.  
  _Obligation ID_: `ca677d0b-3c45-5510-a8c5-cc8f58571232:test:characterization:S1-AC2` | _Type_: characterization | _Required before_: release | _Environment_: ci

- [ ] **T009** — Verify S1-AC3: Given the team confirms a separate Java/Spring Boot service does exist, when the answer is recorded, then the repository name and location of that Java service are also captured in the same decision log entry so a follow-on scan can be scoped.  
  _Obligation ID_: `ca677d0b-3c45-5510-a8c5-cc8f58571232:test:characterization:S1-AC3` | _Type_: characterization | _Required before_: release | _Environment_: ci

- [ ] **T010** — Verify S1-AC4: Given the team confirms no Java service exists and 'User_Management' is the correct target, when the answer is recorded, then the decision log entry explicitly states that the Spring Boot 3.x / Java 17/21 objective is inapplicable to this codebase, unblocking S2.  
  _Obligation ID_: `ca677d0b-3c45-5510-a8c5-cc8f58571232:test:characterization:S1-AC4` | _Type_: characterization | _Required before_: release | _Environment_: ci

- [ ] **T011** — Verify S1-AC5: Given the evidence snapshot is accepted as stale and unverified against a commit (accepted limitation), when the decision is recorded, then the log entry acknowledges this limitation and notes that a fresh scan is recommended regardless of the outcome.  
  _Obligation ID_: `ca677d0b-3c45-5510-a8c5-cc8f58571232:test:characterization:S1-AC5` | _Type_: characterization | _Required before_: release | _Environment_: ci

- [ ] **T012** — Verify IMPACT: Verify acceptance criterion: Given the scanned repository is 'User_Management' (Node.js/TypeScript, 20,063 LOC, no Java evidence per F77), when the project team is asked whether this is the intended scan target, then a named team member provides a written yes/no answer that is recorded in the project decision log.

- [ ] **T013** — Verify IMPACT: Verify acceptance criterion: Given the declared objective references Spring Boot 3.x and Java 17/21 but no Java components exist in the scanned repository (F77), when the project team is asked whether a separate Java/Spring Boot service exists that was omitted from the scan, then a named team member provides a written yes/no answer that is recorded in the project decision log.

- [ ] **T014** — Verify IMPACT: Verify acceptance criterion: Given the team confirms a separate Java/Spring Boot service does exist, when the answer is recorded, then the repository name and location of that Java service are also captured in the same decision log entry so a follow-on scan can be scoped.

- [ ] **T015** — Verify IMPACT: Verify acceptance criterion: Given the team confirms no Java service exists and 'User_Management' is the correct target, when the answer is recorded, then the decision log entry explicitly states that the Spring Boot 3.x / Java 17/21 objective is inapplicable to this codebase, unblocking S2.

- [ ] **T016** — Verify IMPACT: Verify acceptance criterion: Given the evidence snapshot is accepted as stale and unverified against a commit (accepted limitation), when the decision is recorded, then the log entry acknowledges this limitation and notes that a fresh scan is recommended regardless of the outcome.

---

## Traceability Matrix

| Criterion ID | Functional Spec Ref | Accepted Impact Hash |
|---|---|---|
| S1-AC1 | spec_functional | sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010 |
| S1-AC2 | spec_functional | sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010 |
| S1-AC3 | spec_functional | sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010 |
| S1-AC4 | spec_functional | sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010 |
| S1-AC5 | spec_functional | sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010 |

---

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Accepted impact analysis revision**: `1`
- **Accepted impact analysis**: `sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010`
- **Repository baseline commit**: `810fe751f082b675b4b572e9d05c965676508a6e`
- **Deterministic grounding reference**: `60b54710194b777d`
- **Run ID**: `ca677d0b-3c45-5510-a8c5-cc8f58571232`
- **Project ID**: `0942c456-f7cd-444c-ba16-446787d2ce8e`
