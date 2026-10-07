import "server-only";

import { requireOwnerSession } from "@/lib/auth";
import { logEvent } from "@/lib/logging/logger";

import {
  MediaAssetNotFoundError,
  MediaAssetReferencedError,
  MediaStoryNotFoundError,
  assertMediaStoryExists,
  completeMediaUpload,
  createPendingMediaAsset,
  currentAssetOwnsGenerationKey,
  failMediaUpload,
  getMediaAssetForRetry,
  getOwnerReadyMediaAsset,
  getPublicReadyMediaAsset,
  getReadyRecordingDuration,
  listCurrentMediaStorageKeys,
  listFailedMediaGenerations,
  reconcileExpiredMediaUploads,
  removeUnreferencedMediaAsset,
  retryFailedMediaAsset,
  type UploadGeneration,
} from "./media-repository";
import {
  listMediaStorageFiles,
  promoteStagedMedia,
  readMediaBytes,
  removeMediaGenerationBytes,
  writeStagedMedia,
} from "./media-storage";
import {
  MediaValidationError,
  preliminaryMediaCheck,
  validateMediaBytes,
} from "./media-validation";
import { VideoDecoderUnavailableError } from "./video-decoder";
import {
  MediaRangeNotSatisfiableError,
  parseSingleByteRange,
} from "./media-http";

const ORPHAN_AGE_MS = 24 * 60 * 60 * 1000;

export class MediaUploadConflictError extends Error {
  constructor() {
    super("Media upload generation changed");
    this.name = "MediaUploadConflictError";
  }
}

export class MediaStorageWriteError extends Error {
  constructor() {
    super("Media storage write failed");
    this.name = "MediaStorageWriteError";
  }
}

export async function requireOwnerMediaStory(
  requestHeaders: Headers,
  storyId: string,
): Promise<void> {
  await requireOwnerSession(requestHeaders);
  await assertMediaStoryExists(storyId);
}

async function cleanupCapturedGeneration(
  generation: Pick<UploadGeneration, "assetId" | "generation" | "storageKey">,
): Promise<void> {
  if (await currentAssetOwnsGenerationKey(generation)) {
    return;
  }

  try {
    await removeMediaGenerationBytes(generation.storageKey);
  } catch {
    logEvent("error", "media_cleanup_failed", {
      assetId: generation.assetId,
      uploadGeneration: generation.generation,
    });
  }
}

async function recordingDurationForUpload(
  storyId: string,
  mediaType: "IMAGE" | "VIDEO" | "VTT",
  recordingEvidenceId: string | null,
): Promise<number | null> {
  if (mediaType !== "VTT") {
    if (recordingEvidenceId) {
      throw new MediaValidationError("TYPE_MISMATCH");
    }

    return null;
  }

  if (!recordingEvidenceId) {
    throw new MediaValidationError("VTT_REQUIRES_RECORDING");
  }

  const duration = await getReadyRecordingDuration(
    storyId,
    recordingEvidenceId,
  );

  if (duration === null) {
    throw new MediaValidationError("VTT_REQUIRES_RECORDING");
  }

  return duration;
}

