import "server-only";

import Image from "next/image";
import Link from "next/link";

import { safeHttpsUrl } from "./validation";

type Asset = {
  id: string;
  mediaType: string;
  readiness: "PENDING" | "READY" | "FAILED";
  width: number | null;
  height: number | null;
  durationMs: number | null;
};

type Row = {
  id: string;
  position: number;
  kind: string;
  title: string | null;
  caption: string | null;
  captureStage: string | null;
  permissionConfirmed: boolean | null;
  alternativeText: string | null;
  equivalentDescription: string | null;
  transcript: string | null;
  textLinkText: string | null;
  textLinkUrl: string | null;
  recordingAccessibilityMode: string | null;
  sourceAsset: Asset | null;
  posterAsset: Asset | null;
  captionTrackAsset: Asset | null;
};

function privateUrl(storyId: string, assetId: string) {
  return "/api/studio/work/" + encodeURIComponent(storyId) +
    "/media/" + encodeURIComponent(assetId);
}

export function OwnerMediaPreview({
  storyId, rows, cover, lead, figures, variant,
}: {
  storyId: string;
  variant: "candidate" | "published";
  rows: Row[];
  cover: string | null;
  lead: string | null;
  figures: string[];
}) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const isCandidate = variant === "candidate";
  const headingId = "owner-evidence-" + variant;
  return (
    <section className="flex min-w-0 flex-col gap-6" aria-labelledby={headingId}>
      <header className="flex flex-col gap-1">
        <h2 id={headingId} className="text-2xl font-semibold text-ink">
          {isCandidate ? "Saved candidate Evidence" : "Current public Evidence"}
        </h2>
        <p className="text-sm text-muted-ink">
          {isCandidate
            ? "Saved private candidate · visible only to the owner until published."
            : "Currently published snapshot · media here uses owner-authorized preview delivery."}
        </p>
        <p className="text-sm text-muted-ink">
          Discovery cover: {cover ? byId.get(cover)?.title || cover.slice(0, 8) : "Not selected"}
          {" · "}Lead: {lead ? byId.get(lead)?.title || lead.slice(0, 8) : "Not selected"}
        </p>
        {figures.length ? (
          <p className="text-sm text-muted-ink">
            Problem figures: {figures.map((id) => byId.get(id)?.title || id.slice(0, 8)).join(" → ")}
          </p>
        ) : null}
      </header>
      {rows.length ? rows.map((row) => {
        const source = row.sourceAsset;
        const poster = row.posterAsset;
        const available = source?.readiness === "READY";
        const isVideo = row.kind === "RECORDING";
        const isLink = row.kind === "TEXT_LINK";
        const validLink = Boolean(row.textLinkUrl && safeHttpsUrl(row.textLinkUrl));
        const confirmedLink = validLink && Boolean(row.textLinkText?.trim()) &&
          row.permissionConfirmed === true;
        return (
          <article key={row.id} className="flex min-w-0 flex-col gap-3 rounded-lg border border-boundary bg-surface p-4">
            <h3 className="text-xl font-semibold text-ink">
              {row.position + 1}. {row.title || row.kind.toLowerCase()} · {row.kind}
            </h3>
            <p className="text-sm text-muted-ink">
              {isLink ? "External reference" :
                row.captureStage?.replaceAll("_", " ").toLowerCase() || "Capture stage not confirmed"}
              {" · "}{isVideo
                ? row.recordingAccessibilityMode === "SILENT" ? "Silent demo" :
                  row.recordingAccessibilityMode ? "Meaningful audio" : "Accessibility review required"
                : isLink ? confirmedLink ? "HTTPS link · permission confirmed" :
                  !validLink ? "Link missing or invalid" :
                  !row.textLinkText?.trim() ? "Link text missing" : "HTTPS link · permission not confirmed"
                : available ? "Ready" : "Incomplete source"}
            </p>
            {row.kind === "TEXT_LINK" ? (
              confirmedLink && row.textLinkUrl ? (
                <Link className="break-all text-signal underline" href={row.textLinkUrl}>
                  {row.textLinkText || "Open external evidence"}
                </Link>
              ) : <p className="text-sm">Link requires text, a valid HTTPS URL and permission confirmation.</p>
            ) : isVideo ? (
              available && poster?.readiness === "READY" ? (
                <video
                  controls preload="none"
                  className="max-h-[70vh] w-full max-w-3xl object-contain"
                  poster={privateUrl(storyId, poster.id)}
                  aria-label={row.title || "Project recording"}
                >
                  <source src={privateUrl(storyId, source.id)} type={source.mediaType === "VIDEO" ? undefined : undefined} />
                  {row.captionTrackAsset?.readiness === "READY" ? (
                    <track kind="captions" src={privateUrl(storyId, row.captionTrackAsset.id)}
                      label="Captions" srcLang="en" />
                  ) : null}
                  Your browser cannot play this recording.
                </video>
              ) : (
                <p className="text-sm text-destructive">
                  {isCandidate
                    ? "Recording not ready or poster missing. Complete the saved candidate before publication."
                    : "Published recording preview unavailable: source or poster missing."}
                </p>
              )
            ) : available && source && source.width && source.height ? (
              <Image unoptimized src={privateUrl(storyId, source.id)}
                alt={row.alternativeText || ""} width={source.width} height={source.height}
                className="h-auto max-h-[70vh] w-full max-w-3xl object-contain" />
            ) : <p className="text-sm text-destructive">
              {isCandidate ? "Image not Ready or source missing." : "Published image preview unavailable or source missing."}
            </p>}
            {row.caption ? <p className="whitespace-pre-wrap text-sm text-ink">{row.caption}</p> : null}
            {row.equivalentDescription ? (
              <p className="whitespace-pre-wrap text-sm text-ink">{row.equivalentDescription}</p>
            ) : null}
            {row.transcript ? (
              <details><summary className="cursor-pointer text-sm font-medium">Transcript</summary>
                <p className="whitespace-pre-wrap text-sm">{row.transcript}</p></details>
            ) : null}
          </article>
        );
      }) : <p className="text-sm text-muted-ink">
        {isCandidate
          ? "No saved candidate Evidence. The Story remains complete as text."
          : "No Evidence in the current public snapshot. The Story remains complete as text."}
      </p>}
    </section>
  );
}
