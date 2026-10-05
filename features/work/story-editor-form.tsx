"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  saveStoryAction,
  type StoryEditorActionState,
} from "./actions";
import type { StoryFormValues } from "./types";

type StoryEditorFormProps = {
  initialValues: StoryFormValues;
  storyId?: string;
  workingRevision?: number;
};

const controlClass =
  "min-h-11 w-full rounded-md border border-boundary bg-surface px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const textareaClass =
  "min-h-32 w-full resize-y rounded-md border border-boundary bg-surface px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function FieldErrors({
  errors,
  id,
}: {
  errors: string[] | undefined;
  id: string;
}) {
  if (!errors?.length) {
    return null;
  }

  return (
    <ul id={id} className="flex flex-col gap-1 text-sm text-destructive">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}

export function StoryEditorForm({
  initialValues,
  storyId,
  workingRevision,
}: StoryEditorFormProps) {
  const initialState: StoryEditorActionState = {
    attempt: 0,
    status: "idle",
    message: null,
    fieldErrors: {},
    values: initialValues,
  };
  const [state, formAction, pending] = useActionState(
    saveStoryAction,
    initialState,
  );
  const [dirty, setDirty] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.attempt > 0 && state.status !== "idle") {
      errorSummaryRef.current?.focus();
    }
  }, [state.attempt, state.status]);

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const hasErrors = state.status !== "idle";

  return (
    <form
      action={formAction}
      className="flex max-w-3xl flex-col gap-8"
      onChange={() => setDirty(true)}
    >
      {storyId ? <input type="hidden" name="storyId" value={storyId} /> : null}
      {workingRevision ? (
        <input
          type="hidden"
          name="workingRevision"
          value={workingRevision}
        />
      ) : null}

      {hasErrors ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="flex flex-col gap-2 rounded-md border border-destructive bg-surface p-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <h2 className="font-semibold text-destructive">
            Private save not completed
          </h2>
          <p className="text-sm text-ink">{state.message}</p>
          {state.status === "conflict" && storyId ? (
            <Link
              href={`/studio/work/${storyId}/edit`}
              className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Reload latest saved version
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-medium text-ink">
          Title
        </label>
        <p id="title-help" className="text-sm text-muted-ink">
          Required for publication. Drafts may leave it empty.
        </p>
        <input
          id="title"
          name="title"
          defaultValue={state.values.title}
          maxLength={120}
          aria-describedby="title-help title-error"
          aria-invalid={Boolean(state.fieldErrors.title?.length)}
          className={controlClass}
        />
        <FieldErrors errors={state.fieldErrors.title} id="title-error" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="problem" className="font-medium text-ink">
          Problem or hook
        </label>
        <p id="problem-help" className="text-sm text-muted-ink">
          Required for publication. State what made this work worth doing.
        </p>
        <textarea
          id="problem"
          name="problem"
          defaultValue={state.values.problem}
          maxLength={1200}
          aria-describedby="problem-help problem-error"
          aria-invalid={Boolean(state.fieldErrors.problem?.length)}
          className={textareaClass}
        />
        <FieldErrors errors={state.fieldErrors.problem} id="problem-error" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contribution" className="font-medium text-ink">
          Your contribution
        </label>
        <p id="contribution-help" className="text-sm text-muted-ink">
          Required for publication. Describe your responsibility without
          inventing team or outcome details.
        </p>
        <textarea
          id="contribution"
          name="contribution"
          defaultValue={state.values.contribution}
          maxLength={1600}
          aria-describedby="contribution-help contribution-error"
          aria-invalid={Boolean(state.fieldErrors.contribution?.length)}
          className={textareaClass}
        />
        <FieldErrors
          errors={state.fieldErrors.contribution}
          id="contribution-error"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="progress" className="font-medium text-ink">
          Project progress
        </label>
        <p id="progress-help" className="text-sm text-muted-ink">
          Required for publication and independent from public availability.
        </p>
        <select
          id="progress"
          name="progress"
          defaultValue={state.values.progress}
          aria-describedby="progress-help progress-error"
          aria-invalid={Boolean(state.fieldErrors.progress?.length)}
          className={controlClass}
        >
          <option value="">Not set</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <FieldErrors errors={state.fieldErrors.progress} id="progress-error" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="outcome" className="font-medium text-ink">
          Outcome or lesson
        </label>
        <p id="outcome-help" className="text-sm text-muted-ink">
          Optional. Qualitative outcomes are valid; do not invent metrics.
        </p>
        <textarea
          id="outcome"
          name="outcome"
          defaultValue={state.values.outcome}
          maxLength={1200}
          aria-describedby="outcome-help outcome-error"
          aria-invalid={Boolean(state.fieldErrors.outcome?.length)}
          className={textareaClass}
        />
        <FieldErrors errors={state.fieldErrors.outcome} id="outcome-error" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="stack" className="font-medium text-ink">
          Relevant stack
        </label>
        <p id="stack-help" className="text-sm text-muted-ink">
          Optional. Separate up to 12 items with commas.
        </p>
        <input
          id="stack"
          name="stack"
          defaultValue={state.values.stack}
          aria-describedby="stack-help stack-error"
          aria-invalid={Boolean(state.fieldErrors.stack?.length)}
          className={controlClass}
        />
        <FieldErrors errors={state.fieldErrors.stack} id="stack-error" />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-boundary pt-6">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={pending}
          className="min-h-11 rounded-md bg-action-fill px-4 py-2 font-medium text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save privately"}
        </button>
        {storyId && !dirty ? (
          <Link
            href={`/studio/work/${storyId}/preview`}
            className="flex min-h-11 items-center rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Preview saved candidate
          </Link>
        ) : (
          <button
            type="submit"
            name="intent"
            value="preview"
            disabled={pending}
            className="min-h-11 rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
          >
            Save & preview
          </button>
        )}
        {storyId && !dirty ? (
          <Link
            href={`/studio/work/${storyId}/publish`}
            className="flex min-h-11 items-center rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Review publication
          </Link>
        ) : (
          <button
            type="submit"
            name="intent"
            value="review"
            disabled={pending}
            className="min-h-11 rounded-md border border-boundary bg-surface px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
          >
            Save & review
          </button>
        )}
      </div>
    </form>
  );
}
