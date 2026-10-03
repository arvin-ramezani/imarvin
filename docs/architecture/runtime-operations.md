# Runtime, Security, Storage, and Operations

Status: accepted O05 runtime baseline | Updated: 2026-10-03 | Issue: #4.
Authority: [technical architecture](architecture.md) owns stack defaults; this document owns auth, uploads, deployment, backup, and logging.
Goal: production-safe operation for a low-traffic, single-owner application without unnecessary infrastructure.

## 1. Authentication and recovery — T03

Use Better Auth with its Prisma/PostgreSQL adapter and email/password only.
There is one provisioned owner; public sign-up is disabled and no public registration UI exists.
Use Better Auth's production session/cookie defaults, server-side authorization, and built-in rate limiting.
Behind OpenLiteSpeed, trust only the proxy-controlled client-IP header; never trust arbitrary forwarded IP chains.
Store auth/session/rate-limit state in PostgreSQL; no Redis is required.

V1 password policy: minimum 12 characters; use a password manager and a high-entropy application auth secret.
Normal recovery is authenticated password change with other sessions revoked.
V1 has no public forgot-password email flow or transactional-email dependency.
Emergency recovery is SSH-only: a server-side maintenance command recreates/resets the single owner and revokes sessions.
Content ownership must not depend on the auth-user row, so emergency credential recovery cannot orphan content.
The auth bootstrap/recovery implementation spec must use Better Auth server APIs/schema safely; never expose a recovery HTTP endpoint.

Iran deployment note: Better Auth core is self-hosted open-source software; this email/password + local PostgreSQL design has no runtime dependency on a Better Auth SaaS or social provider.
No Iran-specific restriction is documented for Better Auth core; optional hosted/infrastructure plugins that require external Better Auth services are outside this baseline.
The production bootstrap must verify npm/GitHub/Ubuntu repository access from the target Iranian VPS and keep the lockfile/build process reproducible because third-party network availability can differ by region.
Country/provider/legal restrictions are an operations constraint, not an authentication-library dependency; re-check external services before production rollout.

## 2. Filesystem media — T04

Use VPS filesystem storage for V1; do not add S3/object storage while volume and traffic stay small.
Store durable uploads outside the deploy tree, for example `/var/lib/imarvin/uploads`.
Store file metadata/reference state in PostgreSQL; use generated opaque storage keys, never user filenames as paths.
Treat stored files as immutable: replacement creates a new key; old public files remain until no published snapshot references them.
Draft-only assets and published assets must remain distinguishable by authoritative references, not by guessable paths.

For normal V1 uploads, use Next.js native `FormData` in Server Actions/Route Handlers plus Node `fs/promises`.
Do not add Multer: it is Express-oriented and is unnecessary for App Router's Web Request/FormData model.
Initial per-file limit is 10 MiB; validate size, declared type, detected content where practical, and allowed extension/type combinations.
Never write uploads into `public/` or expose the storage directory directly through OpenLiteSpeed.
Serve media through app-controlled routes: published references are public; draft/preview media requires owner authorization.
Prevent path traversal, executable uploads, overwrite-by-name, and direct draft URLs.
If future features require large/streaming uploads, introduce a streaming parser such as Busboy or move to object storage in that feature spec.

## 3. Production deployment — T05

Deploy one Next.js process and one PostgreSQL instance on an owner-managed Ubuntu VPS.
OpenLiteSpeed terminates TLS and reverse-proxies the app to `127.0.0.1:3000`; the Node port is not public.
Run the app as a dedicated unprivileged Linux user under systemd with restart-on-failure and a root-owned environment file.
Pin the supported Node LTS and exact package versions in the bootstrap spec; use `npm ci`, build once, then start the production artifact.
PostgreSQL listens locally unless a later backup/admin requirement explicitly needs a private network listener.
Expose only HTTPS/HTTP and the existing hardened SSH management path; restrict OpenLiteSpeed admin access.

