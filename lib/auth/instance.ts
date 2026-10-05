import "server-only";

import { betterAuth } from "better-auth";
import { createAuthMiddleware, isAPIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { getServerConfig, type LogLevel } from "../config/server";
import { db } from "../db";
import { logEvent } from "../logging/logger";
import { ownerAuthCoreOptions } from "./options";

type CreateOwnerAuthOptions = {
  allowProvisioningSignUp?: boolean;
};

function toSharedLogLevel(level: string): LogLevel {
  switch (level) {
    case "error":
      return "error";
    case "warn":
      return "warn";
    case "debug":
      return "debug";
    default:
      return "info";
  }
}

export function createOwnerAuth({
  allowProvisioningSignUp = false,
}: CreateOwnerAuthOptions = {}) {
  const { APP_ORIGIN, AUTH_SECRET } = getServerConfig();

  return betterAuth({
    ...ownerAuthCoreOptions({
      allowProvisioningSignUp,
      baseURL: APP_ORIGIN,
      database: prismaAdapter(db, {
        provider: "postgresql",
      }),
      secret: AUTH_SECRET,
    }),
    logger: {
      level: "warn",
      log(level) {
        logEvent(toSharedLogLevel(level), "auth.library");
      },
    },
    hooks: {
      after: createAuthMiddleware(async (context) => {
        if (context.path === "/sign-in/email") {
          if (context.context.newSession) {
            logEvent("info", "auth.sign_in.success");
          } else {
            logEvent("warn", "auth.sign_in.failure");
          }
        }

        if (
          context.path === "/change-password" &&
          !isAPIError(context.context.returned)
        ) {
          logEvent("info", "auth.password.changed");
        }
      }),
    },
  });
}

export const auth = createOwnerAuth();
