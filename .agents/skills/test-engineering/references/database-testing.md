# Database Testing Safety & Isolation

Use this reference whenever integration or E2E tests touch a persistent application database or data store.

Here, **database** is vendor- and model-neutral: relational, document, key-value, graph, wide-column, embedded, managed/cloud, or another persistent store. Adapt the mechanics to the project's actual database; the isolation and safety rules do not change.

## 1. Dedicated test environment

- Use a test-only database environment or isolated test boundary appropriate to the engine.
- If none exists, create/provision a test instance, database, namespace, or equivalent before running database-backed tests; never substitute development, staging, production, or shared human-work data.
- Use explicit test configuration such as `.env.test`, CI test secrets, or the repository's equivalent.
- Before destructive reset/seed operations, positively verify the configured target is test-only using repository-owned guards such as expected identifiers/hosts, a test-mode flag plus naming convention, or a disposable isolated instance.
- If the target cannot be proven safe, abort.

## 2. Initialize from production-equivalent definitions

- Use the application's real database initialization/evolution path where applicable: migrations, schema definitions, indexes, collections, constraints, TTL/index policies, bootstrap scripts, or equivalent.
- Do not create a hand-written test-only data model that can drift from production behavior.
- For schema-flexible databases, still reproduce required indexes, constraints, collection/bucket/keyspace setup, and other production-relevant database configuration.
- Recreate/reset disposable test stores when their structural/configuration state is uncertain.
- Destructive reset commands are allowed only after the test-only target guard passes.

## 3. Start mutating tests from known state

Prefer setup that establishes a clean state **before** each test/scenario. This prevents failed cleanup from contaminating later tests.

For a database-mutating test:

1. verify the test-only target;
2. clear, replace, or isolate mutable state;
3. seed only deterministic fixture data required by the scenario;
4. run the test;
5. optionally clean up afterward for hygiene, but never rely on teardown alone for correctness.

Suite-level reset is acceptable only when tests are read-only after setup or every test has an independently isolated data namespace.

## 4. Choose the cheapest safe reset strategy

Use the simplest database-supported strategy that preserves isolation and matches how the application actually uses persistence:

- **Transaction/session rollback:** fast for narrow integration tests only when the database supports it and all code under test stays inside the controllable transaction/session.
- **Clear/delete/truncate/drop test-scoped data + reseed:** suitable for a shared disposable test store. Respect engine-specific constraints, indexes, generated IDs/counters, TTL behavior, and relationships.
- **Fresh isolated store:** create a new database, schema, namespace, collection set, container/emulator, or disposable service instance for migrations/evolution tests, broad integration, E2E, destructive flows, or parallel workers when reset logic would be fragile.
- **Unique per-test partition:** use a tenant, namespace, collection/key prefix, partition key, or other engine-supported boundary when full reset is expensive and cross-test queries cannot leak state.

Do not force transaction, schema, or truncate semantics onto a database that does not support them.

Browser E2E tests usually cannot wrap the whole application in one test transaction/session, so prefer reset/reseed or an isolated persistent-store boundary.

## 5. Seed discipline

- Seed the minimum data required for the current scenario.
- Prefer factories/builders or small explicit fixtures over one large shared mutable seed.
- Keep seeds deterministic: fixed logical values, controlled time/randomness, no production dumps, and no dependency on external mutable systems.
- Immutable reference data may be seeded once per suite only when tests cannot mutate it.
- Tests must not depend on execution order or residue from another test.

## 6. Parallel execution

- Do not run mutating tests concurrently against the same mutable records/keys/documents/graph state.
- Give each parallel worker an engine-appropriate isolated boundary: database, schema, namespace, tenant, collection/key prefix, partition, or disposable instance.
- If reliable isolation is unavailable, serialize the database-backed tests.
- When debugging nondeterminism, rerun tests individually and in varied order to detect leaked state.

## 7. Integration and E2E expectations

Integration tests should use the real database engine/service when database behavior is part of the risk. A faithful emulator may be acceptable only when its behavioral differences do not affect the contract being tested.

E2E tests should control database state outside the browser, then exercise user-visible behavior through the real app. Browser/process isolation alone does not isolate shared server-side persistent state.

Local and CI setup should follow the same safety model: explicit test configuration, production-equivalent database initialization, deterministic reset/seed, and isolation.

## 8. Verification evidence

When reporting database-backed test results, state:

- which test database/store environment was used;
- how it was proven test-only;
- how production-equivalent database definitions/configuration were applied;
- reset/seed strategy and frequency;
- whether mutating tests ran in parallel and how state was isolated;
- any remaining shared-state or cleanup risk.

Never report a database-backed suite as reliable when its starting state is uncontrolled.
