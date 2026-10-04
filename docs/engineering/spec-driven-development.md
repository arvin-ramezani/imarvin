# Spec-Driven Development Workflow

Status: accepted engineering workflow | Updated: 2026-10-03 | Issue: #4.
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

## 4. Agent implementation loop

1. Verify current `main`, issue, linked specs, AGENTS.md, and architecture baseline.
2. Record exact starting SHA.
3. Create a focused branch named for the issue.
4. Implement only the issue/spec scope.
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

## 5. Pull request contract

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

## 6. Review and merge

Use independent review for meaningful feature changes; do not rely only on the implementing agent's conclusion.
Review against the issue/spec first, then code quality, accessibility, security/privacy, migrations, and regression risk.
Security review is required when a change materially affects auth, authorization, private/public delivery, uploads, secrets, or trust boundaries.
Merge only when required checks/reviews pass and no blocking acceptance item remains.
Prefer squash merge for one coherent issue unless preserving individual commits has a concrete value.

## 7. Testing strategy

Vitest unit: deterministic business/validation logic.
Vitest integration: server actions/functions, Prisma/database rules, transaction/conflict behavior, important route boundaries.
E2E: only critical user journeys whose confidence cannot be obtained cheaply below the browser level.
Do not duplicate the same assertion at every test layer.
Runtime product-design checks from RV01–RV14 are executed when the implemented surface exists and recorded as evidence.
CI/lint must reject direct application `console.*` use and direct Pino imports outside the shared logging module.
Tests must cover env-schema failure for missing/invalid required config and logger redaction for sensitive fields.

## 8. UI implementation guardrails

Tailwind CSS 4+ and approved design tokens/style contracts are authoritative over generated component defaults.
Use shadcn/ui Base UI primitives where they reduce interaction/accessibility risk; customize them to Signal Studio.
Run the current shadcn validation/lint/AI-style checks selected by the bootstrap spec in CI or PR verification.
Use logical directional utilities; new physical left/right layout utilities require a documented exception.
Framer Motion must preserve reduced-motion behavior and must not be required to understand or complete a task.

## 9. Definition of done

A feature is done when implementation matches its accepted spec, required tests pass, configuration/logging guardrails pass, review findings are resolved, and evidence is recorded.
Done does not mean every future architecture/runtime validation item is closed; only the issue's declared acceptance must be satisfied.
Any intentional deviation updates the authoritative spec/decision before or with the implementation PR.
No undocumented product behavior becomes precedent merely because code was merged.
