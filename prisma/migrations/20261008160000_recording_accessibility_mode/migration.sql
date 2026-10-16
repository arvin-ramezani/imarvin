-- Source-specific review is deliberately nullable: existing Evidence is not silently classified.
CREATE TYPE "RecordingAccessibilityMode" AS ENUM (
  'SILENT',
  'AUDIO_VISUALS_CONVEYED',
  'AUDIO_DESCRIPTION_INCLUDED'
);

ALTER TABLE "Evidence"
  ADD COLUMN "recordingAccessibilityMode" "RecordingAccessibilityMode";

ALTER TABLE "PublishedEvidence"
  ADD COLUMN "recordingAccessibilityMode" "RecordingAccessibilityMode";
