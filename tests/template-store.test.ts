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
  it("seeds the unified template and exposes template components", async () => {
    const templates = await listTemplateMetas();
    const unified = await readTemplatePackage("unified-cv");

    expect(templates.map((template) => template.id)).toEqual(["unified-cv"]);
    expect(unified?.components.map((component) => component.kind)).toContain("header");
  });

  it("maps older saved template ids to the unified template", async () => {
    const legacyPackage = await readTemplatePackage("older-saved-template");
    const tex = generateLatex(sampleResume, getTemplate("older-saved-template"));

    expect(legacyPackage?.meta.id).toBe("unified-cv");
    expect(tex).toContain("\\resumeSection{教育}");
    expect(tex).toContain("\\begin{itemize}[leftmargin=*, label={-}");
  });
});
