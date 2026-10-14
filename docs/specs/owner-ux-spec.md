# Owner UX Specification

Status: reconciled P19–P25 owner behavior; P02/P12 recovery approved; P15 full-product media/editor components unapproved. Updated: 2026-10-15.
Authority: [OWN01–OWN06](owner-content-checkpoint.md), [UXD06–UXD07](ux-public-checkpoint.md), [PS01–PS13](project-story-spec.md), [CT01–CT12](contact-ux-checkpoint.md).
Accepted: P02 explicit publishing; P03–P04 focused V1; P08 structured editing; P12 explicit save/candidate review/conflict/session recovery/accessible confirmations.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md). Companion: [content/publishing](content-publishing-spec.md). Trace: R12–R21; A05–A09.

## 1. Owner's job and workspace

Private management areas are **Projects, Stories, Experience, Site settings**, per [OWN01–OWN06](owner-content-checkpoint.md). Projects and Stories each have **All items** and **Home selection** views; item editors are separate. All items show Private/Published, Edit and published-only Pin/Unpin. All Stories may filter by Project; pins are shared with public browse and the linked published Project's Stories list. Experience order is managed in Experience; Site settings controls identity, About, offerings and Contact **but not Home selection/order**.
Home manual membership/order belongs to its matching Projects/Stories Home selection view, not settings/item editor. Apply/Discard arrangements are separate from item Save/Publish. Public Home's fixed section order, manual selection limits and exclusions follow UXH; pins do not impose a manual full-collection or per-Project rank. No résumé builder, enquiries inbox, analytics dashboard or mandatory taxonomy editor.

## 2. Identity and access

One provisioned owner; no public registration or invitation flow. Sign-in shows labeled credentials and a generic failure message without account disclosure. T03 selects Better Auth email/password with public sign-up disabled; [runtime operations](../architecture/runtime-operations.md) owns recovery/session details.
Sign-out returns to sign-in and prevents revisiting private content through cached views. If edits are unsaved, offer Save and sign out, Discard and sign out, or Keep editing. Failed save does not sign out or lose input.
Expired session stops writes and shows Sign in again. Retain in-session editing input where feasible; after reauthentication reload the saved revision and require conflict handling before retry. Cross-refresh persistence of unsaved input is not promised. Emergency credential recovery is SSH-only per T03; editor recovery behavior remains P12.

## 3. Structured authoring

P08 structured editing means purposeful labelled content, **not** mandated rich text, plain-text paragraph, repeatable groups or a Story Problem/Decisions/Evidence editor. P21 [UXD06–UXD07](ux-public-checkpoint.md) own publishing minima: Project **name, overview (what/who), individual contribution**; Story **title, short introduction, explanation**. Private drafts may be incomplete; exact controls, formatting, fields and validation/limits remain open. P25 hierarchy defines public reading order, not editor implementation.
A Story optionally chooses one Project at creation; no later reassign/detach except Project deletion with Keep Stories (PS01–PS03/PS08). Both publish independently, including public Story under private Project with no parent metadata exposure. Optional labels can be reused/renamed/deleted (OWN06). Company, technologies, cover/showcase, Story media, live/source/docs links and Project factual progress/release/availability remain optional; no invented job title or shipped status. Project progress is optional **In progress/Completed/Cancelled** with release/availability notes in Additional details (UXC07/OWN03).
Full-product media editing is still a design task. Historical [W43](../implementation/43-work-p15-p16-media-motion-retrofit.md) accepted existing Work media and Problem figures but no mandatory P19 Story media schema/section controls. Where optional selected media is authored, protect private assets, captions/alternatives/rights/readiness and retained input; no automatic video pipeline or fake screenshot. New source images require [VSRC](visual-source-workflow-spec.md).

## 4. Editing state and actions

| Action | Visible result | Failure / next action |
| --- | --- | --- |
| Edit / Save | Explicit Saved privately; public version remains until Publish/Update | Retain input and explain field/error conflict |
| Private Preview | Exact saved candidate with Private label; Back returns to editing context | Unsaved input requires Save or Keep editing; preview success does not establish publication readiness |
| Publish / Update content | Review candidate; explicit confirmation updates live on success | Older public content remains after confirmed failure; unknown result checked before retry |
| Unpublish | Explicit Project-only/Keep or Unpublish linked Stories scope | Applied Home choices block affected entries (PS09); confirmed together-or-unchanged (PS13) |
| Delete permanently | Explicit Keep Stories (detach) or Delete all related Stories; no Trash | Confirm counts/indirect impact, reject stale scope; no file cascade inferred |
| Discard unsaved editor edits | Restore last saved working copy, discarding only unsaved session input | Never delete saved copy or change published content; distinct from permanent Delete |
| Pin / Home order / selection | Changes stay pending in matching All items or Home selection view | Apply changes or Discard changes; confirmed failure retains pending work and prior live arrangement |

