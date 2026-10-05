import "server-only";

import { auth } from "./instance";

export class OwnerAuthorizationError extends Error {
  constructor() {
    super("Owner authentication required");
    this.name = "OwnerAuthorizationError";
  }
}

export type OwnerSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function getOwnerSession(
  requestHeaders: Headers,
): Promise<OwnerSession | null> {
  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export async function requireOwnerSession(
  requestHeaders: Headers,
): Promise<OwnerSession> {
  const session = await getOwnerSession(requestHeaders);

  if (!session) {
    throw new OwnerAuthorizationError();
  }

  return session;
}

type ChangeOwnerPasswordInput = {
  requestHeaders: Headers;
  currentPassword: string;
  newPassword: string;
};

export async function changeOwnerPassword({
  requestHeaders,
  currentPassword,
  newPassword,
}: ChangeOwnerPasswordInput): Promise<void> {
  await requireOwnerSession(requestHeaders);

  await auth.api.changePassword({
    headers: requestHeaders,
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
  });
}
