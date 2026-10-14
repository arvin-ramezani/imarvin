# Public UX — approved checkpoint
Status: owner-approved P19–P22 requirements; UXD01–UXD05 record delegated working direction, UXD06–UXD07 are approved publishing minima. Exact rendered composition and runtime behavior remain unverified.
Recorded: 2026-10-14; Home revision approved 18:59 Asia/Tehran | Authority: [P19–P22 checkpoint](../ux-requirements-checkpoint.md).
Companions: [Project/Story](project-story-spec.md), [Contact](contact-ux-checkpoint.md).
Scope: records the agreed product experience; does not authorize code or approve rendered design.

## Home — UXH01–UXH08
- UXH01: Home summarizes the personal app; dedicated pages provide depth. Keep work visually primary and Stories secondary.
- UXH02: Approved content sequence:

| Order | Content | Boundary |
| --- | --- | --- |
| 1 | Identity + Featured Project | One combined hero; concise identity, one manually selected published Project with strongest emphasis |
| 2 | Stories | Up to 4 published previews, not Instagram-style Stories |
| 3 | More Projects | Up to 3 published Project previews |
| 4 | Experience | Compact professional credibility |
| 5 | About introduction | Brief personality, interests and direction; More about me opens About |
| 6 | How I can help | Up to 3 concise offerings |
| 7 | Contact invitation | Direct channels and link to dedicated Contact page |

