# UX requirements checkpoint
Status: owner-approved P19–P22 requirements with explicitly marked working direction/proposals; discovery remains incomplete.
Recorded: 2026-10-14 (Asia/Tehran) | Decisions: P19–P22 | Baseline: main@97857df.
Authority: initial owner decisions through 06:35 Asia/Tehran; continued delegated content exploration; revised Home order/hero/About placement explicitly approved at 18:59; PR update requested at 19:03. P21 records explicit publishing-minimum, simplified-status, Telegram/no-attachment and content-list ordering approvals at 19:32–19:58; latest PR update requested at 19:58. P22 records later pin/view/Apply approvals and the 21:08 instruction to verify Story requirements, finish high-level UX first and defer components.
This records requirements, not approved screen images, a completed UX specification, implementation approval, or runtime evidence.

## Scope and precedence
- Personal Studio and Signal Studio remain selected. ImArvin focuses on Arvin; BluCode is out of scope for now.
- Freelance clients are primary; employment and curious exploration remain supported outcomes.
- Simple, fast-to-understand content and visual hierarchy take priority over adding components or features.
- [Public requirements](specs/ux-public-checkpoint.md), [Project/Story lifecycle](specs/project-story-spec.md), [Contact](specs/contact-ux-checkpoint.md), and [owner content management](specs/owner-content-checkpoint.md) each own their scoped facts.
- P19–P22 supersede conflicting older Project-as-Story, company-detail, Home, taxonomy, contact and lifecycle assumptions only within those scopes.
- Older companion specs preserve unaffected rules and delivered-slice history; overlapping detail requires reconciliation before implementation.
- The owner-approved Home sequence replaces earlier rejection of a prescribed sequence; it does not approve a generic CV layout.
- P17 Evidence-return correction, P18 fictional TEST ONLY design fixtures, Light/Dark/System, accessibility, content truthfulness, private assets, and owner motion-free rules remain.
- No application code, schema, dependencies, images, video creation, or deployment is authorized by this checkpoint.
- Existing screenshots/QA apply to their original scope; they do not approve the revised Project/Story screens.

## Approved requirement groups
| Group | Canonical record |
| --- | --- |
| Home hierarchy, selection, offerings, Experience, About | UXH01–UXH08 in public checkpoint |
| Pages, navigation, filters, order, loading and return | UXN01–UXN06 in public checkpoint |
| Project and Story content, optional media/links and Story simplicity/design constraints | UXC01–UXC06/UXC08 in public checkpoint |
| Delegated content hierarchy, public previews, About and candidate authoring | UXD01–UXD05 working direction; approved Project/Story minima UXD06–UXD07 in public checkpoint |
| Simple Project status presentation | UXC07 in public checkpoint |
| Private content views, shared collection pins, Home-only manual ordering, Apply/Discard/recovery | OWN01–OWN05; checks OWNP01–OWNP09 in owner content checkpoint |
| Optional one-Project relationship, independent publication | PS01–PS05 in relationship contract |
| Explicit bulk choices, permanent deletion, Home protection | PS06–PS10 in relationship contract |
| Private edits and owner feedback | PS11–PS12 in relationship contract |
| Form, direct channels, Telegram identity, no attachments, delivery | CT01–CT10 in contact checkpoint |

## Open requirements — do not infer approval
1. Routine image enlargement and standard user-controlled video playback without autoplay are usability defaults under the owner's later steering, not decisions to re-ask. Exact gallery, inspection/return, player variants and implementation remain open; no new image/player acceptance is implied.
2. UXD01–UXD05 remain working direction, not component/editor approval. Story minima, flexible contexts, reusable optional labels, independent visibility/optional parent and optional media are approved. Designed hierarchy and simple creation/implementation must coexist (UXC05/UXC08); no rich-text editor, plain-paragraph downgrade or repeatable-group system is selected. Exact controls/fields/formatting/validation and rendered components are deferred until high-level UX is grilled.
3. UXC07/OWN03 approve one optional In progress/Completed/Cancelled label, useful factual notes/live link and optional release/availability Additional details. Exact optional release/availability vocabulary, field encoding and note composition remain open; missing facts imply no default status and unlaunched does not mean private.
4. Bulk failure/retry/concurrency, deletion of owned/shared media, dependent references and storage cleanup require bounded implementation contracts. No media cascade is implied by record deletion.
5. CT09 resolves conditional Telegram username/profile-link requirement; CT10 excludes attachments. Exact identifier validation/hidden-field retention, delivery/provider, privacy/retention and spam controls remain open.
6. Navigation labels, active-state behavior, mobile menu and initial Load more batch size remain to design. P20 resolves Home About placement after Experience/before offerings, with a dedicated About link; the fuller introduction is no longer inside the hero.
7. Exact screen images, Light/Dark and viewport variants require owner approval through [VSRC](specs/visual-source-workflow-spec.md).
8. Production copy, actual Projects/Stories, company facts, destinations and permitted assets remain factual publication inputs (O01–O03).
9. Existing URLs/data migration, old company Experience routes and old Story snapshots need a compatibility/migration spec; no data loss or redirects are authorized here.
10. P22 supersedes full-collection/per-Project manual ordering: Home-only manual order; shared entry pins, last pinned first then first-publication latest, filter before sorting. Exact ties, pin lifecycle, staged priority/persistence, Apply publication units and unknown-outcome/concurrency handling remain open.
11. Experience dates were not reconfirmed in this discussion; retain the PRD's factual date requirement pending reconciliation rather than removing it.
12. Home protection applies to manual selections; approved automatic latest sections refill. Behavior of private candidate Home selections versus live selections needs a publishing contract.

## Next work and verification
- Complete high-level visitor/owner journeys, content scope, navigation, visibility, curation and Contact/lifecycle boundaries first. Then reconcile legacy companions and design components/editor fields/layouts; defer implementation validation/limits/schema to bounded specs. Do not re-ask routine usability defaults or approved Home/About decisions. Research supports clarity/curation, not a proven section/editor pattern or measured conversion result.
- Reconcile affected canonical specs, skill routing, fixture matrix, issue dependencies and acceptance IDs before dependent visual design/implementation.
- Include fixtures for standalone Stories, zero/one/many published Stories, private parents, UI/CLI/backend Projects, zero/one/many media and missing external links.
- Design screen by screen from agreed requirements, obtain exact-image approval, then deliver bounded implementation separately.
- Validate document links, unique IDs, latest-decision precedence and scope. Written checks are not visual/usability/runtime/security verification.
