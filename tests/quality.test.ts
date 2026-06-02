import { describe, expect, it } from "vitest";

import { sampleResume } from "../src/lib/fixtures";
import { analyzeResume } from "../src/lib/quality";

describe("analyzeResume", () => {
  it("returns no blocking errors for the sample resume", () => {
    const issues = analyzeResume(sampleResume);

    expect(issues.every((issue) => issue.level === "info" || issue.level === "warning")).toBe(true);
  });

  it("flags missing contact data", () => {
    const issues = analyzeResume({
      ...sampleResume,
      basics: { ...sampleResume.basics, email: "", phone: "" }
    });

    expect(issues.some((issue) => issue.message.includes("联系方式"))).toBe(true);
  });
});
