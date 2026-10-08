# Spec-Driven Development Workflow

Status: accepted engineering workflow | Updated: 2026-10-05 | Issue: #4.
Authority: this document owns implementation workflow; product/UX specs own behavior; architecture baseline owns technical defaults.
Goal: every code change starts from a traceable requirement and ends with reviewed evidence.

## 1. Artifact hierarchy

Use the smallest authoritative chain:
1. Product decision/requirement: why and expected user behavior.
2. Feature issue: bounded implementation outcome and links to authority.
3. Implementation spec: technical design for that issue when the issue alone is insufficient.
4. Pull request: implementation plus verification evidence.
5. Merge: only after required review passes.

One fact should have one canonical owner. Link instead of copying long requirements between documents.
Stable IDs from existing specs stay stable; implementation specs may add local IDs without renumbering product IDs.

## 2. When an implementation spec is required

Create a spec when a feature changes data shape, publishing/auth behavior, multiple routes/modules, accessibility interaction, or failure/recovery semantics.
A tiny isolated change may keep its complete spec in the GitHub issue.
Specs live under `docs/implementation/<issue>-<slug>.md` unless a scoped directory has a stronger local convention.
All AI-authored Markdown targets <=120 lines and has a hard maximum of 150 lines; shorter is preferred when complete.
If a document would exceed 150 lines, split by authority/responsibility/lifecycle and cross-link rather than duplicate context.
Implementation specs follow the same rule; do not pad documents to reach a minimum.

Recommended spec sections:
- Status, issue, dependencies, authoritative product/architecture links.
- Goal and non-goals.
- User/system flow.
- Data/API/server-action changes.
- UI states and accessibility behavior.
- Failure, conflict, privacy, and rollback/recovery behavior.
- Test plan and acceptance mapping.
- Open questions that block implementation.

## 3. Feature issue contract

Every feature implementation starts from one GitHub issue.
The issue must state: goal, in-scope/out-of-scope, source spec links, acceptance conditions, and known dependencies.
Do not start implementation while a blocking product/architecture question is unresolved.
Large features should be decomposed into independently reviewable issues; do not create umbrella PRs that mix unrelated behavior.

## 4. Delivery strategy

Establish only the minimum cross-cutting foundations first: config/logging, PostgreSQL/Prisma base, owner auth, and theme/app-shell behavior.

After that, prefer vertical feature slices over layer-first delivery. A slice should implement the smallest useful capability end to end:

`feature → schema/data → server rules → owner workflow → publish/public view → tests/acceptance`

Do not build the entire database/backend, public UI, or owner UI in isolation when a bounded slice can validate the contract sooner.
Introduce media, new dependencies, and shared abstractions when the first real feature needs them, not speculatively.
During development, perform runtime acceptance locally when possible. Production deployment/acceptance is the final phase after development and local acceptance are complete.
Issue #13 tracks the current delivery order.

## 5. Agent implementation loop

1. Verify current `main`, issue, linked specs, AGENTS.md, and architecture baseline.
2. Record exact starting SHA.
3. Create a focused branch named for the issue.
4. Implement only the issue/spec scope; prefer a complete vertical slice where applicable.
5. Keep Server Components/server data access by default; justify new client boundaries/dependencies.
6. Add/update tests at the lowest useful level.
7. Run affected lint/type/test/build checks defined by the project.
8. For documentation changes, verify each changed/new Markdown document is <=150 lines and report its line count.
9. For config changes, update the central Zod env schema, `.env.example`, and validation tests together.
10. For important operations, use the shared logger; never bypass it with `console.*` or feature-local Pino setup.
11. Self-review diff for scope, accessibility, privacy, logical CSS, config/logging rules, document size, and spec traceability.
12. Open a PR linked to the issue/spec with exact evidence.
13. Stop for review; do not merge merely because automated checks pass.

Agents must not invent missing content, architecture, credentials, metrics, dependencies, or product behavior.

## 6. Pull request contract

PR description includes:
- issue and implementation-spec link;
- exact base/head when deterministic verification matters;
- concise change summary;
- intentional non-goals;
- migrations/config/dependency changes;
- tests/checks actually run and results;
- remaining manual/runtime checks;
- screenshots only when they add visual-review evidence.

A PR should be small enough for an independent reviewer to understand its behavioral impact.
If the PR head moves after deterministic/security review, affected verification must be repeated on the new head.

## 7. Review and merge

Use independent review for meaningful feature changes; do not rely only on the implementing agent's conclusion.
Review against the issue/spec first, then code quality, accessibility, security/privacy, migrations, and regression risk.
Security review is required when a change materially affects auth, authorization, private/public delivery, uploads, secrets, or trust boundaries.
Merge only when required checks/reviews pass and no blocking acceptance item remains.
Prefer squash merge for one coherent issue unless preserving individual commits has a concrete value.

## 8. Testing strategy

Vitest is the unit/integration runner for deterministic domain/validation logic, server actions/functions, Prisma/PostgreSQL rules, transactions/conflicts, and important route boundaries.
React Testing Library runs with Vitest for React component behavior; test user-observable semantics such as roles, labels, text, focus, and visible state rather than component internals.
Playwright is the E2E runner: use it only for critical browser journeys whose confidence cannot be obtained cheaply below the browser level.
Do not duplicate the same assertion at every test layer.
When guiding **human-executed runtime acceptance**, follow [AI-guided manual runtime acceptance](qa-runtime-acceptance.md) to give one shell-appropriate command step at a time, verify real output and record exact-head evidence; **do not author automated tests under that procedure**.
Run local runtime/product-design acceptance when an implemented slice creates the relevant surface; defer production-only evidence to the final production phase.
Runtime product-design checks from RV01–RV14 are executed when the implemented surface exists and recorded as evidence.
CI/lint must reject direct application `console.*` use and direct Pino imports outside the shared logging module.
Tests must cover env-schema failure for missing/invalid required config and logger redaction for sensitive fields.

## 9. UI implementation guardrails

Tailwind CSS 4+ and approved design tokens/style contracts are authoritative over generated component defaults.
Use shadcn/ui Base UI primitives where they reduce interaction/accessibility risk; customize them to Signal Studio.
Run the current shadcn validation/lint/AI-style checks selected by the bootstrap spec in CI or PR verification.
Use logical directional utilities; new physical left/right layout utilities require a documented exception.
Read [UI skill policy](ui-skill-policy.md) for mandatory skill triggers and the P16 motion boundary.
Owner/admin/sign-in/studio/private-preview/publish-review UI state changes are immediate; do not add UI animations there.
Public motion is CSS-first. Use Framer Motion only for approved public springs/layout/exit/gesture behavior, preserve reduced-motion behavior, and never require motion to understand or complete a task. Add the dependency only when the first bounded public-motion implementation needs it.

## 10. Definition of done

A feature is done when its bounded slice matches the accepted spec, required tests and applicable local acceptance pass, configuration/logging guardrails pass, review findings are resolved, and evidence is recorded.
Done does not mean every future architecture/runtime validation item is closed; only the issue's declared acceptance must be satisfied.
Any intentional deviation updates the authoritative spec/decision before or with the implementation PR.
No undocumented product behavior becomes precedent merely because code was merged.
