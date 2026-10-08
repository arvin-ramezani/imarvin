import { expect, test, type Page } from "@playwright/test";

import { provisionOwner } from "../../lib/auth/provision";
import { db } from "../../lib/db";
import { resetTestDatabase } from "../support/test-database";

const OWNER_EMAIL = "work-e2e-owner@example.com";
const OWNER_PASSWORD = "work-e2e-owner-password";

async function signIn(page: Page) {
  await page.goto("/");

  const status = await page.evaluate(
    async ({ email, password }) => {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      return response.status;
    },
    { email: OWNER_EMAIL, password: OWNER_PASSWORD },
  );

  expect(status).toBe(200);
}

test.beforeEach(async () => {
  await resetTestDatabase();
  await provisionOwner({
    email: OWNER_EMAIL,
    name: "Work E2E Owner",
    password: OWNER_PASSWORD,
  });
});

test.afterAll(async () => {
  await resetTestDatabase();
  await db.$disconnect();
});

test("owner saves privately, previews, publishes, then explicitly updates public content", async ({
  page,
}, testInfo) => {
  await signIn(page);
  await page.goto("/studio/work");

  await page.getByRole("link", { name: "New story" }).click();
  await page.getByLabel("Title").fill("Published story");
  await page.getByLabel("Problem or hook").fill("A real problem to explain.");
  await page
    .getByLabel("Your contribution")
    .fill("I designed and implemented the relevant application work.");
  await page.getByLabel("Project progress").selectOption("COMPLETED");
  await page
    .getByLabel("Outcome or lesson")
    .fill("The work clarified the technical trade-offs.");
  await page.getByLabel("Relevant stack").fill("Next.js, PostgreSQL");

  const titleInput = page.getByLabel("Title");
  const themeTrigger = page.locator("summary[aria-label^='Theme:']");
  await themeTrigger.click();
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(titleInput).toHaveValue("Published story");
  await page.screenshot({
    path: testInfo.outputPath("work-owner-edit-dark-wide.png"),
    fullPage: true,
    caret: "initial",
  });

  await page.getByRole("button", { name: "Save & preview" }).click();
  await expect(page.getByText("Private preview", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Published story", level: 1 }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("work-private-preview-dark-wide.png"),
    fullPage: true,
    caret: "initial",
  });

  const previewUrl = new URL(page.url());
  const storyId = previewUrl.pathname.split("/").at(-2);
  expect(storyId).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );

  await page.getByRole("link", { name: "Back to editing" }).click();
  await page.getByRole("link", { name: "Review publication" }).click();
  await expect(page).toHaveURL(
    new RegExp("/studio/work/" + storyId + "/publish$"),
  );
  await expect(
    page.getByRole("heading", { name: "Publish", exact: true, level: 1 }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("work-publication-review-dark-wide.png"),
    fullPage: true,
    caret: "initial",
  });
  await page.getByRole("button", { name: "Publish", exact: true }).click();

  await expect(
    page.getByText(
      "Published. A fresh public request now uses this saved snapshot.",
    ),
  ).toBeVisible();

  const publicPath = "/work/" + storyId;

  await page.goto("/work");
  await expect(
    page.getByRole("heading", { name: "Browse Work", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Published story", level: 2 }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("work-public-collection-dark-wide.png"),
    fullPage: true,
    caret: "initial",
  });

  await page.goto(publicPath);
  await expect(
    page.getByRole("heading", { name: "Published story", level: 1 }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("work-public-detail-dark-wide.png"),
    fullPage: true,
    caret: "initial",
  });

  await page.goto("/studio/work/" + storyId + "/edit");
  await page.getByLabel("Title").fill("Private changed title");
  await page.getByRole("button", { name: "Save privately" }).click();
  await expect(
    page.getByText("Saved privately. Public content was not changed."),
  ).toBeVisible();

  await page.goto("/studio/work");
  await expect(
    page.getByText("Published · private changes", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("work-owner-index-dark-wide.png"),
    fullPage: true,
    caret: "initial",
  });

  await page.goto(publicPath);
  await expect(
    page.getByRole("heading", { name: "Published story", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Private changed title", level: 1 }),
  ).toHaveCount(0);

  await page.goto("/studio/work/" + storyId + "/edit");
  await page.getByRole("link", { name: "Review publication" }).click();
  await expect(page).toHaveURL(
    new RegExp("/studio/work/" + storyId + "/publish$"),
  );
  await expect(
    page.getByRole("heading", {
      name: "Update published content",
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("work-update-publication-review-dark-wide.png"),
    fullPage: true,
    caret: "initial",
  });
  await page
    .getByRole("button", { name: "Update published content", exact: true })
    .click();

  await expect(
    page.getByText(
      "Published content updated. The public snapshot now matches this saved candidate.",
    ),
  ).toBeVisible();

  await page.goto(publicPath);
  await expect(
    page.getByRole("heading", { name: "Private changed title", level: 1 }),
  ).toBeVisible();
  expect(page.url()).toContain(publicPath);
});

test("owner and public Work surfaces reflow at 320px and keep the editor keyboard reachable", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await signIn(page);
  await page.goto("/studio/work/new");

  let reachedTitle = false;

  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press("Tab");

    reachedTitle = await page.evaluate(
      () => document.activeElement?.id === "title",
    );

    if (reachedTitle) {
      break;
    }
  }

  expect(reachedTitle).toBe(true);
  await page.keyboard.type("Keyboard draft");
  await expect(page.getByLabel("Title")).toHaveValue("Keyboard draft");

  const ownerMetrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(ownerMetrics.scrollWidth).toBeLessThanOrEqual(ownerMetrics.clientWidth);
  await page.screenshot({
    path: testInfo.outputPath("work-owner-new-320.png"),
    fullPage: true,
    caret: "initial",
  });

  await page.goto("/work");
  await expect(
    page.getByRole("heading", { name: "No work stories published yet" }),
  ).toBeVisible();

  const publicMetrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(publicMetrics.scrollWidth).toBeLessThanOrEqual(publicMetrics.clientWidth);
  await page.screenshot({
    path: testInfo.outputPath("work-public-empty-320.png"),
    fullPage: true,
    caret: "initial",
  });
});


test("maximum-valid unbroken authored text reflows across Work surfaces at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await signIn(page);

  const title = "T".repeat(120);
  const problem = "P".repeat(1_200);
  const contribution = "C".repeat(1_600);
  const outcome = "O".repeat(1_200);
  const stack = Array.from(
    { length: 12 },
    (_, index) => String(index).padStart(2, "0") + "S".repeat(48),
  ).join(", ");

  const expectNoHorizontalPageOverflow = async () => {
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  };

  await page.goto("/studio/work/new");
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Problem or hook").fill(problem);
  await page.getByLabel("Your contribution").fill(contribution);
  await page.getByLabel("Project progress").selectOption("COMPLETED");
  await page.getByLabel("Outcome or lesson").fill(outcome);
  await page.getByLabel("Relevant stack").fill(stack);
  await page.getByRole("button", { name: "Save & preview" }).click();

  await expect(
    page.getByRole("heading", { name: title, level: 1 }),
  ).toBeVisible();
  await expectNoHorizontalPageOverflow();

  const previewUrl = new URL(page.url());
  const storyId = previewUrl.pathname.split("/").at(-2);
  expect(storyId).toBeTruthy();

  await page.goto("/studio/work/" + storyId + "/edit");
  await expect(
    page.getByRole("heading", { name: title, level: 1 }),
  ).toBeVisible();
  await expectNoHorizontalPageOverflow();

  await page.goto("/studio/work");
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await expectNoHorizontalPageOverflow();

  await page.goto("/studio/work/" + storyId + "/publish");
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await expectNoHorizontalPageOverflow();
  await page.getByRole("button", { name: "Publish", exact: true }).click();

  await page.goto("/work");
  await expect(
    page.getByRole("heading", { name: title, level: 2 }),
  ).toBeVisible();
  await expectNoHorizontalPageOverflow();

  await page.goto("/work/" + storyId);
  await expect(
    page.getByRole("heading", { name: title, level: 1 }),
  ).toBeVisible();
  await expectNoHorizontalPageOverflow();
});


