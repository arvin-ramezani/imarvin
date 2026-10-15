# PRD

Product: imarvin | Owner: Arvin Ramezani | Version: 0.16 | Updated: 2026-10-15

Status: revised draft. Confirmed constraints: C01–C10. P01–P15 and T01–T07 are owner-approved where listed in decisions. P15 confirms the media documentation brief; P26 approves scoped preview/showcase/Story presentation, while exact imagery, inspection/player and editor controls remain open. The [journey audit](docs/ux-journey-audit.md)'s four high-level gaps are closed by P24. Remaining work includes legacy reconciliation, component design, factual inputs, runtime validation and feature-level implementation details; the complete PRD is not blanket implementation approval.

P19–P26: [UX checkpoint](docs/ux-requirements-checkpoint.md) records latest requirements, including the owner-approved combined hero/Home About placement. The scoped checkpoints separate delegated working direction from approved publishing minima, status, Contact and content-list management; P26 approves scoped public presentation/preview/About direction; exact images and editor/implementation details remain open.

## 1. Product intent

A creative personal web app where visitors explore Arvin's work, thinking, and personality through meaningful interaction. It should feel like entering his own digital space.

Freelance clients are the primary audience; job opportunities and curious exploration remain supported outcomes. ImArvin focuses on Arvin; BluCode is out of scope for now. The product is not a portfolio/résumé site. The former five-section homepage is superseded; evidence about work remains useful content.

Selected model: Personal Studio (P01). Core loop: enter → choose a work item → inspect a decision/evidence → explore related work or contact. P19 selects one featured Project, distinct Project/Story pages, and a Home overview with deeper dedicated pages. Approved Project/Story detail hierarchy and remaining working direction are separated in the public checkpoint; exact Project/Story fields and rendered components remain to design. See [concepts](docs/design-concepts.md), [direction](docs/design-direction.md), and [public UX](docs/specs/public-ux-spec.md).

## 2. Users and outcomes

| User | Intent | Successful experience |
| --- | --- | --- |
| Curious visitor | Discover what interests Arvin and what he builds | Understand one memorable work story and choose where to explore next |
| Employer / technical reviewer | Assess responsibility and judgment | Inspect concrete work and contact without navigating a CV |
| Freelance client | Find relevant problem-solving experience | Recognize applicable work and start a conversation |
| Arvin | Curate his personal space | Edit, preview, organize, and publish through a private dashboard |

Success hypotheses: visitors understand a contribution/decision, recognize Arvin's perspective, and can reach relevant work/contact without confusion. Relevant job/client inquiries are a longer-term signal. No invented metrics or usability claims.

## 3. Public requirements

| ID | Requirement |
| --- | --- |
| R01 | Entry is an authored exploration surface with one clear primary action; no mandated résumé section sequence |
| R02 | Identity and purpose are clear; work, personal context, and contact remain discoverable |
| R03 | Home Experience conveys credibility through company logo/name, role, concise contribution/responsibilities; dates remain a factual requirement pending P19 reconciliation; no duplicate full About experience |
| R04 | Company logo/name may link to the real website; no separate company detail page. Company identity remains logos/name only; project media has its own showcase |
| R05 | Home Experience follows More Projects; About introduction follows Experience before How I can help; optional relevant Project links. Earlier company Experience routes require compatibility reconciliation |
| R06 | Stories are concise designed explanations of problem/solution, decisions, lessons or experiments, without forced identical sections or article format; exact components/fields remain open |
| R07 | Distinct Projects have zero/many Stories; Stories have zero/one Project and can stand alone. Public navigation, labels and direct links follow [P19 public requirements](docs/specs/ux-public-checkpoint.md) |
| R08 | Ongoing/completed/cancelled progress, release history (shipped/never shipped), current availability and capture stage remain distinct; cancelled/offline/never-shipped work is eligible for full published stories and featuring |
| R09 | Purposeful permitted project images/recordings support discovery and inspection, including real animations/workflows; captions identify context and proof limits. Media is optional; text layouts remain complete and only usable public external links appear |
| R10 | Personal context communicates real interests/learning; contact is available independently of completing exploration |
| R11 | Navigation, back/reset, absent content, and unavailable destinations have understandable behavior |

A Project is a body of work, distinct from a focused Story. UI-heavy, CLI and backend Projects share a simple complete overview with optional zero/one/many media and optional links; the live Project link has priority over company context. Deeper problems/solutions/decisions belong in Stories. [P19](docs/ux-requirements-checkpoint.md) owns the current relationship, Home, browsing and contact requirements; no blog is implied.

## 4. Owner requirements

| ID | Requirement |
| --- | --- |
| R12 | Owner sign-in/out; no public registration; server-side authorization |
| R13 | Manage identity/personal context, Experience, distinct Projects/Stories, optional media, labels and Contact. P22 limits manual order to Home and uses shared pins elsewhere, with All items/Home selection views and arrangement-only Apply changes; [owner content](docs/specs/owner-content-checkpoint.md) governs locations. Publishing minima are approved; exact controls/layouts remain to design |
| R14 | Choose zero/one Project for a Story at creation; no move/attach/detach operation now, except Keep Stories on Project deletion. Independent visibility/bulk choices follow [Project/Story](docs/specs/project-story-spec.md) |
| R15 | Preview the public layout privately; show unsaved/saved and private/published states |
| R16 | Explicit publishing: Save private draft; Publish new content; Update published content explicitly |
| R17 | Saving edits leaves existing public content intact; publish/update failure preserves it |
| R18 | Retain input on validation/save failures; warn before discarding changes; confirm deletion and show affected references |
| R19 | Unauthenticated visitors cannot read drafts/previews/unpublished assets or perform owner actions |

