import type { Metadata } from "next";
import Link from "next/link";

import { listPublishedStories } from "@/features/work/repository";
import { storyProgressLabel } from "@/features/work/types";

export const metadata: Metadata = {
  title: "Work · imarvin",
  description: "Published work stories from imarvin.",
};

export default async function WorkPage() {
  const stories = await listPublishedStories();

  return (
    <section className="flex flex-col gap-10">
      <header className="grid gap-6 border-b border-boundary pb-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] lg:items-end">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-ink">
            Personal studio
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-ink md:text-6xl">
            Browse Work
          </h1>
        </div>
        <p className="max-w-xl text-lg leading-8 text-muted-ink">
          Published stories about problems, contribution, progress, and what
          each piece of work taught me.
        </p>
      </header>

      {stories.length === 0 ? (
        <div className="flex max-w-2xl flex-col gap-3 border-s border-signal ps-4">
          <h2 className="text-2xl font-semibold text-ink">
            No work stories published yet
          </h2>
          <p className="text-base leading-7 text-muted-ink">
            Published work will appear here when it is ready to share.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {stories.map((story) => (
            <li key={story.storyId} className="border-b border-boundary">
              <Link
                href={"/work/" + story.storyId}
                className="group grid min-h-11 gap-5 py-7 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-start"
              >
                <div className="flex items-center gap-3 pt-1">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-signal"
                  />
                  <span className="text-sm font-medium text-muted-ink">
                    {storyProgressLabel(story.progress)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink group-hover:text-signal md:text-4xl">
                    {story.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-muted-ink">
                    {story.problem}
                  </p>
                </div>
                <span className="text-sm font-semibold text-signal md:pt-2">
                  Open story →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
