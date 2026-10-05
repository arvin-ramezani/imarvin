import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  CLIENT_ENV_ALLOWLIST,
  ServerConfigError,
  parseServerConfig,
} from "../lib/config/server";

describe("server config", () => {
  it("fails when required configuration is missing", () => {
    expect(() => parseServerConfig({})).toThrow(ServerConfigError);
    expect(() => parseServerConfig({})).toThrow("APP_ORIGIN");
  });

  it("fails when required configuration is invalid", () => {
    expect(() => parseServerConfig({ APP_ORIGIN: "not-a-url" })).toThrow(
      ServerConfigError,
    );
    expect(() => parseServerConfig({ APP_ORIGIN: "not-a-url" })).toThrow(
      "APP_ORIGIN",
    );
  });

  it("uses the documented default log level", () => {
    expect(
      parseServerConfig({ APP_ORIGIN: "http://localhost:3000" }),
    ).toEqual({
      APP_ORIGIN: "http://localhost:3000",
      LOG_LEVEL: "info",
    });
  });

  it("rejects unsupported log levels", () => {
    expect(() =>
      parseServerConfig({
        APP_ORIGIN: "http://localhost:3000",
        LOG_LEVEL: "verbose",
      }),
    ).toThrow("LOG_LEVEL");
  });

  it("keeps client-visible environment variables behind an explicit allowlist", () => {
    const config = parseServerConfig({
      APP_ORIGIN: "http://localhost:3000",
      NEXT_PUBLIC_UNAPPROVED: "should-not-cross-the-boundary",
    });

    expect(CLIENT_ENV_ALLOWLIST).toEqual([]);
    expect(config).not.toHaveProperty("NEXT_PUBLIC_UNAPPROVED");
  });
});
