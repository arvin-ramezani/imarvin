import { Globe2, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { publishStoryAction } from "@/features/work/actions";
import { loadOwnerStoryPage, loadOwnerMediaErrors } from "@/features/work/page-data";
import { OwnerMediaPreview } from "@/features/work/owner-media-preview";
import { StudioWorkFrame } from "@/features/work/studio-work-frame";
import { storyProgressLabel } from "@/features/work/types";
import { publicationFieldErrors } from "@/features/work/validation";
import { cn } from "@/lib/utils";

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
    case "origin":
      return "Publication requires a trusted same-origin owner request. Reload this page before retrying.";
    case "failed":
      return "Publication could not be confirmed. The saved candidate and previous public version were not reported as changed; review current versions before retrying.";
    default:
      return null;
  }
}

function ReviewFields({
  label,
  story,
  emphasized = false,
}: {
  label: string;
  story: {
    title: string;
    problem: string;
    contribution: string;
    progress: "ONGOING" | "COMPLETED" | "CANCELLED" | null;
    outcome: string | null;
    stack: string[];
    releaseHistory?: "SHIPPED" | "NEVER_SHIPPED" | null;
    availability?: "LIVE_DESTINATION" | "NO_LIVE_DESTINATION" | null;
    liveDestinationUrl?: string | null;
  };
  emphasized?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-5 rounded-lg border p-5 md:p-6",
        emphasized
          ? "border-signal bg-signal-wash"
          : "border-boundary bg-surface",
      )}
    >
      <div className="flex items-center gap-3 border-b border-boundary pb-4">
        <span
          className={cn(
            "size-2 rounded-full",
            emphasized ? "bg-signal" : "bg-boundary",
          )}
          aria-hidden="true"
        />
        <p className="text-sm font-semibold text-ink">{label}</p>
      </div>
      <dl className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1 md:col-span-2">
          <dt className="text-sm font-medium text-muted-ink">Title</dt>
          <dd className="text-2xl font-semibold tracking-tight text-ink">
            {story.title.trim() || "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <dt className="text-sm font-medium text-muted-ink">Problem or hook</dt>
          <dd className="text-base leading-7 text-ink">
            {story.problem.trim() || "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <dt className="text-sm font-medium text-muted-ink">Contribution</dt>
          <dd className="text-base leading-7 text-ink">
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
          <dt className="text-sm font-medium text-muted-ink">Relevant stack</dt>
          <dd className="text-base text-ink">
            {story.stack.length > 0 ? story.stack.join(", ") : "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <dt className="text-sm font-medium text-muted-ink">
            Outcome or lesson
          </dt>
          <dd className="text-base leading-7 text-ink">
            {story.outcome?.trim() || "Not added"}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">Release history</dt>
          <dd className="text-base text-ink">{story.releaseHistory?.replaceAll("_", " ").toLowerCase() || "Not confirmed"}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-ink">Current availability</dt>
          <dd className="text-base text-ink">{story.availability?.replaceAll("_", " ").toLowerCase() || "Not confirmed"}</dd>
        </div>
        <div className="flex min-w-0 flex-col gap-1 md:col-span-2">
          <dt className="text-sm font-medium text-muted-ink">Live destination</dt>
          <dd className="break-all text-base text-ink">{story.liveDestinationUrl || "Not confirmed"}</dd>
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
  const [story, mediaErrors] = await Promise.all([
    loadOwnerStoryPage(storyId), loadOwnerMediaErrors(storyId),
  ]);
  const fieldErrors = publicationFieldErrors(story);
  const errors = [
    ...Object.entries(fieldErrors).flatMap(([field, messages]) =>
      (messages ?? []).map((message) => ({ field, message }))),
    ...mediaErrors.map((message) => ({ field: "evidence", message })),
  ];
  const oldEvidence = new Map(story.published?.evidence.map((row) => [row.id, row]) ?? []);
  const evidenceChanges = [
    ...story.evidence.flatMap((row) => {
      const old = oldEvidence.get(row.id);
      if (!old) return ["Added " + (row.title || row.kind)];
      const changes = ([
        "kind", "position", "title", "caption", "captureStage",
        "permissionConfirmed", "alternativeText", "equivalentDescription",
        "transcript", "textLinkText", "textLinkUrl",
        "recordingAccessibilityMode", "sourceAssetId",
        "posterAssetId", "captionTrackAssetId",
      ] as const).filter((field) => row[field] !== old[field]);
      return changes.length ? [
        (row.title || row.kind) + ": " + changes.join(", ") + " changed",
      ] : [];
    }),
    ...(story.published?.evidence ?? []).filter((row) =>
      !story.evidence.some((current) => current.id === row.id))
      .map((row) => "Removed " + (row.title || row.kind)),
    ...(story.discoveryCoverEvidenceId !== story.published?.discoveryCoverEvidenceId
      ? ["Discovery cover selection changed"] : []),
    ...(story.leadEvidenceId !== story.published?.leadEvidenceId
      ? ["Lead selection changed"] : []),
    ...(JSON.stringify(story.evidence.flatMap((row) => row.problemFigures)
        .sort((a, b) => a.position - b.position).map((f) => f.evidenceId)) !==
      JSON.stringify((story.published?.evidence ?? []).flatMap((row) => row.problemFigures)
        .sort((a, b) => a.position - b.position).map((f) => f.evidenceId))
      ? ["Problem figure selections/order changed"] : []),
  ];
  const actionLabel = story.published ? "Update published content" : "Publish";
  const failure = errorMessage(query.error);
  const boundaryMessage = story.published
    ? "The current public snapshot remains live until this update succeeds."
    : "Nothing is public until this first publication succeeds.";

  return (
    <StudioWorkFrame active="work">
      <section className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-boundary pb-8">
          <Link
            href={"/studio/work/" + story.id + "/edit"}
            className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Back to editing
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-ink">
            Publication review
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {actionLabel}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-ink">
            Review saved candidate revision {story.workingRevision} before
            changing what visitors can read.
          </p>
        </header>

        <section className="flex flex-col gap-4 rounded-lg border border-signal bg-signal-wash p-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-signal">
              <LockKeyhole aria-hidden="true" className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-ink">
                Saved candidate is private
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-ink">
                {boundaryMessage} Saving alone never changes the public
                version.
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-ink">
            Revision {story.workingRevision}
          </p>
        </section>

        {failure ? (
          <div
            role="alert"
            className="max-w-3xl rounded-lg border border-destructive bg-surface p-4 text-sm text-ink"
          >
            {failure}
          </div>
        ) : null}

        {errors.length > 0 ? (
          <div className="flex max-w-3xl flex-col gap-3 rounded-lg border border-destructive bg-surface p-4">
            <h2 className="font-semibold text-destructive">
              Not ready to publish
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-ink">
              {errors.map(({ field, message }) => (
                <li key={field + "-" + message}>{message}</li>
              ))}
            </ul>
            <Link
              href={"/studio/work/" + story.id + "/edit"}
              className="w-fit rounded-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Complete required fields
            </Link>
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-2">
          <ReviewFields
            label="Saved candidate · private"
            story={story}
            emphasized
          />
          {story.published ? (
            <ReviewFields
              label={"Current public version · revision " + story.published.revision}
              story={story.published}
            />
          ) : (
            <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-boundary bg-surface p-5 md:p-6">
              <div className="flex items-center gap-3 border-b border-boundary pb-4">
                <span className="flex size-9 items-center justify-center rounded-md bg-canvas text-muted-ink">
                  <Globe2 aria-hidden="true" className="size-4" />
                </span>
                <p className="text-sm font-semibold text-ink">
                  Current public version
                </p>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-ink">
                Not published yet
              </h2>
              <p className="max-w-lg text-base leading-7 text-muted-ink">
                The first successful confirmation creates the public snapshot.
                Until then, public Work contains no version of this story.
              </p>
            </section>
          )}
        </div>

        <section className="flex flex-col gap-4 rounded-lg border border-boundary bg-surface p-5">
          <h2 className="text-xl font-semibold text-ink">Candidate vs public Evidence changes</h2>
          <p className="text-sm text-muted-ink">These changes affect the discovery cover, Story lead and Problem figures when their references change. Public media remains on its previous snapshot until confirmed Update.</p>
          {evidenceChanges.length ? (
            <ul className="list-disc ps-5 text-sm text-ink">
              {evidenceChanges.map((change, i) => <li key={i}>{change}</li>)}
            </ul>
          ) : <p className="text-sm text-muted-ink">No Evidence metadata changes.</p>}
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <section className="min-w-0">
              <h3 className="mb-3 font-semibold text-ink">Saved candidate · private</h3>
              <OwnerMediaPreview storyId={story.id} rows={story.evidence}
                cover={story.discoveryCoverEvidenceId} lead={story.leadEvidenceId}
                figures={story.evidence.flatMap((item) => item.problemFigures)
                  .sort((a, b) => a.position - b.position).map((f) => f.evidenceId)} />
            </section>
            {story.published ? (
              <section className="min-w-0">
                <h3 className="mb-3 font-semibold text-ink">Current public snapshot</h3>
                <OwnerMediaPreview storyId={story.id} rows={story.published.evidence}
                  cover={story.published.discoveryCoverEvidenceId}
                  lead={story.published.leadEvidenceId}
                  figures={story.published.evidence.flatMap((item) => item.problemFigures)
                    .sort((a, b) => a.position - b.position).map((f) => f.evidenceId)} />
              </section>
            ) : null}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-boundary bg-surface p-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-ink">
              Confirm the publishing boundary
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-ink">
              {story.published
                ? "Update published content replaces the public snapshot with this saved candidate."
                : "Publish creates the first public snapshot from this saved candidate."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
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
                  className="min-h-12 rounded-md bg-action-fill px-6 py-2 font-semibold text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {actionLabel}
                </button>
              </form>
            ) : null}
            <Link
              href={"/studio/work/" + story.id + "/edit"}
              className="flex min-h-12 items-center rounded-md border border-boundary bg-canvas px-5 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Keep editing
            </Link>
          </div>
        </section>
      </section>
    </StudioWorkFrame>
  );
}
