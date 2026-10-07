import { deflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, payload: Buffer): Buffer {
  const typeBytes = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(payload.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBytes, payload])));

  return Buffer.concat([length, typeBytes, payload, checksum]);
}

// Deliberately CRC-correct, structurally well-formed compressed pixels: the
// missing PLTE makes the indexed PNG invalid independently of CRC and IDAT.
export function indexedPngFixture(withPalette: boolean): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(1, 0);
  header.writeUInt32BE(1, 4);
  header[8] = 8;
  header[9] = 3; // indexed-color PNG
  const parts = [PNG_SIGNATURE, chunk("IHDR", header)];

  if (withPalette) {
    parts.push(chunk("PLTE", Buffer.from([255, 0, 0])));
  }

  parts.push(chunk("IDAT", deflateSync(Buffer.from([0, 0]))));
  parts.push(chunk("IEND", Buffer.alloc(0)));
  return Buffer.concat(parts);
}
