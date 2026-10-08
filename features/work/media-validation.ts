import { inflateSync } from "node:zlib";
import path from "node:path";
import sharp from "sharp";

import { assertDecodedVideo, VideoDecodeFailureError } from "./video-decoder";

export const MEDIA_FILE_LIMIT = 10 * 1024 * 1024;
export const MEDIA_REQUEST_LIMIT = 11 * 1024 * 1024;
export const MEDIA_FORM_METADATA_LIMIT = 64 * 1024;
export const VTT_FILE_LIMIT = 256 * 1024;
export const MAX_IMAGE_AXIS = 8_192;
export const MAX_IMAGE_PIXELS = 40_000_000;
export const MAX_VIDEO_WIDTH = 3_840;
export const MAX_VIDEO_HEIGHT = 2_160;
export const MAX_VIDEO_PIXELS = 8_294_400;
export const MAX_VIDEO_FPS = 60;
export const MAX_VIDEO_DURATION_MS = 180_000;
export const MIN_VIDEO_DURATION_MS = 100;

export type ValidatedMedia = {
  mediaType: "IMAGE" | "VIDEO" | "VTT";
  contentType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  durationMs: number | null;
};

export class MediaValidationError extends Error {
  readonly code:
    | "EMPTY_FILE"
    | "FILE_TOO_LARGE"
    | "UNSUPPORTED_TYPE"
    | "TYPE_MISMATCH"
    | "MALFORMED_CONTENT"
    | "MEDIA_LIMIT_EXCEEDED"
    | "VTT_REQUIRES_RECORDING";

  constructor(
    code: MediaValidationError["code"],
    message = "Media validation failed",
  ) {
    super(message);
    this.name = "MediaValidationError";
    this.code = code;
  }
}

type PreliminaryMedia = {
  mediaType: ValidatedMedia["mediaType"];
  contentType: string;
  extension: string;
  originalFileName: string;
};

const ALLOWED_TYPES = new Map<
  string,
  { mediaType: ValidatedMedia["mediaType"]; extensions: readonly string[] }
>([
  ["image/jpeg", { mediaType: "IMAGE", extensions: [".jpg", ".jpeg"] }],
  ["image/png", { mediaType: "IMAGE", extensions: [".png"] }],
  ["image/webp", { mediaType: "IMAGE", extensions: [".webp"] }],
  ["video/mp4", { mediaType: "VIDEO", extensions: [".mp4"] }],
  ["video/webm", { mediaType: "VIDEO", extensions: [".webm"] }],
  ["text/vtt", { mediaType: "VTT", extensions: [".vtt"] }],
]);

export function normalizeUploadFileName(value: string): string {
  const basename = path.posix.basename(value.replaceAll("\\", "/"));
  const normalized = basename
    .replace(/[\u0000-\u001f\u007f]/g, "_")
    .replace(/\s+/g, " ")
    .trim();

  return (normalized || "upload").slice(0, 120);
}

export function preliminaryMediaCheck(file: File): PreliminaryMedia {
  if (file.size <= 0) {
    throw new MediaValidationError("EMPTY_FILE");
  }

  if (file.size > MEDIA_FILE_LIMIT) {
    throw new MediaValidationError("FILE_TOO_LARGE");
  }

  const allowed = ALLOWED_TYPES.get(file.type.toLowerCase());

  if (!allowed) {
    throw new MediaValidationError("UNSUPPORTED_TYPE");
  }

  const originalFileName = normalizeUploadFileName(file.name);
  const extension = path.posix.extname(originalFileName).toLowerCase();

  if (!allowed.extensions.includes(extension)) {
    throw new MediaValidationError("TYPE_MISMATCH");
  }

  return {
    mediaType: allowed.mediaType,
    contentType: file.type.toLowerCase(),
    extension,
    originalFileName,
  };
}

function assertImageLimits(width: number, height: number): void {
  if (
    width < 1 ||
    height < 1 ||
    width > MAX_IMAGE_AXIS ||
    height > MAX_IMAGE_AXIS ||
    width * height > MAX_IMAGE_PIXELS
  ) {
    throw new MediaValidationError("MEDIA_LIMIT_EXCEEDED");
  }
}

