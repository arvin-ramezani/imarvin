import { Globe2, LockKeyhole, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { loadOwnerStoriesPage } from "@/features/work/page-data";
import { StudioWorkFrame } from "@/features/work/studio-work-frame";
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
    <StudioWorkFrame active="work">
      <section className="flex flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-boundary pb-8">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-ink">
              Owner work
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-ink">
              Work
            </h1>
            <p className="text-base leading-7 text-muted-ink">
              Curate saved story summaries here. Public content changes only
              after a separate Publish or Update published content confirmation.
            </p>
          </div>
          <Link
            href="/studio/work/new"
            className="flex min-h-11 items-center gap-2 rounded-md bg-action-fill px-4 py-2 font-medium text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus aria-hidden="true" className="size-4" />
            Create story
          </Link>
        </header>

        {stories.length === 0 ? (
          <div className="flex max-w-2xl flex-col gap-3 border-s border-signal ps-4">
            <h2 className="text-2xl font-semibold text-ink">
              No saved stories yet
            </h2>
            <p className="text-base leading-7 text-muted-ink">
              Start a private story when you have real work content to curate.
              Nothing is public until you explicitly publish it.
            </p>
          </div>
        ) : (
          <section className="flex flex-col gap-3" aria-labelledby="saved-stories">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-ink">
                  Saved working copies
                </p>
                <h2
                  id="saved-stories"
                  className="text-2xl font-semibold tracking-tight text-ink"
                >
                  Stories
                </h2>
              </div>
              <p className="text-sm text-muted-ink">
                {stories.length} {stories.length === 1 ? "story" : "stories"}
              </p>
            </div>

            <ul className="flex flex-col">
              {stories.map((story) => {
                const published = Boolean(story.published);
                const StateIcon = published ? Globe2 : LockKeyhole;

                return (
                  <li
                    key={story.id}
                    className="grid gap-4 border-t border-boundary py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div className="flex min-w-0 gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-signal-wash text-signal">
                        <StateIcon aria-hidden="true" className="size-5" />
                      </span>
                      <div className="flex min-w-0 flex-col gap-1">
                        <h3 className="text-xl font-semibold text-ink">
                          {story.title.trim() || "Untitled private story"}
                        </h3>
                        <p className="text-sm text-muted-ink">
                          {storyProgressLabel(story.progress)}
                        </p>
                        <p className="text-sm text-muted-ink">{story._count.evidence} Evidence items in saved candidate</p>
                        <p className="text-sm font-medium text-ink">
                          {relationshipLabel(story)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={"/studio/work/" + story.id + "/edit"}
                      className="flex min-h-11 w-fit items-center rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      Edit
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </section>
    </StudioWorkFrame>
  );
}
