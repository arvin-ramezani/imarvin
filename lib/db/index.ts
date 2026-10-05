import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

import { getServerConfig } from "../config/server";

type DatabaseGlobal = typeof globalThis & {
  __imarvinDatabase?: PrismaClient;
};

const databaseGlobal = globalThis as DatabaseGlobal;

function createDatabaseClient(): PrismaClient {
  const { DATABASE_URL } = getServerConfig();
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });

  return new PrismaClient({ adapter });
}

export const db =
  databaseGlobal.__imarvinDatabase ?? createDatabaseClient();

databaseGlobal.__imarvinDatabase = db;

export type DatabaseHealth = "healthy" | "unhealthy";

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  try {
    await db.$queryRaw`SELECT 1`;

    return "healthy";
  } catch {
    return "unhealthy";
  }
}
