import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("protected publish script", () => {
  it("requires explicit approval and local validation before pushing", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8")) as { scripts: Record<string, string> };
    const script = readFileSync("scripts/publish-all.mjs", "utf-8");

    expect(packageJson.scripts["publish:all"]).toBe("node scripts/publish-all.mjs");
    expect(script).toContain('args.has("--yes")');
    expect(script).toContain('"typecheck"');
    expect(script).toContain('"test"');
    expect(script).toContain('"status", "--porcelain=v1"');
    expect(script).toContain('"push"');
  });
});
