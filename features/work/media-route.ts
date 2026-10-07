import "server-only";

import { OwnerAuthorizationError } from "@/lib/auth";
import { logEvent } from "@/lib/logging/logger";

import { MediaRequestError } from "./media-http";
import {
  MediaAssetNotFoundError,
  MediaAssetReferencedError,
  MediaStoryNotFoundError,
  MediaStorageWriteError,
  MediaUploadConflictError,
  MediaValidationError,
} from "./media-service";

export function neutralMediaNotFound(): Response {
  return new Response("Not found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function mediaRouteErrorResponse(error: unknown): Response {
  if (error instanceof OwnerAuthorizationError) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (error instanceof MediaRequestError) {
    return new Response(error.message, {
      status: error.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (
    error instanceof MediaStoryNotFoundError ||
    error instanceof MediaAssetNotFoundError
  ) {
    return neutralMediaNotFound();
  }

  if (
    error instanceof MediaAssetReferencedError ||
    error instanceof MediaUploadConflictError
  ) {
    return new Response("Conflict", {
      status: 409,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (error instanceof MediaStorageWriteError) {
    return new Response("Media storage failed", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (error instanceof MediaValidationError) {
    const status =
      error.code === "FILE_TOO_LARGE" ||
      error.code === "MEDIA_LIMIT_EXCEEDED"
        ? 413
        : 400;

    return new Response("Invalid media", {
      status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  logEvent("error", "media_route_failed", {});
  return new Response("Media request failed", {
    status: 500,
    headers: { "Cache-Control": "no-store" },
  });
}
