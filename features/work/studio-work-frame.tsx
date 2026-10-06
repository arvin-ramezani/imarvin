import { FileText, LockKeyhole, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StudioWorkFrameProps = {
  active?: "work" | "new";
  children: ReactNode;
};

export function StudioWorkFrame({
  active = "work",
  children,
}: StudioWorkFrameProps) {
  return (
    <div className="wrap-anywhere grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
      <aside className="flex flex-col gap-6 border-b border-boundary pb-6 lg:sticky lg:top-8 lg:self-start lg:border-b-0 lg:border-e lg:pb-0 lg:pe-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-ink">
            Owner workspace
          </p>
          <p className="text-2xl font-semibold tracking-tight text-ink">
            Studio Work
          </p>
        </div>

        <nav aria-label="Studio Work" className="flex flex-col gap-2">
          <Link
            href="/studio/work"
            aria-current={active === "work" ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active === "work"
                ? "bg-signal-wash text-ink"
                : "text-muted-ink hover:bg-surface hover:text-ink",
            )}
          >
            <FileText aria-hidden="true" className="size-4 shrink-0" />
            <span>Work</span>
          </Link>
          <Link
            href="/studio/work/new"
            aria-current={active === "new" ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active === "new"
                ? "bg-signal-wash text-ink"
                : "text-muted-ink hover:bg-surface hover:text-ink",
            )}
          >
            <Plus aria-hidden="true" className="size-4 shrink-0" />
            <span>New story</span>
          </Link>
        </nav>

        <div className="flex gap-3 border-s border-signal ps-3">
          <LockKeyhole
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-signal"
          />
          <p className="text-sm leading-6 text-muted-ink">
            Saving changes is private. Publishing always requires a separate
            confirmation.
          </p>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
