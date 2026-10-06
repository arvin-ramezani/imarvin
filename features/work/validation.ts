import { z } from "zod";

import {
  STORY_PROGRESS_VALUES,
  type StoryDraftInput,
  type StoryField,
  type StoryFormValues,
} from "./types";

export const STORY_LIMITS = {
  title: 120,
  problem: 1_200,
  contribution: 1_600,
  outcome: 1_200,
  stackEntries: 12,
  stackEntry: 50,
} as const;

const progressSchema = z.enum(STORY_PROGRESS_VALUES);

function optionalText(maximum: number) {
  return z
    .union([z.string(), z.null()])
    .transform((value) => (value ?? "").trim())
    .pipe(z.string().max(maximum))
    .transform((value) => (value.length > 0 ? value : null));
}

const stackSchema = z
  .array(z.string().trim().min(1).max(STORY_LIMITS.stackEntry))
  .max(STORY_LIMITS.stackEntries)
  .transform((items) => Array.from(new Set(items)));

export const storyDraftSchema = z.object({
  title: z.string().trim().max(STORY_LIMITS.title),
  problem: z.string().trim().max(STORY_LIMITS.problem),
  contribution: z.string().trim().max(STORY_LIMITS.contribution),
  progress: progressSchema.nullable(),
  outcome: optionalText(STORY_LIMITS.outcome),
  stack: stackSchema,
});

export const storyPublicationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Add a title before publishing.")
    .max(STORY_LIMITS.title),
  problem: z
    .string()
    .trim()
    .min(1, "Add the problem or hook before publishing.")
    .max(STORY_LIMITS.problem),
  contribution: z
    .string()
    .trim()
    .min(1, "Add your contribution before publishing.")
    .max(STORY_LIMITS.contribution),
  progress: progressSchema,
  outcome: optionalText(STORY_LIMITS.outcome),
  stack: stackSchema,
});

export type PublishedStoryInput = z.infer<typeof storyPublicationSchema>;

function normalizeStack(value: FormDataEntryValue | null): string[] {
  const raw = typeof value === "string" ? value : "";

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}

export function storyFormValuesFromData(formData: FormData): StoryFormValues {
  const progress = formData.get("progress");
  const normalizedProgress =
    typeof progress === "string" &&
    STORY_PROGRESS_VALUES.includes(
      progress as (typeof STORY_PROGRESS_VALUES)[number],
    )
      ? (progress as StoryFormValues["progress"])
      : "";

  return {
    title: String(formData.get("title") ?? ""),
    problem: String(formData.get("problem") ?? ""),
    contribution: String(formData.get("contribution") ?? ""),
    progress: normalizedProgress,
    outcome: String(formData.get("outcome") ?? ""),
    stack: String(formData.get("stack") ?? ""),
  };
}

export function parseStoryDraftFormData(formData: FormData) {
  const values = storyFormValuesFromData(formData);

  return {
    values,
    result: storyDraftSchema.safeParse({
      title: values.title,
      problem: values.problem,
      contribution: values.contribution,
      progress: values.progress || null,
      outcome: values.outcome,
      stack: normalizeStack(formData.get("stack")),
    }),
  };
}

export function storyFormValuesFromDraft(
  draft: StoryDraftInput,
): StoryFormValues {
  return {
    title: draft.title,
    problem: draft.problem,
    contribution: draft.contribution,
    progress: draft.progress ?? "",
    outcome: draft.outcome ?? "",
    stack: draft.stack.join(", "),
  };
}

export function zodFieldErrors(
  error: z.ZodError,
): Partial<Record<StoryField, string[]>> {
  const fieldErrors: Partial<Record<StoryField, string[]>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      field === "title" ||
      field === "problem" ||
      field === "contribution" ||
      field === "progress" ||
      field === "outcome" ||
      field === "stack"
    ) {
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
  }

  return fieldErrors;
}

export function publicationFieldErrors(
  draft: StoryDraftInput,
): Partial<Record<StoryField, string[]>> {
  const parsed = storyPublicationSchema.safeParse(draft);

  return parsed.success ? {} : zodFieldErrors(parsed.error);
}
