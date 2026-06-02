export type TemplateId =
  | "modern-tech"
  | "academic-clean"
  | "ats-classic"
  | "cross-border-ecommerce"
  | "campus-operations"
  | "product-marketing";

export type Basics = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
};

export type TimelineItem = {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
};

export type ProjectItem = {
  id: string;
  name: string;
  role: string;
  url: string;
  techStack: string;
  highlights: string[];
};

export type SkillGroup = {
  id: string;
  category: string;
  items: string[];
};

export type AwardItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
};

export type ResumeData = {
  basics: Basics;
  summary: string;
  education: TimelineItem[];
  experience: TimelineItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  awards: AwardItem[];
};

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  category: string;
  language: "zh-CN" | "en";
  engine: "xelatex";
  layout: "compact" | "classic" | "ats" | "operation";
  accentColor: string;
  description: string;
  supports: {
    chinese: boolean;
    atsMode: boolean;
    avatar: boolean;
  };
};

export type TemplateComponentKind = "preamble" | "header" | "section" | "entry" | "bullets" | "skills" | "footer";

export type TemplateComponent = {
  id: string;
  name: string;
  kind: TemplateComponentKind;
  description: string;
  tex: string;
};

export type TemplatePackage = {
  meta: TemplateMeta;
  version: string;
  tags: string[];
  components: TemplateComponent[];
};

export type QualityIssue = {
  level: "info" | "warning";
  message: string;
};

export type CompileResult = {
  jobId: string;
  status: "queued" | "running" | "success" | "failed";
  engine: "xelatex";
  resumeId?: string;
  versionId?: string;
  sourceTex?: string;
  issues?: QualityIssue[];
  log: string;
  errorMessage?: string;
  pdfUrl?: string;
  createdAt?: string;
  startedAt?: string;
  finishedAt?: string;
};

export type ResumeVersion = {
  id: string;
  resumeId: string;
  versionNo: number;
  data: ResumeData;
  templateId: TemplateId;
  sourceTex?: string;
  pdfJobId?: string;
  pdfUrl?: string;
  createdAt: string;
};

export type SavedResumeSummary = {
  id: string;
  title: string;
  currentTemplateId: TemplateId;
  currentVersionId: string;
  versionCount: number;
  createdAt: string;
  updatedAt: string;
};

export type SavedResumeDetail = SavedResumeSummary & {
  versions: ResumeVersion[];
};
