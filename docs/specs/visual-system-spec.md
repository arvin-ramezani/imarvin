# Visual System: Signal Studio

Status: selected written direction (P09); proposed visual system for review | Updated: 2026-10-03.
Authority: [visual exploration](../visual-exploration.md), [public UX](public-ux-spec.md), [owner UX](owner-ux-spec.md), [accessibility](accessibility-responsive-spec.md). Trace: R01–R02, R20–R26; A01, A09, A12.
No images, coded UI, rendered target, or aesthetic validation. Values below make future design review specific; they are not approved implementation tokens.

## 1. Signature composition

VS01: identity is a compact offset anchor; the featured work's problem/contribution is the dominant object. One attached Open work action leads into inspection; Browse/Contact remain clearly available.
VS02: a slim cobalt signal edge and aligned label mark the active work/section. Repeat the same alignment rule through collection, detail, and evidence; no ornamental brackets scattered around unrelated text.
VS03: selected work owns a large inspection stage; context/return occupies a narrower rail when space permits. Selection changes meaningful content while title and return context stay anchored.
VS04: work objects share an open surface and vary in emphasis by authored priority. Do not enclose the entire app in a card or turn every item into the same bordered rectangle.
VS05: identity, asymmetry, contrasting scale, and inspectable work together constitute the signature. Accent color, oversized name, or animation alone cannot pass A12.

## 2. Proposed semantic palette

| Role | Value | Usage |
| --- | --- | --- |
| Canvas | #F4F2ED | Bright neutral base; no decorative gradient |
| Surface | #FFFFFF | Evidence/editing surface only when grouping needs it |
| Ink | #171A1F | Primary text and strong identity |
| Muted ink | #515861 | Secondary readable context; never disabled-looking essential text |
| Signal | #244BDB | Primary action, active edge, links, focus |
| Signal wash | #E4EAFF | Selected-state grouping where an edge alone is insufficient |
| Boundary | #747C8A | Essential control outlines; ordinary groups can use spacing alone |
| Destructive | #AE2634 | Destructive action/error emphasis with explicit text |

Use white text only on verified dark action fills. Never use Signal wash as text color or accent-colored body paragraphs. State includes labels/icons where appropriate, not color alone.
Proposed theme: one light Signal Studio theme for V1. No theme switch or inherited Night Instrument palette. A future dark theme requires separate complete state/contrast review.

## 3. Typography and density

| Role | Proposed size / line height | Constraint |
| --- | --- | --- |
| Annotation/status | 14 / 20 px | Short labels; never long explanatory paragraphs |
| Body/control | 16 / 24 px | Stable readable baseline |
| Lead/summary | 20 / 30 px | Short work hook, not every paragraph |
| Section title | 28 / 36 px | Clear hierarchy without competing with work title |
| Work focal type | 32 / 40 px narrow; up to 64 / 72 px wide | One short authored fragment; wraps naturally |
| Identity | 24 / 32 px | Recognizable but subordinate to featured work |

Typeface intent: readable grotesk sans for display/body; optional system monospace for brief technical annotations only. Maximum two families. Exact licensed font and weights remain a later rendered-design decision; no font dependency is chosen here.
Long reading stays around 45–65 characters per line. Use normal case and moderate weight; do not compress copy into tiny type. If a hook is long, recompose/wrap it rather than clipping or shrinking below readable sizes.

## 4. Space, shape, and surfaces

Proposed spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Use tighter spacing within a meaning group and larger gaps between tasks.
Canvas maximum working width: 1440px; narrow gutters start at 16px, wider gutters 24–48px. These are design starting values, not guaranteed breakpoints.
Work objects use type, alignment, and space first. Controls use a modest 4px corner; grouped evidence/editor areas may use 8px. No default pill badges or rounded-card wall. Elevation is reserved for true overlays, not every object.
The signal edge belongs outside reading text and never reduces the contrast of the selected content. Icons, if later used, supplement labels; no invented illustration system is required.

## 5. Responsive composition rules

| Layout mode | Starting range to explore | Public composition | Owner composition |
| --- | --- | --- | --- |
| Wide | Around 1100px+ usable width | Narrow context rail, main work stage; collection/inspector may coexist | Navigation and editor with side-by-side review fields where readable |
| Medium | Around 720–1099px | Context above stage; fewer simultaneous work objects | Navigation above editor; review groups stack as needed |
| Narrow | 320–719px | Identity, focal work; focused detail with return/title above summary | Stacked fields/review; primary actions wrap without obscuring input |

Select the actual transition when rail + stage + gaps/gutters stop fitting, including enlarged text. Do not force desktop columns onto a tablet just because its width exceeds a number.
Collection visual order follows reading/focus order. Emphasize the first curated item with scale/space, then vary secondary items within aligned groups; no masonry reorder or canvas drag. Empty/one-item collections remain intentional without duplicate filler objects.
The summary persists across section changes, but need not be sticky. No sticky rail/action area may cover content, focused fields, or error summaries at zoom/320px.

## 6. Public and owner relationship

Share palette, type, focus, labels, and action meanings. Public space has expressive composition; owner space uses conventional structured fields and clear private/public state.
Signal marks an active edit context, not successful publication. Saved privately, Published, Private changes, Error, and Cancelled are separate textual states. Do not imply saving publishes through a color transition.

## 7. Motion and future visual review

Proposed motion: brief 120–180ms state emphasis where useful; no delay before usable content, choreographed loading sequence, scroll control, or animated counters. Reduced motion uses immediate changes. Duration is draft intent, not a chosen animation library.
Later review compares entry, collection, section detail, evidence, editor, publication review, and removal/error states at wide/narrow widths, long text, no media, zoom, keyboard, and reduced motion.
Check actual typeface, measured contrast, focus visibility, wrapping, and the recognizable signature. Written palette checks cannot validate final typography, layout, aesthetic quality, or perceived creativity.