P02, P10, and P12 are accepted. [Owner UX](docs/specs/owner-ux-spec.md) and [content/publishing](docs/specs/content-publishing-spec.md) define the approved behavioral contracts; T01–T07 define the architecture/runtime defaults while feature specs choose exact schema/commands. Structured editing (P08) controls content, not arbitrary page layouts.

## 5. Experience quality

R20: Mobile/desktop/320px retain the core loop without horizontal overflow.  
R21: Keyboard, labels, visible focus, contrast, readable text, and reduced-motion support.  
R22: Stable deep links and appropriate page/share descriptions/images; only published data/assets are publicly delivered/indexed.\
R23: Images have meaningful alternatives; recordings have appropriate captions/descriptions and user-controlled playback. Layouts remain complete with no logo, screenshots, video, or live demo; see [media](docs/specs/media-evidence-spec.md) and [accessibility](docs/specs/accessibility-responsive-spec.md).\
R24: Progressive depth: quick understanding first, decisions/evidence on request; preserve context when returning.  
R25: Exploration changes meaningful visible content/state; selection/back/reset are clear; no essential hover-only or animation-only controls.  
R26: Later design must establish a recognizable composition/identity beyond uniform cards, résumé rows, or cosmetic color changes; creativity remains usable and focused.  
R27: Light and Dark support public/owner/preview states; default System with System/Light/Dark choice. Theme switching preserves navigation, reading position, focus, selections and unsaved edits; it never saves or publishes content.

## 6. V1 boundaries

One owner and English public content remain. P19 replaces P03's no-form rule with [Contact form + direct channels](docs/specs/contact-ux-checkpoint.md), Telegram preferred, no service selector/BluCode. P20 Home has Identity + Featured Project (one hero) → Stories → More Projects → Experience → About introduction → How I can help → Contact invitation. Dedicated Projects/Stories/About/Contact pages provide depth; a simple Privacy page supports the Contact note. No Services/company page. P23 confirms email inbox handling without a dashboard enquiry inbox or automatic confirmation email and excludes automatic related-Story suggestions. P19–P26 remain requirements/direction only. Project publication requires name/overview/contribution; Story publication requires title/introduction/explanation (UXD06–UXD07); private drafts may be incomplete. P21 keeps status metadata optional, requires Telegram identity only when selected and excludes Contact attachments.

Exclude public accounts, community, blog/newsletter, customer portal, booking/payment, AI generation, multilingual publishing, analytics dashboards, mandatory 3D/game navigation, and runnable simulations as baseline scope. Interactive evidence must not execute untrusted project code.

Architecture is defined by [technical architecture](docs/architecture/architecture.md) and [runtime operations](docs/architecture/runtime-operations.md): Next.js full stack, PostgreSQL/Prisma, Better Auth, filesystem media, Ubuntu/OpenLiteSpeed deployment, off-host backup, and small structured logging. Exact implementation versions/commands are feature/bootstrap details.

## 7. Acceptance targets

| ID | Observable outcome | Requirements |
| --- | --- | --- |
| A01 | Entry explains the space and offers a clear exploration action plus discoverable contact | R01–R02, R10–R11 |
| A02 | Experience provides concise credibility and optional relevant Project links, without required company detail pages | R03–R05, R14 |
| A03 | Distinct Project/Story routes, optional parent and Home/dedicated-page navigation follow P19; previous URL compatibility requires a migration contract | R06–R07 |
| A04 | Offline/cancelled/never-shipped work remains truthful and complete with permitted captures/recordings or without optional media; capture stage never implies a launch | R08–R09, R23 |
| A05 | Owner curates/edits/associates/previews/publishes without editing source files | R12–R16 |
| A06 | Save does not publish; explicit successful update does; failure preserves public content and input | R16–R18 |
| A07 | Owner actions/drafts/previews/unpublished assets are private | R12, R19, R22 |
| A08 | Empty/loading/error/not-found/removal states have a next action | R11, R18 |
| A09 | Core loop works in Light/Dark/System on desktop/mobile/320px, keyboard, and reduced motion | R20–R21, R25, R27 |
| A10 | Stories show real individual contribution and judgment with no invented outcomes | R06, R24 |
| A11 | Visitor selects work, reveals a decision/evidence, and returns with context; this changes content, not just decoration | R11, R24–R25 |
| A12 | Design review identifies a concrete signature composition and purposeful interaction; standard CV layout is not accepted | R01, R26–R27 |

The visual direction is owner-approved. Responsive, interaction, accessibility, content-truthfulness, and implementation targets remain unverified until their later reviews.

## 8. Next gate

Signal Studio (P09) and the existing light/dark visual system/rendered target (P11/P13/P14) are approved. P15 extends documentation for project images/video; P26 approves scoped media composition in requirements, but no new rendered media variants or exact player/inspection design have owner approval. The [visual system](docs/specs/visual-system-spec.md) is the visual authority; [media](docs/specs/media-evidence-spec.md) and [components](docs/specs/components-interaction-spec.md) define proposals requiring later validation.

Continue P19 requirements discovery, reconcile overlapping legacy specs before dependent design/implementation, and obtain exact-image approvals. O01–O03 still gate actual publication; P18 fixtures support design/development. Finish runtime responsive/interaction/accessibility validation. O04 visual approval and O05 architecture baseline are resolved. Implementation proceeds only through the accepted issue/spec/PR workflow.
