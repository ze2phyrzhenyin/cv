import path from "node:path";

export function compileDataRoot(): string {
  return process.env.RESUME_TEX_DATA_DIR
    ? path.resolve(process.env.RESUME_TEX_DATA_DIR)
    : path.join(process.cwd(), ".data", "compile");
}

export function jobsDir(): string {
  return path.join(compileDataRoot(), "jobs");
}

export function workspacesDir(): string {
  return path.join(compileDataRoot(), "workspaces");
}

export function artifactsDir(): string {
  return path.join(compileDataRoot(), "artifacts");
}

export function jobFile(jobId: string): string {
  assertJobId(jobId);
  return path.join(jobsDir(), `${jobId}.json`);
}

export function artifactPdfPath(jobId: string): string {
  assertJobId(jobId);
  return path.join(artifactsDir(), `${jobId}.pdf`);
}

export function workspacePath(jobId: string): string {
  assertJobId(jobId);
  return path.join(workspacesDir(), jobId);
}

export function assertJobId(jobId: string): void {
  if (!/^job_[a-z0-9_-]+$/i.test(jobId)) {
    throw new Error("invalid compile job id");
  }
}
