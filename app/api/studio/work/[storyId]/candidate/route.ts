import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSameOriginMediaMutation } from "@/features/work/media-http";
import { saveOwnerStory } from "@/features/work/owner";
import {
  StoryCandidateValidationError,
  StoryConflictError,
  StoryNotFoundError,
} from "@/features/work/repository";
import { storyDraftSchema, zodFieldErrors } from "@/features/work/validation";
import { OwnerAuthorizationError } from "@/lib/auth";
import { logEvent } from "@/lib/logging/logger";

export const runtime = "nodejs";

const MAX_CANDIDATE_BYTES = 1024 * 1024;
const revisionSchema = z.number().int().positive();
const uuidSchema = z.uuid();

async function readCandidate(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    throw new Error("Unsupported candidate content type");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing candidate body");
  let count = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    count += value.byteLength;
    if (count > MAX_CANDIDATE_BYTES) {
      await reader.cancel();
      throw new Error("Candidate request is too large");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

const requestSchema = z.object({
  expectedWorkingRevision: revisionSchema,
  intent: z.enum(["save", "preview", "review"]),
  draft: storyDraftSchema,
});

export async function POST(
  request: Request,
  context: { params: Promise<{ storyId: string }> },
): Promise<Response> {
  try {
    const { storyId } = await context.params;
    if (!uuidSchema.safeParse(storyId).success) return Response.json(
      { message: "Invalid saved Story reference." }, { status: 400 },
    );

    requireSameOriginMediaMutation(request);
    const payload = requestSchema.safeParse(await readCandidate(request));
    if (!payload.success) {
      return Response.json(
        { message: "Check the saved candidate fields.",
          fieldErrors: zodFieldErrors(payload.error) },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    const saved = await saveOwnerStory(
      request.headers, storyId, payload.data.expectedWorkingRevision,
      payload.data.draft,
    );
    revalidatePath("/studio/work");
    revalidatePath(`/studio/work/${storyId}/edit`);
    revalidatePath(`/studio/work/${storyId}/preview`);
    revalidatePath(`/studio/work/${storyId}/publish`);
    const destination = payload.data.intent === "preview" ? "preview" :
      payload.data.intent === "review" ? "publish" : "edit?saved=1";
    return Response.json(
      { target: `/studio/work/${saved.id}/${destination}` },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const headers = { "Cache-Control": "no-store" };
    if (error instanceof OwnerAuthorizationError) return Response.json(
      { message: "Owner authorization expired or the request origin was rejected." },
      { status: 401, headers },
    );
    if (error instanceof StoryConflictError) return Response.json(
      { message: "This saved Story has changed. Copy unsaved text, then reload before retrying." },
      { status: 409, headers },
    );
    if (error instanceof StoryNotFoundError) return Response.json(
      { message: "Saved Story unavailable." }, { status: 404, headers },
    );
    if (error instanceof StoryCandidateValidationError) return Response.json(
      { message: error.message, fieldErrors: error.fieldErrors },
      { status: 400, headers },
    );
    if (error instanceof z.ZodError) return Response.json(
      { message: "Check the candidate fields.", fieldErrors: zodFieldErrors(error) },
      { status: 400, headers },
    );
    if (error instanceof Error && "status" in error &&
      typeof error.status === "number") return Response.json(
      { message: "Untrusted candidate request." }, { status: error.status, headers },
    );
    logEvent("error", "work_candidate_save_failed", {});
    return Response.json(
      { message: "Private save could not be confirmed. Reload saved version before retrying." },
      { status: 500, headers },
    );
  }
}
