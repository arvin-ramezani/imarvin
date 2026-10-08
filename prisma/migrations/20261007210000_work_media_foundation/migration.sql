-- Work media persistence + secure delivery foundation (#45)

-- CreateEnum
CREATE TYPE "StoryReleaseHistory" AS ENUM ('SHIPPED', 'NEVER_SHIPPED');
CREATE TYPE "StoryAvailability" AS ENUM ('LIVE_DESTINATION', 'NO_LIVE_DESTINATION');
CREATE TYPE "EvidenceKind" AS ENUM ('IMAGE', 'RECORDING', 'DIAGRAM', 'TEXT_LINK');
CREATE TYPE "EvidenceCaptureStage" AS ENUM ('DESIGN', 'PROTOTYPE', 'LOCAL_BUILD', 'PRODUCTION_CAPTURE', 'RECREATED_LOCAL_DEMO');
CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'VIDEO', 'VTT');
CREATE TYPE "MediaAssetReadiness" AS ENUM ('PENDING', 'READY', 'FAILED');
CREATE TYPE "MediaAssetFailureCode" AS ENUM ('VALIDATION_REJECTED', 'WRITE_FAILED', 'UPLOAD_INTERRUPTED');

-- Existing text-only rows intentionally backfill to NULL/no media.
ALTER TABLE "Story"
  ADD COLUMN "releaseHistory" "StoryReleaseHistory",
  ADD COLUMN "availability" "StoryAvailability",
  ADD COLUMN "liveDestinationUrl" TEXT,
  ADD COLUMN "discoveryCoverEvidenceId" TEXT,
  ADD COLUMN "leadEvidenceId" TEXT;

ALTER TABLE "PublishedStory"
  ADD COLUMN "releaseHistory" "StoryReleaseHistory",
  ADD COLUMN "availability" "StoryAvailability",
  ADD COLUMN "liveDestinationUrl" TEXT,
  ADD COLUMN "discoveryCoverEvidenceId" TEXT,
  ADD COLUMN "leadEvidenceId" TEXT;

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "storyId" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "originalFileName" TEXT NOT NULL,
  "mediaType" "MediaAssetType" NOT NULL,
  "contentType" TEXT NOT NULL,
  "byteSize" INTEGER NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "durationMs" INTEGER,
  "readiness" "MediaAssetReadiness" NOT NULL,
  "uploadGeneration" INTEGER NOT NULL DEFAULT 1,
  "leaseExpiresAt" TIMESTAMP(3),
  "failureCode" "MediaAssetFailureCode",
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Evidence" (
  "id" TEXT NOT NULL,
  "storyId" TEXT NOT NULL,
  "kind" "EvidenceKind" NOT NULL,
  "position" INTEGER NOT NULL,
  "title" TEXT,
  "caption" TEXT,
  "captureStage" "EvidenceCaptureStage",
  "permissionConfirmed" BOOLEAN,
  "alternativeText" TEXT,
  "equivalentDescription" TEXT,
  "transcript" TEXT,
  "textLinkText" TEXT,
  "textLinkUrl" TEXT,
  "sourceAssetId" TEXT,
  "posterAssetId" TEXT,
  "captionTrackAssetId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StoryProblemFigure" (
  "storyId" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL,
  "position" INTEGER NOT NULL,

  CONSTRAINT "StoryProblemFigure_pkey" PRIMARY KEY ("storyId", "evidenceId")
);

