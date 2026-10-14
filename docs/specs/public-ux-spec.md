# Public UX Specification

Status: reconciled P19–P25 public UX; approved requirements differ from working component direction. Updated: 2026-10-15.
Current authority: [public checkpoint](ux-public-checkpoint.md) (UXH/UXN/UXC/UXD), [Project/Story](project-story-spec.md), [Contact](contact-ux-checkpoint.md). Historical W43/PU examples below are not approval for revised UI.
Authority: [PRD](../../PRD.md), [decisions](../decisions.md), [content inventory](../content-inventory.md). Trace: R01–R11, R23–R26; A01–A04, A10–A12.
Companions: [navigation/state](navigation-state-spec.md), [accessibility/responsive](accessibility-responsive-spec.md), [media/evidence](media-evidence-spec.md). No code, asset creation, or empirical usability claims.

## 1. Experience intent

Help a curious visitor understand one piece of work, Arvin's contribution, and a consequential choice; let them continue exploring or contact him freely.
Personal Studio is a curated space with things to inspect. Companies provide context; chronological career history does not organize entry or browsing.
Design knowledge: focus reduces competing choices; progressive depth supports quick scanning and technical inspection; visible context makes exploration recoverable. These are design rationales, not measured results.

## 2. Homepage: one authored invitation

[UXH01–UXH09](ux-public-checkpoint.md) require a combined concise identity + one manually featured published **Project** hero, then Stories (up to four), More Projects (up to three, excluding feature), Experience, About introduction, How I can help and Contact invitation. The hero's Explore Project is primary; secondary Contact is available. Home headers scroll to Home sections; View all and More about me navigate to dedicated pages.
A project cover/video poster is optional; no autoplay. Without an explicitly configured feature, keep identity and eligible sections, omit feature area/action, and never automatically select a replacement (UXH09). Content order and information emphasis are approved, not exact layout. Manual Home selection/order uses [OWN01–OWN05](owner-content-checkpoint.md) and never implies content publication; default Home latest ignores collection pins.

## 3. Browse: projects before companies

Separate published **Projects** and **Stories** collections and detail routes (UXN01); no required company-detail page. Visitors filter by one optional reusable label at a time, default All. Filter **before** sorting: matching pinned entries most recently pinned first, then unpinned entries newest by first publication date (UXN04–UXN07). Shared Story pins apply equally to Stories browse and its public Project's related list; unpublish/republish restores previous pin priority. There is no global or per-Project manual order; Home-only manual order is independent.
Load more retains filter/order/loaded items; detail return restores reading position and invoking item. A missing cover never creates a placeholder or dead link. Discovery uses Project title/overview/contribution or Story title/introduction; [UXD03](ux-public-checkpoint.md) remains **working direction**, not approved layout. No automatic related Story recommendations, company-group filtering or algorithmic suggestions. Company/role is optional factual context, not an additional page or mandatory grouping.

## 4. Detail: summary first, depth by choice

Approved P25 hierarchy (UXD01–UXD02): **Project name + overview → individual contribution → optional showcase → secondary facts/links → published linked Stories**. Project media/links/status are optional; zero/one/many media must work with no forced gallery. Project details hide the Stories area completely if no published children.
**Story title + short introduction → concise designed explanation**, with optional contextual media, labels and currently published Project relationship secondary. A Story may stand alone or remain public while its parent Project is private; never reveal private parent metadata (PS05). Stories may express decisions, lessons, problems or experiments without mandatory Problem/Decisions/Evidence tabs, article format or mandated heading/group editor (UXC05/UXC08). No automated “related Stories” (UXC09). Optional Project In progress/Completed/Cancelled status and factual release/availability notes must never imply shipping from completion or privacy from no live link (UXC07). Cancelled/never-launched projects remain publishable.
Image enlargement/user-controlled playback are ordinary usability defaults, but exact gallery/player/return design remains open; no autoplay. Accepted P17 figure-origin Evidence Close/focus continues for the **historical W43 Work slice only**; do not force that old section model onto new P19 Stories. No misleading captures, fabricated contributions or unusable external actions.

## 5. Company experience: one model, two content cases

**Superseded for full-product IA:** earlier multi-project/main-product Experience detail pages and embedded Story modes describe historical Work design, not P19 destinations. Home Experience now provides compact company logo/name, role, truthful contribution/responsibility and optional published Project/company website links; dates remain factual requirements. The company's own header remains logo/name only. Existing Experience URLs and snapshots need an explicit migration/compatibility contract; do not infer redirects or deletion. [W43](../implementation/43-work-p15-p16-media-motion-retrofit.md) evidence retains its delivered-slice scope.

## 6. Personal context and contact

Home About introduction sits after Experience and links to dedicated About; authentic interests/learning, optional approved portrait and work/contact paths take precedence over invented personality facts or duplicated CV.
Dedicated Contact includes Name, Message, Email or Phone, optional job position, reply channel when Phone supplied, conditional Telegram identifier, no upload and no service selection. Send through app to owner's email inbox; success means safely accepted for delivery and stays on Contact, not “message read.” Home and Contact offer Telegram-first direct choices plus WhatsApp, LinkedIn and email. Short form Privacy note links to a Privacy page (CT01–CT12); no dashboard enquiries inbox.

## 7. Review scenarios

| ID | Given / action | Expected result | PRD |
| --- | --- | --- | --- |
| PU01 | Home feature opens detail | Combined identity/featured Project → Project contribution/details | A01, A10 |
| PU02 | Filter label → Load more → detail → return | Pinned-first filtered order, loaded items and position preserved | A03, A11 |
| PU03 | Project/Story without media | Complete content; no blank media, demo or dead link | A04 |
| PU04 | Home Experience → Project | Compact company credibility, optional Project link; no mandatory company page | A02 |
| PU05 | Story with no headings/decisions | Explanation complete; no empty section/tabs | A04, A11 |
| PU06 | Any public state → Contact | Form/direct channels available independently | A01 |
| PU07 | Unconfigured feature | Home identity and available sections; no auto replacement | A04, A08 |
| PU08 | Visual review | Distinctive Signal Studio, no CV skeleton; approved image required | A12 |
| PU09 | Cancelled/never-shipped Project | Truthful contribution, optional local capture/stage and no dead Visit action | A01, A04, A10–A11 |

Historical PU identifiers were previously exercised against Story-as-Project proposals; scenarios now describe P19 and are **unrun**. [UXP01–UXP17](ux-public-checkpoint.md) own the accepted product requirement checks.

## 8. Open scope and agent boundary

Resolve O01–O03 for factual content/contact. O04 is resolved by owner approval of the rendered wide light/dark direction; remaining responsive/interaction checks are tracked in [validation](../responsive-interaction-validation.md). P02–P04 now confirm explicit publishing and focused V1. See [owner UX](owner-ux-spec.md), [content/publishing](content-publishing-spec.md), and [Signal Studio](visual-system-spec.md); their detailed contracts remain drafts.
Agents must use this flow with the navigation and accessibility contracts, retain requirement IDs, and flag missing inputs. Do not infer components, framework APIs, schema, animation timing, palette, or implementation authorization from these documents.
