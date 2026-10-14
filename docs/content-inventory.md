# Content Inventory

Status: real-content inventory for eventual publication, updated 2026-10-14. P18 uses synthetic fixtures for mockups/non-production development; O01–O03 remain open only for real publication.

## Unixsee

Owner reports current work at Unixsee. Company role title, dates, description, logo, and public disclosure boundaries need confirmation.

| Separate project | Known scope | Needed before publication |
| --- | --- | --- |
| Landing page | Standalone page modeled after Google Chrome's website | Personal tasks, dates, outcome, public availability |
| Unixsee web app — cancelled | Marketing: home, managed WooCommerce servers, design/data entry/SEO/social media services; authentication: JWT/access and refresh tokens/forgot password/OTP; customer dashboard: websites/services/news/details/tickets/profile; help center; admin overview/tickets | Exact personal responsibilities across features, completed vs unfinished work, permitted evidence and stack |
| Waiting room — ongoing | Current WooCommerce traffic/admission project; repository reference below | Arvin's own implementation/design/review responsibilities, decisions, outcomes, project availability |

The owner explicitly reports implementing the user-dashboard and admin-panel UI/UX for the cancelled app. Do not expand this into a claim of independently implementing every feature without confirmation.

[Waiting room repository](https://github.com/arvin-ramezani/unixsee-waiting-room) is a potential evidence source. Product progress is time-sensitive: check current repository evidence when preparing its story. Do not copy an old production-readiness or test status into public copy.

## Previous company

Owner reports building the company's main full-stack online shop using Next.js, NestJS, Prisma, and PostgreSQL. Working project reference: Tarsim; the employer's exact name is not yet confirmed.

Present this employer-owned product as a Project with truthful company context. P19 Home Experience may link to its Project detail; it does not require a dedicated company/Experience page.

Need: company name/logo, role/dates, team context, scope of ownership, main features, important decisions, outcome, and permitted evidence. The earlier GitHub lookup found backup-tarsim with only a README on its default branch; the application repository/branch still needs resolution.

## Curated work and entry selection

The owner earlier mentioned three projects, two offline; later described the three Unixsee projects plus the previous company's product. Final featured selection and availability are unconfirmed. Do not assign live/offline status to individual entries by guessing.

Choose featured work by curiosity, contribution, relevance, and evidence. A live deployment is not a requirement. P19 uses distinct Projects and Stories: a Project may have zero or more independently published Stories, and a Story may stand alone. Their optional media is independent. Entry selection supports a creative exploration surface, not a résumé homepage.

## Candidate visual evidence to collect

These are capture suggestions conditional on available, permitted artifacts. They are not assertions about implemented features, production releases, ownership, or media already supplied. The [P19 public checkpoint](specs/ux-public-checkpoint.md) governs optional media and Project/Story presentation; retain compatible [media/evidence](specs/media-evidence-spec.md) provenance and truthful stage labels.

| Project | Candidate still / detail | Candidate recording | Confirmation needed |
| --- | --- | --- | --- |
| Unixsee landing page | Representative implemented page and a readable responsive/detail capture | One actual interaction/animation, if implemented and useful | Arvin's contribution; capture source/stage; permission; release/availability |
| Cancelled Unixsee app | Customer-dashboard/admin-panel UI Arvin reports implementing; selected states rather than every screen | One implemented navigation, feedback or animation sequence in a runnable local build; design prototype if code is unavailable, labelled accordingly | Completed/unfinished scope, never-shipped versus prior release, real behavior versus prototype, permitted/redacted data |
| Waiting room | Relevant admission screen or permitted management workflow, if available | A confirmed working admission/configuration sequence when it supports the story | Current build/readiness and individual role; safe customer/host/key disclosure boundaries; no production inference |
| Previous company's shop | Confirmed product/browse/basket or other implemented screen worth discussing | One real implemented shopper workflow/transition, if available | Application source, responsibility/team boundaries, permission, release/availability and capture stage |

When media is available and useful, select a representative still/poster for discovery and complementary items for depth; do not prescribe a minimum image count or repeat the same screenshot to fill every section. Original historical capture, current local recording and recreated demo must be distinguished. Cancelled/unshipped work can be featured with these assets after factual/permission review.

## Screen-scoped visual content gates

**P18: use synthetic fixture data for UI images, prototypes, local development and automated tests.** No real project text, real personal/contact details or genuine customer/project images are needed to design UI. Record the selected bounded screen set and linked spec IDs in [VSRC05–VSRC07](specs/visual-source-workflow-spec.md); distinguish fixture presentation from later real publication.

| Screen | Permitted mockup / development fixtures | Required only before real publication |
| --- | --- | --- |
| Home Featured Project / previews | One manually selected published fictional Project; separate Story and More Projects previews (UXH01–UXH05). Optional Project cover; complete no-media variant | Actual selected Featured Project and truthful independent entries; any displayed media permitted (O02) |
| Projects browse / Project detail | Distinct Project screen; concise overview, optional facts/links and zero/one/many media; zero/one/many published related Stories. No mandatory Problem/Decisions layout (UXN01, UXC01–UXC06, PS01–PS05) | Actual Project scope/status/role, optional working links, media rights and independently published related Stories (O02) |
| Stories browse / Story detail | Distinct Story screen; standalone, public-parent and private-parent fixtures; hide private parent metadata. Optional Story media independent of Project media; no mandatory article/section template (UXC03–UXC06, PS01–PS05) | Truthful Story context, optional permitted media and public parent relationship only where permitted (O02) |
| Home Experience | Fictional company logo/name, role/dates, contributions and optional relevant Project links; no dedicated company page (UXH06) | Correct employer/roles/dates/contributions and permission for displayed media (O01–O02) |
| About / Home Contact invitation / Contact page | Generic labelled personal copy and nonfunctional example destinations; distinct Contact form with Name/Message and email or phone, optional job position and preferred reply channel when Phone is supplied (UXH07–UXH08, CT01–CT08). Defer unresolved Telegram/field layout variants | Real personal text and working destinations; delivery/privacy decisions and portrait permission where relevant (O03) |
| Owner editor / preview | Test-only independent Project/Story Private/Published states, private candidates, explicit Publish/Update, failure/loading/no-media/validation fixtures (PS01–PS12); reconcile affected owner specs before images | Actual owned content/media and approved lifecycle/security mechanisms before production publication |

Fixtures must be explicitly marked **FICTIONAL / TEST ONLY** in fixture records, image metadata/approval evidence and development environments; mockup content may appear naturally within a screen but must never be represented as a real project, actual capture, customer, claim, or working contact. When a media-bearing variant is intentionally selected, synthetic media may demonstrate its optional slot; it is **not authentic project Evidence**. No secrets, real customer data or private identifiers. Distinct authored fixture **no-media** states are valid; missing actual assets do not imply no media. Owner-reported project permissions are assumed for planning only; do not claim specific captured assets have been inspected or approved. Real publication remains gated by O01–O03, truthful copy and asset-specific disclosure review.

## Capture worksheet

For each Project and any independently authored Story, collect only relevant facts; this worksheet is not a required public layout:
- Concise Project overview; optional Story problem, decision, lesson or experiment context and users affected.
- Personal role, tasks, and team boundaries.
- Consequential decisions and constraints when relevant; do not require a Decisions section.
- What was completed/unfinished; progress, release history, current availability and confirmed lessons.
- Evidence permitted for public use; source/capture stage/date when known, what it demonstrates and cannot prove; stack and usable public links.
- Optional Project cover/showcase and independently optional Story media; relevant sequence, captions/alternatives. Zero-media content is complete; do not borrow private Story media.
- For recordings: actual starting state/action/result, duration, silent/with-audio, captions/description/transcript needs; source redaction and permission review before publishing.

Do not upload source code, credentials, private operational identifiers, internal tickets, or confidential employer material merely to make a story more impressive. The owner determines appropriate publishable evidence.
