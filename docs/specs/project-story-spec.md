# Project–Story relationship and lifecycle
Status: owner-approved UX requirements; NOT an implementation-ready schema/migration specification.
Recorded: 2026-10-14 | Authority: [P19 checkpoint](../ux-requirements-checkpoint.md).
Companions: [public experience](ux-public-checkpoint.md), [existing publishing](content-publishing-spec.md).
Preserve unaffected authorization, private asset and explicit-update guarantees; resolve overlapping legacy contracts before implementation.

## Relationship — PS01–PS05
- PS01: Project and Story are distinct entries. One Project can have zero or many Stories; one Story has zero or one Project.
- PS02: Stories may be created/published independently with no relationship to any other entry. The optional Project is chosen at creation.
- PS03: Moving/reassigning a Story or manually attaching/detaching it later is out of scope for now. The owner may recreate content under a different Project.
- Exception: deleting a Project with Keep Stories detaches its children into standalone entries (PS08).
- PS04: Both have independent Private (unpublished, owner-only) and Published (visitor-visible) states. No separate Ready status.
- PS05: A Project can publish with no published Stories. A Story can publish while its linked Project is private; hide that Project's name/link and relationship-derived private metadata. Authored Story content itself still requires owner review for disclosure.

## Project bulk actions — PS06–PS07
| Action | Owner choice | Public result |
| --- | --- | --- |
| Publish/republish Project | Project only | Linked Stories retain current states |
| Publish/republish Project | Select private Stories, with Select all | Publish Project and selected Stories; unselected Stories stay private |
| Unpublish Project | Keep Stories published | Project hidden; public Stories remain, without Project link |
| Unpublish Project | Unpublish all linked Stories | Project and all linked Stories private; already-private Stories unchanged |
- PS06: Readiness is Arvin's selection plus required publishing-field checks before confirmation; no manual Ready flag or automatic publication merely because fields are complete.
- Existing published Stories remain unchanged during Project publishing; this action does not silently publish their pending edits.
- Show selected/affected counts and missing required fields before confirmation; preserve input for corrections. Do not describe every unpublished Story as invalid or unfinished.
- The earlier blanket all-Stories invalidity example was corrected by explicit selection. Bulk partial failure/retry/concurrency mechanics remain unresolved, not implementation discretion.
- PS07: Unpublish choices preserve stored content for later editing/publication. Project progress/launch status is independent from visibility.

## Permanent deletion and Home protection — PS08–PS10
- PS08: Unpublish and Delete are separate. Delete removes the entry completely from the database; no Trash or restore feature.
| Project deletion choice | Stories |
| --- | --- |
| Keep Stories | Become standalone; content and publication states preserved |
| Delete all related Stories | Every linked Story, private or published, permanently removed |
- Confirm scope/counts and identify published content being removed. Story deletion never implies Project deletion.
- PS09: A manually chosen Home Project or Story cannot be unpublished/deleted while selected. First replace it or explicitly remove it from the Home selection.
- Applies to featured Project, manual More Projects and manual Home Stories, including indirectly affected Stories in Project bulk unpublish/delete.
- If any affected manually selected item remains, block that operation with the specific items and a path to edit Home selection; do not silently hide/replace them.
- PS10: Automatic latest sections do not lock entries; eligible published items refill naturally after removal. No automatic replacement in manual mode.
- Record/media dependencies, owned/shared media removal, referenced-delete resolution and public snapshot/cache handling need an implementation contract; do not cascade files from this UX rule.

## Owner edits — PS11–PS12
- PS11: Save keeps working edits private. Preview reviews the candidate. Publish exposes new content; Update published version explicitly replaces the live version.
- Visitors retain the previous published version until successful Update; Save or failure never partially exposes edits.
- PS12: Owner workflow must distinguish saved/unsaved edits and public/private state, explain blocked actions and preserve input on failure. Existing P12 session/conflict/focus/accessibility recovery remains in scope.

## Observable checks
| ID | Scenario | Expected |
| --- | --- | --- |
| PSP01 | Standalone Story / empty Project | Both can publish independently |
| PSP02 | Private Project, public Story | Story visible; private parent relationship absent |
| PSP03 | Publish Project only | Child states and published child content unchanged |
| PSP04 | Select 2 of 3 private Stories | Selected entries checked; unselected entry remains private |
| PSP05 | Unpublish with each choice | Public Stories retained or all children hidden as explicitly chosen |
| PSP06 | Delete Project with each choice | Standalone preservation or permanent removal of all children |
| PSP07 | Home-selected child affected by bulk removal | Blocked until selection changed explicitly |
| PSP08 | Save edits to public entry | Candidate private; old public version retained until Update |
These scenarios are not executed tests. Schema, migration, concurrency/recovery, record limits and exact endpoints remain unresolved.
