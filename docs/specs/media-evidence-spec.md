# Project Images, Video, and Evidence

Status: P15 confirms the documentation brief; detailed UX below is proposed, with rendered/runtime validation pending. Updated: 2026-10-07.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md). Companions: [public UX](public-ux-spec.md), [owner UX](owner-ux-spec.md), [publishing](content-publishing-spec.md), [visual system](visual-system-spec.md), [accessibility](accessibility-responsive-spec.md).
Trace: R04, R06, R08–R09, R13–R19, R20–R26; A01–A12. Documentation only: no asset creation, application changes, or upload infrastructure approval.

## 1. Purpose and choice

ME01: use a real, permitted visual when it helps identify work, understand a decision, or inspect behavior. Imagery participates in Signal Studio's work stage; it is not decorative wallpaper or a requirement for every object.
ME02: use screenshots for appearance/state, diagrams for relationships, and recordings for transitions, animations, or a task sequence. A still cannot establish motion; a recording cannot establish production use, authorship, or customer impact.
ME03: text explains the contribution and evidence limits before playback. No-media work remains eligible for feature/browse and has complete hierarchy; missing assets never require fabricated substitutes.

| Evidence kind | Good use | Required explanation |
| --- | --- | --- |
| Screenshot or detail crop | Real page, component, validation state, responsive layout | What to notice; captured build/stage; meaningful limits |
| Screen recording | Actual transition, animation, or workflow in a runnable build | Starting state → action → result; stage; duration; silent/with audio |
| Design/prototype capture | An authored design or prototype when the implementation is absent | Label Design or Prototype; distinguish intended behavior from implemented behavior |
| Diagram or comparison | Architecture/decision or an authentic before/after | Meaning, version/context, Arvin's contribution; no invented baseline |
| Text record or public link | Decisions/tests/source when visuals add little | What it supports; permission and usable destination |

## 2. Placement map

| Surface | Visual contract | No-media / interaction contract |
| --- | --- | --- |
| Home feature | One authored representative project still or video poster beside the hook/action | Open work enters the story; no home player/autoplay; text composition when absent |
| Work browse | Reuse that Story's authored/published discovery cover: an image, or a static poster associated with its recording; smaller than the featured stage | Static story-opening projection only: no inline player/autoplay/hover playback, no Browse-only thumbnail asset; complete text composition with no slot when absent |
| Story summary | One lead still or recording poster after title/contribution/status, before section depth; never bury all visual evidence in a tab | Image is visible directly; Play demo operates inline; summary/return remain available |
| Problem / Decisions | Place a relevant figure beside the explanation it supports; reference the same underlying Story Evidence identity | Not independently editable; selecting/inspecting targets that canonical Evidence item; essential explanation remains text |
| Evidence | Authored ordered items with a concise caption; open one detailed inline inspection at a time | Explicit item buttons/links; no auto-rotating carousel or required modal; empty section omitted |
| Experience | Company header stays logo/name only; multi-project choices reuse each published Story's discovery-cover projection; an embedded main-product Story uses its normal lead/evidence roles | No Experience-specific media copy, company cover, or autoplay; complete text choice/story when media is absent |
| Related work | Optional compact still with the authored related title, using that story's published cover | Ordinary story link; no player or invented relation |
| Personal context | Optional owner-approved portrait/interest photo only when it adds truthful personal context | No stock persona or required portrait; text remains sufficient |
| Contact / navigation / sign-in / feedback | No project imagery needed to perform these tasks | Keep destinations, labels, status and recovery clear |
| Owner list / editor / preview / publish review | Compact asset identification in list; media controls in story; same public composition in private preview; labelled public/candidate comparison | Never turn owner editing into a gallery dashboard; show readiness and private/public state |
| Public share preview | Optional static published project cover/poster with truthful title/status context | Text metadata when absent; no video, draft cover or private-preview share image |

## 3. Truthful unshipped work

