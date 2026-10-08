import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { loadOwnerStoryPage, loadOwnerMediaErrors } from "@/features/work/page-data";
import { OwnerMediaPreview } from "@/features/work/owner-media-preview";
import { StorySummary } from "@/features/work/story-summary";
import { publicationFieldErrors } from "@/features/work/validation";

type PreviewPageProps = {
  params: Promise<{ storyId: string }>;
};

export const metadata: Metadata = {
  title: "Private work preview · imarvin",
  robots: { index: false, follow: false },
};

export default async function StoryPreviewPage({ params }: PreviewPageProps) {
  const { storyId } = await params;
  const [story, mediaErrors] = await Promise.all([
    loadOwnerStoryPage(storyId), loadOwnerMediaErrors(storyId),
  ]);
  const publicationErrors = publicationFieldErrors(story);
  const missingCount = Object.values(publicationErrors).flat().length + mediaErrors.length;

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 rounded-lg border border-signal bg-signal-wash p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-signal">
            <LockKeyhole aria-hidden="true" className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-ink">Private preview</p>
            <p className="text-sm leading-6 text-muted-ink">
              Exact saved candidate · revision {story.workingRevision}. Only
              the owner can see this preview.
            </p>
          </div>
        </div>
        <Link
          href={"/studio/work/" + story.id + "/edit"}
          className="flex min-h-11 w-fit items-center rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back to editing
        </Link>
      </header>

      {missingCount > 0 ? (
        <aside className="flex max-w-3xl flex-col gap-2 border-s border-boundary ps-4">
          <h2 className="font-semibold text-ink">Owner-only preview note</h2>
          <p className="text-sm text-muted-ink">
            This saved candidate can be previewed privately, but it still has
            {missingCount === 1
              ? " 1 publication requirement"
              : " " + missingCount + " publication requirements"}.
          </p>
        </aside>
      ) : null}

      <StorySummary story={story} preview />
      <section className="max-w-3xl rounded-lg border border-boundary bg-surface p-5">
        <h2 className="font-semibold text-ink">Confirmed project facts</h2>
        <p className="text-sm text-muted-ink">Release: {story.releaseHistory?.replaceAll("_", " ").toLowerCase() || "Not confirmed"}</p>
        <p className="text-sm text-muted-ink">Availability: {story.availability?.replaceAll("_", " ").toLowerCase() || "Not confirmed"}</p>
        {story.availability === "LIVE_DESTINATION" && story.liveDestinationUrl ? (
          <p className="break-all text-sm text-ink">{story.liveDestinationUrl}</p>
        ) : null}
      </section>
      {mediaErrors.length ? (
        <aside className="max-w-3xl border-s-2 border-destructive ps-4">
          <h2 className="font-semibold text-destructive">Publication repairs needed</h2>
          <ul className="list-disc ps-5 text-sm text-ink">
            {mediaErrors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </aside>
      ) : null}
      <OwnerMediaPreview variant="candidate" storyId={story.id} rows={story.evidence}
        cover={story.discoveryCoverEvidenceId}
        lead={story.leadEvidenceId}
        figures={story.evidence.flatMap((evidence) => evidence.problemFigures)
          .sort((a, b) => a.position - b.position).map((figure) => figure.evidenceId)} />
    </section>
  );
}
