import "server-only";

import { z } from "zod";

import { db } from "../db";
import { logEvent } from "../logging/logger";
import { createOwnerAuth } from "./instance";

const provisionOwnerInputSchema = z.object({
  email: z.string().email().transform((value) => value.trim().toLowerCase()),
  name: z.string().trim().min(1),
  password: z.string().min(12),
});

const OWNER_PROVISIONING_LOCK_ID = 7_291_709;

export type ProvisionOwnerInput = z.input<typeof provisionOwnerInputSchema>;

export class OwnerAlreadyProvisionedError extends Error {
  constructor() {
    super("Owner has already been provisioned");
    this.name = "OwnerAlreadyProvisionedError";
  }
}

export type ProvisionedOwner = {
  id: string;
  email: string;
  name: string;
};

export async function provisionOwner(
  input: ProvisionOwnerInput,
): Promise<ProvisionedOwner> {
  const parsed = provisionOwnerInputSchema.parse(input);
  const provisioningAuth = createOwnerAuth({
    allowProvisioningSignUp: true,
  });

  return db.$transaction(async (transaction) => {
    await transaction.$queryRaw`
      SELECT pg_advisory_xact_lock(${OWNER_PROVISIONING_LOCK_ID})
    `;

    const existingUsers = await transaction.user.count();

    if (existingUsers !== 0) {
      throw new OwnerAlreadyProvisionedError();
    }

    const result = await provisioningAuth.api.signUpEmail({
      body: {
        email: parsed.email,
        name: parsed.name,
        password: parsed.password,
      },
    });

    const owner = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
    };

    logEvent("info", "auth.owner.provisioned", {
      ownerId: owner.id,
    });

    return owner;
  });
}
