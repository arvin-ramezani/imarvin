import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config } from "dotenv";

const TEST_DATABASE_NAME = "imarvin_test";
const testEnvPath = resolve(process.cwd(), ".env.test");

function getDatabaseName(databaseUrl) {
  let parsed;

  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error("Test DATABASE_URL must be a valid PostgreSQL URL.");
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new Error("Test DATABASE_URL must use PostgreSQL.");
  }

  return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
}

if (process.env.CI === "true") {
  for (const key of ["APP_ORIGIN", "AUTH_SECRET", "DATABASE_URL", "MEDIA_STORAGE_ROOT"]) {
    if (!process.env[key]) {
      throw new Error(`CI test environment is missing explicit ${key}.`);
    }
  }
} else {
  if (!existsSync(testEnvPath)) {
    throw new Error(
      "Missing .env.test. Copy .env.test.example to .env.test before running database-backed tests.",
    );
  }

  const result = config({
    path: testEnvPath,
    override: true,
  });

  if (result.error) {
    throw result.error;
  }
}

process.env.NODE_ENV = "test";

if (getDatabaseName(process.env.DATABASE_URL ?? "") !== TEST_DATABASE_NAME) {
  throw new Error(
    `Refusing database-backed tests: DATABASE_URL must target exactly ${TEST_DATABASE_NAME}.`,
  );
}