Apply arrangement changes only, never draft text or item publication (OWN04); leaving pending arrangement offers **Apply / Discard / Stay**. Leaving unsaved editor offers **Save / Discard / Keep editing**. Applied Home-feature/Story/More Projects choices must be successfully changed before affected unpublish/delete; merely pending removal does not unlock. Automatic latest refills; manually curated selection never silently replaced.
Returning from private preview restores editing context; preview success does not establish publication readiness. Full candidate preview/media comparison labels Public versus Candidate; no mandatory rich-text diff/history browser. Pending writes prevent duplicate confirmation but do not claim that navigation cancels server work.

## 5. Navigation, conflicts, and destructive actions

P12 retains unsaved input, warning/leave choices, safe sign-out, expiry reauthentication, stale-revision conflict handling and Copy local text / Reload latest recovery. Two-tab edits must never silently overwrite. Native browser close warning is best-effort, not guaranteed recovery.
Confirm removal impact for Projects, Stories, Home picks and linked private/public children; project bulk choices succeed **together or unchanged** on confirmed outcome (PS13). A timeout/unknown outcome requires checking versions before retry. No automatic attachment/reassignment or silent Story/asset deletion. Dialogs allow Cancel; renewed impact requires renewed confirmation. Pin/label operations never publish unsaved Project/Story content.

## 6. Responsive and accessible owner editing

Use the [shared perception/reading targets](accessibility-responsive-spec.md). At 320px, editor fields/actions reflow; status remains visible and action bars cannot cover errors or the focused field. No desktop-only publishing capability.
Resize, orientation and on-screen-keyboard changes preserve editor values, focus and caret where the field remains active. Scroll the focused field and its validation/help into usable view rather than shrinking text or clearing input. Review comparisons stack with explicit public/candidate labels; no narrow-only loss of publishing or recovery actions.
Labels remain visible; required/optional state and errors use text. An error summary links to fields; failed submissions focus the summary, then preserve input. Announce save/publication state without moving focus unnecessarily.
Dialogs have a title, described impact, predictable initial focus, Escape/Cancel, contained keyboard focus, and return to the invoking control. If the item disappears, focus a valid list heading instead.
In short-height/zoomed viewports, dialog content scrolls within the available area; title/impact and confirmation/cancel actions remain reachable without page overflow or an obscured focused control. Resizing preserves the open dialog and its operation; theme changes do not dismiss or confirm it.
Lists work as readable stacked entries when tables do not fit. Reordering announcements identify item and new position. Upload accepts a normal file picker, not drag alone.
Owner/admin interface feedback is motionless at every breakpoint: no CSS/view/motion-library transitions, animated hover/press feedback, enter/exit motion, spinner/shimmer, layout animation or animated responsive rearrangement. State/style changes are immediate. User-invoked project recording playback in preview/evidence is content, not workspace UI animation, and never autoplays. If `$mobile-native` is used here, apply only viewport/keyboard/safe-area/touch/pointer/hover-capability rules and ignore its animation guidance.

## 7. Review scenarios

| ID | Action | Expected result |
| --- | --- | --- |
| OU01 | Public Project/Story → Save | Working copy only; public content unchanged |
| OU02 | Unsaved draft → Preview → return | Failed Save retains input/no stale preview; Back restores editing context; preview does not prove readiness |
| OU03 | Update confirmed fail / outcome unknown | Keep previous public content on confirmed failure; reconcile unknown before retry |
| OU04 | Discard unsaved edits or leave pending arrangement | Editor Discard restores saved copy without public change; arrangement Apply/Discard/Stay separate; failures retain input |
| OU05 | Concurrent tabs edit entry | Stale writes blocked, local input recoverable |
| OU06 | Unpublish manually Home-selected item | Block until successful Home Apply removes reference |
| OU07 | Delete Project with linked Stories | Keep/detach versus Delete all choices; confirmed atomic scope |
| OU08 | Keyboard/320px: edit, pin, Home move, preview | All actions usable; visible state/focus/errors |
| OU09 | Session expires during edit | Block private writes; preserve recoverable input |
| OU10 | Optional Project/Story media → Save/Preview/Update | No leaked draft media; old public retained on failure |

Historical P12/Work evidence does not certify new P19/PS13/OWN flows.

## 8. Open boundaries

P12 recovery remains approved. Specific schema, widgets, media limits, label persistence, bulk/retry transactions, migrations and visual layouts require bounded specs. O01–O03 gate real publication only. No autosave, scheduled publishing, version browser or multi-owner flows. Exact-image approval and later implementation/review remain separate.
