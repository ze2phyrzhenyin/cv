import type { QualityIssue, ResumeData, TemplateId } from "../../types/resume";

export type CompileJobStatus = "queued" | "running" | "success" | "failed";

export type CompileJobInput = {
  resumeId?: string;
  versionId?: string;
  resume: ResumeData;
  templateId: TemplateId;
  sourceTex: string;
  issues: QualityIssue[];
  engine: "xelatex";
  options: {
    fontSize: "10pt" | "11pt" | "12pt";
    showAvatar: boolean;
  };
};

export type CompileJobRecord = CompileJobInput & {
  jobId: string;
  status: CompileJobStatus;
  log: string;
  errorMessage?: string;
  pdfPath?: string;
  pdfUrl?: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
};
