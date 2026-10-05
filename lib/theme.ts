export const THEME_STORAGE_KEY = "imarvin-theme";
export const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

export const THEME_PREFERENCES = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export function parseThemePreference(
  value: string | null | undefined,
): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme {
  if (preference === "light" || preference === "dark") {
    return preference;
  }

  return systemDark ? "dark" : "light";
}

export function applyThemeToRoot(
  root: HTMLElement,
  preference: ThemePreference,
  resolved: ResolvedTheme,
): void {
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.themePreference = preference;
  root.dataset.themeResolved = resolved;
  root.style.colorScheme = resolved;
}

export const THEME_BOOTSTRAP_SCRIPT = `(() => {
  const root = document.documentElement;
  let preference = "system";

  try {
    const stored = window.localStorage.getItem("imarvin-theme");
    if (stored === "light" || stored === "dark") {
      preference = stored;
    }
  } catch {}

  let systemDark = false;

  if (preference === "system") {
    try {
      systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {}
  }

  const resolved =
    preference === "dark" || (preference === "system" && systemDark)
      ? "dark"
      : "light";

  root.classList.toggle("dark", resolved === "dark");
  root.dataset.themePreference = preference;
  root.dataset.themeResolved = resolved;
  root.style.colorScheme = resolved;
})();`;
