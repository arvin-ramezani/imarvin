import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeUtility } from "@/components/theme-utility";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#main-content"
        className="absolute start-4 top-4 z-10 flex min-h-11 -translate-y-24 items-center rounded-md border border-boundary bg-surface px-3 py-2 text-sm font-medium text-ink outline-none focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Skip to main content
      </a>

      <header className="border-b border-boundary">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <nav aria-label="Primary">
            <Link
              href="/"
              className="rounded-sm text-lg font-semibold tracking-tight text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              imarvin
            </Link>
          </nav>
          <ThemeUtility />
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl px-4 py-8 outline-none md:px-8"
      >
        {children}
      </main>
    </div>
  );
}
