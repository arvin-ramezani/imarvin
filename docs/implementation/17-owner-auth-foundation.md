# Issue #17 — Owner Auth Foundation

Status: accepted implementation contract | Issue: #17 | Base: `dacb56d7a4b66c0e0c48ffbdf3538b775ef986dd`

## Goal

Add the single-owner Better Auth + Prisma/PostgreSQL foundation and one reusable server-side owner authorization boundary without adding product permissions or owner UI.

## Pinned integration

- Better Auth: `better-auth@1.7.7`.
- Prisma adapter: `@better-auth/prisma-adapter@1.7.7`, PostgreSQL provider.
- Next.js handler: `toNextJsHandler(auth)` at `/api/auth/[...all]`.
- Better Auth schema is generated for Prisma and committed through a reviewed Prisma migration.
- Existing `lib/db/` Prisma singleton remains the only application database client.
- `AUTH_SECRET` and `APP_ORIGIN` come from the central server config; no Better Auth environment fallback is relied on.

## Authentication contract

- Email/password only.
- Public email sign-up is disabled and the sign-up endpoint is disabled defensively.
- Public password-reset endpoints are disabled; V1 has no email recovery.
- Minimum password length is 12 characters.
- Sessions use Better Auth's database-backed session model and host-only secure production cookie behavior.
- Rate limiting is always enabled and stored in PostgreSQL; no Redis/secondary storage.
- Static `baseURL=APP_ORIGIN` and `trustedOrigins=[APP_ORIGIN]` avoid trusting arbitrary forwarded host/origin values.

## Owner invariant and provisioning

- Exactly one owner is provisioned through a server-only function, never through HTTP, a Server Action, or browser code.
- Provisioning refuses to create an owner when an auth user already exists.
- Provisioning uses Better Auth's email/password server flow so password hashing and auth hooks stay library-owned.
- The provisioning-only auth instance may enable sign-up internally, but it is never exported through the Next.js handler.
- Product content must not reference the auth-user row as its ownership model.

## Authorization boundary

- `lib/auth/` exports `getOwnerSession(headers)` and `requireOwnerSession(headers)`.
- Any authenticated session is the owner because the only creation path enforces the single-owner invariant and public sign-up is unavailable.
- `requireOwnerSession` throws a local unauthorized error without exposing Better Auth/database diagnostics.

## Password/session contract

- Normal password change requires the existing authenticated session and current password.
- The wrapper always requests `revokeOtherSessions: true`.
- SSH/operator emergency reset wiring remains deferred to production/deployment work.

## Logging and failure behavior

- Sign-in success/failure and password-change events use the shared Pino boundary.
- Do not log passwords, cookies, session tokens, auth secrets, request bodies, or raw Better Auth errors.
- Better Auth internal logging is bridged to the shared logger without forwarding arbitrary structured arguments.
- Public/auth failures return Better Auth's bounded HTTP semantics; authorization failures remain generic.

## Verification

- Generate and validate the Better Auth Prisma schema.
- Apply the committed auth migration to a fresh PostgreSQL database.
- Integration-test provisioning single-owner enforcement, disabled public sign-up/reset, sign-in/session persistence, unauthenticated authorization rejection, authenticated owner acceptance, password change, other-session revocation, and database-backed rate-limit state.
- Run `npm ci`, Prisma generate/validate/migrate/status, lint, Vitest, and production build.
- No rendered auth UI is introduced, so Design QA is not required.
- Security Review and Independent Review are required on the exact final SHA.
