import type { Metadata } from "next";
import Link from "next/link";

import { authorizeOwnerPage } from "@/features/work/page-data";
import { StoryEditorForm } from "@/features/work/story-editor-form";
import { StudioWorkFrame } from "@/features/work/studio-work-frame";

export const metadata: Metadata = {
  title: "New work story · Studio · imarvin",
  robots: { index: false, follow: false },
};

export default async function NewStoryPage() {
  await authorizeOwnerPage();

  return (
    <StudioWorkFrame active="new">
      <section className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-boundary pb-8">
          <Link
            href="/studio/work"
            className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Back to Work
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-ink">
            Work editor
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-ink">
            New story
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-ink">
            Build the saved candidate in structured fields. You can keep an
            incomplete draft private and review it before anything becomes
            public.
          </p>
        </header>

        <StoryEditorForm
          stateLabel="Private draft"
          stateDescription="Only the saved working copy exists. Publishing is a separate confirmation after review."
          initialValues={{
            title: "",
            problem: "",
            contribution: "",
            progress: "",
            outcome: "",
            stack: "",
          }}
        />
      </section>
    </StudioWorkFrame>
  );
}
