import {
  requireOwnerMediaStory,
  reconcileMediaStorage,
  MediaAssetNotFoundError,
  MediaUploadConflictError,
  retryAuthorizedMediaUpload,
} from "@/features/work/media-service";
import {
  parseSingleMediaUpload,
  requireSameOriginMediaMutation,
} from "@/features/work/media-http";
import { mediaRouteErrorResponse } from "@/features/work/media-route";
import { getMediaAssetForRetry } from "@/features/work/media-repository";

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

    // Authenticate Story membership before any global cleanup side effects.
    // Do not require FAILED yet: an expired PENDING asset must be recoverable.
    if (!(await getMediaAssetForRetry(storyId, assetId))) {
      throw new MediaAssetNotFoundError();
    }

    await reconcileMediaStorage();

    // The preflight snapshot is stale after reconciliation. Check the current
    // target before consuming the upload body; retry's generation/key CAS
    // remains the final authority if another request races this check.
    const current = await getMediaAssetForRetry(storyId, assetId);
    if (!current) throw new MediaAssetNotFoundError();
    if (current.readiness !== "FAILED") throw new MediaUploadConflictError();

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
