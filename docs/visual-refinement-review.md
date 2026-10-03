# Visual Refinement Review

Status: written design refinement for review; no rendered/interaction validation. Updated: 2026-10-03.
Base: merged PR #1, main at 342f9b657e1cb71dae665a20e2dab3d5f067d170. New work is a separate documentation PR.
Authority: [decisions](decisions.md), [visual system](specs/visual-system-spec.md), [components](specs/components-interaction-spec.md). No code, images, or generated assets.

## Owner brief

Retain Signal Studio as a proposal to refine. Use hierarchy, icons, shape, spacing, and state changes first; keep text labels short and secondary. Selective decoration is allowed.
Personal Studio flows, company logos-only, offline/no-media support, and explicit private-save/publish remain intact.

## What changes

| Earlier instruction | Refined contract |
| --- | --- |
| Repeated cobalt active edge/bracket as signature | Optional local cue; signature comes from composition and purposeful inspection |
| Signal wash selected grouping | Optional bounded grouping, never a default active-card fill |
| Tab semantics with unconstrained visual skin | Preserve tab behavior; icon-and-short-label styling integrated with content |
| Icons only supplement labels | Visual cues may lead; short visible labels resolve ambiguity; utilities may be icon-only with accessible names |
| Sparse background guidance | Explicit surface policy excludes dotted/shadow-line wallpaper and generic glow/gradient baseline |
| Written direction marked selected | Retained working proposal; detailed look/feel is not approved or rendered |

Dots and decorative background shadow lines were not required by PR #1's documents. This refinement makes their exclusion from the baseline explicit; it does not claim an unseen image was audited.
No blanket decoration ban: retain a local accent when it has a clear job, supports personality, and remains subordinate to work.

## Public/owner wide/narrow review matrix

| Surface/state | Wide contract | Narrow contract | Review condition |
| --- | --- | --- | --- |
| Entry | Offset identity, dominant authored work object, attached action | Identity/work composition stacks, supporting paths visible | Clear first action without decorative background dependency |
| Browse/default/active | Varied work emphasis; stable active position/shape/icon | Readable sequence with persistent selection and return | No repeated glowing/filled active tiles or equal-card wall |
| Story/sections | Summary anchored; compact icon/label selectors change content | Wrap controls; preserve names, order, selected state | Same semantics without mandatory pill/boxed segments |
| Evidence/loading/error | Scoped inline inspection with caption/Close/Retry | Fit media/explanation; no control covered | Failure keeps summary and recovery; text-only story complete |
| Company/missing logo | Name/logo context; multi choices or main product directly | Same content/order; no extra main-product click | Logos-only company entry, no fabricated cover |
| Owner editor/unsaved | Structured fields, clear status/action grouping | Stacked fields/actions, visible errors/focus | Visual hierarchy helps without hiding private/public distinction |
| Preview/review | Private banner; labeled public/candidate groups | Comparisons stack; short action labels remain explicit | Preview cannot be mistaken for public or Save for Update |
| Confirmation/conflict | Item/impact/cancel; scoped warning and recovery | Dialog/controls fit; focus and input protected | Unpublish/Delete/Discard distinguishable; no icon-only destructive action |
| Empty/no media/long text | Deliberate space and hierarchy, no filler motifs | Natural wrapping; remove optional decoration | No placeholder asset, lost action, or tiny clipped label |

These are document-level comparisons, not measured screen results. Actual wide/narrow screens, focus order, icon comprehension, contrast, and user tasks remain untested.

## Acceptance and AI boundary

- A09: keyboard/320px/zoom/reduced-motion paths preserve names, selection, errors, and action meaning.
- A12: work-led composition and inspection are distinctive without relying on patterned backgrounds or generic active controls.
- Visual-first does not mean text-free: content, essential labels, and publication consequences remain readable.
- Agents read visual-system-spec for styling and state/lifecycle specs for behavior; do not infer an icon library, CSS, fonts, animations, or asset generation.
- O04 remains open: final styling, licensed typeface, actual rendered target/review. Architecture and implementation follow product-design review with separate authorization.

## Validation record

Executed: 125 relative-link checks, 47 table-structure checks, unchanged R01–R26/A01–A12 identifiers, and 42 flow-scenario definitions with valid acceptance references. Changed scope is 13 Markdown files. Public/owner/publishing/navigation flow files are unchanged. Palette values are unchanged; no new contrast or aesthetic certification is claimed.
This is an author-led contract review. Refine/approve these written rules before separately requesting visual or implementation work.
