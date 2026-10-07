import "server-only";

import { spawn } from "node:child_process";

import { getServerConfig } from "@/lib/config/server";


const DECODE_TIMEOUT_MS = 15_000;
const MAX_DECODER_DIAGNOSTIC_BYTES = 64 * 1024;

export class VideoDecodeFailureError extends Error {
  constructor() {
    super("Compressed media payload failed full decode");
    this.name = "VideoDecodeFailureError";
  }
}

export class VideoDecoderUnavailableError extends Error {
  constructor() {
    super("Local media decoder is unavailable");
    this.name = "VideoDecoderUnavailableError";
  }
}

// The structural parser has already limited dimensions, duration, stream
// count and 10 MiB input size. Decode every selected stream; a codec header
// and a plausible container alone cannot establish frame payload validity.
// Never permit URL protocols or shell input. No video is persisted/transcoded.
export async function assertDecodedVideo(
  bytes: Buffer,
  container: "mp4" | "webm",
): Promise<void> {
  const binary = getServerConfig().MEDIA_FFMPEG_PATH;
  const format = container === "mp4" ? "mov" : "matroska";
  const args = [
    "-hide_banner",
    "-nostdin",
    "-loglevel", "error",
    "-xerror",
    "-err_detect", "explode",
    "-max_alloc", "67108864",
    "-threads", "1",
    "-filter_threads", "1",
    "-protocol_whitelist", "pipe",
    "-f", format,
    "-i", "pipe:0",
    "-map", "0:v:0",
    "-map", "0:a:0?",
    "-f", "null",
    "-",
  ];

  await new Promise<void>((resolve, reject) => {
    let child: ReturnType<typeof spawn>;

    try {
      child = spawn(binary, args, {
        shell: false,
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
        env: { PATH: "/usr/bin:/bin", LC_ALL: "C" },
      });
    } catch {
      reject(new VideoDecoderUnavailableError());
      return;
    }

    let settled = false;
    let timedOut = false;
    let diagnostics = 0;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve();
    };

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, DECODE_TIMEOUT_MS);
    timer.unref();

    // FFmpeg's null muxer emits no media payload. Drain any unexpected output
    // and bound diagnostics so an invalid file cannot grow application memory.
    const account = (chunk: Buffer) => {
      diagnostics += chunk.length;
      if (diagnostics > MAX_DECODER_DIAGNOSTIC_BYTES) {
        child.kill("SIGKILL");
      }
    };

    child.stdout.on("data", account);
    child.stderr.on("data", account);
    // EPIPE is expected if FFmpeg rejects an invalid frame before consuming
    // all stdin bytes. The exit code decides whether decode succeeded.
    child.stdin.on("error", () => {});

    child.on("error", () => finish(new VideoDecoderUnavailableError()));
    child.on("close", (code) => {
      finish(
        !timedOut && diagnostics <= MAX_DECODER_DIAGNOSTIC_BYTES && code === 0
          ? undefined
          : new VideoDecodeFailureError(),
      );
    });

    child.stdin.end(bytes);
  });
}
