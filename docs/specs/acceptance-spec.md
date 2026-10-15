# Integrated UX and Design Acceptance

Status: P19–P26 integrated acceptance map reconciled; all revised scenarios pending execution. Updated: 2026-10-15.
Authority: [public](ux-public-checkpoint.md), [Project/Story](project-story-spec.md), [owner content](owner-content-checkpoint.md), [Contact](contact-ux-checkpoint.md); historical W43 evidence separately scoped.
Authority: [PRD](../../PRD.md), [public UX](public-ux-spec.md), [owner UX](owner-ux-spec.md), [publishing](content-publishing-spec.md), [visual system](visual-system-spec.md), [components](components-interaction-spec.md).
Scope: complete public/owner product-design contract. Does not certify implementation, accessibility conformance, security, or production readiness.

## Acceptance map

| PRD target | Current scenario sources | Required outcome / not inferred | Later evidence |
| --- | --- | --- | --- |
| A01 | UXP01/UXP08/UXP15/UXP21, UXH10, PU01/PU06 | Combined identity/featured Project when configured; P26 largest feature, compact Story rows, smaller Project previews/mobile stacking; no-feature Home retains identity/eligible sections and Contact | Public task + approved revised Home source |
| A02 | UXH06/UXD04, UXP22, PU04 | Factual compact Home Experience and distinct dedicated About sections/links without duplicate full Experience or required company-detail page | Home/About work/context review |
| A03 | UXN01–UXN07, PS01–PS05, NS01–NS04 | Separate Project/Story routes, safe parent privacy, label filter then shared pin/latest sort, Load more/return | Deep links/filter/history tests |
| A04 | UXC01–UXC09, UXD01–UXD02/UXD08–UXD10, UXP18–UXP20, MV01–MV04/MV07 | One scrolling Project detail with open overview/contribution; zero/one/many vertically authored showcase items including >5 with optional captions; shared contextual Story presentation without forced templates; truthful no-media/never-launched cases | Rich/no-media/>5/CLI/backend/mobile samples |
| A05 | OWN01–OWN06, UXD06–UXD07, OU01–OU02/OU08 | Separate All items/Home selection and editors, minimum publish text, shared pins, Apply arrangement vs Save content | Owner workflow with test fixtures |
| A06 | PS06–PS13, OWN04–OWN05, CP01–CP04/CP08/CP11 | Confirmed bulk choice together-or-unchanged; explicit candidate publish/update; Apply edits arrangement alone; input retained | Failure/concurrency/atomicity checks |
| A07 | PS04–PS05, CP09, MV06 | Private Projects/Stories/parents/candidates/assets excluded from public metadata/navigation/counts | Authorization/asset delivery checks |
| A08 | PS08–PS10/PS13, OWN05, CP05–CP07, CT07/CT11 | Applied Home removal protects impacted records; Keep Stories/detach/Delete all and retry next actions clear | Removal/empty/error walkthrough |
| A09 | AR01–AR10, NS07, RV01–RV14, TH01–TH06, CT09/CT12 | 320px/keyboard/zoom/reduced motion, Contact/Privacy and P17 origin-aware Close/focus where figure-to-Evidence exists; theme/owner state preserved | Manual/runtime evidence; W43 tests historical |
| A10 | UXD01–UXD02/UXD06–UXD07, UXP04/UXP09, MV02 | Project contribution and Story context understandable without invented outcome/proof; minimum publish fields | Factual content/user explanation review |
| A11 | UXN05–UXN07, NS01–NS07, OWN04/OWN06 | Filters/load/return and pins stable; no automated related Story recommendations | Browsing/owner navigation tasks |
| A12 | VS01–VS06, UXP08/UXP17–UXP22, AR08 | Signal Studio P20/P25/P26 hero, previews, About, scrolling detail, vertical showcase and shared Story composition in owner-approved exact images; old art approval insufficient | VSRC revision/render comparison Pending |

A01–A12 retain their stable IDs; prior Story-as-Project/company-page/one-unit-only scenarios are **superseded historical W43 evidence**, not passed revised tests. All rows require new visual and runtime evidence for the P19–P26 product.

## Review procedure

1. Contract review now: check accepted decisions, scopes, source authority, cross-flow consistency, required states, and truthful unknowns.
2. Owner review: P10/P12 behavior and T01–T07 architecture/runtime defaults are approved. Remaining review concerns factual inputs, runtime evidence, and feature-specific implementation details.
3. Rendered wide light/dark direction was owner-approved on 2026-10-03; it is not an approved/retrievable new P15 source image. New meaningful UI requires [VSRC](visual-source-workflow-spec.md) and [registry](../visual-source-registry.md): actual proposed images → exact revision owner approval → later independent implementation-versus-source Design QA. P18 permits labelled fictional Project/Story/media-slot and honest fixture no-media/long-title/empty/error cases for mockups and non-production testing; these are **not genuine project captures or real-world publication claims**.
4. Implemented-interaction review only after separate authorization: execute public and owner tasks, failure/concurrency/privacy checks, and record exact head/environment/evidence.

Repeat public/owner/state reviews in both Light and Dark and with System resolved to each. TH01–TH06 cover preference, persistence/fallback, device changes, preserved editing/reading state, and first appearance; these are not executed checks.

Use labelled P18 fixture Projects/Stories including standalone/private-parent/public-parent, Project without Stories, all Home sections/no feature, label pins/republish, bulk Keep/Delete choices, minimum publish copy, Contact form/Privacy, missing media, stale dependency and empty collection. Real publication needs O01–O03; synthetic test fixtures must be labeled and never mistaken for public claims.
Use [Responsive & Interaction Validation](../responsive-interaction-validation.md) for RV01–RV14 including P26 UXP18–UXP22 and P15 media coverage, viewport/input/theme conditions and the Pending execution ledger. [MV01–MV08](media-evidence-spec.md#7-verification-boundary) add media-specific checks; all are unrun. Existing #23 text-only evidence does not validate media. This matrix does not approve draft behavior.
Pass/fail must identify observed behavior and evidence. Unknown/unrun is Pending, not Pass. If a requirement fails, record the smallest contract/design/implementation change and recheck its affected paths.

Apply P13's [visual refinement review](../visual-refinement-review.md) to A09/A12. Icon-first presentation preserves understandable actions and accessible names; tab semantics stay stable while styling is refined.

## Remaining readiness boundaries

O05 architecture defaults are resolved by T01–T07. Implementation acceptance must still verify authorization/recovery, transaction/retry identity, safe asset delivery/cache behavior, backup restore, and deployment on the exact implementation head.
O01–O03 gate actual public content, not P18 fixture-based visual approval or non-production testing. P17 figure-to-Evidence Close/focus applies wherever that flow exists without mandating Problem/Decisions sections or a gallery. W43 implementation evidence remains historical; P26-approved vertical Project showcase and contextual Story media presentation are requirements, while full-product Decisions behavior, exact rendered images, inspection/player controls and other unresolved P15 details are not approved. O04 visual approval is resolved: Signal Studio and the current rendered light/dark composition are approved. Exact production font/library remains an implementation detail; responsive/usability/accessibility evidence is still required. No automatic code, asset creation, or deployment authorization follows this document.
