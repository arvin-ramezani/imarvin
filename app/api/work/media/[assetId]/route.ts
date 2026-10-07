import { getPublicMediaResponse } from "@/features/work/media-service";
import {
  mediaRouteErrorResponse,
  neutralMediaNotFound,
} from "@/features/work/media-route";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ assetId: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { assetId } = await context.params;

    return (
      (await getPublicMediaResponse(
        assetId,
        request.headers.get("range"),
      )) ?? neutralMediaNotFound()
    );
  } catch (error) {
    return mediaRouteErrorResponse(error);
  }
}
