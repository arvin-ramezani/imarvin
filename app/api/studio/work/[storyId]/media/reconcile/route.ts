import { requireOwnerMediaStory, reconcileMediaStorage } from "@/features/work/media-service";
import { requireSameOriginMediaMutation } from "@/features/work/media-http";
import { mediaRouteErrorResponse } from "@/features/work/media-route";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ storyId: string }> },
): Promise<Response> {
  try {
    const { storyId } = await context.params;
    await requireOwnerMediaStory(request.headers, storyId);
    requireSameOriginMediaMutation(request);
    await reconcileMediaStorage();
    const assets = await db.mediaAsset.findMany({
      where: { storyId },
      select: {
        id: true, mediaType: true, readiness: true, originalFileName: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return Response.json({ assets }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return mediaRouteErrorResponse(error);
  }
}
