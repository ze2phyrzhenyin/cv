import path from "node:path";

export function resumeDataRoot(): string {
  return process.env.RESUME_TEX_DATA_DIR
    ? path.resolve(process.env.RESUME_TEX_DATA_DIR, "resumes")
    : path.join(process.cwd(), ".data", "resumes");
}

export function resumeFile(resumeId: string): string {
  assertResumeId(resumeId);
  return path.join(resumeDataRoot(), `${resumeId}.json`);
}

export function assertResumeId(resumeId: string): void {
  if (!/^resume_[a-z0-9_-]+$/i.test(resumeId)) {
    throw new Error("invalid resume id");
  }
}
