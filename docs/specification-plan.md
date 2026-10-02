# Specification Plan

Phase: product/design foundations now; implementation specifications next. No application work is authorized.

## Sequence and review gates

1. Review PRD and written concepts; resolve P01–P04 and any product-scope changes.
2. Confirm content structure with the owner's work; separate missing facts from publishable copy.
3. Write and review the specifications below. Resolve behavior and technical dependencies before assigning agent code.
4. After owner approval and a separate implementation request, divide work into bounded tasks tied to requirement IDs.
5. Review implementation against approved specifications and acceptance evidence. Deployment requires its own instruction.

Documentation approval is distinct from implementation authorization. Visual exploration, when requested later, is a separate design activity; no visual target or visual-validation claim exists in this PR.

## Documents to write next

| Planned file | Required decisions/coverage | PRD trace |
| --- | --- | --- |
| public-ux-spec.md | Routes and anchors; homepage; experience multi-project vs main-product; canonical selected-story links; contact; navigation and empty/loading/error/not-found states | R01–R11, R24 |
| owner-ux-spec.md | Sign-in/out/recovery UX, editing/association/order/feature selection, uploads, preview, confirmation and failure recovery | R12–R15, R18 |
| content-publishing-spec.md | Content fields/relationships; drafts vs public versions; publish/update/unpublish/delete; linked-story and evidence visibility; broken-reference prevention | R06–R09, R13–R19 |
| accessibility-responsive-spec.md | Keyboard/focus, labels/contrast, reading hierarchy, reduced motion, touch, desktop/mobile/320px, media alternatives | R20–R21, R23–R24 |
| architecture-spec.md | Approved frontend/backend/storage, auth/account recovery, asset access, public delivery/cache freshness, deployment and backup/restore; justify choices with scope | R12–R19, R22 |
| acceptance-spec.md | Testable scenarios and evidence for A01–A10; define failures/security/privacy checks and requirement-to-scenario mapping | R01–R24 |

Planned filenames are not claims that these files already exist. Choose a docs/specs location when this phase starts; all links must be updated together. Do not create empty shells that look approved.

## Agent implementation readiness

- Owner has accepted product/concept/scope and assigned implementation.
- Each task names approved specs, requirements, affected states, and verification.
- Publishing/link behavior is resolved; privacy includes asset and preview access, not only UI hiding.
- Stack/auth decisions are justified and approved; no agent silently imports its preferred framework.
- A visual target/tokens are approved before frontend UI implementation.
- Factual content blockers are documented; missing metrics or live URLs are never fabricated.
- Review records the exact implementation head and actual evidence.

AI prompts should instruct agents to read README, AGENTS, decisions, PRD, and only relevant approved specs. Include non-goals and stop conditions. The current documents are a foundation, not a production-readiness certificate.
