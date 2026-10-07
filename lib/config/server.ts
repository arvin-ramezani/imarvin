import "server-only";

import { realpathSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

export const CLIENT_ENV_ALLOWLIST = [] as const;

export const LOG_LEVELS = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

const PUBLIC_STORAGE_DIRECTORY_NAMES = new Set([
  "public", "public_html", "www", "wwwroot", "htdocs", "html", ".next",
]);

function pathContains(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith(".." + path.sep) &&
    relative !== ".." && !path.isAbsolute(relative));
}

// Check the nearest existing ancestor: the intended leaf need not exist yet,
// but an existing symlink must not redirect an otherwise safe-looking path.
function canonicalStoragePath(root: string): string | null {
  if (!path.isAbsolute(root)) return null;

  const absolute = path.resolve(root);
  let ancestor = absolute;

  for (;;) {
    try {
      return path.resolve(realpathSync(ancestor), path.relative(ancestor, absolute));
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
        return null;
      }

      const parent = path.dirname(ancestor);
      if (parent === ancestor) return null;
      ancestor = parent;
    }
  }
}

export function isPrivateMediaStorageRoot(configuredRoot: string): boolean {
  const canonical = canonicalStoragePath(configuredRoot);
  if (!canonical || canonical === path.parse(canonical).root) return false;

  let deploymentRoot: string;
  try {
    deploymentRoot = realpathSync(process.cwd());
  } catch {
    return false;
  }

  // Reject both deployment descendants and ancestor directories containing it.
  if (
    pathContains(deploymentRoot, canonical) ||
    pathContains(canonical, deploymentRoot)
  ) {
    return false;
  }

  // Also reject conventional web-server document roots outside this checkout.
  return !canonical
    .split(path.sep)
    .some((segment) => PUBLIC_STORAGE_DIRECTORY_NAMES.has(segment.toLowerCase()));
}

const serverConfigSchema = z.object({
  APP_ORIGIN: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  DATABASE_URL: z
    .string()
    .url()
    .regex(/^postgres(?:ql)?:\/\//, "must be a PostgreSQL URL"),
  MEDIA_STORAGE_ROOT: z.string().trim().min(1).refine(isPrivateMediaStorageRoot, {
    message: "must be an absolute private path outside the deployment or served tree",
  }),
  LOG_LEVEL: z.enum(LOG_LEVELS).default("info"),
});

export type ServerConfig = Readonly<z.output<typeof serverConfigSchema>>;

export class ServerConfigError extends Error {
  readonly fields: readonly string[];

  constructor(fields: readonly string[]) {
    super(`Invalid server configuration: ${fields.join(", ")}`);
    this.name = "ServerConfigError";
    this.fields = fields;
  }
}

export function parseServerConfig(
  environment: Readonly<Record<string, string | undefined>>,
): ServerConfig {
  const result = serverConfigSchema.safeParse(environment);

  if (!result.success) {
    const fields = [
      ...new Set(
        result.error.issues.map((issue) =>
          issue.path.length > 0 ? issue.path.map(String).join(".") : "environment",
        ),
      ),
    ].sort();

    throw new ServerConfigError(fields);
  }

  return Object.freeze(result.data);
}

let cachedConfig: ServerConfig | undefined;

export function getServerConfig(): ServerConfig {
  cachedConfig ??= parseServerConfig(process.env);

  return cachedConfig;
}
