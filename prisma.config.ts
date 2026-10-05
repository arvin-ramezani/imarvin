import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma CLI tooling resolves this variable here; application runtime
    // reads the same value only through lib/config/server.ts.
    url: env("DATABASE_URL"),
  },
});
