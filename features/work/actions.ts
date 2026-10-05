"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { OwnerAuthorizationError } from "@/lib/auth";
import { logEvent } from "@/lib/logging/logger";

import {
  createOwnerStory,
  publishOwnerStory,
  saveOwnerStory,
} from "./owner";
import {
  StoryConflictError,
  StoryNotFoundError,
  StoryPublicationValidationError,
} from "./repository";
import type { StoryField, StoryFormValues } from "./types";
import {
  parseStoryDraftFormData,
  zodFieldErrors,
} from "./validation";

export type StoryEditorActionState = {
  attempt: number;
  status: "idle" | "validation" | "conflict" | "error";
  message: string | null;
  fieldErrors: Partial<Record<StoryField, string[]>>;
  values: StoryFormValues;
};

const identitySchema = z.uuid();
const revisionSchema = z.coerce.number().int().positive();

function requestHeaders(source: Headers): Headers {
  return new Headers(source);
}

function targetForIntent(intent: string, storyId: string): string {
  if (intent === "preview") {
    return `/studio/work/${storyId}/preview`;
  }

  if (intent === "review") {
    return `/studio/work/${storyId}/publish`;
  }

  return `/studio/work/${storyId}/edit?saved=1`;
}

function validationState(
  previous: StoryEditorActionState,
  values: StoryFormValues,
  fieldErrors: Partial<Record<StoryField, string[]>>,
): StoryEditorActionState {
  return {
    attempt: previous.attempt + 1,
    status: "validation",
    message: "Check the fields below. Your input has been kept.",
    fieldErrors,
    values,
  };
}

export async function saveStoryAction(
  previous: StoryEditorActionState,
  formData: FormData,
): Promise<StoryEditorActionState> {
  const parsed = parseStoryDraftFormData(formData);

  if (!parsed.result.success) {
    return validationState(
      previous,
      parsed.values,
      zodFieldErrors(parsed.result.error),
    );
  }

  const storyIdValue = String(formData.get("storyId") ?? "");
  const revisionValue = String(formData.get("workingRevision") ?? "");
  const intent = String(formData.get("intent") ?? "save");
  const incomingHeaders = requestHeaders(await headers());

  let target: string | null = null;

  try {
    let story;

    if (storyIdValue) {
      const storyId = identitySchema.safeParse(storyIdValue);
      const workingRevision = revisionSchema.safeParse(revisionValue);

      if (!storyId.success || !workingRevision.success) {
        return {
          attempt: previous.attempt + 1,
          status: "error",
          message: "The saved story reference is invalid. Reload the editor.",
          fieldErrors: {},
          values: parsed.values,
        };
      }

      story = await saveOwnerStory(
        incomingHeaders,
        storyId.data,
        workingRevision.data,
        parsed.result.data,
      );
    } else {
      story = await createOwnerStory(incomingHeaders, parsed.result.data);
    }

    revalidatePath("/studio/work");
    revalidatePath(`/studio/work/${story.id}/edit`);
    revalidatePath(`/studio/work/${story.id}/preview`);
    revalidatePath(`/studio/work/${story.id}/publish`);
    target = targetForIntent(intent, story.id);
  } catch (error) {
    if (error instanceof StoryConflictError) {
      return {
        attempt: previous.attempt + 1,
        status: "conflict",
        message:
          "This story changed since you opened it. Copy any local text you need, then reload the latest saved version before retrying.",
        fieldErrors: {},
        values: parsed.values,
      };
    }

    if (error instanceof OwnerAuthorizationError) {
      return {
        attempt: previous.attempt + 1,
        status: "error",
        message:
          "Your owner session is no longer available. Sign in again, then reload the latest saved version before retrying.",
        fieldErrors: {},
        values: parsed.values,
      };
    }

    if (error instanceof StoryNotFoundError) {
      return {
        attempt: previous.attempt + 1,
        status: "error",
        message:
          "This saved story is no longer available. Your current input has been kept on this page.",
        fieldErrors: {},
        values: parsed.values,
      };
    }

    logEvent("error", "story_save_failed", {
      storyId: storyIdValue || null,
    });

    return {
      attempt: previous.attempt + 1,
      status: "error",
      message:
        "The private save could not be confirmed. Your input has been kept; retry after checking the current saved version.",
      fieldErrors: {},
      values: parsed.values,
    };
  }

  if (target) {
    redirect(target);
  }

  return {
    attempt: previous.attempt + 1,
    status: "error",
    message: "The private save could not be confirmed.",
    fieldErrors: {},
    values: parsed.values,
  };
}

export async function publishStoryAction(formData: FormData): Promise<void> {
  const storyId = identitySchema.safeParse(String(formData.get("storyId") ?? ""));
  const workingRevision = revisionSchema.safeParse(
    String(formData.get("workingRevision") ?? ""),
  );
  const rawPublishedRevision = String(formData.get("publishedRevision") ?? "");
  const publishedRevision =
    rawPublishedRevision === ""
      ? { success: true as const, data: null }
      : revisionSchema.safeParse(rawPublishedRevision);

  if (!storyId.success || !workingRevision.success || !publishedRevision.success) {
    redirect("/studio/work?publication=invalid");
  }

  const incomingHeaders = requestHeaders(await headers());
  let target: string;

  try {
    const result = await publishOwnerStory(incomingHeaders, {
      storyId: storyId.data,
      expectedWorkingRevision: workingRevision.data,
      expectedPublishedRevision: publishedRevision.data,
    });

    revalidatePath("/work");
    revalidatePath(`/work/${storyId.data}`);
    revalidatePath("/studio/work");
    revalidatePath(`/studio/work/${storyId.data}/edit`);
    revalidatePath(`/studio/work/${storyId.data}/preview`);
    revalidatePath(`/studio/work/${storyId.data}/publish`);

    target = `/studio/work/${storyId.data}/edit?publication=${result.mode}`;
  } catch (error) {
    if (error instanceof StoryConflictError) {
      target = `/studio/work/${storyId.data}/publish?error=conflict`;
    } else if (error instanceof StoryPublicationValidationError) {
      target = `/studio/work/${storyId.data}/publish?error=validation`;
    } else if (error instanceof OwnerAuthorizationError) {
      target = `/studio/work/${storyId.data}/publish?error=session`;
    } else if (error instanceof StoryNotFoundError) {
      target = "/studio/work?publication=unavailable";
    } else {
      logEvent("error", "story_publication_failed", {
        storyId: storyId.data,
        workingRevision: workingRevision.data,
        publishedRevision: publishedRevision.data,
      });
      target = `/studio/work/${storyId.data}/publish?error=failed`;
    }
  }

  redirect(target);
}
