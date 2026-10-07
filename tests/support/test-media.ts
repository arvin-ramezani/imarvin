import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { getServerConfig } from "../../lib/config/server";

export function assertTestMediaRoot(): string {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Refusing destructive media cleanup outside NODE_ENV=test.",
    );
  }

  const root = path.resolve(getServerConfig().MEDIA_STORAGE_ROOT);
  const parsedRoot = path.parse(root).root;

  if (root === parsedRoot || !root.toLowerCase().includes("test")) {
    throw new Error(
      "Refusing destructive media cleanup without an isolated test media root.",
    );
  }

  return root;
}

export async function resetTestMediaStorage(): Promise<string> {
  const root = assertTestMediaRoot();

  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });

  return root;
}
