# Decisions

Updated: 2026-10-03. Confirmed = owner constraint. Accepted = owner-approved choice. Proposed = detailed behavior/value for review. Open = missing input. Superseded = do not implement.

Authority: arvin-ramezani/imarvin only. No inheritance from the older project. Documentation and concept selection do not authorize code, images, merge, or deployment.

## Confirmed constraints

| ID | Decision |
| --- | --- |
| C01 | Fresh personal web app, separate from the older project |
| C02 | Employment/freelance outcomes do not prescribe a CV layout |
| C03 | Private dashboard for content editing |
| C04 | Company entries use logos only; no company photos/screenshot covers |
| C05 | Experience supports several projects or the company's main application directly |
| C06 | Premium/simple means focused/intentional, not mandatory visual quietness |
| C07 | Current work is documents/knowledge only; no images, prototype, code, deployment |
| C08 | Source repository arvin-ramezani/imarvin; requirements file PRD.md |
| C09 | Creative personal web app; rejected portfolio/résumé and boring editorial direction |
| C10 | Concise English, structured AI context; factual unknowns remain explicit |

## Accepted choices

| ID | Choice | Owner evidence / trace |
| --- | --- | --- |
| P01 | Personal Studio: select work, inspect decisions/evidence, retain context | 2026-10-03: “I choose Personal Studio”; product model, not every detailed contract |
| P02 | Save private draft → preview → explicit Publish/Update; old public version stays until success | 2026-10-03: chose Explicit publishing; R16–R18, A06 |
| P03 | One owner, English public content, email/professional links, no contact form | 2026-10-03: chose Yes, focused V1; R10, R12, A01 |
| P04 | Curated work/decisions/evidence; no blog/community/customer portal/AI generation | 2026-10-03: chose Yes, focused V1; PRD V1 boundaries |
| P05 | Entry leads with one featured work | 2026-10-03: chose One featured work; actual story remains O02; R01–R02 |
| P06 | Projects-first browse; secondary company context | 2026-10-03: chose Projects first; filter details draft; R03–R07 |
| P07 | Summary then selectable sections | 2026-10-03: chose Summary then sections; exact state/history details draft; R06, R24–R25 |
| P08 | Structured authoring; design controls page layout | 2026-10-03: chose Structured content; R13–R15, A05 |
| P09 | VS-A Signal Studio — approved visual direction | 2026-10-03: owner approved the refined rendered direction after light/dark review; R26, A12 |
| P10 | Atomic per-unit publication; context-first main-product bootstrap; safe unpublish projections; referenced-delete blocking | 2026-10-03: owner approved the reviewed publishing/removal/concurrency contract. [Content/publishing](specs/content-publishing-spec.md). |
| P12 | Explicit save, candidate review, conflict/session recovery, accessible owner confirmations | 2026-10-03: owner approved the reviewed owner save/recovery/conflict contract. [Owner UX](specs/owner-ux-spec.md). |
| P13 | Hierarchy/icons/shape/spacing/state first; short supporting labels; selective decoration | 2026-10-03: owner chose Refine the proposal and supplied this visual-priority preference. Styling in visual-system-spec; essential action meanings remain clear. |
| P14 | Light + Dark across public/owner views; System default with System/Light/Dark choice | 2026-10-03: owner approved light/dark support and current dark treatment. R27; implementation mechanism remains technical. |
| P11 | Current Signal Studio visual system: refined hierarchy/surfaces/controls, approved light/dark palette target, responsive composition intent | 2026-10-03: owner approved the rendered public/owner visual direction and requested PR #2 record that approval. [Visual system](specs/visual-system-spec.md). |

## Architecture baseline

| ID | Decision | Authority |
| --- | --- | --- |
| T01 | Server-first Next.js 16+ App Router modular monolith; React 19+, PostgreSQL + Prisma, npm, Tailwind 4+, shadcn/Base UI, Zod + React Hook Form, Framer Motion, Vitest; avoid unnecessary client rendering/React Query | [Technical architecture](architecture/architecture.md) |
| T02 | Spec-driven delivery: issue → linked spec when needed → implementation → PR → independent review/checks → merge | [Engineering workflow](engineering/spec-driven-development.md) |

Public navigation/history and component behavior remain contracts to validate at runtime. T01 chooses defaults, not feature-specific schema/auth/storage/hosting mechanisms.

## Open inputs

| ID | Needed | Gate |
| --- | --- | --- |
| O01 | Company identity, role/dates, responsibility/team boundaries | Factual publication |
| O02 | Actual featured work, decisions/evidence, availability, curated grouping/order | Content-backed public design review |
| O03 | Real contact destinations/availability wording | Contact/publication |
| O05 | Auth/recovery, object/media storage, hosting/deployment, backup/restore, observability; feature-specific publication/cache mechanisms | Resolve when required by bootstrap/feature specs |

T01 is the approved architecture baseline. Application implementation still requires the T02 issue/spec workflow and any unresolved O05 decision needed by that feature.

## Superseded direction

Light-only V1 theme guidance is superseded by P14. Dark mode adapts Signal Studio; it does not select Night Instrument.

Former P01 Engineering Practice as a résumé/editorial public model, fixed introduction/experience/projects/about/contact sequence, quiet/neutral defaults, and career chronology are superseded. Problem/contribution/decision/outcome remains a shared content model. Work Atlas/Story Explorer and VS-B/VS-C are unselected history, not V1 modules.

Visual refinement in PR #2 is owner-approved. O04 is resolved by the 2026-10-03 rendered light/dark review; the reviewed images are approval evidence but are not repository implementation assets. Exact production font/library selection is an implementation detail and must preserve the approved visual character.

On change, record the owner's instruction/date and affected requirement/spec. Keep [design review](design-review.md) honest about written versus rendered/implemented evidence.
