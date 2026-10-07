import "server-only";

import { randomUUID } from "node:crypto";

import { db } from "@/lib/db";

const UPLOAD_LEASE_MS = 24 * 60 * 60 * 1000;

export type UploadGeneration = {
  assetId: string;
  storyId: string;
  generation: number;
  storageKey: string;
  leaseExpiresAt: Date;
};

export type FailedUploadGeneration = {
  assetId: string;
  storyId: string;
  generation: number;
  storageKey: string;
};

export class MediaStoryNotFoundError extends Error {
  constructor() {
    super("Story not found");
    this.name = "MediaStoryNotFoundError";
  }
}

export class MediaAssetNotFoundError extends Error {
  constructor() {
    super("Media asset not found");
    this.name = "MediaAssetNotFoundError";
  }
}

export class MediaAssetReferencedError extends Error {
  constructor() {
    super("Media asset is still referenced");
    this.name = "MediaAssetReferencedError";
  }
}

export async function assertMediaStoryExists(storyId: string): Promise<void> {
  const story = await db.story.findUnique({
    where: { id: storyId },
    select: { id: true },
  });

  if (!story) {
    throw new MediaStoryNotFoundError();
  }
}

export async function createPendingMediaAsset(input: {
  storyId: string;
  originalFileName: string;
  mediaType: "IMAGE" | "VIDEO" | "VTT";
  contentType: string;
  byteSize: number;
}): Promise<UploadGeneration> {
  await assertMediaStoryExists(input.storyId);

  const now = new Date();
  const leaseExpiresAt = new Date(now.getTime() + UPLOAD_LEASE_MS);
  const storageKey = randomUUID();

  const asset = await db.mediaAsset.create({
    data: {
      storyId: input.storyId,
      storageKey,
      originalFileName: input.originalFileName,
      mediaType: input.mediaType,
      contentType: input.contentType,
      byteSize: input.byteSize,
      readiness: "PENDING",
      uploadGeneration: 1,
      leaseExpiresAt,
      createdAt: now,
      updatedAt: now,
    },
    select: {
      id: true,
      storyId: true,
      uploadGeneration: true,
      storageKey: true,
      leaseExpiresAt: true,
    },
  });

  if (!asset.leaseExpiresAt) {
    throw new Error("Pending media asset is missing its upload lease");
  }

  return {
    assetId: asset.id,
    storyId: asset.storyId,
    generation: asset.uploadGeneration,
    storageKey: asset.storageKey,
    leaseExpiresAt: asset.leaseExpiresAt,
  };
}

