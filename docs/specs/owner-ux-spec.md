# Owner UX Specification

Status: draft detailed contract | Updated: 2026-10-03.
Accepted: P02 explicit publishing; P03–P04 focused V1; P08 structured editing. These choices do not approve every behavior below.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md). Companion: [content/publishing](content-publishing-spec.md). Trace: R12–R21; A05–A09.

## 1. Owner's job and workspace

Curate accurate work, preview its presentation, and change public content deliberately. The private workspace favors clear editing over expressive public composition; no résumé builder, analytics dashboard, page builder, or AI generation.
Proposed navigation: Work, Experiences, Studio settings. Studio settings contains identity, personal context, contact, featured work, and curated order. Decisions/evidence are edited inside their story, not separate publishing products.
Landing view is the Work list: title, project status, publication state, Edit, and New story. No vanity metrics. Experiences distinguish multiple projects from main product; settings explain which public surfaces they affect.

## 2. Identity and access

One provisioned owner; no public registration or invitation flow. Sign-in shows labeled credentials and a generic failure message without account disclosure. Authentication method is unresolved O05; do not assume passwords, social login, or magic links.
Sign-out returns to sign-in and prevents revisiting private content through cached views. If edits are unsaved, offer Save and sign out, Discard and sign out, or Keep editing. Failed save does not sign out or lose input.
Expired session stops writes and shows Sign in again. Retain in-session editing input where feasible; after reauthentication reload the saved revision and require conflict handling before retry. Cross-refresh persistence of unsaved input is not promised. Exact recovery and retention mechanism is an architecture prerequisite.

## 3. Structured authoring

| Area | Editable content | Publishing checks |
| --- | --- | --- |
| Story summary | Title, problem hook, responsibility/tasks, project status, known outcome/lesson, relevant stack | Required summary is understandable and accurate; metrics/media are optional |
| Story depth | Problem, decisions, evidence, authored related work | Omit empty optional sections; decisions identify constraint/choice/consequence |
| Experience | Company name/logo, role/dates, contribution, multiple-project/main-product mode | Confirmed company/role/date facts; valid main-story association where selected |
| Studio settings | Name/description, personal context, contact destinations, featured story, order | Real contact destination; eligible published work references |

Field help gives one short purpose and an optional example labeled as an example. It never autofills invented outcomes or identity. Drafts may be incomplete; publication checks show missing inputs.
Experience associations reuse stories. A main-product selection must belong to that experience; switching mode changes presentation without duplicating story content. Explicitly detach an association to make a story standalone.
For a new main-product experience, guide context-only publication → associated story publication → explicit experience update selecting that story. Explain the temporary public no-project state before each confirmation.
Evidence editing supports caption, what it demonstrates, permission confirmation, text alternative, and public link or permitted upload. Inaccessible/failed media is removable; the story remains usable without it. Upload formats/limits are unresolved O05, shown before upload when chosen.
Order controls include Move up/Move down and an explicit featured-story selector; drag is optional and never the only method. Selecting/order editing changes a private settings draft until publication.

## 4. Editing state and actions

Show separate labels for project progress, public state, and editing state. For example: Cancelled / Published / Unsaved changes. Saving a cancelled project never changes its progress status.

| Action | Visible result | Failure / next action |
| --- | --- | --- |
| Edit | Saved working copy loads; title/public state visible | Retry or return to list without replacing existing input |
| Save draft | Explicit saving state, then Saved privately | Inline errors plus summary; retain values; retry |
| Preview | Open private public-layout preview of the exact saved candidate | If unsaved: Save and preview or Keep editing; save failure stays in editor |
| Publish / Update published content | Review candidate, affected surfaces, and dependencies; confirm | Unsaved/invalid/stale candidate cannot proceed; keep editing or save |
| Unpublish | Confirm removal impact and retained draft | Cancel keeps state; failure preserves public content |
| Delete draft/item | Confirm irreversible deletion and affected references | Block when still published or referenced; explain how to resolve |
| Discard unsaved edits | Confirm; reload latest saved working copy | Never deletes the working copy or changes public content |

