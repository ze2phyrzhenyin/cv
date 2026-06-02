import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { sampleResume } from "../src/lib/fixtures";
import { attachCompilePdf, listResumes, readResume, saveResumeVersion } from "../src/server/resumes/store";

let previousDataDir: string | undefined;
let tempDataDir: string;

beforeEach(async () => {
  previousDataDir = process.env.RESUME_TEX_DATA_DIR;
  tempDataDir = await mkdtemp(path.join(tmpdir(), "resume-tex-resumes-"));
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

describe("resume store", () => {
  it("creates a resume and appends immutable versions", async () => {
    const first = await saveResumeVersion({
      title: "测试简历",
      resume: sampleResume,
      templateId: "modern-tech",
      sourceTex: "v1"
    });
    const second = await saveResumeVersion({
      resumeId: first.resume.id,
      title: "测试简历",
      resume: { ...sampleResume, summary: "updated" },
      templateId: "ats-classic",
      sourceTex: "v2"
    });

    const detail = await readResume(first.resume.id);
    const summaries = await listResumes();

    expect(second.version.versionNo).toBe(2);
    expect(detail?.versions).toHaveLength(2);
    expect(detail?.currentVersionId).toBe(second.version.id);
    expect(summaries[0].versionCount).toBe(2);
  });

  it("attaches successful compile pdf metadata to a version", async () => {
    const saved = await saveResumeVersion({
      title: "测试简历",
      resume: sampleResume,
      templateId: "modern-tech",
      sourceTex: "v1"
    });

    await attachCompilePdf(saved.resume.id, saved.version.id, {
      jobId: "job_test",
      pdfUrl: "/api/compile/job_test/pdf"
    });

    const detail = await readResume(saved.resume.id);

    expect(detail?.versions[0].pdfJobId).toBe("job_test");
    expect(detail?.versions[0].pdfUrl).toBe("/api/compile/job_test/pdf");
  });
});