CREATE TABLE "PublishedEvidence" (
  "id" TEXT NOT NULL,
  "storyId" TEXT NOT NULL,
  "kind" "EvidenceKind" NOT NULL,
  "position" INTEGER NOT NULL,
  "title" TEXT,
  "caption" TEXT,
  "captureStage" "EvidenceCaptureStage",
  "permissionConfirmed" BOOLEAN,
  "alternativeText" TEXT,
  "equivalentDescription" TEXT,
  "transcript" TEXT,
  "textLinkText" TEXT,
  "textLinkUrl" TEXT,
  "sourceAssetId" TEXT,
  "posterAssetId" TEXT,
  "captionTrackAssetId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PublishedEvidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PublishedStoryProblemFigure" (
  "storyId" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL,
  "position" INTEGER NOT NULL,

  CONSTRAINT "PublishedStoryProblemFigure_pkey" PRIMARY KEY ("storyId", "evidenceId")
);

CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");
CREATE UNIQUE INDEX "MediaAsset_storyId_id_key" ON "MediaAsset"("storyId", "id");
CREATE INDEX "MediaAsset_readiness_leaseExpiresAt_idx" ON "MediaAsset"("readiness", "leaseExpiresAt");
CREATE UNIQUE INDEX "Evidence_storyId_id_key" ON "Evidence"("storyId", "id");
CREATE UNIQUE INDEX "Evidence_storyId_position_key" ON "Evidence"("storyId", "position");
CREATE UNIQUE INDEX "StoryProblemFigure_storyId_position_key" ON "StoryProblemFigure"("storyId", "position");
CREATE UNIQUE INDEX "PublishedEvidence_storyId_id_key" ON "PublishedEvidence"("storyId", "id");
CREATE UNIQUE INDEX "PublishedEvidence_storyId_position_key" ON "PublishedEvidence"("storyId", "position");
CREATE UNIQUE INDEX "PublishedStoryProblemFigure_storyId_position_key" ON "PublishedStoryProblemFigure"("storyId", "position");

ALTER TABLE "MediaAsset"
  ADD CONSTRAINT "MediaAsset_storyId_fkey"
  FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Evidence"
  ADD CONSTRAINT "Evidence_storyId_fkey"
  FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Evidence"
  ADD CONSTRAINT "Evidence_storyId_sourceAssetId_fkey"
  FOREIGN KEY ("storyId", "sourceAssetId") REFERENCES "MediaAsset"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Evidence"
  ADD CONSTRAINT "Evidence_storyId_posterAssetId_fkey"
  FOREIGN KEY ("storyId", "posterAssetId") REFERENCES "MediaAsset"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Evidence"
  ADD CONSTRAINT "Evidence_storyId_captionTrackAssetId_fkey"
  FOREIGN KEY ("storyId", "captionTrackAssetId") REFERENCES "MediaAsset"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "StoryProblemFigure"
  ADD CONSTRAINT "StoryProblemFigure_storyId_evidenceId_fkey"
  FOREIGN KEY ("storyId", "evidenceId") REFERENCES "Evidence"("storyId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Story"
  ADD CONSTRAINT "Story_id_discoveryCoverEvidenceId_fkey"
  FOREIGN KEY ("id", "discoveryCoverEvidenceId") REFERENCES "Evidence"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Story"
  ADD CONSTRAINT "Story_id_leadEvidenceId_fkey"
  FOREIGN KEY ("id", "leadEvidenceId") REFERENCES "Evidence"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "PublishedEvidence"
  ADD CONSTRAINT "PublishedEvidence_storyId_fkey"
  FOREIGN KEY ("storyId") REFERENCES "PublishedStory"("storyId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PublishedEvidence"
  ADD CONSTRAINT "PublishedEvidence_storyId_sourceAssetId_fkey"
  FOREIGN KEY ("storyId", "sourceAssetId") REFERENCES "MediaAsset"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "PublishedEvidence"
  ADD CONSTRAINT "PublishedEvidence_storyId_posterAssetId_fkey"
  FOREIGN KEY ("storyId", "posterAssetId") REFERENCES "MediaAsset"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "PublishedEvidence"
  ADD CONSTRAINT "PublishedEvidence_storyId_captionTrackAssetId_fkey"
  FOREIGN KEY ("storyId", "captionTrackAssetId") REFERENCES "MediaAsset"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "PublishedStoryProblemFigure"
  ADD CONSTRAINT "PublishedStoryProblemFigure_storyId_evidenceId_fkey"
  FOREIGN KEY ("storyId", "evidenceId") REFERENCES "PublishedEvidence"("storyId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PublishedStory"
  ADD CONSTRAINT "PublishedStory_storyId_discoveryCoverEvidenceId_fkey"
  FOREIGN KEY ("storyId", "discoveryCoverEvidenceId") REFERENCES "PublishedEvidence"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "PublishedStory"
  ADD CONSTRAINT "PublishedStory_storyId_leadEvidenceId_fkey"
  FOREIGN KEY ("storyId", "leadEvidenceId") REFERENCES "PublishedEvidence"("storyId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;
