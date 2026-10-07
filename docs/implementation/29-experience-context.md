# Issue #29 — Experience Context Vertical Slice

Status: proposed implementation contract | Issue: #29 | Parent: #13 | Base: `3f540e4c8b17a898eabea637c3821e9e69cc1103`

Authority: [PRD](../../PRD.md), [public UX](../specs/public-ux-spec.md), [owner UX](../specs/owner-ux-spec.md), [publishing](../specs/content-publishing-spec.md), [accessibility](../specs/accessibility-responsive-spec.md), [architecture](../architecture/architecture.md).

## Goal and non-goals

Implement context-only Experience publishing end to end: owner create/edit/save, exact saved preview, explicit Publish/Update, and a stable public Experience detail.
This slice does not add Story ↔ Experience associations, multiple/main-product mode, company filtering, logos/uploads, media/evidence, featured/order/Home integration, unpublish/delete/republish, settings/contact, or deployment work.

## Data model and migration

- Add `Experience` as the private working copy. UUID `id` is the stable public identity and never depends on company/role text.
- Working fields: `companyName String @default("")`, `role String @default("")`, `startMonth String @default("")`, `endMonth String?`, `isCurrent Boolean @default(false)`, `contribution String @default("")`, `workingRevision Int @default(1)`, timestamps, and optional one-to-one `published`.
- Store months as canonical `YYYY-MM` strings, not `DateTime`, so month-only employment facts do not gain invented day/time precision.
- Add `PublishedExperience` keyed by `experienceId`, FK → `Experience.id` with cascade delete, containing the same public fields plus `revision`, `sourceWorkingRevision`, `publishedAt`, and `updatedAt`.
- No Company table, logo field, Story relation, ordering field, or future mode field in this migration.
- Add one reviewed Prisma migration; existing Story/auth tables remain unchanged.

## Validation and publication readiness

- Shared Zod draft validation trims text. Limits: company name 120 chars, role 120, contribution 1,600; non-empty months must match `YYYY-MM` and valid month 01–12.
- Drafts may omit publication-required fields. If both months are present, `endMonth >= startMonth`; `isCurrent=true` requires empty/null `endMonth`. Invalid input is rejected without discarding entered values.
- Publication requires confirmed non-empty company name, role, start month, contribution, and either `isCurrent=true` or a valid end month.
- Public date text is derived from stored year/month parts in English month/year form; current roles end with `Present`. Do not infer missing dates or employment status.
- Missing logo is always valid in #29 and renders the company-name fallback.

## Revisions and publication transaction

- Create starts `workingRevision=1`; every successful private Save increments it exactly once.
- Existing Save carries `expectedWorkingRevision`; guarded update failure is a conflict, never last-write-wins.
- Publish/Update snapshots the saved DB candidate only, never unsaved form values.
- Publish carries expected working revision and expects no public snapshot. Update also carries expected published revision.
- Use a Serializable transaction, lock the Experience row before checks, re-read working/public revisions, run publication validation, then create or guarded-update the snapshot.
- First publish creates revision 1. Update increments public revision and records the current source working revision.
- Serialization/unique/guard races map to conflict. Confirmed validation/conflict/DB failure leaves the prior public snapshot untouched.
- Unexpected/transport-uncertain publication outcome is shown as `Outcome unknown`; re-read current candidate/public revisions before enabling a retry or claiming success/failure.

## Server and route boundaries

- Add Experience-focused server modules under `features/work/experience/`; keep Prisma server-only and reuse the existing DB/auth/logger boundaries.
- Every owner page/read/action reuses `requireOwnerSession(headers)`; authorization is rechecked on every mutation and private preview read.
- Owner routes: `/studio/experiences`, `/studio/experiences/new`, `/studio/experiences/[experienceId]/edit`, `/preview`, and `/publish`.
- Server Actions validate UUID/revision hidden inputs and retain safe submitted values on failure. Use the shared logger for save/publish/update success plus conflict/failure category with bounded identifiers/status only; never log company/role/contribution bodies.
- Preview renders only the exact saved working copy with `Private preview` and `Back to editing`; unsaved values must be saved before preview.
- Publication review labels candidate versus current public state and chooses explicit `Publish` or `Update published content`.
- Revalidate owner Experience routes and `/experience/[experienceId]` only after the corresponding successful writes.

## Public read model

- Add `/experience/[experienceId]`; it reads `PublishedExperience` only. No public Experience collection is added in this slice.
- Render company-name identity, role, human-readable date range, and contribution as contextual content, not a chronological résumé/timeline.
- Because Story association is out of scope, show the honest context-only/no-project state and a normal Browse work path; never expose draft Story/company data.
- Missing, malformed, nonexistent, and draft-only IDs share the neutral unavailable/not-found response; public metadata is built only from the snapshot.
- Title/company edits never change the public URL.

## UI and accessibility

- Owner list/editor/preview/review reuse the shared app shell and approved Signal Studio semantic tokens. The list shows company-name fallback, public/private relationship state, Edit, and New experience; no vanity metrics or timeline layout.
- Owner editor uses visible labels, required-for-publish guidance, error summary → field links/focus, retained input, and explicit Saved privately/conflict/session-expiry messages.
- Owner/admin Experience UI has zero interface animation/transition at every breakpoint, including hover/press/focus/loading/validation/publish feedback; `$mobile-native` motion guidance is excluded there.
- No public motion or Framer Motion dependency is needed for this context-only detail slice; ordinary navigation/focus is sufficient.
- Light/Dark/System preserves form values/focus. At 320px, long maximum-valid company/role/contribution text wraps with no page-level horizontal overflow.
- Keyboard/touch paths expose the same save/preview/publish/recovery actions; no hover-only control.

## Tests and acceptance mapping

- Vitest validation: draft permissiveness, month format/order/current rules, publication-required fields, normalization and limits.
- PostgreSQL integration: migration/data shape, create/save revision guard, concurrent Save, one-winner first publish, atomic Update, stale public revision, public-only reads, and prior-public preservation on confirmed failure.
- Authorization integration: anonymous owner list/read/preview/mutation rejection; authenticated owner path allowed. Public reads never return working-copy fields.
- RTL: labels/help, retained values, error-summary focus/links, Saved privately/conflict/outcome-unknown state, and Publish versus Update action labels.
- Playwright critical journey: sign in → create/save → preview → Publish → anonymous public read → private edit/Save → public unchanged → explicit Update → public changed at same URL.
- Playwright also covers anonymous preview denial, Light/Dark state preservation, keyboard reachability, 320px overflow, and maximum-valid unbroken authored text. Use the isolated test DB/reset/seed rules from `$test-engineering`.
- Required deterministic checks: Prisma generate/validate/migrate/status, Better Auth schema check, lint, focused Vitest/RTL/Playwright, production build, and `graphify update .` after code changes.

## Gates

Implementation requires deterministic verification, Design QA, Security Review, Independent Review, and local runtime acceptance on the exact final SHA. Production/VPS acceptance is not required.
