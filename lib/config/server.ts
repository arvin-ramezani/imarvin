import "server-only";

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

const serverConfigSchema = z.object({
  APP_ORIGIN: z.string().url(),
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
