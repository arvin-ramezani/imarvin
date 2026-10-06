# Visual System: Signal Studio

Status: existing visual system target approved (P09/P11/P13/P14); P15 media composition extension proposed, rendered validation pending. Updated: 2026-10-07.
Authority: [decisions](../decisions.md), [public UX](public-ux-spec.md), [owner UX](owner-ux-spec.md), [accessibility](accessibility-responsive-spec.md). Trace: R01–R02, R20–R27; A01, A09, A12.
Owner approved representative rendered wide light/dark public and owner screens on 2026-10-03. The reviewed images are approval evidence but are not stored here as implementation assets. [Refinement review](../visual-refinement-review.md) records the approval and remaining validation.

## 1. Visual communication

Owner preference: communicate first through hierarchy, icons, shape, spacing, and visible state changes; labels are short and visually secondary. Selective decoration may reinforce an identifiable relationship or personality.

VS01: compact identity is an offset anchor; featured work's problem/contribution dominates. One attached Open work action leads into inspection; Browse/Contact remain discoverable.
VS02: active work/section uses stable position, weight, icon/shape, and optional local accent. A cobalt edge, bracket, tinted card, or filled pill is not a required signature. Focus and active selection remain distinct.
VS03: selected work owns a large inspection stage; context/return sits beside it when space permits. Content changes while title and return stay anchored.
VS04: work objects share an open surface with authored variations in emphasis. Do not enclose the app in a card or make every item an identical tile.
VS05: offset composition, work-led scale, and purposeful inspection form the signature. Background effects or generic active-control styling cannot substitute for it.
VS06: real project captures/posters become authored objects within that same work stage: one focal visual at entry, smaller discovery stills, and full detail inspection. [Media/evidence](media-evidence-spec.md) owns placement/proportion/crop/player rules; this proposal preserves the palette/signature and does not extend earlier rendered approval to new layouts.

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

## 3. Approved light and dark palette target

Dark mode is the same Signal Studio composition, not the unselected Night Instrument direction. Use neutral charcoal, readable light text, and restrained blue accents; no added glow, grid, or neon treatment.

| Role | Light | Dark | Usage |
| --- | --- | --- | --- |
| Canvas | #F4F2ED | #15171B | Open neutral base |
| Surface | #FFFFFF | #1E2128 | Evidence/editor grouping when needed |
| Ink | #171A1F | #F1F3F6 | Primary content/identity |
| Muted ink | #515861 | #B4BBC6 | Readable supporting labels/context |
| Signal | #244BDB | #93ABFF | Link/focus/local accent; not a required active edge |
| Signal wash | #E4EAFF | #252F4D | Optional bounded grouping; no default active-card fill |
| Boundary | #747C8A | #737E90 | Essential control outlines where needed |
| Destructive | #AE2634 | #FF8792 | Error/destructive text/icon emphasis |
| Action fill | #244BDB | #3B63EF | Primary filled action, when needed |
| Action ink | #FFFFFF | #FFFFFF | Text/icon on Action fill only |

These values are the approved design target; implementation may adjust a value only for measured accessibility/technical reasons while preserving the approved appearance, with material changes returned for review. Theme support/default is accepted P14. Do not put white text on dark-theme Signal/Destructive: these are foreground roles, not button fills. Destructive actions use a clear label/icon and verified outline/text treatment; any future filled variant needs its own checked pair.
No color-only state, accent body paragraphs, or faint labels. Recheck opacity/hover/disabled/overlay combinations in both modes; solid-pair calculations alone do not validate a rendered screen.
Evidence is not inverted or recolored; keep original screenshot/logo appearance. Use a neutral framed surface if contrast requires it; company-name fallback remains available.
Keep captions/status/actions outside busy screenshots/posters; original project UI colors are content, not new application theme tokens. Assess frame/control contrast in both themes without claiming the captured product itself meets imarvin's accessibility targets.
Historical light calculations are in [design review](../design-review.md); current dark checks and limits are in [refinement review](../visual-refinement-review.md).

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

Public composition is expressive and may use purposeful motion; owner/admin editing is structured and motion-free. Share visual language without turning the editor into a decorative workspace.
Saved privately, Published, Private changes, Error, and Cancelled are distinct meanings. Use shape/icon/state plus concise text; never imply Save publishes through a visual transition.
Publish/Update and Unpublish/Delete are not interchangeable icon actions. Reviews and confirmations identify operation and effect.
Hover offers restrained affordance feedback; focus has an independent visible indicator; active selection persists. Loading is scoped; error pairs a recognizable cue with explanation/recovery.
On public visitor surfaces only, optional 120–180ms transitions may connect cause/result; no decorative loops, scroll hijacking, or animation waits. Owner/admin/sign-in/studio/private-preview/publish-review UI changes are immediate. Reduced motion keeps immediate feedback.
[Components](components-interaction-spec.md) define states; [refinement review](../visual-refinement-review.md) records the approved visual direction and remaining checks. Aesthetic direction is approved; icon comprehension, responsive layout behavior, focus/accessibility, and usability remain unverified.

## 7. Theme behavior — P14 / R27

Default preference is System; available choices are System, Light, Dark. With no saved choice, follow the device appearance; if that cannot be resolved, use Light. A saved explicit choice takes priority.
System follows device changes while open; explicit Light/Dark stays fixed. Choosing System removes the manual override. Remember the preference in this browser across routes/reloads when persistence is available; otherwise honor it for the current visit, then resume the default. Storage/first-paint mechanisms are deferred to architecture.
Apply the resolved theme consistently to public pages, sign-in, owner editor, private preview, dialogs, and feedback. This is a local viewing preference, not editable/published content; no account sync or theme publishing control.
Changing theme never navigates, changes browser history, moves reading position, resets filter/story/section/evidence, saves/publishes, or discards input. Preserve open dialogs and focus. Do not reload to switch.
Place a compact theme utility in shared navigation, secondary to work/contact. Sun/moon/system icons may lead; its accessible name states preference and resolved mode, e.g. Theme: System, currently Dark. Its single-choice selector shows all three short visible labels and current choice. Avoid three competing primary buttons or a permanent pill strip.
Use ordinary keyboard/touch selection; selection closes the utility and returns focus to its trigger. A later system-driven change must not steal focus or announce as a blocking message.
Resolve the initial appearance before visible rendering to avoid an opposite-theme flash, including sign-in/preview. No animated full-page color sweep; reduced motion uses immediate changes.

| ID | Later review scenario | Expected result |
| --- | --- | --- |
| TH01 | Fresh visit, device dark/light, preference unavailable | System matches device; unavailable detection falls back to Light |
| TH02 | Choose explicit mode → route/reload → device changes | Browser choice retained where possible; explicit mode unaffected by device |
| TH03 | Choose System → device changes while open | Resolved mode updates; content/focus/state unchanged |
| TH04 | Unsaved editor/open dialog/inspection → switch theme | Input, dialog, reading position, selection and draft/public state preserved |
| TH05 | Keyboard/320px/reduced motion in both modes | Clear choice/focus/status/error; full public/owner tasks available |
| TH06 | Evidence/logo + initial visit/preview/sign-in in both modes | Original media intact, readable frame/name; no opposite-theme flash |

These are unexecuted UX/rendering checks. Dark mode adds no new product concept, decorative background policy, or implementation authorization.
