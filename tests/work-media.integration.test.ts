import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { db } from "../lib/db";
import {
  StoryConflictError, StoryPublicationValidationError,
  createStory, saveStory, publishStory,
} from "../features/work/repository";
import { getPublicReadyMediaAsset } from "../features/work/media-repository";
import { writeStagedMedia, promoteStagedMedia } from "../features/work/media-storage";
import type { EvidenceDraftInput, StoryDraftInput } from "../features/work/types";
import { resetTestDatabase } from "./support/test-database";
import { resetTestMediaStorage } from "./support/test-media";

const storyDraft: StoryDraftInput = {
  title: "Owner media story",
  problem: "Show an interaction",
  contribution: "Built the interaction",
  progress: "COMPLETED",
  outcome: null,
  stack: ["React"],
  releaseHistory: "NEVER_SHIPPED",
  availability: "NO_LIVE_DESTINATION",
  liveDestinationUrl: null,
};

async function readyAsset(
  storyId: string,
  mediaType: "IMAGE" | "VIDEO" | "VTT",
  durationMs: number | null = null,
  vttBytes?: string,
) {
  const storageKey = randomUUID();
  if (vttBytes !== undefined) {
    await writeStagedMedia(storageKey, Buffer.from(vttBytes, "utf8"));
    await promoteStagedMedia(storageKey);
  }
  return db.mediaAsset.create({
    data: {
      id: randomUUID(), storyId, storageKey,
      originalFileName: mediaType === "VTT" ? "captions.vtt" :
        mediaType === "VIDEO" ? "capture.mp4" : "poster.png",
      mediaType,
      contentType: mediaType === "VTT" ? "text/vtt" :
        mediaType === "VIDEO" ? "video/mp4" : "image/png",
      byteSize: vttBytes?.length || 64, readiness: "READY",
      ...(mediaType === "VIDEO" ? { width: 640, height: 360, durationMs } :
        mediaType === "IMAGE" ? { width: 2, height: 2 } : {}),
    },
  });
}
const vtt = (end = "00:00:01.000") =>
  "WEBVTT\n\n00:00:00.000 --> " + end + "\nMeaningful speech\n";

function recording(id: string, sourceAssetId: string, patch: Partial<EvidenceDraftInput> = {}): EvidenceDraftInput {
  return {
    id, kind: "RECORDING", title: "Demo", caption: "Shows the UI",
    captureStage: "LOCAL_BUILD", permissionConfirmed: true,
    alternativeText: "Recording poster",
    equivalentDescription: "Starts closed, click Open, drawer moves in, drawer opens.",
    transcript: null, textLinkText: null, textLinkUrl: null,
    sourceAssetId, posterAssetId: null, captionTrackAssetId: null,
    recordingAccessibilityMode: null, confirmSourceAssetId: null,
    ...patch,
  };
}

async function saveRecording(
  storyId: string, revision: number, row: EvidenceDraftInput,
) {
  return saveStory(storyId, revision, {
    ...storyDraft, evidence: [row],
    discoveryCoverEvidenceId: row.id, leadEvidenceId: row.id,
    problemFigureEvidenceIds: [row.id],
  });
}
async function candidate(storyId: string) {
  return db.evidence.findFirstOrThrow({ where: { storyId } });
}

