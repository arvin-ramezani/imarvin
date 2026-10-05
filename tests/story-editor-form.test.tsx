// @vitest-environment jsdom

import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockedSaveStoryAction = vi.hoisted(() =>
  vi.fn(async (previous: { attempt: number }, formData: FormData) => ({
    attempt: previous.attempt + 1,
    status: "validation" as const,
    message: "Check the fields below. Your input has been kept.",
    fieldErrors: {
      title: ["Title is too long."],
    },
    values: {
      title: String(formData.get("title") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      contribution: String(formData.get("contribution") ?? ""),
      progress: "",
      outcome: String(formData.get("outcome") ?? ""),
      stack: String(formData.get("stack") ?? ""),
    },
  })),
);

vi.mock("../features/work/actions", () => ({
  saveStoryAction: mockedSaveStoryAction,
}));

import { StoryEditorForm } from "../features/work/story-editor-form";

afterEach(() => {
  cleanup();
  mockedSaveStoryAction.mockClear();
});

describe("StoryEditorForm", () => {
  it("renders visible structured labels and saved-candidate links", () => {
    render(
      <StoryEditorForm
        storyId="11111111-1111-4111-8111-111111111111"
        workingRevision={3}
        initialValues={{
          title: "Saved story",
          problem: "Problem",
          contribution: "Contribution",
          progress: "COMPLETED",
          outcome: "",
          stack: "Next.js, PostgreSQL",
        }}
      />,
    );

    expect(screen.getByLabelText("Title")).toBeTruthy();
    expect(screen.getByLabelText("Problem or hook")).toBeTruthy();
    expect(screen.getByLabelText("Your contribution")).toBeTruthy();
    expect(screen.getByLabelText("Project progress")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Preview saved candidate" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Review publication" })).toBeTruthy();
  });

  it("focuses the error summary, links affected fields, and retains input", async () => {
    const user = userEvent.setup();

    render(
      <StoryEditorForm
        initialValues={{
          title: "",
          problem: "",
          contribution: "",
          progress: "",
          outcome: "",
          stack: "",
        }}
      />,
    );

    const title = screen.getByLabelText("Title") as HTMLInputElement;
    await user.type(title, "My local unsaved title");
    await user.click(screen.getByRole("button", { name: "Save privately" }));

    const alert = await screen.findByRole("alert");

    await waitFor(() => {
      expect(document.activeElement).toBe(alert);
    });
    expect(title.value).toBe("My local unsaved title");
    expect(screen.getByText("Title is too long.")).toBeTruthy();

    const titleLink = within(alert).getByRole("link", {
      name: "Title: Title is too long.",
    });
    expect(titleLink.getAttribute("href")).toBe("#title");

    await user.click(titleLink);
    expect(document.activeElement).toBe(title);
  });
});
