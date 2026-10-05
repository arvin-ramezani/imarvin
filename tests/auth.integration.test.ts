import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  changeOwnerPassword,
  getOwnerSession,
  OwnerAlreadyProvisionedError,
  OwnerAuthorizationError,
  provisionOwner,
  requireOwnerSession,
} from "../lib/auth";
import { auth } from "../lib/auth/instance";
import { db } from "../lib/db";

const APP_ORIGIN = "http://localhost:3000";
const OWNER_EMAIL = "owner@example.com";
const OWNER_PASSWORD = "initial-owner-password";
const NEW_OWNER_PASSWORD = "changed-owner-password";

async function authRequest(
  path: string,
  body: Record<string, unknown>,
  options: {
    cookie?: string;
    ip?: string;
  } = {},
): Promise<Response> {
  const headers = new Headers({
    "content-type": "application/json",
    origin: APP_ORIGIN,
    "x-forwarded-for": options.ip ?? "198.51.100.10",
  });

  if (options.cookie) {
    headers.set("cookie", options.cookie);
  }

  return auth.handler(
    new Request(`${APP_ORIGIN}/api/auth${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
  );
}

function sessionCookie(response: Response): string {
  const value = response.headers.get("set-cookie");

  if (!value) {
    throw new Error("Expected Better Auth to set a session cookie");
  }

  return value.split(";")[0] ?? "";
}

describe("owner authentication foundation", () => {
  beforeAll(async () => {
    await db.session.deleteMany();
    await db.account.deleteMany();
    await db.verification.deleteMany();
    await db.rateLimit.deleteMany();
    await db.user.deleteMany();
  });

  it("provisions exactly one owner through the server-only path", async () => {
    const owner = await provisionOwner({
      email: OWNER_EMAIL,
      name: "Owner",
      password: OWNER_PASSWORD,
    });

    expect(owner.email).toBe(OWNER_EMAIL);
    await expect(db.user.count()).resolves.toBe(1);

    const credential = await db.account.findFirst({
      where: {
        userId: owner.id,
        providerId: "credential",
      },
    });

    expect(credential?.password).toBeTruthy();
    expect(credential?.password).not.toBe(OWNER_PASSWORD);

    await expect(
      provisionOwner({
        email: "second@example.com",
        name: "Second",
        password: "second-owner-password",
      }),
    ).rejects.toBeInstanceOf(OwnerAlreadyProvisionedError);
  });

  it("keeps public registration and password reset unavailable", async () => {
    const signUp = await authRequest(
      "/sign-up/email",
      {
        email: "public@example.com",
        name: "Public",
        password: "public-registration-password",
      },
      { ip: "198.51.100.11" },
    );

    expect(signUp.status).toBe(404);
    await expect(db.user.count()).resolves.toBe(1);

    const passwordReset = await authRequest(
      "/request-password-reset",
      {
        email: OWNER_EMAIL,
        redirectTo: `${APP_ORIGIN}/reset-password`,
      },
      { ip: "198.51.100.12" },
    );

    expect(passwordReset.status).toBe(404);
    await expect(db.verification.count()).resolves.toBe(0);
  });

  it("rejects unauthenticated owner authorization", async () => {
    await expect(
      requireOwnerSession(new Headers()),
    ).rejects.toBeInstanceOf(OwnerAuthorizationError);
    await expect(getOwnerSession(new Headers())).resolves.toBeNull();
  });

  it("signs in only the provisioned owner and persists the session", async () => {
    const unknown = await authRequest(
      "/sign-in/email",
      {
        email: "unknown@example.com",
        password: OWNER_PASSWORD,
      },
      { ip: "198.51.100.13" },
    );

    expect(unknown.status).toBe(401);

    const signIn = await authRequest(
      "/sign-in/email",
      {
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
      },
      { ip: "198.51.100.14" },
    );

    expect(signIn.status).toBe(200);
    const cookie = sessionCookie(signIn);
    const headers = new Headers({ cookie });

    const ownerSession = await requireOwnerSession(headers);

    expect(ownerSession.user.email).toBe(OWNER_EMAIL);
    expect(await getOwnerSession(headers)).not.toBeNull();
    expect(await db.session.count()).toBeGreaterThan(0);
  });

  it("changes the password and revokes other sessions", async () => {
    const firstSignIn = await authRequest(
      "/sign-in/email",
      {
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
      },
      { ip: "198.51.100.15" },
    );
    const firstCookie = sessionCookie(firstSignIn);

    const secondSignIn = await authRequest(
      "/sign-in/email",
      {
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
      },
      { ip: "198.51.100.16" },
    );
    const secondCookie = sessionCookie(secondSignIn);

    const passwordChangeHeaders = await changeOwnerPassword({
      requestHeaders: new Headers({ cookie: firstCookie }),
      currentPassword: OWNER_PASSWORD,
      newPassword: NEW_OWNER_PASSWORD,
    });
    const replacementCookie = sessionCookie(
      new Response(null, { headers: passwordChangeHeaders }),
    );

    await expect(
      getOwnerSession(new Headers({ cookie: firstCookie })),
    ).resolves.toBeNull();
    await expect(
      getOwnerSession(new Headers({ cookie: secondCookie })),
    ).resolves.toBeNull();
    await expect(
      getOwnerSession(new Headers({ cookie: replacementCookie })),
    ).resolves.not.toBeNull();

    const oldPassword = await authRequest(
      "/sign-in/email",
      {
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
      },
      { ip: "198.51.100.17" },
    );

    expect(oldPassword.status).toBe(401);

    const newPassword = await authRequest(
      "/sign-in/email",
      {
        email: OWNER_EMAIL,
        password: NEW_OWNER_PASSWORD,
      },
      { ip: "198.51.100.18" },
    );

    expect(newPassword.status).toBe(200);
  });

  it("stores client rate-limit state in PostgreSQL", async () => {
    await authRequest(
      "/sign-in/email",
      {
        email: OWNER_EMAIL,
        password: "wrong-owner-password",
      },
      { ip: "198.51.100.19" },
    );

    expect(await db.rateLimit.count()).toBeGreaterThan(0);
  });
});
