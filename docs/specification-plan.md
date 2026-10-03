# Specification Plan

Phase: architecture/spec-driven implementation planning. Product behavior/visual direction and O05 technical/runtime baseline are approved; runtime validation and feature implementation remain. Updated: 2026-10-03.

## Order and current status

1. Owner UX + publishing/content: P10/P12 behavior approved; implementation mechanisms remain for O05 architecture and runtime verification.
2. Three written visual directions: explored; Signal Studio (P09) is approved; refinement follows P11/P13/P14.
3. Visual system/components/responsive/interactions: drafted for the selected direction.
4. Current visual refinement: [refinement review](visual-refinement-review.md) records approved surface/control rules, Light/Dark/System support, and owner-approved rendered wide public/owner direction.
5. [Responsive & Interaction Validation](responsive-interaction-validation.md): written contract review complete; RV01–RV14 define profiles, tasks, recovery and evidence. Rendered narrow/responsive, interaction, accessibility, empty/error, and implemented checks remain Pending.
6. Confirm real content/contact (O01–O03); separately authorized responsive rendered/task review compares with the approved wide target.
7. O05 baseline is resolved; next create bounded bootstrap/feature issues/specs and implement only through reviewed PRs.

The selected stack is recorded in [technical architecture](architecture/architecture.md). These documents do not implement the product.

## Specification inventory

| Document | Status / coverage | PRD trace |
| --- | --- | --- |
| [Public UX](specs/public-ux-spec.md) | Draft entry/collection/detail/experience/contact; PU01–PU08 | R01–R11, R23–R26 |
| [Navigation/state](specs/navigation-state-spec.md) | Draft history/context/deep links/absence/failure/privacy; NS01–NS06 | R07, R11, R19–R25 |
| [Owner UX](specs/owner-ux-spec.md) | Approved P12 save/review/recovery/conflict/confirmation behavior; OU01–OU09; technical mechanisms pending | R12–R21 |
| [Content/publishing](specs/content-publishing-spec.md) | Approved P10 lifecycle/reference/bootstrap/removal/concurrency behavior; CP01–CP11; mechanisms pending | R06–R09, R12–R19, R22 |
| [Accessibility/responsive](specs/accessibility-responsive-spec.md) | Draft public parity + shared reading/perception targets; AR01–AR08 | R20–R26 |
| [Visual system](specs/visual-system-spec.md) | Approved Signal Studio composition, light/dark roles and theme behavior; responsive states still require validation; VS01–VS05, TH01–TH06 | R01–R02, R20–R27 |
| [Components/interactions](specs/components-interaction-spec.md) | Draft public/owner responsibilities, states, behaviors | R01–R27 |
| [Acceptance](specs/acceptance-spec.md) | Draft integrated A01–A12 with stage-appropriate evidence | R01–R27 |
| [Responsive/interaction validation](responsive-interaction-validation.md) | Written review complete; RV01–RV14 execution Pending | A01–A06, A08–A12; architecture-dependent parts remain separate |
| [Technical architecture](architecture/architecture.md) | Accepted T01 stack/style/rendering/data/testing defaults | R12–R19, R22 |
| [Runtime operations](architecture/runtime-operations.md) | Accepted T03–T07 auth/storage/deployment/backup/logging baseline | R12, R19, R22 |
| [Spec-driven development](engineering/spec-driven-development.md) | Accepted T02 issue/spec/PR/review workflow | Engineering process |

## Agent context

Each specification states status/dependencies, IDs, triggers/results, recovery/parity, scenarios, and open decisions. Read relevant contracts together; do not turn conceptual entities into a schema or components into a library mandate.

O01–O03 are factual gates; O04 and O05 are resolved at design/architecture level. Exact auth bootstrap, media allowlist/paths, VPS unit/vhost, backup commands/credentials, and log retention settings are implementation-spec details, not open architecture decisions. Exact production font/library remains an implementation detail, not a product-design blocker. Written checks and palette calculations are not usability/security proof. Planned architecture is not an empty approved shell.

## Implementation readiness

Require a bounded issue plus accepted/linked implementation spec and appropriate evidence before each implementation PR. The rendered visual target is approved. No automatic deployment or restoration of the old CV homepage.
