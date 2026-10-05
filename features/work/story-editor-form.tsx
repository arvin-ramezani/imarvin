"use client";

import { Eye, LockKeyhole, Send } from "lucide-react";
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
  stateLabel?: string;
  stateDescription?: string;
};

const controlClass =
  "min-h-11 w-full rounded-md border border-boundary bg-canvas px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const textareaClass =
  "min-h-32 w-full resize-y rounded-md border border-boundary bg-canvas px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

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

function FieldHelp({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className="text-sm leading-5 text-muted-ink">
      {children}
    </p>
  );
}

export function StoryEditorForm({
  initialValues,
  storyId,
  workingRevision,
  stateLabel = "Private draft",
  stateDescription = "Only you can see the saved working copy until you explicitly publish it.",
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
  const visibleStateLabel = dirty ? "Unsaved changes" : stateLabel;
  const visibleStateDescription = dirty
    ? "These edits exist only in this browser until you save them. They are not public."
    : stateDescription;

  return (
    <form
      action={formAction}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
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

      <div className="flex min-w-0 flex-col gap-6">
        {hasErrors ? (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            className="flex flex-col gap-2 rounded-lg border border-destructive bg-surface p-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <h2 className="font-semibold text-destructive">
              Private save not completed
            </h2>
            <p className="text-sm text-ink">{state.message}</p>
            {state.status === "conflict" && storyId ? (
              <Link
                href={"/studio/work/" + storyId + "/edit"}
                className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Reload latest saved version
              </Link>
            ) : null}
          </div>
        ) : null}

        <section className="flex flex-col gap-6 rounded-lg border border-boundary bg-surface p-5 md:p-6">
          <header className="flex flex-col gap-1 border-b border-boundary pb-4">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Story summary
            </h2>
            <p className="text-sm leading-5 text-muted-ink">
              Keep the public-facing summary concise and specific. Draft fields
              may stay incomplete.
            </p>
          </header>

          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-medium text-ink">
              Title
            </label>
            <FieldHelp id="title-help">
              Required for publication. Drafts may leave it empty.
            </FieldHelp>
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
            <FieldHelp id="problem-help">
              Required for publication. State what made this work worth doing.
            </FieldHelp>
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
            <FieldHelp id="contribution-help">
              Required for publication. Describe your responsibility without
              inventing team or outcome details.
            </FieldHelp>
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
        </section>

        <section className="flex flex-col gap-6 rounded-lg border border-boundary bg-surface p-5 md:p-6">
          <header className="flex flex-col gap-1 border-b border-boundary pb-4">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Context
            </h2>
            <p className="text-sm leading-5 text-muted-ink">
              Progress is required for publication. Outcome and stack remain
              optional.
            </p>
          </header>

          <div className="flex flex-col gap-2">
            <label htmlFor="progress" className="font-medium text-ink">
              Project progress
            </label>
            <FieldHelp id="progress-help">
              Required for publication and independent from public
              availability.
            </FieldHelp>
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
            <FieldHelp id="outcome-help">
              Optional. Qualitative outcomes are valid; do not invent metrics.
            </FieldHelp>
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
            <FieldHelp id="stack-help">
              Optional. Separate up to 12 items with commas.
            </FieldHelp>
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
        </section>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
        <section className="flex flex-col gap-4 rounded-lg border border-boundary bg-surface p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-signal-wash text-signal">
              <LockKeyhole aria-hidden="true" className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-sm font-semibold text-muted-ink">
                Editing state
              </p>
              <h2 className="text-xl font-semibold text-ink">
                {visibleStateLabel}
              </h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted-ink">
            {visibleStateDescription}
          </p>
          <div className="border-t border-boundary pt-4">
            <p className="text-sm font-medium text-ink">Save stays private.</p>
            <p className="mt-1 text-sm leading-5 text-muted-ink">
              Preview and publication review always use the saved candidate,
              never unsaved form values.
            </p>
          </div>
        </section>

        <section
          aria-label="Story actions"
          className="flex flex-col gap-3 rounded-lg border border-boundary bg-surface p-4"
        >
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={pending}
            className="flex min-h-11 w-full items-center justify-center rounded-md bg-action-fill px-4 py-2 font-medium text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save privately"}
          </button>

          {storyId && !dirty ? (
            <Link
              href={"/studio/work/" + storyId + "/preview"}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-boundary bg-canvas px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Eye aria-hidden="true" className="size-4" />
              Preview saved candidate
            </Link>
          ) : (
            <button
              type="submit"
              name="intent"
              value="preview"
              disabled={pending}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-boundary bg-canvas px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              <Eye aria-hidden="true" className="size-4" />
              Save & preview
            </button>
          )}

          {storyId && !dirty ? (
            <Link
              href={"/studio/work/" + storyId + "/publish"}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-boundary bg-canvas px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Send aria-hidden="true" className="size-4" />
              Review publication
            </Link>
          ) : (
            <button
              type="submit"
              name="intent"
              value="review"
              disabled={pending}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-boundary bg-canvas px-4 py-2 font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              <Send aria-hidden="true" className="size-4" />
              Save & review
            </button>
          )}
        </section>
      </aside>
    </form>
  );
}
