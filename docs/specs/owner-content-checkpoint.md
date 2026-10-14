# Owner content management — approved checkpoint
Status: owner-approved P21 requirements; exact controls, layout and implementation remain open.
Recorded: 2026-10-14; ordering placement explicitly approved 19:58 Asia/Tehran.
Authority: [UX checkpoint](../ux-requirements-checkpoint.md), [decisions](../decisions.md).
Companions: [public content](ux-public-checkpoint.md), [relationships/publication](project-story-spec.md), [Contact](contact-ux-checkpoint.md), [owner recovery/accessibility](owner-ux-spec.md).
This scoped record supersedes Site settings → Home content and Project-editor Story ordering proposals. It does not authorize a page builder, new code/images or automatic publication.

## Areas and control ownership — OWN01–OWN03
- OWN01: Use Projects, Stories, Experience and Site settings as private management areas. Site settings owns identity, About, offerings and Contact; selection/ordering belongs in content lists, not Site settings or individual content-editing forms.

| Area | Selection/order task |
| --- | --- |
| Projects | Full collection order; clearly labelled Home selection for the one Featured Project and More Projects |
| Stories | Full collection order; Home selection; filter by Project to order that Project's Stories |
| Experience | Entry ordering directly in its list |
| Site settings | Identity, About, offerings and Contact content/destinations |

- OWN02: Every visible ordering list names its scope: All Projects, All Stories, Home Projects, Home Stories or Stories for [Project]; Experience also names its entry-order scope. Reordering changes only that scope. Use one authoritative control per scope, not duplicate editors or unlabeled global rank values.
- In Projects, Featured Project selection is distinct from More Projects membership/order; exactly one published feature is manually chosen. Home collections preserve latest/manual modes, <=4 Stories/<=3 More Projects and feature exclusion under UXH03–UXH05. Home section order stays fixed under P20.
- Project filtering in Stories changes the viewed subset and its display order, never Story ownership. Optional-parent-at-creation and no reassignment remain PS01–PS03. A published Project's related list exposes only published Stories under UXC06.
- Full collection order, Home selection/order and each Project's Story order are independent. Changing one must not silently change any other. New-item insertion, date ties and filtering details remain open in the main checkpoint.
- OWN03: Core editors prioritize approved text minima (UXD06–UXD07). Project progress is optional; optional release/availability context is grouped under Additional details. Preserve separate facts and truthful/public-private meanings under UXC07, without requiring every project to fill a status matrix.
- Labels are created/reused while editing Projects/Stories under UXN04; no separate mandatory taxonomy workflow or layout-by-label system.

## Publishing and protection — OWN04–OWN05
- OWN04: Ordering/selection edits follow explicit private Save → private Preview → Publish/Update. They never automatically publish an entry or apply a live change merely because an item was moved/selected. Prior public content stays until confirmed successful update; existing P12 recovery/accessibility rules apply.
- The exact settings/order publication unit and candidate-versus-live manual Home protection remain unresolved; define them in a bounded publishing contract before implementation. This record does not choose a schema or transaction boundary.
- OWN05: PS09–PS10 Home-removal protections remain: manually selected entries, including indirectly affected children, block unpublish/delete until explicitly replaced/removed from the Home selection. Explain affected items and link to the appropriate Projects/Stories Home selection list. Automatic latest sections refill normally; manual sections do not silently refill.
- Reordering supports visible Move up/Move down controls; drag may supplement them, never replace them. Preserve clear scope, feedback and keyboard/mobile access; owner interface motion remains off under P16.

## Observable checks
| ID | Scenario | Expected |
| --- | --- | --- |
| OWNP01 | Arrange Home Projects or Stories | Controls live in the matching content area; limits/feature exclusion preserved; full collection order unchanged |
| OWNP02 | Filter Stories to a Project and reorder | Only that Project's Story order changes; global/Home order and Story ownership unchanged |
| OWNP03 | Change Experience order | Its list owns ordering; public Home section sequence unchanged |
| OWNP04 | Save selection/order privately | Live settings and published content remain unchanged until successful explicit update |
| OWNP05 | Unpublish/delete manually Home-selected entry | Blocked with affected-item context and path to the relevant Home selection list |
| OWNP06 | Keyboard/mobile arrange or edit | Same scope/task available; Move up/Move down present; optional metadata does not block publishing minima |
These are specified outcomes, not executed runtime, usability or visual checks.

## Research boundary
[Recognition guidance](https://www.nngroup.com/articles/recognition-and-recall/) and [contextual actions](https://www.nngroup.com/articles/contextual-menus/) inform task/content proximity. This exact placement is an owner-approved product decision, not a universally proven CMS pattern; earlier CMS data-model examples did not establish editing usability.
