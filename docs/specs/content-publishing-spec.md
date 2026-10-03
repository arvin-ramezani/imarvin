# Content and Publishing Specification

Status: owner-approved lifecycle behavior contract (P02/P10) | Updated: 2026-10-03.
Saving is private; publishing/updating is explicit. Removal/reference/concurrency behavior below is approved; implementation mechanisms remain O05 architecture.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md). Companion: [owner UX](owner-ux-spec.md). Trace: R06–R09, R12–R19, R22; A03–A08, A10.

## 1. Content model, not database schema

| Unit | Owns | Relationships |
| --- | --- | --- |
| Story | Summary, tasks, project progress, decisions/evidence, outcome/lesson, stack, availability/links | Optional experience; optional authored related stories |
| Experience | Company identity/logo, role/dates/contribution, multiple/main-product mode | Stories reference it; main-product selection identifies one associated story |
| Studio settings | Identity, personal context, contact, featured selection, curated order | References published stories by stable identity |

Decisions/evidence are children of a story and publish with it. A company has contextual experience records; do not duplicate story bodies under companies. Stable public identity survives title edits and is not reused after deletion.
Each unit has a saved private working copy and, optionally, a published snapshot. Unsaved input belongs to an editing session. Assets referenced by draft-only content are private; an asset used by public content cannot be overwritten by a draft upload.

## 2. Orthogonal states

| Dimension | States | Meaning |
| --- | --- | --- |
| Working copy | None, saved privately, unsaved session edits | What the owner is editing |
| Public version | Absent, published | What visitors can receive |
| Relationship to public | Matches public, private changes | Whether saved work differs from publication |
| Project progress | Ongoing, completed, cancelled | Factual work status; independent of publication |
| Availability | Usable public destination or no live destination | Separate from progress and optional evidence |

First publication may use an incomplete historical/cancelled story only if its required truthful summary is complete. Live URLs, media, metrics, and decision sections are not mandatory.

## 3. Lifecycle contracts

| Operation | Preconditions | Result | Failure behavior |
| --- | --- | --- | --- |
| Save draft | Authorized owner; input passes draft-format validation; saved revision current | Working copy changes only | Retain input and saved/public versions; explain error/conflict |
| Preview | Exact saved candidate; authorized owner | Private presentation with public dependencies and owner-only missing-reference warnings | No public change; return to editing |
| Publish | No public version; saved candidate reviewed; publication checks pass | Candidate becomes public snapshot | Candidate retained; no partial public version |
| Update published content | Public version exists; reviewed saved candidate and public revision current | Replace public snapshot explicitly | Old public version and draft remain intact |
| Unpublish | Published; current impact reviewed and confirmed | Public version removed; saved working copy retained | Public remains available if operation fails |
| Republish | Unpublished item; current saved candidate passes checks | New public snapshot at same identity | Stays unpublished on failure |
| Delete | Unpublished; no saved/public incoming references; impact confirmed | Remove working copy and exclusive assets; identity stays reserved | Keep item on failure; no cascade deletion |

Publication is atomic per unit, including its child decisions/evidence. It never publishes another unit's private edits. No site-wide transaction, bulk publish, scheduled release, or historical restore UI.
Save failure cannot be described as Saved. Publication failure cannot be described as Updated. Unknown operation outcome requires checking current versions before retry; duplicate confirmation must not create duplicate items or releases.
A confirmed rejection/failure means no release committed. A timeout or uncertain delivery is Outcome unknown: inspect current candidate/public revisions before deciding success, failure, or retry. Do not promise rollback or old-public preservation for an outcome that has not been determined.
Confirmed publication must be visible on a fresh public request; stale delivery/cache invalidation is an architecture acceptance concern, not an excuse to report success while showing older content.

## 4. Publication checks

- Story: title/problem/contribution/progress present and confirmed; sections contain meaningful content or are omitted. Outcomes may be qualitative; no invented responsibility or metrics.
- Experience: confirmed company/role/date/contribution context; a main-product selection, when supplied, belongs to that experience and is published. A context-only experience is valid; missing logo is allowed.
- Settings: real identity/personal context, at least one approved contact destination, feature/order reference eligible published stories; no placeholder address.
- References: candidate association/related/main-product/feature targets are currently published, valid, and accessible. Offer Publish target first, detach/change reference, or Keep draft; never automatically publish dependencies.
- Evidence: permitted disclosure confirmed, public-facing captions/alternatives supplied where required, asset processing successful, external destinations validated. Text-only evidence is valid.
- Format: safe content/link handling, valid fields, no invalid relationship cycles affecting navigation. Specific validation/security mechanisms belong to architecture.

