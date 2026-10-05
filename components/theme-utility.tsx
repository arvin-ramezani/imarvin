"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useRef, useSyncExternalStore } from "react";

import {
  SYSTEM_THEME_QUERY,
  THEME_STORAGE_KEY,
  applyThemeToRoot,
  parseThemePreference,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

const THEME_CHANGE_EVENT = "imarvin:theme-change";
const SERVER_SNAPSHOT = "system:light";

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

function readSystemDark(): boolean {
  try {
    return window.matchMedia(SYSTEM_THEME_QUERY).matches;
  } catch {
    return false;
  }
}

function persistPreference(preference: ThemePreference): void {
  try {
    if (preference === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Local storage is optional; the selected theme remains active for this visit.
  }
}

function readThemeSnapshot(): string {
  const root = document.documentElement;
  const preference = parseThemePreference(root.dataset.themePreference);
  const resolved: ResolvedTheme =
    root.dataset.themeResolved === "dark" ? "dark" : "light";

  return `${preference}:${resolved}`;
}

function subscribeToTheme(onStoreChange: () => void): () => void {
  const handleThemeChange = () => onStoreChange();
  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

  let media: MediaQueryList | null = null;

  try {
    media = window.matchMedia(SYSTEM_THEME_QUERY);
  } catch {
    media = null;
  }

  const handleSystemChange = (event: MediaQueryListEvent) => {
    const preference = parseThemePreference(
      document.documentElement.dataset.themePreference,
    );

    if (preference !== "system") {
      return;
    }

    applyThemeToRoot(
      document.documentElement,
      "system",
      resolveTheme("system", event.matches),
    );
    onStoreChange();
  };

  media?.addEventListener("change", handleSystemChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    media?.removeEventListener("change", handleSystemChange);
  };
}

function labelFor(preference: ThemePreference): string {
  return preference[0].toUpperCase() + preference.slice(1);
}

export function ThemeUtility() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const snapshot = useSyncExternalStore(
    subscribeToTheme,
    readThemeSnapshot,
    () => SERVER_SNAPSHOT,
  );
  const [preferenceValue, resolvedValue] = snapshot.split(":");
  const preference = parseThemePreference(preferenceValue);
  const resolved: ResolvedTheme = resolvedValue === "dark" ? "dark" : "light";

  function choosePreference(nextPreference: ThemePreference): void {
    const nextResolved = resolveTheme(nextPreference, readSystemDark());

    persistPreference(nextPreference);
    applyThemeToRoot(document.documentElement, nextPreference, nextResolved);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));

    detailsRef.current?.removeAttribute("open");
    queueMicrotask(() => triggerRef.current?.focus());
  }

  const CurrentIcon =
    OPTIONS.find((option) => option.value === preference)?.icon ?? Monitor;
  const accessibleName = `Theme: ${labelFor(preference)}, currently ${labelFor(resolved)}`;

  return (
    <details ref={detailsRef} className="relative">
      <summary
        ref={triggerRef}
        aria-label={accessibleName}
        className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-boundary bg-surface px-3 py-2 text-sm font-medium text-ink outline-none hover:bg-signal-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <CurrentIcon aria-hidden="true" className="size-4 shrink-0" />
        <span>Theme</span>
      </summary>

      <fieldset className="absolute end-0 top-full mt-2 min-w-40 rounded-md border border-boundary bg-surface p-2 shadow-sm">
        <legend className="sr-only">Theme preference</legend>
        <div className="flex flex-col gap-1">
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <label
              key={value}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm text-ink hover:bg-signal-wash focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring"
            >
              <input
                type="radio"
                name="theme-preference"
                value={value}
                checked={preference === value}
                onChange={() => choosePreference(value)}
                className="size-4 accent-signal"
              />
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </details>
  );
}
