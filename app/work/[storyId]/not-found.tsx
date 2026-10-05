import Link from "next/link";

export default function WorkStoryNotFound() {
  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <p className="text-sm font-medium text-muted-ink">Work</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        This work story is unavailable
      </h1>
      <p className="text-base leading-6 text-muted-ink">
        The requested public story is not available.
      </p>
      <Link
        href="/work"
        className="w-fit rounded-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Back to Work
      </Link>
    </section>
  );
}