test("owner authors image Evidence, previews saved media, and updates its published snapshot", async ({ page }) => {
  const pngBytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==",
    "base64",
  );

  await signIn(page);
  await page.goto("/studio/work/new");
  await page.getByLabel("Title").fill("Evidence flow");
  await page.getByLabel("Problem or hook").fill("Explain a built user interaction");
  await page.getByLabel("Your contribution").fill("Built and reviewed the implementation");
  await page.getByLabel("Project progress").selectOption("COMPLETED");
  await page.getByRole("button", { name: "Save privately" }).click();
  await expect(page).toHaveURL(/\/studio\/work\/[0-9a-f-]+\/edit\?saved=1$/);

  const storyId = new URL(page.url()).pathname.split("/").at(-2);
  expect(storyId).toBeTruthy();
  await page.getByRole("button", { name: "Add image" }).click();
  await page.getByLabel("Evidence title").fill("Interface screenshot");
  await page.getByLabel("Purpose / caption").fill("Initial capture");
  await page.getByLabel("Confirmed capture stage").selectOption("LOCAL_BUILD");
  await page.getByLabel("I confirm this Evidence may be published").check();
  await page.getByLabel("Image alternative text").fill("A two-pixel synthetic interface capture");
  const uploaded = page.waitForResponse((response) =>
    response.url().endsWith("/media") && response.request().method() === "POST");
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "capture.png", mimeType: "image/png", buffer: pngBytes,
  });
  const uploadResponse = await uploaded;
  expect(uploadResponse.status(), await uploadResponse.text()).toBe(201);
  await expect(page.getByText(/Selected: READY/)).toBeVisible({ timeout: 15000 });
  await page.getByRole("button", { name: "Save privately" }).click();
  await expect(page.getByText("Saved privately. Public content was not changed.")).toBeVisible();

  await page.getByRole("link", { name: "Preview saved candidate" }).click();
  await expect(page.getByText("Private preview", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Interface screenshot/ })).toBeVisible();
  await page.getByRole("link", { name: "Back to editing" }).click();
  await page.getByRole("link", { name: "Review publication" }).click();
  await expect(page.getByText("Added Interface screenshot")).toBeVisible();
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(page.getByText("Published. A fresh public request now uses this saved snapshot."))
    .toBeVisible();

  const first = await db.publishedEvidence.findFirstOrThrow({
    where: { storyId },
  });
  expect(first.caption).toBe("Initial capture");
  await page.getByLabel("Purpose / caption").fill("Revised private caption");
  await page.getByRole("button", { name: "Save privately" }).click();
  await expect(page.getByText("Saved privately. Public content was not changed.")).toBeVisible();
  expect((await db.publishedEvidence.findFirstOrThrow({ where: { storyId } })).caption)
    .toBe("Initial capture");
  await page.getByRole("link", { name: "Review publication" }).click();
  await expect(page.getByText(/caption changed/)).toBeVisible();
  await page.getByRole("button", { name: "Update published content", exact: true }).click();
  await expect(page.getByText(
    "Published content updated. The public snapshot now matches this saved candidate.",
  )).toBeVisible();
  expect((await db.publishedEvidence.findFirstOrThrow({ where: { storyId } })).caption)
    .toBe("Revised private caption");
});
