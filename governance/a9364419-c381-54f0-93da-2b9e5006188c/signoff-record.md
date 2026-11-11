# T005 — Stakeholder Sign-off Record [FR-004 / S2-AC4]

| Field | Value |
|-------|-------|
| Story | `a9364419-c381-54f0-93da-2b9e5006188c` |
| Obligation | `fd869c32-766f-5900-812d-d1e546a3a55b:test:characterization:S2-AC4` |
| **Status** | **NOT OBTAINED: blocked** |
| Approver name | _(none identified)_ |
| Approver role | _(none identified)_ |
| Date of approval | _(none)_ |
| Durable record (email / Confluence comment / Jira approval) | _(none)_ |
| Artefacts presented | _(none: no revised objective has been drafted)_ |

## Why sign-off was not sought

1. **Nothing to present.** T002/T003 are gated on S1, which is not complete (see [`s1-gate-record.md`](./s1-gate-record.md)).
2. **No named approver.** Neither the CAST facts nor the story metadata name a project sponsor or product owner (readiness item #5). Per AGENTS.md, no name is assumed or invented.

## How to complete

Once a revised objective and the [`open-risk-register.md`](./open-risk-register.md) have been presented to a named sponsor or product owner:

- Fill in the table above with the approver's full name, role, approval date (ISO `YYYY-MM-DD`) and a link to the durable written record.
- Set `signoff.status` to `"approved"` in `status.json` and fill in `approver_name`, `approver_role`, `approved_on` and `evidence_ref`.
