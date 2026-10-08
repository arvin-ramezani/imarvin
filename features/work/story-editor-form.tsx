"use client";

import { Eye, LockKeyhole, Send } from "lucide-react";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import {
  saveStoryAction,
  type StoryEditorActionState,
} from "./actions";
import type { StoryField, StoryFormValues, EvidenceDraftInput } from "./types";
import { EvidenceEditor } from "./evidence-editor";
import { parseStoryDraftFormData, storyFormValuesFromData, zodFieldErrors } from "./validation";

type StoryEditorFormProps = {
  initialValues: StoryFormValues;
  storyId?: string;
  workingRevision?: number;
  stateLabel?: string;
  stateDescription?: string;
  initialEvidence?: EvidenceDraftInput[];
  initialCover?: string | null;
  initialLead?: string | null;
  initialFigures?: string[];
  initialAssets?: Array<{
    id: string; mediaType: "IMAGE" | "VIDEO" | "VTT";
    readiness: "READY" | "PENDING" | "FAILED"; originalFileName: string;
  }>;
};

const controlClass =
  "min-h-11 w-full rounded-md border border-boundary bg-canvas px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const textareaClass =
  "min-h-32 w-full resize-y rounded-md border border-boundary bg-canvas px-3 py-2 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const STORY_FIELD_ORDER: StoryField[] = [
  "title",
  "problem",
  "contribution",
  "progress",
  "outcome",
  "stack",
  "releaseHistory",
  "availability",
  "liveDestinationUrl",
  "evidence",
];

