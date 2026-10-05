import { expect, test, type Page } from "@playwright/test";

import { provisionOwner } from "../../lib/auth/provision";
import { db } from "../../lib/db";

const OWNER_EMAIL = "work-e2e-owner@example.com";
const OWNER_PASSWORD = "work-e2e-owner-password";

async function resetStories() {
  await db.publishedStory.deleteMany();
  await db.story.deleteMany();
}

async function resetOwner() {
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.verification.deleteMany();
  await db.rateLimit.deleteMany();
  await db.user.deleteMany();
}

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

test.beforeAll(async () => {
  await resetStories();
  await resetOwner();
  await provisionOwner({
    email: OWNER_EMAIL,
    name: "Work E2E Owner",
    password: OWNER_PASSWORD,
  });
});

test.beforeEach(async () => {
  await resetStories();
});

test.afterAll(async () => {
  await resetStories();
  await resetOwner();
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
