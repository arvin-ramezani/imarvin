# Technical Architecture Baseline

Status: accepted baseline for implementation planning | Updated: 2026-10-03 | Issue: #4.
Authority: product requirements remain in PRD/specs; this document owns technical stack and architecture defaults.
Goal: keep a small personal product simple, server-first, relational, testable, and safe for deliberate publishing.

## 1. Architecture style

Use a modular monolith: one Next.js application, one PostgreSQL database, one deployable unit.
Do not add microservices, queues, Redis, GraphQL, a separate API server, or a client data-cache layer without a measured requirement.
Keep feature/domain boundaries in code so a future split is possible without designing for it now.

Primary quality drivers:
1. Maintainability for a small team/owner.
2. Correct private-draft versus published-state behavior.
3. Fast public rendering with minimal client JavaScript.

## 2. Accepted stack

| Layer | Decision | Rule |
| --- | --- | --- |
| Runtime/framework | Next.js 16+ App Router | Full-stack framework; use current stable release in implementation |
| React | React 19+ features supported by App Router | Prefer framework-native server/client boundaries |
| Language | TypeScript, strict | Avoid untyped domain/data boundaries |
| Database | PostgreSQL | Single transactional source of truth |
| ORM/migrations | Prisma | Schema, migrations, typed DB access |
| Package manager | npm | Commit lockfile; CI uses npm ci |
| Styling | Tailwind CSS 4+ | Prefer logical start/end utilities over left/right semantics |
| UI primitives | shadcn/ui with Base UI | Own generated component code; adapt to approved Signal Studio |
| UI validation | current shadcn validation/lint tooling | Pin exact commands in bootstrap spec; validate generated UI/style output |
| Forms | React Hook Form + Zod | Shared schemas where client/server validation overlaps |
| Animation | Framer Motion | Purposeful motion only; honor reduced motion |
| Unit/integration | Vitest | Business rules, validation, data/service integration |
| E2E | Playwright | Critical browser journeys only; keep suites small and high-value |

## 3. Rendering and data rules

Server Components are the default for pages, layouts, reads, metadata, and public content.
Add "use client" only for browser APIs, local interactive state, or libraries that require it.
Do not fetch server-owned data from the browser just to re-render data already available on the server.
Do not add React Query unless a feature spec proves a real client-side remote-cache/synchronization need.
Use URL/search params for shareable public selection/filter state where the UX specs require it.
Use Suspense/streaming only where it improves perceived loading without destabilizing layout or focus.

Mutations should prefer Server Actions/Server Functions for owner forms and app-internal writes.
Use Route Handlers for explicit HTTP contracts such as future integrations, webhooks, downloads, or APIs.
Validate every mutation on the server even when the client already validated it.
Use React 19 form primitives such as action state/status when they simplify pending/error UX.
Use optimistic UI only for reversible low-risk interactions; never imply publication success optimistically.

## 4. Module boundaries

Suggested source shape; feature specs may refine names without changing responsibilities:

```text
app/                    routes, layouts, route handlers, server/client composition
features/work/          stories, experiences, public exploration
features/studio/        owner editing, preview, publishing workflows
features/theme/         System/Light/Dark preference and UI
components/ui/          shadcn-based primitives
components/shared/      cross-feature composed UI
lib/db/                 Prisma client and transaction helpers
lib/config/             server-only validated environment/config
lib/logging/            shared Pino logger, redaction, event helpers
lib/validation/         shared Zod schemas when genuinely shared
lib/auth/               Better Auth/session/authorization adapter
prisma/                 schema and migrations
tests/                  shared integration/E2E support when needed
```

Feature modules may expose server queries, mutations, schemas, and UI; avoid a generic global service/repository layer.
Prisma is server-only. Never import DB access into Client Components.

## 5. Data and publishing integrity

Model relational identities and references explicitly with foreign keys/unique constraints where supported by the domain.
Use database transactions for publication/removal operations that must change together.
Use revision/version checks for stale edits and publication conflicts; never silent last-write-wins.
Keep private working state and public state distinguishable at the data model level.
Published responses must be derived only from approved published state, never from draft data.
Exact revision/snapshot tables are defined by the publishing implementation spec, not invented globally here.
Assets used by public content and draft-only assets must remain distinguishable; filesystem/media rules are in [runtime operations](runtime-operations.md).

## 6. UI and CSS rules

Signal Studio and Light/Dark/System contracts remain authoritative; shadcn is a primitive source, not the visual design.
Prefer Server Components around small Client Component islands.
Use semantic HTML and accessible Base UI/shadcn primitives before custom interaction code.
Use logical CSS/Tailwind utilities such as start/end, ms/me, ps/pe; avoid left/right for directional layout semantics.
Simple hover/focus transitions may use CSS; use Framer Motion only when motion communicates state/relationship.
Never let generated shadcn defaults reintroduce generic pill tabs, card walls, glow, or unapproved decoration.

## 7. Testing policy

Vitest unit tests: pure domain rules, Zod schemas, helpers, publication decision logic.
Vitest integration tests: Prisma/PostgreSQL behavior, transactions, server mutations, authorization boundaries where practical.
Playwright E2E tests are intentionally few: sign-in/owner access, save-private versus publish, conflict/recovery, critical public exploration/theme behavior.
Prefer testing observable behavior over component implementation details.
Every bug fix adds the smallest regression test at the lowest useful level.

## 8. Security, reliability, operations

Authorization is enforced server-side on every owner read/write; UI hiding is not authorization.
Do not expose Prisma errors, draft identifiers/content, secrets, or private asset locations publicly.
Use secure environment variables and Better Auth production-safe session/cookie configuration.
Database migrations are reviewed and applied through deployment workflow; no ad-hoc production schema edits.
Auth/recovery, filesystem media, VPS deployment, off-host backup, and logging are resolved in [runtime operations](runtime-operations.md).

## 9. Architecture gates

O05 baseline choices are resolved; feature/bootstrap specs now pin exact commands, paths, allowlists, and package versions only when needed.
Bootstrap spec must pin exact package versions/commands and confirm compatibility; avoid speculative dependencies.
Feature specs own feature-specific schema/API/UI decisions and must reference this baseline.
Revisit this architecture only when a measured requirement invalidates a default, not for theoretical scale.
