# Spec-Driven Development Workflow
Status: accepted engineering workflow | Updated: 2026-10-05 | Issue: #4.
Authority: this document owns implementation workflow; product/UX specs own behavior; architecture baseline owns technical defaults.
Goal: every code change starts from a traceable requirement and ends with reviewed evidence.

## 1. Artifact hierarchy
Authority chain: product decision/outcome → bounded feature issue → implementation spec when needed → PR with exact evidence → reviewed merge.
One fact should have one canonical owner. Link instead of copying long requirements between documents.
Stable IDs from existing specs stay stable; implementation specs may add local IDs without renumbering product IDs.

## 2. When an implementation spec is required
Create a spec when a feature changes data shape, publishing/auth behavior, multiple routes/modules, accessibility interaction, or failure/recovery semantics.
A tiny isolated change may keep its complete spec in the GitHub issue.
Specs live under `docs/implementation/<issue>-<slug>.md` unless a scoped directory has a stronger local convention.
All AI-authored Markdown targets <=120 lines and has a hard maximum of 150 lines; shorter is preferred when complete.
If a document would exceed 150 lines, split by authority/responsibility/lifecycle and cross-link rather than duplicate context.
Implementation specs follow the same rule; do not pad documents to reach a minimum.
Recommended spec sections: status/issue/dependencies/authority, goal/non-goals, user/system flow, data/API/server-action changes, UI/accessibility,
failure/conflict/privacy/rollback/recovery, tests/acceptance mapping, and genuinely blocking open questions.

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
Command Center selects each issue's runtime gate before work: perform required real-environment acceptance locally before merge; group only safe, non-required manual scenarios into an explicitly tracked integrated milestone after related features. Production deployment/acceptance remains the final phase.
Issue #13 tracks the current delivery order.

## 5. Agent implementation loop
The Executor is a **normal ChatGPT chat with GitHub access**, not a mandated IDE or Codex agent. For meaningful work, first submit a **PLAN ONLY** (no source edits); a separate Independent Plan Review must PASS on that plan, spec revision and baseline before implementation. Command Center alone may mark Plan Review NOT REQUIRED for small, low-risk work, with a reason.
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
PR description: issue/spec links, exact base/head when verification requires them, changes/non-goals and schema/migration/config/dependency effects;
checks actually run and results, pending manual/runtime evidence, and screenshots only when useful.
A PR should be small enough for an independent reviewer to understand its behavioral impact.
If the PR head moves after deterministic/security review, affected verification must be repeated on the new head.

## 7. Review and merge
Select and record gates on the bounded issue before implementation. For meaningful work: Executor PLAN ONLY → separate Independent Plan Review → Implementation → deterministic verification → Design QA if meaningful UI → Security Review if security-sensitive → Independent Review → local runtime acceptance if required → Command Center merge. A failed gate returns to the appropriate executor/plan step.
Follow [UI skill policy](ui-skill-policy.md) for media-role, mobile, responsive, animation and Design QA triggers. Security Review is required for auth/sessions, secrets, uploads, private/public or trust boundaries, filesystem/process permissions, network/TLS/proxy, privileged deployment and security fixes.
Use **separate fresh ChatGPT reviewer chats** from the Executor and preferably fresh chats on each re-review. Reviewers inspect issue/spec, architecture, code quality, accessibility, security/privacy, migrations, failure paths, regressions and exact-SHA evidence; record PASS/findings on the PR. Reviewers do not implement or merge.
After a source change, invalidate affected SHA-bound verification/reviews and repeat those gates. Never reuse stale PASS or claim unrun checks passed.
Command Center has standing owner merge authorization only after verifying open/mergeable PR, unchanged reviewed head, valid required PASS or justified NOT REQUIRED, no blockers/unresolved threads, and any required runtime PASS. Explicit owner prohibition overrides; prefer squash merge.

## 8. Testing strategy
Vitest is the unit/integration runner for deterministic domain/validation logic, server actions/functions, Prisma/PostgreSQL rules, transactions/conflicts, and important route boundaries.
React Testing Library runs with Vitest for React component behavior; test user-observable semantics such as roles, labels, text, focus, and visible state rather than component internals.
Playwright is the E2E runner: use it only for critical browser journeys whose confidence cannot be obtained cheaply below the browser level.
Do not duplicate the same assertion at every test layer.
Choose **REQUIRED** local runtime acceptance when the issue/spec explicitly demands it or real-environment behavior cannot be established from automation (notably relevant auth, upload, permissions, delivery or browser/device risks). It must PASS before that PR merges.
When automated evidence is sufficient and there is no material real-environment gap, Command Center may mark per-PR manual runtime **NOT REQUIRED**, with a reason; if useful integrated journeys remain, record their owner, scope and target checkpoint on a parent/tracker. That milestone acceptance stays open until performed and is not an earlier PR's PASS. Never silently defer an existing REQUIRED gate: changing it requires an explicit issue/spec decision and fresh affected approvals.
For owner-executed runtime acceptance, a **separate normal ChatGPT chat** gives [one safe command at a time](qa-runtime-acceptance.md), checks observed output and records exact-head evidence. It **must not author automated tests** under this procedure. Defer production-only evidence to the final production phase.
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
A bounded feature is done when its accepted spec, required tests and required local acceptance pass, configuration/logging checks pass, review findings are resolved, and exact-head evidence is recorded. Separately tracked integrated-milestone acceptance remains open until actually performed.
Done does not mean every future architecture/runtime validation item is closed; only the issue's declared acceptance must be satisfied.
Any intentional deviation updates the authoritative spec/decision before or with the implementation PR.
No undocumented product behavior becomes precedent merely because code was merged.
