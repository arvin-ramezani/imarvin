# Database Testing Safety & Isolation

Use this reference whenever integration or E2E tests touch a persistent database.

## 1. Dedicated test environment

- Use a database created only for automated tests.
- If database-backed tests are required and no dedicated test database exists, create/provision one before running the tests; never substitute a development, staging, or production database.
- Use explicit test configuration such as `.env.test`, CI test secrets, or the repository's equivalent.
- Never run integration/E2E tests against development, staging, production, or a shared human-work database.
- Before any destructive operation, positively verify the configured target is test-only. Use a repository-owned guard such as an exact expected database name/host, a dedicated test flag plus test-name convention, or an isolated disposable container.
- If the target cannot be proven safe, abort.

## 2. Build schema from production migrations

- Apply the committed production migration history to the test database.
- Do not maintain a hand-written test-only schema that can drift from production.
- Recreate/reset disposable test databases when migration drift makes the starting state uncertain.
- Commands such as migration reset are allowed only after the test-database guard passes.

## 3. Start mutating tests from known state

Prefer setup that creates a clean state **before** each test/scenario. This prevents a failed prior cleanup from poisoning later tests.

For a database-mutating test:

1. verify the test database target;
2. clear or replace mutable state;
3. seed only the deterministic fixture data required by the scenario;
4. run the test;
5. optionally clean up after the test/suite for hygiene, but do not rely on teardown alone for correctness.

Suite-level reset is acceptable only when tests are read-only after setup or each test has an independently isolated namespace.

## 4. Choose the cheapest safe reset strategy

Use the simplest strategy that preserves isolation and matches how the application really talks to the database:

- **Transaction rollback:** fast for narrow integration tests only when the code under test can remain inside the same controllable transaction and does not independently commit.
- **Delete/truncate + reseed:** good for ordinary integration tests using a shared disposable test database. Respect foreign keys and reset identity/sequence state when test behavior depends on it.
- **Fresh schema/database/container:** strongest isolation for migrations, broad integration, E2E, destructive flows, or parallel workers; use when reset logic would be fragile.
- **Unique per-test namespace/data:** acceptable when full reset is expensive and the application supports strong isolation without cross-test queries.

True browser E2E tests usually cannot rely on wrapping the whole application in one test transaction, so prefer reset/reseed or isolated databases/schemas.

## 5. Seed discipline

- Seed the minimum data necessary for the current scenario.
- Prefer factories/builders or small explicit fixtures over one large shared mutable seed.
- Keep seeds deterministic: fixed logical values, controlled time/randomness, no production dumps, and no dependency on external mutable systems.
- Immutable reference data may be seeded once per suite only when tests cannot mutate it.
- Tests must not depend on execution order or residue from another test.

## 6. Parallel execution

- Do not run database-mutating tests concurrently against the same mutable rows/state.
- Give each parallel worker its own database, schema, tenant/namespace, or uniquely partitioned data.
- If reliable isolation is not available, serialize the database-backed tests.
- When debugging nondeterminism, rerun tests individually and in shuffled/order-varied runs to detect leaked state.

## 7. Integration and E2E expectations

Integration tests should use the real database engine when database behavior is part of the risk being tested.

E2E tests should control their database state outside the browser, then exercise user-visible behavior through the real app. Browser isolation alone does not isolate shared server-side database state.

Local and CI test setup should follow the same safety model: dedicated test config, migrations, deterministic reset/seed, and cleanup.

## 8. Verification evidence

When reporting database-backed test results, state:

- which test database/environment was used;
- how it was proven test-only;
- how migrations were applied;
- reset/seed strategy and frequency;
- whether database tests ran in parallel and how state was isolated;
- any remaining shared-state or cleanup risk.

Never report a database-backed suite as reliable when its starting state is uncontrolled.
