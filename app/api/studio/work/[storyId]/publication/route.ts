import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSameOriginMediaMutation } from "@/features/work/media-http";
import { publishOwnerStory } from "@/features/work/owner";
import {
  StoryConflictError, StoryNotFoundError, StoryPublicationValidationError,
} from "@/features/work/repository";
import { OwnerAuthorizationError, requireOwnerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logEvent } from "@/lib/logging/logger";

export const runtime = "nodejs";

const inputSchema = z.object({
  workingRevision: z.number().int().positive(),
  publishedRevision: z.number().int().positive().nullable(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ storyId: string }> },
): Promise<Response> {
  const { storyId } = await context.params;
  if (!z.uuid().safeParse(storyId).success) {
    return Response.json({ message: "Invalid Story identity." }, { status: 400 });
  }
  const noStore = { "Cache-Control": "no-store" };
  try {
    requireSameOriginMediaMutation(request);
    await requireOwnerSession(request.headers);
    const length = Number(request.headers.get("content-length") ?? 0);
    if (!Number.isSafeInteger(length) || length > 2048) {
      return Response.json({ message: "Invalid confirmation payload." }, { status: 413, headers: noStore });
    }
    const parsed = inputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ message: "Invalid publication revisions." }, { status: 400, headers: noStore });
    }
    const { workingRevision, publishedRevision } = parsed.data;
    try {
      const result = await publishOwnerStory(request.headers, {
        storyId,
        expectedWorkingRevision: workingRevision,
        expectedPublishedRevision: publishedRevision,
      });
      revalidatePath("/work");
      revalidatePath(`/work/${storyId}`);
      revalidatePath("/studio/work");
      revalidatePath(`/studio/work/${storyId}/edit`);
      revalidatePath(`/studio/work/${storyId}/preview`);
      revalidatePath(`/studio/work/${storyId}/publish`);
      return Response.json({ target: `/studio/work/${storyId}/edit?publication=${result.mode}` },
        { headers: { "Cache-Control": "private, no-store" } });
    } catch (error) {
      if (error instanceof StoryConflictError) return Response.json(
        { target: `/studio/work/${storyId}/publish?error=conflict` },
        { status: 409, headers: noStore },
      );
      if (error instanceof StoryPublicationValidationError) return Response.json(
        { target: `/studio/work/${storyId}/publish?error=validation`,
          errors: error.fieldErrors }, { status: 422, headers: noStore },
      );
      if (error instanceof StoryNotFoundError) return Response.json(
        { target: "/studio/work?publication=unavailable" }, { status: 404, headers: noStore },
      );
      // A lost response is not proof of rollback. Re-read persisted revisions.
      const persisted = await db.publishedStory.findUnique({
        where: { storyId },
        select: { revision: true, sourceWorkingRevision: true },
      });
      if (persisted?.sourceWorkingRevision === workingRevision &&
        persisted.revision === (publishedRevision ?? 0) + 1) {
        return Response.json({
          target: `/studio/work/${storyId}/edit?publication=${
            publishedRevision === null ? "published" : "updated"}`,
        }, { headers: { "Cache-Control": "private, no-store" } });
      }
      logEvent("error", "story_publication_outcome_uncertain", { storyId });
      return Response.json(
        { target: `/studio/work/${storyId}/publish?error=unknown`,
          message: "Publication outcome is uncertain. Review persisted revisions before retrying." },
        { status: 503, headers: noStore },
      );
    }
  } catch (error) {
    if (error instanceof OwnerAuthorizationError) return Response.json(
      { message: "Owner session expired." }, { status: 401, headers: noStore });
    if (error instanceof Error && "status" in error && typeof error.status === "number") {
      return Response.json({ message: "Untrusted publication request." },
        { status: error.status, headers: noStore });
    }
    return Response.json({ message: "Publication outcome is unknown." },
      { status: 503, headers: noStore });
  }
}
