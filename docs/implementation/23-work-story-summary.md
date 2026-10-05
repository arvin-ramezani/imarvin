# Issue #23 — Work Story Summary Vertical Slice

Status: accepted implementation contract | Issue: #23 | Parent: #13 | Base: `ab6dd0eb205814485b8c3e775a30a8dcefffb28d`

## Goal

Implement the first Work slice end to end: save a text-only story summary privately, preview the exact saved candidate, explicitly publish/update it, and expose only published snapshots at `/work`.

## Data model

- `Story` is the private working copy. Its UUID primary key is also the stable public identity and never depends on title.
- Working fields: title, problem/hook, contribution/responsibility, project progress, optional outcome/lesson, optional stack.
- Draft fields may be incomplete. `workingRevision` starts at 1 and increments on every successful save.
- `PublishedStory` is a separate one-to-one snapshot keyed by `storyId`; public queries never project fields from `Story`.
- Snapshot stores the same summary fields, `revision`, `sourceWorkingRevision`, and publication timestamps.
- Add `StoryProgress = ONGOING | COMPLETED | CANCELLED`; progress is nullable only on the working copy.
- One reviewed Prisma migration adds these tables/enum. No auth-user ownership relation, media, relationships, ordering, or future-depth schema.

## Validation and revisions

- Shared Zod draft validation normalizes text/stack and permits missing publication-required facts while rejecting malformed/oversized values.
- Publication additionally requires non-empty title, problem/hook, contribution, and progress.
- Existing-story Save carries `expectedWorkingRevision`; a guarded update increments the revision only when it still matches.
- A stale Save returns conflict state and retains submitted values; no automatic retry or last-write-wins.
- Publish/update always snapshots the saved database candidate, never submitted/unsaved form values.
- Publish carries the expected working revision and expects no public snapshot.
- Update published content carries both expected working revision and expected public revision.
- Publication runs in a Serializable transaction, rechecks revisions immediately before the write, and maps serialization/unique races to conflict without reporting success.
- First publish creates one snapshot atomically. Update replaces that snapshot atomically and increments its public revision.
- Confirmed validation/conflict/database failure leaves the prior public snapshot untouched.

## Server boundaries

- Add `features/work/` server-only query/mutation/domain modules; Prisma remains behind server modules.
- Every owner page, preview read, and mutation calls existing `requireOwnerSession(headers)`; no new permission model or auth behavior.
- Owner routes: `/studio/work`, `/studio/work/new`, `/studio/work/[storyId]/edit`, `/studio/work/[storyId]/preview`, and `/studio/work/[storyId]/publish`.
- New/Edit forms use Server Actions and a small client form boundary only for pending/error/focus/unsaved-state UX.
- Preview reads the saved working copy only and always shows `Private preview` plus `Back to editing`.
- Publication route is an explicit review/confirmation surface. It chooses Publish versus Update published content from current saved/public state and never treats Save as publication.
- Server Actions re-authorize on every call, validate hidden identity/revision inputs, log bounded operation failures through the shared logger, and never log story bodies.

## Public read model

- `/work` reads `PublishedStory` only and shows an honest zero-state when none exist.
- `/work/[storyId]` reads one published snapshot by stable story ID; title edits never change the URL.
- Missing, draft-only, and otherwise unavailable IDs render the same neutral Work not-found state.
- Public metadata/content must be derived from the published snapshot only.
- Successful publish/update revalidates `/work` and that story detail so a fresh request observes the committed snapshot.

## UI behavior

- Owner list shows saved title fallback, project progress, Published/Private plus editing relationship state, Edit, and New story.
- Editor keeps visible labels/help, required-for-publish guidance, text errors, and semantic Signal Studio tokens; no invented example values.
- Save success says Saved privately. Save failure/conflict never says Saved.
- Preview cannot use unsaved values; editor requires Save before navigating to the saved preview when local fields changed.
- Publication review labels candidate versus current public state and names missing publication fields before confirmation.
- Error summary receives focus after failed submit and links to affected fields; local input remains rendered.
- 320px uses stacked list/actions/forms with no horizontal dependency. Keyboard use requires no hover-only or pointer-only action.

## Tests and acceptance

- Vitest domain/integration: draft/public validation, working-copy isolation, guarded save conflict, first publish, atomic update, stale public revision, and public-only reads.
- Authorization tests cover unauthenticated owner list/read/preview/mutation rejection and authenticated acceptance using the existing boundary.
- RTL covers editor labels/errors, error-summary focus, Saved privately/conflict states, and publication action labels where useful.
- Playwright covers: authenticated owner create/save → private preview → publish → public read → edit/save privately → public unchanged → explicit update → public changed.
- Playwright also exercises keyboard focus and 320px overflow for the implemented owner/public surfaces.
- Required deterministic checks: Prisma generate/validate/migrate/status, Better Auth schema check, `npm run lint`, affected Vitest/RTL, focused Playwright, and `npm run build`.

## Non-goals

No media/uploads, decisions/evidence, experience/company links or filtering, related/featured/order behavior, home integration, unpublish/delete/republish, advanced navigation/history, settings/contact, autosave, rich text, version-history UI, deployment, or speculative abstractions.

## Gates

Deterministic verification, Design QA, Security Review, Independent Review, and local runtime acceptance are required on the exact final SHA. Production/VPS acceptance is not required.
