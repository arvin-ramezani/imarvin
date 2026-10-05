import type { Metadata } from "next";
import Link from "next/link";

import { StoryEditorForm } from "@/features/work/story-editor-form";
import { authorizeOwnerPage } from "@/features/work/page-data";

export const metadata: Metadata = {
  title: "New work story · Studio · imarvin",
  robots: { index: false, follow: false },
};

export default async function NewStoryPage() {
  await authorizeOwnerPage();

  return (
    <section className="flex flex-col gap-8">
      <header className="flex max-w-3xl flex-col gap-3 border-b border-boundary pb-6">
        <Link
          href="/studio/work"
          className="w-fit rounded-sm text-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back to Work
        </Link>
        <p className="text-sm font-medium text-muted-ink">Private draft</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          New story
        </h1>
        <p className="text-base leading-6 text-muted-ink">
          You can save an incomplete draft. Publication requirements are checked
          only when you review the saved candidate.
        </p>
      </header>

      <StoryEditorForm
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
  );
}
