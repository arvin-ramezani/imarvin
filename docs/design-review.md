# Product UX and Design Review

Status: historical PR #1 written contract review; O04 visual approval was later resolved in [current visual refinement](visual-refinement-review.md). Implemented/responsive/accessibility validation remains pending. Updated: 2026-10-03.
Starting PR #1 head: 05deeb4afbba1fcfd5b4b4ea9ad11382808b465b. Final commit/head is reported in the PR handoff; no circular self-SHA claim in this file.

## Fast owner review

Accepted: Personal Studio; featured work entry; projects-first browse; summary then sections; explicit private-save/publish; one owner/English/contact links; curated work without blog/AI; structured authoring; Signal Studio written direction.

| Requested step | Written result | Evidence limit |
| --- | --- | --- |
| Owner UX + publishing/content | [Owner UX](specs/owner-ux-spec.md), [content/publishing](specs/content-publishing-spec.md) | P10/P12 behavior later approved in PR #3; implementation mechanisms remain O05 |
| Three Personal Studio directions | [Visual exploration](visual-exploration.md): Signal Studio, Night Instrument, Specimen Desk | Written briefs; no generated images |
| Choose and specify | Owner selected Signal Studio; [visual system](specs/visual-system-spec.md), [components](specs/components-interaction-spec.md) | Historical PR #1 state; PR #2 later records rendered light/dark approval |
| Complete UX/design validation | Contract consistency and coverage reviewed; [A01–A12 acceptance](specs/acceptance-spec.md) mapped | Actual aesthetic/usability/accessibility/security checks unrun |

## Contract review

| Check | Finding / status |
| --- | --- |
| Scope and authority | One model; high-level choices separated from draft contracts; old project/UI not inherited |
| Public loop | Featured entry → work → section/evidence → contextual return or Contact; no forced CV/tour |
| Company cases | Separate Unixsee stories; previous main shop directly inspectable; one content source |
| Content honesty | No personal responsibilities/results/dates/contact invented; O01–O03 still gate publication |
| Owner/public separation | Private save and saved-candidate preview; explicit release; public-only projections/assets |
| Dependency bootstrapping | Resolved potential cycle: context-only experience → story → select main product explicitly |
| Removal | No auto-cascade/dependency publication; impact review, safe projection fallback, referenced-delete blocking |
| Failure and concurrency | Retained candidate/input; stale revisions rejected; uncertain outcome checked before retry |
| Accessibility and responsive | Public + owner contracts include keyboard/focus/error/reorder/confirmation and 320px/reflow/motion |
| Creative direction | Work-led offset stage and active signal motif; no equal-card/CV/dashboard default |
| Integrated acceptance | A01–A12 linked to scenario IDs and later evidence; no unrun check labeled Pass |

Document checks executed: 110 relative links, 44 Markdown tables, unchanged R01–R26/A01–A12 identifiers, and 42 unique flow-scenario IDs with valid acceptance references. Changed-file scope is Markdown only.

This is an author-led document review, not independent user testing or a screenshot audit.

## Proposed palette calculation

WCAG relative-luminance calculation for the exact proposed solid color pairs, without opacity or gradients:

| Foreground / background | Ratio | Review target |
| --- | --- | --- |
| Ink / canvas | 15.59:1 | 4.5:1 text |
| Muted ink / canvas | 6.43:1 | 4.5:1 text |
| Signal / canvas | 6.05:1 | 4.5:1 text |
| Ink / white surface | 17.44:1 | 4.5:1 text |
| Muted ink / white surface | 7.20:1 | 4.5:1 text |
| Signal / white surface | 6.76:1 | 4.5:1 text |
| Signal / signal wash | 5.64:1 | 4.5:1 text |
| White / signal action | 6.76:1 | 4.5:1 text |
| White / destructive action | 6.72:1 | 4.5:1 text |
| Boundary / canvas | 3.76:1 | 3:1 essential outline |
| Boundary / white surface | 4.21:1 | 3:1 essential outline |

All 11 tested pairs pass their stated numerical targets. This covers those solid pairs only; actual fonts, focus geometry, opacity, media, overlays, disabled/error states, and perceived readability remain unverified. Guidance is linked in [accessibility](specs/accessibility-responsive-spec.md).

## Remaining inputs and validation

- O01–O03: actual company/role/date/contribution facts, selected featured story/evidence, confirmed contact.
- O04: resolved in PR #2 by owner approval of the rendered wide light/dark Signal Studio direction; responsive/no-media/empty/error/accessibility checks remain separate validation.
- O05: architecture after product-design review; authentication/recovery, assets/storage, atomicity/retries/conflicts, safe public delivery/cache, operations.
- Owner: P11 visual system was approved in PR #2; P10 and P12 behavioral contracts were approved in PR #3.
- Later execution: public/owner task observation, keyboard/screen-reader/reflow checks, publication failure/concurrency/privacy tests, and exact-head evidence.

Written design work requested here is documented. No code, images, prototype, merge, or deployment. Use this review to accept/refine the design contracts before proceeding to architecture or separately requested rendered exploration.
