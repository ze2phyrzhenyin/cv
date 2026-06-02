import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import { artifactPdfPath, artifactsDir, jobFile, jobsDir, workspacesDir } from "./paths";
import type { CompileResult } from "../../types/resume";
import type { CompileJobInput, CompileJobRecord, CompileJobStatus } from "./types";

async function ensureStore(): Promise<void> {
  await Promise.all([
    mkdir(jobsDir(), { recursive: true }),
    mkdir(workspacesDir(), { recursive: true }),
    mkdir(artifactsDir(), { recursive: true })
  ]);
}

export async function createCompileJob(input: CompileJobInput): Promise<CompileJobRecord> {
  await ensureStore();
  const jobId = `job_${Date.now()}_${randomUUID().slice(0, 8)}`;
  const record: CompileJobRecord = {
    ...input,
    jobId,
    status: "queued",
    log: "Compile job queued.",
    createdAt: new Date().toISOString()
  };
  await writeJob(record);
  return record;
}

export async function readCompileJob(jobId: string): Promise<CompileJobRecord | null> {
  await ensureStore();
  try {
    return JSON.parse(await readFile(jobFile(jobId), "utf-8")) as CompileJobRecord;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function writeJob(record: CompileJobRecord): Promise<void> {
  await ensureStore();
  const target = jobFile(record.jobId);
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(record, null, 2)}\n`, "utf-8");
  await rename(tmp, target);
}

export async function updateCompileJob(
  jobId: string,
  patch: Partial<CompileJobRecord> & { status?: CompileJobStatus }
): Promise<CompileJobRecord> {
  const existing = await readCompileJob(jobId);
  if (!existing) {
    throw new Error(`compile job not found: ${jobId}`);
  }
  const next = { ...existing, ...patch };
  await writeJob(next);
  return next;
}

export async function listQueuedJobs(): Promise<CompileJobRecord[]> {
  await ensureStore();
  const files = await readdir(jobsDir());
  const jobs = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => JSON.parse(await readFile(`${jobsDir()}/${file}`, "utf-8")) as CompileJobRecord)
  );

  return jobs
    .filter((job) => job.status === "queued")
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function jobResponse(record: CompileJobRecord): CompileResult {
  return {
    jobId: record.jobId,
    status: record.status,
    engine: record.engine,
    resumeId: record.resumeId,
    versionId: record.versionId,
    sourceTex: record.sourceTex,
    issues: record.issues,
    log: record.log,
    errorMessage: record.errorMessage,
    pdfUrl: record.status === "success" ? `/api/compile/${record.jobId}/pdf` : record.pdfUrl,
    createdAt: record.createdAt,
    startedAt: record.startedAt,
    finishedAt: record.finishedAt
  };
}
