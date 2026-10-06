export const STORY_PROGRESS_VALUES = [
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const;

export type StoryProgress = (typeof STORY_PROGRESS_VALUES)[number];

export type StoryDraftInput = {
  title: string;
  problem: string;
  contribution: string;
  progress: StoryProgress | null;
  outcome: string | null;
  stack: string[];
};

export type StoryFormValues = {
  title: string;
  problem: string;
  contribution: string;
  progress: StoryProgress | "";
  outcome: string;
  stack: string;
};

export type StoryField =
  | "title"
  | "problem"
  | "contribution"
  | "progress"
  | "outcome"
  | "stack";

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
