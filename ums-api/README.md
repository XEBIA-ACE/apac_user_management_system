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
| EP-API-004 | `POST /api/v1/auth/logout`     | 401 without valid token, otherwise 501             |
| EP-API-005 | `GET /api/v1/dashboard`        | 401 without valid token, otherwise 501             |
| EP-API-006 | `DELETE /api/v1/users/me`      | 401 without valid token, otherwise 501             |
| EP-API-007 | `GET /api/v1/health`           | 200 `healthy` / 503 `unhealthy` (PostgreSQL probe) |

Protected routes run `ValidationMiddleware → AuthMiddleware → controller` (PAT-006).
`AuthMiddleware` requires both `AuthService.validateToken()` and
`TokenBlacklist.isBlacklisted()` to pass and fails closed (401) if Redis is unavailable.
Errors use the `{ error: { code, message, request_id } }` envelope.

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
