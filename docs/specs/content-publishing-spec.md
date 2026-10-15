# Content and Publishing Specification

Status: reconciled P19–P25 lifecycle; P02/P10 private/published guarantees remain, PS13 bulk outcomes approved; W43 evidence historical. Updated: 2026-10-15.
Authority: [PS01–PS13](project-story-spec.md), [UXD06–UXD07](ux-public-checkpoint.md), [OWN01–OWN06](owner-content-checkpoint.md), [Contact](contact-ux-checkpoint.md).
Saving is private; publishing/updating is explicit. Removal/reference/concurrency behavior below is approved; T01–T07 provide architecture/runtime defaults and feature specs define exact mechanisms. [W43](../implementation/43-work-p15-p16-media-motion-retrofit.md) governs bounded Work media snapshots and Problem figures, not full-product Decisions content or visual signoff.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md). Companion: [owner UX](owner-ux-spec.md). Trace: R06–R09, R12–R19, R22; A03–A08, A10.

## 1. Content model, not database schema

| Unit | Owns | Relationships |
| --- | --- | --- |
| Project | Name/overview/contribution; optional factual status/company/tech, links and independent cover/showcase | Zero/many Stories; independent Private/Published visibility |
| Story | Title/introduction/explanation; optional Story media, labels | Zero/one Project selected **at creation**; public even with private parent |
| Home/collection arrangement | Published Featured Project, optional Home Stories/More Projects and their manual Home order; shared pins for browse | Managed in Projects/Stories lists, not settings or entry editor |
| Experience / Site settings | Home company credibility/order; identity/About/offerings/Contact | No current dedicated public company-detail page |

Each entry keeps privately saved candidate and optional published snapshot; session input may be unsaved. Stable identity survives titles/republishing and is not reused after permanent deletion. **Historical W43:** earlier Story/Evidence snapshot and main-product Experience bootstrap remain records of their original delivery, not a P19 data model or UI mandate.

## 2. Orthogonal states

| Dimension | States / meaning |
| --- | --- |
| Working copy/public copy | Unsaved vs privately Saved; separate absent/published public snapshot; private candidate changes |
| Project progress | **Optional** In progress, Completed, Cancelled; never inferred from publication |
| Release history / availability | Separate optional truthful notes/live destinations; Completed never implies Shipped or Online |
| Captured evidence stage | Confirmed Design/Prototype/Local build/Production/Recreated demo; never inferred from a video |
| Pin/manual Home | Shared persisted pin priority across browse/related Stories; Home-only manual membership/order independent of content updates |

Cancelled/unfinished/never-released Projects may publish without media/live links; unknown facts are omitted and no mandatory status matrix is created.

## 3. Lifecycle contracts

| Operation | Result | Failure/unknown outcome |
| --- | --- | --- |
| Save candidate / Preview | Private saved copy only; exact owner-authorized preview | Retain input/public, no false Save/Preview |
| Publish / Update | Explicit reviewed candidate becomes public, old public kept until successful Update | Confirmed failure leaves public unchanged; unknown outcome checked before retry |
| Project bulk publish | Project-only or Project + **selected private** Stories; others remain unchanged | PS13 confirmed chosen scope together-or-unchanged |
| Project unpublish | Keep Stories published or Unpublish all linked Stories | PS13 together-or-unchanged; private candidates retained |
| Project Delete | Keep Stories (detach, preserve states) or Delete all related Stories permanently | Confirmed chosen scope together-or-unchanged; no Trash/automatic file cascade |
| Story unpublish/Delete | Story only; parent Project remains | Block if still applied-manual-Home-selected; no silent dependency deletion |
| Pin/Home selection/order Apply | Arrangement changes only, not entry content publication | Pending choices retained after failure; previous public arrangement stays |

Separate candidate Publish/Update from **Apply changes/Discard changes** for arrangement (OWN04). No automatic dependency publication, pending draft update or feature replacement. Unknown timeout/delivery/atomic outcomes must be investigated before retry; exact transaction/locking/cache mechanisms belong to implementation specs. Confirmed Publish/Update must be visible on a fresh public request; stale public content cannot accompany a success claim. Cache/delivery details remain bounded implementation work. Prior “no bulk publish” and single-Story-only lifecycle limits are superseded for P19; retain historical P10/W43 evidence in its bounded context.

## 4. Publication checks

