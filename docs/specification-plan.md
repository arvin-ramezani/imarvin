# Specification Plan

Phase: implementation underway. Existing behavior/visual direction and O05 runtime baseline are approved; P15 extends design documents with proposed media UX. Delivery follows Issue #13. Updated: 2026-10-07.

## Order and current status

1. Owner UX + publishing/content: P10/P12 behavior approved; implementation mechanisms remain feature-specific.
2. Signal Studio visual direction and light/dark token foundation are approved and implemented.
3. Responsive/interaction contracts are written; rendered narrow/responsive, interaction, accessibility, empty/error, and implementation checks remain Pending.
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
| [Public UX](specs/public-ux-spec.md) | Draft entry/collection/detail/experience/contact with P15 media; PU01–PU09 | R01–R11, R23–R26 |
| [Media/evidence](specs/media-evidence-spec.md) | P15 documentation brief; proposed placement/capture/playback/authoring; MV01–MV08 unrun | R04, R06, R08–R09, R13–R26 |
| [Navigation/state](specs/navigation-state-spec.md) | Draft history/context/deep links/absence/failure/privacy; NS01–NS06 | R07, R11, R19–R25 |
| [Owner UX](specs/owner-ux-spec.md) | Approved P12 behavior; proposed P15 media workflow; OU01–OU10 | R12–R21 |
| [Content/publishing](specs/content-publishing-spec.md) | Approved P10 lifecycle; proposed P15 media snapshot/projection extension; CP01–CP12 | R06–R09, R12–R19, R22 |
| [Accessibility/responsive](specs/accessibility-responsive-spec.md) | Draft public parity, media alternatives/player targets; AR01–AR09 | R20–R27 |
| [Visual system](specs/visual-system-spec.md) | Approved Signal Studio composition, light/dark roles and theme behavior; responsive states still require validation | R01–R02, R20–R27 |
| [Components/interactions](specs/components-interaction-spec.md) | Draft public/owner responsibilities, states, behaviors | R01–R27 |
| [Acceptance](specs/acceptance-spec.md) | Draft integrated A01–A12 with stage-appropriate evidence | R01–R27 |
| [Responsive/interaction validation](responsive-interaction-validation.md) | Written review complete; RV01–RV14 execution Pending | A01–A06, A08–A12 |
| [Technical architecture](architecture/architecture.md) | Accepted T01 stack/style/rendering/data/testing defaults | R12–R19, R22 |
| [Runtime operations](architecture/runtime-operations.md) | Accepted T03–T07 auth/storage/deployment/backup/logging baseline | R12, R19, R22 |
| [Spec-driven development](engineering/spec-driven-development.md) | Accepted T02 issue/spec/vertical-slice/PR/review workflow | Engineering process |

## Agent context

Each specification states status/dependencies, IDs, triggers/results, recovery/parity, scenarios, and open decisions. Read only relevant contracts together; do not turn conceptual entities into a schema or components into a library mandate.

O01–O03 are factual gates; O04 and O05 are resolved at design/architecture level. Exact auth bootstrap, media allowlist/paths, VPS unit/vhost, backup commands/credentials, and log retention settings are implementation-spec details. Exact production font/library remains an implementation detail. Written checks and palette calculations are not usability/security proof.

## Implementation readiness

Require a bounded issue plus accepted/linked implementation spec when needed and appropriate evidence before each implementation PR.
The merged #23 story summary is deliberately text-only; do not rewrite its historical contract or treat media absence there as a failed requirement. P15 is design documentation, not approval to implement uploads/video.
Before the first media slice, Command Center validates the proposed UX and selects bounded work. Its implementation spec must pin schema/revisions, allowlist/size/duration/codec limits, private source/derivative delivery and removal/cache behavior, owner/public routes and tests. Keep T04's 10 MiB baseline unless separately justified/reviewed; do not assume a large-video pipeline or external provider.
Required future media gates: deterministic verification, Design QA, Security Review (uploads/private-public delivery), independent review and justified local runtime acceptance. Decompose still-image and recording support only when needed to retain one clear PR/session boundary; do not create the entire media backlog now.
During development, prefer local runtime acceptance. Do not begin production deployment/acceptance until development and local acceptance are complete.
