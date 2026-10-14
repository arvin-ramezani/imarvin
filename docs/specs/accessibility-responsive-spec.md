# Accessibility and Responsive Specification

Status: P19–P25 public and owner a11y/responsive contract; P17 legacy Work focus remains accepted; new visual checks pending. Updated: 2026-10-15.
Authority: [public checkpoint](ux-public-checkpoint.md), [Contact](contact-ux-checkpoint.md), [owner content](owner-content-checkpoint.md) and [navigation](navigation-state-spec.md).
Depends on [public UX](public-ux-spec.md), [navigation/state](navigation-state-spec.md). Trace: R20–R27; A04, A09, A11–A12.
Scope: homepage, collection, experience, detail, evidence, personal context, Contact. Owner-dashboard coverage is now defined in [owner UX](owner-ux-spec.md), with component states in [components](components-interaction-spec.md). The rendered wide visual direction is owner-approved; rendered accessibility and responsive validation have not yet occurred.

Grounding: W3C guidance for [tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), checked 2026-10-03. The 44px target is our proposed product target, not a claim about an AA minimum.

## 1. Adapt the task, preserve the model

| Surface | Wide/narrow adjustment | Must preserve |
| --- | --- | --- |
| Combined Home | Identity and selected Project together, stacked naturally on narrow screens | Explore Project when configured; Contact, remaining sections otherwise; no auto-feature |
| Projects/Stories browse | Responsive published list, one label filter and Load more | Pinned-first after filtering, loaded count/order/scroll on return |
| Project detail | Contribution ahead of optional showcase, related published Stories last | All facts, zero/one/many media, no empty Story/media regions |
| Story detail | Introduction then explanation with optional contextual media | No required tabs/sections, private parent leak or automatic related controls |
| Contact/Privacy | Form/direct channels, note/page and confirmation reflow | Field access, Telegram conditional identifier, Retry with input retained |
| Owner arrangement | All items and Home selection, Move up/down/Apply/Discard | Pending state, error focus, no clipboard/keyboard loss |

At 320px/200% text/400% zoom, no page horizontal overflow, covered essential control or lost content. Resize maintains selected Project/Story, filter/load position, focus and unsaved editor changes. Historical W43's multi/main-product company layout is **not** a new product responsive requirement.

## 2. Semantic interaction and focus

- One meaningful main heading per destination; section/evidence headings reflect hierarchy. Provide a skip-to-main path.
- Navigation uses links; state changes use appropriately labeled controls. Icon/shape can lead visually with short supporting text (P13), but names, contrast, and discoverability remain clear. Familiar icon-only utilities require accessible names; unfamiliar/section/publication/destructive actions retain visible labels. Avoid clickable containers with nested competing actions.
- Only **when a real tab interaction is separately approved** (such as historical W43 Work), expose correct selected tab/panel semantics and arrow/Home/End/Enter/Space behavior. Do not require tabs or section selectors on new Stories; flexible text-only explanation must remain navigable.
- Tab behavior is semantic: it does not require pill tabs, boxed segments, or a generic active fill. Selection may use weight/shape/icon and restrained emphasis; preserve the selected state and associated panel.
- Keep selection/focus visibly distinct. Absent optional content has no dead focus targets; private parent/content remains absent from public accessibility tree.
- Projects/Stories each have a clearly labelled single-label filter and All/reset. Announce published matching count; preserve pin/latest order and filter focus.
- New Project/Story destinations focus their title; returning restores actual invoking item or visible fallback. P17 applies **only to existing W43 figure-origin Work Evidence**: Close restores Problem/Decisions figure or visible heading; Evidence-origin/direct link Close stays in Evidence with valid focus. No hidden target or inline focus trap. It does not mandate those sections for P19 Stories.
- Restoring a collection returns focus to the invoking item after restoring context. If it no longer exists, focus a valid heading and explain changed availability.
- Loading, errors, empty results, and unavailable states use understandable text. Announce changes without rereading the whole page; errors link to an actionable Retry/return control.
- Every action works with keyboard, touch, and ordinary pointer use. No hover-only labels, drag-only navigation, hidden gestures, or required animation completion.

## 3. Perception and reading

Review targets: normal text contrast at least 4.5:1; large text at least 3:1; essential controls/focus indicators at least 3:1 against adjacent colors. Meaning cannot depend on color alone.
Pointer targets aim for at least 44 × 44 CSS px for primary/navigation controls; smaller contextual links must remain comfortably separated and operable.
Text remains usable at 200% enlargement. At 400% zoom on a 1280 CSS px-wide viewport, the core loop must reflow to the 320px experience without loss of information or action.
Expressive display type is reserved for identity/emphasis; Project overviews/contributions, Story explanations, captions, form feedback and status stay readable. Do not uppercase long passages, obscure links, or hide content to fit a composition.
Project status uses text labels. Company name remains available with or without a logo; a redundant logo can be decorative, otherwise its alternative identifies the company.

## 4. Evidence and motion

