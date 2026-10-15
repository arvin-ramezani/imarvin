# Decisions

Updated: 2026-10-15. Confirmed = owner constraint. Accepted = owner-approved choice. Proposed = detailed behavior/value for review. Open = missing input. Superseded = do not implement.

Authority: arvin-ramezani/imarvin only. No inheritance from the older project. Documentation and concept selection do not authorize code, images, merge, or deployment.

## Confirmed constraints

| ID | Decision |
| --- | --- |
| C01 | Fresh personal web app, separate from the older project |
| C02 | Employment/freelance outcomes do not prescribe a CV layout |
| C03 | Private dashboard for content editing |
| C04 | Company identity/header uses logos/name only; no company photos/screenshot covers. Project media can appear in project choices/main stories within company context (P15 clarification) |
| C05 | Prior multi-project/main-product Experience model; P19 replaces public company-detail presentation with compact Home credibility and optional Project links; old routes require reconciliation |
| C06 | Premium/simple means focused/intentional, not mandatory visual quietness |
| C07 | Current design task is documents/knowledge only; explaining future image/video use does not authorize creating assets, prototype, application code or deployment |
| C08 | Source repository arvin-ramezani/imarvin; requirements file PRD.md |
| C09 | Creative personal web app; rejected portfolio/résumé and boring editorial direction |
| C10 | Concise English, structured AI context; factual unknowns remain explicit |

## Accepted choices

