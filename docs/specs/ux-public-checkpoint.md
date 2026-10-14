# Public UX — approved checkpoint
Status: owner-approved requirements; component composition and runtime behavior remain unverified.
Recorded: 2026-10-14 | Authority: [P19 checkpoint](../ux-requirements-checkpoint.md).
Companions: [Project/Story](project-story-spec.md), [Contact](contact-ux-checkpoint.md).
Scope: records the agreed product experience; does not authorize code or approve rendered design.

## Home — UXH01–UXH08
- UXH01: Home summarizes the personal app; dedicated pages provide depth. Keep work visually primary and Stories secondary.
- UXH02: Approved content sequence:
| Order | Content | Boundary |
| --- | --- | --- |
| 1 | Introduction | Identity and concise personal context; fuller About page |
| 2 | Featured Project | One manually selected published Project; strongest emphasis |
| 3 | Stories | Up to 4 published previews, not Instagram-style Stories |
| 4 | More Projects | Up to 3 published Project previews |
| 5 | Experience | Compact professional credibility |
| 6 | How I can help | Up to 3 concise offerings |
| 7 | Contact invitation | Direct channels and link to dedicated Contact page |
- UXH03: Story and More Projects sections use newest first by first publication date by default; allow manual selection and ordering.
- UXH04: Exclude the featured Project from More Projects. Show fewer than the limit when fewer eligible items exist; never fabricate filler.
- UXH05: Provide View all Stories and View all Projects links. Home is not the complete collection.
- UXH06: Experience shows company logo/name, role, concise contributions and responsibilities; optional links to relevant Projects. Company identity can link to its real website. No separate company or Experience page is required by this model.
- UXH07: Offerings are Frontend development, Backend development, Full-stack development. No separate Services page, price table or required client service selection. Enquiry actions lead to Contact without preselecting a service.
- UXH08: About provides introduction, interests and learning; do not repeat the full Home Experience section. Home includes a brief personal overview; exact preview placement remains open.

## Destinations and browsing — UXN01–UXN06
- UXN01: Dedicated Projects and Stories browse pages; each Project and Story has its own detail page. About and Contact also have dedicated pages.
- UXN02: On Home, header section links scroll to their corresponding sections. Explicit View all / More about me / Contact page links open the dedicated destinations.
- UXN03: On every dedicated/detail page, header Projects/Stories/About/Contact links open those pages directly, never their Home previews. Arvin's name/logo returns to Home; Home top is the return target.
- UXN04: Projects and Stories accept optional, reusable, owner-created labels and multiple labels per entry. One simple label system, not separate mandatory Topic and Type systems. Visitors filter by one label at a time; default All Projects / All Stories.
- Label examples: Development, Design, Problem-solving, Decision, Lesson, Experiment. Labels describe context; they do not determine templates.
- Public filters show only labels attached to published entries in the relevant collection. The owner editor suggests existing labels to avoid duplicates.
- UXN05: Full browse lists and Stories within a Project default to first-publication date, newest first, with optional manual ordering. Editing or republishing does not reset the first-publication date.
- UXN06: Use Load more, preserving filter/order. Returning from detail restores filter, loaded entries and scroll position. Exact batches/tie-breakers remain open.

## Content and media — UXC01–UXC06
- UXC01: Project detail is a concise visual overview: title/short description, compact role/status/company/link facts, optional showcase and related Stories. It is not media-only, a long article or a forced Problem/Solution case study.
- UXC02: Project media showcases appearance and actual behavior. Support UI-heavy web apps, complex components/animations, CLI tools and backend apps through the same simple structure.
- Media may be absent, one item, or several images/videos. No-media and single-media layouts must be complete, with no forced gallery, empty media panel or placeholder. Terminal captures/recordings are optional; no dedicated terminal/code component is required now. Detailed code examples, when needed, belong in Stories.
- UXC03: Each Project owns its own optional cover and showcase independently of its Stories. Each Story may have its own optional media/evidence; support zero/one/many items and complete text-only Stories. Sharing/reuse mechanics are unresolved; no automatic borrowing of private Story media.
- UXC04: Unlaunched, unfinished, cancelled, offline and never-shipped Projects remain eligible to publish and feature. Show truthful status; a recording does not imply launch. Live URLs, source code and documentation links are all optional, including when disclosure is prohibited.
- Live Project link has highest external-action priority when available. Company logo/name and real-company website are secondary context. Omit absent/unusable links, never show dead Visit site controls.
- UXC05: Stories are concise designed explanations, not blog articles. Permit problem/solution, decision, lesson or experiment context without mandatory identical sections. Visual hierarchy must make context and value easy to understand and content creation easy for Arvin.
- Deeper problems, solutions and decisions belong in Stories; do not force those sections into the Project overview. Exact Story components/fields remain to design.
- UXC06: Public Project pages list only their published Stories; hide the section completely when none exist. A public Story links to its Project only while that Project is public; standalone or private-parent Stories remain complete.

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
These are requirements checks, not executed browser or visual acceptance.