Images convey their relevant meaning through alternatives and nearby captions; complex diagrams/screenshots also have a readable explanation of the important relationships/state. Redundant linked thumbnails/posters can use an empty alternative when the adjacent accessible link already identifies the work; unique visual information still needs text. No-media Projects and Stories receive equally complete hierarchy/actions; only published parent/children metadata is accessible.
Silent UI recordings require an equivalent description of starting state, action, visual transition and result; label them Silent demo. Video with meaningful speech/sound requires accurate synchronized captions, including relevant non-speech sound, and a descriptive transcript as the product target. Important visuals absent from the audio require audio description for the AA target; a transcript alone does not meet that synchronized-video requirement. Integrated narration can already convey all meaningful visuals. Accessibility applies to linked evidence too; do not publish an inaccessible recording merely because it is external.
Players expose accessible, visible keyboard/touch controls, caption access, duration and silent/with-audio context. Play is explicit, never hover/focus/deep-link triggered; Pause/seek/replay and volume/mute where relevant work without gestures alone. Reduced motion does not block an explicitly requested demonstration; its equivalent explanation remains available without playback. No decorative looping/GIF playback or flashing content; player operation must not trap focus.
When image enlargement is offered, provide keyboard-accessible controls and contained reading. [ME05](media-evidence-spec.md#4-inspection-and-playback) treats exact gallery/player/zoom controls as pending full-product design, not mandatory implementation. No asset creation required.
Grounding checked 2026-10-07: W3C [informative images](https://www.w3.org/WAI/tutorials/images/informative/), [complex images](https://www.w3.org/WAI/tutorials/images/complex/), [media planning](https://www.w3.org/WAI/media/av/planning/), [video-only alternatives](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html), [audio description](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html), and [accessible players](https://www.w3.org/WAI/media/av/player/). These inform requirements, not a conformance claim.
Public interface motion is purposeful only: use it when it improves orientation, hierarchy, continuity, selection, inspection or feedback, and evaluate the same benefit on narrow, medium and wide layouts rather than making useful motion desktop-only. Hover motion is supplementary; touch/keyboard users receive an equivalent understandable state without requiring animation.
Reduced motion removes non-essential spatial travel, parallax, decorative looping and animated feedback. Content changes and selection feedback remain immediate and understandable. No scroll hijacking, flashing, or animation wait before work/contact access. Explicitly requested project-media playback remains available with its non-playback equivalent.
Image inspection does not add a crop/annotation/video editing suite requirement; source preparation remains outside V1 authoring scope.

## Theme parity

Apply the same reading, contrast, focus, touch, reflow, and motion targets in Light and Dark. System is a preference, not a third palette. Check status, pending, error, disabled, selected, dialog, and sign-in states; do not rely on glow/shadow on dark surfaces.
Theme selection has a clear accessible name/current choice and visible System/Light/Dark option labels. Preserve focus, open-dialog context, and unsaved input; no theme-change reload or motion-dependent feedback. Evidence/logo colors remain authentic.
Run TH01–TH06 from [visual system](visual-system-spec.md) alongside AR01–AR10 in both modes. First-appearance/no-flash and persistence implementation remain architecture-dependent.

## 5. Review scenarios

| ID | Check | Pass condition |
| --- | --- | --- |
| AR01 | 320px: entry → browse → detail → evidence → return | No page overflow; every essential action and context available |
| AR02 | Keyboard-only same flow | Logical focus, filter/links/form/return; tabs only on separately approved tab surfaces |
| AR03 | Screen-reader inspection | Project/Story headings, relation privacy, filter/count/error, Contact confirmation and optional media understandable |
| AR04 | Text enlargement/reflow | No clipped summary, lost controls, or required sideways page scrolling |
| AR05 | Reduced motion | Complete core loop without motion-dependent information or delay |
| AR06 | No optional media; long confirmed title | Complete composition and actions, no blank media slot or truncation hiding meaning |
| AR07 | Resize with optional media open and label filter stored | Same content, filtered/pinned order and valid return context |
| AR08 | Later signature-composition review | Identity/composition remains distinctive while hierarchy, contrast, and focus stay usable |
| AR09 | Screenshot, silent/narrated recording; keyboard/320px/reduced motion; no playback | Meaningful alternatives/captions/description convey the demonstrated state/motion; operable player, readable captions/focus and scoped failure recovery; MV03–MV04/MV07 |
| AR10 | Keyboard: figure-opened Evidence → Close, missing figure/section, Evidence-origin and direct-link Close | Valid visible focus on restored section figure/heading or within Evidence; no hidden target or extra Back step |

The [responsive/interaction validation matrix](../responsive-interaction-validation.md) owns review profiles and evidence status; AR01–AR10 remain the canonical accessibility scenarios.
Later verification combines manual tasks, accessibility inspection, and representative rendered states. Automated checks alone cannot certify usability. These numerical targets are proposed design acceptance thresholds, not a compliance certification.
Approved visual palette/type/spacing intent and responsive modes are in [Signal Studio](visual-system-spec.md); component states are in [components](components-interaction-spec.md). The rendered wide light/dark direction is approved, but actual responsive values, focus behavior, icon comprehension, and library choices still require accessibility validation. Preserve the approved visual character without using accessibility as a reason to restore the rejected CV layout.
