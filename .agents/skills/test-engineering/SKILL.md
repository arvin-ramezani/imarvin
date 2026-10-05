---
name: test-engineering
description: Design, implement, review, and maintain lean risk-based automated test suites for software projects. Use for test strategy, test planning, adding or fixing unit/integration/E2E tests, selecting test tools, reviewing test quality or coverage, reducing flaky or redundant tests, and deciding what should not be automated. Adapt to the repository's language, framework, architecture, tooling, and conventions; do not assume a specific stack.
---

# Test Engineering & Test Strategy

Build the smallest reasonable, maintainable suite that gives meaningful confidence against real regressions. Optimize for confidence, not test count or maximum coverage.

Keep asking: **What regression would this test catch?** If there is no meaningful answer, omit or remove the test.

## Operating principles

- Test observable behavior, contracts, and outcomes rather than private implementation details.
- Plan before implementing tests.
- Choose the cheapest test level that reliably detects the target regression.
- Prioritize by business impact, security sensitivity, financial impact, complexity, change frequency, dependency count, external interactions, and defect history.
- Prefer realistic integration tests over heavily mocked unit tests when behavior depends on application or infrastructure boundaries.
- Keep E2E coverage small and focused on critical real-user journeys.
- Avoid covering the same behavior at multiple levels unless each level protects a distinct risk.
- Treat coverage as a diagnostic signal, never as the definition of quality.
- Explicitly identify behavior that does not need automated testing.
- Reuse project tooling and conventions. Add dependencies only when justified.
- Treat tests as production code: readable, focused, deterministic, and easy to change.

## Select the workflow

For a trivial task—fixing one test, adding one meaningful assertion, covering a small pure function, or updating a test after a harmless refactor—use:

**Understand → Decide → Implement → Run → Review**

For medium or large work, use every phase below:

**Understand → Test Strategy → Test Suite Design → Test Plan → Implementation Plan → Implement → Execute → Review**

Do not collapse the planning phases merely to start coding sooner. If the user requests strategy or review only, stop at the requested phase. For medium or large implementation work, present the suite design for approval before coding unless the user explicitly requested an uninterrupted end-to-end implementation.

## 1. Understand

Inspect before proposing tests:

- requirements and acceptance criteria;
- current implementation and architecture;
- public contracts, important boundaries, and business behavior;
- security- and authorization-sensitive paths;
- existing tests, fixtures, factories, helpers, and conventions;
- language, framework, package manager, test runners, browser tools, database strategy, and CI configuration;
- recent defects or fragile areas when evidence is available.

Do not create tests in this phase. Separate known facts from assumptions and ask only for missing information that would materially change the strategy.

When requirements, documentation, and current behavior disagree, expose the conflict before designing tests. Do not silently turn the current implementation into the expected contract.

## 2. Create the test strategy

List only behaviors worth protecting. Rate each **Critical**, **High**, **Medium**, or **Low** and produce:

### Test Coverage Map

| Behavior | Risk | Business/technical impact | Test level | Why this level |
| --- | --- | --- | --- | --- |

Then add:

### Not Tested

List intentionally excluded behaviors and explain why, such as trivial pass-through code, framework behavior, generated code, cosmetic details without durable value, or behavior already protected at a more appropriate level.

Reject low-value cases. Do not use a coverage percentage or a desire for symmetry as a reason to add a test.

## 3. Design the suite

Specify proposed files and test descriptions only. Do not write setup, fixtures, mocks, assertions, or implementation code yet.

Group descriptions by the smallest useful set of test files and explain why each file exists:

```text
integration/auth/login.integration.spec.ts
  Exists to verify authentication against the real persistence/session boundary.

describe("login", () => {
  it("authenticates an active user with valid credentials");
  it("rejects an inactive account");
});
```

Use names that state observable behavior. Avoid names such as `should call validateUser` unless that interaction is itself a contract.

## 4. Write the test plan

For every proposed test, define:

- scenario;
- Given / When / Then;
- level and priority;
- dependencies and required fixtures/setup;
- important edge cases;
- the regression it catches;
- why that level is sufficient.

Explain why a scenario is not duplicated elsewhere. Call out critical behaviors that remain untested because the environment, requirements, or tooling blocks reliable coverage.

## 5. Write the implementation plan

Identify:

- files to create or modify;
- existing utilities to reuse;
- minimal fixtures, factories, mocks, and database setup;
- external-service strategy;
- environment requirements and test data isolation;
- focused test commands;
- CI cost, parallelism, and cleanup considerations.

