# UX requirements checkpoint
Status: owner-approved P19–P26 requirements with explicitly marked working direction/proposals; the four audited high-level gaps are closed; detailed UX/design/spec work remains incomplete.
Recorded: 2026-10-15 (Asia/Tehran) | Decisions: P19–P26 | Baseline: main@97857df.
Authority: initial owner decisions through 06:35 Asia/Tehran; continued delegated content exploration; revised Home order/hero/About placement explicitly approved at 18:59; PR update requested at 19:03. P21 records explicit publishing-minimum, simplified-status, Telegram/no-attachment and content-list ordering approvals at 19:32–19:58; latest PR update requested at 19:58. P22 records later pin/view/Apply approvals and the 21:08 instruction to verify Story requirements, finish high-level UX first and defer components.
P23 records subsequent Home-removal, Contact result/email-only handling, Story-discovery and Privacy approvals through 2026-10-15 at 01:30 Asia/Tehran. The [high-level journey audit](ux-journey-audit.md) records covered paths, four P24-resolved decisions and later-stage work. P25 approves detail information hierarchies at 02:21–02:22; editor/components/images remain separate.
P26 records the post-#55 clickable presentation approvals in public UXH10, UXD03–UXD04/UXD08–UXD10. UXD05 authoring and exact-image approval remain open; existing Experience and Contact facts are not reopened.
This records requirements, not approved screen images, a completed UX specification, implementation approval, or runtime evidence.

## Scope and precedence
- Personal Studio and Signal Studio remain selected. ImArvin focuses on Arvin; BluCode is out of scope for now.
- Freelance clients are primary; employment and curious exploration remain supported outcomes.
- Simple, fast-to-understand content and visual hierarchy take priority over adding components or features.
- [Public requirements](specs/ux-public-checkpoint.md), [Project/Story lifecycle](specs/project-story-spec.md), [Contact](specs/contact-ux-checkpoint.md), and [owner content management](specs/owner-content-checkpoint.md) each own their scoped facts.
- P19–P26 supersede conflicting older Project-as-Story, company-detail, Home, taxonomy, contact and lifecycle assumptions only within those scopes.
- Older companion specs preserve unaffected rules and delivered-slice history; overlapping detail requires reconciliation before implementation.
- The owner-approved Home sequence replaces earlier rejection of a prescribed sequence; it does not approve a generic CV layout.
- P17 Evidence-return correction, P18 fictional TEST ONLY design fixtures, Light/Dark/System, accessibility, content truthfulness, private assets, and owner motion-free rules remain.
- No application code, schema, dependencies, images, video creation, or deployment is authorized by this checkpoint.
- Existing screenshots/QA apply to their original scope; they do not approve the revised Project/Story screens.

## Approved requirement groups
| Group | Canonical record |
| --- | --- |
| Home hierarchy, selection, offerings, Experience, About and no-feature state | UXH01–UXH10 in public checkpoint |
| Pages, navigation, filters, order, loading/return and republish pin priority | UXN01–UXN07 in public checkpoint |
| Project and Story content, optional media/links, Story simplicity and discovery constraints | UXC01–UXC06/UXC08–UXC09 in public checkpoint |
| Detail hierarchy, previews/About/authoring and publishing minima | UXD01–UXD04/UXD06–UXD10 approved by scope; UXD05 authoring unresolved in public checkpoint |
| Simple Project status presentation | UXC07 in public checkpoint |
| Private content views, shared collection pins, Home-only manual ordering, Apply/Discard/recovery | OWN01–OWN06; checks OWNP01–OWNP10 in owner content checkpoint |
| Optional one-Project relationship, independent publication | PS01–PS05 in relationship contract |
| Explicit bulk choices, permanent deletion, Home protection and confirmed bulk failure | PS06–PS10/PS13 in relationship contract |
| Private edits and owner feedback | PS11–PS12 in relationship contract |
| Form, direct channels, Telegram identity, no attachments, results/email handling and Privacy | CT01–CT12 in contact checkpoint |

