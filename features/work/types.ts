export const STORY_PROGRESS_VALUES = [
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const;

export type StoryProgress = (typeof STORY_PROGRESS_VALUES)[number];

export const RECORDING_MODES = [
  "SILENT",
  "AUDIO_VISUALS_CONVEYED",
  "AUDIO_DESCRIPTION_INCLUDED",
] as const;
export type RecordingMode = (typeof RECORDING_MODES)[number];

export type EvidenceDraftInput = {
  id: string;
  kind: "IMAGE" | "RECORDING" | "DIAGRAM" | "TEXT_LINK";
  title: string | null;
  caption: string | null;
  captureStage:
    | "DESIGN"
    | "PROTOTYPE"
    | "LOCAL_BUILD"
    | "PRODUCTION_CAPTURE"
    | "RECREATED_LOCAL_DEMO"
    | null;
  permissionConfirmed: boolean | null;
  alternativeText: string | null;
  equivalentDescription: string | null;
  transcript: string | null;
  textLinkText: string | null;
  textLinkUrl: string | null;
  sourceAssetId: string | null;
  posterAssetId: string | null;
  captionTrackAssetId: string | null;
  recordingAccessibilityMode: RecordingMode | null;
  /** A one-time explicit attestation for an unchanged persisted source. */
  confirmSourceAssetId?: string | null;
};

export type StoryDraftInput = {
  title: string;
  problem: string;
  contribution: string;
  progress: StoryProgress | null;
  outcome: string | null;
  stack: string[];
  releaseHistory?: "SHIPPED" | "NEVER_SHIPPED" | null;
  availability?: "LIVE_DESTINATION" | "NO_LIVE_DESTINATION" | null;
  liveDestinationUrl?: string | null;
  evidence?: EvidenceDraftInput[];
  discoveryCoverEvidenceId?: string | null;
  leadEvidenceId?: string | null;
  problemFigureEvidenceIds?: string[];
};

export type StoryFormValues = {
  title: string;
  problem: string;
  contribution: string;
  progress: StoryProgress | "";
  outcome: string;
  stack: string;
  releaseHistory?: string;
  availability?: string;
  liveDestinationUrl?: string;
  evidenceJson?: string;
  discoveryCoverEvidenceId?: string;
  leadEvidenceId?: string;
  problemFigureEvidenceIds?: string;
};

export type StoryField =
  | "title"
  | "problem"
  | "contribution"
  | "progress"
  | "outcome"
  | "stack"
  | "releaseHistory"
  | "availability"
  | "liveDestinationUrl"
  | "evidence";

export function storyProgressLabel(progress: StoryProgress | null): string {
  switch (progress) {
    case "ONGOING":
      return "Ongoing";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Progress not set";
  }
}
