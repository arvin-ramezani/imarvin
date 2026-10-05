// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeUtility } from "../components/theme-utility";
import {
  SYSTEM_THEME_QUERY,
  THEME_STORAGE_KEY,
  applyThemeToRoot,
} from "../lib/theme";

type MediaListener = (event: MediaQueryListEvent) => void;

function installMatchMedia(initialDark: boolean) {
  let matches = initialDark;
  const listeners = new Set<MediaListener>();

  const mediaQuery = {
    get matches() {
      return matches;
    },
    media: SYSTEM_THEME_QUERY,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_type: string, listener: MediaListener) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_type: string, listener: MediaListener) => {
      listeners.delete(listener);
    }),
    dispatchEvent: vi.fn(),
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => mediaQuery),
  });

  return {
    setDark(nextDark: boolean) {
      matches = nextDark;
      const event = { matches: nextDark, media: SYSTEM_THEME_QUERY } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function themeTrigger(): HTMLElement {
  const trigger = screen.getByText("Theme").closest("summary");

  if (!trigger) {
    throw new Error("Theme trigger not found");
  }

  return trigger;
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("style");
  applyThemeToRoot(document.documentElement, "system", "light");
});

describe("ThemeUtility", () => {
  it("communicates preference and resolved mode", async () => {
    installMatchMedia(true);
    render(<ThemeUtility />);

    await waitFor(() => {
      expect(themeTrigger().getAttribute("aria-label")).toBe(
        "Theme: System, currently Dark",
      );
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("persists explicit choices, closes, and restores trigger focus", async () => {
    installMatchMedia(false);
    const user = userEvent.setup();
    render(<ThemeUtility />);

    const trigger = themeTrigger();
    await user.click(trigger);
    await user.click(screen.getByLabelText("Dark"));

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.themePreference).toBe("dark");
    expect(document.documentElement.dataset.themeResolved).toBe("dark");
    expect(trigger.parentElement?.hasAttribute("open")).toBe(false);
  });

  it("removes the override for System and follows live device changes", async () => {
    const media = installMatchMedia(false);
    const user = userEvent.setup();
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    applyThemeToRoot(document.documentElement, "dark", "dark");
    render(<ThemeUtility />);

    await waitFor(() => {
      expect(themeTrigger().getAttribute("aria-label")).toContain("Dark");
    });

    await user.click(themeTrigger());
    await user.click(screen.getByLabelText("System"));

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(document.documentElement.dataset.themeResolved).toBe("light");

    media.setDark(true);

    await waitFor(() => {
      expect(document.documentElement.dataset.themeResolved).toBe("dark");
    });
  });

  it("keeps form state intact while switching themes", async () => {
    installMatchMedia(false);
    const user = userEvent.setup();

    render(
      <>
        <label>
          Draft title
          <input aria-label="Draft title" />
        </label>
        <ThemeUtility />
      </>,
    );

    const input = screen.getByLabelText("Draft title") as HTMLInputElement;
    await user.type(input, "Unsaved work");
    input.setSelectionRange(2, 8);

    await user.click(themeTrigger());
    fireEvent.click(screen.getByLabelText("Dark"));

    expect(input.value).toBe("Unsaved work");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(8);
  });
});
