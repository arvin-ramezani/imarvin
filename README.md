# imarvin

Arvin Ramezani's creative personal web app.

Phase: bounded implementation is underway. Minimal scaffold, shadcn/agent foundation, and Signal Studio theme/lint foundation are merged. Remaining work follows the vertical-slice delivery strategy in [Spec-driven development](docs/engineering/spec-driven-development.md) and is tracked in GitHub Issue #13.

Light and dark mode are in scope (P14); default follows the device, with System/Light/Dark choices.

Current validation: [Responsive & Interaction Validation](docs/responsive-interaction-validation.md) defines the remaining rendered/task checks; written review is complete and implementation evidence is pending.

Current visual approval: [Visual refinement](docs/visual-refinement-review.md). Foundations review: [Design review](docs/design-review.md). The rendered wide light/dark direction is approved; responsive/interaction/accessibility checks remain.

## Read in order

| Document | Purpose |
| --- | --- |
| [PRD](PRD.md) | User outcomes, scope, requirements, acceptance |
| [Design concepts](docs/design-concepts.md) | Selected concept and two unselected alternatives |
| [Design direction](docs/design-direction.md) | Personal Studio direction and draft UX contracts |
| [Public UX specification](docs/specs/public-ux-spec.md) | Homepage, projects-first browsing, summary/section detail |
| [Navigation/state specification](docs/specs/navigation-state-spec.md) | Destinations, return context, failures, safe deep links |
| [Accessibility/responsive specification](docs/specs/accessibility-responsive-spec.md) | Public-flow mobile, keyboard, reading, motion contracts |
| [Owner UX](docs/specs/owner-ux-spec.md) | Structured editing, private preview, confirmations and recovery |
| [Content/publishing](docs/specs/content-publishing-spec.md) | Private/public versions, dependencies, removal and conflicts |
| [Visual exploration](docs/visual-exploration.md) | Three written directions; Signal Studio approved |
| [Visual system](docs/specs/visual-system-spec.md) | Approved surface/control direction, light/dark palette target, theme behavior and responsive modes |
| [Components/interactions](docs/specs/components-interaction-spec.md) | Public/owner roles, behaviors and states |
| [Integrated acceptance](docs/specs/acceptance-spec.md) | A01–A12 coverage and later verification evidence |
| [Responsive & Interaction Validation](docs/responsive-interaction-validation.md) | Next-phase conditions, check matrix, written findings and Pending evidence |
| [Technical architecture](docs/architecture/architecture.md) | Next.js/PostgreSQL/Prisma server-first modular-monolith baseline |
| [Runtime operations](docs/architecture/runtime-operations.md) | Better Auth, filesystem media, VPS/OLS, Google Drive backup, Pino/journald |
| [Spec-driven development](docs/engineering/spec-driven-development.md) | Foundations → vertical slices → review → local acceptance → production |
| [Specification plan](docs/specification-plan.md) | Current implementation order and specification status |
| [UX principles](docs/ux-principles.md) | Design knowledge and reusable behavior contracts |
| [Branding principles](docs/branding-principles.md) | Identity, evidence, and truthful storytelling |
| [Content inventory](docs/content-inventory.md) | Known work and missing facts |
| [Decisions](docs/decisions.md) | Confirmed constraints, accepted choice, proposals |
| [Agent rules](AGENTS.md) | Source-of-truth and AI context rules |

## Local PostgreSQL

Use a local PostgreSQL database only; production provisioning is intentionally outside this issue.
Create an ignored `.env` from `.env.example`, create the database named by `DATABASE_URL`, then run:

```bash
npm ci
npm run db:generate
npm run db:migrate:deploy
npm run db:migrate:status
npm test
```

CI uses an ephemeral PostgreSQL service and applies the same committed migration state.

## Current review

The owner rejects a portfolio/résumé product. The former fixed homepage sequence and résumé/editorial treatment are superseded.

Selected concept A: Personal Studio (P01, owner-approved). Visitors select work and inspect its problem, decisions, and evidence. Employer/client opportunities remain outcomes; they do not prescribe a CV layout.

P02–P14 decisions are recorded in the product docs. T01–T07 define the technical/runtime baseline and spec-driven delivery workflow. O05 is resolved at architecture level. Implementation should establish only necessary cross-cutting foundations, then deliver product capabilities as bounded end-to-end slices. Development/runtime acceptance is local where possible; production deployment is the final phase.
