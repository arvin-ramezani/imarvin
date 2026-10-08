import "server-only";

import { randomUUID } from "node:crypto";

import { db } from "@/lib/db";

import type { StoryDraftInput, StoryField } from "./types";
import {
  storyDraftSchema,
  storyPublicationSchema,
  zodFieldErrors,
} from "./validation";

export class StoryConflictError extends Error {
  constructor() {
    super("Story revision conflict");
    this.name = "StoryConflictError";
  }
}

export class StoryNotFoundError extends Error {
  constructor() {
    super("Story not found");
    this.name = "StoryNotFoundError";
  }
}

export class StoryPublicationValidationError extends Error {
  readonly fieldErrors: Partial<Record<StoryField, string[]>>;

  constructor(fieldErrors: Partial<Record<StoryField, string[]>>) {
    super("Story is not ready to publish");
    this.name = "StoryPublicationValidationError";
    this.fieldErrors = fieldErrors;
  }
}

function errorCode(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return null;
}

function toDraft(record: {
  title: string;
  problem: string;
  contribution: string;
  progress: StoryDraftInput["progress"];
  outcome: string | null;
  stack: string[];
}): StoryDraftInput {
  return {
    title: record.title,
    problem: record.problem,
    contribution: record.contribution,
    progress: record.progress,
    outcome: record.outcome,
    stack: record.stack,
  };
}

export async function createStory(input: StoryDraftInput) {
  const normalized = storyDraftSchema.parse(input);

  return db.story.create({
    data: {
      id: randomUUID(),
      ...normalized,
    },
    include: { published: true },
  });
}

export async function saveStory(
  storyId: string,
  expectedWorkingRevision: number,
  input: StoryDraftInput,
) {
  const normalized = storyDraftSchema.parse(input);
  const result = await db.story.updateMany({
    where: {
      id: storyId,
      workingRevision: expectedWorkingRevision,
    },
    data: {
      ...normalized,
      workingRevision: { increment: 1 },
    },
  });

  if (result.count !== 1) {
    throw new StoryConflictError();
  }

  const story = await db.story.findUnique({
    where: { id: storyId },
    include: { published: true },
  });

  if (!story) {
    throw new StoryNotFoundError();
  }

  return story;
}

export async function publishStory(input: {
  storyId: string;
  expectedWorkingRevision: number;
  expectedPublishedRevision: number | null;
}) {
  try {
    return await db.$transaction(
      async (tx) => {
        const lockedRows = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id"
          FROM "Story"
          WHERE "id" = ${input.storyId}
          FOR UPDATE
        `;

        if (lockedRows.length !== 1) {
          throw new StoryNotFoundError();
        }

        const story = await tx.story.findUnique({
          where: { id: input.storyId },
        });

        if (!story) {
          throw new StoryNotFoundError();
        }

        if (story.workingRevision !== input.expectedWorkingRevision) {
          throw new StoryConflictError();
        }

        const currentPublic = await tx.publishedStory.findUnique({
          where: { storyId: input.storyId },
        });

        if (input.expectedPublishedRevision === null) {
          if (currentPublic) {
            throw new StoryConflictError();
          }
        } else if (
          !currentPublic ||
          currentPublic.revision !== input.expectedPublishedRevision
        ) {
          throw new StoryConflictError();
        }

        const candidate = storyPublicationSchema.safeParse(toDraft(story));

        if (!candidate.success) {
          throw new StoryPublicationValidationError(
            zodFieldErrors(candidate.error),
          );
        }

        if (!currentPublic) {
          const snapshot = await tx.publishedStory.create({
            data: {
              storyId: story.id,
              ...candidate.data,
              sourceWorkingRevision: story.workingRevision,
            },
          });

          return { mode: "published" as const, snapshot };
        }

        const updated = await tx.publishedStory.updateMany({
          where: {
            storyId: story.id,
            revision: input.expectedPublishedRevision ?? -1,
          },
          data: {
            ...candidate.data,
            sourceWorkingRevision: story.workingRevision,
            revision: { increment: 1 },
          },
        });

        if (updated.count !== 1) {
          throw new StoryConflictError();
        }

        const snapshot = await tx.publishedStory.findUnique({
          where: { storyId: story.id },
        });

        if (!snapshot) {
          throw new StoryConflictError();
        }

        return { mode: "updated" as const, snapshot };
      },
      {
        isolationLevel: "Serializable",
      },
    );
  } catch (error) {
    if (
      error instanceof StoryConflictError ||
      error instanceof StoryNotFoundError ||
      error instanceof StoryPublicationValidationError
    ) {
      throw error;
    }

    if (errorCode(error) === "P2034" || errorCode(error) === "P2002") {
      throw new StoryConflictError();
    }

    throw error;
  }
}

export async function listStoryWorkingCopies() {
  return db.story.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    include: { published: true },
  });
}

export async function getStoryWorkingCopy(storyId: string) {
  return db.story.findUnique({
    where: { id: storyId },
    include: { published: true },
  });
}

export async function listPublishedStories() {
  return db.publishedStory.findMany({
    orderBy: [{ publishedAt: "desc" }, { storyId: "asc" }],
  });
}

export async function getPublishedStory(storyId: string) {
  return db.publishedStory.findUnique({
    where: { storyId },
  });
}
