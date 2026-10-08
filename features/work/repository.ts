import "server-only";

import { randomUUID } from "node:crypto";

import { db } from "@/lib/db";
import { publicationEvidenceErrors } from "./media-publication";

import type { StoryDraftInput, StoryField } from "./types";
import {
  storyDraftSchema,
  storyPublicationSchema,
  zodFieldErrors,
} from "./validation";

export class StoryCandidateValidationError extends Error {
  readonly fieldErrors: Partial<Record<StoryField, string[]>>;
  constructor(message: string) {
    super(message);
    this.name = "StoryCandidateValidationError";
    this.fieldErrors = { evidence: [message] };
  }
}

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
    if (error.code === "P2010" && "meta" in error &&
      typeof error.meta === "object" && error.meta !== null &&
      "code" in error.meta &&
      (error.meta.code === "40001" || error.meta.code === "40P01")) {
      return "P2034";
    }
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
  releaseHistory: StoryDraftInput["releaseHistory"];
  availability: StoryDraftInput["availability"];
  liveDestinationUrl: string | null;
}): StoryDraftInput {
  return {
    title: record.title,
    problem: record.problem,
    contribution: record.contribution,
    progress: record.progress,
    outcome: record.outcome,
    stack: record.stack,
    releaseHistory: record.releaseHistory,
    availability: record.availability,
    liveDestinationUrl: record.liveDestinationUrl,
  };
}

