import "server-only";

import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
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
        if (
          context.path === "/sign-in/email" &&
          context.context.newSession
        ) {
          logEvent("info", "auth.sign_in.success");
        }

        if (context.path === "/change-password") {
          logEvent("info", "auth.password.changed");
        }
      }),
    },
    onAPIError: {
      onError(_error, context) {
        if (context.path === "/sign-in/email") {
          logEvent("warn", "auth.sign_in.failure");
        }
      },
    },
  });
}

export const auth = createOwnerAuth();
