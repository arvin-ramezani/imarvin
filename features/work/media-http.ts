import "server-only";

import { getServerConfig } from "@/lib/config/server";

import {
  MEDIA_FORM_METADATA_LIMIT,
  MEDIA_REQUEST_LIMIT,
} from "./media-validation";

export class MediaRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "MediaRequestError";
    this.status = status;
  }
}

export class MediaRangeNotSatisfiableError extends Error {
  constructor() {
    super("Range not satisfiable");
    this.name = "MediaRangeNotSatisfiableError";
  }
}

export function requireSameOriginMediaMutation(request: Request): void {
  const expectedOrigin = new URL(getServerConfig().APP_ORIGIN).origin;
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (
    origin !== expectedOrigin ||
    fetchSite?.toLowerCase() === "cross-site"
  ) {
    throw new MediaRequestError(403, "Forbidden");
  }
}

async function readBoundedRequestBytes(request: Request): Promise<ArrayBuffer> {
  const rawLength = request.headers.get("content-length");

  if (rawLength !== null) {
    const contentLength = Number(rawLength);

    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      throw new MediaRequestError(400, "Invalid Content-Length");
    }

    if (contentLength > MEDIA_REQUEST_LIMIT) {
      throw new MediaRequestError(413, "Upload request is too large");
    }
  }

  if (!request.body) {
    throw new MediaRequestError(400, "Missing request body");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;
    if (!value) continue;

    total += value.byteLength;

    if (total > MEDIA_REQUEST_LIMIT) {
      await reader.cancel();
      throw new MediaRequestError(413, "Upload request is too large");
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(new ArrayBuffer(total));
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return bytes.buffer;
}

export async function readBoundedMediaFormData(
  request: Request,
): Promise<FormData> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    throw new MediaRequestError(400, "Expected multipart form data");
  }

  const bytes = await readBoundedRequestBytes(request);
  const copy = new Request(request.url, {
    method: "POST",
    headers: new Headers(request.headers),
    body: bytes,
  });

  let formData: FormData;

  try {
    formData = await copy.formData();
  } catch {
    throw new MediaRequestError(400, "Malformed multipart form data");
  }

  let metadataBytes = 0;
  let files = 0;

  for (const [, value] of formData.entries()) {
    if (typeof value === "string") {
      metadataBytes += Buffer.byteLength(value, "utf8");
    } else {
      files += 1;
    }
  }

  if (metadataBytes > MEDIA_FORM_METADATA_LIMIT) {
    throw new MediaRequestError(413, "Upload metadata is too large");
  }

  if (files !== 1) {
    throw new MediaRequestError(400, "Exactly one file is required");
  }

  return formData;
}

export async function parseSingleMediaUpload(request: Request): Promise<{
  file: File;
  recordingEvidenceId: string | null;
}> {
  const formData = await readBoundedMediaFormData(request);
  const fileValues = formData.getAll("file");

  if (
    fileValues.length !== 1 ||
    typeof fileValues[0] === "string" ||
    !(fileValues[0] instanceof File)
  ) {
    throw new MediaRequestError(400, "Exactly one file field is required");
  }

  const recordingValues = formData.getAll("recordingEvidenceId");

  if (recordingValues.length > 1) {
    throw new MediaRequestError(400, "Duplicate recording reference");
  }

  const recordingValue = recordingValues[0];
  if (
    recordingValue !== undefined &&
    typeof recordingValue !== "string"
  ) {
    throw new MediaRequestError(400, "Invalid recording reference");
  }

  for (const key of formData.keys()) {
    if (key !== "file" && key !== "recordingEvidenceId") {
      throw new MediaRequestError(400, "Unexpected upload field");
    }
  }

  return {
    file: fileValues[0],
    recordingEvidenceId:
      typeof recordingValue === "string" && recordingValue.trim()
        ? recordingValue.trim()
        : null,
  };
}

export function parseSingleByteRange(
  rangeHeader: string | null,
  size: number,
): { start: number; end: number } | null {
  if (!rangeHeader) return null;

  if (size <= 0 || !rangeHeader.startsWith("bytes=")) {
    throw new MediaRangeNotSatisfiableError();
  }

  const value = rangeHeader.slice("bytes=".length);

  if (value.includes(",")) {
    throw new MediaRangeNotSatisfiableError();
  }

  const match = /^(\d*)-(\d*)$/.exec(value.trim());

  if (!match) {
    throw new MediaRangeNotSatisfiableError();
  }

  const startText = match[1] ?? "";
  const endText = match[2] ?? "";

  if (!startText && !endText) {
    throw new MediaRangeNotSatisfiableError();
  }

  let start: number;
  let end: number;

  if (!startText) {
    const suffix = Number(endText);

    if (!Number.isSafeInteger(suffix) || suffix <= 0) {
      throw new MediaRangeNotSatisfiableError();
    }

    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(startText);

    if (!Number.isSafeInteger(start) || start < 0 || start >= size) {
      throw new MediaRangeNotSatisfiableError();
    }

    if (!endText) {
      end = size - 1;
    } else {
      end = Number(endText);

      if (!Number.isSafeInteger(end) || end < start) {
        throw new MediaRangeNotSatisfiableError();
      }

      end = Math.min(end, size - 1);
    }
  }

  return { start, end };
}