- **Project** publication minimum (UXD06): name, overview of what it does/who it serves, and Arvin's individual contribution. No mandatory company, role title, technologies, media, links, status or live URL.
- **Story** publication minimum (UXD07): title, short introduction and explanation. No mandatory problem, decisions, section groups, outcome, metrics, parent, labels or media. Incomplete private drafts are allowed.
- **Relationship:** Story may publish beneath a private Project but must omit private parent name/link/derived metadata; Project may publish without Stories. Bulk action validates **chosen** private Stories and gives actionable missing-field errors.
- **Home:** selected manual items must be published; when no Featured Project configured, Home retains identity/available sections with **no auto fallback**. Applied Home picks block impacted unpublish/delete until successfully removed via arrangement Apply.
- **Media/links:** truthful stage/disclosure/accessibility for optional selected assets; failed selected upload needs explicit repair/removal, never silent exposure. Missing media/link remains a complete public text composition.
- **Contact/Experience:** real company/contact destinations and nonmisleading facts; approved CT05/CT11/CT12 acceptance/email inbox/Privacy handling, not a dashboard messages module.
- **Site settings:** retain identity and at least one approved contact path; settings cannot be unpublished, only explicitly updated. Home selection/order remains in content lists.

Candidate/relevant revision checks must precede commit; failed/unknown results keep saved candidate/input. Do not introduce editor widgets, schema or endpoint constraints here.

## 5. Removal and relationships

Explain current applied Home selections, linked private/published Stories, affected public links and counts before unpublish/Delete. A manually featured Project, Home Story or More Projects choice **cannot** be removed until Home selection replacement/removal has **successfully Applied** (PS09); pending or failed Apply does not unlock. Automatic latest sections refill; manual selections never silently refill.
Unpublish Project with **Keep Stories published** hides Project but leaves published Stories accessible without private parent metadata. Unpublish all hides all children. Delete with **Keep Stories** detaches all children as standalone with original content/visibility; **Delete all** permanently deletes them. One confirmed operation succeeds together or leaves affected entries unchanged (PS13). Do not silently cascade storage assets or delete shared media; ownership/refs/cleanup remain technical contracts.
A Project detail includes published Stories only and omits its Story area when none; Story detail never shows nonpublic parent identity. Pin/label projections publish only eligible entries; unpublish/republish restores old pinned priority unless explicitly repinned (UXN07). Former company main-product removal/fallback and P10 one-unit evidence behavior are historical and must not reappear as active P19 UI.
Public assets remain only while referenced by authorized published snapshots; drafts stay private, replacements immutable, and stale public caches/incoming references need safe reconciliation. Settings cannot be unpublished. Removed/private/nonexistent public links use indistinguishable neutral unavailable responses. No backup restore product is implied.

## 6. Concurrency and privacy

Save and publication check both candidate revision and relevant public/dependency revisions. A conflict retains local input/working copy and requests review; no silent last-write-wins. Changed destructive-action impact requires renewed confirmation.
Public HTML/data/metadata/indexes/filter counts/assets contain published material only. Private preview is authorized and excluded from public sharing/indexing; an obscured URL or noindex alone is not access control.
T01–T07 define auth, storage, deployment, backup, and logging defaults. Publishing feature specs must still define transaction/revision/cache details and verify them in implementation; these contracts alone do not prove security or production readiness.

## 7. Review scenarios

| ID | Scenario | Expected result |
| --- | --- | --- |
| CP01 | Save public Project/Story candidate | Private only, old public intact |
| CP02 | Replace optional candidate media | Draft private, old public media intact |
| CP03 | Publish Story with private parent | Story public with no private parent metadata |
| CP04 | Confirm Publish/Update or handle failure/unknown | Success visible on fresh public request, never stale; confirmed failure unchanged, unknown outcome reconciled |
| CP05 | Unpublish manually Home-selected entry | Block until applied selection removal; no auto replacement |
| CP06 | Project Unpublish Keep/Unpublish all children | Explicit correct child states; atomic confirmed scope |
| CP07 | Project Delete Keep Stories/Delete all | Detach/preserve or delete chosen children; no file cascade assumption |
| CP08 | Stale concurrent candidate/dependency/public state | Retain input, reject stale operation |
| CP09 | Anonymous draft/preview/asset access | Denied; published-only metadata/counts |
| CP10 | Unpublish, edit, republish pinned entry | Same identity/date and saved pin priority |
| CP11 | Project-only versus selected private Stories bulk Publish | Only selected scope changes; existing public child candidates unchanged |
| CP12 | Replace/remove selected media then Update | Private assets protected; public projections switch only on success |

Settings checks must verify retained identity/contact path and absence of settings-unpublish action. These are requirements, not executed tests. P10 private/public guarantees remain approved where compatible; P19–P25 override old Work lifecycle assumptions. These updated CP scenarios are **unrun**; previous W43 evidence applies only to that delivered slice. Detailed transactions, media cleanup, race/retry rules, migrations and tests await bounded technical specs.
