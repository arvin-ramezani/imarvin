# Owner content management — approved checkpoint
Status: owner-approved P21–P22 requirements; exact controls, layout and implementation remain open.
Recorded: 2026-10-14; P21 placement approved 19:58; P22 pin rules/views/recovery approved 20:15–21:01 Asia/Tehran.
Authority: [UX checkpoint](../ux-requirements-checkpoint.md), [decisions](../decisions.md).
Companions: [public content](ux-public-checkpoint.md), [relationships/publication](project-story-spec.md), [Contact](contact-ux-checkpoint.md), [owner recovery/accessibility](owner-ux-spec.md).
This scoped record supersedes Site settings → Home content and Project-editor Story ordering proposals. It does not authorize a page builder, new code/images or automatic publication.

## Areas and control ownership — OWN01–OWN03
- OWN01: Use Projects, Stories, Experience and Site settings as private management areas. Site settings owns identity, About, offerings and Contact; selection/ordering belongs in content lists, not Site settings or individual content-editing forms.

| Area | Selection/order task |
| --- | --- |
| Projects | All Projects: create/edit, pin/unpin published items. Home selection: choose Featured Project and select/order More Projects |
| Stories | All Stories: create/edit, pin/unpin published items; optional Project filter. Home selection: select/order Home Stories |
| Experience | Order entries for Home directly in its management list; no dedicated public Experience list page |
| Site settings | Identity, About, offerings and Contact content/destinations |

- OWN02: Projects and Stories each have two private views: All items and Home selection. All-item rows show title, Private/Published state, Edit as the main action, and Pin/Unpin for published items. Edit opens a separate item editor. Home views clearly name selection/order scope; use one authoritative control per scope, not duplicate editors or unlabeled rank values.
- In Projects, Featured Project selection is distinct from More Projects membership/order; exactly one published feature is manually chosen. Home collections preserve latest/manual modes, <=4 Stories/<=3 More Projects and feature exclusion under UXH03–UXH05. Home section order stays fixed under P20.
- Project filtering in All Stories narrows the viewed subset, never ownership or pin scope. A Story has one shared pin state across Stories browse and its Project's related published Stories; the related list is on Project detail, not Story detail. PS01–PS03 and UXC06 retain optional parents/no reassignment/private-parent protection.
- Manual ordering applies only to Home items. Collection pins and Home curation are independent; automatic Home latest mode ignores pins. Public sort/filter semantics belong to UXN05. There is no separate global/per-Project manual rank or per-Project pin setting. Exact tie-breakers/pin lifecycle remain open.
- OWN03: Core editors prioritize approved text minima (UXD06–UXD07). Project progress is optional; optional release/availability context is grouped under Additional details. Preserve separate facts and truthful/public-private meanings under UXC07, without requiring every project to fill a status matrix.
- Labels are created/reused while editing Projects/Stories under UXN04; no separate mandatory taxonomy workflow or layout-by-label system.

## Publishing and protection — OWN04–OWN05
- OWN04: Pin/Home-selection/order edits remain pending until Apply changes in the changed view. Apply updates only membership/pin priority/order; it never publishes draft entries or pending Project/Story content. Item editors separately retain Save → Preview → Publish/Update under PS11–PS12. Prior public arrangement remains until confirmed success.
- Offer Apply changes and Discard changes for pending arrangement edits. Leaving that view prompts Apply, Discard or Stay. On confirmed application failure, retain pending choices/order/pins for retry and keep the prior public arrangement. Exact persistence, transaction/publication unit, unknown-outcome reconciliation and candidate-versus-live Home protection remain unresolved; no schema is chosen.
- OWN05: PS09–PS10 Home-removal protections remain: manually selected entries, including indirectly affected children, block unpublish/delete until explicitly replaced/removed from the Home selection. Explain affected items and link to the appropriate Projects/Stories Home selection list. Automatic latest sections refill normally; manual sections do not silently refill.
- Home reordering supports visible Move up/Move down controls; drag may supplement them, never replace them. Preserve clear scope, feedback and keyboard/mobile access; owner interface motion remains off under P16.

## Observable checks
| ID | Scenario | Expected |
| --- | --- | --- |
| OWNP01 | Arrange Home Projects or Stories | Controls live in the matching content area; limits/feature exclusion preserved; full collection order unchanged |
| OWNP02 | Filter Stories to a Project and pin/apply | Shared Story pin changes collection and relevant Project list; Home and ownership unchanged |
| OWNP03 | Change Experience order | Its list owns ordering; public Home section sequence unchanged |
| OWNP04 | Change pins/Home selection/order before Apply | Public arrangement and entry content unchanged; Apply updates arrangement only |
| OWNP05 | Unpublish/delete manually Home-selected entry | Blocked with affected-item context and path to the relevant Home selection list |
| OWNP06 | Keyboard/mobile arrange or edit | Home move controls and equivalent pin/edit actions available; optional metadata does not block minima |
| OWNP07 | Leave with pending arrangement edits | Apply/Discard/Stay choices; discarding leaves public arrangement unchanged |
| OWNP08 | Confirmed Apply failure | Pending work retained for retry; prior public arrangement preserved |
| OWNP09 | Private Projects/Stories management | All items/Home selection views and separate entry editors distinguish tasks |
These are specified outcomes, not executed runtime, usability or visual checks.

## Research boundary
[Recognition guidance](https://www.nngroup.com/articles/recognition-and-recall/) and [contextual actions](https://www.nngroup.com/articles/contextual-menus/) inform task/content proximity. This exact placement is an owner-approved product decision, not a universally proven CMS pattern; earlier CMS data-model examples did not establish editing usability.
