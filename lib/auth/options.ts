type OwnerAuthCoreOptionsInput<TDatabase> = {
  allowProvisioningSignUp?: boolean;
  baseURL: string;
  database: TDatabase;
  secret: string;
};

export function ownerAuthCoreOptions<TDatabase>({
  allowProvisioningSignUp = false,
  baseURL,
  database,
  secret,
}: OwnerAuthCoreOptionsInput<TDatabase>) {
  return {
    appName: "imarvin",
    secret,
    baseURL,
    trustedOrigins: [baseURL],
    database,
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowProvisioningSignUp,
      minPasswordLength: 12,
      autoSignIn: false,
    },
    disabledPaths: allowProvisioningSignUp
      ? ["/request-password-reset", "/reset-password"]
      : [
          "/sign-up/email",
          "/request-password-reset",
          "/reset-password",
        ],
    rateLimit: {
      enabled: true,
      storage: "database" as const,
    },
    advanced: {
      useSecureCookies: new URL(baseURL).protocol === "https:",
    },
  };
}
