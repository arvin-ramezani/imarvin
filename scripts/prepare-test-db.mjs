import { spawnSync } from "node:child_process";

import "./load-test-env.mjs";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("npm_execpath is unavailable; run this command through npm.");
}

for (const script of [
  "db:generate",
  "db:validate",
  "db:migrate:deploy",
  "db:migrate:status",
]) {
  const result = spawnSync(process.execPath, [npmCli, "run", script], {
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