const STORY_FIELD_LABELS: Record<StoryField, string> = {
  title: "Title",
  problem: "Problem or hook",
  contribution: "Your contribution",
  progress: "Project progress",
  outcome: "Outcome or lesson",
  stack: "Relevant stack",
  releaseHistory: "Release history",
  availability: "Current availability",
  liveDestinationUrl: "Live destination",
  evidence: "Evidence and media",
};

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
  initialEvidence, initialCover, initialLead, initialFigures, initialAssets,
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
  const [localPending, setLocalPending] = useState(false);
  const [localState, setLocalState] = useState<StoryEditorActionState | null>(null);
  const markDirty = useCallback(() => setDirty(true), []);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const presentedState = localState ?? state;
  const saving = pending || localPending;

  async function submitExisting(event: FormEvent<HTMLFormElement>) {
    if (!storyId || !workingRevision) return; // New Story uses the existing action.
    event.preventDefault();
    if (localPending) return;
    const formData = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const intent = submitter instanceof HTMLButtonElement ?
      submitter.value : "save";
    const parsed = parseStoryDraftFormData(formData);
    const values = storyFormValuesFromData(formData);
    const attempt = (localState?.attempt ?? state.attempt) + 1;
    if (!parsed.result.success) {
      setLocalState({
        attempt, status: "validation", values,
        message: "Check the fields below. Your input has been kept.",
        fieldErrors: zodFieldErrors(parsed.result.error),
      });
      return;
    }
    setLocalPending(true);
    try {
      const response = await fetch(
        "/api/studio/work/" + encodeURIComponent(storyId) + "/candidate", {
          method: "POST", credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedWorkingRevision: workingRevision, intent,
            draft: parsed.result.data,
          }),
        },
      );
      const result = await response.json() as {
        target?: string; message?: string;
        fieldErrors?: StoryEditorActionState["fieldErrors"];
      };
      if (response.ok && result.target) {
        setDirty(false);
        window.location.assign(result.target);
        return;
      }
      setLocalState({
        attempt, values, fieldErrors: result.fieldErrors ?? {},
        status: response.status === 409 ? "conflict" :
          response.status === 400 ? "validation" : "error",
        message: result.message ?? "Save could not be confirmed; reload the current saved version before retrying.",
      });
    } catch {
      setLocalState({
        attempt, values, status: "error", fieldErrors: {},
        message: "Save outcome is uncertain. Reload the latest saved version before retrying.",
      });
    } finally {
      setLocalPending(false);
    }
  }

  useEffect(() => {
    if (presentedState.attempt > 0 && presentedState.status !== "idle") {
      errorSummaryRef.current?.focus();
    }
  }, [presentedState.attempt, presentedState.status]);

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

  const hasErrors = presentedState.status !== "idle";
  const summaryFieldErrors = STORY_FIELD_ORDER.flatMap((field) => {
    const errors = presentedState.fieldErrors[field];

    return errors?.length ? [{ field, errors }] : [];
  });
  const visibleStateLabel = dirty ? "Unsaved changes" : stateLabel;
  const visibleStateDescription = dirty
    ? "These edits exist only in this browser until you save them. They are not public."
    : stateDescription;

  return (
    <form
      action={formAction}
      onSubmit={(event) => { void submitExisting(event); }}
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
            <p className="text-sm text-ink">{presentedState.message}</p>
            {summaryFieldErrors.length > 0 ? (
              <ul className="flex flex-col gap-1 text-sm">
                {summaryFieldErrors.map(({ field, errors }) => (
                  <li key={field}>
                    <a
                      href={"#" + field}
                      onClick={(event) => {
                        const control = document.getElementById(field);

                        if (control) {
                          event.preventDefault();
                          control.focus();
                        }
                      }}
                      className="rounded-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {STORY_FIELD_LABELS[field]}: {errors.join(" ")}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {presentedState.status === "conflict" && storyId ? (
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
              defaultValue={presentedState.values.title}
              maxLength={120}
              aria-describedby="title-help title-error"
              aria-invalid={Boolean(presentedState.fieldErrors.title?.length)}
              className={controlClass}
            />
            <FieldErrors errors={presentedState.fieldErrors.title} id="title-error" />
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
              defaultValue={presentedState.values.problem}
              maxLength={1200}
              aria-describedby="problem-help problem-error"
              aria-invalid={Boolean(presentedState.fieldErrors.problem?.length)}
              className={textareaClass}
            />
            <FieldErrors errors={presentedState.fieldErrors.problem} id="problem-error" />
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
              defaultValue={presentedState.values.contribution}
              maxLength={1600}
              aria-describedby="contribution-help contribution-error"
              aria-invalid={Boolean(presentedState.fieldErrors.contribution?.length)}
              className={textareaClass}
            />
            <FieldErrors
              errors={presentedState.fieldErrors.contribution}
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
              defaultValue={presentedState.values.progress}
              aria-describedby="progress-help progress-error"
              aria-invalid={Boolean(presentedState.fieldErrors.progress?.length)}
              className={controlClass}
            >
              <option value="">Not set</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <FieldErrors errors={presentedState.fieldErrors.progress} id="progress-error" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="releaseHistory" className="font-medium text-ink">Release history</label>
            <FieldHelp id="releaseHistory-help">Independent of project progress. Unknown facts stay unconfirmed.</FieldHelp>
            <select id="releaseHistory" name="releaseHistory"
              defaultValue={presentedState.values.releaseHistory ?? ""} className={controlClass}>
              <option value="">Not confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="NEVER_SHIPPED">Never shipped</option>
            </select>
            <FieldErrors errors={presentedState.fieldErrors.releaseHistory} id="releaseHistory-error" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="availability" className="font-medium text-ink">Current availability</label>
            <select id="availability" name="availability"
              defaultValue={presentedState.values.availability ?? ""} className={controlClass}>
              <option value="">Not confirmed</option>
              <option value="LIVE_DESTINATION">Live destination</option>
              <option value="NO_LIVE_DESTINATION">No live destination</option>
            </select>
            <FieldErrors errors={presentedState.fieldErrors.availability} id="availability-error" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="liveDestinationUrl" className="font-medium text-ink">Confirmed live HTTPS URL</label>
            <FieldHelp id="liveDestinationUrl-help">Only when a live destination is confirmed; never inferred from screenshots.</FieldHelp>
            <input id="liveDestinationUrl" name="liveDestinationUrl" type="url" maxLength={2048}
              defaultValue={presentedState.values.liveDestinationUrl ?? ""} className={controlClass} />
            <FieldErrors errors={presentedState.fieldErrors.liveDestinationUrl} id="liveDestinationUrl-error" />
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
              defaultValue={presentedState.values.outcome}
              maxLength={1200}
              aria-describedby="outcome-help outcome-error"
              aria-invalid={Boolean(presentedState.fieldErrors.outcome?.length)}
              className={textareaClass}
            />
            <FieldErrors errors={presentedState.fieldErrors.outcome} id="outcome-error" />
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
              defaultValue={presentedState.values.stack}
              aria-describedby="stack-help stack-error"
              aria-invalid={Boolean(presentedState.fieldErrors.stack?.length)}
              className={controlClass}
            />
            <FieldErrors errors={presentedState.fieldErrors.stack} id="stack-error" />
          </div>
        </section>
        {storyId && initialEvidence && initialAssets ? (
          <EvidenceEditor
            storyId={storyId}
            initialEvidence={initialEvidence}
            initialCover={initialCover ?? null}
            initialLead={initialLead ?? null}
            initialFigures={initialFigures ?? []}
            initialAssets={initialAssets}
            onDirty={markDirty}
          />
        ) : (
          <section className="rounded-lg border border-boundary bg-surface p-5 text-sm text-muted-ink">
            Save this Story privately before adding image, recording, diagram or link Evidence.
          </section>
        )}
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
            disabled={saving}
            className="flex min-h-11 w-full items-center justify-center rounded-md bg-action-fill px-4 py-2 font-medium text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save privately"}
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
              disabled={saving}
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
              disabled={saving}
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
