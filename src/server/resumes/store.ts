import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import type { ResumeData, ResumeVersion, SavedResumeDetail, SavedResumeSummary, TemplateId } from "../../types/resume";
import { resumeDataRoot, resumeFile } from "./paths";

type SaveResumeInput = {
  resumeId?: string;
  title: string;
  resume: ResumeData;
  templateId: TemplateId;
  sourceTex?: string;
};

async function ensureStore(): Promise<void> {
  await mkdir(resumeDataRoot(), { recursive: true });
}

export async function listResumes(): Promise<SavedResumeSummary[]> {
  await ensureStore();
  const files = await readdir(resumeDataRoot());
  const resumes = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => toSummary(JSON.parse(await readFile(`${resumeDataRoot()}/${file}`, "utf-8")) as SavedResumeDetail))
  );

  return resumes.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function readResume(resumeId: string): Promise<SavedResumeDetail | null> {
  await ensureStore();
  try {
    return JSON.parse(await readFile(resumeFile(resumeId), "utf-8")) as SavedResumeDetail;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function saveResumeVersion(input: SaveResumeInput): Promise<{ resume: SavedResumeSummary; version: ResumeVersion }> {
  await ensureStore();
  const now = new Date().toISOString();
  const existing = input.resumeId ? await readResume(input.resumeId) : null;
  const resumeId = existing?.id ?? `resume_${Date.now()}_${randomUUID().slice(0, 8)}`;
  const versionNo = (existing?.versions.length ?? 0) + 1;
  const versionId = `version_${versionNo}_${randomUUID().slice(0, 8)}`;
  const version: ResumeVersion = {
    id: versionId,
    resumeId,
    versionNo,
    data: input.resume,
    templateId: input.templateId,
    sourceTex: input.sourceTex,
    createdAt: now
  };
  const detail: SavedResumeDetail = {
    id: resumeId,
    title: input.title,
    currentTemplateId: input.templateId,
    currentVersionId: versionId,
    versionCount: versionNo,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    versions: [...(existing?.versions ?? []), version]
  };

  await writeResume(detail);
  return { resume: toSummary(detail), version };
}

export async function attachCompilePdf(
  resumeId: string,
  versionId: string,
  compile: { jobId: string; pdfUrl: string }
): Promise<void> {
  const detail = await readResume(resumeId);
  if (!detail) {
    return;
  }

  const versions = detail.versions.map((version) =>
    version.id === versionId ? { ...version, pdfJobId: compile.jobId, pdfUrl: compile.pdfUrl } : version
  );
  await writeResume({
    ...detail,
    versions,
    updatedAt: new Date().toISOString()
  });
}

async function writeResume(detail: SavedResumeDetail): Promise<void> {
  await ensureStore();
  const target = resumeFile(detail.id);
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(detail, null, 2)}\n`, "utf-8");
  await rename(tmp, target);
}

function toSummary(detail: SavedResumeDetail): SavedResumeSummary {
  return {
    id: detail.id,
    title: detail.title,
    currentTemplateId: detail.currentTemplateId,
    currentVersionId: detail.currentVersionId,
    versionCount: detail.versions.length,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt
  };
}
