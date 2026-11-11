# T001 — S1 Gate Record [FR-001 / S2-AC1]

| Field | Value |
|-------|-------|
| Story | `a9364419-c381-54f0-93da-2b9e5006188c` (S2) |
| Prerequisite story | `66c13290-8591-5dce-968e-98f706f6a88e` (S1 — Confirm Repository Identity and Intended Upgrade Scope) |
| Repository | `https://github.com/XEBIA-ACE/apac_user_management_system` (ref `main`, commit `810fe751f082b675b4b572e9d05c965676508a6e`) |
| Accepted impact hash | `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580` |
| Obligation | `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC1` |
| Recorded on | 2026-11-11 |
| **Gate status** | **BLOCKED: the S1 outcome is not available** |

## 1. S1 outcome (the input basis for the revised objective)

| Question | Answer recorded by S1 |
|----------|-----------------------|
| (a) Confirmed stack identity of the scanned `User_Management` repository | **Not recorded.** No attributable S1 decision log entry exists. |
| (b) Does a separate Java/Spring Boot service exist? | **Not recorded.** No attributable S1 decision log entry exists. |
| Named team member who confirmed | None |
| Date of confirmation | None |
| Decision log reference | None |

### Where S1 was searched for (2026-11-11)

- PR [#15](https://github.com/XEBIA-ACE/apac_user_management_system/pull/15) (`ace/spec/0942c456-f7cd-444c-ba16-446787d2ce8e/ca677d0b-3c4`) holds only the S1 **specification** (`specs/66c13290-8591-5dce-968e-98f706f6a88e/{spec,plan,tasks}.md`). It is still open and contains no team answers.
- Every remote branch of the repository was checked for a decision log, ADR, charter or S1 outcome file. Nothing was found.
- No S1 implementation PR exists. The tracker's "related prior outcomes" lists the S1 title, but no artefact for it can be retrieved here.

S1 FR-003 requires that "S2 must not be started until this story is marked done and the decision log entry is linked from the S2 ticket". Neither condition holds.

## 2. Consequence

Per AGENTS.md (Hard Prerequisites and Boundaries), the following do not proceed:

- **T002 / T003 (S2-AC2 / S2-AC3).** No revised objective is drafted. The two branches are mutually exclusive, and the choice between them must not be settled by assumption.
- **T005 (S2-AC4).** There is nothing to present. Separately, no named sponsor or product owner has been identified (readiness item #5).
- **T006 (S2-AC6).** Nothing is approved, so the old Spring Boot 3.x / Java 17/21 objective is not touched.

T004 (the open-risk register) has been pre-staged in [`open-risk-register.md`](./open-risk-register.md). It will be attached to the revised objective once that is drafted.

## 3. Supplemental repository observations (NOT a substitute for S1)

These facts were read directly from the repository at commit `810fe751f082b675b4b572e9d05c965676508a6e`. They are recorded for S1's owners to use. They do **not** answer S1's questions: S1 requires a written, attributable answer from a named team member. They also do **not** pick the S2-AC2 or S2-AC3 branch. They differ materially from the CAST facts the spec is built on, so they are raised as risk R-004 in the open-risk register.

| Spec / CAST fact (snapshot `60b54710194b777d`) | Observed at `810fe75` |
|-----------------------------------------------|-----------------------|
| Node.js/TypeScript backend | Node.js/TypeScript: `ums-api/` (Express API, `engines.node >=20`) and `ums-web/` (React 18 / Vite 5) |
| Express 4.19.2 | `express: ^5.1.0` (`ums-api/package.json`) |
| better-sqlite3 (SQLite) | Not present. Prisma (`@prisma/client ^6.19.2`) with `provider = "postgresql"` (`ums-api/prisma/schema.prisma`) |
| ioredis | `ioredis: ^5.4.2` (present) |
| yamljs | Not present in any `package.json` |
| cors | Not present in any `package.json` |
| bcrypt | `bcryptjs: ^3.0.3` (not native `bcrypt`) |
| No migration evidence | `ums-api/prisma/migrations/20261106000000_init` exists |
| 20,063 LOC | About 3.3k lines across tracked `.ts`/`.tsx` files (131 tracked files in total) |
| Focus object `IdentityVerificationCard`, `@radix-ui` packages | Neither is present in the repository |
| No Java / Maven / Spring Boot / JPA / Hibernate | Confirmed: no `.java`, `pom.xml` or `build.gradle` files are tracked |
| Containerisation / CI/CD | `ums-api/Dockerfile` and `ums-api/docker-compose.yml` exist. CI/CD pipelines exist only in open PRs #2 and #5 |

**Implication for S1/S2 owners:** the upgrade surface the spec names for the Node.js branch (Express 4.x → 5.x, yamljs → js-yaml, cors replacement, SQLite → PostgreSQL) does not match the repository at the baseline commit. If the S2-AC2 branch is later selected, that surface should be re-confirmed before the objective is worded. Changing the requirement text is outside this story's authority, so this is escalated rather than resolved here.

## 4. Unblock conditions

1. S1 (`66c13290-8591-5dce-968e-98f706f6a88e`) is completed and has a dated decision log entry naming the team member who answered Q1 and Q2.
2. That entry is linked from the S2 ticket and copied into Section 1 above and into `status.json` (`s1.*`, `gate.status = "passed"`, `objective_branch`).
3. A named project sponsor or product owner is identified for T005.
