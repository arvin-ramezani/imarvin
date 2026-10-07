import "server-only";

import {
  access,
  lstat,
  open,
  mkdir,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { constants } from "node:fs";
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

async function assertPrivateDirectory(directory: string): Promise<void> {
  const info = await lstat(directory);

  if (
    !info.isDirectory() ||
    info.isSymbolicLink() ||
    (info.mode & 0o077) !== 0 ||
    (typeof process.getuid === "function" && info.uid !== process.getuid())
  ) {
    throw new Error("Media directory must be private and owned by the app user");
  }
}

async function ensureStorageDirectories(): Promise<void> {
  const root = mediaStorageRoot();

  await mkdir(root, { recursive: true, mode: 0o700 });
  await assertPrivateDirectory(root);

  for (const area of ["assets", ".staging"] as const) {
    const directory = path.join(root, area);
    await mkdir(directory, { recursive: true, mode: 0o700 });
    await assertPrivateDirectory(directory);
  }
}

export async function writeStagedMedia(
  key: string,
  bytes: Uint8Array,
): Promise<void> {
  await ensureStorageDirectories();
  await writeFile(mediaStoragePath(".staging", key), bytes, {
    flag: "wx",
    mode: 0o600,
  });
}

export async function promoteStagedMedia(key: string): Promise<void> {
  await ensureStorageDirectories();
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
  await ensureStorageDirectories();

  try {
    const file = await open(
      mediaStoragePath("assets", key),
      constants.O_RDONLY | constants.O_NOFOLLOW,
    );

    try {
      const info = await file.stat();

      if (
        !info.isFile() ||
        (info.mode & 0o077) !== 0 ||
        (typeof process.getuid === "function" && info.uid !== process.getuid())
      ) {
        throw new Error("Unsafe media file permissions");
      }

      return await file.readFile();
    } finally {
      await file.close();
    }
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
