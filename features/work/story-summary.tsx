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

function OptionalValue({
  children,
  fallback,
}: {
  children: string | null;
  fallback: string;
}) {
  return (
    <p className="text-base leading-6 text-muted-ink">
      {children?.trim() ? children : fallback}
    </p>
  );
}

export function StorySummary({ story, preview = false }: StorySummaryProps) {
  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-ink">
          {storyProgressLabel(story.progress)}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          {story.title.trim() || (preview ? "Untitled story" : "Work story")}
        </h1>
        <OptionalValue
          fallback={preview ? "Problem or hook not added yet." : ""}
        >
          {story.problem}
        </OptionalValue>
      </header>

      <section className="flex flex-col gap-3" aria-labelledby="contribution">
        <h2 id="contribution" className="text-2xl font-semibold text-ink">
          Contribution
        </h2>
        <OptionalValue
          fallback={preview ? "Contribution not added yet." : ""}
        >
          {story.contribution}
        </OptionalValue>
      </section>

      {story.outcome || preview ? (
        <section className="flex flex-col gap-3" aria-labelledby="outcome">
          <h2 id="outcome" className="text-2xl font-semibold text-ink">
            Outcome or lesson
          </h2>
          <OptionalValue
            fallback={preview ? "Outcome or lesson is optional." : ""}
          >
            {story.outcome}
          </OptionalValue>
        </section>
      ) : null}

      {story.stack.length > 0 || preview ? (
        <section className="flex flex-col gap-3" aria-labelledby="stack">
          <h2 id="stack" className="text-2xl font-semibold text-ink">
            Relevant stack
          </h2>
          {story.stack.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Relevant stack">
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
            <p className="text-base leading-6 text-muted-ink">
              Stack is optional.
            </p>
          )}
        </section>
      ) : null}
    </article>
  );
}
