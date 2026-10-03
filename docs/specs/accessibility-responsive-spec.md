# Accessibility and Responsive Specification

Status: draft public-flow contract | Updated: 2026-10-03.
Depends on [public UX](public-ux-spec.md), [navigation/state](navigation-state-spec.md). Trace: R20–R26; A04, A09, A11–A12.
Scope: homepage, collection, experience, detail, evidence, personal context, Contact. Owner-dashboard coverage is now defined in [owner UX](owner-ux-spec.md), with component states in [components](components-interaction-spec.md). No rendered accessibility or visual validation has occurred.

Grounding: W3C guidance for [tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), checked 2026-10-03. The 44px target is our proposed product target, not a claim about an AA minimum.

## 1. Adapt the task, preserve the model

| Surface | Wider layout proposal | Narrow layout proposal | Must preserve |
| --- | --- | --- | --- |
| Homepage | Identity and feature form one expressive composition | Focused identity/feature with supporting paths reachable | Clear purpose and one primary action |
| Collection/detail | Collection and inspector may coexist | Collection → focused detail; persistent contextual return control | Selected story, filter, return position |
| Detail sections | Summary with section controls and one panel | Summary before controls/panel; controls wrap if needed | All available sections; same default/selection |
| Evidence | Inline inspection can use available width | Fit within page width; readable caption and Close | Same evidence explanation and recovery |
| Experience | Shared context with choices or main product | Same order and content; no extra selection step | Multi-project versus main-product behavior |

Choose layout changes when content no longer fits, not from device names. Resizing must not reset selected story, section, evidence, or origin. Desktop inspector and mobile detail are presentations of one public destination, not separate content copies.
At 320 CSS px, navigation labels/section controls may wrap; no essential control relies on horizontal scrolling. Media scales to available width. Long titles, mixed technical strings, and URLs must wrap without page overflow.

## 2. Semantic interaction and focus

- One meaningful main heading per destination; section/evidence headings reflect hierarchy. Provide a skip-to-main path.
- Navigation uses links; state changes use appropriately labeled controls. Avoid clickable containers with nested competing actions.
- Section selectors expose an accessible tab list with selected state and associated panel. Arrow keys move between available tabs; Home/End reach first/last; Enter/Space activates. Manual activation avoids unwanted requests while moving focus. Tab proceeds to panel content/actions.
- Keep selection/focus visibly distinct. Unpublished or absent sections are omitted from tab order and accessibility tree.
- Filtering uses a clearly labeled control with All work/reset. Result changes announce count politely; focus stays at the filter.
- New destinations focus their title; section changes retain the selector focus. Evidence opens inline, focuses its heading, and closes back to its trigger. No focus trap for inline inspection.
- Restoring a collection returns focus to the invoking item after restoring context. If it no longer exists, focus a valid heading and explain changed availability.
- Loading, errors, empty results, and unavailable states use understandable text. Announce changes without rereading the whole page; errors link to an actionable Retry/return control.
- Every action works with keyboard, touch, and ordinary pointer use. No hover-only labels, drag-only navigation, hidden gestures, or required animation completion.

## 3. Perception and reading

Review targets: normal text contrast at least 4.5:1; large text at least 3:1; essential controls/focus indicators at least 3:1 against adjacent colors. Meaning cannot depend on color alone.
Pointer targets aim for at least 44 × 44 CSS px for primary/navigation controls; smaller contextual links must remain comfortably separated and operable.
Text remains usable at 200% enlargement. At 400% zoom on a 1280 CSS px-wide viewport, the core loop must reflow to the 320px experience without loss of information or action.
Expressive display type is reserved for identity/emphasis; summaries, decisions, captions, and status stay readable. Do not uppercase long passages, obscure links, or hide content to fit a composition.
Project status uses text labels. Company name remains available with or without a logo; a redundant logo can be decorative, otherwise its alternative identifies the company.

## 4. Evidence and motion

Screenshots/diagrams have descriptive alternatives and contextual captions. Complex evidence also has a readable explanation of the relevant point. No-media stories receive equally complete hierarchy and actions.
Future video/audio evidence requires appropriate captions/transcript before publication; controls do not autoplay. V1 does not require producing such assets.
Reduced motion removes spatial travel, parallax, and decorative looping. Content changes and selection feedback remain immediate and understandable. No scroll hijacking, flashing, or animation wait before work/contact access.
Future zoom/pan of media must have button/keyboard equivalents and a reset; it cannot replace the text explanation or create page-level overflow. This does not add a media-editor requirement.

## 5. Review scenarios

| ID | Check | Pass condition |
| --- | --- | --- |
| AR01 | 320px: entry → browse → detail → evidence → return | No page overflow; every essential action and context available |
| AR02 | Keyboard-only same flow | Logical focus, working tabs/filter/links, no traps; correct return target |
| AR03 | Screen-reader inspection | Titles, selected tab/panel, status/count/error, and evidence context understandable |
| AR04 | Text enlargement/reflow | No clipped summary, lost controls, or required sideways page scrolling |
| AR05 | Reduced motion | Complete core loop without motion-dependent information or delay |
| AR06 | No optional media; long confirmed title | Complete composition and actions, no blank media slot or truncation hiding meaning |
| AR07 | Resize with evidence open and company filter stored | Same selected content and valid return context |
| AR08 | Later signature-composition review | Identity/composition remains distinctive while hierarchy, contrast, and focus stay usable |

Later verification combines manual tasks, accessibility inspection, and representative rendered states. Automated checks alone cannot certify usability. These numerical targets are proposed design acceptance thresholds, not a compliance certification.
Proposed palette/type/spacing/responsive modes are in [Signal Studio](visual-system-spec.md); component states are in [components](components-interaction-spec.md). Actual rendered values and library choices remain unapproved. Preserve these outcomes when selecting a visual target; do not use accessibility as a reason to restore the rejected CV layout.
