import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

async function lintRuleIds(
  code: string,
  filePath: string,
): Promise<Set<string | null>> {
  const eslint = new ESLint();
  const [result] = await eslint.lintText(code, { filePath });

  return new Set(result.messages.map((message) => message.ruleId));
}

describe("config and logging lint boundaries", () => {
  it("rejects direct console and process.env access in application code", async () => {
    const ruleIds = await lintRuleIds(
      `
export function example() {
  console.info(process.env.APP_ORIGIN);
}
`,
      "features/example.ts",
    );

    expect(ruleIds).toContain("no-console");
    expect(ruleIds).toContain("no-restricted-properties");
  });

  it("rejects direct Pino imports outside the shared logging module", async () => {
    const ruleIds = await lintRuleIds(
      `
import pino from "pino";

export const logger = pino();
`,
      "features/example.ts",
    );

    expect(ruleIds).toContain("no-restricted-imports");
  });

  it("allows process.env only in the exact config boundary module", async () => {
    const ruleIds = await lintRuleIds(
      "export const value = process.env.APP_ORIGIN;",
      "lib/config/server.ts",
    );

    expect(ruleIds).not.toContain("no-restricted-properties");
  });

  it("rejects process.env access in config sibling modules", async () => {
    const ruleIds = await lintRuleIds(
      "export const value = process.env.APP_ORIGIN;",
      "lib/config/example.ts",
    );

    expect(ruleIds).toContain("no-restricted-properties");
  });

  it("allows Pino only in the exact shared logging module", async () => {
    const ruleIds = await lintRuleIds(
      `
import pino from "pino";

export const logger = pino();
`,
      "lib/logging/logger.ts",
    );

    expect(ruleIds).not.toContain("no-restricted-imports");
  });

  it("rejects Pino imports in logging sibling modules", async () => {
    const ruleIds = await lintRuleIds(
      `
import pino from "pino";

export const logger = pino();
`,
      "lib/logging/example.ts",
    );

    expect(ruleIds).toContain("no-restricted-imports");
  });
});