async function processUploadGeneration(
  generation: UploadGeneration,
  file: File,
  recordingDurationMs: number | null,
) {
  let bytes: Buffer;

  try {
    bytes = Buffer.from(await file.arrayBuffer());
    await writeStagedMedia(generation.storageKey, bytes);
  } catch {
    await failMediaUpload(generation, "WRITE_FAILED");
    await cleanupCapturedGeneration(generation);
    logEvent("error", "media_upload_failed", {
      assetId: generation.assetId,
      uploadGeneration: generation.generation,
      failureCode: "WRITE_FAILED",
    });
    throw new MediaStorageWriteError();
  }

  let validated: Awaited<ReturnType<typeof validateMediaBytes>>;

  try {
    validated = await validateMediaBytes(file, bytes, recordingDurationMs);
  } catch (error) {
    if (error instanceof MediaValidationError) {
      await failMediaUpload(generation, "VALIDATION_REJECTED");
      await cleanupCapturedGeneration(generation);
      logEvent("warn", "media_upload_validation_failed", {
        assetId: generation.assetId,
        uploadGeneration: generation.generation,
        failureCode: "VALIDATION_REJECTED",
        validationCode: error.code,
      });
    } else {
      // Decoder absence/crash is infrastructure failure, not bad owner data.
      // Never strand its generation PENDING or publish unverified bytes.
      await failMediaUpload(generation, "WRITE_FAILED");
      await cleanupCapturedGeneration(generation);
      logEvent("error", "media_decoder_unavailable", {
        assetId: generation.assetId,
        uploadGeneration: generation.generation,
      });
      if (error instanceof VideoDecoderUnavailableError) throw error;
    }

    throw error;
  }

  try {
    await promoteStagedMedia(generation.storageKey);
  } catch {
    await failMediaUpload(generation, "WRITE_FAILED");
    await cleanupCapturedGeneration(generation);
    logEvent("error", "media_upload_failed", {
      assetId: generation.assetId,
      uploadGeneration: generation.generation,
      failureCode: "WRITE_FAILED",
    });
    throw new MediaStorageWriteError();
  }

  const completed = await completeMediaUpload(
    generation,
    validated.metadata,
  );

  if (!completed) {
    await cleanupCapturedGeneration(generation);
    throw new MediaUploadConflictError();
  }

  const asset = await getOwnerReadyMediaAsset(
    generation.storyId,
    generation.assetId,
  );

  if (!asset) {
    throw new MediaUploadConflictError();
  }

  return asset;
}

export async function createAuthorizedMediaUpload(input: {
  storyId: string;
  file: File;
  recordingEvidenceId: string | null;
}) {
  const preliminary = preliminaryMediaCheck(input.file);
  const recordingDurationMs = await recordingDurationForUpload(
    input.storyId,
    preliminary.mediaType,
    input.recordingEvidenceId,
  );
  const generation = await createPendingMediaAsset({
    storyId: input.storyId,
    originalFileName: preliminary.originalFileName,
    mediaType: preliminary.mediaType,
    contentType: preliminary.contentType,
    byteSize: input.file.size,
  });

  return processUploadGeneration(
    generation,
    input.file,
    recordingDurationMs,
  );
}

export async function retryAuthorizedMediaUpload(input: {
  storyId: string;
  assetId: string;
  file: File;
  recordingEvidenceId: string | null;
}) {
  const current = await getMediaAssetForRetry(input.storyId, input.assetId);

  if (!current) {
    throw new MediaAssetNotFoundError();
  }

  if (current.readiness !== "FAILED") {
    throw new MediaUploadConflictError();
  }

  const preliminary = preliminaryMediaCheck(input.file);

  if (preliminary.mediaType !== current.mediaType) {
    throw new MediaValidationError("TYPE_MISMATCH");
  }

  const recordingDurationMs = await recordingDurationForUpload(
    input.storyId,
    preliminary.mediaType,
    input.recordingEvidenceId,
  );
  const generation = await retryFailedMediaAsset({
    assetId: current.id,
    storyId: current.storyId,
    expectedGeneration: current.uploadGeneration,
    expectedStorageKey: current.storageKey,
    originalFileName: preliminary.originalFileName,
    mediaType: preliminary.mediaType,
    contentType: preliminary.contentType,
    byteSize: input.file.size,
  });

  if (!generation) {
    throw new MediaUploadConflictError();
  }

  await cleanupCapturedGeneration({
    assetId: current.id,
    generation: current.uploadGeneration,
    storageKey: current.storageKey,
  });

  return processUploadGeneration(
    generation,
    input.file,
    recordingDurationMs,
  );
}

export async function removeAuthorizedMediaAsset(
  storyId: string,
  assetId: string,
): Promise<void> {
  const storageKey = await removeUnreferencedMediaAsset(storyId, assetId);

  try {
    await removeMediaGenerationBytes(storageKey);
  } catch {
    logEvent("error", "media_cleanup_failed", { assetId });
  }
}

