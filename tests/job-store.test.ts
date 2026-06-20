import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { sampleResume } from "../src/lib/fixtures";
import { createCompileJob, jobResponse, listQueuedJobs } from "../src/server/compile/job-store";

let previousDataDir: string | undefined;
let tempDataDir: string;

beforeEach(async () => {
  previousDataDir = process.env.RESUME_TEX_DATA_DIR;
  tempDataDir = await mkdtemp(path.join(tmpdir(), "resume-tex-jobs-"));
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

describe("compile job store", () => {
  it("creates queued jobs and lists them in creation order", async () => {
    const first = await createCompileJob({
      resume: sampleResume,
      templateId: "unified-cv",
      sourceTex: "\\documentclass{article}\\begin{document}A\\end{document}",
      issues: [],
      engine: "xelatex",
      options: { fontSize: "10pt", showAvatar: false }
    });
    const second = await createCompileJob({
      resume: sampleResume,
      templateId: "unified-cv",
      sourceTex: "\\documentclass{article}\\begin{document}B\\end{document}",
      issues: [],
      engine: "xelatex",
      options: { fontSize: "10pt", showAvatar: false }
    });

    const queued = await listQueuedJobs();

    expect(queued.map((job) => job.jobId)).toEqual([first.jobId, second.jobId]);
  });

  it("does not expose resume payload or artifact paths in public responses", async () => {
    const job = await createCompileJob({
      resume: sampleResume,
      templateId: "unified-cv",
      sourceTex: "\\documentclass{article}\\begin{document}A\\end{document}",
      issues: [],
      engine: "xelatex",
      options: { fontSize: "10pt", showAvatar: false }
    });

    const response = jobResponse(job);

    expect(response).not.toHaveProperty("resume");
    expect(response).not.toHaveProperty("pdfPath");
    expect(response.status).toBe("queued");
  });
});
