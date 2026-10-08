import "server-only";

import { OwnerAuthorizationError, requireOwnerSession } from "@/lib/auth";
import { getServerConfig } from "@/lib/config/server";

import {
  createStory,
  getStoryWorkingCopy,
  listStoryWorkingCopies,
  publishStory,
  saveStory,
} from "./repository";
import type { StoryDraftInput } from "./types";

export async function listOwnerStories(requestHeaders: Headers) {
  await requireOwnerSession(requestHeaders);

  return listStoryWorkingCopies();
}

export async function getOwnerStory(
  requestHeaders: Headers,
  storyId: string,
) {
  await requireOwnerSession(requestHeaders);

  return getStoryWorkingCopy(storyId);
}

export async function createOwnerStory(
  requestHeaders: Headers,
  input: StoryDraftInput,
) {
  await requireOwnerSession(requestHeaders);

  return createStory(input);
}

export async function saveOwnerStory(
  requestHeaders: Headers,
  storyId: string,
  expectedWorkingRevision: number,
  input: StoryDraftInput,
) {
  await requireOwnerSession(requestHeaders);

  // Media-reference writes require a same-origin request, beyond cookie auth.
  if (input.evidence !== undefined) {
    const origin = requestHeaders.get("origin");
    const fetchSite = requestHeaders.get("sec-fetch-site");
    if (origin !== new URL(getServerConfig().APP_ORIGIN).origin ||
      fetchSite?.toLowerCase() === "cross-site") {
      throw new OwnerAuthorizationError();
    }
  }
  return saveStory(storyId, expectedWorkingRevision, input);
}

export async function publishOwnerStory(
  requestHeaders: Headers,
  input: {
    storyId: string;
    expectedWorkingRevision: number;
    expectedPublishedRevision: number | null;
  },
) {
  await requireOwnerSession(requestHeaders);

  return publishStory(input);
}
