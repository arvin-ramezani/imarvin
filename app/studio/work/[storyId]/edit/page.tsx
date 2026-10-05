import type { Metadata } from "next";
import Link from "next/link";

import { loadOwnerStoryPage } from "@/features/work/page-data";
import { StoryEditorForm } from "@/features/work/story-editor-form";
import { storyFormValuesFromDraft } from "@/features/work/validation";

type EditStoryPageProps = {
  params: Promise<{ storyId: string }>;
  searchParams: Promise<{
    saved?: string;
    publication?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Edit work story · Studio · imarvin",
  robots: { index: false, follow: false },
};

function successMessage(saved: string | undefined, publication: string | undefined) {
  if (publication === "published") {
    return "Published. A fresh public request now uses this saved snapshot.";
  }

  if (publication === "updated") {
    return "Published content updated. The public snapshot now matches this saved candidate.";
  }

  if (saved === "1") {
    return "Saved privately. Public content was not changed.";
  }

  return null;
}

export default async function EditStoryPage({
  params,
  searchParams,
}: EditStoryPageProps) {
  const [{ storyId }, query] = await Promise.all([params, searchParams]);
  const story = await loadOwnerStoryPage(storyId);
  const message = successMessage(query.saved, query.publication);
  const relationship =
    story.published === null
      ? "Private draft"
      : story.published.sourceWorkingRevision === story.workingRevision
        ? "Published · saved copy matches public"
        : "Published · private changes";

  return (
    <section className="flex flex-col gap-8">
      <header className="flex max-w-3xl flex-col gap-3 border-b border-boundary pb-6">
        <Link
          href="/studio/work"
          className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back to Work
        </Link>
        <p className="text-sm font-medium text-muted-ink">{relationship}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          {story.title.trim() || "Untitled private story"}
        </h1>
        {message ? (
          <div
            role="status"
            className="rounded-md border border-boundary bg-surface p-4 text-sm text-ink"
          >
            <p>{message}</p>
            {query.publication ? (
              <Link
                href={`/work/${story.id}`}
                className="mt-2 inline-block rounded-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Open public story
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      <StoryEditorForm
        storyId={story.id}
        workingRevision={story.workingRevision}
        initialValues={storyFormValuesFromDraft(story)}
      />
    </section>
  );
}