function assertVideoLimits(
  width: number,
  height: number,
  fps: number,
  durationMs: number,
): void {
  if (
    width < 1 ||
    height < 1 ||
    width > MAX_VIDEO_WIDTH ||
    height > MAX_VIDEO_HEIGHT ||
    width * height > MAX_VIDEO_PIXELS ||
    !Number.isFinite(fps) ||
    fps <= 0 ||
    fps > MAX_VIDEO_FPS ||
    !Number.isFinite(durationMs) ||
    durationMs < MIN_VIDEO_DURATION_MS ||
    durationMs > MAX_VIDEO_DURATION_MS
  ) {
    throw new MediaValidationError("MEDIA_LIMIT_EXCEEDED");
  }
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function parsePng(buffer: Buffer): { width: number; height: number } {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  if (buffer.length < 33 || !buffer.subarray(0, 8).equals(signature)) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = -1;
  let sawHeader = false;
  let sawEnd = false;
  let sawImageData = false;
  let paletteEntries = 0;
  const idat: Buffer[] = [];

  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const typeStart = offset + 4;
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const crcOffset = dataEnd;

    if (dataEnd + 4 > buffer.length) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    const type = buffer.toString("ascii", typeStart, typeStart + 4);
    const expectedCrc = buffer.readUInt32BE(crcOffset);
    const actualCrc = crc32(buffer.subarray(typeStart, dataEnd));

    if (actualCrc !== expectedCrc) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    if (type === "IHDR") {
      if (sawHeader || length !== 13 || offset !== 8) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }

      sawHeader = true;
      width = buffer.readUInt32BE(dataStart);
      height = buffer.readUInt32BE(dataStart + 4);
      bitDepth = buffer[dataStart + 8] ?? 0;
      colorType = buffer[dataStart + 9] ?? -1;
      const compression = buffer[dataStart + 10];
      const filter = buffer[dataStart + 11];
      const interlace = buffer[dataStart + 12];

      if (compression !== 0 || filter !== 0 || interlace !== 0) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
    } else if (type === "acTL" || type === "fcTL" || type === "fdAT") {
      throw new MediaValidationError("UNSUPPORTED_TYPE");
    } else if (type === "PLTE") {
      if (
        !sawHeader ||
        sawImageData ||
        paletteEntries !== 0 ||
        length === 0 ||
        length % 3 !== 0 ||
        length > 768
      ) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      paletteEntries = length / 3;
    } else if (type === "IDAT") {
      if (!sawHeader) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      sawImageData = true;
      idat.push(buffer.subarray(dataStart, dataEnd));
    } else if (type === "IEND") {
      if (length !== 0) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      sawEnd = true;
      offset = dataEnd + 4;
      break;
    }

    offset = dataEnd + 4;
  }

  if (!sawHeader || !sawEnd || idat.length === 0 || offset !== buffer.length) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  assertImageLimits(width, height);

  const channelsByColorType: Record<number, number> = {
    0: 1,
    2: 3,
    3: 1,
    4: 2,
    6: 4,
  };
  const allowedDepths: Record<number, readonly number[]> = {
    0: [1, 2, 4, 8, 16],
    2: [8, 16],
    3: [1, 2, 4, 8],
    4: [8, 16],
    6: [8, 16],
  };
  const channels = channelsByColorType[colorType];

  if (
    !channels ||
    !allowedDepths[colorType]?.includes(bitDepth) ||
    (colorType === 3 && (paletteEntries === 0 || paletteEntries > 2 ** bitDepth)) ||
    ((colorType === 0 || colorType === 4) && paletteEntries !== 0)
  ) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  let decoded: Buffer;

  try {
    decoded = inflateSync(Buffer.concat(idat), {
      maxOutputLength:
        height * (1 + Math.ceil((width * channels * bitDepth) / 8)),
    });
  } catch {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const rowBytes = Math.ceil((width * channels * bitDepth) / 8);
  const expectedLength = height * (rowBytes + 1);

  if (decoded.length !== expectedLength) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  for (let row = 0; row < height; row += 1) {
    if ((decoded[row * (rowBytes + 1)] ?? 255) > 4) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }
  }

  return { width, height };
}

