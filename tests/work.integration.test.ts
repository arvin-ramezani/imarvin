import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { db } from "../lib/db";
import {
  StoryConflictError,
  StoryPublicationValidationError,
  createStory,
  getPublishedStory,
  listPublishedStories,
  publishStory,
  saveStory,
} from "../features/work/repository";

const createdStoryIds = new Set<string>();

async function createTrackedStory(input: Parameters<typeof createStory>[0]) {
  const story = await createStory(input);
  createdStoryIds.add(story.id);

  return story;
}

afterEach(async () => {
  if (createdStoryIds.size > 0) {
    await db.story.deleteMany({
      where: { id: { in: [...createdStoryIds] } },
    });
    createdStoryIds.clear();
  }
});

describe("work story publishing", () => {
  it("keeps an incomplete working copy private", async () => {
    const story = await createTrackedStory({
      title: "",
      problem: "",
      contribution: "",
      progress: null,
      outcome: null,
      stack: [],
    });

    expect(story.workingRevision).toBe(1);
    await expect(getPublishedStory(story.id)).resolves.toBeNull();

    await expect(
      publishStory({
        storyId: story.id,
        expectedWorkingRevision: 1,
        expectedPublishedRevision: null,
      }),
    ).rejects.toBeInstanceOf(StoryPublicationValidationError);

    await expect(getPublishedStory(story.id)).resolves.toBeNull();
  });

  it("blocks a stale private save without overwriting the newer working copy", async () => {
    const story = await createTrackedStory({
      title: "Initial",
      problem: "",
      contribution: "",
      progress: null,
      outcome: null,
      stack: [],
    });

    await saveStory(story.id, 1, {
      title: "Newest saved title",
      problem: "",
      contribution: "",
      progress: null,
      outcome: null,
      stack: [],
    });

    await expect(
      saveStory(story.id, 1, {
        title: "Stale title",
        problem: "",
        contribution: "",
        progress: null,
        outcome: null,
        stack: [],
      }),
    ).rejects.toBeInstanceOf(StoryConflictError);

    const current = await db.story.findUniqueOrThrow({
      where: { id: story.id },
    });

    expect(current.title).toBe("Newest saved title");
    expect(current.workingRevision).toBe(2);
  });

  it("publishes atomically, keeps later saves private, then updates explicitly", async () => {
    const story = await createTrackedStory({
      title: "Stable public title",
      problem: "A real problem",
      contribution: "A real contribution",
      progress: "COMPLETED",
      outcome: "A real lesson",
      stack: ["Next.js", "PostgreSQL"],
    });

    const firstPublication = await publishStory({
      storyId: story.id,
      expectedWorkingRevision: 1,
      expectedPublishedRevision: null,
    });

    expect(firstPublication.mode).toBe("published");
    expect(firstPublication.snapshot.storyId).toBe(story.id);
    expect(firstPublication.snapshot.revision).toBe(1);

    const saved = await saveStory(story.id, 1, {
      title: "Private changed title",
      problem: "A real problem",
      contribution: "A real contribution",
      progress: "COMPLETED",
      outcome: "A refined lesson",
      stack: ["Next.js", "PostgreSQL"],
    });

    const beforeUpdate = await getPublishedStory(story.id);
    expect(saved.workingRevision).toBe(2);
    expect(beforeUpdate?.title).toBe("Stable public title");
    expect(beforeUpdate?.outcome).toBe("A real lesson");

    const update = await publishStory({
      storyId: story.id,
      expectedWorkingRevision: 2,
      expectedPublishedRevision: 1,
    });

    expect(update.mode).toBe("updated");
    expect(update.snapshot.storyId).toBe(story.id);
    expect(update.snapshot.revision).toBe(2);
    expect(update.snapshot.title).toBe("Private changed title");
    expect(update.snapshot.sourceWorkingRevision).toBe(2);
  });

  it("blocks a stale public revision and preserves the confirmed snapshot", async () => {
    const story = await createTrackedStory({
      title: "Version one",
      problem: "Problem",
      contribution: "Contribution",
      progress: "ONGOING",
      outcome: null,
      stack: [],
    });

    await publishStory({
      storyId: story.id,
      expectedWorkingRevision: 1,
      expectedPublishedRevision: null,
    });

    await saveStory(story.id, 1, {
      title: "Version two",
      problem: "Problem",
      contribution: "Contribution",
      progress: "ONGOING",
      outcome: null,
      stack: [],
    });
    await publishStory({
      storyId: story.id,
      expectedWorkingRevision: 2,
      expectedPublishedRevision: 1,
    });

    await saveStory(story.id, 2, {
      title: "Version three private",
      problem: "Problem",
      contribution: "Contribution",
      progress: "ONGOING",
      outcome: null,
      stack: [],
    });

    await expect(
      publishStory({
        storyId: story.id,
        expectedWorkingRevision: 3,
        expectedPublishedRevision: 1,
      }),
    ).rejects.toBeInstanceOf(StoryConflictError);

    const publicStory = await getPublishedStory(story.id);
    expect(publicStory?.revision).toBe(2);
    expect(publicStory?.title).toBe("Version two");
  });

  it("lists only published snapshots, never draft-only content", async () => {
    const privateStory = await createTrackedStory({
      title: "Private only",
      problem: "",
      contribution: "",
      progress: null,
      outcome: null,
      stack: [],
    });
    const publicStory = await createTrackedStory({
      title: "Public story",
      problem: "Problem",
      contribution: "Contribution",
      progress: "CANCELLED",
      outcome: null,
      stack: [],
    });

    await publishStory({
      storyId: publicStory.id,
      expectedWorkingRevision: 1,
      expectedPublishedRevision: null,
    });

    const published = await listPublishedStories();
    const ids = published.map((story) => story.storyId);

    expect(ids).toContain(publicStory.id);
    expect(ids).not.toContain(privateStory.id);
    expect(
      published.find((story) => story.storyId === publicStory.id)?.title,
    ).toBe("Public story");
  });
});
