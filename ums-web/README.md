# ums-web — User Management System Web App

React + TypeScript (Vite) front-end scaffold for the User Management System.
Implements `specs/SCAFFOLD-frontend-app` (tasks T001–T003).

## Getting started

```bash
cd ums-web
npm install
cp .env.example .env   # then edit values for your environment
npm run dev
```

All runtime configuration is read from environment variables (see `.env.example`);
the app fails fast at start-up if required values are missing or invalid.

| Variable                            | Required | Description                                                          |
| ----------------------------------- | -------- | -------------------------------------------------------------------- |
| `VITE_API_BASE_URL`                 | yes      | Base URL of the User Management System API                           |
| `VITE_API_TIMEOUT_MS`               | no       | API request timeout in ms (default `10000`)                          |
| `VITE_FEATURE_SCAFFOLD_AUTH_BYPASS` | no       | `true` renders protected placeholders without a session (local only) |

## Scripts

| Command                | Purpose                         |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start the Vite dev server       |
| `npm run build`        | Type-check and production build |
| `npm run lint`         | ESLint (incl. jsx-a11y)         |
| `npm run format:check` | Prettier check                  |
| `npm run typecheck`    | TypeScript check                |
| `npm test`             | Vitest unit tests               |

## Routes

| Screen                                         | Route                     | Access    |
| ---------------------------------------------- | ------------------------- | --------- |
| Registration Screen (SCR-001)                  | `/register`               | public    |
| OTP Verification Screen (SCR-002)              | `/verify-otp`             | public    |
| OTP Verification Success Screen (SCR-003)      | `/verify-otp/success`     | public    |
| Login Screen (SCR-004)                         | `/login`                  | public    |
| Dashboard Screen (SCR-005)                     | `/dashboard`              | protected |
| Account Deletion Confirmation Screen (SCR-006) | `/dashboard/delete`       | protected |
| Post-Deletion Confirmation Screen (SCR-007)    | `/account-deleted`        | public    |
| OTP Recovery Hub Screen (SCR-008)              | `/verify-otp/recover`     | public    |
| Deletion Rollback Error Screen (SCR-009)       | `/dashboard/delete/error` | protected |
| Session Re-Authentication Screen (SCR-010)     | `/session/reauth`         | public    |

`/` and unknown routes redirect to `/login`. Protected routes redirect to `/login`
when no session is present.

## Structure

- `packages/ums-design-system` — design tokens as CSS custom properties (`tokens.css`)
- `src/config` — zod-validated environment configuration
- `src/api` — axios client and stubbed endpoint calls
- `src/auth` — scaffold session state and route guard
- `src/layouts` — pre-auth and post-auth navigation shells
- `src/components` — reusable UI component stubs (from `references/components.md`)
- `src/screens` — placeholder screens SCR-001 … SCR-010

## Open questions (TODOs in code)

OQ-01 resend limits/cooldown, OQ-02 OTP lockout threshold, OQ-04 password complexity,
OQ-05 session timeout, OQ-06 deleted data entities, OQ-11 duplicate-email disclosure,
OTP format/length, and concurrent deletion handling (F-05 CONC) are unresolved and
intentionally not implemented.
