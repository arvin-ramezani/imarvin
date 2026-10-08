"use client";

import { useState, type FormEvent } from "react";

export function PublicationConfirmation({
  storyId, workingRevision, publishedRevision, label,
}: {
  storyId: string;
  workingRevision: number;
  publishedRevision: number | null;
  label: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/studio/work/" + encodeURIComponent(storyId) + "/publication", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workingRevision, publishedRevision }),
        },
      );
      const result = await response.json() as {
        target?: string; message?: string;
      };
      if (result.target) {
        window.location.assign(result.target);
        return;
      }
      setError(result.message ??
        "Publication outcome cannot be confirmed. Reload the saved review before retrying.");
    } catch {
      setError("Publication outcome cannot be confirmed. Reload the saved review before retrying.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex min-w-0 flex-col gap-2" onSubmit={(event) => {
      void confirm(event);
    }}>
      {error ? (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      ) : null}
      <button type="submit" disabled={pending}
        className="min-h-12 rounded-md bg-action-fill px-6 py-2 font-semibold text-action-ink outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60">
        {pending ? "Confirming…" : label}
      </button>
    </form>
  );
}
