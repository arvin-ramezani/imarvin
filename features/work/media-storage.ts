import "server-only";

import {
  access,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { getServerConfig } from "@/lib/config/server";

const STORAGE_KEY_PATTERN = /^[a-zA-Z0-9_-]{16,128}$/;

export type MediaStorageFile = {
  key: string;
  area: "assets" | ".staging";
  modifiedAt: Date;
};

export function mediaStorageRoot(): string {
  return path.resolve(getServerConfig().MEDIA_STORAGE_ROOT);
}

export function mediaStoragePath(
  area: "assets" | ".staging",
  key: string,
): string {
  if (!STORAGE_KEY_PATTERN.test(key)) {
    throw new Error("Invalid media storage key");
  }

  const root = mediaStorageRoot();
  const candidate = path.resolve(root, area, key);
  const relative = path.relative(root, candidate);

  if (
    !relative ||
    relative.startsWith(".." + path.sep) ||
    relative === ".." ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Media path escaped the configured storage root");
  }

  return candidate;
}

async function ensureStorageDirectories(): Promise<void> {
  const root = mediaStorageRoot();

  await Promise.all([
    mkdir(path.join(root, "assets"), { recursive: true }),
    mkdir(path.join(root, ".staging"), { recursive: true }),
  ]);
}

export async function writeStagedMedia(
  key: string,
  bytes: Uint8Array,
): Promise<void> {
  await ensureStorageDirectories();
  await writeFile(mediaStoragePath(".staging", key), bytes, { flag: "wx" });
}

export async function promoteStagedMedia(key: string): Promise<void> {
  const stagingPath = mediaStoragePath(".staging", key);
  const finalPath = mediaStoragePath("assets", key);

  try {
    await access(finalPath);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      await rename(stagingPath, finalPath);
      return;
    }

    throw error;
  }

  throw new Error("Media final path already exists");
}

export async function removeMediaGenerationBytes(key: string): Promise<void> {
  await Promise.all([
    rm(mediaStoragePath(".staging", key), { force: true }),
    rm(mediaStoragePath("assets", key), { force: true }),
  ]);
}

export async function readMediaBytes(key: string): Promise<Buffer | null> {
  try {
    return await readFile(mediaStoragePath("assets", key));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function listMediaStorageFiles(): Promise<MediaStorageFile[]> {
  await ensureStorageDirectories();
  const result: MediaStorageFile[] = [];

  for (const area of ["assets", ".staging"] as const) {
    const directory = path.join(
      /* turbopackIgnore: true */ mediaStorageRoot(),
      area,
    );
    const entries = await readdir(
      /* turbopackIgnore: true */ directory,
      { withFileTypes: true },
    );

    for (const entry of entries) {
      if (!entry.isFile() || !STORAGE_KEY_PATTERN.test(entry.name)) {
        continue;
      }

      const details = await stat(
        /* turbopackIgnore: true */ path.join(directory, entry.name),
      );

      result.push({
        key: entry.name,
        area,
        modifiedAt: details.mtime,
      });
    }
  }

  return result;
}
