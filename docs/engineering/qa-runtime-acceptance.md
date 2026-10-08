# Lean AI-Assisted QA and Runtime Acceptance

Status: proposed practice | Issue: [#49](https://github.com/arvin-ramezani/imarvin/issues/49) | Example: [PR #48](https://github.com/arvin-ramezani/imarvin/pull/48).
Authority: [spec-driven workflow](spec-driven-development.md) owns gates; the bounded issue/spec owns acceptance; the repo-local [test-engineering skill](../../.agents/skills/test-engineering/SKILL.md) owns risk-based test strategy.
Goal: use AI to guide consistent, evidence-backed QA without creating a large or redundant test suite.

## 1. Choose only meaningful scenarios

For each bounded change, identify what could regress and its impact before proposing tests:
1. **Positive:** one representative successful user/API operation.
2. **Negative/security:** an important denial, invalid input, or trust boundary **when relevant**.
3. **Boundary/recovery:** expiry, conflict, size, concurrency, retry, or failure **only if the change has that risk**.

Map every scenario to a specific issue/spec acceptance item or plausible regression; omit low-value cases.
Start with the cheapest reliable level: Vitest unit for pure rules, PostgreSQL/route integration for boundaries, and minimal Playwright for critical browser journeys.
Use **manual runtime acceptance only where a running app, browser, filesystem, proxy, or real HTTP behavior provides distinct evidence**; never replay an automated test checklist by default.
No required fixed case count, coverage percentage, or exhaustive per-endpoint matrix.

## 2. Execute safely and record observable evidence

Before running: confirm issue/spec, **exact PR head SHA**, prerequisites, and an isolated environment; do not use production or shared data for destructive testing.
For database/media tests, use the dedicated `imarvin_test` environment, test-only fixtures and a private media root outside the repository; fail closed on ambiguous targets.
For each selected case record **Given/setup → When/action → Then/expected → Observed → PASS/FAIL/BLOCKED/NOT RUN**, plus the command/browser evidence and cleanup.
Assess HTTP status/headers, persisted state, rendered behavior, file hashes, accessibility or logs only where these prove the requirement.
Distinguish **product defect**, **incorrect expectation**, **test fixture/setup issue**, and **environment limitation**; correct the responsible layer before retesting.
A PASS requires actual observed evidence; an unexecuted scenario stays NOT RUN. Never claim automated checks or separate reviews passed without their evidence.
Evidence belongs to the tested SHA; after source changes, rerun only affected required gates/cases.

## 3. AI role, gate boundary and stop rule

AI may select cases, provide one-at-a-time commands, compare expected/observed outputs and draft PR evidence; the human/test runner supplies real results.
This is **scenario-based QA/runtime integration and acceptance**, not a substitute for Test Engineering, Independent Review, Security Review, Design QA, or production acceptance.
Stop when the bounded issue's required risks and acceptance items have convincing evidence and no blocking failures; **do not overtest** by adding redundant layers or manual repetitions.
Escalate missing requirements to Command Center; do not turn a successful observation into a new product contract.

## 4. Minimal PR evidence format

- **Scope:** issue, PR, exact head SHA; which accepted behavior/risk was checked.
- **Environment:** runtime/tool versions, isolated data/media, synthetic fixtures; no secrets.
- **Cases:** expected vs observed result and PASS/FAIL/BLOCKED/NOT RUN, with relevant logs/links.
- **Limits:** not-tested surfaces, setup issues, and any remaining blocker.
- **Outcome:** runtime acceptance PASS/FAIL/NOT REQUIRED only when the issue's actual acceptance boundary is met.

Example: [#45 local runtime acceptance on PR #48](https://github.com/arvin-ramezani/imarvin/pull/48#issuecomment-6051824033) tested private/public delivery, valid/invalid requests, ranges, interrupted-upload retry and cleanup with actual outputs; these were selected for a security-sensitive media foundation, **not a checklist for ordinary UI/docs changes**.
