import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const decoderTestConfig = vi.hoisted(() => ({ path: "/usr/bin/ffmpeg" }));
vi.mock("../lib/config/server", () => ({
  getServerConfig: () => ({ MEDIA_FFMPEG_PATH: decoderTestConfig.path }),
}));

import {
  MEDIA_FILE_LIMIT,
  MediaValidationError,
  validateMediaFile,
  parseMp4,
  parseWebm,
} from "../features/work/media-validation";
import {
  MediaRangeNotSatisfiableError,
  parseSingleByteRange,
} from "../features/work/media-http";
import { indexedPngFixture, MP4, WEBM } from "./support/media-fixtures";
import { corruptH264Frame, corruptVp9Frame } from "./support/corrupt-video";
import { VideoDecoderUnavailableError } from "../features/work/video-decoder";

const PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==";
const JPEG =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAACAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDi6KKK+ZP3E//Z";
const WEBP =
  "UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoCAAIAAUAmJaACdLoB+AADsAD+8ut//NgVzXPv9//S4P0uD9Lg/9KQAAA=";



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

  it("rejects over-limit files and disallowed SVG before content can become Ready", async () => {
    const tooLarge = new File(
      [new Uint8Array(MEDIA_FILE_LIMIT + 1)],
      "huge.png",
      { type: "image/png" },
    );

    await expect(validateMediaFile(tooLarge)).rejects.toMatchObject({
      code: "FILE_TOO_LARGE",
    });

    const svg = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg"></svg>'],
      "capture.svg",
      { type: "image/svg+xml" },
    );

    await expect(validateMediaFile(svg)).rejects.toMatchObject({
      code: "UNSUPPORTED_TYPE",
    });
  });

  it("rejects extension/type mismatch and malformed image bytes", async () => {
    await expect(
      validateMediaFile(mediaFile(PNG, "capture.jpg", "image/png")),
    ).rejects.toMatchObject({
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

  it("fully decodes indexed PNG pixels and rejects missing required palette despite valid CRC", async () => {
    const valid = await validateMediaFile(
      new File([Uint8Array.from(indexedPngFixture(true))], "indexed.png", { type: "image/png" }),
    );
    expect(valid.metadata).toMatchObject({
      mediaType: "IMAGE",
      width: 1,
      height: 1,
    });

    await expect(
      validateMediaFile(
        new File([Uint8Array.from(indexedPngFixture(false))], "bad-indexed.png", {
          type: "image/png",
        }),
      ),
    ).rejects.toMatchObject({ code: "MALFORMED_CONTENT" });
  });

  it("rejects header-only and corrupted JPEG/WebP frames that have valid-looking headers", async () => {
    const originalJpeg = Buffer.from(JPEG, "base64");
    const sos = originalJpeg.indexOf(Buffer.from([0xff, 0xda]));
    expect(sos).toBeGreaterThan(0);

    // A nominal SOS marker with a two-byte length has no valid scan header.
    const headerOnlyJpeg = Buffer.from([
      0xff, 0xd8,
      0xff, 0xc0, 0x00, 0x0b, 0x08, 0, 1, 0, 1,
      1, 1, 0x11, 0,
      0xff, 0xda, 0x00, 0x02, 0x11, 0xff, 0xd9,
    ]);
    await expect(
      validateMediaFile(
        new File([Uint8Array.from(headerOnlyJpeg)], "fake.jpg", { type: "image/jpeg" }),
      ),
    ).rejects.toMatchObject({ code: "MALFORMED_CONTENT" });

    // The structural parser sees a complete segment; the pixel decoder must
    // reject this impossible Huffman code-length table.
    const dht = originalJpeg.indexOf(Buffer.from([0xff, 0xc4]));
    expect(dht).toBeGreaterThan(0);
    const corruptHuffman = Buffer.from(originalJpeg);
    corruptHuffman[dht + 5] = 0xff;
    await expect(
      validateMediaFile(
        new File([Uint8Array.from(corruptHuffman)], "bad-entropy.jpg", {
          type: "image/jpeg",
        }),
      ),
    ).rejects.toMatchObject({ code: "MALFORMED_CONTENT" });

    const originalWebp = Buffer.from(WEBP, "base64");
    const vp8 = originalWebp.indexOf(Buffer.from("VP8 "));
    expect(vp8).toBeGreaterThan(0);
    const headerOnlyWebp = Buffer.alloc(30);
    headerOnlyWebp.write("RIFF", 0);
    headerOnlyWebp.writeUInt32LE(22, 4);
    headerOnlyWebp.write("WEBP", 8);
    headerOnlyWebp.write("VP8 ", 12);
    headerOnlyWebp.writeUInt32LE(10, 16);
    originalWebp.copy(headerOnlyWebp, 20, vp8 + 8, vp8 + 18);
    await expect(
      validateMediaFile(
        new File([Uint8Array.from(headerOnlyWebp)], "fake.webp", { type: "image/webp" }),
      ),
    ).rejects.toMatchObject({ code: "MALFORMED_CONTENT" });

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
        new File([Uint8Array.from(mp4)], "recording.mp4", {
          type: "video/mp4",
        }),
      ),
    ).rejects.toMatchObject({
      code: "UNSUPPORTED_TYPE",
    });
    await expect(
      validateMediaFile(
        new File([Uint8Array.from(webm)], "recording.webm", {
          type: "video/webm",
        }),
      ),
    ).rejects.toMatchObject({
      code: "UNSUPPORTED_TYPE",
    });
  });

  it("rejects damaged compressed video payloads despite intact structure", async () => {
    const mp4Bytes = corruptH264Frame();
    const webmBytes = corruptVp9Frame();

    expect(() => parseMp4(mp4Bytes)).not.toThrow();
    expect(() => parseWebm(webmBytes)).not.toThrow();

    for (const [bytes, name, contentType] of [
      [mp4Bytes, "video.mp4", "video/mp4"],
      [webmBytes, "video.webm", "video/webm"],
    ] as const) {
      await expect(validateMediaFile(
        new File([Uint8Array.from(bytes)], name, { type: contentType }),
      )).rejects.toMatchObject({ code: "MALFORMED_CONTENT" });
    }
  });

  it("fails closed if the configured FFmpeg executable is missing", async () => {
    decoderTestConfig.path = "/path-that-does-not-exist/ffmpeg";
    try {
      await expect(validateMediaFile(
        mediaFile(MP4, "recording.mp4", "video/mp4"),
      )).rejects.toBeInstanceOf(VideoDecoderUnavailableError);
    } finally {
      decoderTestConfig.path = "/usr/bin/ffmpeg";
    }
  });

  it("rejects video containers with missing or corrupt media samples", async () => {
    const mp4 = Buffer.from(MP4, "base64");
    const mdatType = mp4.indexOf(Buffer.from("mdat", "ascii"));
    expect(mdatType).toBeGreaterThan(0);
    mp4.fill(0, mdatType + 4, mdatType + 8);

    await expect(
      validateMediaFile(
        new File([Uint8Array.from(mp4)], "recording.mp4", {
          type: "video/mp4",
        }),
      ),
    ).rejects.toMatchObject({ code: "MALFORMED_CONTENT" });

    const webm = Buffer.from(WEBM, "base64");
    const cluster = webm.indexOf(Buffer.from([0x1f, 0x43, 0xb6, 0x75]));
    expect(cluster).toBeGreaterThan(0);
    webm.fill(0, cluster + 4);

    await expect(
      validateMediaFile(
        new File([Uint8Array.from(webm)], "recording.webm", {
          type: "video/webm",
        }),
      ),
    ).rejects.toMatchObject({ code: "MALFORMED_CONTENT" });
  });

  it("parses complete WebVTT cue blocks and rejects non-cue content", async () => {
    const valid = [
      "WEBVTT",
      "",
      "first-cue",
      "00:00.000 --> 00:00.100 align:start position:10% size:75%",
      "Opening frame",
      "",
      "00:00.100 --> 00:00.180",
      "Second frame",
      "",
    ].join("\n");
    await expect(
      validateMediaFile(
        new File([valid], "captions.vtt", { type: "text/vtt" }),
        200,
      ),
    ).resolves.toMatchObject({
      metadata: { mediaType: "VTT" },
    });

    const invalid = [
      "WEBVTT\n\nNOTE arbitrary text\n",
      "WEBVTT\n\nthis is not a cue\n",
      "WEBVTT\n\n00:00.000 --> 00:00.100\nValid\n\nNOTE trailing metadata\n",
      "WEBVTT\n\n00:00.000 --> 00:00.100\nValid\n\ntrailing garbage\n",
      "WEBVTT\n\n00:00.000 --> 00:00.100 region:missing\nValid\n",
      "WEBVTT\n\n00:00.000 --> 00:00.100 align:start align:end\nValid\n",
      "WEBVTT\n\n00:00.000 --> 00:00.100\n\n",
      "WEBVTT\n\nSTYLE\n::cue { color: red; }\n",
    ];

    for (const text of invalid) {
      await expect(
        validateMediaFile(
          new File([text], "bad.vtt", { type: "text/vtt" }),
          200,
        ),
      ).rejects.toBeInstanceOf(MediaValidationError);
    }
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
