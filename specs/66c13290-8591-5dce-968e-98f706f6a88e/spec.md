# Feature Specification: Confirm Repository Identity and Intended Upgrade Scope

**Story ID**: `66c13290-8591-5dce-968e-98f706f6a88e`  
**Generation mode**: `tech_upgrade`  
**Policy version**: `ace-spec-format/v1`  
**Accepted impact analysis revision**: `1`  
**Accepted impact analysis**: `sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010`  
**Repository baseline commit**: `810fe751f082b675b4b572e9d05c965676508a6e`  
**Deterministic grounding reference**: `60b54710194b777d`  

---

## Overview

The automated CAST scan analysed a repository named 'User_Management' (20,063 LOC, Node.js/TypeScript, Express 4.19.2, better-sqlite3, ioredis) and found zero evidence of Java, Maven, Spring Boot, JPA, or Hibernate anywhere in the codebase. The declared modernisation objective, however, targets Spring Boot 3.x and Java 17/21. This is a critical mismatch: either the wrong repository was submitted for scanning, or the objective was written against a service that does not exist in this submission, or a separate Java/Spring Boot service exists but was omitted from the scan. No upgrade planning of any kind can proceed until this question is answered.

This story is a time-boxed investigation to obtain a definitive, written, attributable answer from the project team to two specific questions — (1) is 'User_Management' the intended scan target, and (2) does a separate Java/Spring Boot service exist that was omitted — and to record those answers in the project decision log. If a Java service is confirmed, its repository name and location must also be captured. If no Java service is confirmed, the decision log must explicitly state that the Spring Boot 3.x / Java 17/21 objective is inapplicable to this codebase. In all cases the log entry must acknowledge the accepted evidence limitations (stale snapshot, no commit verification) and recommend a fresh scan. No code changes, no implementation work, and no upgrade planning are in scope for this story.

> **Note**: the evidence snapshot (Onboarding-[REDACTED-PHONE]) is accepted as stale and unverified against a repository commit; those are accepted limitations and do not change the need for team confirmation.

---

## User Scenarios & Testing

- **S1-AC1**: Given the scanned repository is 'User_Management' (Node.js/TypeScript, 20,063 LOC, no Java evidence per F77), when the project team is asked whether this is the intended scan target, then a named team member provides a written yes/no answer that is recorded in the project decision log.
- **S1-AC2**: Given the declared objective references Spring Boot 3.x and Java 17/21 but no Java components exist in the scanned repository (F77), when the project team is asked whether a separate Java/Spring Boot service exists that was omitted from the scan, then a named team member provides a written yes/no answer that is recorded in the project decision log.
- **S1-AC3**: Given the team confirms a separate Java/Spring Boot service does exist, when the answer is recorded, then the repository name and location of that Java service are also captured in the same decision log entry so a follow-on scan can be scoped.
- **S1-AC4**: Given the team confirms no Java service exists and 'User_Management' is the correct target, when the answer is recorded, then the decision log entry explicitly states that the Spring Boot 3.x / Java 17/21 objective is inapplicable to this codebase, unblocking S2.
- **S1-AC5**: Given the evidence snapshot is accepted as stale and unverified against a commit (accepted limitation), when the decision is recorded, then the log entry acknowledges this limitation and notes that a fresh scan is recommended regardless of the outcome.

---

## Functional Requirements

- **FR-001**: The system (process) must support a structured inquiry directed at the project team that poses two explicit, unambiguous questions: (Q1) Is the repository 'User_Management' (Node.js/TypeScript, 20,063 LOC, no Java evidence per F77) the intended scan target for this modernisation engagement? (Q2) Does a separate Java/Spring Boot service exist that was omitted from the scan? Both questions must be answered in writing by a named team member, and both answers must be recorded in the project decision log (Jira comment, Confluence page, ADR, or equivalent dated artefact). Answering only one question does not satisfy this requirement. [Traces to S1-AC1, S1-AC2]
- **FR-002**: When the team confirms that a separate Java/Spring Boot service does exist, the decision log entry must additionally capture the repository name and location (URL or path) of that Java service, so that a follow-on scan can be scoped without further clarification. The entry is not considered complete until this repository reference is present and non-empty. [Traces to S1-AC3]
- **FR-003**: When the team confirms that no separate Java service exists and that 'User_Management' is the correct scan target, the decision log entry must contain an explicit statement that the Spring Boot 3.x / Java 17/21 modernisation objective is inapplicable to this codebase. This statement is a prerequisite for unblocking story S2; S2 must not be started until this story is marked done and the decision log entry is linked from the S2 ticket. [Traces to S1-AC4]
- **FR-004**: Regardless of the outcome of Q1 and Q2, every decision log entry produced by this story must acknowledge the accepted evidence limitations — specifically that the CAST snapshot (Onboarding-[REDACTED-PHONE]) is stale and was not verified against a repository commit — and must include a recommendation that a fresh scan be performed. This acknowledgement is mandatory and must appear in the same artefact as the team's answers. [Traces to S1-AC5]
- **FR-005**: The decision log entry must be attributable: it must be dated and must name the specific team member who provided the confirmation. An anonymous or undated entry does not satisfy this requirement. The entry must be reachable by a reviewer reading the artefact (Jira, Confluence, ADR, or equivalent). [Traces to S1-AC1, S1-AC2 — verification expectation derived from story verification_expectations]
- **FR-006**: No implementation work, code changes, configuration changes, or upgrade planning activities are in scope for this story. The sole deliverable is the completed, attributable decision log entry described in FR-001 through FR-005. Any work beyond that scope must be deferred to subsequent stories (S2, S3, S4, or a follow-on scan story). [Traces to story exclusions and investigation-only shared constraint]

