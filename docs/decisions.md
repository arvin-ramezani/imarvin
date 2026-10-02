# Decisions

Updated: 2026-10-03. Confirmed = owner instruction. Proposed = review needed. Open = missing decision/fact. Superseded = do not implement.

Authority: arvin-ramezani/imarvin only. No inheritance from the previous imarvin project. Merging documentation does not accept every proposal or authorize code.

## Confirmed constraints

| ID | Decision |
| --- | --- |
| C01 | Fresh personal web app, separate from the older project |
| C02 | Desired opportunities: employment and freelance clients; these do not prescribe a CV layout |
| C03 | Private dashboard for content editing |
| C04 | Company entries use logos only; no company photos or screenshot covers |
| C05 | Company work details support several projects or the company's main application directly |
| C06 | Premium/simple and concise; interpreted as focused/intentional, not mandatory visual quietness |
| C07 | Current task is documents only; no generated images, prototype, code, or deployment |
| C08 | New repository arvin-ramezani/imarvin; requirements file is PRD.md |
| C09 | Owner rejects portfolio/résumé product and the current boring direction; create a creative personal web app |
| C10 | Document product design and UX as concise, structured AI context |

## Superseded direction — 2026-10-03

- The assistant-proposed homepage sequence introduction/experience/projects/about/contact is no longer a layout requirement (R01 revised).
- Former P01 Engineering Practice as a résumé/editorial public concept is rejected.
- Quiet/neutral/editorial styling and chronology are not defaults.
- Problem/contribution/decision/outcome remains an internal story model, not a screen template.
- C09 overrides conflicting prior presentation guidance; logos-only company entries remain.

## Proposed choices

| ID | Current proposal | Implication |
| --- | --- | --- |
| P01 | A. Personal Studio: select work, inspect decisions/evidence, retain context | Replaces former P01 recommendation; B/C are alternatives, not added modules |
| P02 | Save private draft → preview → explicit Publish/Update; prior public version stays until success | Publishing lifecycle pending owner review |
| P03 | One owner, English public content, email/professional links, no contact form | Bounds account/language/contact scope |
| P04 | Curated existing work and contextual decisions/evidence; exclude blog/community/customer portal/AI generation | Creative exploration does not require a new content platform |

Proposal changes affect PRD R01–R02, R07, R09–R11, R13, R24 and new R25–R26; A01/A03/A05/A09 revised, A11–A12 added. Record approval of the new P01 explicitly; prior recommendation does not imply acceptance.

## Open items

| ID | Input needed | Gate |
| --- | --- | --- |
| O01 | Company identities, roles, dates, personal responsibility | Before factual story approval |
| O02 | Featured work, actual decisions/evidence, status/availability, useful grouping | Before public/content UX approval |
| O03 | Public contact destinations and accurate availability | Before contact-flow approval |
| O04 | Signature motif, palette/type/theme and selected visual target | Before UI implementation |
| O05 | Backend/storage/auth/recovery/hosting/operations | Before technical-spec approval |

English documents are required; public-site language remains P03. Next.js/TypeScript is a preference, not an approved architecture.

On acceptance/change: record owner instruction/date and affected requirement/specification. Keep factual unknowns separate from design proposals.
