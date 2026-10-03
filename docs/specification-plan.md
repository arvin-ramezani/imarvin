# Specification Plan

Phase: complete written product-design contract for review. P01–P09/P13 record high-level choices; Signal Studio remains a working styling proposal; detailed behavior/visual values draft. Updated: 2026-10-03.

## Order and current status

1. Owner UX + publishing/content: drafted against P02–P04/P08; review detailed removal, dependencies, conflicts, and recovery.
2. Three written visual directions: explored; Signal Studio (P09) is the retained working proposal; styling refinement follows P13.
3. Visual system/components/responsive/interactions: drafted for the selected direction.
4. Current visual refinement: [refinement review](visual-refinement-review.md) records surface/control rules and public/owner wide/narrow contracts; no rendered screen review.
5. Complete UX/design: document review recorded in [design review](design-review.md); rendered and implemented validation pending.
6. Later: confirm real content/contact and evaluate an actual visual target when separately requested.
7. After product-design review: write architecture; then assign bounded implementation only with explicit authorization.

Stack selection is not required before visual design. These documents do not create a visual prototype or implement the product.

## Specification inventory

| Document | Status / coverage | PRD trace |
| --- | --- | --- |
| [Public UX](specs/public-ux-spec.md) | Draft entry/collection/detail/experience/contact; PU01–PU08 | R01–R11, R23–R26 |
| [Navigation/state](specs/navigation-state-spec.md) | Draft history/context/deep links/absence/failure/privacy; NS01–NS06 | R07, R11, R19–R25 |
| [Owner UX](specs/owner-ux-spec.md) | Draft authoring/preview/confirmation/recovery and owner accessibility; OU01–OU09 | R12–R21 |
| [Content/publishing](specs/content-publishing-spec.md) | Draft units/versions/reference/bootstrap/removal/concurrency; CP01–CP11 | R06–R09, R12–R19, R22 |
| [Accessibility/responsive](specs/accessibility-responsive-spec.md) | Draft public parity + shared reading/perception targets; AR01–AR08 | R20–R26 |
| [Visual system](specs/visual-system-spec.md) | Draft Signal Studio composition/tokens/type/space/responsive; VS01–VS05 | R01–R02, R20–R26 |
| [Components/interactions](specs/components-interaction-spec.md) | Draft public/owner responsibilities, states, behaviors | R01–R26 |
| [Acceptance](specs/acceptance-spec.md) | Draft integrated A01–A12 with stage-appropriate evidence | R01–R26 |
| architecture-spec.md | Planned after product-design review: auth/recovery/storage/assets, atomic delivery/cache, operations | R12–R19, R22 |

## Agent context

Each specification states status/dependencies, IDs, triggers/results, recovery/parity, scenarios, and open decisions. Read relevant contracts together; do not turn conceptual entities into a schema or components into a library mandate.

O01–O03 are factual gates; O04 requires exact typeface/rendered evaluation; O05 requires technical contracts. Written checks and palette calculations are not usability/security proof. Planned architecture is not an empty approved shell.

## Implementation readiness

Require reviewed behavioral/technical specifications, accurate evidence/contact, approved rendered visual target, and a bounded owner code request. Current documents-only instruction remains in force. No automatic merge, deployment, or restoration of the old CV homepage.
