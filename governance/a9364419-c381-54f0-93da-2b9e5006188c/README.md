# Modernisation Objective Rewrite — Story `a9364419-c381-54f0-93da-2b9e5006188c` (S2)

This folder holds the governance artefacts for **"Rewrite Modernisation Objective to Match Confirmed Technology Stack"** (spec run `fd869c32-766f-5900-812d-d1e546a3a55b`, upgrade option `OPT-SCOPE-CLARIFY`, accepted impact hash `sha256:3cde12d354b52c01f0a0545583f984f45067017a18ed7cfa633a25bb4d4d7580`). It contains documentation only. No source code is modified.

## Current status: BLOCKED at T001 (S1 gate)

The outcome of the prerequisite story S1 (`66c13290-8591-5dce-968e-98f706f6a88e`) is not available. Until it is, no revised objective is drafted, no sign-off is sought, and the existing Spring Boot 3.x / Java 17/21 objective stays as it is.

| Task | Criterion | Artefact | State |
|------|-----------|----------|-------|
| T001 | S2-AC1 | [`s1-gate-record.md`](./s1-gate-record.md) | Gate recorded: **blocked** (S1 outcome missing) |
| T002 | S2-AC2 | _not created_ | Not started (gated; branch not selected) |
| T003 | S2-AC3 | _not created_ | Not started (gated; branch not selected) |
| T004 | S2-AC5 | [`open-risk-register.md`](./open-risk-register.md) | Pre-staged; all risks open |
| T005 | S2-AC4 | [`signoff-record.md`](./signoff-record.md) | Not obtained (no draft; no named approver) |
| T006 | S2-AC6 | _not created_ | Not started (requires sign-off) |

[`status.json`](./status.json) is the machine-readable state that the characterisation checks read.

## Characterisation checks

```bash
node --test governance/a9364419-c381-54f0-93da-2b9e5006188c/characterization.test.mjs
```

Each test is named after its criterion (`[S2-AC1]` … `[S2-AC6]`) and carries its obligation ID. The tests enforce the gate now: for example, no objective may exist while S1 is missing, and no approver may be recorded without a name and date. As the workflow moves forward, the same tests check the content of the objective, the sign-off and the publication.