Draft validation may permit missing required publication facts but must reject malformed data. Publication errors name the field/reference and next action. Recheck against current revisions immediately before committing.
Bootstrap a new main-product experience without a circular dependency: publish its confirmed context with no main story selected → publish the associated story → explicitly update the experience to select that story. The intermediate public experience uses the honest no-project state; never auto-publish either dependency. Feature/order/related links can be selected after the story is published.

## 5. Removal and relationships

Before unpublishing, show affected homepage feature/order, company main-product/choices, related-story links, and incoming public destinations. Do not silently republish their owning units.

| Removed public unit | Public projection after success | Private treatment |
| --- | --- | --- |
| Story | Omit from choices/order/related links; feature uses curated fallback; company shows remaining choices or honest no-project state | Preserve working copy and references for repair/republish |
| Experience | Hide its company-context lookup/link; independently published stories remain available | Preserve associations; warn before later publishing linked candidates |
| Studio settings | V1 must retain identity and at least one contact path | Unpublish settings is unavailable; update them explicitly |
| Evidence child | Removed only by explicitly publishing its story's edited candidate | Old public asset remains available until that successful update |

Public views resolve only currently published relationship targets; retained stale references never disclose unpublished names/assets or create dead selection controls. Main-product mode does not silently switch to multi-project mode; missing main product shows an honest empty explanation.
Unpublishing an experience does not scrub employer names manually written in other published story text. Show that limitation in the impact review; edit those stories explicitly if removal is intended.
Delete never erases related stories. Incoming saved or published references must first be detached/updated. Show each reference with an editing destination; only currently unpublished, unreferenced units can be deleted.
Assets stay available while any public snapshot references them. Draft-only assets remain private; remove unused assets after confirming no draft/public reference. Retention/backup details remain O05, not a promised recoverability feature.
Existing public deep links to removed units receive the neutral unavailable response in [navigation/state](navigation-state-spec.md); nonexistence, removal, and private state are not distinguished publicly.

## 6. Concurrency and privacy

Save and publication check both candidate revision and relevant public/dependency revisions. A conflict retains local input/working copy and requests review; no silent last-write-wins. Changed destructive-action impact requires renewed confirmation.
Public HTML/data/metadata/indexes/filter counts/assets contain published material only. Private preview is authorized and excluded from public sharing/indexing; an obscured URL or noindex alone is not access control.
Authentication, sanitization, asset delivery, cache removal, backups, retry identity, and atomicity mechanisms require the later architecture spec. These contracts do not prove security or production readiness.

## 7. Review scenarios

| ID | Scenario | Expected result |
| --- | --- | --- |
| CP01 | Save unpublished/public item | Only private working copy changes |
| CP02 | Upload replacement evidence → Save | Old public asset unchanged; new draft asset private |
| CP03 | Publish story referencing unpublished experience | Blocked with target-first/detach paths; no dependency auto-publish |
| CP04 | Confirm update; write/delivery fails | No partial release or false success; determine current state before retry |
| CP05 | Unpublish featured or main-product story | References filtered, valid fallback/empty state, draft retained |
| CP06 | Unpublish experience with public stories | Context lookup hidden; stories remain; authored text limitation explained |
| CP07 | Delete unit with draft/public incoming references | Blocked; no cascade or deletion of still-used asset |
| CP08 | Concurrent draft/dependency/public change | Stale operation blocked; candidate/input retained |
| CP09 | Anonymous access to draft/preview/asset | No draft content or owner operation; public metadata also clean |
| CP10 | Unpublish → edit → republish | Same identity; explicit new public candidate; no unsolicited dependent publication |
| CP11 | Publish a new main-product experience and story | Context-first sequence works without circular prerequisites or automatic publication |

P10 is owner-approved. Implementation checks must verify failures/concurrency/privacy, not just happy-path screen labels.
