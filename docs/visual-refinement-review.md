# Visual Refinement Review

Status: written design refinement for review; no rendered/interaction validation. Updated: 2026-10-03.
Base: merged PR #1, main at 342f9b657e1cb71dae665a20e2dab3d5f067d170. New work is a separate documentation PR.
Authority: [decisions](decisions.md), [visual system](specs/visual-system-spec.md), [components](specs/components-interaction-spec.md). No code, images, or generated assets.

## Owner brief

Retain Signal Studio as a proposal to refine. Use hierarchy, icons, shape, spacing, and state changes first; keep text labels short and secondary. Selective decoration is allowed.
Personal Studio flows, company logos-only, offline/no-media support, and explicit private-save/publish remain intact. P14 adds Light/Dark with System default, across public/owner/preview; palettes/control details remain proposals.

## What changes

| Earlier instruction | Refined contract |
| --- | --- |
| Repeated cobalt active edge/bracket as signature | Optional local cue; signature comes from composition and purposeful inspection |
| Signal wash selected grouping | Optional bounded grouping, never a default active-card fill |
| Tab semantics with unconstrained visual skin | Preserve tab behavior; icon-and-short-label styling integrated with content |
| Icons only supplement labels | Visual cues may lead; short visible labels resolve ambiguity; utilities may be icon-only with accessible names |
| Sparse background guidance | Explicit surface policy excludes dotted/shadow-line wallpaper and generic glow/gradient baseline |
| Written direction marked selected | Retained working proposal; detailed look/feel is not approved or rendered |
| Light-only proposal | Light/Dark accepted; System default; same composition/state contracts |

Dots and decorative background shadow lines were not required by PR #1's documents. This refinement makes their exclusion from the baseline explicit; it does not claim an unseen image was audited.
No blanket decoration ban: retain a local accent when it has a clear job, supports personality, and remains subordinate to work.

## Public/owner wide/narrow review matrix

| Surface/state | Wide contract | Narrow contract | Review condition |
| --- | --- | --- | --- |
| Theme utility/system change | Compact shared utility, clear selection/resolved appearance | Same choices without crowding work/contact | No state/input loss, forced reload, or opposite-theme flash |
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

- A09/R27: Light/Dark/System, keyboard/320px/zoom/reduced-motion paths preserve names, selection, errors, and action meaning.
- A12: work-led composition and inspection are distinctive without relying on patterned backgrounds or generic active controls.
- Visual-first does not mean text-free: content, essential labels, and publication consequences remain readable.
- Agents read visual-system-spec for styling and state/lifecycle specs for behavior; do not infer an icon library, CSS, fonts, animations, or asset generation.
- O04 remains open: final styling, licensed typeface, actual rendered target/review. Architecture and implementation follow product-design review with separate authorization.

## Validation record

Previous visual-refinement revision checked 125 links, 47 tables, and 42 scenarios. This revision adds R27/P14, six theme scenarios, dark palette roles, and theme parity to review contracts; existing requirement/scenario IDs are retained. Current checks: 127 relative links, 49 Markdown tables, retained R01–R26/A01–A12 plus added R27, and 48 scenario definitions with valid acceptance references. Eleven Markdown files changed in this dark-mode revision. No rendered screen or interaction validation is claimed.
This is an author-led contract review. Refine/approve these written rules before separately requesting visual or implementation work.

## Dark palette calculation

Relative-luminance calculation for the proposed solid dark-mode pairs; no opacity/gradient/media effects:

| Pair | Ratio | Target |
| --- | --- | --- |
| ink/canvas | 16.14:1 | 4.5:1 |
| ink/surface | 14.49:1 | 4.5:1 |
| ink/wash | 11.86:1 | 4.5:1 |
| muted/canvas | 9.28:1 | 4.5:1 |
| muted/surface | 8.34:1 | 4.5:1 |
| muted/wash | 6.82:1 | 4.5:1 |
| signal/canvas | 8.13:1 | 4.5:1 |
| signal/surface | 7.30:1 | 4.5:1 |
| signal/wash | 5.97:1 | 4.5:1 |
| destructive/canvas | 7.80:1 | 4.5:1 |
| destructive/surface | 7.01:1 | 4.5:1 |
| destructive/wash | 5.74:1 | 4.5:1 |
| actionink/action | 4.98:1 | 4.5:1 |
| action/canvas | 3.60:1 | 3:1 |
| action/surface | 3.24:1 | 3:1 |
| boundary/canvas | 4.37:1 | 3:1 |
| boundary/surface | 3.93:1 | 3:1 |
| boundary/wash | 3.21:1 | 3:1 |

All 18 pairs meet their stated numerical targets. Action fill and Action ink are separate from the light-blue Signal foreground. This does not certify real typography, hover/disabled combinations, icons, shadows, media, contrast of all states, or perceived visual quality. Evaluate those later in both modes.
