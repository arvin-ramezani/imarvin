import {
  getAuthorizedPrivateMediaResponse,
  removeAuthorizedMediaAsset,
  requireOwnerMediaStory,
} from "@/features/work/media-service";
import { requireSameOriginMediaMutation } from "@/features/work/media-http";
import {
  mediaRouteErrorResponse,
  neutralMediaNotFound,
} from "@/features/work/media-route";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ storyId: string; assetId: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { storyId, assetId } = await context.params;

    await requireOwnerMediaStory(request.headers, storyId);

    return (
      (await getAuthorizedPrivateMediaResponse(
        storyId,
        assetId,
        request.headers.get("range"),
      )) ?? neutralMediaNotFound()
    );
  } catch (error) {
    return mediaRouteErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { storyId, assetId } = await context.params;

    await requireOwnerMediaStory(request.headers, storyId);
    requireSameOriginMediaMutation(request);
    await removeAuthorizedMediaAsset(storyId, assetId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return mediaRouteErrorResponse(error);
  }
}
