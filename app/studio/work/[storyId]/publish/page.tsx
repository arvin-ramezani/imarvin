import type { Metadata } from "next";
import Link from "next/link";

import { publishStoryAction } from "@/features/work/actions";
import { loadOwnerStoryPage } from "@/features/work/page-data";
import { storyProgressLabel } from "@/features/work/types";
import { publicationFieldErrors } from "@/features/work/validation";

type PublishPageProps = {
  params: Promise<{ storyId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Review work publication · Studio · imarvin",
  robots: { index: false, follow: false },
};

function errorMessage(error: string | undefined): string | null {
  switch (error) {
    case "conflict":
      return "The saved or public revision changed before confirmation. Review the current candidate below, then confirm again.";
    case "validation":
      return "The current saved candidate does not meet publication requirements. Return to editing and complete the required fields.";
    case "session":
      return "The owner session is no longer available. Sign in again before retrying publication.";
    case "failed":
      return "Publication could not be confirmed. The saved candidate and previous public version were not reported as changed; review current versions before retrying.";
    default:
      return null;
  }
}

function ReviewFields({
  label,
  story,
}: {
  label: string;
  story: {
    title: string;
    problem: string;
    contribution: string;
    progress: "ONGOING" | "COMPLETED" | "CANCELLED" | null;
    outcome: string | null;
    stack: string[];
  };
}) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-4 rounded-md border border-boundary bg-surface p-5">
      <p className="text-sm font-semibold text-muted-ink">{label}</p>
      <dl className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">Title</dt>
          <dd className="text-lg font-semibold text-ink">
            {story.title.trim() || "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">Problem or hook</dt>
          <dd className="text-base leading-6 text-ink">
            {story.problem.trim() || "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">Contribution</dt>
          <dd className="text-base leading-6 text-ink">
            {story.contribution.trim() || "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">Progress</dt>
          <dd className="text-base text-ink">
            {storyProgressLabel(story.progress)}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">
            Outcome or lesson
          </dt>
          <dd className="text-base leading-6 text-ink">
            {story.outcome?.trim() || "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">Relevant stack</dt>
          <dd className="text-base text-ink">
            {story.stack.length > 0 ? story.stack.join(", ") : "Not added"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default async function PublishStoryPage({
  params,
  searchParams,
}: PublishPageProps) {
  const [{ storyId }, query] = await Promise.all([params, searchParams]);
  const story = await loadOwnerStoryPage(storyId);
  const fieldErrors = publicationFieldErrors(story);
  const errors = Object.entries(fieldErrors).flatMap(([field, messages]) =>
    (messages ?? []).map((message) => ({ field, message })),
  );
  const actionLabel = story.published ? "Update published content" : "Publish";
  const failure = errorMessage(query.error);

  return (
    <section className="flex flex-col gap-8">
      <header className="flex max-w-3xl flex-col gap-3 border-b border-boundary pb-6">
        <Link
          href={`/studio/work/${story.id}/edit`}
          className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back to editing
        </Link>
        <p className="text-sm font-medium text-muted-ink">
          Publication review
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          {actionLabel}
        </h1>
        <p className="text-base leading-6 text-muted-ink">
          This confirmation uses saved candidate revision {story.workingRevision}.
          Saving alone never changes the public version.
        </p>
      </header>

      {failure ? (
        <div
          role="alert"
          className="max-w-3xl rounded-md border border-destructive bg-surface p-4 text-sm text-ink"
        >
          {failure}
        </div>
      ) : null}

      {errors.length > 0 ? (
        <div className="flex max-w-3xl flex-col gap-3 rounded-md border border-destructive bg-surface p-4">
          <h2 className="font-semibold text-destructive">
            Not ready to publish
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-ink">
            {errors.map(({ field, message }) => (
              <li key={`${field}-${message}`}>{message}</li>
            ))}
          </ul>
          <Link
            href={`/studio/work/${story.id}/edit`}
            className="w-fit rounded-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Complete required fields
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row">
        <ReviewFields label="Saved candidate" story={story} />
        {story.published ? (
          <ReviewFields label="Current public version" story={story.published} />
        ) : (
          <section className="flex min-w-0 flex-1 flex-col gap-3 border-s border-boundary ps-5">
            <p className="text-sm font-semibold text-muted-ink">
              Current public version
            </p>
            <h2 className="text-2xl font-semibold text-ink">
              Not published yet
            </h2>
            <p className="text-base leading-6 text-muted-ink">
              The first successful confirmation creates the public snapshot.
            </p>
          </section>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-boundary pt-6">
        {errors.length === 0 ? (
          <form action={publishStoryAction}>
            <input type="hidden" name="storyId" value={story.id} />
            <input
              type="hidden"
              name="workingRevision"
              value={story.workingRevision}
            />
            <input
              type="hidden"
              name="publishedRevision"
              value={story.published?.revision ?? ""}
            />
            <button
              type="submit"
              className="min-h-11 rounded-md bg-action-fill px-4 py-2 font-medium text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {actionLabel}
            </button>
          </form>
        ) : null}
        <Link
          href={`/studio/work/${story.id}/edit`}
          className="flex min-h-11 items-center rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Keep editing
        </Link>
      </div>
    </section>
  );
}
