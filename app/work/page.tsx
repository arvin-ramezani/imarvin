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
      <header className="flex max-w-3xl flex-col gap-3 border-b border-boundary pb-6">
        <p className="text-sm font-medium text-muted-ink">Published work</p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink">Work</h1>
        <p className="text-lg leading-7 text-muted-ink">
          A focused collection of published work stories.
        </p>
      </header>

      {stories.length === 0 ? (
        <div className="flex max-w-2xl flex-col gap-3 border-s border-boundary ps-4">
          <h2 className="text-2xl font-semibold text-ink">
            No work stories published yet
          </h2>
          <p className="text-base leading-6 text-muted-ink">
            Published work will appear here when it is ready to share.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-boundary">
          {stories.map((story) => (
            <li key={story.storyId} className="py-6">
              <Link
                href={`/work/${story.storyId}`}
                className="group flex min-h-11 flex-col gap-2 rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span className="text-sm font-medium text-muted-ink">
                  {storyProgressLabel(story.progress)}
                </span>
                <span className="text-2xl font-semibold text-ink group-hover:text-signal">
                  {story.title}
                </span>
                <span className="max-w-3xl text-base leading-6 text-muted-ink">
                  {story.problem}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
