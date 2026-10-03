# Responsive & Interaction Validation

Status: written contract review complete; rendered/task/runtime checks Pending. Updated: 2026-10-03.
Baseline: main `92867925b7021572a443fa861160110334e53ea5` (merged PR #2). Scope: documents only.
Authority: [decisions](decisions.md), [visual system](specs/visual-system-spec.md), [acceptance](specs/acceptance-spec.md). Behavior remains in linked specifications; this document owns validation coverage and evidence status.

## 1. Review boundary

Signal Studio, the rendered wide public/owner direction, and Light/Dark/System are owner-approved; O04 stays resolved. Compare adaptations with that target, without reopening the concept or restoring a CV/card-grid homepage.
This work reviews contracts and prepares observable checks. No responsive screens, task sessions, code, or images were produced or inspected in this phase. P10/P12 are owner-approved behavioral contracts. Other behaviors explicitly marked proposed remain proposals; writing a check does not approve them.

| Stage | Current result | Evidence needed to advance |
| --- | --- | --- |
| Written contract review | Complete; findings below | Link/ID/scope checks and source comparison |
| Responsive rendered review | Pending | Narrow/medium and stress states compared with approved wide target |
| Interaction/usability/accessibility | Pending | Actual task, keyboard, focus, reading and state observations |
| Implementation/privacy/publication delivery | Pending; requires O05 and separate code authorization | Exact implementation head and architecture-dependent tests |

Static screens can show wrapping/hierarchy, but cannot prove history, focus, input retention, session recovery or publication. Future rendered/execution work requires its own authorized scope.

## 2. Conditions and fixtures

Dimensions below are test viewports in CSS px, not mandatory breakpoints. The [visual system](specs/visual-system-spec.md#5-responsive-composition) retains content-driven transitions.

| Profile | Test condition | Look for |
| --- | --- | --- |
| Wide | 1440 × 900 | Approved offset work stage; readable owner comparison |
| Medium | 900 × 900 | Context above stage; review groups stack with labels |
| Narrow | 390 × 844 | Complete exploration and owner tasks; visible return/status/actions |
| Minimum | 320 × 568 | Wrapping controls/text; no page overflow or covered focus/errors |
| Stress | 844 × 390 landscape; 200% text; 400% zoom at initial 1280px width | Short-height dialogs, reflow, visible action/error paths |
| Transition | Around 719/720 and 1099/1100px; then where actual content stops fitting | No reset of selection, origin, input or meaningful reading order |

Run core public and owner loops at all four main profiles in both Light and Dark. Add keyboard-only wide/minimum runs, touch narrow runs, screen-reader public/owner runs, reduced motion, and System resolving to each theme. Apply stress profiles to affected rows; do not claim every combination was tested.
Resize with a section/evidence selected and company filter/origin stored; separately resize an unsaved editor/open dialog. Include an on-screen keyboard: keyboard/browser chrome can reduce available height.

Required fixtures: published story with all sections; summary-only and one-section stories; cancelled/offline and no-media stories; long title/URL; logo-only and missing-logo experiences; multi-project and main-product cases; zero work and zero filter results; unsaved edit to a published story; missing/stale dependency; save/upload failure, conflict and expired session.
Use confirmed content where available. Synthetic fixtures must be labeled test data, never public employment/results claims. O01–O03 remain factual gates; no invented featured story or contact address.

## 3. Check matrix

RV identifiers are validation cases, not new product requirements. Expected behavior is proposed where its source is proposed. Rendered/task status for RV01–RV14 is Pending.

| ID / source | Intent → trigger | Observable result | Recovery / mobile / keyboard |
| --- | --- | --- | --- |
| RV01 · PU01/PU06/PU07, VS01/VS05 | Enter → feature or Contact | Identity, one work action and independent Contact stay clear; narrow composition preserves work emphasis | Removed feature uses curated fallback or honest no-work state; no dead action or mandatory tour |
| RV02 · PU02, NS01/NS06 | Filter → story → sections → Return/Back | Restore valid company filter, invoking item and position; tab changes do not add Back steps | Touch/keyboard have same loop; vanished item falls back safely with explanation |
| RV03 · PU05, AR02/AR03 | Inspect → select section | Summary stays; zero sections has summary only, one has direct heading, two or more expose selected tab/panel | Arrow/Home/End move focus; Enter/Space activates; absent sections omitted; controls wrap |
| RV04 · NS02/NS05, AR07 | Evidence → Close; resize or switch during request | Inline caption/heading fit; Close returns trigger; leaving Evidence closes inspection; late response cannot replace new state | Deep link opens same public evidence; failure offers Retry/Close and retains story; no inline focus trap |
| RV05 · PU04, CP11, AR06 | Experience → work | Shared name/logo context; multiple choices or main story directly; same underlying story | Missing logo/media needs no filler or extra click; long titles/URLs wrap |
| RV06 · NS03/NS04, PU06 | Shared/stale link → Back/Forward | Valid selections round-trip; direct Return leads to All work; invalid location uses defined fallback | No private title/asset in unavailable response; Contact remains accessible |
| RV07 · OU08, AR01/AR04 | Edit → reorder → review at minimum width/zoom | Labels, values, status/error links visible; move buttons announce position; labeled comparison groups stack | Keyboard/picker alternatives; on-screen keyboard/action bars never cover focused field/error/action |
| RV08 · OU01/OU02/OU04, CP01 | Unsaved edit → Save/Preview/leave | Save stays private; exact saved candidate has Private preview label; leave offers Save/Discard/Keep editing | Failed save retains input/editor; return restores context; no stale preview presented as current |
| RV09 · OU03/OU05/OU09, CP04/CP08 | Update → pending/failure/conflict/expiry | Distinct status; duplicate confirmation prevented; input retained; uncertain outcome checked before retry | Copy/reload/sign-in path; no false success or silent overwrite; narrow feedback stays readable |
| RV10 · OU06/OU07, CP05/CP07 | Unpublish/Delete/Discard → impact → Cancel/confirm | Item/effect/retained content explicit; referenced deletion blocked; confirmation intentional | Short-height dialog fits; contained focus, safe Escape/Cancel, invoking focus restored; changed impact reviewed again |
| RV11 · TH01–TH06 | Change theme while reading/editing/dialog | Preference/resolved mode clear; state/input/history/position retained; explicit mode ignores device change | Utility closes to trigger; system change does not steal focus; original media intact; first appearance needs runtime evidence |
| RV12 · AR02–AR05, TH05 | Keyboard/read/zoom/reduced-motion loops | Logical order/names/status; visible focus distinct from selection; readable text in both themes | No essential hover, drag, gesture or animation wait; no focus hidden by sticky elements |
| RV13 · NS04/NS05, PU03/PU07, CP05 | Empty/error/loading/unavailable/removal → next action | Scoped explanation/recovery; valid context retained; no dead or fabricated controls | Retry keeps current selection/history; neutral nonpublic fallback; no cached removed content |
| RV14 · AR08, VS02–VS05, A12 | Compare adapted public/owner states with target | Work-led identity/inspection survives stacking; owner stays structured; selected/focus/error distinct | Remove optional decoration before content; no generic CV, equal-card wall or new dark-mode art direction |

Canonical scenarios: [public](specs/public-ux-spec.md), [navigation](specs/navigation-state-spec.md), [owner](specs/owner-ux-spec.md), [publishing](specs/content-publishing-spec.md), [accessibility](specs/accessibility-responsive-spec.md), [theme](specs/visual-system-spec.md#7-theme-behavior--p14--r27).
A01–A06/A08–A12 receive responsive/interaction coverage. A07 security/privacy and atomic-delivery parts of A06/A08 require architecture/implementation checks; a visible private label is insufficient.

## 4. Written review findings

| ID | Finding | Resolution / limit |
| --- | --- | --- |
| F01 | Public UX still asks to resolve O04; plan still requests initial visual-target evaluation | Corrected references; approved wide target retained, remaining validation separated |
| F02 | Resize preserves selection but focus continuity during layout changes was underspecified | Clarified shared contract: retain focused control or equivalent logical target without resetting state |
| F03 | Owner contract omits explicit caret/on-screen-keyboard and short-height dialog handling | Clarified owner contract: retain input/caret; usable scrolling and reachable dialog title/actions |
| F04 | Plan's component/acceptance trace ends at R26 despite theme coverage | Corrected inventory to R27; no requirement or acceptance IDs changed |
| F05 | Return, zero/one-section behavior, candidate preview and removal already defined | Retained canonical contracts; tests introduce no alternate widget behavior |
| F06 | Factual content, technical mechanisms and runtime evidence remain incomplete | Preserve approved P10/P12 behavior, O01–O03/O05 and Pending execution; no mobile/runtime approval inferred |

This is an author-led documentation review, not independent research, a screenshot audit or accessibility certification.

## 5. Document reasoning result

The canonical specifications were cross-read against RV01–RV14. At the contract level, all 14 cases are internally consistent and have a defined expected outcome and recovery path.

| Group | Document reasoning | Runtime evidence |
| --- | --- | --- |
| RV01–RV06 public navigation/detail | PASS — public UX, navigation/state, accessibility and publishing contracts agree | Pending |
| RV07–RV10 owner/recovery | PASS — owner UX and publishing contracts agree on save/preview/conflict/removal/dialog behavior | Pending |
| RV11–RV12 theme/accessibility | PASS — theme, focus, reflow, keyboard and reduced-motion contracts agree | Pending |
| RV13–RV14 absence/signature | PASS — empty/error/removal and approved Signal Studio adaptation rules agree | Pending |

No contract contradiction or missing recovery path was found in this reasoning pass. P10/P12 are approved; other behaviors explicitly marked proposed remain proposals. This PASS means the documents are coherent, not that runtime behavior has been observed.

Runtime-only claims remain Pending: actual reflow/overflow, browser history restoration, focus movement/trapping, on-screen-keyboard behavior, theme first-paint/persistence, unsaved-input retention across real UI changes, session/concurrency/atomic delivery, and assistive-technology output.

## 6. Execution and evidence handoff

1. Review responsive/focus refinements and detailed behavior proposals with the owner.
2. When separately authorized, compare narrow/medium rendered public/owner states with the approved target; record viewport/theme/content. Static comparison does not close interaction cases.
3. After architecture, approved specs and a bounded implementation request, execute this matrix on the exact implementation head, including failure and absence states.
4. For each defect, record intent, reproduction, expected/observed behavior, affected requirement and evidence. Change the smallest responsible contract/design/implementation and retest affected paths.

Record one entry per RV/profile/input/theme combination: exact source/implementation SHA; browser/OS and assistive technology where relevant; CSS viewport/zoom/preference/resolved theme; fixture IDs; steps; observed result; evidence reference; Pass/Fail/Pending; defect/retest link. Blocked/unrun is Pending with its reason. Capturing later evidence does not authorize publishing private content.

| Evidence group | Current status | Closure condition |
| --- | --- | --- |
| RV01–RV06 public navigation/detail | Pending | Actual task/focus/history observations in required profiles/themes |
| RV07–RV10 owner/recovery | Pending | Edit/review/confirmation runs plus architecture-backed failure/session/concurrency results |
| RV11–RV12 theme/accessibility | Pending | Observed retention, first appearance, reading/focus/reflow/motion results |
| RV13–RV14 absence/signature | Pending | Representative rendered states and recovery tasks preserve approved character |
| Documentation checks | Complete in PR handoff | Links, stable IDs, references, table structure, consistency, Markdown-only scope |

This documentation phase is ready for owner review. Responsive/interaction validation closes when required runs have evidence and task-blocking failures are resolved. Accessibility defects need affected checks repeated; numeric targets remain in the shared accessibility spec. Security, real-content publication and technical readiness stay separate. No merge, code or deployment authorization is implied.