---

## Success Criteria

- **S1-AC1**: Given the scanned repository is 'User_Management' (Node.js/TypeScript, 20,063 LOC, no Java evidence per F77), when the project team is asked whether this is the intended scan target, then a named team member provides a written yes/no answer that is recorded in the project decision log.
- **S1-AC2**: Given the declared objective references Spring Boot 3.x and Java 17/21 but no Java components exist in the scanned repository (F77), when the project team is asked whether a separate Java/Spring Boot service exists that was omitted from the scan, then a named team member provides a written yes/no answer that is recorded in the project decision log.
- **S1-AC3**: Given the team confirms a separate Java/Spring Boot service does exist, when the answer is recorded, then the repository name and location of that Java service are also captured in the same decision log entry so a follow-on scan can be scoped.
- **S1-AC4**: Given the team confirms no Java service exists and 'User_Management' is the correct target, when the answer is recorded, then the decision log entry explicitly states that the Spring Boot 3.x / Java 17/21 objective is inapplicable to this codebase, unblocking S2.
- **S1-AC5**: Given the evidence snapshot is accepted as stale and unverified against a commit (accepted limitation), when the decision is recorded, then the log entry acknowledges this limitation and notes that a fresh scan is recommended regardless of the outcome.
- **IMPACT**: Verify acceptance criterion: Given the scanned repository is 'User_Management' (Node.js/TypeScript, 20,063 LOC, no Java evidence per F77), when the project team is asked whether this is the intended scan target, then a named team member provides a written yes/no answer that is recorded in the project decision log.
- **IMPACT**: Verify acceptance criterion: Given the declared objective references Spring Boot 3.x and Java 17/21 but no Java components exist in the scanned repository (F77), when the project team is asked whether a separate Java/Spring Boot service exists that was omitted from the scan, then a named team member provides a written yes/no answer that is recorded in the project decision log.
- **IMPACT**: Verify acceptance criterion: Given the team confirms a separate Java/Spring Boot service does exist, when the answer is recorded, then the repository name and location of that Java service are also captured in the same decision log entry so a follow-on scan can be scoped.
- **IMPACT**: Verify acceptance criterion: Given the team confirms no Java service exists and 'User_Management' is the correct target, when the answer is recorded, then the decision log entry explicitly states that the Spring Boot 3.x / Java 17/21 objective is inapplicable to this codebase, unblocking S2.
- **IMPACT**: Verify acceptance criterion: Given the evidence snapshot is accepted as stale and unverified against a commit (accepted limitation), when the decision is recorded, then the log entry acknowledges this limitation and notes that a fresh scan is recommended regardless of the outcome.

---

## Evidence Gaps & Disclosures

The following gaps and disclosures are carried forward from the impact analysis and must not be silently dropped:

- No Java, Spring Boot, Maven, JPA, or Hibernate objects were found anywhere in the CAST scan — the declared modernisation target technology stack is entirely absent.
- Database objects accessed by runMigrations (2385) were not resolved by CAST MCP (query returned empty); specific schema objects affected by migrations are unknown.
- Transaction entry points for both runMigrations transactions are listed as 'unknown' — full call graph could not be expanded.
- API inventory query returned errors (NoneType / invalid arguments) — no endpoint-level impact could be assessed.
- No commit SHA or scan timestamp was provided to assess the degree of staleness of the evidence snapshot.
- Candidate verification found the selected focus object implausible for this requirement: The requirement is a repository identity investigation story about confirming whether the scanned codebase (Node.js/TypeScript, Express) matches a Spring Boot 3.x / Java 17/21 modernisation objective — it contains no actionable code change target. The selected object `runMigrations` (a TypeScript database migration function) is a concrete implementation detail of the Node.js codebase and bears no meaningful relationship to the investigation/decision story described in the requirement.
- Searched 5 term(s) derived from this requirement (repositoryConfig, techStack, migrationScope, springBoot, javaVersion) against Cast; none resolved to an existing code object.
- No-match classification: The requirement describes a scoping/confirmation investigation for a Spring Boot 3.x / Java 17-21 modernisation objective, but the scanned codebase is a Node.js/TypeScript project with zero evidence of Java, Maven, Spring Boot, JPA, or Hibernate — meaning the target Java capability does not exist in this repository at all. Finding nothing for terms like springBoot, javaVersion, and migrationScope is therefore the correct result, not a search miss.
- No pre-existing implementation was found for this requirement; scope is derived solely from the requirement text, not from measured code evidence.
- Which components will need to be built to implement each acceptance criterion, since no existing implementation was found?

---

## Provenance

- **Policy version**: `ace-spec-format/v1`
- **Accepted impact analysis revision**: `1`
- **Accepted impact analysis**: `sha256:0511c0d052c763841069f7a6a15f972a4a507c9d90fa7fdb3382c9495ae35010`
- **Repository baseline commit**: `810fe751f082b675b4b572e9d05c965676508a6e`
- **Deterministic grounding reference**: `60b54710194b777d`
- **Run ID**: `ca677d0b-3c45-5510-a8c5-cc8f58571232`
- **Project ID**: `0942c456-f7cd-444c-ba16-446787d2ce8e`
- **Modernization task ID**: `66c13290-8591-5dce-968e-98f706f6a88e`
- **Upgrade option**: `OPT-SCOPE-CLARIFY` — Resolve Objective–Stack Mismatch Before Any Upgrade Planning
- **Evidence citation**: `determinism-snapshot` → `sha256:ca7a0b6d1a8e5149b6d97b9994882199ebaa71e9d823282ceb71760bf1595d36` (source ref: `60b54710194b777d`)
