import type { Metadata } from "next";
import Link from "next/link";

import { loadOwnerStoriesPage } from "@/features/work/page-data";
import { storyProgressLabel } from "@/features/work/types";

export const metadata: Metadata = {
  title: "Work · Studio · imarvin",
  robots: { index: false, follow: false },
};

function relationshipLabel(story: {
  workingRevision: number;
  published: { sourceWorkingRevision: number } | null;
}): string {
  if (!story.published) {
    return "Private draft";
  }

  return story.published.sourceWorkingRevision === story.workingRevision
    ? "Published · saved copy matches public"
    : "Published · private changes";
}

export default async function StudioWorkPage() {
  const stories = await loadOwnerStoriesPage();

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-boundary pb-6">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="text-sm font-medium text-muted-ink">Private studio</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink">
            Work
          </h1>
          <p className="text-base leading-6 text-muted-ink">
            Saving stays private. Publishing is always a separate confirmation.
          </p>
        </div>
        <Link
          href="/studio/work/new"
          className="flex min-h-11 items-center rounded-md bg-action-fill px-4 py-2 font-medium text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          New story
        </Link>
      </header>

      {stories.length === 0 ? (
        <div className="flex max-w-2xl flex-col gap-3 border-s border-boundary ps-4">
          <h2 className="text-2xl font-semibold text-ink">No saved stories yet</h2>
          <p className="text-base leading-6 text-muted-ink">
            Start a private story when you have real work content to curate.
            Nothing is public until you explicitly publish it.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-boundary">
          {stories.map((story) => (
            <li
              key={story.id}
              className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="text-xl font-semibold text-ink">
                  {story.title.trim() || "Untitled private story"}
                </h2>
                <p className="text-sm text-muted-ink">
                  {storyProgressLabel(story.progress)}
                </p>
                <p className="text-sm font-medium text-ink">
                  {relationshipLabel(story)}
                </p>
              </div>
              <Link
                href={`/studio/work/${story.id}/edit`}
                className="flex min-h-11 w-fit items-center rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
