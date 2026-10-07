const TEST_DATABASE_NAME = "imarvin_test";

type TestDatabaseEnvironment = Readonly<{
  DATABASE_URL?: string;
  NODE_ENV?: string;
}>;

export function assertTestDatabaseTarget(
  environment: TestDatabaseEnvironment = process.env,
): void {
  if (environment.NODE_ENV !== "test") {
    throw new Error(
      "Refusing destructive test database operation outside NODE_ENV=test.",
    );
  }

  const databaseUrl = environment.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Refusing destructive test database operation without DATABASE_URL.",
    );
  }

  let parsed: URL;

  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error(
      "Refusing destructive test database operation with an invalid DATABASE_URL.",
    );
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new Error(
      "Refusing destructive test database operation on a non-PostgreSQL target.",
    );
  }

  const databaseName = decodeURIComponent(
    parsed.pathname.replace(/^\/+/, ""),
  );

  if (databaseName !== TEST_DATABASE_NAME) {
    throw new Error(
      `Refusing destructive test database operation: expected ${TEST_DATABASE_NAME}, received ${databaseName || "<empty>"}.`,
    );
  }
}

export async function resetTestDatabase(): Promise<void> {
  assertTestDatabaseTarget();

  const { db } = await import("../../lib/db");

  await db.$transaction([
    db.publishedStoryProblemFigure.deleteMany(),
    db.publishedEvidence.deleteMany(),
    db.storyProblemFigure.deleteMany(),
    db.evidence.deleteMany(),
    db.publishedStory.deleteMany(),
    db.mediaAsset.deleteMany(),
    db.story.deleteMany(),
    db.session.deleteMany(),
    db.account.deleteMany(),
    db.verification.deleteMany(),
    db.rateLimit.deleteMany(),
    db.user.deleteMany(),
  ]);
}
