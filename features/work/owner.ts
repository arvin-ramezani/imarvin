import "server-only";

import { requireOwnerSession } from "@/lib/auth";

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
