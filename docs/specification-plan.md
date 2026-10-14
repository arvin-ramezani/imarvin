# Specification Plan

Phase: implementation underway. Existing behavior/visual direction and O05 runtime baseline approved; P15 full-product media UX remains proposed, P17 Close/focus accepted, W43 behavior bounded to Work. Delivery follows Issues #13/#54. Updated: 2026-10-14.

## Order and current status

P19/P20 [requirements checkpoint](ux-requirements-checkpoint.md) overrides affected legacy UX assumptions. First resume open requirement clarification, then reconcile specs/skills/fixture coverage and issue dependencies, then create and approve visual sources. Do not continue affected implementation from the old Project-as-Story or no-form model.

1. Owner UX + publishing/content: P10/P12 behavior approved; implementation mechanisms remain feature-specific.
2. Signal Studio visual direction and light/dark token foundation are approved and implemented.
3. Responsive/interaction contracts are written; rendered narrow/responsive, interaction, accessibility, empty/error, and implementation checks remain Pending. Meaningful new visual UI first requires [VSRC](specs/visual-source-workflow-spec.md) source images and exact-revision owner approval. #54 has a documentation workstream and a separately bounded image workstream.
4. O05 architecture/runtime baseline is resolved.
5. Minimal cross-cutting foundations come next: config/logging, PostgreSQL/Prisma base, owner auth, and theme/app-shell behavior.
6. After those foundations, implement bounded vertical feature slices rather than completing all backend or all UI layers first.
7. Perform runtime/live acceptance locally during development where possible.
8. Production deployment, backup/restore setup, observability hosting, and production acceptance are the final phase after local development is complete.

The selected stack is recorded in [technical architecture](architecture/architecture.md). Delivery order is tracked in GitHub Issue #13.

## Vertical-slice strategy

Each product feature should cross only the layers it actually needs:

`feature → schema/data → server rules → owner workflow → publish/public view → tests/acceptance`

Prefer a small end-to-end capability over a large database-only, backend-only, public-UI-only, or owner-UI-only phase.
Introduce media or additional shared infrastructure when the first bounded feature requires it.

## Specification inventory

| Document | Status / coverage | PRD trace |
| --- | --- | --- |
| [P19 public checkpoint](specs/ux-public-checkpoint.md) | Canonical owner-approved scoped requirements: UXH01–UXH08, UXN01–UXN06, UXC01–UXC06; checks UXP01–UXP07. P20 combined hero/later Home About resolved; UXD01–UXD05 working content direction and UXD06 unapproved publishing proposal; UXP08 Home/About check. Exact layouts/fields/gallery/nav details remain open | R01–R11, R23–R27 |
| [P19 Project/Story](specs/project-story-spec.md) | Canonical owner-approved relationships/visibility/lifecycle: PS01–PS12; checks PSP01–PSP08. Schema, migrations, bulk failure/concurrency and media cleanup remain open | R07, R13–R19, R22 |
| [P19 Contact checkpoint](specs/contact-ux-checkpoint.md) | Canonical owner-approved enquiry fields/channels: CT01–CT08; checks CTP01–CTP06. Conditional phone-only Telegram, delivery provider, privacy/spam and layout remain open | R10–R11, R20–R21 |
| [Public UX](specs/public-ux-spec.md) | Full-product proposals, bounded W43 Work and P17 Close/focus differentiated; PU01–PU09 | R01–R11, R23–R26 |
| [Media/evidence](specs/media-evidence-spec.md) | Full-product P15 proposed; W43 Work media + P17 accepted by scope, MV01–MV08 unrun | R04, R06, R08–R09, R13–R26 |
| [Navigation/state](specs/navigation-state-spec.md) | Draft history/context plus P17 approved Close/focus; NS01–NS07 | R07, R11, R19–R25 |
| [Owner UX](specs/owner-ux-spec.md) | Approved P12 behavior; proposed P15 media workflow; OU01–OU10 | R12–R21 |
| [Content/publishing](specs/content-publishing-spec.md) | Approved P10 lifecycle; proposed P15 media snapshot/projection extension; CP01–CP12 | R06–R09, R12–R19, R22 |
| [Accessibility/responsive](specs/accessibility-responsive-spec.md) | Draft public parity, P17 approved focus; AR01–AR10 | R20–R27 |
| [Visual system](specs/visual-system-spec.md) | Signal Studio direction approved; P15 variants not versioned/approved; responsive unvalidated | R01–R02, R20–R27 |
| [Components/interactions](specs/components-interaction-spec.md) | Draft public/owner responsibilities, states, behaviors | R01–R27 |
| [Acceptance](specs/acceptance-spec.md) | Draft integrated A01–A12 with stage-appropriate evidence | R01–R27 |
| [Responsive/interaction validation](responsive-interaction-validation.md) | Written review complete; RV01–RV14 execution Pending | A01–A06, A08–A12 |
| [Visual-source workflow](specs/visual-source-workflow-spec.md) / [registry](visual-source-registry.md) | #54 policy/registry; actual approved images pending separate design issue/PR | R20–R27 |
| [Technical architecture](architecture/architecture.md) | Accepted T01 stack/style/rendering/data/testing defaults | R12–R19, R22 |
| [Runtime operations](architecture/runtime-operations.md) | Accepted T03–T07 auth/storage/deployment/backup/logging baseline | R12, R19, R22 |
| [Spec-driven development](engineering/spec-driven-development.md) | Accepted T02 issue/spec/vertical-slice/PR/review workflow | Engineering process |

