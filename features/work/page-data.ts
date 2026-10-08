import "server-only";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

import {
  OwnerAuthorizationError,
  requireOwnerSession,
} from "@/lib/auth";

import {
  getOwnerStory,
  listOwnerStories,
} from "./owner";

async function requestHeaders(): Promise<Headers> {
  return new Headers(await headers());
}

export async function authorizeOwnerPage(): Promise<Headers> {
  const incomingHeaders = await requestHeaders();

  try {
    await requireOwnerSession(incomingHeaders);
  } catch (error) {
    if (error instanceof OwnerAuthorizationError) {
      notFound();
    }

    throw error;
  }

  return incomingHeaders;
}

export async function loadOwnerStoriesPage() {
  const incomingHeaders = await requestHeaders();

  try {
    return await listOwnerStories(incomingHeaders);
  } catch (error) {
    if (error instanceof OwnerAuthorizationError) {
      notFound();
    }

    throw error;
  }
}

export async function loadOwnerStoryPage(storyId: string) {
  const incomingHeaders = await requestHeaders();

  try {
    const story = await getOwnerStory(incomingHeaders, storyId);

    if (!story) {
      notFound();
    }

    return story;
  } catch (error) {
    if (error instanceof OwnerAuthorizationError) {
      notFound();
    }

    throw error;
  }
}

/** Owner-only media picker: ID and readiness metadata, never public. */
export async function loadOwnerMediaAssets(storyId: string) {
  await authorizeOwnerPage();
  const story = await db.story.findUnique({
    where: { id: storyId },
    select: { id: true },
  });
  if (!story) notFound();
  return db.mediaAsset.findMany({
    where: { storyId },
    select: {
      id: true, mediaType: true, readiness: true, originalFileName: true,
    },
    orderBy: { createdAt: "asc" },
  });
}