## Open requirements — do not infer approval
1. Routine image enlargement and standard user-controlled video playback without autoplay are usability defaults under the owner's later steering, not decisions to re-ask. UXD09 approves vertical Project media presentation/order; exact inspection/return, player controls, rendered sizing and implementation remain open; no new image/player acceptance is implied.
2. UXD01–UXD04/UXD06–UXD10 and UXH10 are approved within scope; UXD05 authoring remains unresolved, not implicitly approved by a public layout. Story minima, flexible contexts, reusable optional labels, independent visibility/optional parent and optional media are approved. Designed hierarchy and simple creation/implementation must coexist (UXC05/UXC08); no rich-text editor, plain-paragraph downgrade or repeatable-group system is selected. Exact controls/fields/formatting/validation and rendered components remain to design after legacy reconciliation; P24 closes the identified high-level gaps.
3. UXC07/OWN03 approve one optional In progress/Completed/Cancelled label, useful factual notes/live link and optional release/availability Additional details. Exact optional release/availability vocabulary, field encoding and note composition remain open; missing facts imply no default status and unlaunched does not mean private.
4. PS13 resolves confirmed bulk operations as together-or-unchanged. Retry/unknown-outcome/concurrency, deletion of owned/shared media, dependent references and storage cleanup still require bounded implementation contracts. No media cascade is implied by record deletion.
5. CT09 resolves Telegram identity, CT10 excludes attachments, CT05/CT11 resolve email handling/acceptance feedback and CT12 resolves the privacy note/page. Exact identifier validation/hidden-field retention, durable delivery/provider/unknown outcomes, factual Privacy copy/retention and spam controls remain open.
6. Navigation labels, active-state behavior, mobile menu and initial Load more batch size remain to design. P20 resolves Home About placement after Experience/before offerings, with a dedicated About link; the fuller introduction is no longer inside the hero.
7. Exact screen images, Light/Dark and viewport variants require owner approval through [VSRC](specs/visual-source-workflow-spec.md).
8. Production copy, actual Projects/Stories, company facts, destinations and permitted assets remain factual publication inputs (O01–O03).
9. Existing URLs/data migration, old company Experience routes and old Story snapshots need a compatibility/migration spec; no data loss or redirects are authorized here.
10. P22 supersedes full-collection/per-Project manual ordering: Home-only manual order; shared entry pins, last pinned first then first-publication latest, filter before sorting. UXN07 retains pin priority through unpublish/republish; exact ties, staged priority/persistence, Apply publication units and unknown-outcome/concurrency handling remain open.
11. Experience dates were not reconfirmed in this discussion; retain the PRD's factual date requirement pending reconciliation rather than removing it.
12. PS09 now requires successful Apply of manual Home replacement/removal before unpublish/delete; pending edits do not unlock it. Automatic latest sections refill. Race/transaction enforcement still needs an implementation contract.
13. [Journey audit](ux-journey-audit.md) JG01–JG04 are resolved by P24 in UXH09/PS13/UXN07/OWN06. Label editing/publication controls and exact filter/reference repair remain later spec work; no implementation/image approval follows from closure.

## Next work and verification
- The four audited high-level gaps are closed under P24; approved P25 detail hierarchy is recorded. Reconcile legacy companions and verify current journey consistency, then design components/editor fields/layouts; defer implementation validation/limits/schema to bounded specs. Do not re-ask documented/approved decisions, including Contact/Experience and P26 presentation; ask only for a genuine unresolved choice or conflict. Research supports clarity/curation, not a proven section/editor pattern or measured conversion result.
- Reconcile affected canonical specs, skill routing, fixture matrix, issue dependencies and acceptance IDs before dependent visual design/implementation.
- Include fixtures for standalone Stories, zero/one/many published Stories, private parents, UI/CLI/backend Projects, zero/one/many media and missing external links.
- Design screen by screen from agreed requirements, obtain exact-image approval, then deliver bounded implementation separately.
- Validate document links, unique IDs, latest-decision precedence and scope. Written checks are not visual/usability/runtime/security verification.
