import { expect, test } from "@playwright/test";

const THEME_STORAGE_KEY = "imarvin-theme";
const triggerSelector = "summary[aria-label^='Theme:']";

test("fresh System visit resolves before the first animation frame", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    requestAnimationFrame(() => {
      (
        window as Window & { __firstThemeFrame?: string }
      ).__firstThemeFrame =
        document.documentElement.dataset.themeResolved ?? "";
    });
  });

  await page.goto("/");

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __firstThemeFrame?: string }).__firstThemeFrame,
      ),
    )
    .toBe("dark");

  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-preference",
    "system",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-resolved",
    "dark",
  );
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("explicit theme persists and ignores later device changes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  const trigger = page.locator(triggerSelector);
  await trigger.click();
  await page.getByRole("radio", { name: "Dark" }).click();

  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-resolved",
    "dark",
  );
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), THEME_STORAGE_KEY),
  ).toBe("dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-resolved",
    "dark",
  );

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-preference",
    "dark",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-resolved",
    "dark",
  );
});

test("System restores live device following without resetting page state", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  const trigger = page.locator(triggerSelector);
  await trigger.click();
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-resolved",
    "dark",
  );
  await trigger.click();
  await page.getByRole("radio", { name: "System" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-resolved",
    "light",
  );

  await page.evaluate(() => {
    const main = document.querySelector("main");

    if (!main) {
      throw new Error("Main content not found");
    }

    const input = document.createElement("input");
    input.id = "theme-state-probe";
    input.value = "Unsaved work";
    input.setSelectionRange(2, 8);

    const dialog = document.createElement("dialog");
    dialog.id = "theme-dialog-probe";
    dialog.setAttribute("open", "");

    main.append(input, dialog);
  });

  const before = await page.evaluate(() => ({
    href: window.location.href,
    historyLength: window.history.length,
    scrollY: window.scrollY,
  }));

  await trigger.click();
  await page.getByRole("radio", { name: "Dark" }).click();
  await trigger.click();
  await page.getByRole("radio", { name: "System" }).click();

  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), THEME_STORAGE_KEY),
  ).toBeNull();

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-resolved",
    "dark",
  );

  const after = await page.evaluate(() => {
    const input = document.querySelector<HTMLInputElement>("#theme-state-probe");
    const dialog = document.querySelector<HTMLDialogElement>("#theme-dialog-probe");

    return {
      href: window.location.href,
      historyLength: window.history.length,
      scrollY: window.scrollY,
      value: input?.value,
      selectionStart: input?.selectionStart,
      selectionEnd: input?.selectionEnd,
      dialogOpen: dialog?.hasAttribute("open"),
    };
  });

  expect(after.href).toBe(before.href);
  expect(after.historyLength).toBe(before.historyLength);
  expect(after.scrollY).toBe(before.scrollY);
  expect(after.value).toBe("Unsaved work");
  expect(after.selectionStart).toBe(2);
  expect(after.selectionEnd).toBe(8);
  expect(after.dialogOpen).toBe(true);
});

test("theme utility remains usable at 320px with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");

  const trigger = page.locator(triggerSelector);
  await trigger.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("radio", { name: "System" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Light" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Dark" })).toBeVisible();

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    animationName: getComputedStyle(document.body).animationName,
    transitionDuration: getComputedStyle(document.body).transitionDuration,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  expect(metrics.animationName).toBe("none");
  expect(metrics.transitionDuration === "0s" || metrics.transitionDuration === "").toBe(
    true,
  );

  for (const name of ["System", "Light", "Dark"]) {
    const box = await page.getByRole("radio", { name }).locator("..").boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test("captures representative shell evidence", async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.screenshot({
    path: testInfo.outputPath("shell-light-wide.png"),
    fullPage: true,
  });

  const trigger = page.locator(triggerSelector);
  await trigger.click();
  await page.getByRole("radio", { name: "Dark" }).click();
  await trigger.click();
  await page.screenshot({
    path: testInfo.outputPath("shell-dark-wide.png"),
    fullPage: true,
  });

  await page.setViewportSize({ width: 320, height: 720 });
  await page.screenshot({
    path: testInfo.outputPath("shell-dark-320.png"),
    fullPage: true,
  });
});
