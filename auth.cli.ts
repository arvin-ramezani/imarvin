import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "prisma/config";

import { PrismaClient } from "./generated/prisma/client";
import { ownerAuthCoreOptions } from "./lib/auth/options";

// Tooling-only Better Auth config for schema generation/checks.
// Runtime application code uses lib/auth/instance.ts and the central config boundary.
const toolingDatabase = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env("DATABASE_URL"),
  }),
});

export const auth = betterAuth(
  ownerAuthCoreOptions({
    database: prismaAdapter(toolingDatabase, {
      provider: "postgresql",
    }),
    baseURL: "http://localhost:3000",
    secret: "schema-tooling-secret-at-least-32-characters",
  }),
);
