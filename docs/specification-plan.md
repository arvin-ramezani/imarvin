# Specification Plan

Phase: product/UX documents only. P01 Personal Studio and P05–P07 public-flow choices are accepted. Detailed contracts are drafts; no implementation, images, or visual approval.

## Gates

1. Review drafted public-flow contracts against the selected entry/browse/detail choices.
2. Resolve P02–P04 before finalizing dependent scope/publishing contracts.
3. Confirm O01–O03 work facts, featured story, evidence, grouping, and contact.
4. Write/review remaining owner, publishing, architecture, and integrated acceptance specifications.
5. Select a visual target only when the owner requests visual work; approve composition/tokens against UX contracts.
6. After approved behavioral/technical specs and a separate code request, assign bounded agent tasks with requirement IDs.
7. Review actual implementation and exact head; deployment remains separately authorized.

## Specification inventory

| File | Status / coverage | PRD trace |
| --- | --- | --- |
| [public-ux-spec.md](specs/public-ux-spec.md) | Draft: entry, collection, detail/sections/evidence, company cases, personal context/contact; PU01–PU08 | R01–R11, R23–R26 |
| [navigation-state-spec.md](specs/navigation-state-spec.md) | Draft: locations, history, origin/return, loading/empty/error/unavailable, public privacy; NS01–NS06 | R07, R11, R19–R25 |
| [accessibility-responsive-spec.md](specs/accessibility-responsive-spec.md) | Draft public scope: reflow, focus, keyboard, media alternatives, reduced motion; AR01–AR08 | R20–R26 |
| owner-ux-spec.md | Planned: auth/recovery, authoring, grouping/feature/order, uploads, private preview, confirmation/error recovery; owner accessibility | R12–R15, R18, R20–R21 |
| content-publishing-spec.md | Planned: relationships, draft/public versions, publish/update/unpublish/delete, reference integrity | R06–R09, R13–R19 |
| architecture-spec.md | Planned: frontend/backend/storage/auth/assets, published delivery/cache freshness, recovery, hosting/backups | R12–R19, R22 |
| acceptance-spec.md | Planned: integrated A01–A12 including owner lifecycle/privacy and actual verification evidence | R01–R26 |

Written scenarios are review targets, not executed tests. The public accessibility draft does not complete owner-dashboard coverage. Planned files are not approved contracts; do not create empty shells.

## Specification format

Each document: status/dependencies → requirement IDs → entities/states → triggers/results → back/reset/failure → mobile/keyboard/accessibility → acceptance → non-goals/open decisions.

Define behavior before component, library, database, or endpoint choices. Resolve conceptual UX without prescribing arbitrary animation or visual assets.

## Implementation readiness

Require approved specifications, resolved navigation/publishing privacy, accurate evidence, and a bounded owner implementation request. Frontend UI work also needs a selected visual target. No restoration of the old CV homepage.

AI agents read README/AGENTS/decisions/PRD plus relevant specs and their status. Missing media, metrics, or live URLs never justify fabricated content. Documentation is not proof of usability or production readiness.
