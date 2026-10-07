import { access, chmod, lstat, mkdir, symlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { POST as uploadRoute } from "../app/api/studio/work/[storyId]/media/route";
import {
  DELETE as deleteMediaRoute,
  GET as privateMediaRoute,
} from "../app/api/studio/work/[storyId]/media/[assetId]/route";
import { POST as retryRoute } from "../app/api/studio/work/[storyId]/media/[assetId]/retry/route";
import { GET as publicMediaRoute } from "../app/api/work/media/[assetId]/route";
import {
  completeMediaUpload,
  createPendingMediaAsset,
  failMediaUpload,
  retryFailedMediaAsset,
} from "../features/work/media-repository";
import {
  reconcileMediaStorage,
} from "../features/work/media-service";
import {
  mediaStoragePath,
  promoteStagedMedia,
  writeStagedMedia,
} from "../features/work/media-storage";
import { MEDIA_REQUEST_LIMIT } from "../features/work/media-validation";
import { auth } from "../lib/auth/instance";
import { provisionOwner } from "../lib/auth";
import { db } from "../lib/db";
import {
  createStory,
  publishStory,
} from "../features/work/repository";
import { resetTestDatabase } from "./support/test-database";
import { resetTestMediaStorage } from "./support/test-media";
import { indexedPngFixture } from "./support/media-fixtures";

const APP_ORIGIN = "http://localhost:3000";
const OWNER_EMAIL = "media-owner@example.com";
const OWNER_PASSWORD = "media-owner-password";
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==",
  "base64",
);

async function authRequest(
  path: string,
  body: Record<string, unknown>,
): Promise<Response> {
  return auth.handler(
    new Request(APP_ORIGIN + "/api/auth" + path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: APP_ORIGIN,
        "x-forwarded-for": "198.51.100.70",
      },
      body: JSON.stringify(body),
    }),
  );
}

function sessionCookie(response: Response): string {
  const value = response.headers.get("set-cookie");

  if (!value) {
    throw new Error("Expected owner session cookie");
  }

  return value.split(";")[0] ?? "";
}

async function ownerCookie(): Promise<string> {
  await provisionOwner({
    email: OWNER_EMAIL,
    name: "Owner",
    password: OWNER_PASSWORD,
  });
  const response = await authRequest("/sign-in/email", {
    email: OWNER_EMAIL,
    password: OWNER_PASSWORD,
  });

  expect(response.status).toBe(200);
  return sessionCookie(response);
}

function pngFile(name = "capture.png"): File {
  return new File([PNG_BYTES], name, { type: "image/png" });
}

function uploadRequest(
  storyId: string,
  cookie: string,
  file: File,
  origin = APP_ORIGIN,
): Request {
  const form = new FormData();
  form.set("file", file);

  return new Request(
    APP_ORIGIN + "/api/studio/work/" + storyId + "/media",
    {
      method: "POST",
      headers: { cookie, origin },
      body: form,
    },
  );
}

async function createPublishableStory() {
  return createStory({
    title: "Media foundation",
    problem: "Show the work accurately",
    contribution: "Built the system",
    progress: "COMPLETED",
    outcome: null,
    stack: ["Next.js"],
  });
}

