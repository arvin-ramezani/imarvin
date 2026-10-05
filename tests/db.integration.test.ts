import { afterAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { checkDatabaseHealth, db } from "../lib/db";

afterAll(async () => {
  await db.$disconnect();
});

describe("PostgreSQL database boundary", () => {
  it("reaches the real PostgreSQL service", async () => {
    const rows = await db.$queryRaw<Array<{ value: number }>>`
      SELECT 1::int AS value
    `;

    expect(rows).toEqual([{ value: 1 }]);
  });

  it("reports healthy without exposing diagnostics", async () => {
    await expect(checkDatabaseHealth()).resolves.toBe("healthy");
  });

  it("reports only unhealthy when the database probe fails", async () => {
    const probe = vi
      .spyOn(db, "$queryRaw")
      .mockRejectedValueOnce(new Error("postgresql://secret@internal/database"));

    await expect(checkDatabaseHealth()).resolves.toBe("unhealthy");

    probe.mockRestore();
  });

  it("has the committed baseline migration applied", async () => {
    const rows = await db.$queryRaw<
      Array<{ migration_name: string; finished_at: Date | null }>
    >`
      SELECT "migration_name", "finished_at"
      FROM "_prisma_migrations"
      WHERE "migration_name" = '20261005000000_init'
    `;

    expect(rows).toHaveLength(1);
    expect(rows[0]?.finished_at).not.toBeNull();
  });
});