const JPEG_SOF_MARKERS = new Set([0xc0, 0xc2]);
const JPEG_UNSUPPORTED_SOF = new Set([
  0xc1, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function parseJpeg(buffer: Buffer): { width: number; height: number } {
  if (
    buffer.length < 4 ||
    buffer[0] !== 0xff ||
    buffer[1] !== 0xd8 ||
    buffer.at(-2) !== 0xff ||
    buffer.at(-1) !== 0xd9
  ) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  let offset = 2;
  let width = 0;
  let height = 0;
  let sawScan = false;

  while (offset < buffer.length - 2) {
    if (buffer[offset] !== 0xff) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset] ?? -1;
    offset += 1;

    if (marker === 0xd9) break;
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) continue;

    if (offset + 2 > buffer.length) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    const length = buffer.readUInt16BE(offset);

    if (length < 2 || offset + length > buffer.length) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    if (JPEG_UNSUPPORTED_SOF.has(marker)) {
      throw new MediaValidationError("UNSUPPORTED_TYPE");
    }

    if (JPEG_SOF_MARKERS.has(marker)) {
      const components = buffer[offset + 7] ?? 0;
      if (components < 1 || components > 4 || length !== 8 + components * 3) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      height = buffer.readUInt16BE(offset + 3);
      width = buffer.readUInt16BE(offset + 5);
    }

    if (marker === 0xda) {
      const scanComponents = buffer[offset + 2] ?? 0;
      if (
        scanComponents < 1 ||
        scanComponents > 4 ||
        length !== 6 + scanComponents * 2 ||
        width === 0 ||
        height === 0
      ) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      sawScan = true;
      offset += length;

      while (offset < buffer.length - 1) {
        if (buffer[offset] !== 0xff) {
          offset += 1;
          continue;
        }

        const next = buffer[offset + 1];

        if (next === 0x00 || (next !== undefined && next >= 0xd0 && next <= 0xd7)) {
          offset += 2;
          continue;
        }

        break;
      }

      continue;
    }

    offset += length;
  }

  if (!sawScan || width === 0 || height === 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  assertImageLimits(width, height);
  return { width, height };
}

// Structural markers alone do not prove that compressed image pixels decode.
// Stats traverses the entire decoded image; metadata() only reads headers.
async function assertDecodedImage(
  bytes: Buffer,
  format: "jpeg" | "png" | "webp",
  width: number,
  height: number,
): Promise<void> {
  try {
    const image = sharp(bytes, {
      failOn: "warning",
      limitInputPixels: MAX_IMAGE_PIXELS,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (
      metadata.format !== format ||
      metadata.width !== width ||
      metadata.height !== height ||
      (metadata.pages ?? 1) !== 1
    ) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    // Force a full pixel decode, including the entropy/frame payload.
    await image.stats();
  } catch {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
}

function readUInt24LE(buffer: Buffer, offset: number): number {
  if (offset + 3 > buffer.length) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  return (
    (buffer[offset] ?? 0) |
    ((buffer[offset + 1] ?? 0) << 8) |
    ((buffer[offset + 2] ?? 0) << 16)
  );
}

function parseWebp(buffer: Buffer): { width: number; height: number } {
  if (
    buffer.length < 20 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP" ||
    buffer.readUInt32LE(4) + 8 !== buffer.length
  ) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  let offset = 12;
  let width = 0;
  let height = 0;
  let imageChunks = 0;

  while (offset + 8 <= buffer.length) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const payload = offset + 8;
    const end = payload + size;

    if (end > buffer.length) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    if (type === "ANIM" || type === "ANMF") {
      throw new MediaValidationError("UNSUPPORTED_TYPE");
    }

    if (type === "VP8X") {
      if (size < 10 || ((buffer[payload] ?? 0) & 0x02) !== 0) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
      width = readUInt24LE(buffer, payload + 4) + 1;
      height = readUInt24LE(buffer, payload + 7) + 1;
    } else if (type === "VP8 ") {
      imageChunks += 1;
      if (
        size < 10 ||
        buffer[payload + 3] !== 0x9d ||
        buffer[payload + 4] !== 0x01 ||
        buffer[payload + 5] !== 0x2a
      ) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      width = buffer.readUInt16LE(payload + 6) & 0x3fff;
      height = buffer.readUInt16LE(payload + 8) & 0x3fff;
    } else if (type === "VP8L") {
      imageChunks += 1;
      if (size < 5 || buffer[payload] !== 0x2f) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      const packed = buffer.readUInt32LE(payload + 1);
      width = (packed & 0x3fff) + 1;
      height = ((packed >>> 14) & 0x3fff) + 1;
    }

    offset = end + (size % 2);
  }

  if (offset !== buffer.length || imageChunks !== 1 || width === 0 || height === 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  assertImageLimits(width, height);
  return { width, height };
}

type Mp4Box = {
  type: string;
  start: number;
  payloadStart: number;
  end: number;
};

function mp4Boxes(buffer: Buffer, start: number, end: number): Mp4Box[] {
  const boxes: Mp4Box[] = [];
  let offset = start;

  while (offset < end) {
    if (offset + 8 > end) throw new MediaValidationError("MALFORMED_CONTENT");

    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    let headerSize = 8;

    if (size === 1) {
      if (offset + 16 > end) throw new MediaValidationError("MALFORMED_CONTENT");
      const large = buffer.readBigUInt64BE(offset + 8);
      if (large > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      size = Number(large);
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }

    if (size < headerSize || offset + size > end) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    boxes.push({
      type,
      start: offset,
      payloadStart: offset + headerSize,
      end: offset + size,
    });
    offset += size;
  }

  return boxes;
}

function childBox(
  buffer: Buffer,
  parent: Mp4Box,
  type: string,
): Mp4Box | undefined {
  return mp4Boxes(buffer, parent.payloadStart, parent.end).find(
    (box) => box.type === type,
  );
}

function parseMdhd(buffer: Buffer, box: Mp4Box): {
  timescale: number;
  durationSeconds: number;
} {
  const version = buffer[box.payloadStart];
  const start = box.payloadStart + 4;
  let timescale: number;
  let duration: number;

  if (version === 1) {
    if (start + 28 > box.end) throw new MediaValidationError("MALFORMED_CONTENT");
    timescale = buffer.readUInt32BE(start + 16);
    const raw = buffer.readBigUInt64BE(start + 20);
    if (raw > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new MediaValidationError("MEDIA_LIMIT_EXCEEDED");
    }
    duration = Number(raw);
  } else if (version === 0) {
    if (start + 16 > box.end) throw new MediaValidationError("MALFORMED_CONTENT");
    timescale = buffer.readUInt32BE(start + 8);
    duration = buffer.readUInt32BE(start + 12);
  } else {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  if (timescale <= 0) throw new MediaValidationError("MALFORMED_CONTENT");

  return { timescale, durationSeconds: duration / timescale };
}

function parseHandler(buffer: Buffer, box: Mp4Box): string {
  if (box.payloadStart + 12 > box.end) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
  return buffer.toString("ascii", box.payloadStart + 8, box.payloadStart + 12);
}

function parseSttsFps(
  buffer: Buffer,
  box: Mp4Box,
  timescale: number,
): number {
  let offset = box.payloadStart + 4;

  if (offset + 4 > box.end) throw new MediaValidationError("MALFORMED_CONTENT");
  const entries = buffer.readUInt32BE(offset);
  offset += 4;
  let samples = 0;
  let ticks = 0;

  for (let index = 0; index < entries; index += 1) {
    if (offset + 8 > box.end) throw new MediaValidationError("MALFORMED_CONTENT");
    const count = buffer.readUInt32BE(offset);
    const delta = buffer.readUInt32BE(offset + 4);
    samples += count;
    ticks += count * delta;
    offset += 8;
  }

  if (samples <= 0 || ticks <= 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  return samples / (ticks / timescale);
}


function validateMp4Samples(
  buffer: Buffer,
  stbl: Mp4Box,
  dataBoxes: Mp4Box[],
  isVideo: boolean,
  nalLengthSize = 4,
): void {
  const children = mp4Boxes(buffer, stbl.payloadStart, stbl.end);
  const stsz = children.find((box) => box.type === "stsz");
  const stsc = children.find((box) => box.type === "stsc");
  const stco = children.find((box) => box.type === "stco" || box.type === "co64");

  if (!stsz || !stsc || !stco || stsz.payloadStart + 12 > stsz.end) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const fixedSize = buffer.readUInt32BE(stsz.payloadStart + 4);
  const sampleCount = buffer.readUInt32BE(stsz.payloadStart + 8);
  if (sampleCount === 0 || sampleCount > buffer.length) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const sizes: number[] = [];
  if (fixedSize) {
    sizes.push(...Array.from({ length: sampleCount }, () => fixedSize));
  } else {
    if (stsz.payloadStart + 12 + sampleCount * 4 !== stsz.end) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }
    for (let i = 0; i < sampleCount; i += 1) {
      sizes.push(buffer.readUInt32BE(stsz.payloadStart + 12 + i * 4));
    }
  }

  if (sizes.some((size) => size <= 0)) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const chunkCount = buffer.readUInt32BE(stco.payloadStart + 4);
  const offsetWidth = stco.type === "stco" ? 4 : 8;
  if (
    chunkCount === 0 ||
    chunkCount > sampleCount ||
    stco.payloadStart + 8 + chunkCount * offsetWidth !== stco.end
  ) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const chunkOffsets: number[] = [];
  for (let i = 0; i < chunkCount; i += 1) {
    const offset = stco.payloadStart + 8 + i * offsetWidth;
    const value = offsetWidth === 4
      ? buffer.readUInt32BE(offset)
      : Number(buffer.readBigUInt64BE(offset));
    if (!Number.isSafeInteger(value)) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }
    chunkOffsets.push(value);
  }

  const mappingCount = buffer.readUInt32BE(stsc.payloadStart + 4);
  if (
    mappingCount === 0 ||
    mappingCount > chunkCount ||
    stsc.payloadStart + 8 + mappingCount * 12 !== stsc.end
  ) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const mapping: Array<{ firstChunk: number; samplesPerChunk: number }> = [];
  for (let i = 0; i < mappingCount; i += 1) {
    const offset = stsc.payloadStart + 8 + i * 12;
    const firstChunk = buffer.readUInt32BE(offset);
    const samplesPerChunk = buffer.readUInt32BE(offset + 4);
    const descriptionIndex = buffer.readUInt32BE(offset + 8);
    if (
      (i === 0 && firstChunk !== 1) ||
      firstChunk > chunkCount ||
      firstChunk <= (mapping.at(-1)?.firstChunk ?? 0) ||
      !samplesPerChunk ||
      descriptionIndex !== 1
    ) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }
    mapping.push({ firstChunk, samplesPerChunk });
  }

  let sampleIndex = 0;
  let currentMap = 0;
  let sawVideoNal = false;

  for (let chunk = 1; chunk <= chunkCount; chunk += 1) {
    if (mapping[currentMap + 1]?.firstChunk === chunk) currentMap += 1;
    let offset = chunkOffsets[chunk - 1] ?? -1;
    const count = mapping[currentMap]?.samplesPerChunk ?? 0;

    for (let i = 0; i < count; i += 1) {
      const size = sizes[sampleIndex++];
      if (!size || !dataBoxes.some((box) =>
        offset >= box.payloadStart && offset + size <= box.end
      )) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }

      if (isVideo) {
        let cursor = offset;
        let foundNal = false;
        while (cursor < offset + size) {
          if (cursor + nalLengthSize > offset + size) {
            throw new MediaValidationError("MALFORMED_CONTENT");
          }
          let nalSize = 0;
          for (let byte = 0; byte < nalLengthSize; byte += 1) {
            nalSize = nalSize * 256 + (buffer[cursor + byte] ?? 0);
          }
          cursor += nalLengthSize;
          if (nalSize === 0 || cursor + nalSize > offset + size) {
            throw new MediaValidationError("MALFORMED_CONTENT");
          }
          const header = buffer[cursor] ?? 0;
          const nalType = header & 0x1f;
          if ((header & 0x80) !== 0 || nalType === 0 || nalType > 12) {
            throw new MediaValidationError("MALFORMED_CONTENT");
          }
          if (nalType === 1 || nalType === 5) sawVideoNal = true;
          foundNal = true;
          cursor += nalSize;
        }
        if (!foundNal) throw new MediaValidationError("MALFORMED_CONTENT");
      } else if (buffer.subarray(offset, offset + size).every((b) => b === 0)) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }

      offset += size;
    }
  }

  if (sampleIndex !== sampleCount || (isVideo && !sawVideoNal)) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
}

function parseAacLc(buffer: Buffer, start: number, end: number): boolean {
  for (let offset = start; offset + 3 < end; offset += 1) {
    if (buffer[offset] !== 0x05) continue;

    let cursor = offset + 1;
    let length = 0;

    for (let index = 0; index < 4; index += 1) {
      if (cursor >= end) return false;
      const byte = buffer[cursor] ?? 0;
      cursor += 1;
      length = (length << 7) | (byte & 0x7f);
      if ((byte & 0x80) === 0) break;
    }

    if (length < 2 || cursor + length > end) return false;
    const first = buffer[cursor] ?? 0;
    const audioObjectType = first >>> 3;
    return audioObjectType === 2;
  }

  return false;
}

export function parseMp4(buffer: Buffer): {
  width: number;
  height: number;
  durationMs: number;
  fps: number;
} {
  const top = mp4Boxes(buffer, 0, buffer.length);
  const ftyp = top.find((box) => box.type === "ftyp");
  const moov = top.find((box) => box.type === "moov");
  const mdat = top.find((box) => box.type === "mdat");

  if (!ftyp || !moov || !mdat || ftyp.start !== 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const dataBoxes = top.filter((box) => box.type === "mdat" && box.end > box.payloadStart);
  const tracks = mp4Boxes(buffer, moov.payloadStart, moov.end).filter(
    (box) => box.type === "trak",
  );
  let video:
    | { width: number; height: number; durationMs: number; fps: number }
    | undefined;
  let audioTracks = 0;

  for (const track of tracks) {
    const mdia = childBox(buffer, track, "mdia");
    if (!mdia) throw new MediaValidationError("MALFORMED_CONTENT");
    const mdhd = childBox(buffer, mdia, "mdhd");
    const hdlr = childBox(buffer, mdia, "hdlr");
    const minf = childBox(buffer, mdia, "minf");
    if (!mdhd || !hdlr || !minf) throw new MediaValidationError("MALFORMED_CONTENT");
    const stbl = childBox(buffer, minf, "stbl");
    if (!stbl) throw new MediaValidationError("MALFORMED_CONTENT");
    const stsd = childBox(buffer, stbl, "stsd");
    const stts = childBox(buffer, stbl, "stts");
    if (!stsd || !stts) throw new MediaValidationError("MALFORMED_CONTENT");

    const handler = parseHandler(buffer, hdlr);
    const timing = parseMdhd(buffer, mdhd);
    const sampleEntriesStart = stsd.payloadStart + 8;
    if (sampleEntriesStart > stsd.end) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }
    const entryCount = buffer.readUInt32BE(stsd.payloadStart + 4);
    const entries = mp4Boxes(buffer, sampleEntriesStart, stsd.end);
    if (entryCount !== 1 || entries.length !== 1) {
      throw new MediaValidationError("UNSUPPORTED_TYPE");
    }

    const entry = entries[0];
    if (!entry) throw new MediaValidationError("MALFORMED_CONTENT");

    if (handler === "vide") {
      if (video || (entry.type !== "avc1" && entry.type !== "avc3")) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
      if (entry.payloadStart + 78 > entry.end) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      const width = buffer.readUInt16BE(entry.payloadStart + 24);
      const height = buffer.readUInt16BE(entry.payloadStart + 26);
      const codecChildren = mp4Boxes(
        buffer,
        entry.payloadStart + 78,
        entry.end,
      );
      const avcC = codecChildren.find((box) => box.type === "avcC");
      if (!avcC || avcC.payloadStart + 5 > avcC.end) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      const nalLengthSize = ((buffer[avcC.payloadStart + 4] ?? 0) & 0x03) + 1;
      if (nalLengthSize === 3) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
      validateMp4Samples(buffer, stbl, dataBoxes, true, nalLengthSize);
      video = {
        width,
        height,
        durationMs: Math.round(timing.durationSeconds * 1000),
        fps: parseSttsFps(buffer, stts, timing.timescale),
      };
    } else if (handler === "soun") {
      audioTracks += 1;
      if (
        audioTracks > 1 ||
        entry.type !== "mp4a" ||
        entry.payloadStart + 28 > entry.end
      ) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
      const channels = buffer.readUInt16BE(entry.payloadStart + 16);
      const sampleRate = buffer.readUInt32BE(entry.payloadStart + 24) / 65_536;
      if (
        channels < 1 ||
        channels > 2 ||
        sampleRate <= 0 ||
        sampleRate > 48_000 ||
        !parseAacLc(buffer, entry.payloadStart + 28, entry.end)
      ) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
      validateMp4Samples(buffer, stbl, dataBoxes, false);
    } else {
      throw new MediaValidationError("UNSUPPORTED_TYPE");
    }
  }

  if (!video) throw new MediaValidationError("MALFORMED_CONTENT");
  assertVideoLimits(video.width, video.height, video.fps, video.durationMs);
  return video;
}

type Vint = { value: number; length: number; unknown: boolean };

function readEbmlVint(
  buffer: Buffer,
  offset: number,
  stripMarker: boolean,
): Vint {
  const first = buffer[offset];
  if (first === undefined || first === 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  let mask = 0x80;
  let length = 1;
  while (length <= 8 && (first & mask) === 0) {
    mask >>= 1;
    length += 1;
  }
  if (length > 8 || offset + length > buffer.length) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  let value = stripMarker ? first & (mask - 1) : first;
  for (let index = 1; index < length; index += 1) {
    value = value * 256 + (buffer[offset + index] ?? 0);
  }

  let unknown = false;

  if (stripMarker) {
    const max = 2 ** (7 * length) - 1;
    unknown = value === max;
  }

  return { value, length, unknown };
}

type EbmlElement = {
  id: number;
  payloadStart: number;
  end: number;
};

function ebmlElements(
  buffer: Buffer,
  start: number,
  end: number,
): EbmlElement[] {
  const elements: EbmlElement[] = [];
  let offset = start;

  while (offset < end) {
    const id = readEbmlVint(buffer, offset, false);
    const size = readEbmlVint(buffer, offset + id.length, true);
    const payloadStart = offset + id.length + size.length;
    const elementEnd = size.unknown ? end : payloadStart + size.value;

    if (elementEnd > end) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    elements.push({ id: id.value, payloadStart, end: elementEnd });
    offset = elementEnd;
  }

  return elements;
}

function ebmlUInt(buffer: Buffer, element: EbmlElement): number {
  const size = element.end - element.payloadStart;
  if (size < 1 || size > 6) throw new MediaValidationError("MALFORMED_CONTENT");
  let value = 0;
  for (let offset = element.payloadStart; offset < element.end; offset += 1) {
    value = value * 256 + (buffer[offset] ?? 0);
  }
  return value;
}

function ebmlFloat(buffer: Buffer, element: EbmlElement): number {
  const size = element.end - element.payloadStart;
  if (size === 4) return buffer.readFloatBE(element.payloadStart);
  if (size === 8) return buffer.readDoubleBE(element.payloadStart);
  throw new MediaValidationError("MALFORMED_CONTENT");
}

function ebmlString(buffer: Buffer, element: EbmlElement): string {
  return buffer.toString("utf8", element.payloadStart, element.end);
}

function findEbml(
  elements: EbmlElement[],
  id: number,
): EbmlElement | undefined {
  return elements.find((element) => element.id === id);
}

function validateWebmBlocks(
  buffer: Buffer,
  clusters: EbmlElement[],
  videoTrackNumber: number,
  codec: string,
): void {
  let videoFrames = 0;

  for (const cluster of clusters) {
    const children = ebmlElements(buffer, cluster.payloadStart, cluster.end);

    for (const element of children) {
      const blocks = element.id === 0xa3
        ? [element]
        : element.id === 0xa0
          ? ebmlElements(buffer, element.payloadStart, element.end)
              .filter((child) => child.id === 0xa1)
          : [];

      for (const block of blocks) {
        const track = readEbmlVint(buffer, block.payloadStart, true);
        const headerEnd = block.payloadStart + track.length + 3;
        if (headerEnd >= block.end) {
          throw new MediaValidationError("MALFORMED_CONTENT");
        }

        const flags = buffer[headerEnd - 1] ?? 0;
        if ((flags & 0x06) !== 0) {
          throw new MediaValidationError("UNSUPPORTED_TYPE");
        }
        if (track.value !== videoTrackNumber) continue;

        const frame = buffer.subarray(headerEnd, block.end);
        if (frame.length < 2 || frame.every((byte) => byte === 0)) {
          throw new MediaValidationError("MALFORMED_CONTENT");
        }

        if (codec === "V_VP9" && ((frame[0] ?? 0) & 0xc0) !== 0x80) {
          throw new MediaValidationError("MALFORMED_CONTENT");
        }

        if (codec === "V_VP8") {
          if (frame.length < 3) {
            throw new MediaValidationError("MALFORMED_CONTENT");
          }
          const keyframe = ((frame[0] ?? 0) & 1) === 0;
          if (
            keyframe &&
            (frame.length < 10 ||
              frame[3] !== 0x9d ||
              frame[4] !== 0x01 ||
              frame[5] !== 0x2a)
          ) {
            throw new MediaValidationError("MALFORMED_CONTENT");
          }
        }
        videoFrames += 1;
      }
    }
  }

  if (videoFrames === 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
}

export function parseWebm(buffer: Buffer): {
  width: number;
  height: number;
  durationMs: number;
  fps: number;
} {
  const top = ebmlElements(buffer, 0, buffer.length);
  if (top[0]?.id !== 0x1a45dfa3) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
  const segment = findEbml(top, 0x18538067);
  if (!segment) throw new MediaValidationError("MALFORMED_CONTENT");
  const segmentChildren = ebmlElements(buffer, segment.payloadStart, segment.end);
  const info = findEbml(segmentChildren, 0x1549a966);
  const tracks = findEbml(segmentChildren, 0x1654ae6b);
  const clusters = segmentChildren.filter((item) => item.id === 0x1f43b675);
  if (!info || !tracks || clusters.length === 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const infoChildren = ebmlElements(buffer, info.payloadStart, info.end);
  const scaleElement = findEbml(infoChildren, 0x2ad7b1);
  const durationElement = findEbml(infoChildren, 0x4489);
  const scale = scaleElement ? ebmlUInt(buffer, scaleElement) : 1_000_000;
  if (!durationElement || scale <= 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
  const durationMs = Math.round(
    (ebmlFloat(buffer, durationElement) * scale) / 1_000_000,
  );

  const trackEntries = ebmlElements(
    buffer,
    tracks.payloadStart,
    tracks.end,
  ).filter((element) => element.id === 0xae);
  let video:
    | { width: number; height: number; fps: number }
    | undefined;
  let audioTracks = 0;
  let videoTrackNumber: number | null = null;
  let videoCodec: string | null = null;

  for (const entry of trackEntries) {
    const fields = ebmlElements(buffer, entry.payloadStart, entry.end);
    const typeElement = findEbml(fields, 0x83);
    const codecElement = findEbml(fields, 0x86);
    if (!typeElement || !codecElement) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    const type = ebmlUInt(buffer, typeElement);
    const codec = ebmlString(buffer, codecElement);

    if (type === 1) {
      if (video || (codec !== "V_VP8" && codec !== "V_VP9")) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
      const videoElement = findEbml(fields, 0xe0);
      if (!videoElement) throw new MediaValidationError("MALFORMED_CONTENT");
      const videoFields = ebmlElements(
        buffer,
        videoElement.payloadStart,
        videoElement.end,
      );
      const widthElement = findEbml(videoFields, 0xb0);
      const heightElement = findEbml(videoFields, 0xba);
      const fpsElement = findEbml(videoFields, 0x2383e3);
      const defaultDurationElement = findEbml(fields, 0x23e383);
      if (!widthElement || !heightElement) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }

      const fps = fpsElement
        ? ebmlFloat(buffer, fpsElement)
        : defaultDurationElement
          ? 1_000_000_000 / ebmlUInt(buffer, defaultDurationElement)
          : Number.NaN;

      const trackNumber = findEbml(fields, 0xd7);
      if (!trackNumber) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }
      videoTrackNumber = ebmlUInt(buffer, trackNumber);
      videoCodec = codec;
      video = {
        width: ebmlUInt(buffer, widthElement),
        height: ebmlUInt(buffer, heightElement),
        fps,
      };
    } else if (type === 2) {
      audioTracks += 1;
      if (
        audioTracks > 1 ||
        (codec !== "A_OPUS" && codec !== "A_VORBIS")
      ) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
      const audioElement = findEbml(fields, 0xe1);
      if (!audioElement) throw new MediaValidationError("MALFORMED_CONTENT");
      const audioFields = ebmlElements(
        buffer,
        audioElement.payloadStart,
        audioElement.end,
      );
      const rate = findEbml(audioFields, 0xb5);
      const channels = findEbml(audioFields, 0x9f);
      if (
        !rate ||
        !channels ||
        ebmlFloat(buffer, rate) > 48_000 ||
        ebmlUInt(buffer, channels) > 2
      ) {
        throw new MediaValidationError("UNSUPPORTED_TYPE");
      }
    } else {
      throw new MediaValidationError("UNSUPPORTED_TYPE");
    }
  }

  if (!video || videoTrackNumber === null || videoCodec === null) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
  validateWebmBlocks(buffer, clusters, videoTrackNumber, videoCodec);
  assertVideoLimits(video.width, video.height, video.fps, durationMs);
  return { ...video, durationMs };
}

function parseVttTimestamp(value: string): number | null {
  const match = /^(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})$/.exec(value);
  if (!match) return null;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const milliseconds = Number(match[4]);

  if (minutes > 59 || seconds > 59) return null;
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
}

function validCueSetting(key: string, value: string): boolean {
  if (key === "align") {
    return /^(start|center|end|left|right)$/.test(value);
  }

  if (key === "vertical") {
    return /^(rl|lr)$/.test(value);
  }

  if (key === "size" || key === "position" || key === "line") {
    const match = key === "line"
      ? /^(-?\d+(?:\.\d+)?%?)(?:,(start|center|end))?$/.exec(value)
      : key === "position"
        ? /^(\d+(?:\.\d+)?)%(?:,(line-left|line-right|center|start|end|auto))?$/.exec(value)
        : /^(\d+(?:\.\d+)?)%$/.exec(value);

    if (!match) return false;
    if (key === "line" && !match[1]?.endsWith("%")) {
      return /^-?\d+$/.test(match[1] ?? "");
    }

    const percentage = Number((match[1] ?? "").replace(/%$/, ""));
    return Number.isFinite(percentage) && percentage >= 0 && percentage <= 100;
  }

  return false;
}

function parseVtt(buffer: Buffer, recordingDurationMs: number | null): void {
  if (buffer.length > VTT_FILE_LIMIT) {
    throw new MediaValidationError("MEDIA_LIMIT_EXCEEDED");
  }

  if (recordingDurationMs === null) {
    throw new MediaValidationError("VTT_REQUIRES_RECORDING");
  }

  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  if (/[\u0000-\u0008\u000b-\u001f\u007f]/.test(text)) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  const lines = text.replace(/^\uFEFF/, "").split(/\r\n|\n/);
  if (
    !/^WEBVTT(?:[ \t].*)?$/.test(lines[0] ?? "") ||
    lines[1] !== "" ||
    lines.some((line) => line.includes("\r"))
  ) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }

  let cursor = 2;
  let cues = 0;
  const identifiers = new Set<string>();

  // Parse every nonempty block: ignoring an unrecognized line would allow
  // NOTE/STYLE/REGION or malformed content to pass as a valid caption file.
  while (cursor < lines.length) {
    while (cursor < lines.length && lines[cursor] === "") cursor += 1;
    if (cursor >= lines.length) break;

    const block: string[] = [];
    while (cursor < lines.length && lines[cursor] !== "") {
      block.push(lines[cursor] ?? "");
      cursor += 1;
    }

    const first = block[0] ?? "";
    if (/^(?:NOTE|STYLE|REGION)(?:[ \t]|$)/.test(first)) {
      throw new MediaValidationError("UNSUPPORTED_TYPE");
    }

    let timingIndex = 0;
    if (!first.includes("-->")) {
      if (
        block.length < 3 ||
        !first.trim() ||
        identifiers.has(first)
      ) {
        throw new MediaValidationError("MALFORMED_CONTENT");
      }

      identifiers.add(first);
      timingIndex = 1;
    }

    const timing = /^(\S+)[ \t]+-->[ \t]+(\S+)(?:[ \t]+(.+))?$/.exec(
      block[timingIndex] ?? "",
    );

    if (!timing || block.length <= timingIndex + 1) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    const start = parseVttTimestamp(timing[1] ?? "");
    const end = parseVttTimestamp(timing[2] ?? "");

    if (
      start === null ||
      end === null ||
      end <= start ||
      end > recordingDurationMs
    ) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    const settings = new Set<string>();
    const rawSettings = timing[3]?.trim();
    if (rawSettings) {
      for (const setting of rawSettings.split(/[ \t]+/)) {
        const separator = setting.indexOf(":");
        const key = setting.slice(0, separator);
        const value = setting.slice(separator + 1);

        if (
          separator <= 0 ||
          !value ||
          settings.has(key) ||
          !validCueSetting(key, value)
        ) {
          throw new MediaValidationError("MALFORMED_CONTENT");
        }

        settings.add(key);
      }
    }

    const payload = block.slice(timingIndex + 1);
    if (
      !payload.some((line) => line.trim().length > 0) ||
      payload.some((line) => line.includes("-->"))
    ) {
      throw new MediaValidationError("MALFORMED_CONTENT");
    }

    cues += 1;
    if (cues > 2_000) {
      throw new MediaValidationError("MEDIA_LIMIT_EXCEEDED");
    }
  }

  if (cues === 0) {
    throw new MediaValidationError("MALFORMED_CONTENT");
  }
}

export async function validateMediaBytes(
  file: File,
  bytes: Buffer,
  recordingDurationMs: number | null = null,
): Promise<{ metadata: ValidatedMedia; originalFileName: string }> {
  const preliminary = preliminaryMediaCheck(file);

  if (bytes.length !== file.size || bytes.length > MEDIA_FILE_LIMIT) {
    throw new MediaValidationError("FILE_TOO_LARGE");
  }

  let width: number | null = null;
  let height: number | null = null;
  let durationMs: number | null = null;

  if (preliminary.contentType === "image/png") {
    ({ width, height } = parsePng(bytes));
    await assertDecodedImage(bytes, "png", width, height);
  } else if (preliminary.contentType === "image/jpeg") {
    ({ width, height } = parseJpeg(bytes));
    await assertDecodedImage(bytes, "jpeg", width, height);
  } else if (preliminary.contentType === "image/webp") {
    ({ width, height } = parseWebp(bytes));
    await assertDecodedImage(bytes, "webp", width, height);
  } else if (preliminary.contentType === "video/mp4") {
    const video = parseMp4(bytes);
    width = video.width;
    height = video.height;
    durationMs = video.durationMs;
    try {
      await assertDecodedVideo(bytes, "mp4", { width: video.width, height: video.height });
    } catch (error) {
      if (!(error instanceof VideoDecodeFailureError)) throw error;
      throw new MediaValidationError(error.code);
    }
  } else if (preliminary.contentType === "video/webm") {
    const video = parseWebm(bytes);
    width = video.width;
    height = video.height;
    durationMs = video.durationMs;
    try {
      await assertDecodedVideo(bytes, "webm", { width: video.width, height: video.height });
    } catch (error) {
      if (!(error instanceof VideoDecodeFailureError)) throw error;
      throw new MediaValidationError(error.code);
    }
  } else if (preliminary.contentType === "text/vtt") {
    parseVtt(bytes, recordingDurationMs);
  } else {
    throw new MediaValidationError("UNSUPPORTED_TYPE");
  }

  return {
    metadata: {
      mediaType: preliminary.mediaType,
      contentType: preliminary.contentType,
      byteSize: bytes.length,
      width,
      height,
      durationMs,
    },
    originalFileName: preliminary.originalFileName,
  };
}

export async function validateMediaFile(
  file: File,
  recordingDurationMs: number | null = null,
): Promise<{ metadata: ValidatedMedia; bytes: Buffer; originalFileName: string }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const validated = await validateMediaBytes(file, bytes, recordingDurationMs);

  return { ...validated, bytes };
}
