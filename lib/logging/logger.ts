import "server-only";

import pino, {
  type DestinationStream,
  type Logger,
  type LoggerOptions,
} from "pino";

import { getServerConfig, type LogLevel } from "../config/server";

export const REDACTED_VALUE = "[REDACTED]";

export const LOG_REDACTION_PATHS = [
  "authorization",
  "cookie",
  "headers.authorization",
  "headers.cookie",
  "req.headers.authorization",
  "req.headers.cookie",
  "request.headers.authorization",
  "request.headers.cookie",
  "password",
  "*.password",
  "*.*.password",
  "token",
  "*.token",
  "*.*.token",
  "accessToken",
  "*.accessToken",
  "*.*.accessToken",
  "refreshToken",
  "*.refreshToken",
  "*.*.refreshToken",
  "databaseUrl",
  "*.databaseUrl",
  "*.*.databaseUrl",
  "DATABASE_URL",
  "*.DATABASE_URL",
  "*.*.DATABASE_URL",
  "authSecret",
  "*.authSecret",
  "*.*.authSecret",
  "AUTH_SECRET",
  "*.AUTH_SECRET",
  "*.*.AUTH_SECRET",
  "privateUploadMetadata",
  "*.privateUploadMetadata",
  "*.*.privateUploadMetadata",
  "privateUpload",
  "*.privateUpload",
  "*.*.privateUpload",
] as const;

type CreateLoggerOptions = {
  destination?: DestinationStream;
  level?: LogLevel;
};

export type LogFields = Record<string, unknown>;

export function createLogger({
  destination,
  level,
}: CreateLoggerOptions = {}): Logger {
  const options: LoggerOptions = {
    level: level ?? getServerConfig().LOG_LEVEL,
    redact: {
      paths: [...LOG_REDACTION_PATHS],
      censor: REDACTED_VALUE,
    },
  };

  return destination ? pino(options, destination) : pino(options);
}

let sharedLogger: Logger | undefined;

export function getLogger(): Logger {
  sharedLogger ??= createLogger();

  return sharedLogger;
}

export function getRequestLogger(requestId: string): Logger {
  const normalizedRequestId = requestId.trim();

  if (!normalizedRequestId) {
    throw new Error("requestId must not be empty");
  }

  return getLogger().child({ requestId: normalizedRequestId });
}

export function logEvent(
  level: LogLevel,
  event: string,
  fields: LogFields = {},
): void {
  const normalizedEvent = event.trim();

  if (!normalizedEvent) {
    throw new Error("event must not be empty");
  }

  const payload = { ...fields, event: normalizedEvent };
  const logger = getLogger();

  switch (level) {
    case "fatal":
      logger.fatal(payload, normalizedEvent);
      return;
    case "error":
      logger.error(payload, normalizedEvent);
      return;
    case "warn":
      logger.warn(payload, normalizedEvent);
      return;
    case "info":
      logger.info(payload, normalizedEvent);
      return;
    case "debug":
      logger.debug(payload, normalizedEvent);
      return;
    case "trace":
      logger.trace(payload, normalizedEvent);
  }
}
