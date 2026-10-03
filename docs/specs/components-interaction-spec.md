# Components and Interaction Contract

Status: draft design contract | Updated: 2026-10-03 | Working proposal: Signal Studio (P09/P13); no final visual approval.
Authority: [visual system](visual-system-spec.md), [public UX](public-ux-spec.md), [navigation/state](navigation-state-spec.md), [owner UX](owner-ux-spec.md), [publishing](content-publishing-spec.md). Trace: R01–R26; A01–A12.
Names describe design responsibilities, not React components, library choices, database models, or coding assignments.

## 1. Public component roles

| Role | Required content / action | States / variation | Narrow and keyboard contract |
| --- | --- | --- | --- |
| Studio navigation | Identity, Work, personal context, Contact | Current destination; private owner entry need not be promoted | Links wrap or use labeled menu; Contact directly discoverable |
| Featured work object | Title, authored hook, progress, Open work | Available, fallback, no work; no image slot required | Work-first hierarchy; one main link, normal focus |
| Work collection | Curated objects, optional company selection | All, filtered, loading, empty, request error | Readable sequence; aligned visual/focus order; clear reset |
| Work object | Title, hook, progress, optional company context | Default, hover, focus, active | Persistent selection cue plus short label; never whole-object nested links |
| Context rail/header | Selected title, company/role context, return | Collection/company/previous-story origin or All work fallback | Rail folds above content; return label retains real destination |
| Story summary | Problem, contribution/tasks, progress/outcome, stack | Complete without media; absent optional fields omitted | Readable text; one hierarchy, no badge inventory |
| Section controls/panel | Problem, Decisions, Evidence | Two-plus: tabs; one: heading/content; zero: summary only | Tab semantics with icon-and-short-label styling; wrap labels; selected state announced |
| Decision object | Constraint, alternatives, choice, consequence/lesson | Authored content, absent section | Strong choice hierarchy; text supports meaning without diagram |
| Evidence item/inspection | Caption, proof limits, alternative, Open/Close | Text-only, media loading, failed, unavailable | Inline heading focus; Close returns to trigger; Retry keeps story |
| Experience context | Company name/logo, role/dates/contribution | Logo/name fallback; multi-project or direct main story | Logo-only company treatment; no extra main-product click |
| Contact destination | Approved destination label and address/link | Available only with confirmed destination | Independent navigation; no form/placeholder links |
| Feedback area | Loading/error/empty/unavailable explanation | State-specific next action | Text and accessible announcement, never color alone |

Visual priority: hierarchy, icon/shape, spacing, and state change. Labels support these cues without becoming long instructions. Retain visible names for sections and consequential actions; no tooltip-only meaning.
Section selectors integrate into the reading surface: proposed icon plus short label, selected weight/shape/local mark. No obligatory pill strip, boxed segmented control, glow, or large tinted active tile. Tab semantics do not prescribe tab styling.
Hover offers a small emphasis only. Keyboard focus remains clearly visible; active selection is a separate marker. No required information appears exclusively on hover.
Every public component uses published data. Missing media does not change the core hierarchy or disable exploration. Errors do not replace the whole application when only an evidence area fails.

## 2. Owner component roles

| Role | Required content / action | States / variation | Narrow and keyboard contract |
| --- | --- | --- | --- |
| Content list | Title, progress, public/editing state, Edit/New | Loading, empty, failed; Work/Experiences | Stack table content; actions keep explicit labels |
| Structured editor | Labeled fields, help, optional section controls | Clean, unsaved, saving, saved, validation error, conflict | Preserve input; error summary links to fields |
| Association/order controls | Experience/mode/main story, feature/order | Eligible, missing/unpublished dependency | Labeled choices; move buttons and position announcements |
| Evidence editor | Caption, proof/permission, alternative, asset/link | Uploading, ready, failed, removed from draft | Picker alternative to drag; retain other field values |
| Publication status | Draft/public state, private changes, last success | No public version, matches public, private changes | Text remains adjacent to relevant action |
| Editor actions | Save draft, Preview, Publish/Update | Pending prevents duplicate action; invalid operation explains why | Wrap or stack; never hide errors/focus beneath action bar |
| Private preview banner | Private preview, saved candidate identity, Back to editing | Missing dependency warning; session expired | Keyboard return; no public sharing affordance |
| Publication review | Public/candidate comparison, changed areas, impacts | Ready, stale, invalid dependency, pending, outcome unknown, confirmed failed | Stack labeled old/new groups; confirm specific operation |
| Confirmation dialog | Item, impact, retained/deleted content, Confirm/Cancel | Unpublish, delete, discard unsaved edits, changed impact | Focus contained; safe cancel; restore invoking control |
| Conflict/session recovery | Reason, retained input, Copy text/Reload or Sign in | No silent overwrite; recheck after recovery | Clear next action; no unusable background submission |

During a pending write, prevent duplicate confirmation but keep safe navigation/recovery meaningful; leaving does not promise cancellation of a server operation. Determine the actual outcome before retrying.
Publication/destructive operations keep explicit short wording even when an icon leads visually. Save draft / Preview / Publish / Update published content / Unpublish / Delete remain distinguishable; do not collapse them into unlabeled utility icons.
Unavailable buttons have an adjacent reason and resolution path; do not rely on a disabled hover tooltip. Private preview and public view always use distinguishable labels.

## 3. Interaction boundaries

Navigation/history/focus transitions belong to navigation-state-spec; content lifecycle belongs to content-publishing-spec. Components expose those contracts rather than inventing local alternatives.
Section selection changes the panel immediately or shows scoped loading. It replaces history state; Back returns to origin, not each tab. Evidence closes when leaving Evidence. Modal dialog behavior applies to owner confirmations, not inline public evidence.
Structured editing uses explicitly requested operations. No autosave/publish shortcut, implicit dependency release, cross-tab last-write-wins, auto-playing evidence, or new widget invented solely for decoration.
Do not invent empty cards, fake screenshots, dates, author quotes, telemetry, or progress percentages for visual completeness. Use the real long/no-media/absent-section cases in review.

## 4. State coverage for future design review

| Surface | Required representative states |
| --- | --- |
| Home/collection | Feature available/removed; zero/one/many work; company selected/cleared/empty; long title |
| Story/experience | Multi/main product; zero/one/three sections; cancelled/offline; no logo/media; evidence failure; unavailable link |
| Editor | New incomplete draft; unsaved public edit; validation/upload failure; concurrent conflict; expired session |
| Preview/review | Saved candidate; missing dependency; public/private comparison; pending/failed/successful update |
| Removal | Feature/main-product/related impacts; blocked delete; safe cancel; unpublish success/failure |

These are design-review inputs, not screens already drawn or checks already executed. See [refinement review](../visual-refinement-review.md) for public/owner wide/narrow contracts. Use [acceptance](acceptance-spec.md) and [design review](../design-review.md) to record evidence at the correct stage.