Prefer the repository's infrastructure. Justify any new dependency, new abstraction, production-code seam, container, or service emulator before adding it. Never change production behavior merely to make a weak test easier to write.

## 6. Implement

Implement only the agreed suite:

- keep each test focused on one meaningful behavior;
- use behavior-oriented assertions;
- prefer realistic inputs and boundaries;
- mock only slow, nondeterministic, destructive, unavailable, or truly external dependencies;
- do not mock the unit whose behavior is under test;
- centralize setup only when reuse improves clarity;
- avoid broad snapshots and incidental assertions;
- preserve isolation, deterministic time/randomness, and cleanup;
- follow repository naming, placement, typing, linting, and formatting conventions.

Briefly identify a SOLID principle only when it materially explains a design decision. Do not add abstraction merely to claim SOLID compliance.

## 7. Execute and diagnose

Run the narrowest relevant command first, then broader checks when warranted. Never claim a command passed unless it was run successfully.

Classify failures before changing code:

- production defect;
- incorrect expectation;
- test infrastructure defect;
- environment/configuration problem;
- flaky or nondeterministic behavior.

Fix the responsible layer, rerun the focused suite, and then run any broader suite needed to detect side effects. Do not weaken a valid assertion or alter production behavior simply to obtain a green result.

## 8. Review test quality

Review the resulting suite as a whole and classify findings:

- **Keep** — valuable and correctly placed;
- **Improve** — valuable but brittle, unclear, slow, or over-mocked;
- **Move** — useful at a cheaper or more realistic level;
- **Merge** — duplicates another scenario;
- **Remove** — catches no meaningful regression or tests implementation/framework behavior;
- **Missing** — a material risk remains uncovered.

Check meaningful coverage, missing critical behavior, duplication, wrong levels, excessive E2E, brittle assertions, implementation coupling, unrealistic mocks, flakiness, slow setup, and unnecessary helpers. Actively remove or consolidate low-value tests when authorized to edit.

## Choose the test level

### Unit

Use for isolated deterministic logic: business rules, validation, calculations, transformations, parsers, state transitions, and decision logic. Avoid trivial wrappers, getters/setters without behavior, and framework/library behavior.

### Integration

Use for meaningful interactions: databases, repositories, module/service boundaries, API contracts, authentication and sessions, authorization, queues, external-service adapters, and framework/application boundaries. Prefer this level when mocks would reproduce much of the implementation or hide the actual risk.

### E2E

Use primarily for critical user journeys such as authentication/authorization, checkout/payment, and high-value workflows spanning layers. Do not create E2E cases for every validation rule, response variation, database edge case, UI state, or error condition.

## Select tools from evidence

Inspect the project before selecting a framework. Evaluate existing test runners, browser tools, utilities, CI, compatibility, speed, reliability, debugging, mocking, database support, and maintenance cost. Prefer current tooling when fit for purpose. If the user specifies a tool, verify its suitability instead of accepting or replacing it blindly.

Do not impose a universal directory layout. Follow established colocated tests or `unit` / `integration` / `e2e` separation as appropriate.

## Interpret coverage intelligently

Use statement, branch, function, and line coverage to locate risk, not manufacture tests.

Prioritize uncovered business rules, authentication, authorization, financial logic, complex transformations, security boundaries, and important error handling. Usually accept uncovered generated code, configuration, trivial wrappers, and pass-through functions unless they carry project-specific risk.

Recommend thresholds only when repository history, risk, or CI policy justifies them. Explain the rationale and expected maintenance cost; never impose a universal percentage.

## Prohibited test generation

Do not:

- generate a test for every function or uncovered line;
- produce large CRUD or E2E matrices without risk justification;
- duplicate unit cases as integration/E2E cases by default;
- assert private calls when an outcome is observable;
- overuse mocks, snapshots, fixtures, or abstractions;
- create unrealistic mocks that cannot fail like the real dependency;
- test framework or library behavior;
- introduce a new framework because it is popular;
- pursue 100% coverage blindly.

## Final report

After implementation, report concisely:

1. behaviors tested and levels used;
2. important behavior intentionally not tested;
3. files created or modified;
4. tools and commands actually used;
5. execution and coverage results, if measured;
6. removed, moved, merged, or consolidated tests;
7. remaining meaningful gaps or blockers;
8. next steps only when necessary.

Do not use raw test counts as the primary success metric.
