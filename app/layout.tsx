import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "imarvin",
  description: "Arvin Ramezani's creative personal web app.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      data-theme-preference="system"
      data-theme-resolved="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
