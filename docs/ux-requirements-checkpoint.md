# UX requirements checkpoint
Status: owner-approved P19/P20 requirements with explicitly marked working direction/proposals; discovery remains incomplete.
Recorded: 2026-10-14 (Asia/Tehran) | Decisions: P19/P20 | Baseline: main@97857df.
Authority: initial owner decisions through 06:35 Asia/Tehran; continued delegated content exploration; revised Home order/hero/About placement explicitly approved at 18:59; PR update requested at 19:03. The later publishing-field suggestion remains unapproved.
This records requirements, not approved screen images, a completed UX specification, implementation approval, or runtime evidence.

## Scope and precedence
- Personal Studio and Signal Studio remain selected. ImArvin focuses on Arvin; BluCode is out of scope for now.
- Freelance clients are primary; employment and curious exploration remain supported outcomes.
- Simple, fast-to-understand content and visual hierarchy take priority over adding components or features.
- [Public requirements](specs/ux-public-checkpoint.md), [Project/Story lifecycle](specs/project-story-spec.md), and [Contact](specs/contact-ux-checkpoint.md) each own their scoped facts.
- P19/P20 supersede conflicting older Project-as-Story, company-detail, Home, taxonomy, contact and lifecycle assumptions only within those scopes.
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
| Project and Story content and optional media/links | UXC01–UXC06 in public checkpoint |
| Delegated content hierarchy, public previews, About and candidate authoring | UXD01–UXD05 working direction; UXD06 unapproved Project publishing proposal in public checkpoint |
| Optional one-Project relationship, independent publication | PS01–PS05 in relationship contract |
| Explicit bulk choices, permanent deletion, Home protection | PS06–PS10 in relationship contract |
| Private edits and owner feedback | PS11–PS12 in relationship contract |
| Form, direct channels, Telegram preference, delivery | CT01–CT08 in contact checkpoint |

## Open requirements — do not infer approval
1. Routine image enlargement and standard user-controlled video playback without autoplay are usability defaults under the owner's later steering, not decisions to re-ask. Exact gallery, inspection/return, player variants and implementation remain open; no new image/player acceptance is implied.
2. Public UXD01–UXD05 record the delegated hierarchy/content direction. Exact components, authoring/required publication fields, limits and layout remain open; UXD06's Project publishing minimum is PROPOSED, not approved. Stories are not articles or mandatory Problem/Solution templates.
3. Separate progress/release/current-availability status vocabulary and its authoring presentation need definition; unlaunched does not mean private.
4. Bulk failure/retry/concurrency, deletion of owned/shared media, dependent references and storage cleanup require bounded implementation contracts. No media cascade is implied by record deletion.
5. Contact phone-only Telegram replies need a usable Telegram identifier; exact conditional field behavior, delivery/provider, privacy/retention and spam controls need specification.
6. Navigation labels, active-state behavior, mobile menu and initial Load more batch size remain to design. P20 resolves Home About placement after Experience/before offerings, with a dedicated About link; the fuller introduction is no longer inside the hero.
7. Exact screen images, Light/Dark and viewport variants require owner approval through [VSRC](specs/visual-source-workflow-spec.md).
8. Production copy, actual Projects/Stories, company facts, destinations and permitted assets remain factual publication inputs (O01–O03).
9. Existing URLs/data migration, old company Experience routes and old Story snapshots need a compatibility/migration spec; no data loss or redirects are authorized here.
10. How newly published items enter an existing manual order, filter/order scope settings and equal-date ties need definition.
11. Experience dates were not reconfirmed in this discussion; retain the PRD's factual date requirement pending reconciliation rather than removing it.
12. Home protection applies to manual selections; approved automatic latest sections refill. Behavior of private candidate Home selections versus live selections needs a publishing contract.

## Next work and verification
- Continue unresolved publishing fields, status vocabulary, Contact and lifecycle details; do not re-ask basic usability defaults or the approved Home/About placement. Keep the research-informed order as an owner-approved product choice, not a measured conversion result.
- Reconcile affected canonical specs, skill routing, fixture matrix, issue dependencies and acceptance IDs before dependent visual design/implementation.
- Include fixtures for standalone Stories, zero/one/many published Stories, private parents, UI/CLI/backend Projects, zero/one/many media and missing external links.
- Design screen by screen from agreed requirements, obtain exact-image approval, then deliver bounded implementation separately.
- Validate document links, unique IDs, latest-decision precedence and scope. Written checks are not visual/usability/runtime/security verification.
