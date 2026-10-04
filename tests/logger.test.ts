import { Writable } from "node:stream";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createLogger,
  REDACTED_VALUE,
} from "../lib/logging/logger";

function captureRecord(
  writeLog: (logger: ReturnType<typeof createLogger>) => void,
): Record<string, unknown> {
  const chunks: string[] = [];
  const destination = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(String(chunk));
      callback();
    },
  });
  const logger = createLogger({ destination, level: "info" });

  writeLog(logger);

  return JSON.parse(chunks.join("").trim()) as Record<string, unknown>;
}

describe("shared logger", () => {
  it("redacts representative sensitive fields", () => {
    const record = captureRecord((logger) => {
      logger.info(
        {
          headers: {
            authorization: "Bearer owner-token",
            cookie: "session=private",
          },
          password: "owner-password",
          auth: {
            token: "auth-token",
            authSecret: "auth-secret",
            databaseUrl: "postgresql://owner:secret@localhost/imarvin",
          },
          privateUploadMetadata: {
            storagePath: "/var/lib/imarvin/uploads/private-file",
          },
          safeField: "visible",
        },
        "redaction-test",
      );
    });

    expect(record).toMatchObject({
      headers: {
        authorization: REDACTED_VALUE,
        cookie: REDACTED_VALUE,
      },
      password: REDACTED_VALUE,
      auth: {
        token: REDACTED_VALUE,
        authSecret: REDACTED_VALUE,
        databaseUrl: REDACTED_VALUE,
      },
      privateUploadMetadata: REDACTED_VALUE,
      safeField: "visible",
    });
  });
});