describe("Work media persistence and delivery foundation", () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await resetTestMediaStorage();
  });

  it("keeps existing text-only Story and PublishedStory media facts empty", async () => {
    const story = await createPublishableStory();

    expect(story).toMatchObject({
      releaseHistory: null,
      availability: null,
      liveDestinationUrl: null,
      discoveryCoverEvidenceId: null,
      leadEvidenceId: null,
    });
    await expect(db.evidence.count()).resolves.toBe(0);
    await expect(db.mediaAsset.count()).resolves.toBe(0);

    await publishStory({
      storyId: story.id,
      expectedWorkingRevision: 1,
      expectedPublishedRevision: null,
    });

    const published = await db.publishedStory.findUniqueOrThrow({
      where: { storyId: story.id },
    });

    expect(published).toMatchObject({
      releaseHistory: null,
      availability: null,
      liveDestinationUrl: null,
      discoveryCoverEvidenceId: null,
      leadEvidenceId: null,
    });
  });

  it("rejects storage-key traversal before resolving the configured root", () => {
    expect(() => mediaStoragePath("assets", "../escape")).toThrow(
      "Invalid media storage key",
    );
    expect(() => mediaStoragePath(".staging", "/absolute")).toThrow(
      "Invalid media storage key",
    );
  });

  it("uses private directories/files and rejects unsafe existing storage state", async () => {
    const originalUmask = process.umask(0o022);

    try {
      const cookie = await ownerCookie();
      const story = await createPublishableStory();
      const response = await uploadRoute(
        uploadRequest(story.id, cookie, pngFile()),
        { params: Promise.resolve({ storyId: story.id }) },
      );

      expect(response.status).toBe(201);
      const { id } = (await response.json()) as { id: string };
      const asset = await db.mediaAsset.findUniqueOrThrow({ where: { id } });
      const filePath = mediaStoragePath("assets", asset.storageKey);
      const stagingPath = mediaStoragePath(".staging", asset.storageKey);

      expect((await lstat(filePath)).mode & 0o777).toBe(0o600);
      expect((await lstat(filePath.replace(/\/assets\/[^/]+$/, ""))).mode & 0o777).toBe(0o700);
      expect((await lstat(filePath.replace(/\/[^/]+$/, ""))).mode & 0o777).toBe(0o700);
      expect((await lstat(stagingPath.replace(/\/[^/]+$/, ""))).mode & 0o777).toBe(0o700);

      await chmod(filePath, 0o644);
      const blocked = await privateMediaRoute(
        new Request(APP_ORIGIN + "/api/studio/work/" + story.id + "/media/" + id, {
          headers: { cookie },
        }),
        { params: Promise.resolve({ storyId: story.id, assetId: id }) },
      );
      expect(blocked.status).not.toBe(200);
    } finally {
      process.umask(originalUmask);
    }
  });

  it("refuses symbolic storage directories before accepting file bytes", async () => {
    const root = dirname(dirname(mediaStoragePath("assets", randomUUID())));
    const redirected = join(root, "redirected");
    await mkdir(redirected, { mode: 0o700 });
    await symlink(redirected, join(root, "assets"));

    const cookie = await ownerCookie();
    const story = await createPublishableStory();
    const response = await uploadRoute(
      uploadRequest(story.id, cookie, pngFile()),
      { params: Promise.resolve({ storyId: story.id }) },
    );

    expect(response.status).toBe(500);
    expect(await db.mediaAsset.count({ where: { readiness: "READY" } })).toBe(0);
  });

  it("requires owner auth, stores validated bytes privately, and denies public delivery without a published reference", async () => {
    const cookie = await ownerCookie();
    const story = await createPublishableStory();

    const upload = await uploadRoute(
      uploadRequest(story.id, cookie, pngFile("../capture.png")),
      { params: Promise.resolve({ storyId: story.id }) },
    );

    expect(upload.status).toBe(201);
    const payload = (await upload.json()) as { id: string };
    const asset = await db.mediaAsset.findUniqueOrThrow({
      where: { id: payload.id },
    });

    expect(asset).toMatchObject({
      storyId: story.id,
      readiness: "READY",
      mediaType: "IMAGE",
      contentType: "image/png",
      width: 2,
      height: 2,
      uploadGeneration: 1,
      originalFileName: "capture.png",
      leaseExpiresAt: null,
      failureCode: null,
    });
    expect(asset.storageKey).not.toContain("capture");

    const privateResponse = await privateMediaRoute(
      new Request(
        APP_ORIGIN +
          "/api/studio/work/" +
          story.id +
          "/media/" +
          asset.id,
        { headers: { cookie } },
      ),
      {
        params: Promise.resolve({
          storyId: story.id,
          assetId: asset.id,
        }),
      },
    );

    expect(privateResponse.status).toBe(200);
    expect(privateResponse.headers.get("cache-control")).toBe(
      "private, no-store",
    );
    expect(Buffer.from(await privateResponse.arrayBuffer())).toEqual(PNG_BYTES);

    const unauthenticated = await privateMediaRoute(
      new Request(
        APP_ORIGIN +
          "/api/studio/work/" +
          story.id +
          "/media/" +
          asset.id,
      ),
      {
        params: Promise.resolve({
          storyId: story.id,
          assetId: asset.id,
        }),
      },
    );
    expect(unauthenticated.status).toBe(401);

    const publicResponse = await publicMediaRoute(
      new Request(APP_ORIGIN + "/api/work/media/" + asset.id),
      { params: Promise.resolve({ assetId: asset.id }) },
    );
    expect(publicResponse.status).toBe(404);
    expect(publicResponse.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects cross-origin and oversized uploads before accepting media bytes", async () => {
    const cookie = await ownerCookie();
    const story = await createPublishableStory();
    const explosiveBody = new ReadableStream<Uint8Array>({
      pull() {
        throw new Error("request body must not be read");
      },
    });

    const crossOrigin = new Request(
      APP_ORIGIN + "/api/studio/work/" + story.id + "/media",
      {
        method: "POST",
        headers: {
          cookie,
          origin: "https://attacker.example",
          "content-type": "multipart/form-data; boundary=x",
        },
        body: explosiveBody,
        duplex: "half",
      } as RequestInit & { duplex: "half" },
    );

    const forbidden = await uploadRoute(crossOrigin, {
      params: Promise.resolve({ storyId: story.id }),
    });
    expect(forbidden.status).toBe(403);
    await expect(db.mediaAsset.count()).resolves.toBe(0);

    const oversized = new Request(
      APP_ORIGIN + "/api/studio/work/" + story.id + "/media",
      {
        method: "POST",
        headers: {
          cookie,
          origin: APP_ORIGIN,
          "content-type": "multipart/form-data; boundary=x",
          "content-length": String(MEDIA_REQUEST_LIMIT + 1),
        },
        body: "--x--",
      },
    );
    const tooLarge = await uploadRoute(oversized, {
      params: Promise.resolve({ storyId: story.id }),
    });
    expect(tooLarge.status).toBe(413);
    await expect(db.mediaAsset.count()).resolves.toBe(0);
  });

  it("keeps header-only JPEG/WebP uploads FAILED and never publicly deliverable", async () => {
    const cookie = await ownerCookie();
    const story = await createPublishableStory();
    const jpeg = Buffer.from([
      0xff, 0xd8, // SOI
      0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 0x01,
      0x01, 0x01, 0x11, 0x00, // 1x1 SOF
      0xff, 0xda, 0x00, 0x02, 0x11, 0xff, 0xd9, // bogus scan + EOI
    ]);
    const webp = Buffer.alloc(30);
    webp.write("RIFF", 0);
    webp.writeUInt32LE(22, 4);
    webp.write("WEBP", 8);
    webp.write("VP8 ", 12);
    webp.writeUInt32LE(10, 16);
    Buffer.from([0x10, 0, 0, 0x9d, 0x01, 0x2a, 1, 0, 1, 0])
      .copy(webp, 20);

    for (const [name, type, bytes] of [
      ["fake.jpg", "image/jpeg", jpeg],
      ["fake.webp", "image/webp", webp],
    ] as const) {
      const response = await uploadRoute(
        uploadRequest(
          story.id,
          cookie,
          new File([Uint8Array.from(bytes)], name, { type }),
        ),
        { params: Promise.resolve({ storyId: story.id }) },
      );
      expect(response.status).toBe(400);
    }

    expect(await db.mediaAsset.count({
      where: { storyId: story.id, readiness: "READY" },
    })).toBe(0);
    const failures = await db.mediaAsset.findMany({
      where: { storyId: story.id },
    });
    expect(failures).toHaveLength(2);
    for (const failure of failures) {
      expect(failure).toMatchObject({
        readiness: "FAILED",
        failureCode: "VALIDATION_REJECTED",
      });
      await expect(
        access(mediaStoragePath("assets", failure.storageKey)),
      ).rejects.toThrow();
      const publicResponse = await publicMediaRoute(
        new Request(APP_ORIGIN + "/api/work/media/" + failure.id),
        { params: Promise.resolve({ assetId: failure.id }) },
      );
      expect(publicResponse.status).toBe(404);
    }
  });

  it("never promotes CRC-correct malformed indexed PNG and cleans FAILED bytes", async () => {
    const cookie = await ownerCookie();
    const story = await createPublishableStory();
    const invalid = await uploadRoute(
      uploadRequest(
        story.id,
        cookie,
        new File([Uint8Array.from(indexedPngFixture(false))], "missing-palette.png", {
          type: "image/png",
        }),
      ),
      { params: Promise.resolve({ storyId: story.id }) },
    );
    expect(invalid.status).toBe(400);

    const failed = await db.mediaAsset.findFirstOrThrow({
      where: { storyId: story.id },
    });
    expect(failed).toMatchObject({
      readiness: "FAILED",
      failureCode: "VALIDATION_REJECTED",
      leaseExpiresAt: null,
    });
    await expect(access(mediaStoragePath(".staging", failed.storageKey))).rejects.toThrow();
    await expect(access(mediaStoragePath("assets", failed.storageKey))).rejects.toThrow();

    const unavailable = await publicMediaRoute(
      new Request(APP_ORIGIN + "/api/work/media/" + failed.id),
      { params: Promise.resolve({ assetId: failed.id }) },
    );
    expect(unavailable.status).toBe(404);

    const valid = await uploadRoute(
      uploadRequest(
        story.id,
        cookie,
        new File([Uint8Array.from(indexedPngFixture(true))], "valid-indexed.png", {
          type: "image/png",
        }),
      ),
      { params: Promise.resolve({ storyId: story.id }) },
    );
    expect(valid.status).toBe(201);
    const payload = (await valid.json()) as { id: string };
    const ready = await db.mediaAsset.findUniqueOrThrow({ where: { id: payload.id } });
    expect(ready).toMatchObject({ readiness: "READY", width: 1, height: 1 });
  });

  it("rejects non-cue WebVTT uploads before READY, while retaining valid cues", async () => {
    const cookie = await ownerCookie();
    const story = await createPublishableStory();

    const recording = await db.mediaAsset.create({
      data: {
        storyId: story.id,
        storageKey: randomUUID(),
        originalFileName: "recording.mp4",
        mediaType: "VIDEO",
        contentType: "video/mp4",
        byteSize: 10,
        width: 16,
        height: 16,
        durationMs: 200,
        readiness: "READY",
      },
    });
    const evidence = await db.evidence.create({
      data: {
        storyId: story.id,
        kind: "RECORDING",
        position: 0,
        sourceAssetId: recording.id,
      },
    });

    async function uploadCaption(text: string): Promise<Response> {
      const form = new FormData();
      form.set("file", new File([text], "captions.vtt", { type: "text/vtt" }));
      form.set("recordingEvidenceId", evidence.id);
      return uploadRoute(
        new Request(APP_ORIGIN + "/api/studio/work/" + story.id + "/media", {
          method: "POST",
          headers: { cookie, origin: APP_ORIGIN },
          body: form,
        }),
        { params: Promise.resolve({ storyId: story.id }) },
      );
    }

    for (const text of [
      "WEBVTT\n\nNOTE arbitrary text\n",
      "WEBVTT\n\nthis is not a cue\n",
      "WEBVTT\n\n00:00.000 --> 00:00.150\nValid\n\nSTYLE\n::cue { color: red; }\n",
    ]) {
      const response = await uploadCaption(text);
      expect(response.status).toBe(400);
    }

    const rejected = await db.mediaAsset.findMany({
      where: { storyId: story.id, mediaType: "VTT" },
    });
    expect(rejected).toHaveLength(3);
    for (const asset of rejected) {
      expect(asset).toMatchObject({
        readiness: "FAILED",
        failureCode: "VALIDATION_REJECTED",
        leaseExpiresAt: null,
      });
      await expect(access(mediaStoragePath("assets", asset.storageKey))).rejects.toThrow();
      const publicRead = await publicMediaRoute(
        new Request(APP_ORIGIN + "/api/work/media/" + asset.id),
        { params: Promise.resolve({ assetId: asset.id }) },
      );
      expect(publicRead.status).toBe(404);
    }

    const success = await uploadCaption(
      "WEBVTT\n\n00:00.000 --> 00:00.150 align:start\nVisible result\n",
    );
    expect(success.status).toBe(201);
    const payload = (await success.json()) as { id: string };
    expect(await db.mediaAsset.findUniqueOrThrow({ where: { id: payload.id } }))
      .toMatchObject({ mediaType: "VTT", readiness: "READY" });
  });

  it("fails invalid content immediately and retries with a fresh generation/key", async () => {
    const cookie = await ownerCookie();
    const story = await createPublishableStory();
    const invalid = new File([Buffer.from("not a png")], "capture.png", {
      type: "image/png",
    });

    const rejected = await uploadRoute(
      uploadRequest(story.id, cookie, invalid),
      { params: Promise.resolve({ storyId: story.id }) },
    );

    expect(rejected.status).toBe(400);
    const failed = await db.mediaAsset.findFirstOrThrow({
      where: { storyId: story.id },
    });

    expect(failed).toMatchObject({
      readiness: "FAILED",
      failureCode: "VALIDATION_REJECTED",
      uploadGeneration: 1,
      leaseExpiresAt: null,
    });
    await expect(
      access(mediaStoragePath(".staging", failed.storageKey)),
    ).rejects.toThrow();
    await expect(
      access(mediaStoragePath("assets", failed.storageKey)),
    ).rejects.toThrow();

    const form = new FormData();
    form.set("file", pngFile("retry.png"));

    const retried = await retryRoute(
      new Request(
        APP_ORIGIN +
          "/api/studio/work/" +
          story.id +
          "/media/" +
          failed.id +
          "/retry",
        {
          method: "POST",
          headers: { cookie, origin: APP_ORIGIN },
          body: form,
        },
      ),
      {
        params: Promise.resolve({
          storyId: story.id,
          assetId: failed.id,
        }),
      },
    );

    expect(retried.status).toBe(200);
    const ready = await db.mediaAsset.findUniqueOrThrow({
      where: { id: failed.id },
    });
    expect(ready).toMatchObject({
      readiness: "READY",
      failureCode: null,
      uploadGeneration: 2,
      leaseExpiresAt: null,
    });
    expect(ready.storageKey).not.toBe(failed.storageKey);
    await expect(
      access(mediaStoragePath("assets", ready.storageKey)),
    ).resolves.toBeUndefined();

    await reconcileMediaStorage();
    await expect(
      access(mediaStoragePath("assets", ready.storageKey)),
    ).resolves.toBeUndefined();
  });

  it("uses CAS so failure/completion/reconciliation/retry have one generation winner", async () => {
    const story = await createPublishableStory();
    const generation = await createPendingMediaAsset({
      storyId: story.id,
      originalFileName: "race.png",
      mediaType: "IMAGE",
      contentType: "image/png",
      byteSize: PNG_BYTES.length,
    });
    await writeStagedMedia(generation.storageKey, PNG_BYTES);
    await promoteStagedMedia(generation.storageKey);

    const [failure, completion] = await Promise.all([
      failMediaUpload(generation, "WRITE_FAILED"),
      completeMediaUpload(generation, {
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
        width: 2,
        height: 2,
        durationMs: null,
      }),
    ]);

    expect(Number(failure) + Number(completion)).toBe(1);
    const raced = await db.mediaAsset.findUniqueOrThrow({
      where: { id: generation.assetId },
    });
    expect(["FAILED", "READY"]).toContain(raced.readiness);

    if (raced.readiness === "FAILED") {
      await reconcileMediaStorage();
    } else {
      await expect(
        access(mediaStoragePath("assets", raced.storageKey)),
      ).resolves.toBeUndefined();
    }

    const duplicate = await createPendingMediaAsset({
      storyId: story.id,
      originalFileName: "duplicate.png",
      mediaType: "IMAGE",
      contentType: "image/png",
      byteSize: PNG_BYTES.length,
    });
    await writeStagedMedia(duplicate.storageKey, PNG_BYTES);
    await promoteStagedMedia(duplicate.storageKey);

    const duplicateResults = await Promise.all([
      completeMediaUpload(duplicate, {
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
        width: 2,
        height: 2,
        durationMs: null,
      }),
      completeMediaUpload(duplicate, {
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
        width: 2,
        height: 2,
        durationMs: null,
      }),
    ]);

    expect(duplicateResults.filter(Boolean)).toHaveLength(1);
    await reconcileMediaStorage();
    const duplicateRow = await db.mediaAsset.findUniqueOrThrow({
      where: { id: duplicate.assetId },
    });
    expect(duplicateRow.readiness).toBe("READY");
    await expect(
      access(mediaStoragePath("assets", duplicate.storageKey)),
    ).resolves.toBeUndefined();

    const failedGeneration = await createPendingMediaAsset({
      storyId: story.id,
      originalFileName: "retry.png",
      mediaType: "IMAGE",
      contentType: "image/png",
      byteSize: PNG_BYTES.length,
    });
    expect(
      await failMediaUpload(failedGeneration, "WRITE_FAILED"),
    ).toBe(true);

    const retries = await Promise.all([
      retryFailedMediaAsset({
        assetId: failedGeneration.assetId,
        storyId: story.id,
        expectedGeneration: 1,
        expectedStorageKey: failedGeneration.storageKey,
        originalFileName: "retry-a.png",
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
      }),
      retryFailedMediaAsset({
        assetId: failedGeneration.assetId,
        storyId: story.id,
        expectedGeneration: 1,
        expectedStorageKey: failedGeneration.storageKey,
        originalFileName: "retry-b.png",
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
      }),
    ]);
    const winners = retries.filter((attempt) => attempt !== null);
    expect(winners).toHaveLength(1);

    const retryGeneration = winners[0];
    if (!retryGeneration) throw new Error("Expected retry winner");

    await expect(
      completeMediaUpload(failedGeneration, {
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
        width: 2,
        height: 2,
        durationMs: null,
      }),
    ).resolves.toBe(false);

    const current = await db.mediaAsset.findUniqueOrThrow({
      where: { id: failedGeneration.assetId },
    });
    expect(current.uploadGeneration).toBe(retryGeneration.generation);
    expect(current.storageKey).toBe(retryGeneration.storageKey);

    const expired = await createPendingMediaAsset({
      storyId: story.id,
      originalFileName: "expired.png",
      mediaType: "IMAGE",
      contentType: "image/png",
      byteSize: PNG_BYTES.length,
    });
    const expiredLease = new Date(Date.now() - 1_000);
    await db.mediaAsset.update({
      where: { id: expired.assetId },
      data: { leaseExpiresAt: expiredLease },
    });

    const expiredCompletion = await completeMediaUpload(
      { ...expired, leaseExpiresAt: expiredLease },
      {
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
        width: 2,
        height: 2,
        durationMs: null,
      },
    );
    expect(expiredCompletion).toBe(false);

    const reconciliation = await reconcileMediaStorage();
    expect(reconciliation.expiredUploads).toBeGreaterThanOrEqual(1);
    const expiredRow = await db.mediaAsset.findUniqueOrThrow({
      where: { id: expired.assetId },
    });
    expect(expiredRow).toMatchObject({
      readiness: "FAILED",
      failureCode: "UPLOAD_INTERRUPTED",
      leaseExpiresAt: null,
    });
  });

  it("authorizes public delivery only through PublishedEvidence and supports one video range", async () => {
    const story = await createPublishableStory();
    await publishStory({
      storyId: story.id,
      expectedWorkingRevision: 1,
      expectedPublishedRevision: null,
    });

    const imageKey = randomUUID();
    await writeStagedMedia(imageKey, PNG_BYTES);
    await promoteStagedMedia(imageKey);
    const imageAsset = await db.mediaAsset.create({
      data: {
        storyId: story.id,
        storageKey: imageKey,
        originalFileName: "published.png",
        mediaType: "IMAGE",
        contentType: "image/png",
        byteSize: PNG_BYTES.length,
        width: 2,
        height: 2,
        readiness: "READY",
      },
    });
    const imageEvidence = await db.evidence.create({
      data: {
        storyId: story.id,
        kind: "IMAGE",
        position: 0,
        sourceAssetId: imageAsset.id,
      },
    });
    await db.publishedEvidence.create({
      data: {
        id: imageEvidence.id,
        storyId: story.id,
        kind: "IMAGE",
        position: 0,
        sourceAssetId: imageAsset.id,
      },
    });

    const publishedImage = await publicMediaRoute(
      new Request(APP_ORIGIN + "/api/work/media/" + imageAsset.id),
      { params: Promise.resolve({ assetId: imageAsset.id }) },
    );
    expect(publishedImage.status).toBe(200);
    expect(publishedImage.headers.get("cache-control")).toBe(
      "public, max-age=0, must-revalidate",
    );
    expect(publishedImage.headers.get("x-content-type-options")).toBe(
      "nosniff",
    );

    const videoBytes = Buffer.from("0123456789");
    const videoKey = randomUUID();
    await writeStagedMedia(videoKey, videoBytes);
    await promoteStagedMedia(videoKey);
    const videoAsset = await db.mediaAsset.create({
      data: {
        storyId: story.id,
        storageKey: videoKey,
        originalFileName: "range.mp4",
        mediaType: "VIDEO",
        contentType: "video/mp4",
        byteSize: videoBytes.length,
        width: 16,
        height: 16,
        durationMs: 1_000,
        readiness: "READY",
      },
    });
    const videoEvidence = await db.evidence.create({
      data: {
        storyId: story.id,
        kind: "RECORDING",
        position: 1,
        sourceAssetId: videoAsset.id,
      },
    });
    await db.publishedEvidence.create({
      data: {
        id: videoEvidence.id,
        storyId: story.id,
        kind: "RECORDING",
        position: 1,
        sourceAssetId: videoAsset.id,
      },
    });

    const ranged = await publicMediaRoute(
      new Request(APP_ORIGIN + "/api/work/media/" + videoAsset.id, {
        headers: { range: "bytes=2-5" },
      }),
      { params: Promise.resolve({ assetId: videoAsset.id }) },
    );
    expect(ranged.status).toBe(206);
    expect(ranged.headers.get("content-range")).toBe("bytes 2-5/10");
    expect(Buffer.from(await ranged.arrayBuffer()).toString()).toBe("2345");

    const invalidRange = await publicMediaRoute(
      new Request(APP_ORIGIN + "/api/work/media/" + videoAsset.id, {
        headers: { range: "bytes=0-1,4-5" },
      }),
      { params: Promise.resolve({ assetId: videoAsset.id }) },
    );
    expect(invalidRange.status).toBe(416);
    expect(invalidRange.headers.get("content-range")).toBe("bytes */10");
  });

  it("refuses to remove referenced assets and removes unreferenced bytes", async () => {
    const cookie = await ownerCookie();
    const story = await createPublishableStory();
    const upload = await uploadRoute(
      uploadRequest(story.id, cookie, pngFile()),
      { params: Promise.resolve({ storyId: story.id }) },
    );
    const payload = (await upload.json()) as { id: string };
    const asset = await db.mediaAsset.findUniqueOrThrow({
      where: { id: payload.id },
    });
    const evidence = await db.evidence.create({
      data: {
        storyId: story.id,
        kind: "IMAGE",
        position: 0,
        sourceAssetId: asset.id,
      },
    });

    const deleteRequest = () =>
      new Request(
        APP_ORIGIN +
          "/api/studio/work/" +
          story.id +
          "/media/" +
          asset.id,
        {
          method: "DELETE",
          headers: { cookie, origin: APP_ORIGIN },
        },
      );

    const referenced = await deleteMediaRoute(deleteRequest(), {
      params: Promise.resolve({
        storyId: story.id,
        assetId: asset.id,
      }),
    });
    expect(referenced.status).toBe(409);

    await db.evidence.delete({ where: { id: evidence.id } });

    const removed = await deleteMediaRoute(deleteRequest(), {
      params: Promise.resolve({
        storyId: story.id,
        assetId: asset.id,
      }),
    });
    expect(removed.status).toBe(204);
    await expect(
      db.mediaAsset.findUnique({ where: { id: asset.id } }),
    ).resolves.toBeNull();
    await expect(
      access(mediaStoragePath("assets", asset.storageKey)),
    ).rejects.toThrow();
  });
});