Preview carries a persistent Private preview label and Back to editing. It displays candidate content with currently published dependencies; draft-only/missing dependencies are owner-only warnings, not silently included. Preview success does not claim publication readiness.
Review distinguishes existing public content from the candidate using labeled fields, changed sections, and association/order impacts. V1 needs no rich-text diff engine or version-history browser.
After confirmed success, show Published/Updated with the public link and timestamp. A confirmed rejection preserves the candidate/prior public version. If a request times out or delivery is uncertain, show Checking publication / Outcome unknown, inspect actual versions, and only then allow a safe retry; never claim rollback or success without evidence.

## 5. Navigation, conflicts, and destructive actions

Leaving with unsaved changes offers Save and leave, Discard and leave, or Keep editing; save failure stays on the current edit. Private-preview return restores editing context. Browser reload/close uses a native warning when available; no guarantee of unsaved recovery.
Two tabs can edit the same item. Stale saves/publications must not overwrite a newer version silently. Show a conflict: retain local input, offer Copy local text and Reload latest; retry only after review. No collaborative merge editor or actor audit is required in V1.
Unpublish/delete dialogs identify the item, public effect, affected feature/company/related links, and whether the draft remains. Safe Cancel is always available. Recheck dependencies at confirmation; newly changed impact requires renewed review.
Unsaved-change discard and permanent deletion are different labels/actions. Do not use Delete for removing optional evidence from an editor before its draft is saved.

## 6. Responsive and accessible owner editing

Use the [shared perception/reading targets](accessibility-responsive-spec.md). At 320px, editor fields/actions reflow; status remains visible and action bars cannot cover errors or the focused field. No desktop-only publishing capability.
Resize, orientation and on-screen-keyboard changes preserve editor values, focus and caret where the field remains active. Scroll the focused field and its validation/help into usable view rather than shrinking text or clearing input. Review comparisons stack with explicit public/candidate labels; no narrow-only loss of publishing or recovery actions.
Labels remain visible; required/optional state and errors use text. An error summary links to fields; failed submissions focus the summary, then preserve input. Announce save/publication state without moving focus unnecessarily.
Dialogs have a title, described impact, predictable initial focus, Escape/Cancel, contained keyboard focus, and return to the invoking control. If the item disappears, focus a valid list heading instead.
In short-height/zoomed viewports, dialog content scrolls within the available area; title/impact and confirmation/cancel actions remain reachable without page overflow or an obscured focused control. Resizing preserves the open dialog and its operation; theme changes do not dismiss or confirm it.
Lists work as readable stacked entries when tables do not fit. Reordering announcements identify item and new position. Upload accepts a normal file picker, not drag alone. Reduced motion removes decorative travel.

## 7. Review scenarios

| ID | Action | Expected result |
| --- | --- | --- |
| OU01 | Edit public story → Save → public view | Saved privately; public content unchanged |
| OU02 | Unsaved draft → Preview → save fails | Input remains; no stale preview presented as current |
| OU03 | Update candidate → publish fails → retry | Old public version intact; success only after confirmed update |
| OU04 | Leave/sign out with unsaved edits | Three clear choices; failed save preserves editor |
| OU05 | Edit same item in two tabs | Stale operation blocked; local text recoverable before reload |
| OU06 | Unpublish featured/main-product story | Impact explained; safe public fallback; draft retained |
| OU07 | Delete published/referenced experience | Blocked with affected references and resolution paths |
| OU08 | Keyboard/320px: edit, reorder, preview, confirm | Complete flow, visible labels/errors/focus, no covered controls |
| OU09 | Session expires mid-edit | Writes stop; sign-in/conflict recovery; no private public-preview link |

## 8. Open boundaries

Detailed behavior is for review. O01–O03 block truthful publication; O05 blocks authentication/recovery, upload, and persistence implementation. No autosave, bulk publishing, scheduling, reusable page blocks, revision-history UI, or multi-owner workflows in this draft.