The three P19 contracts are approved requirements within their stated scopes, not complete UX, image or implementation approval. They take precedence over conflicting older inventory entries; older approval/status labels apply only to compatible scopes and historical delivery evidence.

Pending reconciliation: public/media/navigation, owner/publishing, components/accessibility and acceptance companions must align affected Home, Project/Story, Contact and lifecycle assumptions before dependent images or implementation. Fixture/VSRC guidance and [#56](https://github.com/arvin-ramezani/imarvin/issues/56) must use P19 now. Keep checkpoint open decisions deferred; do not infer schema migration, old-route deletion/redirect authorization or a new media player contract.

## Agent context

Each specification states status/dependencies, IDs, triggers/results, recovery/parity, scenarios, and open decisions. Read only relevant contracts together; do not turn conceptual entities into a schema or components into a library mandate.

O01–O03 are factual gates; O04 and O05 are resolved at design/architecture level. Exact auth bootstrap, media allowlist/paths, VPS unit/vhost, backup commands/credentials, and log retention settings are implementation-spec details. Exact production font/library remains an implementation detail. Written checks and palette calculations are not usability/security proof.

## Implementation readiness

Require a bounded issue plus accepted/linked implementation spec when needed and appropriate evidence before each implementation PR. Substantive new UI first needs approved exact-revision images under VSRC; small/nonvisual exceptions need rationale. W43 records historical bounded Work media/Problem figures, not a current mandatory P19 Project/Story layout or approval for new UI appearances. P19 governs affected future slices; reconcile their older companions first. O01–O03 remain factual gates.
The merged #23 story summary is deliberately text-only; do not rewrite its historical contract or treat media absence there as a failed requirement. P15 is design documentation, not approval to implement uploads/video.
Before the first media slice, Command Center validates the proposed UX and selects bounded work. Its implementation spec must pin schema/revisions, allowlist/size/duration/codec limits, private source/derivative delivery and removal/cache behavior, owner/public routes and tests. Keep T04's 10 MiB baseline unless separately justified/reviewed; do not assume a large-video pipeline or external provider.
Required future media gates: deterministic verification, Design QA, Security Review (uploads/private-public delivery), independent review and justified local runtime acceptance. Decompose still-image and recording support only when needed to retain one clear PR/session boundary; do not create the entire media backlog now.
During development, prefer local runtime acceptance. Do not begin production deployment/acceptance until development and local acceptance are complete.
