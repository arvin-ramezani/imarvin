# Integrated UX and Design Acceptance

Status: review contract; P15 media extension added, execution pending | Updated: 2026-10-07.
Authority: [PRD](../../PRD.md), [public UX](public-ux-spec.md), [owner UX](owner-ux-spec.md), [publishing](content-publishing-spec.md), [visual system](visual-system-spec.md), [components](components-interaction-spec.md).
Scope: complete public/owner product-design contract. Does not certify implementation, accessibility conformance, security, or production readiness.

## Acceptance map

| PRD target | Scenario sources | Observable pass condition | Later evidence |
| --- | --- | --- | --- |
| A01 | PU01, PU06; R01–R02, R10–R11 | Entry's purpose/action understood; approved Contact reachable without story completion | Visitor task observation + rendered entry/contact |
| A02 | PU04, CP11; R03–R05, R14 | Unixsee offers separate projects; main shop appears directly; initial publication has no circular prerequisite | Both rendered cases, bootstrap sequence, actual links |
| A03 | PU02, NS01–NS04; R06–R07 | Work/company/decision paths reuse story; deep links and contextual return match | Navigation/history walkthrough |
| A04 | PU03, PU05, PU07, PU09, AR06, MV01–MV02/MV07; R08–R09, R23 | Cancelled/offline/never-shipped stories complete with truthful capture stage or no media; missing sections/links produce no dead controls | Content/capture review + absence/failure walkthrough |
| A05 | OU01–OU02, OU08/OU10, MV05; R12–R16 | Owner edits/associates/orders/features text and media, previews and publishes with structured UI | Owner task run, without source editing |
| A06 | OU03–OU05/OU10, CP01–CP04/CP08/CP12, MV05–MV06; R16–R18 | Save stays private; explicit successful update changes text/media/projections; failure/conflict retains input/public version | Before/after public checks + injected failure/concurrency evidence |
| A07 | OU09, CP02/CP09/CP12, MV06; R12, R19, R22 | Anonymous draft/preview/asset/poster/rendition/track/owner access denied; public metadata/counts published only | Architecture-dependent authorization/delivery verification |
| A08 | NS04–NS05, OU06–OU07, CP05–CP07; R11, R18 | Empty/error/unavailable/removal states explain next actions and correct impact | Representative state walkthrough + destructive-action checks |
| A09 | NS06, AR01–AR07/AR09, OU08, TH01–TH06, MV03–MV05/MV07–MV08; R20–R21, R23, R25, R27 | Public/owner/media loops work in Light/Dark/System at 320px, keyboard, zoom, reduced motion; alternatives complete, theme/state preserved | Manual accessibility/responsive/player tasks; focus/reflow evidence |
| A10 | PU01, PU03, PU05/PU09, MV02/MV07; R06, R08–R09, R24 | Summary identifies contribution; decisions/outcomes and visual proof limits grounded in approved facts | Content/capture review and visitor explanation task |
| A11 | PU02, PU05, NS01–NS03; R11, R24–R25 | Selection reveals meaningful content; return restores origin and collection state | State/history interaction walkthrough |
| A12 | PU08, AR08, VS01–VS06, MV01/MV04; R01, R26–R27 | Work-led offset stage, project imagery, hierarchy and inspection recognizable without CV/grid skeleton; no prescribed decorative motifs | Rendered composition review with real/no-media work; not prose approval alone |

## Review procedure

1. Contract review now: check accepted decisions, scopes, source authority, cross-flow consistency, required states, and truthful unknowns.
2. Owner review: P10/P12 behavior and T01–T07 architecture/runtime defaults are approved. Remaining review concerns factual inputs, runtime evidence, and feature-specific implementation details.
3. Rendered wide light/dark direction was owner-approved on 2026-10-03. Remaining design validation uses real featured content plus no-media/long-title/empty/error cases and compares narrow/responsive and owner/public states against that approved direction.
4. Implemented-interaction review only after separate authorization: execute public and owner tasks, failure/concurrency/privacy checks, and record exact head/environment/evidence.

Repeat public/owner/state reviews in both Light and Dark and with System resolved to each. TH01–TH06 cover preference, persistence/fallback, device changes, preserved editing/reading state, and first appearance; these are not executed checks.

Use published-story, draft-edit, cancelled/offline, main-product, multi-project, missing evidence, stale dependency, and empty collection fixtures. Real publication needs O01–O03; synthetic test fixtures must be labeled and never mistaken for public claims.
Use [Responsive & Interaction Validation](../responsive-interaction-validation.md) for RV01–RV14 and P15 media coverage, viewport/input/theme conditions and the Pending execution ledger. [MV01–MV08](media-evidence-spec.md#7-verification-boundary) add media-specific checks; all are unrun. Existing #23 text-only evidence does not validate media. This matrix does not approve draft behavior.
Pass/fail must identify observed behavior and evidence. Unknown/unrun is Pending, not Pass. If a requirement fails, record the smallest contract/design/implementation change and recheck its affected paths.

Apply P13's [visual refinement review](../visual-refinement-review.md) to A09/A12. Icon-first presentation preserves understandable actions and accessible names; tab semantics stay stable while styling is refined.

## Remaining readiness boundaries

O05 architecture defaults are resolved by T01–T07. Implementation acceptance must still verify authorization/recovery, transaction/retry identity, safe asset delivery/cache behavior, backup restore, and deployment on the exact implementation head.
O01–O03 remain factual-content/contact gates. O04 visual approval is resolved: Signal Studio and the current rendered light/dark composition are approved. Exact production font/library remains an implementation detail; responsive/usability/accessibility evidence is still required. No automatic code, asset creation, or deployment authorization follows this document.
