import { describe, expect, it } from "vitest";

import { assertTestDatabaseTarget } from "./support/test-database";

describe("test database safety", () => {
  it("rejects a normal development database before destructive test cleanup", () => {
    expect(() =>
      assertTestDatabaseTarget({
        NODE_ENV: "test",
        DATABASE_URL: "postgresql://imarvin:imarvin@localhost:5432/imarvin",
      }),
    ).toThrow(/expected imarvin_test/);
  });

  it("accepts the dedicated test database only in test mode", () => {
    expect(() =>
      assertTestDatabaseTarget({
        NODE_ENV: "development",
        DATABASE_URL:
          "postgresql://imarvin:imarvin@localhost:5432/imarvin_test",
      }),
    ).toThrow(/NODE_ENV=test/);

    expect(() =>
      assertTestDatabaseTarget({
        NODE_ENV: "test",
        DATABASE_URL:
          "postgresql://imarvin:imarvin@localhost:5432/imarvin_test",
      }),
    ).not.toThrow();
  });
});
