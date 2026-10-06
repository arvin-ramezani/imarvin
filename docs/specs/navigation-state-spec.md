# Navigation and State Specification

Status: proposed behavior for review, including P15 media transitions | Updated: 2026-10-07.
Depends on [public UX](public-ux-spec.md), [PRD](../../PRD.md), [decisions](../decisions.md). Trace: R07, R11, R19–R25; A03–A04, A07–A09, A11.
URL shapes below are conceptual contracts; routing implementation and storage are deferred to architecture. Public delivery uses published content only; this document does not approve P02's authoring lifecycle.

## 1. Public destinations

| Destination | Proposed location | Independent entry |
| --- | --- | --- |
| Studio entry | / | Identity, available featured work, Browse/Contact |
| Work collection | /work, optional company selection | All published work or valid company subset |
| Work story | /work/{story} | Summary plus selected available section |
| Company experience | /experience/{experience} | Context plus project choices or main product directly |
| Personal context | /about | Approved personal content and work/contact paths |
| Contact | /contact | Approved destinations; no forced exploration |

Stable identifiers survive title changes. Company/section/evidence selection may be encoded as named URL parameters; exact encoding is an architecture decision. Links must round-trip to the same public content without temporary browser state.
Origin context is local navigation state, not a required part of shared links. A shared story link must not depend on a prior company/filter view.
For a main-product experience, section/evidence selection belongs to the embedded story at the experience location. Its standalone work location addresses the same content; neither maintains a separate story version.

## 2. State vocabulary

| State | Meaning | Persistence contract |
| --- | --- | --- |
| Destination + story/experience | Current public content identity | Shareable location |
| Section | Problem, Decisions, or Evidence | Shareable; validate against published sections |
| Evidence selection | Currently inspected evidence, if any | Shareable when public; nested under its story |
| Company filter | Collection subset | Shareable; All work is the default |
| Origin | Entry, collection, or experience that opened detail | Local navigation context |
| Return position | Origin's selected item, scroll position, invoking control | Restore within the current visit when still valid |

No login is needed to browse. No cross-device or permanent personalization is required. Do not select session/local storage or cache infrastructure in this UX document.

## 3. Transition contracts

| Trigger | Result / history | Return and focus |
| --- | --- | --- |
| Open Home/Browse/experience/story/Contact | Navigate; add a destination to browser history | New view announces its title; browser Back returns to previous destination |
| Choose/clear company filter | Update collection and location; replace current history entry | Keep filter control focused; announce count; reset results to start |
| Open a story from collection/experience | Preserve origin and return position; add story destination | Focus story heading; explicit Return targets stored origin |
| Switch detail section | Update selected panel/location; replace current history entry | Focus stays on section control; summary remains available |
| Open/close inline evidence | Update selection/location; replace current history entry | Open focuses inspection heading; Close restores its trigger |
| Play/Pause/seek recording in lead or evidence | Player state only; no new history/location; explicit Play starts when ready | Focus stays on control; Close/leave/hide/item change stops playback/audio; ME05 |
| Choose authored related story | Add new story destination; previous story is its origin | Back returns to previous story section/position |
| Browser Back/Forward | Restore the destination and its saved selection | Restore invoking item/reading position when available |
| Explicit Return with no valid origin | Navigate to All work | Focus collection heading; no assumed filter |

Section/filter/evidence inspection must not create a long stack of browser-Back steps. Explicit Return uses the recorded origin; it never blindly leaves the app for an external referrer. A direct entry can always navigate to Work or Home.
When an origin exists in app history, Return traverses to it rather than creating duplicate history loops. When not restorable, navigate to the safe fallback.
History replacement preserves origin context. Returning from detail restores the filter, selected item, and position before placing focus; it must not jump to the collection's first item.
If the old item disappeared, restore the valid filter and nearest meaningful position or collection heading. Do not render removed/private content from a cached return snapshot.

## 4. Share and invalid locations

- A copied detail location includes the selected section/evidence, not private origin state.
- Invalid or missing section: show the summary and first available section; correct location without adding history.
- Missing/nonpublic evidence: keep the story; show a neutral unavailable note and close action; omit asset metadata.
- Unknown company filter: reset to All work with a brief visible explanation; no draft company details.
- Missing story/experience: same neutral unavailable response for nonexistent, unpublished, or removed entries. Browse work/Home/Contact remain available; no leaked title or removal reason.
- Story/experience changes: use current published content. If a section/evidence is gone, apply the fallbacks above.

## 5. Loading, empty, failure, and absence

| Condition | Visible state | Next action / retained context |
| --- | --- | --- |
| Destination loading | Current title/context where known; clear loading text | Existing navigation stays usable; no invented content skeleton labels |
| Section/evidence loading | Active label and loading status within its area | Keep summary; switch away or close |
| No published stories | Honest collection-empty message | Home/personal context/Contact |
| Filter has zero results | Active company, zero count, concise message | Clear company; retain filter until cleared |
| Story request fails | Request-error message distinct from unavailable content | Retry same destination or Browse work; preserve origin |
| Evidence request fails | Caption if public, failed-media message | Retry or Close; keep story intact |
| Optional media/link absent | Complete text layout; omit missing controls | Continue normal exploration |
| Content becomes nonpublic | Remove content from the active surface when detected | Neutral unavailable state; safe navigation |

Retry does not add history, reset the filter, duplicate an action, or overwrite the currently selected destination. Late results from an earlier selection must not replace a newer selection.
Evidence selection is valid only inside Evidence: switching away closes inspection and its playback. Summary lead media stays visible across section changes; a contextual figure can select the same evidence item in Evidence. Opening a deep link selects content without playing video; Close leaves Evidence selected. With no sections, keep summary/optional lead alone and remove obsolete section/evidence parameters. [ME05](media-evidence-spec.md#4-inspection-and-playback) owns player/position/return behavior.
An unavailable live demo is not a story error. Historical/local/prototype evidence retains its confirmed stage; progress, release history and availability stay distinct from loading/failure states. Failed cover/poster/image keeps the story-opening action and truthful text; failed playback retains explanation and recovery.

## 6. Public privacy contract

Only approved published fields/assets may appear in public rendering, shared metadata, indexing, navigation, filters, or error responses. Draft-only items do not create collection counts or choices.
Owner preview is a separate private path, not a public section/state. Authorization, asset delivery, cache invalidation, and index removal belong to later architecture/publishing specifications; privacy is not proven here.

## 7. Review scenarios

| ID | Action | Expected result |
| --- | --- | --- |
| NS01 | Filter → open story → switch twice → Browser Back | Return directly to filtered collection and invoking item |
| NS02 | Copy Evidence location into a new visit | Same public story/evidence; Return leads to All work |
| NS03 | Story → related story → Back → Forward | Correct story, section, and reading context each time |
| NS04 | Open stale section/filter/nonpublic story link | Defined safe fallback; no private identity disclosed |
| NS05 | Request fails; retry; switch before response | Current selection wins; no history duplication |
| NS06 | Repeat flow at mobile width/by keyboard | Same content and return semantics; no hidden origin control |

Checks are pending implementation. Companion [accessibility contract](accessibility-responsive-spec.md) governs focus and announcements. Detailed route encoding, history restoration mechanism, and delivery failures remain technical-spec work.