export async function reconcileMediaStorage(): Promise<{
  expiredUploads: number;
  orphanFilesRemoved: number;
}> {
  const expired = await reconcileExpiredMediaUploads();
  const failed = await listFailedMediaGenerations();
  const generations = new Map(
    [...expired, ...failed].map((item) => [
      item.assetId + ":" + item.generation + ":" + item.storageKey,
      item,
    ]),
  );

  for (const generation of generations.values()) {
    await cleanupCapturedGeneration(generation);
  }

  const currentKeys = await listCurrentMediaStorageKeys();
  const storageFiles = await listMediaStorageFiles();
  const cutoff = Date.now() - ORPHAN_AGE_MS;
  const orphanKeys = new Set(
    storageFiles
      .filter(
        (file) =>
          file.modifiedAt.getTime() <= cutoff && !currentKeys.has(file.key),
      )
      .map((file) => file.key),
  );

  for (const key of orphanKeys) {
    try {
      await removeMediaGenerationBytes(key);
    } catch {
      logEvent("error", "media_orphan_cleanup_failed", {});
    }
  }

  return {
    expiredUploads: expired.length,
    orphanFilesRemoved: orphanKeys.size,
  };
}

function extensionForType(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "text/vtt":
      return "vtt";
    default:
      return "bin";
  }
}

type DeliverableAsset = NonNullable<
  Awaited<ReturnType<typeof getOwnerReadyMediaAsset>>
>;

export async function createMediaDeliveryResponse(
  asset: DeliverableAsset,
  rangeHeader: string | null,
  visibility: "private" | "public",
): Promise<Response | null> {
  const bytes = await readMediaBytes(asset.storageKey);

  if (!bytes || bytes.length !== asset.byteSize) {
    logEvent("error", "media_delivery_bytes_unavailable", {
      assetId: asset.id,
    });
    return null;
  }

  const headers = new Headers({
    "Cache-Control":
      visibility === "private"
        ? "private, no-store"
        : "public, max-age=0, must-revalidate",
    "Content-Disposition":
      'inline; filename="media-' +
      asset.id +
      "." +
      extensionForType(asset.contentType) +
      '"',
    "Content-Type": asset.contentType,
    "X-Content-Type-Options": "nosniff",
  });

  let status = 200;
  let payload = bytes;

  if (asset.mediaType === "VIDEO") {
    headers.set("Accept-Ranges", "bytes");

    let range: { start: number; end: number } | null;

    try {
      range = parseSingleByteRange(rangeHeader, bytes.length);
    } catch (error) {
      if (error instanceof MediaRangeNotSatisfiableError) {
        headers.set("Content-Range", "bytes */" + bytes.length);
        return new Response(null, { status: 416, headers });
      }

      throw error;
    }

    if (range) {
      status = 206;
      payload = bytes.subarray(range.start, range.end + 1);
      headers.set(
        "Content-Range",
        "bytes " +
          range.start +
          "-" +
          range.end +
          "/" +
          bytes.length,
      );
    }
  }

  headers.set("Content-Length", String(payload.length));

  return new Response(Uint8Array.from(payload), {
    status,
    headers,
  });
}

export async function getAuthorizedPrivateMediaResponse(
  storyId: string,
  assetId: string,
  rangeHeader: string | null,
): Promise<Response | null> {
  const asset = await getOwnerReadyMediaAsset(storyId, assetId);

  if (!asset) return null;

  return createMediaDeliveryResponse(asset, rangeHeader, "private");
}

export async function getPublicMediaResponse(
  assetId: string,
  rangeHeader: string | null,
): Promise<Response | null> {
  const asset = await getPublicReadyMediaAsset(assetId);

  if (!asset) return null;

  return createMediaDeliveryResponse(asset, rangeHeader, "public");
}

export {
  MediaAssetNotFoundError,
  MediaAssetReferencedError,
  MediaStoryNotFoundError,
  MediaValidationError,
};
