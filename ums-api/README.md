# ums-api — User Management System API (SVC-001)

Node.js + Express + TypeScript scaffold for the User Management System API.
Implements `specs/SCAFFOLD-SVC-001` (tasks T001–T005, AC-1).

Stack: Express 5, Prisma (PostgreSQL), ioredis + Bull (Redis), jsonwebtoken, bcryptjs, Joi,
node-cron, Nodemailer, Winston, Docker Compose. API contract: [`openapi.yaml`](./openapi.yaml).

## Getting started

```bash
cd ums-api
cp .env.example .env    # replace every placeholder
docker compose up --build
curl -i http://localhost:3000/api/v1/health
```

Without Docker (PostgreSQL and Redis must be reachable via `DATABASE_URL` / `REDIS_URL`):

```bash
npm install            # also runs `prisma generate`
npm run db:migrate     # prisma migrate deploy
npm run dev
```

All configuration is read from environment variables and validated at startup by
`src/config.ts`; the process exits with a list of every missing/invalid variable.

| Variable                    | Required | Description                                       |
| --------------------------- | -------- | ------------------------------------------------- |
| `NODE_ENV`                  | yes      | `development` \| `test` \| `production`           |
| `PORT`                      | no       | HTTP port (default `3000`)                        |
| `DATABASE_URL`              | yes      | PostgreSQL connection string                      |
| `REDIS_URL`                 | yes      | Redis connection string (queue + token blacklist) |
| `JWT_SECRET`                | yes      | HS256 signing secret (≥ 32 chars)                 |
| `JWT_EXPIRES_IN`            | yes      | Token expiry in seconds, 900–3600                 |
| `SMTP_HOST`, `SMTP_PORT`    | yes      | SMTP server                                       |
| `SMTP_USER`, `SMTP_PASS`    | yes      | SMTP credentials                                  |
| `LOG_LEVEL`                 | no       | Winston level (default `info`)                    |
| `POSTGRES_USER/PASSWORD/DB` | compose  | Credentials for the bundled PostgreSQL container  |

## Scripts

| Command                | Purpose                 |
| ---------------------- | ----------------------- |
| `npm run dev`          | Start with `tsx watch`  |
| `npm run build`        | Compile to `dist/`      |
| `npm start`            | Run the compiled server |
| `npm run lint`         | ESLint                  |
| `npm run format:check` | Prettier check          |
| `npm run typecheck`    | TypeScript check        |
| `npm test`             | Vitest unit tests       |
| `npm run db:migrate`   | Apply Prisma migrations |

## Endpoints

| ID         | Route                          | Scaffold behaviour                                 |
| ---------- | ------------------------------ | -------------------------------------------------- |
| EP-API-001 | `POST /api/v1/auth/register`   | 501                                                |
| EP-API-002 | `POST /api/v1/auth/verify-otp` | 501                                                |
| EP-API-003 | `POST /api/v1/auth/login`      | 501                                                |
| EP-API-004 | `POST /api/v1/auth/logout`     | 401 without valid token, otherwise 200 (revoked)   |
| EP-API-005 | `GET /api/v1/dashboard`        | 401 without valid session, otherwise 200 (US-001)  |
| EP-API-006 | `DELETE /api/v1/users/me`      | 401 without valid token, otherwise 501             |
| EP-API-007 | `GET /api/v1/health`           | 200 `healthy` / 503 `unhealthy` (PostgreSQL probe) |

Protected routes run `ValidationMiddleware → AuthMiddleware → controller` (PAT-006);
`GET /api/v1/dashboard` runs `AuthMiddleware` first. `AuthMiddleware` checks, in order: Bearer
token present → signature and `exp` (`AuthService.validateToken()`) →
`TokenBlacklist.isBlacklisted()` → PostgreSQL session store (`AuthService.isSessionActive()`).
It fails closed (401) if Redis or PostgreSQL is unavailable and sets `req.user` to the
`JwtPayload { sub, email, iat, exp }`. Errors use the `{ error: ErrorResponse }` envelope, where
`ErrorResponse` is `{ code, message, correlationId }` (`correlationId` equals `X-Request-Id`).

## US-001 — Dashboard / Delete Account visibility

`GET /api/v1/dashboard` returns `DashboardResponse { user: UserDTO, features: {
delete_account_visible: true } }`, validated with Joi at the controller boundary
(`src/presentation/schemas.ts`). Decisions taken for the spec's open items:

| Open item                       | Decision                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #3 TokenBlacklist store (T011)  | Redis (already a dependency via `REDIS_URL`; no new dependency). In-process rejected: not shared across instances, lost on restart. Redis commands time out after 500 ms. |
| #4 JWT clock-skew tolerance     | `0` s (`JWT_CLOCK_TOLERANCE_SECONDS`); a token is rejected at its `exp` second.                                                                                           |
| #5 Session store timeout (T012) | `SESSION_STORE_QUERY_TIMEOUT_MS = 500`; a slower or failing lookup returns 401 and logs the outage with the correlation id.                                               |
| #6 1 s SLA (T007)               | Validation time is exposed as `Server-Timing: auth;dur=<ms>`. Gate: `loadtest/dashboard.k6.js` (500 VUs, fails if any request or validation exceeds 1 s).                 |
| #7 `DELETE /api/account`        | Not implemented here (out of scope). `TokenBlacklist.invalidate()` is ready for it; the existing route is `DELETE /api/v1/users/me`.                                      |
| #8 Dashboard rate limiting      | Not applied; no policy is defined for this endpoint.                                                                                                                      |
| #1/#2/#9 Degraded design (T013) | Built from `specs/US-001` only; reconcile when `artifact-SVC-002-c3`, `-c4` and `-api_spec` are published.                                                                |

Run the load-test gate against a running API with a seeded `ACTIVE` user:

```bash
TOKEN=$(JWT_SECRET=... node loadtest/sign-token.mjs <userId> <email>)
BASE_URL=http://localhost:3000 TOKEN=$TOKEN npm run loadtest:dashboard   # requires k6
```

## Structure

- `src/presentation` — controllers and middleware (`AuthController`, `UserController`,
  `AuthMiddleware`, `ValidationMiddleware`, `GlobalExceptionHandler`)
- `src/application` — `UserService`, `AuthService`, `OtpService`, `OtpFactory`
- `src/infrastructure` — repository interfaces + Prisma implementations, `TokenBlacklist`
  (Redis), `EmailDispatcher`, `OtpCleanupScheduler`, database helper
- `src/domain` — entities, DTOs, `AccountStatus`, `JwtPayload`, `AppError`
- `src/container.ts` — composition root (DI wiring, PAT-003)
- `prisma/` — schema and migrations

## Open stakeholder decisions

Search for `TODO(stakeholder):` — password complexity, field lengths, JWT expiry, login and OTP
resend rate limits (default documented: 5 failed attempts / 15 min / IP), bcrypt work factor,
PII encryption at rest, session limits, deleted-account audit retention, and the token blacklist
backend (Redis default vs. PostgreSQL sessions table).
