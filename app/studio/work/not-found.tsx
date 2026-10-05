import Link from "next/link";

export default function StudioWorkNotFound() {
  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <p className="text-sm font-medium text-muted-ink">Private studio</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Studio work is unavailable
      </h1>
      <p className="text-base leading-6 text-muted-ink">
        This private destination is not available in the current session.
      </p>
      <Link
        href="/"
        className="w-fit rounded-sm font-medium text-signal underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Return home
      </Link>
    </section>
  );
}