describe("owner media authoring and atomic publication", () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await resetTestMediaStorage();
  });

  it("keeps text-only and unknown release/availability facts publishable", async () => {
    const story = await createStory({
      title: "Text only", problem: "Problem", contribution: "Contribution",
      progress: "CANCELLED", outcome: null, stack: [],
    });
    await publishStory({
      storyId: story.id, expectedWorkingRevision: 1,
      expectedPublishedRevision: null,
    });
    const row = await db.publishedStory.findUniqueOrThrow({ where: { storyId: story.id } });
    expect(row.releaseHistory).toBeNull();
    expect(row.availability).toBeNull();
    expect(await db.publishedEvidence.count({ where: { storyId: story.id } })).toBe(0);
  });

  it("invalidates old SILENT attestation on VIDEO replacement despite forged Save fields", async () => {
    const story = await createStory(storyDraft);
    const a = await readyAsset(story.id, "VIDEO", 10_000);
    const poster = await readyAsset(story.id, "IMAGE");
    const b = await readyAsset(story.id, "VIDEO", 4_000);
    const eid = randomUUID();

    await saveRecording(story.id, 1, recording(eid, a.id, { posterAssetId: poster.id }));
    expect((await candidate(story.id)).recordingAccessibilityMode).toBeNull();

    await saveRecording(story.id, 2, recording(eid, a.id, {
      posterAssetId: poster.id, recordingAccessibilityMode: "SILENT",
      confirmSourceAssetId: a.id,
    }));
    await publishStory({
      storyId: story.id, expectedWorkingRevision: 3,
      expectedPublishedRevision: null,
    });
    expect(await getPublicReadyMediaAsset(a.id)).not.toBeNull();

    await saveRecording(story.id, 3, recording(eid, b.id, {
      posterAssetId: poster.id,
      recordingAccessibilityMode: "SILENT",
      confirmSourceAssetId: b.id,
      transcript: "stale audio claims",
    }));
    expect(await candidate(story.id)).toMatchObject({
      sourceAssetId: b.id, recordingAccessibilityMode: null,
      captionTrackAssetId: null, posterAssetId: null, transcript: null,
      equivalentDescription: null, captureStage: null,
      permissionConfirmed: null,
    });
    expect(await getPublicReadyMediaAsset(a.id)).not.toBeNull();
    await expect(publishStory({
      storyId: story.id, expectedWorkingRevision: 4,
      expectedPublishedRevision: 1,
    })).rejects.toBeInstanceOf(StoryPublicationValidationError);
    expect((await db.publishedEvidence.findFirstOrThrow({
      where: { storyId: story.id },
    })).sourceAssetId).toBe(a.id);

    const captionsB = await readyAsset(story.id, "VTT", null, vtt());
    await saveRecording(story.id, 4, recording(eid, b.id, {
      posterAssetId: poster.id, captionTrackAssetId: captionsB.id,
      recordingAccessibilityMode: "AUDIO_VISUALS_CONVEYED",
      confirmSourceAssetId: b.id, transcript: "Meaningful speech",
    }));
    const updated = await publishStory({
      storyId: story.id, expectedWorkingRevision: 5,
      expectedPublishedRevision: 1,
    });
    expect(updated.mode).toBe("updated");
    expect((await db.publishedEvidence.findFirstOrThrow({
      where: { storyId: story.id },
    })).sourceAssetId).toBe(b.id);
    expect(await getPublicReadyMediaAsset(a.id)).toBeNull();
    expect(await getPublicReadyMediaAsset(b.id)).not.toBeNull();
  });

  it("detaches old captions and rejects VTT cues beyond the new VIDEO duration", async () => {
    const story = await createStory(storyDraft);
    const eid = randomUUID();
    const a = await readyAsset(story.id, "VIDEO", 10_000);
    const b = await readyAsset(story.id, "VIDEO", 2_000);
    const poster = await readyAsset(story.id, "IMAGE");
    const trackA = await readyAsset(story.id, "VTT", null, vtt("00:00:05.000"));

    await saveRecording(story.id, 1, recording(eid, a.id));
    await saveRecording(story.id, 2, recording(eid, a.id, {
      posterAssetId: poster.id, captionTrackAssetId: trackA.id,
      transcript: "Meaningful speech",
      recordingAccessibilityMode: "AUDIO_VISUALS_CONVEYED",
      confirmSourceAssetId: a.id,
    }));
    await publishStory({
      storyId: story.id, expectedWorkingRevision: 3, expectedPublishedRevision: null,
    });

    await saveRecording(story.id, 3, recording(eid, b.id, {
      captionTrackAssetId: trackA.id,
      recordingAccessibilityMode: "AUDIO_VISUALS_CONVEYED",
      confirmSourceAssetId: b.id,
    }));
    expect((await candidate(story.id)).captionTrackAssetId).toBeNull();
    await saveRecording(story.id, 4, recording(eid, b.id, {
      posterAssetId: poster.id, captionTrackAssetId: trackA.id,
      transcript: "Meaningful speech",
      recordingAccessibilityMode: "AUDIO_VISUALS_CONVEYED",
      confirmSourceAssetId: b.id,
    }));
    await expect(publishStory({
      storyId: story.id, expectedWorkingRevision: 5, expectedPublishedRevision: 1,
    })).rejects.toBeInstanceOf(StoryPublicationValidationError);
    expect((await db.publishedEvidence.findFirstOrThrow({
      where: { storyId: story.id },
    })).sourceAssetId).toBe(a.id);

    const good = await readyAsset(story.id, "VTT", null, vtt());
    await saveRecording(story.id, 5, recording(eid, b.id, {
      posterAssetId: poster.id, captionTrackAssetId: good.id,
      transcript: "Meaningful speech",
      recordingAccessibilityMode: "AUDIO_VISUALS_CONVEYED",
      confirmSourceAssetId: b.id,
    }));
    await publishStory({
      storyId: story.id, expectedWorkingRevision: 6, expectedPublishedRevision: 1,
    });
    expect((await db.publishedEvidence.findFirstOrThrow({
      where: { storyId: story.id },
    })).captionTrackAssetId).toBe(good.id);
  });

  it("requires explicit source-bound confirmation and detects stale revisions", async () => {
    const story = await createStory(storyDraft);
    const source = await readyAsset(story.id, "VIDEO", 2_000);
    const poster = await readyAsset(story.id, "IMAGE");
    const id = randomUUID();
    await saveRecording(story.id, 1, recording(id, source.id));
    await expect(saveRecording(story.id, 2, recording(id, source.id, {
      posterAssetId: poster.id, recordingAccessibilityMode: "SILENT",
    }))).rejects.toThrow();
    await saveRecording(story.id, 2, recording(id, source.id, {
      posterAssetId: poster.id, recordingAccessibilityMode: "SILENT",
      confirmSourceAssetId: source.id,
    }));
    await expect(saveRecording(story.id, 2, recording(id, source.id)))
      .rejects.toBeInstanceOf(StoryConflictError);
    expect((await candidate(story.id)).recordingAccessibilityMode).toBe("SILENT");
  });
});
