import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublishedStory } from "@/features/work/repository";
import { StorySummary } from "@/features/work/story-summary";

type WorkStoryPageProps = {
  params: Promise<{ storyId: string }>;
};

export async function generateMetadata({
  params,
}: WorkStoryPageProps): Promise<Metadata> {
  const { storyId } = await params;
  const story = await getPublishedStory(storyId);

  if (!story) {
    return {
      title: "Work unavailable · imarvin",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${story.title} · Work · imarvin`,
    description: story.problem,
  };
}

export default async function WorkStoryPage({ params }: WorkStoryPageProps) {
  const { storyId } = await params;
  const story = await getPublishedStory(storyId);

  if (!story) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-8">
      <Link
        href="/work"
        className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Back to Work
      </Link>
      <StorySummary story={story} />
    </section>
  );
}
