import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { sampleResume } from "../src/lib/fixtures";
import { generateLatex } from "../src/lib/latex";
import { getTemplate } from "../src/lib/templates";
import { listTemplateMetas, readTemplatePackage } from "../src/server/templates/store";

let previousDataDir: string | undefined;
let tempDataDir: string;

beforeEach(async () => {
  previousDataDir = process.env.RESUME_TEX_DATA_DIR;
  tempDataDir = await mkdtemp(path.join(tmpdir(), "resume-tex-templates-"));
  process.env.RESUME_TEX_DATA_DIR = tempDataDir;
});

afterEach(async () => {
  if (previousDataDir === undefined) {
    delete process.env.RESUME_TEX_DATA_DIR;
  } else {
    process.env.RESUME_TEX_DATA_DIR = previousDataDir;
  }
  await rm(tempDataDir, { recursive: true, force: true });
});

describe("template store", () => {
  it("seeds built-in templates and exposes template components", async () => {
    const templates = await listTemplateMetas();
    const ecommerce = await readTemplatePackage("cross-border-ecommerce");

    expect(templates.some((template) => template.id === "cross-border-ecommerce")).toBe(true);
    expect(ecommerce?.components.map((component) => component.kind)).toContain("skills");
  });

  it("renders operation templates with stored component conventions", () => {
    const tex = generateLatex(sampleResume, getTemplate("cross-border-ecommerce"));

    expect(tex).toContain("\\sectionTitle{教育背景}");
    expect(tex).toContain("\\newlist{resumeBullets}");
    expect(tex).toContain("\\faPhone");
  });
});
