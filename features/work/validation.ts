import { z } from "zod";

import {
  STORY_PROGRESS_VALUES,
  RECORDING_MODES,
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

const nullableUuid = z.uuid().nullable();
const nullableBounded = (max: number) => z.string().trim().max(max).nullable();
const captureStage = z.enum([
  "DESIGN", "PROTOTYPE", "LOCAL_BUILD", "PRODUCTION_CAPTURE",
  "RECREATED_LOCAL_DEMO",
]);

const evidenceSchema = z.object({
  id: z.uuid(),
  kind: z.enum(["IMAGE", "RECORDING", "DIAGRAM", "TEXT_LINK"]),
  title: nullableBounded(120),
  caption: nullableBounded(1200),
  captureStage: captureStage.nullable(),
  permissionConfirmed: z.boolean().nullable(),
  alternativeText: nullableBounded(600),
  equivalentDescription: nullableBounded(3000),
  transcript: nullableBounded(12000),
  textLinkText: nullableBounded(240),
  textLinkUrl: nullableBounded(2048),
  sourceAssetId: nullableUuid,
  posterAssetId: nullableUuid,
  captionTrackAssetId: nullableUuid,
  recordingAccessibilityMode: z.enum(RECORDING_MODES).nullable(),
  confirmSourceAssetId: nullableUuid.optional(),
});

export function safeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) &&
      !url.username && !url.password;
  } catch {
    return false;
  }
}

const optionalHttps = optionalText(2048).refine(
  (value) => !value || safeHttpsUrl(value), "Use a credential-free HTTPS URL.",
);

const extraStoryDraft = {
  releaseHistory: z.enum(["SHIPPED", "NEVER_SHIPPED"]).nullable().optional(),
  availability: z.enum(["LIVE_DESTINATION", "NO_LIVE_DESTINATION"]).nullable().optional(),
  liveDestinationUrl: optionalHttps.optional(),
  evidence: z.array(evidenceSchema).max(60).optional(),
  discoveryCoverEvidenceId: nullableUuid.optional(),
  leadEvidenceId: nullableUuid.optional(),
  problemFigureEvidenceIds: z.array(z.uuid()).max(60).optional(),
};

function validateAvailability(value: {
  availability?: "LIVE_DESTINATION" | "NO_LIVE_DESTINATION" | null;
  liveDestinationUrl?: string | null;
}, ctx: z.RefinementCtx) {
  if (value.availability === "LIVE_DESTINATION" && !value.liveDestinationUrl) {
    ctx.addIssue({ code: "custom", path: ["liveDestinationUrl"], message: "Add the confirmed HTTPS destination." });
  }
  if (value.availability !== "LIVE_DESTINATION" && value.liveDestinationUrl) {
    ctx.addIssue({ code: "custom", path: ["liveDestinationUrl"], message: "A URL requires confirmed live availability." });
  }
}

export const storyDraftSchema = z.object({
  title: z.string().trim().max(STORY_LIMITS.title),
  problem: z.string().trim().max(STORY_LIMITS.problem),
  contribution: z.string().trim().max(STORY_LIMITS.contribution),
  progress: progressSchema.nullable(),
  outcome: optionalText(STORY_LIMITS.outcome),
  stack: stackSchema,
  ...extraStoryDraft,
}).superRefine(validateAvailability);

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
  ...extraStoryDraft,
}).superRefine(validateAvailability);

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
    releaseHistory: String(formData.get("releaseHistory") ?? ""),
    availability: String(formData.get("availability") ?? ""),
    liveDestinationUrl: String(formData.get("liveDestinationUrl") ?? ""),
    evidenceJson: formData.has("evidenceJson") ? String(formData.get("evidenceJson") ?? "") : undefined,
    discoveryCoverEvidenceId: String(formData.get("discoveryCoverEvidenceId") ?? ""),
    leadEvidenceId: String(formData.get("leadEvidenceId") ?? ""),
    problemFigureEvidenceIds: String(formData.get("problemFigureEvidenceIds") ?? ""),
  };
}

export function parseStoryDraftFormData(formData: FormData) {
  const values = storyFormValuesFromData(formData);

  let evidence: unknown;
  if (values.evidenceJson !== undefined) {
    try {
      if (values.evidenceJson.length > 60_000) throw new Error("Too large");
      evidence = JSON.parse(values.evidenceJson);
    } catch {
      evidence = "Invalid Evidence payload";
    }
  }

  return {
    values,
    result: storyDraftSchema.safeParse({
      title: values.title,
      problem: values.problem,
      contribution: values.contribution,
      progress: values.progress || null,
      outcome: values.outcome,
      stack: normalizeStack(formData.get("stack")),
      ...(formData.has("releaseHistory") ? { releaseHistory: values.releaseHistory || null } : {}),
      ...(formData.has("availability") ? { availability: values.availability || null, liveDestinationUrl: values.liveDestinationUrl || null } : {}),
      ...(values.evidenceJson !== undefined ? { evidence, discoveryCoverEvidenceId: values.discoveryCoverEvidenceId || null, leadEvidenceId: values.leadEvidenceId || null, problemFigureEvidenceIds: values.problemFigureEvidenceIds?.split(",").filter(Boolean) ?? [] } : {}),
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
    releaseHistory: draft.releaseHistory ?? "",
    availability: draft.availability ?? "",
    liveDestinationUrl: draft.liveDestinationUrl ?? "",
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
      field === "stack" ||
      field === "releaseHistory" ||
      field === "availability" ||
      field === "liveDestinationUrl" ||
      field === "evidence"
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
