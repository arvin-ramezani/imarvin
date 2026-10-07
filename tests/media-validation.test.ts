import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  MediaValidationError,
  validateMediaFile,
} from "../features/work/media-validation";
import {
  MediaRangeNotSatisfiableError,
  parseSingleByteRange,
} from "../features/work/media-http";

const PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==";
const JPEG =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAACAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDi6KKK+ZP3E//Z";
const WEBP =
  "UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoCAAIAAUAmJaACdLoB+AADsAD+8ut//NgVzXPv9//S4P0uD9Lg/9KQAAA=";
const MP4 =
  "AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAOAbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAAMgAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAqt0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAMgAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAABAAAAAQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAADIAAAEAAABAAAAAAIjbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAA8AAAADABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABzm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAY5zdGJsAAAAvnN0c2QAAAAAAAAAAQAAAK5hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAABAAEABIAAAASAAAAAAAAAABFUxhdmM2MS4xOS4xMDEgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAANGF2Y0MBZAAK/+EAF2dkAAqs2V7ARAAAAwAEAAADAPA8SJZYAQAGaOvjyyLA/fj4AAAAABBwYXNwAAAAAQAAAAEAAAAUYnRydAAAAAAAAHngAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAGAAACAAAAABRzdHNzAAAAAAAAAAEAAAABAAAAQGN0dHMAAAAAAAAABgAAAAEAAAQAAAAAAQAACgAAAAABAAAEAAAAAAEAAAAAAAAAAQAAAgAAAAABAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAABgAAAAEAAAAsc3RzegAAAAAAAAAAAAAABgAAAsoAAAAMAAAADAAAAAwAAAAMAAAAEgAAABRzdGNvAAAAAAAAAAEAAAOwAAAAYXVkdGEAAABZbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAsaWxzdAAAACSpdG9vAAAAHGRhdGEAAAABAAAAAExhdmY2MS43LjEwMwAAAAhmcmVlAAADFG1kYXQAAAKuBgX//6rcRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTY0IHIzMTA4IDMxZTE5ZjkgLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDIzIC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MSByZWY9MyBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MjUgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIzLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAAUZYiEADP//t8y+BTNxYnOzIBcnpcAAAAIQZokbEK//sAAAAAIQZ5CeIV/xIEAAAAIAZ5hdEJ/x4AAAAAIAZ5jakJ/x4EAAAAOQZplSahBaJlMCE///sE=";
const WEBM =
  "GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAJdEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHWTbuMU6uEElTDZ1OsggEjTbuMU6uEHFO7a1OsggJH7AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmsCrXsYMPQkBNgIxMYXZmNjEuNy4xMDNXQYxMYXZmNjEuNy4xMDNEiYhAaQAAAAAAABZUrmvIrgEAAAAAAAA/14EBc8WI6ZVVjmMZGo2cgQAitZyDdW5kiIEAhoVWX1ZQOYOBASPjg4QB/KBV4JCwgRC6gRCagQJVsIRVuYEBElTDZ0B/c3OfY8CAZ8iZRaOHRU5DT0RFUkSHjExhdmY2MS43LjEwM3Nz2mPAi2PFiOmVVY5jGRqNZ8ilRaOHRU5DT0RFUkSHmExhdmM2MS4xOS4xMDEgbGlidnB4LXZwOWfIoUWjiERVUkFUSU9ORIeTMDA6MDA6MDAuMjAwMDAwMDAwAB9DtnVAmeeBAKOrgQAAgIJJg0IAAPAA9gA4JBwYSgAAMGAAABC///cdr////1/f////8irAAKOTgQAhAIYAQJKcAFAAAAMgAABCQKOTgQBDAIYAQJKcAE7gAAMgAABCQKOTgQBkAIYAQJKcAFAAAAMgAABCQKOTgQCFAIYAQJKcAE1AAAMgAABCQKOTgQCnAIYAQJKcAFAAAAMgAABCQBxTu2uRu4+zgQC3iveBAfGCAajwgQM=";

function mediaFile(base64: string, name: string, type: string): File {
  return new File([Buffer.from(base64, "base64")], name, { type });
}

function replaceNth(
  source: Buffer,
  find: string,
  replacement: string,
  occurrence: number,
): Buffer {
  const result = Buffer.from(source);
  const needle = Buffer.from(find);
  let offset = -1;
  let from = 0;

  for (let index = 0; index < occurrence; index += 1) {
    offset = result.indexOf(needle, from);
    if (offset < 0) throw new Error("Fixture marker not found");
    from = offset + needle.length;
  }

  result.write(replacement, offset, "ascii");
  return result;
}

