# Public UX Specification

Status: draft for review, including P15 media extension | Updated: 2026-10-07 | Model: Personal Studio.
Owner-selected: P05 one featured work; P06 projects first; P07 summary then selectable sections. Other behavior below is proposed, not implementation approval.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md), [content inventory](../content-inventory.md). Trace: R01–R11, R23–R26; A01–A04, A10–A12.
Companions: [navigation/state](navigation-state-spec.md), [accessibility/responsive](accessibility-responsive-spec.md), [media/evidence](media-evidence-spec.md). No code, asset creation, or empirical usability claims.

## 1. Experience intent

Help a curious visitor understand one piece of work, Arvin's contribution, and a consequential choice; let them continue exploring or contact him freely.
Personal Studio is a curated space with things to inspect. Companies provide context; chronological career history does not organize entry or browsing.
Design knowledge: focus reduces competing choices; progressive depth supports quick scanning and technical inspection; visible context makes exploration recoverable. These are design rationales, not measured results.

## 2. Homepage: one authored invitation

| Priority | Content / action | Purpose |
| --- | --- | --- |
| Identity | Name and one short, truthful description of this space | Explain whose work this is and why explore |
| Focal work | One published story: title, concise problem/contribution hook, truthful status and optional representative still/poster | Offer a concrete reason to enter and recognize the work |
| Primary action | Open featured work, labeled with its title | Make the next action predictable |
| Supporting paths | Browse work, personal context, Contact | Allow independent discovery and conversation |

