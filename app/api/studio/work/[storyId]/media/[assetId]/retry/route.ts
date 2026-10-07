import {
  requireOwnerMediaStory,
  retryAuthorizedMediaUpload,
} from "@/features/work/media-service";
import {
  parseSingleMediaUpload,
  requireSameOriginMediaMutation,
} from "@/features/work/media-http";
import { mediaRouteErrorResponse } from "@/features/work/media-route";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ storyId: string; assetId: string }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { storyId, assetId } = await context.params;

    await requireOwnerMediaStory(request.headers, storyId);
    requireSameOriginMediaMutation(request);

    const upload = await parseSingleMediaUpload(request);
    const asset = await retryAuthorizedMediaUpload({
      storyId,
      assetId,
      ...upload,
    });

    return Response.json({
      id: asset.id,
      mediaType: asset.mediaType,
      contentType: asset.contentType,
      byteSize: asset.byteSize,
      width: asset.width,
      height: asset.height,
      durationMs: asset.durationMs,
      readiness: asset.readiness,
    });
  } catch (error) {
    return mediaRouteErrorResponse(error);
  }
}
