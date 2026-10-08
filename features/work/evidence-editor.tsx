"use client";

import { useId, useState } from "react";
import type { EvidenceDraftInput } from "./types";

type MediaEntry = {
  id: string;
  mediaType: "IMAGE" | "VIDEO" | "VTT";
  readiness: "PENDING" | "READY" | "FAILED";
  originalFileName: string;
};

const control =
  "min-h-11 w-full min-w-0 rounded-md border border-boundary bg-canvas px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const emptyEvidence = (kind: EvidenceDraftInput["kind"]): EvidenceDraftInput => ({
  id: crypto.randomUUID(), kind, title: null, caption: null,
  captureStage: null, permissionConfirmed: null,
  alternativeText: null, equivalentDescription: null,
  transcript: null, textLinkText: null, textLinkUrl: null,
  sourceAssetId: null, posterAssetId: null, captionTrackAssetId: null,
  recordingAccessibilityMode: null, confirmSourceAssetId: null,
});

export function EvidenceEditor({
  storyId, initialEvidence, initialCover, initialLead, initialFigures,
  initialAssets,
}: {
  storyId: string;
  initialEvidence: EvidenceDraftInput[];
  initialCover: string | null;
  initialLead: string | null;
  initialFigures: string[];
  initialAssets: MediaEntry[];
}) {
  const id = useId();
  const [rows, setRows] = useState(initialEvidence);
  const [assets, setAssets] = useState(initialAssets);
  const [cover, setCover] = useState(initialCover ?? "");
  const [lead, setLead] = useState(initialLead ?? "");
  const [figures, setFigures] = useState(initialFigures);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const change = (evidenceId: string, patch: Partial<EvidenceDraftInput>) =>
    setRows((previous) => previous.map((row) =>
      row.id === evidenceId ? { ...row, ...patch } : row));

  function reorder(index: number, offset: number) {
    const next = index + offset;
    if (next < 0 || next >= rows.length) return;
    setRows((previous) => {
      const reordered = [...previous];
      [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
      return reordered;
    });
    setNotice("Evidence moved to position " + (next + 1) + " of " + rows.length + ".");
  }

  function remove(evidenceId: string) {
    const used = [
      cover === evidenceId ? "discovery cover" : "",
      lead === evidenceId ? "lead" : "",
      figures.includes(evidenceId) ? "Problem figure" : "",
    ].filter(Boolean);
    if (used.length && !window.confirm(
      "Removing this Evidence will clear its " + used.join(", ") +
      " references on the next private Save. Continue?",
    )) return;
    setRows((previous) => previous.filter((row) => row.id !== evidenceId));
    if (cover === evidenceId) setCover("");
    if (lead === evidenceId) setLead("");
    setFigures((previous) => previous.filter((v) => v !== evidenceId));
    setNotice("Evidence removed from unsaved candidate. Save privately to apply.");
  }

  async function upload(
    row: EvidenceDraftInput,
    field: "sourceAssetId" | "posterAssetId" | "captionTrackAssetId",
    file: File,
    failedId?: string,
  ) {
    setBusy(row.id + field);
    setNotice("");
    try {
      const data = new FormData();
      data.set("file", file);
      if (field === "captionTrackAssetId") data.set("recordingEvidenceId", row.id);
      const endpoint = "/api/studio/work/" + encodeURIComponent(storyId) +
        "/media" + (failedId ? "/" + encodeURIComponent(failedId) + "/retry" : "");
      const response = await fetch(endpoint, { method: "POST", body: data });
      if (!response.ok) throw new Error("Upload rejected (" + response.status + "). Check file format/size or retry.");
      const asset = await response.json() as MediaEntry;
      setAssets((old) => [...old.filter((item) => item.id !== asset.id), {
        ...asset, originalFileName: file.name,
      }]);
      const isReplacement = field === "sourceAssetId" && row.kind === "RECORDING" &&
        row.sourceAssetId !== asset.id;
      if (isReplacement && row.sourceAssetId) {
        setNotice("Video source changed. Save privately to reset previous accessibility review, poster, captions and permission, then review this video on a later Save.");
      } else {
        setNotice("Upload Ready. Save privately to attach this asset to the candidate.");
      }
      change(row.id, {
        [field]: asset.id,
        ...(isReplacement ? {
          recordingAccessibilityMode: null,
          captionTrackAssetId: null, transcript: null,
          equivalentDescription: null, posterAssetId: null,
          alternativeText: null, captureStage: null,
          permissionConfirmed: null, confirmSourceAssetId: null,
        } : {}),
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Upload failed; your text is retained.");
    } finally {
      setBusy(null);
    }
  }

  const figureMove = (index: number, offset: number) => {
    const next = index + offset;
    if (next < 0 || next >= figures.length) return;
    setFigures((old) => {
      const changed = [...old];
      [changed[index], changed[next]] = [changed[next], changed[index]];
      return changed;
    });
    setNotice("Problem figure moved to position " + (next + 1) + ".");
  };
  const choices = rows.filter((row) => row.kind === "IMAGE" || row.kind === "RECORDING");

  return (
    <section className="flex min-w-0 flex-col gap-5 rounded-lg border border-boundary bg-surface p-5 md:p-6" aria-labelledby={id}>
      <input type="hidden" name="evidenceJson" value={JSON.stringify(rows)} />
      <input type="hidden" name="discoveryCoverEvidenceId" value={cover} />
      <input type="hidden" name="leadEvidenceId" value={lead} />
      <input type="hidden" name="problemFigureEvidenceIds" value={figures.join(",")} />
      <header className="space-y-2">
        <h2 id={id} className="text-2xl font-semibold text-ink">Evidence and media</h2>
        <p className="text-sm leading-6 text-muted-ink">
          Uploads remain private. Save to attach media, preview the saved candidate, then separately publish. A recording source change always requires a second Save to reconfirm its accessibility facts.
        </p>
      </header>
      <p aria-live="polite" role="status" className="text-sm text-muted-ink">{notice}</p>
      <div className="flex flex-wrap gap-2">
        {(["IMAGE", "RECORDING", "DIAGRAM", "TEXT_LINK"] as const).map((kind) => (
          <button key={kind} type="button" className="min-h-11 rounded-md border border-boundary px-3 py-2 text-sm font-medium text-ink" onClick={() => {
            setRows((previous) => [...previous, emptyEvidence(kind)]);
            setNotice(kind + " Evidence added. Save privately when ready.");
          }}>Add {kind.toLowerCase().replace("_", " ")}</button>
        ))}
      </div>
      {rows.map((row, index) => {
        const name = row.title?.trim() || row.kind.toLowerCase() + " " + (index + 1);
        const assetFor = (assetId: string | null) => assets.find((asset) => asset.id === assetId);
        const editor = (label: string, field: keyof EvidenceDraftInput, multiline = false) => (
          <label className="flex min-w-0 flex-col gap-1 text-sm font-medium text-ink">
            {label}
            {multiline ? (
              <textarea className={control} rows={3} value={String(row[field] ?? "")}
                onChange={(e) => change(row.id, { [field]: e.target.value || null })} />
            ) : (
              <input className={control} value={String(row[field] ?? "")}
                onChange={(e) => change(row.id, { [field]: e.target.value || null })} />
            )}
          </label>
        );
        const assetSelect = (
          field: "sourceAssetId" | "posterAssetId" | "captionTrackAssetId",
          type: MediaEntry["mediaType"], label: string,
        ) => (
          <div className="flex min-w-0 flex-col gap-2">
            <label className="flex min-w-0 flex-col gap-1 text-sm font-medium text-ink">
              {label}
              <select className={control} value={row[field] ?? ""} onChange={(event) => {
                const nextId = event.target.value || null;
                const changedVideo = field === "sourceAssetId" && row.kind === "RECORDING" &&
                  nextId !== row.sourceAssetId;
                if (changedVideo && row.sourceAssetId &&
                  !window.confirm("Replacing the video invalidates all confirmed accessibility/captions/poster and permission. Continue?")) return;
                change(row.id, {
                  [field]: nextId,
                  ...(changedVideo ? {
                    recordingAccessibilityMode: null, captionTrackAssetId: null,
                    transcript: null, equivalentDescription: null,
                    posterAssetId: null, alternativeText: null,
                    captureStage: null, permissionConfirmed: null,
                    confirmSourceAssetId: null,
                  } : {}),
                });
                if (changedVideo) setNotice("Video source changed. Save the reset before re-attesting.");
              }}>
                <option value="">Not selected</option>
                {assets.filter((a) => a.mediaType === type).map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.originalFileName} · {asset.readiness} · {asset.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-muted-ink">
              Upload {label.toLowerCase()} (normal file picker)
              <input className="mt-2 block w-full min-w-0 text-sm" type="file"
                accept={type === "IMAGE" ? ".png,.jpg,.jpeg,.webp" : type === "VIDEO" ? ".mp4,.webm" : ".vtt"}
                disabled={Boolean(busy)}
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) void upload(row, field, file);
                }} />
            </label>
            <p className="text-xs text-muted-ink">
              {busy === row.id + field ? "Uploading…" :
                assetFor(row[field]) ? "Selected: " + assetFor(row[field])?.readiness : "No selected asset"}
              {field === "captionTrackAssetId" ? ". Save a Ready video source first; captions require its current duration." : ""}
            </p>
            {assetFor(row[field])?.readiness === "FAILED" ? (
              <p className="text-sm text-destructive">Upload failed. Select the same asset and use the retry endpoint before publication.</p>
            ) : null}
          </div>
        );
        return (
          <fieldset key={row.id} className="flex min-w-0 flex-col gap-4 rounded-md border border-boundary p-4">
            <legend className="px-1 text-base font-semibold text-ink">
              {index + 1}. {name} · {row.kind}
            </legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={index === 0} onClick={() => reorder(index, -1)} className="min-h-11 rounded border px-3 text-sm disabled:opacity-50">Move up</button>
              <button type="button" disabled={index === rows.length - 1} onClick={() => reorder(index, 1)} className="min-h-11 rounded border px-3 text-sm disabled:opacity-50">Move down</button>
              <button type="button" className="min-h-11 rounded border border-destructive px-3 text-sm text-destructive" onClick={() => remove(row.id)}>Remove from candidate</button>
            </div>
            {editor("Evidence title", "title")}
            {editor("Purpose / caption", "caption", true)}
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              Confirmed capture stage
              <select className={control} value={row.captureStage ?? ""} onChange={(e) =>
                change(row.id, { captureStage: e.target.value as EvidenceDraftInput["captureStage"] || null })}>
                <option value="">Not confirmed</option>
                {["DESIGN", "PROTOTYPE", "LOCAL_BUILD", "PRODUCTION_CAPTURE", "RECREATED_LOCAL_DEMO"].map((stage) =>
                  <option key={stage} value={stage}>{stage.replaceAll("_", " ").toLowerCase()}</option>)}
              </select>
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={row.permissionConfirmed === true}
                onChange={(e) => change(row.id, { permissionConfirmed: e.target.checked })} />
              I confirm this Evidence may be published
            </label>
            {row.kind === "TEXT_LINK" ? (
              <>
                {editor("Link text", "textLinkText")}
                {editor("Confirmed HTTPS destination", "textLinkUrl")}
              </>
            ) : (
              <>
                {assetSelect("sourceAssetId", row.kind === "RECORDING" ? "VIDEO" : "IMAGE", "Source")}
                {editor("Image alternative text", "alternativeText", true)}
                {editor("Equivalent visual description", "equivalentDescription", true)}
                {row.kind === "RECORDING" ? (
                  <>
                    {assetSelect("posterAssetId", "IMAGE", "Poster")}
                    <label className="flex flex-col gap-1 text-sm font-medium text-ink">
                      Recording sound and visual accessibility
                      <select className={control} value={row.recordingAccessibilityMode ?? ""}
                        onChange={(e) => change(row.id, { recordingAccessibilityMode:
                          (e.target.value || null) as EvidenceDraftInput["recordingAccessibilityMode"] })}>
                        <option value="">Accessibility review required</option>
                        <option value="SILENT">Silent demo — no meaningful audio</option>
                        <option value="AUDIO_VISUALS_CONVEYED">Meaningful audio — visuals conveyed through narration</option>
                        <option value="AUDIO_DESCRIPTION_INCLUDED">Meaningful audio — integrated synchronized visual description</option>
                      </select>
                    </label>
                    <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-ink">
                      <input type="checkbox" checked={row.confirmSourceAssetId === row.sourceAssetId &&
                        Boolean(row.sourceAssetId)}
                        onChange={(e) => change(row.id, {
                          confirmSourceAssetId: e.target.checked ? row.sourceAssetId : null,
                        })} />
                      I reviewed this exact currently selected video and confirm its sound and visual context
                    </label>
                    {editor("Transcript (required for meaningful audio)", "transcript", true)}
                    {assetSelect("captionTrackAssetId", "VTT", "Caption track")}
                    <p className="text-sm text-muted-ink">
                      Silent recordings require a state → action → transition → result explanation.
                      With meaningful audio, supply synchronized captions and transcript.
                      If narration does not convey essential visuals, use a video with integrated synchronized description.
                    </p>
                  </>
                ) : null}
              </>
            )}
            <label className="flex min-h-11 items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={figures.includes(row.id)}
                onChange={(e) => setFigures((old) => e.target.checked ? [...old, row.id] :
                  old.filter((item) => item !== row.id))} />
              Reference this Evidence as a Problem contextual figure
            </label>
          </fieldset>
        );
      })}
      {figures.length > 1 ? (
        <section aria-label="Problem figure order" className="flex flex-col gap-2">
          <h3 className="font-semibold text-ink">Problem figure order</h3>
          {figures.map((figureId, index) => (
            <div key={figureId} className="flex flex-wrap items-center gap-2 text-sm">
              <span>{index + 1}. {rows.find((row) => row.id === figureId)?.title || "Evidence"}</span>
              <button type="button" disabled={index === 0} className="min-h-11 border px-3 disabled:opacity-50" onClick={() => figureMove(index, -1)}>Move up</button>
              <button type="button" disabled={index === figures.length - 1} className="min-h-11 border px-3 disabled:opacity-50" onClick={() => figureMove(index, 1)}>Move down</button>
            </div>
          ))}
        </section>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        {([["Discovery cover", cover, setCover], ["Lead media", lead, setLead]] as const).map(
          ([label, value, setter]) => (
            <label key={label} className="flex min-w-0 flex-col gap-1 text-sm font-medium text-ink">
              {label}
              <select className={control} value={value} onChange={(e) => setter(e.target.value)}>
                <option value="">No {label.toLowerCase()}</option>
                {choices.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.title || row.kind} · {row.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
          ),
        )}
      </div>
    </section>
  );
}