This is attention hierarchy, not a prescribed stacked section layout. Later visual work must express an authored composition and recognizable identity; no résumé sequence, technology-badge wall, dashboard metrics, carousel, or mandatory tour.
The featured object combines its authored text hook with one purposeful project still/poster when available, within the offset work stage. It opens the story rather than playing video on Home; no autoplay or competing media action. Without media, retain the full text composition. Company identity stays logos-only; project media follows the [placement map](media-evidence-spec.md#2-placement-map).
The featured story is selected by Arvin, not by an algorithm. Its identity remains O02; do not assume Waiting Room is featured.
Proposed fallback: if the feature becomes unavailable, use the first eligible published story in Arvin's curated order. If none exist, show identity/personal context/contact and an honest no-work message; hide the dead primary action.

## 3. Browse: projects before companies

| Intent | Trigger | Visible result | Recovery |
| --- | --- | --- | --- |
| Find interesting work | Browse work | Published stories in authored order | Home and Contact remain available |
| Narrow context | Choose company, when useful | Matching stories; active company and result count | Clear company returns all work |
| Inspect a contribution | Open story title/action | Summary with selected title and contextual company | Return restores browse position/filter |
| Understand the employer | Open company context | Shareable experience detail | Return restores originating story/collection |

Each work object exposes title, problem/contribution hook, truthful project status, company context when known, and an optional representative project still. Stack is optional supporting detail. Media supports recognition without displacing contribution/status; opening leads to the story, not hover playback. Distinguish items by content emphasis and composition; do not force equal cards or thumbnail placeholders.
Company filtering is a proposed secondary control, shown only when at least two published company groups make it useful. Include standalone work in All work; do not create an unnamed company for it. No search, sorting controls, or topic taxonomy are needed for the current small collection.
Company context shows name/logo, confirmed role/dates, and contribution; missing logo uses the company name. Unknown factual fields are omitted in public copy and remain authoring blockers where essential.

## 4. Detail: summary first, depth by choice

Always-visible summary: title, concise problem, Arvin's responsibility, known outcome/status, company context, and a clear return path. Relevant stack is supporting context, not the headline.
Summary must convey useful work even when every optional section is absent. Project progress, release history and current availability are separate: cancelled can still have inspectable local evidence; completed does not imply shipped/live. Keep confirmed release/capture context near media, per [ME04](media-evidence-spec.md#3-truthful-unshipped-work).
After title/contribution/status, show one optional lead image or recording poster before section depth. Play demo operates inline; the summary, return and contact remain accessible. Relevant figures may support Problem/Decisions and select the same evidence identity for detailed inspection. Do not force every visual behind Evidence.

| Section | What it answers | Content rule |
| --- | --- | --- |
| Problem | Who needed what, under which constraints? | Confirmed context and tasks; avoid repeating the summary verbatim |
| Decisions | What did Arvin choose and why? | Constraint → considered alternatives → personal choice → consequence or lesson |
| Evidence | What supports the explanation? | Captioned, permitted media, public links, or truthful text records; state what each proves |

Default selection is Problem when published, otherwise the first available section in the order above. Summary remains visible when switching. Hide absent sections; never fabricate a decision or show empty disabled tabs to fill the design.
With no sections, show summary alone; with one, render its heading/content directly. Section selectors are useful when at least two sections exist.
Selecting a section changes its panel, active label, and shareable location. It does not require completing a sequence. No autoplay; every section is directly reachable.
Evidence provides an authored ordered set of captioned items, with one detailed inline inspection at a time and Close evidence. Closing restores its trigger; failure retains the explanation and a Retry action. [ME05](media-evidence-spec.md#4-inspection-and-playback) governs player/inspection behavior; no auto-rotating gallery or required media modal.
External links state their destination and use normal navigation; visitors can choose a new tab. Do not render dead Visit site buttons for offline work.
At the end of detail, offer a contextual Return action and Contact. Label Return for its actual origin (work, company, or previous story); direct-entry fallback is All work. Related work is optional and appears only for an authored relationship; do not invent similarity from shared technology.

## 5. Company experience: one model, two content cases

Shared header: company name/logo, confirmed role/dates, contribution context, and return path.

- Multi-project experience: show its published project choices; opening one uses the same story as projects-first browsing. Unixsee's three projects remain separate stories.
- Main-product experience: render that story's summary and sections directly beneath the header, without a redundant project-choice click. The previous company's shop uses this case; employer identity remains unconfirmed.
- No published project: retain approved experience context and a concise explanation with Browse work/Contact; never expose a draft title.

Company pages may contextualize shared story content, including its project captures, but cannot create a second editable version or use captures as company-header covers. A work deep link opens independently of its company page.

## 6. Personal context and contact

Personal context explains confirmed interests, learning, and perspective; an optional owner-approved portrait/interest photo may support that purpose. Avoid invented mission statements, expert labels, or stock personality imagery. It stays directly reachable from entry, browsing, and detail.
Contact is accessible from every public state without completing exploration. Accepted P03 presentation: approved email/professional destinations, with clear labels; no form, booking, or availability promise.
Actual destinations and wording remain O03. Do not ship placeholder addresses or dead contact controls; resolving contact is required for A01.

## 7. Review scenarios

| ID | Given / action | Expected result | PRD |
| --- | --- | --- | --- |
| PU01 | Published feature with Problem and Evidence; open it from Home | Clear summary, contribution, one selected section, and return path | A01, A10 |
| PU02 | Company filter active; open story, change section, return | Same filter, item, and collection position | A03, A11 |
| PU03 | Story has no media or demo | Full summary/text evidence; no blank media box or dead link | A04 |
| PU04 | Open Unixsee and main-shop experience | Project choices for Unixsee; shop directly under shared company header | A02 |
| PU05 | No Decisions content; select Evidence | No empty Decisions control; evidence remains reachable | A04, A11 |
| PU06 | Any public state; choose Contact | Approved destinations reachable without story completion | A01 |
| PU07 | Feature removed; reload Home | Curated fallback or honest no-work state; no broken primary action | A04, A08 |
| PU08 | Later visual review | Concrete signature composition and useful selection; no CV skeleton or generic admin grid | A12 |
| PU09 | Feature/browse → cancelled, never-shipped story with permitted local recording | Representative still opens the same story; explicit playback shows actual behavior; contribution/stage remain truthful | A01, A04, A10–A11 |

Validate later with task observation and actual rendered interaction. These are unexecuted checks, not usability evidence.

## 8. Open scope and agent boundary

Resolve O01–O03 for factual content/contact. O04 is resolved by owner approval of the rendered wide light/dark direction; remaining responsive/interaction checks are tracked in [validation](../responsive-interaction-validation.md). P02–P04 now confirm explicit publishing and focused V1. See [owner UX](owner-ux-spec.md), [content/publishing](content-publishing-spec.md), and [Signal Studio](visual-system-spec.md); their detailed contracts remain drafts.
Agents must use this flow with the navigation and accessibility contracts, retain requirement IDs, and flag missing inputs. Do not infer components, framework APIs, schema, animation timing, palette, or implementation authorization from these documents.
