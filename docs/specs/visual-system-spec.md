# Visual System: Signal Studio

Status: working visual proposal retained for refinement (P09/P13); detailed values draft. Updated: 2026-10-03.
Authority: [decisions](../decisions.md), [public UX](public-ux-spec.md), [owner UX](owner-ux-spec.md), [accessibility](accessibility-responsive-spec.md). Trace: R01–R02, R20–R26; A01, A09, A12.
No images, coded UI, rendered target, or aesthetic validation. [Refinement review](../visual-refinement-review.md) records this documentation phase.

## 1. Visual communication

Owner preference: communicate first through hierarchy, icons, shape, spacing, and visible state changes; labels are short and visually secondary. Selective decoration may reinforce an identifiable relationship or personality.

VS01: compact identity is an offset anchor; featured work's problem/contribution dominates. One attached Open work action leads into inspection; Browse/Contact remain discoverable.
VS02: active work/section uses stable position, weight, icon/shape, and optional local accent. A cobalt edge, bracket, tinted card, or filled pill is not a required signature. Focus and active selection remain distinct.
VS03: selected work owns a large inspection stage; context/return sits beside it when space permits. Content changes while title and return stay anchored.
VS04: work objects share an open surface with authored variations in emphasis. Do not enclose the app in a card or make every item an identical tile.
VS05: offset composition, work-led scale, and purposeful inspection form the signature. Background effects or generic active-control styling cannot substitute for it.

Grouping and recognizable control shapes precede explanatory text. Work titles, story content, and consequential private/public states remain understandable. Secondary labels are visible/readable, not hidden or low contrast.

## 2. Surface and decoration policy

| Treatment | Contract |
| --- | --- |
| Base | Open neutral canvas; no dot grid, decorative shadow-line grid, patterned wallpaper, glow field, or ornamental gradient as the baseline |
| Separation | Space/alignment first; subtle divider or bounded surface when grouping needs it |
| Selective accent | Local shape, small rule, or surface contrast may connect context/content or express personality |
| Shape | Explains grouping/control/selection; no arbitrary blob behind every object |
| Shadow | Actual overlay separation when needed; no decorative shadow lines or floating-card wall |
| Selected state | Weight/position/shape/icon plus modest local emphasis; no default wash/glow/border stack |
| Section controls | Compact icon-and-label selectors integrated into the story; no automatic pill strip or boxed segmented-control look |

For each accent, name its job and affected relationship/state. Remove it if it competes with work, repeats without meaning, or creates noise. It cannot impersonate evidence, telemetry, or a control.

## 3. Retained palette proposal

| Role | Value | Usage |
| --- | --- | --- |
| Canvas | #F4F2ED | Open neutral base |
| Surface | #FFFFFF | Evidence/editor grouping when needed |
| Ink | #171A1F | Primary content and identity |
| Muted ink | #515861 | Supporting labels/context, still readable |
| Signal | #244BDB | Local action/link/focus accent; no mandated active edge |
| Signal wash | #E4EAFF | Optional bounded grouping; no default active-card fill |
| Boundary | #747C8A | Essential control outlines where needed |
| Destructive | #AE2634 | Error/destructive emphasis with clear meaning |

Values are starting proposals, not approved styling. Solid-pair calculations in [design review](../design-review.md) remain historical numerical checks only.
Use white text only on verified dark fills; no color-only state, accent body paragraphs, or faint essential labels. Proposed V1 theme remains light-only; final palette/theme requires later rendered review.

## 4. Type, icons, shape, spacing

| Role | Proposed size / line height | Constraint |
| --- | --- | --- |
| Supporting label/status | 14 / 20px | Short, secondary; consequential meaning explicit |
| Body/control | 16 / 24px | Readable baseline |
| Lead/summary | 20 / 30px | Concise work hook |
| Section title | 28 / 36px | Clear hierarchy |
| Featured work | 32 / 40px narrow; up to 64 / 72px wide | One authored fragment; wraps |
| Identity | 24 / 32px | Recognizable, subordinate to work |

Readable grotesk sans is the intent; optional system monospace only for short technical annotations. Maximum two families; exact licensed font/weight is open. Reading measure approximately 45–65 characters per line.
Icons use one coherent family, clear silhouettes, and consistent optical weight. A 16–20px icon is a starting size; hit area follows accessibility targets. No icon assets/library are chosen here.
Icons lead visually where useful; short labels remain visible when meaning is unfamiliar. Familiar icon-only utilities need accessible names. Section, publication, and destructive actions retain visible wording; no essential tooltip-only meaning.
Shape follows function: proposed 4px control corners, up to 8px grouped evidence/editor areas. Do not turn every status, tab, and action into a pill.
Proposed spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Tighter within relationships, larger between tasks. Starting maximum width 1440px; gutters 16px narrow and 24–48px wider.

## 5. Responsive composition

| Mode | Starting range | Public composition | Owner composition |
| --- | --- | --- | --- |
| Wide | Around 1100px+ usable width | Context beside work stage; collection/inspection may coexist | Navigation/editor; readable comparison groups side by side |
| Medium | Around 720–1099px | Context above stage; fewer simultaneous objects | Navigation above editor; review groups stack |
| Narrow | 320–719px | Focused work/detail; return/title above summary | Stacked fields/review; actions wrap without covering input |

Transition when content stops fitting, including enlarged text. Reading/focus/visual order stays aligned; no masonry/canvas reordering.
Do not remove all mobile labels to preserve a desktop arrangement; wrap/stack and use shorter approved labels. Selection/context survives resize. Optional decoration may disappear without losing meaning.
At 320px/zoom, focus, errors, and essential actions remain visible. No sticky rail/action area covers content.

## 6. Public/owner states and motion

Public composition is expressive; owner editing stays structured. Share visual language without turning the editor into a decorative workspace.
Saved privately, Published, Private changes, Error, and Cancelled are distinct meanings. Use shape/icon/state plus concise text; never imply Save publishes through a visual transition.
Publish/Update and Unpublish/Delete are not interchangeable icon actions. Reviews and confirmations identify operation and effect.
Hover offers restrained affordance feedback; focus has an independent visible indicator; active selection persists. Loading is scoped; error pairs a recognizable cue with explanation/recovery.
Optional 120–180ms transitions connect cause/result; no decorative loops, scroll hijacking, or animation waits. Reduced motion keeps immediate feedback.
[Components](components-interaction-spec.md) define states; [refinement review](../visual-refinement-review.md) compares public/owner wide/narrow cases in prose only. Actual visual quality, icon comprehension, layout, and usability remain unverified.