| ID | Choice | Owner evidence / trace |
| --- | --- | --- |
| P01 | Personal Studio: select work, inspect decisions/evidence, retain context | 2026-10-03: “I choose Personal Studio”; product model, not every detailed contract |
| P02 | Save private draft → preview → explicit Publish/Update; old public version stays until success | 2026-10-03: chose Explicit publishing; R16–R18, A06 |
| P03 | One owner and English public content retained; contact presentation/no-form restriction superseded by P19 | 2026-10-03: chose Yes, focused V1; R10, R12, A01 |
| P04 | Curated work/decisions/evidence; no blog/community/customer portal/AI generation | 2026-10-03: chose Yes, focused V1; PRD V1 boundaries |
| P05 | Entry leads with one featured work; P19 clarifies this as a Project within the approved Home sequence | 2026-10-03: chose One featured work; actual story remains O02; R01–R02 |
| P06 | Projects-first browse; secondary company context | 2026-10-03: chose Projects first; filter details draft; R03–R07 |
| P07 | Summary then selectable sections | 2026-10-03: chose Summary then sections; exact state/history details draft; R06, R24–R25 |
| P08 | Structured authoring; design controls page layout | 2026-10-03: chose Structured content; R13–R15, A05 |
| P09 | VS-A Signal Studio — approved visual direction | 2026-10-03: owner approved the refined rendered direction after light/dark review; R26, A12 |
| P10 | Atomic per-unit publication; context-first main-product bootstrap; safe unpublish projections; referenced-delete blocking | 2026-10-03: owner approved the reviewed publishing/removal/concurrency contract. [Content/publishing](specs/content-publishing-spec.md). |
| P12 | Explicit save, candidate review, conflict/session recovery, accessible owner confirmations | 2026-10-03: owner approved the reviewed owner save/recovery/conflict contract. [Owner UX](specs/owner-ux-spec.md). |
| P13 | Hierarchy/icons/shape/spacing/state first; short supporting labels; selective decoration | 2026-10-03: owner chose Refine the proposal and supplied this visual-priority preference. Styling in visual-system-spec; essential action meanings remain clear. |
| P14 | Light + Dark across public/owner views; System default with System/Light/Dark choice | 2026-10-03: owner approved light/dark support and current dark treatment. R27; implementation mechanism remains technical. |
| P11 | Current Signal Studio visual system: refined hierarchy/surfaces/controls, approved light/dark palette target, responsive composition intent | 2026-10-03: owner approved the rendered public/owner visual direction and requested PR #2 record that approval. [Visual system](specs/visual-system-spec.md). |
| P15 | Extend product/UI/UX documents with purposeful project images/video, including cancelled or never-shipped work and recorded animations | 2026-10-07: owner requests documentation updates only, explicitly excludes image/app creation. [Media/evidence](specs/media-evidence-spec.md); detailed placement/player/authoring proposals await review, not covered by earlier rendered approval. |
| P16 | Owner/admin UI uses no interface animation or transitions at any screen size; public UI uses purposeful motion where it improves UX across public routes/screen sizes, with reduced-motion parity and CSS-first implementation | 2026-10-07 owner instruction. Framer Motion is public-only when CSS is insufficient. User-controlled project media playback is content, not owner UI chrome motion. [UI skill policy](engineering/ui-skill-policy.md). |
| P17 | Close of Evidence opened from a Problem/Decisions figure restores that section and focuses its figure, or a safe visible heading if unavailable. Evidence-origin/direct-link Close stays in Evidence with valid focus. | 2026-10-12 owner confirmation of UX-A01; [navigation](specs/navigation-state-spec.md), [media](specs/media-evidence-spec.md), [accessibility](specs/accessibility-responsive-spec.md). Only this Close/focus rule is accepted; other P15 media proposals remain unapproved. |
| P18 | UI/UX mockups and non-production development/tests use explicitly synthetic fixture data, not real projects, customer records, real contact destinations, or actual project Evidence. Assume project-owner media permission for planning; do not present synthetic captures as real or include sensitive information. | 2026-10-12 owner instruction; [visual workflow](specs/visual-source-workflow-spec.md), [content fixtures](content-inventory.md#screen-scoped-visual-content-gates). Fixture approval is visual only; O01–O03 still gate actual public publication. |
| P19 | Approved UX requirements checkpoint: distinct Projects/optional-parent Stories, Home order/Experience/offerings, browse/labels/navigation, private/public/bulk/removal and form/direct contact. Supersedes affected P03/P05/P07/P10 and C05 assumptions only; full design/implementation remains open. | Owner clarification/approvals on 2026-10-14 through 06:35 Asia/Tehran; [checkpoint and authority map](ux-requirements-checkpoint.md). Later routine media usability defaults recorded in the checkpoint; exact media/field/layout details remain open; no assets/code authorized. |
| P20 | Home combines concise identity and one Featured Project in an open/asymmetric hero, then Stories → More Projects → Experience → About introduction → How I can help → Contact. Home About scrolls to its later section; More about me opens About. Supersedes earlier separate hero/feature order and hero-contained About proposal; exact images/layout remain unapproved. | Explicit owner “approved” at 18:59 Asia/Tehran on 2026-10-14; [public checkpoint](specs/ux-public-checkpoint.md), UXH01–UXH08/UXN02/UXP08. |
| P21 | Required Project/Story publishing minima, simplified optional Project status, conditional Telegram identity/no Contact attachments, and content-list selection/ordering. Replaces UXD06's proposed status and the Site settings/Home or Project-editor ordering proposals; fixed P20 Home and existing lifecycle rules stay. | Explicit owner approvals 2026-10-14 at 19:32 (Project), 19:34 (Story), 19:39 (status), 19:40 (Telegram), 19:41 (no attachments), 19:58 (ordering); [public](specs/ux-public-checkpoint.md), [Contact](specs/contact-ux-checkpoint.md), [owner content](specs/owner-content-checkpoint.md). |
| P22 | Manual ordering Home-only; shared entry pins with last-pinned-first priority and latest unpinned entries, filter first; private All items/Home selection views and separate editors; explicit Apply/Discard/navigation warning and failure recovery. Story requirements retain designed hierarchy/simple implementation; component/editor structure deferred until high-level UX is complete. Supersedes P21 collection/per-Project manual ordering and arrangement Publish/Update wording. | Owner approvals 2026-10-14 at 20:15 (pin timestamp/order), 20:37 (filter), 20:42 (shared pin), 20:47 (Apply), 20:58 (views), 20:59 (discard/leave), 21:01 (failure); corrections/instruction 21:03–21:08 (Story/process). [Public](specs/ux-public-checkpoint.md), [owner content](specs/owner-content-checkpoint.md), [checkpoint](ux-requirements-checkpoint.md). |
| P23 | Successfully apply manual Home replacement/removal before unpublish/delete; Contact acceptance confirmation in place with retained-input retry/direct channels, no account/automatic confirmation email; email inbox handling without dashboard enquiry management; no automatic related-Story suggestions; short Contact privacy note and simple Privacy page. | Owner approvals: 2026-10-14 21:22 (Home protection); 2026-10-15 00:40 (Contact result), 01:26 (email handling), 01:27 (Story suggestions), 01:30 (Privacy), Asia/Tehran. [Relationship](specs/project-story-spec.md) PS09, [Contact](specs/contact-ux-checkpoint.md) CT05/CT11–CT12, [public](specs/ux-public-checkpoint.md) UXC09. |
| P24 | Closes journey-audit JG01–JG04: no-feature Home keeps identity/available sections without automatic replacement; confirmed Project bulk actions succeed together or leave affected entries unchanged; unpublish/republish preserves pin priority; labels may be renamed/deleted without deleting Projects/Stories. | Explicit owner approvals 2026-10-15, Asia/Tehran: 01:47, 01:49, 02:03, 02:04 respectively. Canonical UXH09/UXN07, PS13 and OWN06; [audit](ux-journey-audit.md) records closure, not runtime proof. |
| P25 | Approved detail information hierarchies: Project name/overview → contribution → optional showcase → secondary facts/links → published Stories; Story title/introduction → explanation with contextual optional media, labels/public Project link secondary. Supersedes UXD01's facts-before-showcase working order. | Clickable owner Approved responses 2026-10-15 at 02:21 (Project), 02:22 (Story), Asia/Tehran; [UXD01–UXD02](specs/ux-public-checkpoint.md). Exact editor fields/components/layouts/images remain unapproved. |

| P26 | Post-#55 presentation refinements and approval of existing preview/About working direction; canonical UXH10, UXD03–UXD04/UXD08–UXD10 and UXP18–UXP22. Existing UXH06 Experience/Contact requirements are retained without duplicate definitions. | Clickable owner approvals on 2026-10-15 after #55 merge, through 06:12 Asia/Tehran; [public checkpoint](specs/ux-public-checkpoint.md). Presentation scope only; no editor/schema, exact-image, implementation or runtime approval. |

## Architecture baseline

| ID | Decision | Authority |
| --- | --- | --- |
| T01 | Server-first Next.js 16+ App Router modular monolith; React 19+, PostgreSQL + Prisma, npm, Tailwind 4+, shadcn/Base UI, Zod + React Hook Form, Framer Motion, Vitest; avoid unnecessary client rendering/React Query | [Technical architecture](architecture/architecture.md) |
| T02 | Spec-driven delivery: issue → linked spec when needed → implementation → PR → independent review/checks → merge | [Engineering workflow](engineering/spec-driven-development.md) |
| T03 | Better Auth + Prisma/PostgreSQL, email/password only, one provisioned owner, no public signup/reset-email flow; SSH-only emergency recovery | [Runtime operations](architecture/runtime-operations.md) |
| T04 | VPS filesystem media outside deploy/public tree; native Next.js FormData first, no Multer; app-authorized media delivery | [Runtime operations](architecture/runtime-operations.md) |
| T05 | Ubuntu VPS, one systemd-managed Next.js process behind OpenLiteSpeed, local PostgreSQL; DirectAdmin is not an app dependency | [Runtime operations](architecture/runtime-operations.md) |
| T06 | Encrypted restic backups via rclone to Google Drive; pg_dump + uploads, 6-hour target, tested restores | [Runtime operations](architecture/runtime-operations.md) |
| T07 | Small observability layer: Pino JSON → stdout/journald, correlation IDs, health check, external uptime check | [Runtime operations](architecture/runtime-operations.md) |

Public navigation/history and component behavior remain contracts to validate at runtime. T01–T07 choose architecture defaults; feature specs own exact schema, commands, limits, and deployment details.

## Delegated working direction and pending proposals
The owner requested PR documentation after delegated Project/Story/detail/preview/About exploration. [Public checkpoint](specs/ux-public-checkpoint.md) now distinguishes approved UXD01–UXD02 detail hierarchy from working UXD03–UXD05 previews/About/authoring; exact controls/schema/rendered composition remain unapproved. P21 subsequently approves UXD06–UXD07 publishing minima; optional inputs remain optional. P22 withdraws premature Story editor/heading/repeatable-group proposals; those are not approved requirements. First complete high-level UX, then component design. P24 closes the [journey audit](ux-journey-audit.md)'s four identified product gaps; P25 approves detail hierarchy only. High-level closure does not approve editor/component choices or replace required legacy reconciliation. Bounded implementation contracts still own exact validation/limits and publication units.

## Open inputs

| ID | Needed | Gate |
| --- | --- | --- |
| O01 | Company identity, role/dates, responsibility/team boundaries | Factual publication |
| O02 | Actual featured work, decisions/evidence/files and permission, captured stage, release history/availability, curated grouping/order | Real content publication, not fixture-based UI mockups/tests |
| O03 | Real contact destinations/availability wording | Contact/publication |

O05 is resolved at architecture level by T01/T03–T07. Application implementation still requires the T02 issue/spec workflow and feature-specific technical details. P18 applies only to mockups, development and tests: it does not clear factual publication gates, production permissions or public media review.

## Superseded direction

Light-only V1 theme guidance is superseded by P14. Dark mode adapts Signal Studio; it does not select Night Instrument.
Inspection-only project media placement is superseded by P15's proposed entry/browse/lead/contextual placements. Logos-only company identity and complete no-media stories remain required. Earlier rendered evidence does not validate the new media compositions.

P19 replaces the earlier Project-as-Story, no-form/contact-only-links, company-detail and conflicting lifecycle assumptions. P20 is the latest explicit Home order/hero/About revision; preserve historical rendered/implementation evidence within its original scope.

Former P01 Engineering Practice as a résumé/editorial public model, fixed introduction/experience/projects/about/contact sequence, quiet/neutral defaults, and career chronology are superseded. Problem/contribution/decision/outcome remains a shared content model. Work Atlas/Story Explorer and VS-B/VS-C are unselected history, not V1 modules.

Visual refinement in PR #2 is owner-approved. O04 is resolved by the 2026-10-03 rendered light/dark review; the reviewed images are approval evidence but are not repository implementation assets. Exact production font/library selection is an implementation detail and must preserve the approved visual character.

On change, record the owner's instruction/date and affected requirement/spec. Keep [design review](design-review.md) honest about written versus rendered/implemented evidence.
