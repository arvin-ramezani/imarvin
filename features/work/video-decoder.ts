import "server-only";

import { spawn } from "node:child_process";

import { getServerConfig } from "@/lib/config/server";

const DECODE_TIMEOUT_MS = 15_000;
const MAX_UNEXPECTED_DIAGNOSTIC_BYTES = 64 * 1024;
const MAX_SHOWINFO_BYTES = 8 * 1024 * 1024;
const MAX_LOG_LINE_BYTES = 8 * 1024;
const MAX_FRAMES = 180 * 60;
const MAX_VIDEO_WIDTH = 3840;
const MAX_VIDEO_HEIGHT = 2160;
const MAX_VIDEO_PIXELS = 8_294_400;

type VideoDecodeFailureCode = "MALFORMED_CONTENT" | "MEDIA_LIMIT_EXCEEDED";

export class VideoDecodeFailureError extends Error {
  constructor(readonly code: VideoDecodeFailureCode = "MALFORMED_CONTENT") {
    super("Compressed video content failed complete decode and dimension validation");
    this.name = "VideoDecodeFailureError";
  }
}

export class VideoDecoderUnavailableError extends Error {
  constructor() {
    super("Local media decoder is unavailable");
    this.name = "VideoDecoderUnavailableError";
  }
}

const SHOWINFO_PREFIX = /^\[Parsed_showinfo_\d+ @ 0x[0-9a-f]+\]/i;
// The actual decoded frame dimensions are emitted by showinfo's per-frame
// "n: ... s:WIDTHxHEIGHT" record, independent of the container's avc1 entry.
const FRAME_RECORD = /^\[Parsed_showinfo_\d+ @ 0x[0-9a-f]+\]\s+n:\s*(\d+)\s+pts:.*?\bs:(\d+)x(\d+)(?:\s|$)/i;

/** Incremental, bounded parser of real decoded-frame output from FFmpeg. */
export class DecodedFrameInspector {
  private pending = "";
  private showinfoBytes = 0;
  private otherBytes = 0;
  private frames = 0;

  constructor(
    private readonly expected: Readonly<{ width: number; height: number }>,
  ) {}

  private acceptLine(line: string): void {
    const size = Buffer.byteLength(line);
    if (size > MAX_LOG_LINE_BYTES) {
      throw new VideoDecodeFailureError("MEDIA_LIMIT_EXCEEDED");
    }

    if (!SHOWINFO_PREFIX.test(line)) {
      this.otherBytes += size;
      if (this.otherBytes > MAX_UNEXPECTED_DIAGNOSTIC_BYTES) {
        throw new VideoDecodeFailureError("MEDIA_LIMIT_EXCEEDED");
      }
      return;
    }

    this.showinfoBytes += size;
    if (this.showinfoBytes > MAX_SHOWINFO_BYTES) {
      throw new VideoDecodeFailureError("MEDIA_LIMIT_EXCEEDED");
    }

    // Non-frame showinfo lines include stream configuration, color and SEI
    // details. Only n: lines contain decoded frame dimensions.
    if (!/^\[Parsed_showinfo_\d+ @ 0x[0-9a-f]+\]\s+n:/i.test(line)) {
      return;
    }

    const match = FRAME_RECORD.exec(line);
    if (!match) throw new VideoDecodeFailureError();
    const index = Number(match[1]);
    const width = Number(match[2]);
    const height = Number(match[3]);

    if (
      !Number.isSafeInteger(index) ||
      index !== this.frames ||
      !Number.isSafeInteger(width) ||
      !Number.isSafeInteger(height) ||
      width < 1 ||
      height < 1
    ) {
      throw new VideoDecodeFailureError();
    }
    if (
      width > MAX_VIDEO_WIDTH ||
      height > MAX_VIDEO_HEIGHT ||
      width * height > MAX_VIDEO_PIXELS ||
      this.frames >= MAX_FRAMES
    ) {
      throw new VideoDecodeFailureError("MEDIA_LIMIT_EXCEEDED");
    }
    if (width !== this.expected.width || height !== this.expected.height) {
      throw new VideoDecodeFailureError();
    }
    this.frames++;
  }

