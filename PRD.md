# PRD

Product: imarvin | Owner: Arvin Ramezani | Version: 0.2 | Updated: 2026-10-03  
Status: draft for review. C01–C08 are confirmed constraints; all other product defaults are proposed until accepted.

## 1. Purpose

Help employers and freelance clients assess Arvin's work and judgment, then contact him. Give Arvin a private dashboard to maintain accurate public content.

Proposed concept: an engineering practice showing the relationship between problems, contributions, decisions, and outcomes. Distinction comes from real experience and perspective. See [concepts](docs/design-concepts.md) and [direction](docs/design-direction.md).

## 2. Audience and success

| Audience | Main question | Useful outcome |
| --- | --- | --- |
| Employer / technical reviewer | What did Arvin own, and how does he think? | Assess fit and start a job conversation |
| Freelance client | Has he solved a problem relevant to mine? | Understand his contribution and contact him |
| Arvin | Can I keep my work accurate and current? | Edit, preview, and publish without source-file changes |

Success signal: relevant job/freelance inquiries referencing the work. No invented conversion or traffic targets. Start with practical web applications and ecommerce experience; describe AI or architecture expertise only where evidence supports it.

## 3. Public requirements

| ID | Requirement |
| --- | --- |
| R01 | Homepage order: Introduction → Work experience → Selected projects → About → Contact |
| R02 | Introduction communicates what Arvin builds; work and contact are easy to reach |
| R03 | Company cards show logo/name, role, dates, and one specific contribution; use a company-name fallback for missing logos |
| R04 | Cards contain no company photographs or screenshot covers and open a shareable company experience page |
| R05 | Experience pages share a header but adapt the work section: multiple project summaries, or the main company product shown directly |
| R06 | Each story explains problem, personal responsibility/tasks, decisions, and outcome/current status; show stack where relevant |
| R07 | Selected projects reuse the same story as company experience; a single-product story is directly linkable without duplicated content |
| R08 | Separate ongoing/completed/cancelled status from public availability; offline work remains presentable |
| R09 | Optional project evidence can include existing screenshots/recordings within the story; external links appear only when usable and public |
| R10 | About connects real experience with current learning; Contact offers a clear route for job and freelance conversations |
| R11 | Navigation, back paths, absent content, and unavailable pages have understandable behavior |

A company is the employer/organization; experience is Arvin's role there; a project is a body of work. These are conceptual relationships, not a database schema. One main company product requires no intermediate project-card click. Independent projects can exist without a company.

## 4. Private dashboard requirements

| ID | Requirement |
| --- | --- |
| R12 | Owner sign-in/out; no public registration; authorize owner operations server-side |
| R13 | Manage introduction, experience, projects, evidence, about, contact, featured selection, and display order |
| R14 | Associate projects with company experience; support both work-section presentations without duplicating stories |
| R15 | Preview the intended public layout privately and show unsaved/saved and private/published states |
| R16 | Proposed publishing contract: Save stores a private draft; Publish exposes new content; Update published content explicitly replaces its public version |
| R17 | Saving changes to published content leaves its current public version intact; publishing failure preserves it |
| R18 | Validation/save failures retain input; warn before discarding unsaved edits; confirm destructive removal and show affected references |
| R19 | Drafts, private previews, draft assets, and owner actions remain inaccessible to unauthenticated visitors |

The complete publishing, removal, linked-story, and recovery behavior will be specified after P02 is approved. R16–R19 describe proposed requirements, not a migration of any previous admin design.

## 5. Quality

R20: Mobile and desktop layouts, including 320px, avoid horizontal overflow and retain the core journeys.  
R21: Keyboard access, clear labels, visible focus, sufficient contrast, readable text, and reduced-motion support.  
R22: Stable shareable URLs and useful page titles/share descriptions; public output and indexing expose only published content.  
R23: Logos and optional evidence have suitable text alternatives; missing media does not create broken layouts.  
R24: Employers can scan role/responsibility quickly; deeper technical decisions stay available through progressive detail.

## 6. V1 scope

Proposed defaults: one owner account, English public content, email/professional contact links, and no contact form. The confirmed dashboard decision does not yet approve an authentication mechanism.

Include public work stories and owner editing/publishing. Exclude blog/newsletter, public accounts, comments/community, customer portal, booking/payment, AI content generation, multilingual publishing, and analytics dashboards.

Next.js/TypeScript is an intended frontend preference, not an approved architecture. Backend, storage, authentication, hosting, and operations must be resolved in a later technical specification.

## 7. Acceptance

| ID | Observable outcome | Requirements |
| --- | --- | --- |
| A01 | Visitor understands positioning, opens work, and reaches contact without dead ends | R01–R02, R10–R11 |
| A02 | Unixsee shows separate projects; the previous company's main shop appears directly | R03–R05, R14 |
| A03 | Selected work and company work resolve to one consistent story; no unnecessary click for the main product | R06–R07 |
| A04 | Offline/cancelled work has a complete truthful story; missing logo/evidence is handled | R08–R09, R23 |
| A05 | Owner creates/edits/associates/reorders/previews/publishes content without editing files | R12–R16 |
| A06 | Saving leaves public content intact; successful explicit update changes it; failure retains the prior version and input | R16–R18 |
| A07 | Unauthenticated requests cannot access owner actions, drafts, previews, or unpublished assets | R12, R19, R22 |
| A08 | Empty/loading/error/not-found and destructive-action states give an appropriate next action | R11, R18 |
| A09 | Core public/owner journeys work at desktop/mobile/320px and with keyboard/reduced motion | R20–R21 |
| A10 | Work communicates individual responsibility and decisions without fabricated results | R06, R24 |

These are future acceptance targets, not completed test claims.

## 8. Readiness

[Content inventory](docs/content-inventory.md) separates known work from missing facts. [Decisions](docs/decisions.md) records confirmed constraints and proposals. [Specification plan](docs/specification-plan.md) defines the next documentation phase.

Approve product/concept choices first. Then define behavioral, content, accessibility, technical, and acceptance specifications before authorizing agent implementation.
