# AI-Guided Manual Runtime Acceptance

Status: proposed command-guidance practice | Issue: [#49](https://github.com/arvin-ramezani/imarvin/issues/49) | Example: [PR #48](https://github.com/arvin-ramezani/imarvin/pull/48).
Authority: [spec-driven workflow](spec-driven-development.md) owns gates; the approved issue/spec owns behavior and acceptance; the [test-engineering skill](../../.agents/skills/test-engineering/SKILL.md) governs automated test work **separately**.
Goal: when guiding runtime acceptance, AI supplies safe commands for a human to run, checks the reported output, and records concise evidence **without writing tests**.

## 1. Trigger and hard boundary

Use this guide **when AI is asked to provide commands for local runtime acceptance** of a bounded issue/PR, or Command Center routes that acceptance gate to command-guided execution.
This is **manual, scenario-based checking of a running application and real HTTP/browser/database/filesystem behavior**, not a request to create or implement tests.
**Do not write, generate, edit, or commit test code, test suites, persistent test scripts, mocks, fixtures, Playwright/Vitest cases, CI workflows, or application source** as part of this procedure.
Existing automated tests may be reviewed or run when required by the issue, but **authoring/maintaining them is a separate authorized implementation task**, not runtime acceptance.
Disposable files, database records, and test-only media needed to execute a manual command are allowed; they are not saved as reusable tests.

## 2. Select the minimum valuable runtime scenarios

Read the issue/spec's acceptance boundary, available deterministic evidence, and the exact PR head. Choose only manual checks that add distinct confidence:
- **Positive:** a representative successful real-user/API outcome.
- **Negative/security:** important denial, malformed input, or authorization boundary **only if relevant**.
- **Edge/recovery:** size, range, expiry, conflicts, retry, concurrency or cleanup **only if relevant**.

For each check, know the requirement/risk and why **running the app** reveals something existing automated evidence does not.
No fixed case count, blanket endpoint matrix, or manual replay of an entire unit/integration/E2E suite. Stop when the issue's required runtime acceptance is covered.

## 3. Guide one human-executed step at a time

1. Verify current issue/spec, PR **exact head SHA**, test prerequisites and an isolated environment; never target production/shared data for destructive checks.
2. Confirm the user's **actual shell** (for example PowerShell vs Ubuntu/WSL), working directory, and variable/session state. Do not switch checkouts or mix path/quote syntax silently.
3. Give **one next runnable command or tightly related command block** with a clear, numbered **Step**, brief purpose, and explicit **Expected** result; explain unusual HTTP behavior when useful.
4. Let the **user run it and paste the real output**. Compare observed vs expected before the next step; mark PASS, FAIL, BLOCKED or NOT RUN accurately. Never invent execution evidence.
5. On mismatch, identify **product defect vs incorrect expectation vs fixture/command/environment problem**; correct the test setup or escalate the defect. **Do not change implementation or write tests** to force a PASS.
6. Use minimal synthetic fixtures only in a positively identified disposable database/storage path; check targets before mutation. Clean up **only identified test records/files**, then verify cleanup.

Prefer small, non-destructive checks. Never include real credentials or secrets in shared commands, and do not assume the user's original working repository is the disposable acceptance checkout.

## 4. Record evidence, then stop

Record **issue, PR, tested SHA, environment, scenario/requirement, command/action, expected result, observed output, PASS/FAIL/BLOCKED/NOT RUN**, relevant response/status/hash/state evidence, cleanup, and any limits.
Tie evidence to the exact SHA; if source changes, identify affected checks to rerun. Do not claim other QA, Security Review, Independent Review, CI, or production gates from this manual procedure.
This is **AI-guided manual runtime acceptance**, not QA certification or an automated test-authoring workflow.

Example: [#45 acceptance on PR #48](https://github.com/arvin-ramezani/imarvin/pull/48#issuecomment-6051824033) verified real media upload/delivery, protection, byte ranges, interrupted retry, and cleanup using human-run commands. These higher-risk media checks **are not a mandatory checklist for other issues**.
