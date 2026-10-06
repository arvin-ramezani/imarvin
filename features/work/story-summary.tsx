import type { StoryProgress } from "./types";
import { storyProgressLabel } from "./types";

export type StorySummaryData = {
  title: string;
  problem: string;
  contribution: string;
  progress: StoryProgress | null;
  outcome: string | null;
  stack: string[];
};

type StorySummaryProps = {
  story: StorySummaryData;
  preview?: boolean;
};

function valueOrFallback(
  value: string | null,
  fallback: string,
): string {
  return value?.trim() ? value : fallback;
}

export function StorySummary({ story, preview = false }: StorySummaryProps) {
  const title =
    story.title.trim() || (preview ? "Untitled story" : "Work story");
  const problem =
    story.problem.trim() ||
    (preview ? "Problem or hook not added yet." : "");
  const contribution =
    story.contribution.trim() ||
    (preview ? "Contribution not added yet." : "");

  return (
    <article className="wrap-anywhere grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
      <aside className="flex min-w-0 flex-col gap-6 border-b border-boundary pb-8 lg:border-b-0 lg:border-e lg:pb-0 lg:pe-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-ink">
            {preview ? "Saved candidate" : "Work story"}
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
        </div>

        <div className="border-t border-boundary pt-5">
          <p className="text-sm font-medium text-muted-ink">Progress</p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {storyProgressLabel(story.progress)}
          </p>
        </div>

        <section
          className="border-t border-boundary pt-5"
          aria-labelledby="contribution"
        >
          <h2
            id="contribution"
            className="text-sm font-semibold text-muted-ink"
          >
            Contribution
          </h2>
          <p className="mt-2 text-base leading-7 text-ink">
            {contribution}
          </p>
        </section>
      </aside>

      <div className="flex min-w-0 flex-col gap-10">
        <section aria-labelledby="problem">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-ink">
            The problem
          </p>
          <h2
            id="problem"
            className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl lg:text-5xl"
          >
            {problem}
          </h2>
        </section>

        {story.outcome || preview ? (
          <section
            className="border-t border-boundary pt-8"
            aria-labelledby="outcome"
          >
            <h2 id="outcome" className="text-2xl font-semibold text-ink">
              Outcome or lesson
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-ink">
              {valueOrFallback(
                story.outcome,
                preview ? "Outcome or lesson is optional." : "",
              )}
            </p>
          </section>
        ) : null}

        {story.stack.length > 0 || preview ? (
          <section
            className="border-t border-boundary pt-8"
            aria-labelledby="stack"
          >
            <h2 id="stack" className="text-2xl font-semibold text-ink">
              Relevant stack
            </h2>
            {story.stack.length > 0 ? (
              <ul
                className="mt-4 flex flex-wrap gap-2"
                aria-label="Relevant stack"
              >
                {story.stack.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-boundary bg-surface px-3 py-2 text-sm text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-base leading-7 text-muted-ink">
                Stack is optional.
              </p>
            )}
          </section>
        ) : null}
      </div>
    </article>
  );
}