ME04: distinguish project progress, release history, current availability, and recording stage. [Content/publishing](content-publishing-spec.md#2-orthogonal-states) owns the state vocabulary. Unknown facts stay unconfirmed in authoring; never infer a release from Completed or a failure from Offline.
Keep confirmed Cancelled / Never shipped / No live demo context beside the summary and lead media. Covers/posters in entry/browse must not contradict that context. A story can be complete, published, and featured while its project never shipped.
Identify the captured state: Design, Prototype, Local build, or Production capture, only when confirmed. Add capture date/build context when known; omit unknown dates. A current local recording of old code is labelled Recreated local demo, not an original production capture.
For cancelled work, explain completed and unfinished parts, personal contribution, and the reason/lesson only if confirmed. Show the strongest relevant permitted UI/task evidence; no dead Visit site action, simulated customers, or invented outcomes.
Example fixture, not a claim about Unixsee: Cancelled · Never shipped; Local build recording showing an implemented drawer animation; backend checkout unfinished. The owner must confirm actual facts/assets before publication.

## 4. Inspection and playback

ME05: identify the item and purpose → Open evidence or Play demo → inline image/player with caption, stage, alternatives and controls → Close/Retry → restore the invoking control. Opening a poster does not require a second Play action; an explicit Play request starts playback when ready, subject to browser permission. Deep links only select content and never start playback.
Pause, seek, replay and volume/mute (when audio exists) are operable by touch/keyboard and have accessible names. Show duration and silent/with-audio context before Play. Do not add background music solely for presentation.
No autoplay on load, scroll, hover, focus, theme change, resize or return. End stops on a meaningful frame and offers Replay; no default looping. Only one recording plays at a time. Closing, hiding its panel, changing item or leaving the story stops playback/audio.
Lead media remains visible with the summary when sections change. Section/evidence/history behavior follows [navigation/state](navigation-state-spec.md); selecting evidence from a figure opens that same item in Evidence. Playback time is not a shareable location. Returning, resizing or switching theme never starts/restarts playback; preserve playback position in the active view where feasible, with no cross-visit persistence promise.
Image inspection can expose a larger contained original for small UI details. A labelled Open image action keeps its caption/context; optional zoom has buttons, keyboard equivalents and Reset. No page-level horizontal overflow or essential pinch/drag-only action.
Loading affects only the media area and retains its caption. Failed lead/evidence delivery retains the published explanation and offers scoped Retry plus Close when inspection is open; it does not silently substitute a different asset. A poster remains static unless its actual recording/source is available; never manufacture playable video from a poster or missing source. An unavailable external demo does not invalidate captured evidence.

## 5. Composition and delivery experience

ME06: keep original colors and proportions in both themes; never recolor/invert project evidence. Use a neutral frame only for separation. Titles, status, captions and controls live outside busy imagery on readable surfaces.
Use the asset's aspect ratio in detail and contain the complete capture. A 16:10 discovery frame is a starting proposal for wide UI screenshots, not a forced crop. Tall/mobile captures retain their shape; paired captures stack on narrow views in authored reading order.
Allow a discovery crop only after owner review preserves the subject and truthful context; the detail view exposes the full capture. Prefer a focused excerpt plus full inspection over shrinking a long page until text is illegible. Captions wrap and controls reflow at 320px/zoom.
Reserve media space from known dimensions while loading; use responsive image renditions and a lightweight video poster. Load lower evidence on demand; do not download every recording for home/browse or before Play. Keep text/actions usable on slow connections, with reduced data or failed media delivery.
Use only an app-authorized published asset for public renditions/posters/share images. Provider embeds are not baseline scope; an external host is a labelled ordinary link unless a later spec addresses accessibility, privacy and delivery. Exact byte/duration/dimension/codec limits and performance budgets belong to a bounded upload/delivery spec; [T04](../architecture/runtime-operations.md#2-filesystem-media--t04) remains unchanged.

Fallback/failure states are distinct:

| State | Canonical behavior |
| --- | --- |
| No authored media | Render the complete text composition with no filler, reserved empty slot, or dead Play control. |
| Failed discovery media delivery | Keep the Story or Experience project choice usable/openable with its known text/status/context; show no broken-placeholder replacement and do not silently substitute another asset. |
| Failed lead/evidence delivery | Keep caption/explanation and surrounding story usable; offer scoped Retry and Close for an open inspection rather than replacing the whole destination. |
| Missing actual recording/source | A poster can remain a static visual only; never expose Play or fabricate a recording/source that is not available. |
| Owner selected media pending/failed | Publication remains blocked until the item is Ready or explicitly removed from the candidate; preserve candidate input and the existing public state. See [owner UX](owner-ux-spec.md#3-structured-authoring) and [publishing](content-publishing-spec.md#4-publication-checks). |

## 6. Authoring and publication

ME07: within the story, choose Image / Recording / Diagram / Text-link → supply title, purpose/caption, stage/source context, permission, alternatives and permitted file/link → review readiness → choose lead/cover and evidence order → Save privately → exact candidate Preview → explicit Publish/Update.
Cover/lead selection and poster/caption/alternative edits belong to the story candidate. Choose at most one discovery cover and one lead item; these may differ. Lead/cover/contextual figures reference story evidence by identity, so reuse never creates independently editable copies; selecting a contextual figure targets that same Evidence item for inspection. A video poster must come from the actual recording or a clearly identified screenshot of the same build/state; it cannot promise an unseen feature.
Show Selected / Uploading / Processing / Ready / Failed where applicable, with an actionable error. A file upload or retry alone does not save/publish the story. Failed/pending selected media blocks publication until ready or explicitly removed; do not silently omit it, and preserve the candidate input plus prior public state. No automatic transcoding/poster generation is promised by this UX proposal.
Allow a normal file picker and Move up/down controls; drag is optional. Keep completed media/text and other fields on failure. Removing an item from the candidate explains affected lead/cover/figure uses and is not labelled permanent Delete. Binary files that cannot be recovered after session expiry require reselection with a clear message; preserve saved assets and retained text.
Private preview shows the saved candidate's actual lead/cover, video and alternatives; list edits/state remain owner-only. Review identifies media added/replaced/removed, captions/stage changed, order/cover changed, and public projections affected (feature, browse, experience, related and share preview).
ME08: [publishing](content-publishing-spec.md) governs atomic snapshots and removal. Source media, renditions, posters, caption tracks and described versions have the same authorization/reference lifecycle. A draft replacement must never overwrite a public asset. A story update refreshes projections that reference it without publishing another unit's private edits.

## 7. Verification boundary

| Check | Observable pass condition | Acceptance |
| --- | --- | --- |
| MV01 · ME01–ME03 | Published discovery cover works in feature/browse/Experience choices as a static image/poster projection; detail uses normal lead/evidence roles; no-media story is equally navigable without filler | A01, A04, A12 |
| MV02 · ME02/ME04 | Cancelled/never-shipped local demo demonstrates UI/motion with truthful stage/contribution; no implied launch or dead demo link | A04, A10 |
| MV03 · ME05 | Explicit Play, keyboard controls, stop on close/leave, Replay, deep link without playback, and media-only failure recovery | A03, A08–A09, A11 |
| MV04 · ME06 | Wide/320px/zoom/light/dark render preserves crop intent, full inspection, caption/focus, proportions and original colors | A09, A12 |
| MV05 · ME07 | Picker/reorder/replace/failure/expiry preserves retained work; saved private preview and labelled publish review show exact media | A05–A06, A09 |
| MV06 · ME08 | Draft source/poster/rendition/track denied anonymously; successful update changes public projections atomically; removal respects references | A06–A08 |
| MV07 · ME03/ME05 | [Media alternatives](accessibility-responsive-spec.md#4-evidence-and-motion) convey screenshot meaning and recorded behavior without seeing/hearing/playing | A04, A09–A10 |
| MV08 · ME06 | Slow/failed discovery delivery keeps Story/Experience choices openable without substitution; failed lead/evidence keeps explanation plus scoped recovery; discovery does not fetch all recordings | A08–A09 |

All MV checks are unrun. Existing text-only #23 behavior/evidence is not media acceptance; new layouts, player behavior and asset privacy require evidence on their own implementation SHA. Actual files, permission, captured stages and release history remain O01/O02 factual inputs.
