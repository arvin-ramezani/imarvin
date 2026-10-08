// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EvidenceEditor } from "../features/work/evidence-editor";
import type { EvidenceDraftInput } from "../features/work/types";

const VIDEO_A = "11111111-1111-4111-8111-111111111111";
const VIDEO_B = "22222222-2222-4222-8222-222222222222";
const POSTER = "33333333-3333-4333-8333-333333333333";
const EVIDENCE_ID = "44444444-4444-4444-8444-444444444444";
const SECOND_ID = "55555555-5555-4555-8555-555555555555";

const recording: EvidenceDraftInput = {
  id: EVIDENCE_ID, kind: "RECORDING", title: "Demo",
  caption: "Drawer interaction", captureStage: "LOCAL_BUILD",
  permissionConfirmed: true, alternativeText: "Poster shows a drawer",
  equivalentDescription: "Closed, click, opens, visible.",
  transcript: "A description", textLinkText: null, textLinkUrl: null,
  sourceAssetId: VIDEO_A, posterAssetId: POSTER, captionTrackAssetId: null,
  recordingAccessibilityMode: "SILENT",
};
const textLink: EvidenceDraftInput = {
  id: SECOND_ID, kind: "TEXT_LINK", title: "Documentation", caption: null,
  captureStage: null, permissionConfirmed: true,
  alternativeText: null, equivalentDescription: null, transcript: null,
  textLinkText: "Docs", textLinkUrl: "https://example.com",
  sourceAssetId: null, posterAssetId: null, captionTrackAssetId: null,
  recordingAccessibilityMode: null,
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("private Evidence editor", () => {
  it("reorders Evidence by button, announces the new position and changes the private JSON only", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => ({ assets: [] }),
    })));
    const onDirty = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <EvidenceEditor storyId="66666666-6666-4666-8666-666666666666"
        initialEvidence={[recording, textLink]} initialCover={EVIDENCE_ID}
        initialLead={EVIDENCE_ID} initialFigures={[EVIDENCE_ID]}
        initialAssets={[]} onDirty={onDirty} />,
    );
    await user.click(screen.getAllByRole("button", { name: "Move up" })[1]);
    expect(screen.getByRole("status").textContent).toContain("position 1");
    const input = container.querySelector<HTMLInputElement>('input[name="evidenceJson"]');
    const data = JSON.parse(input?.value ?? "[]") as EvidenceDraftInput[];
    expect(data[0]?.id).toBe(SECOND_ID);
    expect(onDirty).toHaveBeenCalled();
  });

  it("clears source-bound visual and sound facts on changing a recording video", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true, json: async () => ({ assets: [
        { id: VIDEO_A, mediaType: "VIDEO", readiness: "READY", originalFileName: "a.mp4" },
        { id: VIDEO_B, mediaType: "VIDEO", readiness: "READY", originalFileName: "b.mp4" },
        { id: POSTER, mediaType: "IMAGE", readiness: "READY", originalFileName: "poster.png" },
      ] }),
    })));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    const { container } = render(
      <EvidenceEditor storyId="66666666-6666-4666-8666-666666666666"
        initialEvidence={[recording]} initialCover={EVIDENCE_ID}
        initialLead={EVIDENCE_ID} initialFigures={[]}
        initialAssets={[
          { id: VIDEO_A, mediaType: "VIDEO", readiness: "READY", originalFileName: "a.mp4" },
          { id: VIDEO_B, mediaType: "VIDEO", readiness: "READY", originalFileName: "b.mp4" },
          { id: POSTER, mediaType: "IMAGE", readiness: "READY", originalFileName: "poster.png" },
        ]} onDirty={vi.fn()} />,
    );
    await user.selectOptions(screen.getByLabelText("Source"), VIDEO_B);
    const value = container.querySelector<HTMLInputElement>('input[name="evidenceJson"]')?.value ?? "";
    const row = (JSON.parse(value) as EvidenceDraftInput[])[0];
    expect(row?.sourceAssetId).toBe(VIDEO_B);
    expect(row?.recordingAccessibilityMode).toBeNull();
    expect(row?.posterAssetId).toBeNull();
    expect(row?.equivalentDescription).toBeNull();
    expect(row?.permissionConfirmed).toBeNull();
    expect(screen.getByRole("status").textContent).toContain("Save the reset");
  });
  it("replaces a saved caption without retaining stale text and keeps other fields editable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true, json: async () => ({ assets: [] }),
    })));
    const onDirty = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <EvidenceEditor storyId="66666666-6666-4666-8666-666666666666"
        initialEvidence={[{ ...recording, caption: "Initial capture" }]}
        initialCover={EVIDENCE_ID} initialLead={EVIDENCE_ID}
        initialFigures={[]} initialAssets={[]} onDirty={onDirty} />,
    );

    const caption = screen.getByLabelText("Purpose / caption") as HTMLTextAreaElement;
    expect(caption.value).toBe("Initial capture");
    await user.clear(caption);
    await user.type(caption, "Revised private caption");
    expect(caption.value).toBe("Revised private caption");
    const candidate = () => JSON.parse(
      container.querySelector<HTMLInputElement>('input[name="evidenceJson"]')?.value ?? "[]",
    ) as EvidenceDraftInput[];
    expect(candidate()[0]?.caption).toBe("Revised private caption");

    await user.type(caption, "!");
    expect(caption.value).toBe("Revised private caption!");
    expect(candidate()[0]?.caption).toBe("Revised private caption!");

    const title = screen.getByLabelText("Evidence title") as HTMLInputElement;
    await user.clear(title);
    await user.type(title, "Updated demo");
    expect(candidate()[0]?.title).toBe("Updated demo");
    expect(onDirty).toHaveBeenCalled();
  });

});
