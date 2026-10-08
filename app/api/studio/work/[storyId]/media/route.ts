import {
  createAuthorizedMediaUpload,
  requireOwnerMediaStory,
  reconcileMediaStorage,
} from "@/features/work/media-service";
import {
  parseSingleMediaUpload,
  requireSameOriginMediaMutation,
} from "@/features/work/media-http";
import { mediaRouteErrorResponse } from "@/features/work/media-route";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ storyId: string }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { storyId } = await context.params;

    await requireOwnerMediaStory(request.headers, storyId);
    requireSameOriginMediaMutation(request);
    await reconcileMediaStorage();

    const upload = await parseSingleMediaUpload(request);
    const asset = await createAuthorizedMediaUpload({
      storyId,
      ...upload,
    });

    return Response.json(
      {
        id: asset.id,
        mediaType: asset.mediaType,
        contentType: asset.contentType,
        byteSize: asset.byteSize,
        width: asset.width,
        height: asset.height,
        durationMs: asset.durationMs,
        readiness: asset.readiness,
      },
      { status: 201 },
    );
  } catch (error) {
    return mediaRouteErrorResponse(error);
  }
}
