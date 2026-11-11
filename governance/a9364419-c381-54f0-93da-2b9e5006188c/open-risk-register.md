# T004 — Open-Risk Register [FR-005 / S2-AC5]

| Field | Value |
|-------|-------|
| Story | `a9364419-c381-54f0-93da-2b9e5006188c` |
| Obligation | `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC5` |
| Accepted impact hash | `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580` |
| Attached to | The revised modernisation objective (not yet drafted; see [`s1-gate-record.md`](./s1-gate-record.md)) |
| Recorded on | 2026-11-11 |

These are **open risks**. They are accepted limitations of the evidence base. None of them is evidence that something is absent: a gap in the evidence means the fact is *unknown*, not that the thing does not exist.

| ID | Risk | Source limitation | Status | Impact if realised | Mitigation / next action |
|----|------|-------------------|--------|--------------------|--------------------------|
| R-001 | **The CAST analysis snapshot may be stale.** Grounding fingerprint `60b54710194b777d`. Commit alignment has not been verified beyond `810fe751f082b675b4b572e9d05c965676508a6e`. | Accepted limitation (a) | Open | The revised objective could target a technology stack or dependency set that no longer matches the codebase. | Run a fresh CAST scan against the current `main` HEAD before the objective is finalised. S1 also recommends this. |
| R-002 | **No commit verification was performed** to tie the CAST analysis to the live repository. | Accepted limitation (b) | Open | The facts in the spec (F77, F47, F43) cannot be tied to a specific revision of the code. | Record the scanned commit SHA in the next CAST run and compare it with the repository. A manual comparison at `810fe75` is in R-004. |
| R-003 | **No migration evidence is present in the snapshot.** | Accepted limitation (c) | Open | Data-layer migration scope (schema, data, rollback) is unknown to the analysis. It must not be read as "no migrations exist". | Inventory the migration assets in a fresh scan. Note: `ums-api/prisma/migrations/20261106000000_init` exists in the repository at `810fe75`, so the snapshot gap is confirmed to be a *gap*, not an absence. |
| R-004 | **CAST stack facts diverge from the repository manifests at `810fe75`.** The spec cites Express 4.19.2, better-sqlite3, yamljs, cors, bcrypt and 20,063 LOC. The repository has `express ^5.1.0`, Prisma/PostgreSQL, `bcryptjs`, no yamljs or cors, and about 3.3k TS lines. Details are in `s1-gate-record.md` §3. | Found during T001 | Open | If the S2-AC2 branch is chosen, an objective written from the CAST facts would name an upgrade surface that has already changed or never existed. | Escalate to the S1 owners and the spec authors. Re-confirm the upgrade surface against a fresh scan before T002 wording is fixed. Do not change the requirement text in this story. |
| R-005 | **No named sponsor or product owner** has been identified for sign-off (readiness item #5). | Story metadata | Open | T005 / S2-AC4 cannot complete, so the objective cannot be finalised or published. | The project team must nominate a named approver. A name must not be assumed or invented. |
| R-006 | **Degraded impact analysis and architecture context.** The accepted hash attests to a degraded analysis. API contracts are missing (`missing_core: api_contracts`). Transaction call graphs are empty. API inventory queries returned errors. The CAST inventory has no backend modules. | Readiness items #3, #4, #7 | Open | Confidence in the stack identity and scope is lower than a fully grounded analysis would give. | Disclose this in the charter alongside the objective. Re-run the analysis once CAST inventory errors are resolved. |

## Review

- Owner: project-team
- Review date: 2026-12-11 (from the spec clause review dates)