DirectAdmin is not an application dependency.
Prefer a VPS/vhost where OpenLiteSpeed can be managed directly.
If the chosen VPS is DirectAdmin-managed, use DirectAdmin-supported custom templates/includes so regeneration cannot overwrite the app proxy/TLS config.
Do not manually patch generated DirectAdmin/OpenLiteSpeed files and assume they will persist.
No Docker, Kubernetes, Redis, queue, or second app node is required for V1.
Daily development happens locally; do not edit or run the working tree directly on the production VPS.
Use a staging deployment early enough to exercise Ubuntu/OpenLiteSpeed/systemd/filesystem behavior before production.
Staging may share the VPS only if domain, systemd service, port, database, upload directory, environment file, and credentials are isolated from production.
Release flow: local development/tests → reviewed PR → staging smoke/critical checks → production deployment.

## 4. Backup and restore — T06

Use restic for encrypted, deduplicated backups and rclone as the Google Drive transport.
Google Drive is the off-VPS copy; do not treat a second directory on the same VPS as disaster recovery.
Create a dedicated Google Drive folder/remote and a dedicated restic repository password; configure rclone with your own Google OAuth client rather than relying on its retiring shared client ID.
Keep the rclone token and restic password in root-only files and a separate password manager/recovery record.

Do not back up PostgreSQL's live data directory as application backup.
Before each snapshot, create a consistent `pg_dump` into a root-owned staging directory, then back up that dump plus `/var/lib/imarvin/uploads`.
Initial target: backup every 6 hours; RPO <= 6 hours and operator-driven RTO <= 4 hours.
Retention target: keep recent 48 hours, 7 daily, 4 weekly, and 6 monthly snapshots, then prune.
Run backup/prune/check with systemd timers; a failed job must exit non-zero and be visible in system logs.
Do not place plaintext application secrets in the backup repository; keep recovery secrets separately.
Perform and document a restore test at least quarterly and before relying on a changed backup process.

## 5. Small observability layer — T07

Use Pino for structured JSON application logs written to stdout/stderr through one shared server-only logger module.
Let systemd/journald own persistence and rotation; do not add ELK, Loki, OpenTelemetry, or an external log database initially.
Add a request/correlation ID at app boundaries and include it in important server logs.
Redact authorization headers, cookies, passwords, tokens, database URLs, auth secrets, and uploaded private metadata.
Application code must not use direct `console.*` logging or import/configure Pino outside the logging module; enforce this with lint rules and tests.
Logging tests must verify redaction and representative important events so agents cannot satisfy the contract with prose only.

Log at minimum:
- application start/shutdown and unexpected fatal errors;
- owner sign-in failure/success without raw credentials;
- save/publish/update/unpublish/delete outcome and conflict/failure category;
- upload validation/storage failures;
- database/migration startup failures.

Do not log every successful public page read.
Use `info` for lifecycle/business operations, `warn` for recoverable/security-relevant anomalies, and `error` for failed operations requiring attention.
Cap journal disk use/retention at the host level; start with roughly 14 days or 200 MiB and tune from observed volume.
Provide a minimal health endpoint returning only healthy/unhealthy; include app process and database reachability, not sensitive diagnostics.
Use systemd restart-on-failure and one external HTTPS uptime check; provider choice is operational and may use a free tier.

## 6. Configuration contract

Validate server configuration from `process.env` through one server-only Zod schema/module; `.env` files are inputs, not the source of truth.
Missing or invalid required production configuration must fail fast before the app accepts traffic; never silently default secrets, database URLs, auth origins, or storage paths.
Optional settings may have explicit documented defaults, for example `LOG_LEVEL=info`.
Keep a committed `.env.example` with variable names and safe sample values only; never commit real secrets.
Local development may use `.env.local`/test env files; production uses the root-owned systemd environment file.
Client-visible environment variables require an explicit allowlist; server secrets must never cross into Client Components or `NEXT_PUBLIC_*`.
Any config change must update the schema, example file, and tests in the same PR.

## 7. Production boundaries

TLS is mandatory in production; owner cookies are Secure/HttpOnly/SameSite according to the auth library's supported production configuration.
Authorization is checked on every owner route/action and every private-media read.
Database migrations and filesystem permission changes are reviewed deployment steps, not runtime self-healing.
Backups are not complete until a restore succeeds.
Logging is operational evidence, not a product audit-log feature; P12 still does not require individual actor audit history.
Exact VPS/domain paths, upload allowlist, systemd unit, OLS vhost, backup commands, and recovery command belong to bounded bootstrap/deployment specs.
Revisit filesystem storage when disk growth, multi-node deployment, or media traffic makes shared object storage materially simpler.
