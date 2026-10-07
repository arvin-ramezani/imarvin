import { MP4, WEBM } from "./media-fixtures";

// Mutate compressed samples without changing MP4 box sizes, sample offsets,
// NAL lengths, NAL headers, or WebM EBML block boundaries.
export function corruptH264Frame(): Buffer {
  const bytes = Buffer.from(MP4, "base64");
  const stco = bytes.indexOf(Buffer.from("stco"));
  const stsz = bytes.indexOf(Buffer.from("stsz"));
  if (stco < 0 || stsz < 0) throw new Error("Invalid fixture tables");

  let offset = bytes.readUInt32BE(stco + 12);
  const count = bytes.readUInt32BE(stsz + 12);
  const fixedSize = bytes.readUInt32BE(stsz + 8);
  for (let i = 0; i < count; i++) {
    const length = fixedSize || bytes.readUInt32BE(stsz + 16 + i * 4);
    const end = offset + length;
    for (let cursor = offset; cursor + 5 < end;) {
      const size = bytes.readUInt32BE(cursor);
      const start = cursor + 4;
      if (size < 1 || start + size > end) break;
      const type = (bytes[start] ?? 0) & 0x1f;
      if ((type === 1 || type === 5) && size > 10) {
        bytes.fill(0xff, start + 1, start + size);
        return bytes;
      }
      cursor = start + size;
    }
    offset = end;
  }
  throw new Error("Video slice fixture unavailable");
}

function vintSize(bytes: Buffer, offset: number) {
  let mask = 128, length = 1;
  const first = bytes[offset] ?? 0;
  while (length < 9 && !(first & mask)) { mask >>= 1; length++; }
  if (length > 8) throw new Error("Invalid fixture size");
  let size = first & (mask - 1);
  for (let n = 1; n < length; n++) size = size * 256 + (bytes[offset+n] ?? 0);
  return { length, size };
}

export function corruptVp9Frame(): Buffer {
  const bytes = Buffer.from(WEBM, "base64");
  const cluster = bytes.indexOf(Buffer.from([31, 67, 182, 117]));
  if (cluster < 0) throw new Error("Cluster unavailable");
  const outer = vintSize(bytes, cluster + 4);
  const end = Math.min(bytes.length, cluster + 4 + outer.length + outer.size);
  for (let at = cluster + 4 + outer.length; at + 8 < end;) {
    const type = bytes[at];
    const inner = vintSize(bytes, at + 1);
    const payload = at + 1 + inner.length;
    const next = payload + inner.size;
    if (next > end) throw new Error("Invalid block bounds");
    if (type === 163 && inner.size > 7) {
      const start = payload + 4;
      if (((bytes[start] ?? 0) & 192) === 128) {
        bytes.fill(255, start + 1, next);
        return bytes;
      }
    }
    at = next;
  }
  throw new Error("Video block fixture unavailable");
}