export async function createStory(input: StoryDraftInput) {
  const normalized = storyDraftSchema.parse(input);

  const { evidence: _evidence, discoveryCoverEvidenceId: _cover, leadEvidenceId: _lead, problemFigureEvidenceIds: _figures, ...scalars } = normalized;
  return db.story.create({
    data: {
      id: randomUUID(),
      ...scalars,
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
  const { evidence, discoveryCoverEvidenceId, leadEvidenceId, problemFigureEvidenceIds, ...scalars } = normalized;

  try {
    return await db.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "Story" WHERE "id" = ${storyId} FOR UPDATE
      `;
      if (!locked.length) throw new StoryNotFoundError();

      const saved = await tx.story.findUniqueOrThrow({
        where: { id: storyId },
        include: { evidence: true },
      });
      if (saved.workingRevision !== expectedWorkingRevision) {
        throw new StoryConflictError();
      }

      let candidates: NonNullable<typeof evidence> | undefined;
      if (evidence !== undefined) {
        if (new Set(evidence.map((e) => e.id)).size !== evidence.length) {
          throw new StoryCandidateValidationError("Evidence IDs must be unique.");
        }
        const previous = new Map(saved.evidence.map((e) => [e.id, e]));
        const known = await tx.evidence.findMany({
          where: { id: { in: evidence.map((e) => e.id) } },
          select: { id: true, storyId: true },
        });
        if (known.some((item) => item.storyId !== storyId)) {
          throw new StoryCandidateValidationError("An Evidence identity belongs to another Story.");
        }
        const ids = new Set(evidence.map((e) => e.id));
        const roles = [discoveryCoverEvidenceId, leadEvidenceId].filter(
          (id): id is string => Boolean(id),
        );
        if (roles.some((id) => !ids.has(id) ||
          !["IMAGE", "RECORDING"].includes(evidence.find((e) => e.id === id)!.kind))) {
          throw new StoryCandidateValidationError("Cover and lead require same-Story image or recording Evidence.");
        }
        const figures = problemFigureEvidenceIds ?? [];
        if (new Set(figures).size !== figures.length ||
          figures.some((id) => !ids.has(id))) {
          throw new StoryCandidateValidationError("Problem figures must be distinct, same-Story Evidence.");
        }
        const assetIds = Array.from(new Set(evidence.flatMap((e) =>
          [e.sourceAssetId, e.posterAssetId, e.captionTrackAssetId].filter(
            (id): id is string => Boolean(id),
          ))));
        const assets = await tx.mediaAsset.findMany({
          where: { id: { in: assetIds } },
        });
        const byAsset = new Map(assets.map((asset) => [asset.id, asset]));
        candidates = evidence.map((e) => {
          const assetOf = (id: string | null, type: "IMAGE" | "VIDEO" | "VTT") => {
            if (!id) return;
            const asset = byAsset.get(id);
            if (!asset || asset.storyId !== storyId || asset.mediaType !== type) {
              throw new StoryCandidateValidationError("Evidence attachments must match this Story and media kind.");
            }
          };
          assetOf(e.sourceAssetId, e.kind === "RECORDING" ? "VIDEO" : "IMAGE");
          assetOf(e.posterAssetId, "IMAGE");
          assetOf(e.captionTrackAssetId, "VTT");
          if (e.kind === "TEXT_LINK" && (e.sourceAssetId || e.posterAssetId || e.captionTrackAssetId)) {
            throw new StoryCandidateValidationError("Text-link Evidence cannot attach binary media.");
          }
          if (e.kind !== "RECORDING" && (e.posterAssetId || e.captionTrackAssetId || e.recordingAccessibilityMode)) {
            throw new StoryCandidateValidationError("Recording-specific fields require recording Evidence.");
          }
          const old = previous.get(e.id);
          const changedSource = e.kind === "RECORDING" &&
            (old?.sourceAssetId ?? null) !== e.sourceAssetId;
          if (changedSource) {
            return {
              ...e,
              recordingAccessibilityMode: null,
              captionTrackAssetId: null,
              transcript: null,
              equivalentDescription: null,
              posterAssetId: null,
              alternativeText: null,
              captureStage: null,
              permissionConfirmed: null,
            };
          }
          if (e.kind === "RECORDING" && e.recordingAccessibilityMode &&
            (e.recordingAccessibilityMode !== old?.recordingAccessibilityMode) &&
            (!e.sourceAssetId || e.confirmSourceAssetId !== e.sourceAssetId)) {
            throw new StoryCandidateValidationError(
              "Confirm the sound/accessibility facts for this exact current video before saving.",
            );
          }
          return e;
        });
      }

      const updated = await tx.story.updateMany({
        where: { id: storyId, workingRevision: expectedWorkingRevision },
        data: {
          ...scalars,
          ...(candidates !== undefined
            ? { discoveryCoverEvidenceId: null, leadEvidenceId: null }
            : {}),
          workingRevision: { increment: 1 },
        },
      });
      if (updated.count !== 1) throw new StoryConflictError();

      if (candidates !== undefined) {
        // Remove outgoing FK dependents first. Recreate with *same* stable Evidence IDs.
        await tx.storyProblemFigure.deleteMany({ where: { storyId } });
        await tx.evidence.deleteMany({ where: { storyId } });
        if (candidates.length) {
          await tx.evidence.createMany({
            data: candidates.map((e, position) => ({
              id: e.id,
              storyId,
              position,
              kind: e.kind,
              title: e.title,
              caption: e.caption,
              captureStage: e.captureStage,
              permissionConfirmed: e.permissionConfirmed,
              alternativeText: e.alternativeText,
              equivalentDescription: e.equivalentDescription,
              transcript: e.transcript,
              textLinkText: e.textLinkText,
              textLinkUrl: e.textLinkUrl,
              sourceAssetId: e.sourceAssetId,
              posterAssetId: e.posterAssetId,
              captionTrackAssetId: e.captionTrackAssetId,
              recordingAccessibilityMode: e.recordingAccessibilityMode,
            })),
          });
        }
        if (problemFigureEvidenceIds?.length) {
          await tx.storyProblemFigure.createMany({
            data: problemFigureEvidenceIds.map((evidenceId, position) => ({
              storyId, evidenceId, position,
            })),
          });
        }
        await tx.story.update({
          where: { id: storyId },
          data: {
            discoveryCoverEvidenceId: discoveryCoverEvidenceId ?? null,
            leadEvidenceId: leadEvidenceId ?? null,
          },
        });
      }

      return tx.story.findUniqueOrThrow({
        where: { id: storyId },
        include: { published: true },
      });
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    if (error instanceof StoryNotFoundError || error instanceof StoryConflictError ||
      error instanceof StoryCandidateValidationError) throw error;
    if (["P2034", "P2002", "P2003"].includes(errorCode(error) ?? "")) {
      throw new StoryConflictError();
    }
    throw error;
  }
}

export async function publishStory(input: {
  storyId: string;
  expectedWorkingRevision: number;
  expectedPublishedRevision: number | null;
}) {
  try {
    return await db.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "Story" WHERE "id" = ${input.storyId} FOR UPDATE
      `;
      if (locked.length !== 1) throw new StoryNotFoundError();

      const story = await tx.story.findUniqueOrThrow({
        where: { id: input.storyId },
        include: {
          evidence: {
            orderBy: { position: "asc" },
            include: { sourceAsset: true, posterAsset: true, captionTrackAsset: true },
          },
        },
      });
      if (story.workingRevision !== input.expectedWorkingRevision) {
        throw new StoryConflictError();
      }
      const current = await tx.publishedStory.findUnique({
        where: { storyId: input.storyId },
      });
      if (input.expectedPublishedRevision === null ? Boolean(current) :
        !current || current.revision !== input.expectedPublishedRevision) {
        throw new StoryConflictError();
      }

      const candidate = storyPublicationSchema.safeParse(toDraft(story));
      if (!candidate.success) {
        throw new StoryPublicationValidationError(zodFieldErrors(candidate.error));
      }
      const figures = await tx.storyProblemFigure.findMany({
        where: { storyId: story.id },
        orderBy: { position: "asc" },
      });
      const mediaErrors = await publicationEvidenceErrors(
        story.evidence,
        story.discoveryCoverEvidenceId,
        story.leadEvidenceId,
        figures.map((f) => f.evidenceId),
      );
      if (mediaErrors.length) {
        throw new StoryPublicationValidationError({ evidence: mediaErrors });
      }

      // The Story lock + Serializable isolation binds all validated refs to
      // one source revision. Outgoing role references are cleared before
      // deleting old published Evidence to satisfy composite foreign keys.
      const scalars = {
        title: candidate.data.title,
        problem: candidate.data.problem,
        contribution: candidate.data.contribution,
        progress: candidate.data.progress,
        outcome: candidate.data.outcome,
        stack: candidate.data.stack,
        releaseHistory: candidate.data.releaseHistory ?? null,
        availability: candidate.data.availability ?? null,
        liveDestinationUrl: candidate.data.liveDestinationUrl ?? null,
        sourceWorkingRevision: story.workingRevision,
      };
      if (!current) {
        await tx.publishedStory.create({
          data: { storyId: story.id, ...scalars },
        });
      } else {
        await tx.publishedStory.update({
          where: { storyId: story.id },
          data: {
            ...scalars,
            discoveryCoverEvidenceId: null,
            leadEvidenceId: null,
            revision: { increment: 1 },
          },
        });
        await tx.publishedStoryProblemFigure.deleteMany({ where: { storyId: story.id } });
        await tx.publishedEvidence.deleteMany({ where: { storyId: story.id } });
      }

      if (story.evidence.length) {
        await tx.publishedEvidence.createMany({
          data: story.evidence.map((e) => ({
            id: e.id,
            storyId: story.id,
            kind: e.kind,
            position: e.position,
            title: e.title,
            caption: e.caption,
            captureStage: e.captureStage,
            permissionConfirmed: e.permissionConfirmed,
            alternativeText: e.alternativeText,
            equivalentDescription: e.equivalentDescription,
            transcript: e.transcript,
            textLinkText: e.textLinkText,
            textLinkUrl: e.textLinkUrl,
            sourceAssetId: e.sourceAssetId,
            posterAssetId: e.posterAssetId,
            captionTrackAssetId: e.captionTrackAssetId,
            recordingAccessibilityMode: e.recordingAccessibilityMode,
          })),
        });
      }
      if (figures.length) {
        await tx.publishedStoryProblemFigure.createMany({
          data: figures.map((f) => ({
            storyId: story.id, evidenceId: f.evidenceId, position: f.position,
          })),
        });
      }
      const snapshot = await tx.publishedStory.update({
        where: { storyId: story.id },
        data: {
          discoveryCoverEvidenceId: story.discoveryCoverEvidenceId,
          leadEvidenceId: story.leadEvidenceId,
        },
      });
      return { mode: current ? ("updated" as const) : ("published" as const), snapshot };
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    if (error instanceof StoryConflictError || error instanceof StoryNotFoundError ||
      error instanceof StoryPublicationValidationError) throw error;
    if (errorCode(error) === "P2034" || errorCode(error) === "P2002") {
      throw new StoryConflictError();
    }
    throw error;
  }
}

export async function listStoryWorkingCopies() {
  return db.story.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    include: { published: true, _count: { select: { evidence: true } } },
  });
}

export async function getStoryWorkingCopy(storyId: string) {
  return db.story.findUnique({
    where: { id: storyId },
    include: {
      published: {
        include: {
          evidence: { orderBy: { position: "asc" }, include: {
            sourceAsset: true, posterAsset: true, captionTrackAsset: true,
          } },
        },
      },
      evidence: { orderBy: { position: "asc" }, include: {
        sourceAsset: true, posterAsset: true, captionTrackAsset: true,
        problemFigures: true,
      } },
    },
  });
}

/** Caller must authorize owner before exposing candidate validation details. */
export async function getStoryPublicationMediaErrors(storyId: string) {
  const story = await db.story.findUnique({
    where: { id: storyId },
    include: {
      evidence: {
        orderBy: { position: "asc" },
        include: { sourceAsset: true, posterAsset: true, captionTrackAsset: true },
      },
    },
  });
  if (!story) throw new StoryNotFoundError();
  const figures = await db.storyProblemFigure.findMany({
    where: { storyId },
    orderBy: { position: "asc" },
  });
  return publicationEvidenceErrors(story.evidence,
    story.discoveryCoverEvidenceId, story.leadEvidenceId,
    figures.map((figure) => figure.evidenceId));
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
