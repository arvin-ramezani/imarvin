import { plugin as shadcn } from "@shadcn/lint";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const applicationFiles = ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { shadcn },
    rules: {
      "shadcn/no-restyle": ["error", { allow: ["layout"] }],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": ["error", { allow: ["layout"] }],
      "shadcn/no-inline-styles": "error",
      "shadcn/require-static-classes": "error",
      "shadcn/no-unknown-classes": "error",
    },
  },
  {
    files: ["components/ui/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/require-static-classes": "off",
    },
  },
  {
    files: applicationFiles,
    rules: {
      "no-console": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Read application configuration through @/lib/config/server.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["pino", "pino/*"],
              message: "Use the shared logger from @/lib/logging/logger.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "lib/config/server.ts",
      "scripts/load-test-env.mjs",
      "scripts/prepare-test-db.mjs",
      "tests/support/test-database.ts",
    ],
    rules: {
      "no-restricted-properties": "off",
    },
  },
  {
    files: ["lib/logging/logger.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