export async function completeMediaUpload(
  generation: UploadGeneration,
  metadata: {
    mediaType: "IMAGE" | "VIDEO" | "VTT";
    contentType: string;
    byteSize: number;
    width: number | null;
    height: number | null;
    durationMs: number | null;
  },
): Promise<boolean> {
  const rows = await db.$queryRaw<Array<{ id: string }>>\`
    UPDATE "MediaAsset"
    SET
      "mediaType" = CAST(\${metadata.mediaType} AS "MediaAssetType"),
      "contentType" = \${metadata.contentType},
      "byteSize" = \${metadata.byteSize},
      "width" = \${metadata.width},
      "height" = \${metadata.height},
      "durationMs" = \${metadata.durationMs},
      "readiness" = 'READY'::"MediaAssetReadiness",
      "leaseExpiresAt" = NULL,
      "failureCode" = NULL,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE
      "id" = \${generation.assetId}
      AND "storyId" = \${generation.storyId}
      AND "uploadGeneration" = \${generation.generation}
      AND "storageKey" = \${generation.storageKey}
      AND "leaseExpiresAt" = \${generation.leaseExpiresAt}
      AND "readiness" = 'PENDING'::"MediaAssetReadiness"
      AND CURRENT_TIMESTAMP < "leaseExpiresAt"
    RETURNING "id"
  \`;

  return rows.length === 1;
}

export async function failMediaUpload(
  generation: UploadGeneration,
  failureCode: "VALIDATION_REJECTED" | "WRITE_FAILED",
): Promise<boolean> {
  const rows = await db.$queryRaw<Array<{ id: string }>>\`
    UPDATE "MediaAsset"
    SET
      "readiness" = 'FAILED'::"MediaAssetReadiness",
      "failureCode" = CAST(\${failureCode} AS "MediaAssetFailureCode"),
      "leaseExpiresAt" = NULL,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE
      "id" = \${generation.assetId}
      AND "storyId" = \${generation.storyId}
      AND "uploadGeneration" = \${generation.generation}
      AND "storageKey" = \${generation.storageKey}
      AND "leaseExpiresAt" = \${generation.leaseExpiresAt}
      AND "readiness" = 'PENDING'::"MediaAssetReadiness"
      AND CURRENT_TIMESTAMP < "leaseExpiresAt"
    RETURNING "id"
  \`;

  return rows.length === 1;
}

export async function reconcileExpiredMediaUploads(): Promise<
  FailedUploadGeneration[]
> {
  const rows = await db.$queryRaw<
    Array<{
      id: string;
      storyId: string;
      uploadGeneration: number;
      storageKey: string;
    }>
  >\`
    UPDATE "MediaAsset"
    SET
      "readiness" = 'FAILED'::"MediaAssetReadiness",
      "failureCode" = 'UPLOAD_INTERRUPTED'::"MediaAssetFailureCode",
      "leaseExpiresAt" = NULL,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE
      "readiness" = 'PENDING'::"MediaAssetReadiness"
      AND "leaseExpiresAt" IS NOT NULL
      AND CURRENT_TIMESTAMP >= "leaseExpiresAt"
    RETURNING "id", "storyId", "uploadGeneration", "storageKey"
  \`;

  return rows.map((row) => ({
    assetId: row.id,
    storyId: row.storyId,
    generation: row.uploadGeneration,
    storageKey: row.storageKey,
  }));
}

export async function retryFailedMediaAsset(input: {
  assetId: string;
  storyId: string;
  expectedGeneration: number;
  expectedStorageKey: string;
  originalFileName: string;
  mediaType: "IMAGE" | "VIDEO" | "VTT";
  contentType: string;
  byteSize: number;
}): Promise<UploadGeneration | null> {
  const newKey = randomUUID();

  const rows = await db.$queryRaw<
    Array<{
      id: string;
      storyId: string;
      uploadGeneration: number;
      storageKey: string;
      leaseExpiresAt: Date;
    }>
  >\`
    UPDATE "MediaAsset"
    SET
      "uploadGeneration" = "uploadGeneration" + 1,
      "storageKey" = \${newKey},
      "originalFileName" = \${input.originalFileName},
      "mediaType" = CAST(\${input.mediaType} AS "MediaAssetType"),
      "contentType" = \${input.contentType},
      "byteSize" = \${input.byteSize},
      "width" = NULL,
      "height" = NULL,
      "durationMs" = NULL,
      "readiness" = 'PENDING'::"MediaAssetReadiness",
      "failureCode" = NULL,
      "leaseExpiresAt" = CURRENT_TIMESTAMP + INTERVAL '24 hours',
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE
      "id" = \${input.assetId}
      AND "storyId" = \${input.storyId}
      AND "readiness" = 'FAILED'::"MediaAssetReadiness"
      AND "uploadGeneration" = \${input.expectedGeneration}
      AND "storageKey" = \${input.expectedStorageKey}
    RETURNING "id", "storyId", "uploadGeneration", "storageKey", "leaseExpiresAt"
  \`;

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    assetId: row.id,
    storyId: row.storyId,
    generation: row.uploadGeneration,
    storageKey: row.storageKey,
    leaseExpiresAt: row.leaseExpiresAt,
  };
}

export async function getOwnerReadyMediaAsset(
  storyId: string,
  assetId: string,
) {
  return db.mediaAsset.findFirst({
    where: {
      id: assetId,
      storyId,
      readiness: "READY",
    },
  });
}

export async function getPublicReadyMediaAsset(assetId: string) {
  return db.mediaAsset.findFirst({
    where: {
      id: assetId,
      readiness: "READY",
      OR: [
        { publishedSourceFor: { some: {} } },
        { publishedPosterFor: { some: {} } },
        { publishedCaptionTrackFor: { some: {} } },
      ],
    },
  });
}

export async function getMediaAssetForRetry(
  storyId: string,
  assetId: string,
) {
  return db.mediaAsset.findFirst({
    where: { id: assetId, storyId },
  });
}

export async function currentAssetOwnsGenerationKey(input: {
  assetId: string;
  generation: number;
  storageKey: string;
}): Promise<boolean> {
  const asset = await db.mediaAsset.findUnique({
    where: { id: input.assetId },
    select: {
      uploadGeneration: true,
      storageKey: true,
      readiness: true,
    },
  });

  return Boolean(
    asset &&
      asset.uploadGeneration === input.generation &&
      asset.storageKey === input.storageKey &&
      (asset.readiness === "PENDING" || asset.readiness === "READY"),
  );
}

export async function getReadyRecordingDuration(
  storyId: string,
  evidenceId: string,
): Promise<number | null> {
  const evidence = await db.evidence.findFirst({
    where: {
      id: evidenceId,
      storyId,
      kind: "RECORDING",
    },
    select: {
      sourceAsset: {
        select: {
          mediaType: true,
          readiness: true,
          durationMs: true,
        },
      },
    },
  });

  if (
    evidence?.sourceAsset?.mediaType !== "VIDEO" ||
    evidence.sourceAsset.readiness !== "READY"
  ) {
    return null;
  }

  return evidence.sourceAsset.durationMs;
}

export async function removeUnreferencedMediaAsset(
  storyId: string,
  assetId: string,
): Promise<string> {
  return db.$transaction(
    async (tx) => {
      const locked = await tx.$queryRaw<
        Array<{ id: string; storageKey: string }>
      >\`
        SELECT "id", "storageKey"
        FROM "MediaAsset"
        WHERE "id" = \${assetId} AND "storyId" = \${storyId}
        FOR UPDATE
      \`;

      const asset = locked[0];

      if (!asset) {
        throw new MediaAssetNotFoundError();
      }

      const refs = await tx.$queryRaw<Array<{ referenced: boolean }>>\`
        SELECT (
          EXISTS (
            SELECT 1 FROM "Evidence"
            WHERE "sourceAssetId" = \${assetId}
               OR "posterAssetId" = \${assetId}
               OR "captionTrackAssetId" = \${assetId}
          )
          OR EXISTS (
            SELECT 1 FROM "PublishedEvidence"
            WHERE "sourceAssetId" = \${assetId}
               OR "posterAssetId" = \${assetId}
               OR "captionTrackAssetId" = \${assetId}
          )
        ) AS "referenced"
      \`;

      if (refs[0]?.referenced) {
        throw new MediaAssetReferencedError();
      }

      await tx.mediaAsset.delete({
        where: { id: assetId },
      });

      return asset.storageKey;
    },
    { isolationLevel: "Serializable" },
  );
}

export async function listFailedMediaGenerations(): Promise<
  FailedUploadGeneration[]
> {
  const rows = await db.mediaAsset.findMany({
    where: { readiness: "FAILED" },
    select: {
      id: true,
      storyId: true,
      uploadGeneration: true,
      storageKey: true,
    },
  });

  return rows.map((row) => ({
    assetId: row.id,
    storyId: row.storyId,
    generation: row.uploadGeneration,
    storageKey: row.storageKey,
  }));
}

export async function listCurrentMediaStorageKeys(): Promise<Set<string>> {
  const assets = await db.mediaAsset.findMany({
    select: { storageKey: true },
  });

  return new Set(assets.map((asset) => asset.storageKey));
}