  push(chunk: Buffer): void {
    this.pending += chunk.toString("utf8");
    let end: number;
    while ((end = this.pending.indexOf("\n")) !== -1) {
      const line = this.pending.slice(0, end).replace(/\r$/, "");
      this.pending = this.pending.slice(end + 1);
      this.acceptLine(line);
    }
    if (Buffer.byteLength(this.pending) > MAX_LOG_LINE_BYTES) {
      throw new VideoDecodeFailureError("MEDIA_LIMIT_EXCEEDED");
    }
  }

  finish(): void {
    if (this.pending) {
      this.acceptLine(this.pending.replace(/\r$/, ""));
      this.pending = "";
    }
    if (this.frames === 0) throw new VideoDecodeFailureError();
  }
}

// Structural validation has already bounded size, declared dimensions, codec,
// duration, fps and stream count. Full FFmpeg decode plus per-frame showinfo
// rejects forged MP4 sample-entry dimensions and changing video dimensions.
// Only bounded pipe input is allowed. No shell, external URLs or transcoding.
export async function assertDecodedVideo(
  bytes: Buffer,
  container: "mp4" | "webm",
  expected: Readonly<{ width: number; height: number }>,
): Promise<void> {
  const binary = getServerConfig().MEDIA_FFMPEG_PATH;
  const args = [
    "-hide_banner",
    "-nostdin",
    "-nostats",
    "-loglevel", "info",
    "-xerror",
    "-err_detect", "explode",
    "-max_alloc", "67108864",
    "-threads", "1",
    "-filter_threads", "1",
    "-protocol_whitelist", "pipe",
    "-f", container === "mp4" ? "mov" : "matroska",
    "-i", "pipe:0",
    "-map", "0:v:0",
    "-map", "0:a:0?",
    "-vf", "showinfo=checksum=0",
    "-f", "null",
    "-",
  ];

  await new Promise<void>((resolve, reject) => {
    let child: ReturnType<typeof spawn>;
    try {
      child = spawn(binary, args, {
        shell: false,
        stdio: "pipe",
        windowsHide: true,
        env: { NODE_ENV: "production", PATH: "/usr/bin:/bin", LC_ALL: "C" },
      });
    } catch {
      reject(new VideoDecoderUnavailableError());
      return;
    }

    const input = child.stdin;
    const output = child.stdout;
    const diagnostics = child.stderr;
    if (!input || !output || !diagnostics) {
      child.kill("SIGKILL");
      reject(new VideoDecoderUnavailableError());
      return;
    }

    const inspector = new DecodedFrameInspector(expected);
    let settled = false;
    let timedOut = false;
    let stdoutBytes = 0;
    let failure: Error | undefined;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve();
    };
    const abort = (error: Error) => {
      failure ??= error;
      child.kill("SIGKILL");
    };
    const timer = setTimeout(() => {
      timedOut = true;
      abort(new VideoDecodeFailureError("MEDIA_LIMIT_EXCEEDED"));
    }, DECODE_TIMEOUT_MS);
    timer.unref();

    output.on("data", (chunk: Buffer) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > MAX_UNEXPECTED_DIAGNOSTIC_BYTES) {
        abort(new VideoDecodeFailureError("MEDIA_LIMIT_EXCEEDED"));
      }
    });
    diagnostics.on("data", (chunk: Buffer) => {
      try {
        inspector.push(chunk);
      } catch (error) {
        abort(error instanceof VideoDecodeFailureError ? error : new VideoDecodeFailureError());
      }
    });
    // Early decoder rejection may close stdin before the 10 MiB input drains.
    input.on("error", () => {});
    child.on("error", () => finish(new VideoDecoderUnavailableError()));
    child.on("close", (code) => {
      if (failure) {
        finish(failure);
        return;
      }
      if (timedOut || code !== 0) {
        finish(new VideoDecodeFailureError());
        return;
      }
      try {
        inspector.finish();
        finish();
      } catch (error) {
        finish(error instanceof VideoDecodeFailureError ? error : new VideoDecodeFailureError());
      }
    });
    input.end(bytes);
  });
}