describe("Work media validation", () => {
  it("accepts the approved image types and reports dimensions", async () => {
    for (const [fixture, name, type] of [
      [PNG, "capture.png", "image/png"],
      [JPEG, "capture.jpg", "image/jpeg"],
      [WEBP, "capture.webp", "image/webp"],
    ] as const) {
      const result = await validateMediaFile(mediaFile(fixture, name, type));

      expect(result.metadata).toMatchObject({
        mediaType: "IMAGE",
        width: 2,
        height: 2,
      });
    }
  });

  it("accepts H.264 MP4 and VP9 WebM within the pinned limits", async () => {
    const mp4 = await validateMediaFile(
      mediaFile(MP4, "recording.mp4", "video/mp4"),
    );
    const webm = await validateMediaFile(
      mediaFile(WEBM, "recording.webm", "video/webm"),
    );

    expect(mp4.metadata).toMatchObject({
      mediaType: "VIDEO",
      width: 16,
      height: 16,
      durationMs: 200,
    });
    expect(webm.metadata).toMatchObject({
      mediaType: "VIDEO",
      width: 16,
      height: 16,
      durationMs: 200,
    });
  });

  it("rejects extension/type mismatch and malformed image bytes", async () => {
    await expect(
      validateMediaFile(mediaFile(PNG, "capture.jpg", "image/png")),
    ).rejects.toMatchObject<Partial<MediaValidationError>>({
      code: "TYPE_MISMATCH",
    });

    const corrupt = Buffer.from(PNG, "base64");
    corrupt[corrupt.length - 8] ^= 0xff;

    await expect(
      validateMediaFile(
        new File([corrupt], "capture.png", { type: "image/png" }),
      ),
    ).rejects.toBeInstanceOf(MediaValidationError);
  });

  it("rejects unapproved video codecs even in an allowed container", async () => {
    const mp4 = replaceNth(Buffer.from(MP4, "base64"), "avc1", "hev1", 2);
    const webm = replaceNth(
      Buffer.from(WEBM, "base64"),
      "V_VP9",
      "V_AV1",
      1,
    );

    await expect(
      validateMediaFile(
        new File([mp4], "recording.mp4", { type: "video/mp4" }),
      ),
    ).rejects.toMatchObject<Partial<MediaValidationError>>({
      code: "UNSUPPORTED_TYPE",
    });
    await expect(
      validateMediaFile(
        new File([webm], "recording.webm", { type: "video/webm" }),
      ),
    ).rejects.toMatchObject<Partial<MediaValidationError>>({
      code: "UNSUPPORTED_TYPE",
    });
  });

  it("validates cue-only UTF-8 WebVTT against the recording duration", async () => {
    const valid = new File(
      [
        "WEBVTT\n\n00:00.000 --> 00:00.150\nVisible result\n",
      ],
      "captions.vtt",
      { type: "text/vtt" },
    );

    const accepted = await validateMediaFile(valid, 200);
    expect(accepted.metadata).toMatchObject({
      mediaType: "VTT",
      durationMs: null,
    });

    const tooLate = new File(
      ["WEBVTT\n\n00:00.000 --> 00:00.250\nToo late\n"],
      "captions.vtt",
      { type: "text/vtt" },
    );
    await expect(validateMediaFile(tooLate, 200)).rejects.toMatchObject<
      Partial<MediaValidationError>
    >({ code: "MALFORMED_CONTENT" });

    const styled = new File(
      ["WEBVTT\n\nSTYLE\n::cue { color: red; }\n"],
      "captions.vtt",
      { type: "text/vtt" },
    );
    await expect(validateMediaFile(styled, 200)).rejects.toMatchObject<
      Partial<MediaValidationError>
    >({ code: "UNSUPPORTED_TYPE" });
  });
});

describe("media byte ranges", () => {
  it("supports one closed, open, or suffix byte range", () => {
    expect(parseSingleByteRange("bytes=2-5", 10)).toEqual({
      start: 2,
      end: 5,
    });
    expect(parseSingleByteRange("bytes=7-", 10)).toEqual({
      start: 7,
      end: 9,
    });
    expect(parseSingleByteRange("bytes=-3", 10)).toEqual({
      start: 7,
      end: 9,
    });
  });

  it("rejects multiple or unsatisfiable ranges", () => {
    expect(() => parseSingleByteRange("bytes=0-1,4-5", 10)).toThrow(
      MediaRangeNotSatisfiableError,
    );
    expect(() => parseSingleByteRange("bytes=10-", 10)).toThrow(
      MediaRangeNotSatisfiableError,
    );
  });
});