- P20 replaces the separate Introduction/Featured Project sections and the earlier proposal to keep the fuller About introduction inside the hero. The hero shows Arvin's name, full-stack identity and one concise purpose sentence alongside the Project overview/contribution and optional media. Explore Project is primary; Contact stays available secondarily.
- Composition intent: open/asymmetric, identity anchors the space and the Project is the focal point. No-media emphasis comes from typography/contribution. On mobile, concise identity precedes the Project closely. This is an approved direction, not an exact-image or fixed-height/layout approval.
- Rationale, not a measured conversion result: concrete work → judgment → breadth → credibility → personality → collaboration → contact. [Homepage guidance](https://www.nngroup.com/articles/homepage-design-principles/) supports clear purpose/examples; [2026 UX guidance](https://www.nngroup.com/articles/state-of-ux-2026/) supports human judgment/curation. Neither proves this exact section order.
- UXH03: Story and More Projects sections use newest first by first publication date by default; allow manual selection and ordering.
- UXH04: Exclude the featured Project from More Projects. Show fewer than the limit when fewer eligible items exist; never fabricate filler.
- UXH05: Provide View all Stories and View all Projects links. Home is not the complete collection.
- UXH06: Experience shows company logo/name, role, concise contributions and responsibilities; optional links to relevant Projects. Company identity can link to its real website. No separate company or Experience page is required by this model.
- UXH07: Offerings are Frontend development, Backend development, Full-stack development. No separate Services page, price table or required client service selection. Enquiry actions lead to Contact without preselecting a service.
- UXH08: About provides introduction, interests and learning; do not repeat the full Home Experience section. Home's compact About introduction sits after Experience and before How I can help; its More about me link opens About. Essential identity remains in the combined hero.

## Destinations and browsing — UXN01–UXN06
- UXN01: Dedicated Projects and Stories browse pages; each Project and Story has its own detail page. About and Contact also have dedicated pages.
- UXN02: On Home, header section links scroll to their corresponding sections; About targets the separate About introduction, not the hero. Explicit View all / More about me / Contact page links open the dedicated destinations.
- UXN03: On every dedicated/detail page, header Projects/Stories/About/Contact links open those pages directly, never their Home previews. Arvin's name/logo returns to Home; Home top is the return target.
- UXN04: Projects and Stories accept optional, reusable, owner-created labels and multiple labels per entry. One simple label system, not separate mandatory Topic and Type systems. Visitors filter by one label at a time; default All Projects / All Stories.
- Label examples: Development, Design, Problem-solving, Decision, Lesson, Experiment. Labels describe context; they do not determine templates.
- Public filters show only labels attached to published entries in the relevant collection. The owner editor suggests existing labels to avoid duplicates.
- UXN05: Manual ordering is Home-only. Projects/Stories browse pages and a Project's published related Stories show pinned items first, most recently pinned first, then unpinned items newest first by first-publication date. Unpin then repin moves an item to the top after Apply changes. Editing/republishing/pinning never resets first-publication date. One pin state per entry: a Story's pin applies on Stories browse and its Project's related list; a Project's pin applies on Projects browse. Home selection/order and automatic latest mode do not inherit pins.
- Apply the selected label filter before sorting; only matching published pinned/unpinned entries appear. Pin state is shared across filters. Exact ties, pin persistence through unpublish/republish and publication mechanics remain open.
- UXN06: Use Load more, preserving filter/order. Returning from detail restores filter, loaded entries and scroll position. Exact batches/tie-breakers remain open.

## Content and media — UXC01–UXC08
- UXC01: Project detail is a concise visual overview: title/short description, compact role/status/company/link facts, optional showcase and related Stories. It is not media-only, a long article or a forced Problem/Solution case study.
- UXC02: Project media showcases appearance and actual behavior. Support UI-heavy web apps, complex components/animations, CLI tools and backend apps through the same simple structure.
- Media may be absent, one item, or several images/videos. No-media and single-media layouts must be complete, with no forced gallery, empty media panel or placeholder. Terminal captures/recordings are optional; no dedicated terminal/code component is required now. Detailed code examples, when needed, belong in Stories.
- UXC03: Each Project owns its own optional cover and showcase independently of its Stories. Each Story may have its own optional media/evidence; support zero/one/many items and complete text-only Stories. Sharing/reuse mechanics are unresolved; no automatic borrowing of private Story media.
- UXC04: Unlaunched, unfinished, cancelled, offline and never-shipped Projects remain eligible to publish and feature. Show truthful status; a recording does not imply launch. Live URLs, source code and documentation links are all optional, including when disclosure is prohibited.
- Live Project link has highest external-action priority when available. Company logo/name and real-company website are secondary context. Omit absent/unusable links, never show dead Visit site controls.
- UXC05: Stories are concise designed explanations, not blog articles. Permit problem/solution, decision, lesson or experiment context without mandatory identical sections. Visual hierarchy must make context and value easy to understand and content creation easy for Arvin.
- Deeper problems, solutions and decisions belong in Stories; do not force those sections into the Project overview. UXD02 records the working content hierarchy; publishing minima are approved under UXD07; authoring controls and rendered components remain deferred.
- UXC06: Public Project pages list only their published Stories; hide the section completely when none exist. A public Story links to its Project only while that Project is public; standalone or private-parent Stories remain complete.

- UXC07: Keep Project progress, release history, current availability and ImArvin publication distinct, with simple public presentation. Show one optional progress label: In progress / Completed / Cancelled; a usable live link when supplied; a short factual note such as Not released or No longer available only when useful. Purpose → contribution → showcase lead; status is secondary. No permanent three-badge status row, automatic launch inference, required live/source URL or required release/availability field. Optional owner release/availability context belongs under Additional details (OWN03); no label is inferred from missing data.

- Research rationale: [web-writing guidance](https://www.nngroup.com/articles/genai-write-for-the-web/) supports concise, scannable main-point-first communication; [2026 UX guidance](https://www.nngroup.com/articles/state-of-ux-2026/) supports contextual judgment and curation. Applying these to Stories is product interpretation, not evidence for a specific editor/field/group pattern or user-tested layout.
- UXC08: Story value must be easy to scan and understand through designed hierarchy, with concise content and easy creation for Arvin's marketing goals. Keep implementation simple without reducing the public experience to an undifferentiated paragraph. This is a presentation/outcome constraint, not approval of a rich-text editor, repeatable groups, block builder, heading controls or a particular plain-text editor. Requirements and constraints come first; component/data-field/editor design follows high-level UX completion.

## Working direction and approved publishing minima — UXD01–UXD07
The owner delegated UX choices and requested their record at 19:03 Asia/Tehran. UXD01–UXD05 remain working content direction; UXD06–UXD07 were explicitly approved later under P21. Exact schema, controls/limits, component-library and image approval remain separate.
- UXD01: Project detail hierarchy: name/concise purpose and audience → short, prominent individual contribution → compact relevant status, optional company/technologies/links → optional showcase → published related Stories. UI-heavy work may emphasize media; CLI/backend work may emphasize text within the same structure. Keep deeper reasoning in Stories; missing optional parts leave no empty placeholders.
- UXD02: Working presentation intent: make the Story's main point, Arvin's action/reasoning/learning and relevant context easy to understand through clear hierarchy; distinguish individual/team contribution truthfully. Labels and optional public Project context stay secondary; optional media/examples support the explanation. Problem/solution, decision, lesson and experiment content remains flexible. Results, metrics, media and public links are optional; outcomes must be supported. Stories without media remain complete. A specific grouping, section sequence, heading system or editor has NOT been selected; defer these to component design under UXC08.
- UXD03: Public previews are short introductions, distinct from owner-only private Preview. Featured Project shows name/overview/contribution, optional prominent media and Explore Project; other Projects show name/overview, optional thumbnail and secondary relevant labels/status; Stories show title/main point, secondary labels, optional supporting image and public Project name only when applicable. Selecting a preview opens detail; public external Project actions belong on detail. Reuse information hierarchy across Home/browse, without forcing identical cards or fabricated media.
- UXD04: Dedicated About hierarchy: concise identity/professional direction → approach to building/collaborating grounded in actual experience → genuine interests/current learning → relevant work and Contact links. Portrait is optional; no duplicate full Home Experience list or invented personal facts.
- UXD05: Story authoring remains unresolved at component level. UXD07 defines required content, not editor fields/widgets or storage shape. Optional media/labels and optional Project at creation follow UXC03/UXN04/PS01–PS05; labels do not choose a layout. Heading/group controls, rich-text/plain-text editing, code-example controls, formatting and limits are not approved. The recent rich-editor, plain-paragraph and repeatable-group proposals are withdrawn from current requirements; no database schema is selected.
- UXD06 — APPROVED 19:32 Asia/Tehran: publishing a Project requires name, overview (what it does/who it serves) and individual contribution (what Arvin built/was responsible for). A solo contribution can describe the work; no formal job title is required. Company, technologies, media, links and status details remain optional. Private drafts may be incomplete; exact validation/limits belong to a bounded implementation spec.
- UXD07 — APPROVED 19:34 Asia/Tehran: publishing a Story requires title, short introduction and explanation. Headings, media, labels and Project relationship remain optional; drafts may be incomplete. These content requirements do not force Problem/Solution/Results sections, a blog/article format, successful outcome, metrics, live/source URLs or media. UXD02/UXC03/UXC05 and PS01–PS05 retain flexibility and independent visibility.
Conceptual coverage used explicitly fictional UI-decision, CLI/backend-decision and standalone-lesson examples; this is not user testing, real Arvin content, visual approval or runtime evidence.

## Observable checks
| ID | Scenario | Expected |
| --- | --- | --- |
| UXP01 | Home populated | Exact sequence; 1 feature, <=4 Stories, <=3 other Projects; no duplicate feature |
| UXP02 | Contact page → header About | Opens About directly; logo returns to Home |
| UXP03 | Browse/filter/load/open/return | Filter, loaded items, order and reading position preserved |
| UXP04 | CLI/backend without media or links | Complete concise overview; no blank showcase/dead actions |
| UXP05 | UI Project with one/multiple captures | Composition supports actual content, no fabricated filler |
| UXP06 | Public Project with private-only Stories | No public child titles, counts or empty Stories section |
| UXP07 | Standalone text-only Story | Discoverable on Stories page; labels optional; no parent/media required |
| UXP08 | Combined hero/Home About navigation | Identity and one featured Project share the opening; later About introduction is the Home anchor; More about me opens About |
| UXP09 | Publish Project/Story with minimum text and no optional metadata/media | UXD06/UXD07 satisfied; optional absence adds no requirement; incomplete private Save stays available |
| UXP10 | Completed never-released Project without live link | Optional Completed label plus useful factual Not released note; no Online/Shipped inference or dead Visit action |
| UXP11 | Label filter with matching/nonmatching pins | Matching pins by last pin first, then matching unpinned by first publication; nonmatches absent |
| UXP12 | Pin Story once and apply | Stories browse and its published Project's related list share priority; Home unchanged |
| UXP13 | Story requirement/design handoff | Flexible concise designed explanation; no mandatory article sections or premature editor/group schema |
These are requirements checks, not executed browser or visual acceptance. UXD01–UXD05 and exact implementation/rendering remain scoped as above.
