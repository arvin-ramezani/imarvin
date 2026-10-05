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

  it("allows exactly one concurrent private save for a working revision", async () => {
    const story = await createTrackedStory({
      title: "Initial",
      problem: "",
      contribution: "",
      progress: null,
      outcome: null,
      stack: [],
    });

    const attempts = await Promise.allSettled([
      saveStory(story.id, 1, {
        title: "Concurrent title A",
        problem: "",
        contribution: "",
        progress: null,
        outcome: null,
        stack: [],
      }),
      saveStory(story.id, 1, {
        title: "Concurrent title B",
        problem: "",
        contribution: "",
        progress: null,
        outcome: null,
        stack: [],
      }),
    ]);

    const fulfilled = attempts.filter(
      (attempt) => attempt.status === "fulfilled",
    );
    const rejected = attempts.filter(
      (attempt) => attempt.status === "rejected",
    );

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(
      rejected[0]?.status === "rejected" ? rejected[0].reason : null,
    ).toBeInstanceOf(StoryConflictError);

    const current = await db.story.findUniqueOrThrow({
      where: { id: story.id },
    });

    expect(["Concurrent title A", "Concurrent title B"]).toContain(current.title);
    expect(current.workingRevision).toBe(2);
  });

  it("allows exactly one concurrent first publication", async () => {
    const story = await createTrackedStory({
      title: "Concurrent publication",
      problem: "Problem",
      contribution: "Contribution",
      progress: "ONGOING",
      outcome: null,
      stack: [],
    });

    const input = {
      storyId: story.id,
      expectedWorkingRevision: 1,
      expectedPublishedRevision: null,
    };

    const attempts = await Promise.allSettled([
      publishStory(input),
      publishStory(input),
    ]);
    const fulfilled = attempts.filter(
      (attempt) => attempt.status === "fulfilled",
    );
    const rejected = attempts.filter(
      (attempt) => attempt.status === "rejected",
    );

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(
      rejected[0]?.status === "rejected" ? rejected[0].reason : null,
    ).toBeInstanceOf(StoryConflictError);

    const publicStory = await getPublishedStory(story.id);
    expect(publicStory?.revision).toBe(1);
    expect(publicStory?.sourceWorkingRevision).toBe(1);
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
