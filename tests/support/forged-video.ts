import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getServerConfig } from "../../lib/config/server";

// Test-only synthetic capture: generate *valid decodable* H.264 once per
// fixture, then forge only the avc1 sample-entry dimensions. No source asset,
// shipping binary, external media or production filesystem is involved.
export function forgedH264Dimensions(
  intrinsicWidth: number,
  intrinsicHeight: number,
  declaredWidth: number,
  declaredHeight: number,
): Buffer {
  const dir = mkdtempSync(join(tmpdir(), "imarvin-video-dimensions-"));
  try {
    const target = join(dir, "synthetic.mp4");
    const ffmpeg = getServerConfig().MEDIA_FFMPEG_PATH;
    const result = spawnSync(ffmpeg, [
      "-hide_banner", "-nostdin", "-loglevel", "error",
      "-f", "lavfi",
      "-i", `color=c=black:s=${intrinsicWidth}x${intrinsicHeight}:r=10:d=0.2`,
      "-frames:v", "2",
      "-pix_fmt", "yuv420p",
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-tune", "zerolatency",
      "-an",
      "-movflags", "+faststart",
      "-y", target,
    ], { timeout: 10_000, maxBuffer: 64 * 1024 });
    if (result.status !== 0) {
      throw new Error("Synthetic H.264 fixture encoder failed");
    }
    const bytes = readFileSync(target);
    const stsd = bytes.indexOf(Buffer.from("stsd"));
    const avc1 = bytes.indexOf(Buffer.from("avc1"), stsd);
    if (stsd < 0 || avc1 < stsd || avc1 + 32 > bytes.length) {
      throw new Error("Synthetic MP4 sample entry not found");
    }

    // avc1 is the four-byte sample-entry type; the width/height fields are
    // 24/26 bytes after its payloadStart (four bytes after this type).
    if (
      bytes.readUInt16BE(avc1 + 28) !== intrinsicWidth ||
      bytes.readUInt16BE(avc1 + 30) !== intrinsicHeight
    ) {
      throw new Error("Unexpected synthetic MP4 sample-entry layout");
    }
    bytes.writeUInt16BE(declaredWidth, avc1 + 28);
    bytes.writeUInt16BE(declaredHeight, avc1 + 30);
    return bytes;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
