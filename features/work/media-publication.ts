import "server-only";

import { readMediaBytes } from "./media-storage";
import { validateMediaBytes } from "./media-validation";
import { safeHttpsUrl } from "./validation";

type Asset = {
  id: string;
  storyId: string;
  mediaType: "IMAGE" | "VIDEO" | "VTT";
  readiness: "PENDING" | "READY" | "FAILED";
  durationMs: number | null;
  storageKey: string;
};

export type PublicationEvidence = {
  id: string;
  storyId: string;
  kind: "IMAGE" | "RECORDING" | "DIAGRAM" | "TEXT_LINK";
  title: string | null;
  caption: string | null;
  permissionConfirmed: boolean | null;
  captureStage: string | null;
  alternativeText: string | null;
  equivalentDescription: string | null;
  transcript: string | null;
  recordingAccessibilityMode:
    | "SILENT" | "AUDIO_VISUALS_CONVEYED" | "AUDIO_DESCRIPTION_INCLUDED" | null;
  textLinkText: string | null;
  textLinkUrl: string | null;
  sourceAsset: Asset | null;
  posterAsset: Asset | null;
  captionTrackAsset: Asset | null;
};

function ready(asset: Asset | null, storyId: string, type: Asset["mediaType"]) {
  return asset?.storyId === storyId && asset.mediaType === type &&
    asset.readiness === "READY";
}

/** Publication checks use persisted metadata and the current stored VTT bytes. */
export async function publicationEvidenceErrors(
  rows: PublicationEvidence[],
  cover: string | null,
  lead: string | null,
  figures: string[],
): Promise<string[]> {
  const errors: string[] = [];
  const byId = new Map(rows.map((row) => [row.id, row]));
  if (byId.size !== rows.length) errors.push("Evidence identities must be unique.");
  for (const [label, id] of [["Discovery cover", cover], ["Lead", lead]] as const) {
    if (!id) continue;
    const row = byId.get(id);
    if (!row || !["IMAGE", "RECORDING"].includes(row.kind)) {
      errors.push(label + " must reference an image or recording in this Story.");
    }
  }
  if (new Set(figures).size !== figures.length ||
    figures.some((id) => !byId.has(id))) {
    errors.push("Problem figures must reference distinct Evidence in this Story.");
  }

  for (const row of rows) {
    const label = row.title?.trim() || "Evidence " + row.id.slice(0, 8);
    const bad = (reason: string) => errors.push(label + ": " + reason);
    if (row.permissionConfirmed !== true) bad("confirm permission to publish.");
    if (row.kind !== "TEXT_LINK" && !row.captureStage) bad("confirm capture stage.");
    if (row.kind === "TEXT_LINK") {
      if (!row.textLinkText?.trim() || !row.textLinkUrl ||
        !safeHttpsUrl(row.textLinkUrl)) bad("add confirmed link text and HTTPS URL.");
      if (row.sourceAsset || row.posterAsset || row.captionTrackAsset ||
        row.recordingAccessibilityMode) bad("text links cannot contain media attachments.");
      continue;
    }
    if (!ready(row.sourceAsset, row.storyId,
      row.kind === "RECORDING" ? "VIDEO" : "IMAGE")) {
      bad("select a Ready source owned by this Story.");
    }
    if (row.kind !== "RECORDING") {
      if (!row.alternativeText?.trim()) bad("add meaningful image alternative text.");
      if (row.posterAsset || row.captionTrackAsset || row.recordingAccessibilityMode) {
        bad("image/diagram cannot have recording-specific metadata.");
      }
      if (row.kind === "DIAGRAM" && !row.equivalentDescription?.trim()) {
        bad("describe the important diagram relationships.");
      }
      continue;
    }

    if (!ready(row.posterAsset, row.storyId, "IMAGE")) {
      bad("select a Ready recording poster.");
    }
    if (!row.equivalentDescription?.trim()) {
      bad("describe the visual state, action, transition and result.");
    }
    if (!row.recordingAccessibilityMode) {
      bad("review this exact video and confirm its audio accessibility mode.");
    }
    const meaningful = row.recordingAccessibilityMode === "AUDIO_VISUALS_CONVEYED" ||
      row.recordingAccessibilityMode === "AUDIO_DESCRIPTION_INCLUDED";
    if (meaningful && !row.transcript?.trim()) {
      bad("provide a transcript of meaningful speech and sound.");
    }
    if (meaningful && !ready(row.captionTrackAsset, row.storyId, "VTT")) {
      bad("attach a Ready synchronized WebVTT caption track for this source.");
    }
    if (row.captionTrackAsset) {
      if (!ready(row.captionTrackAsset, row.storyId, "VTT")) {
        bad("attached caption track must be Ready and owned by this Story.");
      } else if (!ready(row.sourceAsset, row.storyId, "VIDEO") ||
        row.sourceAsset?.durationMs === null) {
        bad("cannot validate captions without a Ready video duration.");
      } else {
        try {
          const bytes = await readMediaBytes(row.captionTrackAsset.storageKey);
          if (!bytes) throw new Error("Missing private caption bytes");
          const file = new File([new Uint8Array(bytes)], "captions.vtt", {
            type: "text/vtt",
          });
          await validateMediaBytes(file, bytes, row.sourceAsset.durationMs);
        } catch {
          bad("caption cues are unavailable or invalid for this video's duration.");
        }
      }
    }
  }
  return errors;
}
