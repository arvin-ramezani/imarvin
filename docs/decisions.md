# Decisions

Updated: 2026-10-03. Confirmed = explicitly stated by the owner. Proposed = included for review. Open = needs an owner decision or verified facts.

This register applies only to arvin-ramezani/imarvin. C/P/O IDs are independent of the older project's decisions. PR approval/merge does not automatically accept every proposed item unless the owner says so.

## Confirmed constraints

| ID | Decision |
| --- | --- |
| C01 | Fresh personal web app, separate from the previous imarvin project |
| C02 | Primary outcomes: better job opportunities and freelance clients |
| C03 | Content editing through a private dashboard |
| C04 | Company cards use logos only, with no company photographs or screenshot covers |
| C05 | Cards open details of work; company experience supports multiple projects and one main company application |
| C06 | Appearance should be premium and simple, with concise communication |
| C07 | This task produces concepts/knowledge/documents and a PR; no code, images, or prototype |
| C08 | New source-of-truth repository: arvin-ramezani/imarvin; name the product requirements file PRD.md |

The homepage sequence discussed in the conversation is the working baseline in PRD R01. It was suggested by the assistant; record any owner revision explicitly.

## Proposed product choices

| ID | Proposal | Why it matters |
| --- | --- | --- |
| P01 | Engineering Practice concept A, using problems, responsibility, decisions, and outcomes | Defines a distinctive content-led experience |
| P02 | Save private draft → preview → explicit Publish/Update; preserve existing public content until success | Determines the owner publishing lifecycle |
| P03 | V1 has one owner, English public content, email/professional links, and no contact form | Bounds editing, language, and inquiry scope |
| P04 | V1 excludes blog/community/customer portal/AI generation; keep selected work and About | Prevents feature growth before work evidence is ready |

Docs are written in English; English public-site content remains part of P03. Next.js/TypeScript is a frontend preference; no backend/storage/auth/deployment choice is accepted here.

## Open items

| ID | Missing input | When needed |
| --- | --- | --- |
| O01 | Company identities, roles, dates, and exact contributions, especially waiting room | Before factual story approval |
| O02 | Final featured selection, per-project status and public availability, permitted evidence | Before content and public UX specification approval |
| O03 | Public contact destinations and honest availability statement | Before contact flow approval |
| O04 | Palette/type/theme and later visual target | Before UI implementation |
| O05 | Backend/storage/authentication/account recovery/hosting and operating approach | Before technical specification approval |

## Change procedure

When a choice is accepted, record the owner's decision, date, and affected requirement/specification. When an assumption changes, update its authoritative document and references in the same PR. Never present recommendations or unfinished evidence as confirmed facts.
