# Responsive & Interaction Validation

Status: original RV01–RV14 IDs and historical written evidence preserved; P19–P25 scenario expectations reconciled; **new** document/runtime checks pending. Updated: 2026-10-15.
Earlier baseline: main `92867925b7021572a443fa861160110334e53ea5` (merged PR #2). P15 baseline: main `40ea65b8d891a78beb184a8481baa3ff981bc64b` (merged text-only #23). Scope: documents only.
Authority: [decisions](decisions.md), [visual system](specs/visual-system-spec.md), [acceptance](specs/acceptance-spec.md). Behavior remains in linked specifications; this document owns validation coverage and evidence status.

## 1. Review boundary

Signal Studio, the rendered wide public/owner direction, and Light/Dark/System are owner-approved; O04 stays resolved. Compare adaptations with that target, without reopening the concept or restoring a CV/card-grid homepage.
This work reviews contracts and prepares observable checks. No responsive screens, task sessions, code, or images were produced or inspected in this phase. P10/P12 are owner-approved behavioral contracts. Other behaviors explicitly marked proposed remain proposals; writing a check does not approve them.

| Stage | Current result | Evidence needed to advance |
| --- | --- | --- |
| Written contract review | Complete; findings below | Link/ID/scope checks and source comparison |
| Responsive rendered review | Pending | Narrow/medium and stress states compared with approved wide target |
| Interaction/usability/accessibility | Pending | Actual task, keyboard, focus, reading and state observations |
| Implementation/privacy/publication delivery | Pending; O05 defaults are resolved but code authorization is separate | Exact implementation head and architecture-dependent tests |

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
Resize with a Project/Story detail, a label filter/pin/order and origin stored; separately resize an unsaved editor, arrangement view or open confirmation. Include an on-screen keyboard: keyboard/browser chrome can reduce available height.

Required P19 fixtures: combined hero with/without configured feature, Home sections including About/offerings, standalone/linked/private-parent public Stories, Project with zero/one/many published Stories, distinct UI/CLI/backend Projects, concise minimum Project/Story text, optional no/one/many media/links, long title/URL, logo/name Home Experience, label filtered pin priority and unpublish/republish, zero collection/filter results, owner All items/Home selection/Apply failure, bulk Project Keep/Delete atomicity, Contact form/Telegram conditional/Privacy/Retry, conflict and expired session. Historical W43 Problem/Decisions/main-product cases remain regression fixtures only for the older implementation.
P15 media fixtures: cancelled/never-shipped local recording with completed/unfinished scope; published cover versus draft replacement; tall/wide screenshot and small UI detail; silent and narrated video with alternatives; no/failed poster, unsupported playback, slow delivery and removed public derivative. Use the same task profiles for [MV01–MV08](specs/media-evidence-spec.md#7-verification-boundary); real media facts/permission remain unconfirmed.
Use P18 clearly FICTIONAL/TEST ONLY design data; no authentic Project captures, public employment claims, real contact address or implied shipped release. O01–O03 gate actual publication only.

## 3. Check matrix

RV IDs are retained for traceability; their revised P19–P25 expected behavior is **Pending**, not historical PASS.

| ID / source | Intent / trigger | Observable result | Recovery / keyboard / narrow |
| --- | --- | --- | --- |
| RV01 · UXH01–UXH09, VS01 | Home configured/unconfigured → feature/Contact | Combined identity + Project if configured, remaining sections; About position correct | No-feature retains identity without replacement/dead action |
| RV02 · UXN04–UXN07, NS01 | Label filter → pins/latest → Load more → detail/return | Filter before sort; shared pin priority; loaded items and scroll preserved | Clear filter, missing item safe fallback |
| RV03 · UXD01–UXD02, AR02 | Project and Story overview/detail | P25 distinct hierarchies; minimum text and no-media complete; no mandatory Story tabs | Readable headings/link names; contextual media optional |
| RV04 · NS07, AR10 | **Historical W43** figure/Evidence/direct link → Close | P17 valid figure/heading focus and no Back pollution | Applies only to Work Evidence model; no mandatory P19 sections |
| RV05 · UXH06, UXC06, PS05 | Home Experience → Project → published Story | Logo/name, Project links, safe optional Story parent, no company page | No private parent metadata; missing logo/media still useful |
| RV06 · NS03/NS04, CT12 | Shared or stale Project/Story/Privacy → Back/Forward | Valid published destinations/return; private states neutral | No leaked title/asset, direct Contact available |
| RV07 · OWN01–OWN05, AR01/AR04 | All items/Home selection → pin/move/review | Separate views, Apply/Discard; Home order only; proper focus | Move buttons, keyboard/OSK reachability |
| RV08 · OU01/OU02/OU04, UXD06–UXD07 | Minimum publish/draft → Save/Preview/leave | Optional inputs don't block minimum; Save private, preview exact, leave appropriate | No stale preview or lost draft input |
| RV09 · PS13, OU03/OU05/OU09 | Bulk publish/Update → failure/conflict/expiry | Confirmed together-or-unchanged; unknown outcome rechecked; no duplicate | Input and public version protected |
| RV10 · PS08–PS10, OWN05 | Home selection Apply → unpublish/Delete Keep Stories | Pending Home change does not unlock; successful Apply does; choice scope visible | Cancel safe, children preserved/deleted as chosen |
| RV11 · TH01–TH06 | Theme change reading/editing/dialog | All state/input/position preserved; no owner chrome animation | No focus steal, first-paint requires runtime test |
| RV12 · AR02–AR05, TH05 | Keyboard/read/zoom/motion across public/owner | Focus/selection distinct, form alternatives, no hover/drag only | 320px/200%/400% accessible |
| RV13 · CT07–CT12, NS04/NS05 | Contact send/privacy; empty/error/private removal | Accepted confirmation on Contact, failed input retained; neutral private fallback | Retry/direct choices and Privacy link available |
| RV14 · VS01–VS06, A12 | Compare revised sources at wide/narrow/Light/Dark | P20 combined hero, P25 hierarchy, no-media and owner workspace retain Signal Studio | No CV/equal-card wall; exact-image VSRC approval required |

P15/MV01–MV08 overlay: Project/Story media independence, no-media and authenticity cover RV01–RV06/RV14; optional media candidate/privacy cover RV07–RV10; player accessibility/error/theme cover RV11–RV13. P17 figure-focus remains historical W43 only. MV06 still needs architecture-backed authorization; no visible Private label proves privacy. All new P19–P25 media/design checks are unrun.

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
| F06 | Factual content, feature-level mechanisms and runtime evidence remain incomplete | Preserve approved P10/P12/T01–T07, O01–O03 and Pending execution; no mobile/runtime approval inferred |

This is an author-led documentation review, not independent research, a screenshot audit or accessibility certification.

## 5. Document reasoning result

The canonical specifications were cross-read against RV01–RV14. At its original 2026-10-12 baseline, the prior Story-as-Project contracts were considered internally consistent; P19–P25 replaced that scope. This historical reasoning is **not a current PASS**.

| Group | Document reasoning | Runtime evidence |
| --- | --- | --- |
| RV01–RV06 public navigation/detail | HISTORICAL written PASS only — current P19 revision unreviewed | Pending |
| RV07–RV10 owner/recovery | HISTORICAL written PASS only — current P19 revision unreviewed | Pending |
| RV11–RV12 theme/accessibility | HISTORICAL written PASS only; current P19 revision unreviewed | Pending |
| RV13–RV14 absence/signature | HISTORICAL written PASS only; current P20/P25 visual revision unreviewed | Pending |

The historical written PASS applies only to the prior contract revision; the revised scenarios require fresh independent document and runtime checks. P10/P12 guarantees remain approved only where compatible with P19–P25.

Runtime-only claims remain Pending: actual reflow/overflow, browser history restoration, focus movement/trapping, on-screen-keyboard behavior, theme first-paint/persistence, unsaved-input retention across real UI changes, session/concurrency/atomic delivery, and assistive-technology output.

## 6. Execution and evidence handoff

1. Review responsive/focus refinements and detailed behavior proposals with the owner.
2. When separately authorized, compare narrow/medium rendered public/owner states with the approved target; record viewport/theme/content. Static comparison does not close interaction cases.
3. After the required feature/bootstrap specs and bounded implementation request, execute this matrix on the exact implementation head, including failure and absence states.
4. For each defect, record intent, reproduction, expected/observed behavior, affected requirement and evidence. Change the smallest responsible contract/design/implementation and retest affected paths.

Record one entry per RV/profile/input/theme combination: exact source/implementation SHA; browser/OS and assistive technology where relevant; CSS viewport/zoom/preference/resolved theme; fixture IDs; steps; observed result; evidence reference; Pass/Fail/Pending; defect/retest link. Blocked/unrun is Pending with its reason. Capturing later evidence does not authorize publishing private content.

| Evidence group | Current status | Closure condition |
| --- | --- | --- |
| RV01–RV06 public navigation/detail | Pending | Actual task/focus/history observations in required profiles/themes |
| RV07–RV10 owner/recovery | Pending | Edit/review/confirmation runs plus architecture-backed failure/session/concurrency results |
| RV11–RV12 theme/accessibility | Pending | Observed retention, first appearance, reading/focus/reflow/motion results |
| RV13–RV14 absence/signature | Pending | Representative rendered states and recovery tasks preserve approved character |
| P15 / MV01–MV08 media extension | Pending; no media implementation or rendered approval | Real media layouts/player/owner tasks, truthful capture review, alternatives and architecture-backed derivative privacy on exact SHA |
| Documentation checks | Complete in PR handoff | Links, stable IDs, references, table structure, consistency, Markdown-only scope |

This revised documentation matrix requires fresh independent review and exact-image owner approval for meaningful new UI. Responsive/interaction validation closes when required runs have evidence and task-blocking failures are resolved. Accessibility defects need affected checks repeated; numeric targets remain in the shared accessibility spec. Security, real-content publication and technical readiness stay separate. No merge, code or deployment authorization is implied.
