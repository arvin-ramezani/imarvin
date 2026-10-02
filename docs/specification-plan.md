# Specification Plan

Phase: product/UX documents only. The creative product model is proposed; no implementation, images, or visual approval.

## Gates

1. Review creative concepts; approve P01 and resolve P02–P04.
2. Confirm work content, decisions, evidence, and grouping without inventing missing facts.
3. Write/review the specifications below, resolving states/navigation/publishing/privacy.
4. Select a visual target only when the owner requests visual work; approve usable composition/tokens.
5. After owner-approved specs and a separate code request, assign bounded agent tasks with requirement IDs.
6. Review actual implementation and exact head; deployment remains separately authorized.

## Specifications to write next

| Planned file | Coverage | PRD trace |
| --- | --- | --- |
| public-ux-spec.md | Entry/core loop; collection/selection; decision/evidence inspection; company multi/main-product cases; direct personal context/contact; responsive view changes | R01–R11, R24–R26 |
| navigation-state-spec.md | Routes/deep links; browser Back; selection/filter context; reset; loading/empty/error/unavailable states; mobile/keyboard equivalents | R07, R11, R20–R22, R24–R25 |
| owner-ux-spec.md | Auth/recovery; story/decision/evidence editing; grouping/feature/order; uploads; private preview; confirmation/error recovery | R12–R15, R18 |
| content-publishing-spec.md | Fields/relationships; story/evidence reuse; draft/public versions; publish/update/unpublish/delete; linked-item visibility; broken-reference prevention | R06–R09, R13–R19 |
| accessibility-responsive-spec.md | Type/readability; focus/contrast; collection-to-detail behavior; touch/320px; media alternatives and reduced motion | R20–R21, R23–R26 |
| architecture-spec.md | Justified frontend/backend/storage/auth/assets; safe public delivery and cache freshness; account recovery, hosting, backups | R12–R19, R22 |
| acceptance-spec.md | A01–A12 scenarios; core-loop and anti-résumé review; failures/privacy; actual evidence methods and requirement mapping | R01–R26 |

These are planned files, not approved specifications. Use docs/specs when this phase starts; do not create empty shells masquerading as finished contracts.

## Specification format

Each document: status/dependencies → requirement IDs → entities or states → user triggers/results → back/reset/failure → mobile/keyboard/accessibility → acceptance → non-goals/open decisions.

Define behavior before component, library, database, or endpoint choices. Resolve conceptual UX without prescribing arbitrary animation or visual assets.

## Implementation readiness

Owner approves the chosen product model/specs and assigns implementation. Navigation/publishing privacy is resolved; evidence remains accurate; each task names states and checks; a visual target precedes frontend UI work. No restoration of the old CV homepage.

AI agents read README/AGENTS/decisions/PRD plus relevant approved specs. Missing media, metrics, or live URLs do not justify fabricated content. Documentation is not evidence of usability or production readiness.
