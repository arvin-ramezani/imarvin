import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  CLIENT_ENV_ALLOWLIST,
  ServerConfigError,
  parseServerConfig,
} from "../lib/config/server";

const requiredConfig = {
  APP_ORIGIN: "http://localhost:3000",
  AUTH_SECRET: "test-auth-secret-at-least-32-characters",
  DATABASE_URL: "postgresql://imarvin:imarvin@localhost:5432/imarvin",
  MEDIA_STORAGE_ROOT: path.join(tmpdir(), "imarvin-test-media"),
} as const;

describe("server config", () => {
  it("fails when required configuration is missing", () => {
    expect(() => parseServerConfig({})).toThrow(ServerConfigError);
    expect(() => parseServerConfig({})).toThrow("APP_ORIGIN");
    expect(() => parseServerConfig({})).toThrow("AUTH_SECRET");
    expect(() => parseServerConfig({})).toThrow("DATABASE_URL");
    expect(() => parseServerConfig({})).toThrow("MEDIA_STORAGE_ROOT");
  });

  it("fails when required configuration is invalid", () => {
    expect(() =>
      parseServerConfig({
        ...requiredConfig,
        APP_ORIGIN: "not-a-url",
      }),
    ).toThrow("APP_ORIGIN");
  });

  it("rejects short auth secrets", () => {
    expect(() =>
      parseServerConfig({
        ...requiredConfig,
        AUTH_SECRET: "too-short",
      }),
    ).toThrow("AUTH_SECRET");
  });

  it("rejects non-PostgreSQL database URLs", () => {
    expect(() =>
      parseServerConfig({
        ...requiredConfig,
        DATABASE_URL: "https://example.com/database",
      }),
    ).toThrow("DATABASE_URL");
  });

  it("fails closed for relative, deployment, and public media roots", () => {
    for (const root of [
      ".tmp/test-media",
      process.cwd(),
      path.join(process.cwd(), "public", "drafts"),
      path.join(process.cwd(), ".next", "uploads"),
      path.join(tmpdir(), "public_html", "uploads"),
    ]) {
      expect(() => parseServerConfig({
        ...requiredConfig,
        MEDIA_STORAGE_ROOT: root,
      })).toThrow("MEDIA_STORAGE_ROOT");
    }
  });

  it("rejects an external symlink ancestor pointing into public/", () => {
    const temp = mkdtempSync(path.join(tmpdir(), "imarvin-test-storage-"));
    try {
      const alias = path.join(temp, "alias");
      symlinkSync(process.cwd(), alias, "dir");
      expect(() => parseServerConfig({
        ...requiredConfig,
        MEDIA_STORAGE_ROOT: path.join(alias, "private"),
      })).toThrow("MEDIA_STORAGE_ROOT");
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  it("uses the documented default log level", () => {
    expect(parseServerConfig(requiredConfig)).toEqual({
      ...requiredConfig,
      MEDIA_FFMPEG_PATH: "/usr/bin/ffmpeg",
      LOG_LEVEL: "info",
    });
  });

  it("rejects relative or empty local media decoder executable paths", () => {
    for (const invalid of ["ffmpeg", "./ffmpeg", ""]) {
      expect(() => parseServerConfig({
        ...requiredConfig,
        MEDIA_FFMPEG_PATH: invalid,
      })).toThrow("MEDIA_FFMPEG_PATH");
    }
  });

  it("rejects unsupported log levels", () => {
    expect(() =>
      parseServerConfig({
        ...requiredConfig,
        LOG_LEVEL: "verbose",
      }),
    ).toThrow("LOG_LEVEL");
  });

  it("keeps client-visible environment variables behind an explicit allowlist", () => {
    const config = parseServerConfig({
      ...requiredConfig,
      NEXT_PUBLIC_UNAPPROVED: "should-not-cross-the-boundary",
    });

    expect(CLIENT_ENV_ALLOWLIST).toEqual([]);
    expect(config).not.toHaveProperty("NEXT_PUBLIC_UNAPPROVED");
  });
});
