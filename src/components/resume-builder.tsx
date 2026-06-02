"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ResumePreview } from "@/components/resume-preview";
import { sampleResume } from "@/lib/fixtures";
import { generateLatex } from "@/lib/latex";
import { analyzeResume } from "@/lib/quality";
import { getTemplate, templates } from "@/lib/templates";
import type { CompileResult, ProjectItem, ResumeData, ResumeVersion, SkillGroup, TemplateId, TimelineItem } from "@/types/resume";

type SectionId = "basics" | "summary" | "experience" | "projects" | "education" | "skills" | "source";

const storageKey = "resume-tex-draft-v1";

const sections: Array<{ id: SectionId; label: string }> = [
  { id: "basics", label: "基本信息" },
  { id: "summary", label: "简介" },
  { id: "experience", label: "工作" },
  { id: "projects", label: "项目" },
  { id: "education", label: "教育" },
  { id: "skills", label: "技能/奖项" },
  { id: "source", label: "LaTeX" }
];

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function linesToText(lines: string[]): string {
  return lines.join("\n");
}

function textToLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(sampleResume);
  const [templateId, setTemplateId] = useState<TemplateId>("modern-tech");
  const [activeSection, setActiveSection] = useState<SectionId>("basics");
  const [compileState, setCompileState] = useState<"idle" | "compiling" | "success" | "failed">("idle");
  const [compileLog, setCompileLog] = useState("尚未生成");
  const [issues, setIssues] = useState(analyzeResume(sampleResume));
  const [sourceOverride, setSourceOverride] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compileDetailLog, setCompileDetailLog] = useState("");
  const [compiledFingerprint, setCompiledFingerprint] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [saveLog, setSaveLog] = useState("尚未保存版本");

  const template = getTemplate(templateId);
  const generatedTex = useMemo(() => generateLatex(resume, template), [resume, template]);
  const sourceTex = sourceOverride ?? generatedTex;
  const currentFingerprint = useMemo(() => JSON.stringify({ resume, sourceTex, templateId }), [resume, sourceTex, templateId]);
  const currentFingerprintRef = useRef(currentFingerprint);
  const pdfIsFresh = Boolean(pdfUrl && compiledFingerprint === currentFingerprint);

  useEffect(() => {
    currentFingerprintRef.current = currentFingerprint;
    if (compiledFingerprint && compiledFingerprint !== currentFingerprint && compileState !== "compiling") {
      setCompileState("idle");
      setCompileLog("内容已修改，请重新生成 PDF。");
      setCompileDetailLog("");
    }
  }, [compileState, compiledFingerprint, currentFingerprint]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        resume?: ResumeData;
        templateId?: TemplateId;
        resumeId?: string;
        currentVersionId?: string;
      };
      if (parsed.resume) {
        setResume(parsed.resume);
      }
      if (parsed.templateId) {
        setTemplateId(parsed.templateId);
      }
      if (parsed.resumeId) {
        setResumeId(parsed.resumeId);
      }
      if (parsed.currentVersionId) {
        setCurrentVersionId(parsed.currentVersionId);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ resume, templateId, resumeId, currentVersionId }));
    setIssues(analyzeResume(resume));
  }, [currentVersionId, isHydrated, resume, resumeId, templateId]);

  useEffect(() => {
    if (!isHydrated || !resumeId) {
      return;
    }

    void loadResumeDetail(resumeId)
      .then((detail) => {
        setVersions(detail.versions);
        if (!currentVersionId) {
          setCurrentVersionId(detail.currentVersionId);
        }
      })
      .catch(() => {
        setSaveState("failed");
        setSaveLog("版本历史加载失败");
      });
  }, [currentVersionId, isHydrated, resumeId]);

  async function handleCompile() {
    const submittedFingerprint = currentFingerprint;
    setCompileState("compiling");
    setPdfUrl(null);
    setCompiledFingerprint(null);
    setCompileDetailLog("");
    setCompileLog("提交编译任务中");

    const response = await fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: resumeId ?? undefined,
        versionId: currentVersionId ?? undefined,
        resume,
        templateId,
        sourceTex,
        options: { fontSize: "10pt", showAvatar: false }
      })
    });
    const queued = (await response.json()) as CompileResult;

    if (!response.ok || !queued.jobId) {
      setCompileState("failed");
      setCompileLog(queued.errorMessage ?? "编译任务提交失败");
      return;
    }

    setCompileLog(`${queued.jobId} 已入队，等待 Worker 编译`);
    setCompileDetailLog(queued.log ?? "");

    try {
      const result = await pollCompileJob(queued.jobId, (next) => {
        setCompileLog(`${next.jobId} · ${compileStatusLabel(next.status)}`);
        setCompileDetailLog(next.log ?? "");
        if (next.issues) {
          setIssues(next.issues);
        }
      });
      if (result.status !== "success") {
        setCompileState("failed");
        setCompileLog(result.errorMessage ?? "LaTeX 编译失败");
        setCompileDetailLog(result.log ?? "");
        return;
      }

      if (currentFingerprintRef.current !== submittedFingerprint) {
        setCompileState("idle");
        setCompileLog("PDF 已生成，但内容已修改，请重新生成。");
        setCompileDetailLog(result.log ?? "");
        return;
      }

      setCompileState("success");
      setCompileLog(`${result.jobId} · PDF 已生成`);
      setIssues(result.issues ?? issues);
      setPdfUrl(result.pdfUrl ?? null);
      setCompiledFingerprint(submittedFingerprint);
      setCompileDetailLog(result.log ?? "");
      if (currentVersionId && result.pdfUrl) {
        setVersions((existing) =>
          existing.map((version) =>
            version.id === currentVersionId ? { ...version, pdfJobId: result.jobId, pdfUrl: result.pdfUrl } : version
          )
        );
      }
    } catch (error) {
      setCompileState("failed");
      setCompileLog(error instanceof Error ? error.message : "查询编译任务失败");
    }
  }

  async function handleSaveVersion() {
    setSaveState("saving");
    setSaveLog("保存版本中");

    const response = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: resumeId ?? undefined,
        title: resume.basics.name ? `${resume.basics.name}的简历` : "未命名简历",
        resume,
        templateId,
        sourceTex
      })
    });
    const result = (await response.json()) as { resume?: { id: string }; version?: ResumeVersion; errorMessage?: string };

    if (!response.ok || !result.resume || !result.version) {
      setSaveState("failed");
      setSaveLog(result.errorMessage ?? "保存失败");
      return;
    }

    setResumeId(result.resume.id);
    setCurrentVersionId(result.version.id);
    setVersions((existing) => [...existing.filter((version) => version.id !== result.version?.id), result.version as ResumeVersion]);
    setSaveState("saved");
    setSaveLog(`已保存 v${result.version.versionNo}`);
  }

  function exportTex() {
    const blob = new Blob([sourceTex], { type: "text/x-tex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resume.basics.name || "resume"}.tex`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function printPdf() {
    if (pdfIsFresh && pdfUrl) {
      window.open(pdfUrl, "_blank");
      return;
    }

    window.print();
  }

  function restoreVersion(version: ResumeVersion) {
    const restoredTemplate = getTemplate(version.templateId);
    const restoredSource = version.sourceTex ?? generateLatex(version.data, restoredTemplate);
    const restoredFingerprint = JSON.stringify({
      resume: version.data,
      sourceTex: restoredSource,
      templateId: version.templateId
    });

    setResume(version.data);
    setTemplateId(version.templateId);
    setSourceOverride(version.sourceTex ?? null);
    setResumeId(version.resumeId);
    setCurrentVersionId(version.id);
    setPdfUrl(version.pdfUrl ?? null);
    setCompiledFingerprint(version.pdfUrl ? restoredFingerprint : null);
    setCompileState(version.pdfUrl ? "success" : "idle");
    setCompileLog(version.pdfUrl ? `已恢复 v${version.versionNo} · PDF 可用` : `已恢复 v${version.versionNo}`);
    setCompileDetailLog("");
    setSaveState("saved");
    setSaveLog(`当前版本 v${version.versionNo}`);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <strong>ResumeTeX</strong>
          <span>结构化 LaTeX 简历</span>
        </div>
        <div className="template-tabs" role="tablist" aria-label="模板">
          {templates.map((item) => (
            <button
              aria-selected={templateId === item.id}
              className="template-tab"
              key={item.id}
              onClick={() => {
                setTemplateId(item.id);
                setSourceOverride(null);
              }}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="toolbar-actions">
          <button className="button secondary" disabled={saveState === "saving"} onClick={handleSaveVersion} type="button">
            {saveState === "saving" ? "保存中" : "保存版本"}
          </button>
          <button className="button secondary" onClick={exportTex} type="button">
            导出 .tex
          </button>
          {pdfIsFresh && pdfUrl ? (
            <a className="button secondary" href={pdfUrl}>
              下载 PDF
            </a>
          ) : null}
          <button className="button secondary" onClick={printPdf} type="button">
            打印 PDF
          </button>
          <button className="button primary" disabled={compileState === "compiling"} onClick={handleCompile} type="button">
            {compileState === "compiling" ? "生成中" : "生成"}
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="side-nav">
          <nav aria-label="简历模块">
            {sections.map((section) => (
              <button
                aria-current={activeSection === section.id ? "page" : undefined}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                type="button"
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="status-panel">
            <span className={`status-dot ${compileState}`} />
            <strong>{compileState === "success" ? "真实 PDF" : compileState === "failed" ? "失败" : compileState === "compiling" ? "编译中" : "草稿"}</strong>
            <p>{compileLog}</p>
          </div>

          <details className="log-panel" open={compileState === "failed"}>
            <summary>编译日志</summary>
            <pre>{compileDetailLog || compileLog}</pre>
          </details>

          <section className="version-panel" aria-label="版本历史">
            <div className="panel-head">
              <strong>版本历史</strong>
              <span className={saveState}>{saveLog}</span>
            </div>
            {versions.length === 0 ? (
              <p className="empty-state">保存后会出现在这里</p>
            ) : (
              <div className="version-list">
                {[...versions]
                  .sort((left, right) => right.versionNo - left.versionNo)
                  .map((version) => (
                    <button
                      className="version-item"
                      data-current={currentVersionId === version.id}
                      key={version.id}
                      onClick={() => restoreVersion(version)}
                      type="button"
                    >
                      <span>v{version.versionNo}</span>
                      <small>{formatDateTime(version.createdAt)}</small>
                      {version.pdfUrl ? <em>PDF</em> : null}
                    </button>
                  ))}
              </div>
            )}
          </section>

          <div className="issue-list">
            {issues.length === 0 ? <p>质量检查通过</p> : null}
            {issues.map((issue) => (
              <p className={issue.level} key={issue.message}>
                {issue.message}
              </p>
            ))}
          </div>
        </aside>

        <section className="editor-panel" aria-label="简历编辑">
          {activeSection === "basics" ? <BasicsEditor resume={resume} setResume={setResume} /> : null}
          {activeSection === "summary" ? <SummaryEditor resume={resume} setResume={setResume} /> : null}
          {activeSection === "experience" ? (
            <TimelineEditor
              addLabel="新增工作经历"
              emptyItem={() => ({
                id: createId("exp"),
                organization: "公司名称",
                role: "职位",
                location: "",
                startDate: "",
                endDate: "",
                highlights: ["负责的业务、动作和结果。"]
              })}
              field="experience"
              resume={resume}
              setResume={setResume}
              title="工作经历"
            />
          ) : null}
          {activeSection === "projects" ? <ProjectsEditor resume={resume} setResume={setResume} /> : null}
          {activeSection === "education" ? (
            <TimelineEditor
              addLabel="新增教育经历"
              emptyItem={() => ({
                id: createId("edu"),
                organization: "学校",
                role: "专业/学历",
                location: "",
                startDate: "",
                endDate: "",
                highlights: ["GPA、奖学金或核心课程。"]
              })}
              field="education"
              resume={resume}
              setResume={setResume}
              title="教育经历"
            />
          ) : null}
          {activeSection === "skills" ? <SkillsEditor resume={resume} setResume={setResume} /> : null}
          {activeSection === "source" ? (
            <SourceEditor sourceTex={sourceTex} onReset={() => setSourceOverride(null)} onUpdate={setSourceOverride} />
          ) : null}
        </section>

        <section className="preview-panel" aria-label="PDF 预览">
          <div className="preview-head">
            <div>
              <strong>{template.name}</strong>
              <span>{pdfIsFresh ? "LaTeX PDF 预览" : "草稿预览"}</span>
            </div>
            <span>{compileState === "compiling" ? "running" : template.engine}</span>
          </div>
          <div className="print-area">
            {pdfIsFresh && pdfUrl ? (
              <iframe className="pdf-frame" src={`${pdfUrl}#toolbar=1&navpanes=0`} title="LaTeX PDF 预览" />
            ) : (
              <div className="draft-preview">
                <div className={`preview-banner ${compileState}`}>
                  {compileState === "compiling"
                    ? "Worker 正在生成 PDF"
                    : compileState === "failed"
                      ? "生成失败，当前显示草稿"
                      : "当前显示草稿"}
                </div>
                <ResumePreview resume={resume} template={template} />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

async function pollCompileJob(jobId: string, onUpdate: (result: CompileResult) => void): Promise<CompileResult> {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    await sleep(1000);
    const response = await fetch(`/api/compile/${jobId}`, { cache: "no-store" });
    const result = (await response.json()) as CompileResult;

    if (!response.ok) {
      throw new Error(result.errorMessage ?? "编译任务查询失败");
    }

    onUpdate(result);

    if (result.status === "success" || result.status === "failed") {
      return result;
    }
  }

  throw new Error("编译任务等待超时，请确认 Worker 是否正在运行。");
}

async function loadResumeDetail(resumeId: string): Promise<{ versions: ResumeVersion[]; currentVersionId: string }> {
  const response = await fetch(`/api/resumes/${resumeId}`, { cache: "no-store" });
  const result = (await response.json()) as {
    resume?: {
      versions: ResumeVersion[];
      currentVersionId: string;
    };
    errorMessage?: string;
  };

  if (!response.ok || !result.resume) {
    throw new Error(result.errorMessage ?? "版本历史加载失败");
  }

  return result.resume;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function compileStatusLabel(status: CompileResult["status"]): string {
  switch (status) {
    case "queued":
      return "排队中";
    case "running":
      return "编译中";
    case "success":
      return "PDF 已生成";
    case "failed":
      return "编译失败";
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 5
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="field full">
      <span>{label}</span>
      <textarea onChange={(event) => onChange(event.target.value)} rows={rows} value={value} />
    </label>
  );
}

function BasicsEditor({ resume, setResume }: EditorProps) {
  const basics = resume.basics;
  const update = (key: keyof ResumeData["basics"], value: string) =>
    setResume({ ...resume, basics: { ...resume.basics, [key]: value } });

  return (
    <EditorSection title="基本信息">
      <div className="field-grid">
        <Field label="姓名" onChange={(value) => update("name", value)} value={basics.name} />
        <Field label="目标职位" onChange={(value) => update("title", value)} value={basics.title} />
        <Field label="邮箱" onChange={(value) => update("email", value)} type="email" value={basics.email} />
        <Field label="电话" onChange={(value) => update("phone", value)} value={basics.phone} />
        <Field label="城市" onChange={(value) => update("location", value)} value={basics.location} />
        <Field label="网站" onChange={(value) => update("website", value)} value={basics.website} />
        <Field label="GitHub" onChange={(value) => update("github", value)} value={basics.github} />
        <Field label="LinkedIn" onChange={(value) => update("linkedin", value)} value={basics.linkedin} />
      </div>
    </EditorSection>
  );
}

function SummaryEditor({ resume, setResume }: EditorProps) {
  return (
    <EditorSection title="个人简介">
      <TextAreaField label="简介" onChange={(value) => setResume({ ...resume, summary: value })} rows={8} value={resume.summary} />
    </EditorSection>
  );
}

type EditorProps = {
  resume: ResumeData;
  setResume: (resume: ResumeData) => void;
};

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="editor-section">
      <div className="section-title">
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TimelineEditor({
  resume,
  setResume,
  field,
  title,
  addLabel,
  emptyItem
}: EditorProps & {
  field: "experience" | "education";
  title: string;
  addLabel: string;
  emptyItem: () => TimelineItem;
}) {
  const items = resume[field];
  const updateItem = (index: number, patch: Partial<TimelineItem>) => {
    const next = items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    setResume({ ...resume, [field]: next });
  };
  const removeItem = (index: number) => setResume({ ...resume, [field]: items.filter((_, itemIndex) => itemIndex !== index) });

  return (
    <EditorSection title={title}>
      <div className="stack-list">
        {items.map((item, index) => (
          <div className="item-card" key={item.id}>
            <div className="card-actions">
              <strong>{item.organization || title}</strong>
              <button className="link-button" onClick={() => removeItem(index)} type="button">
                删除
              </button>
            </div>
            <div className="field-grid">
              <Field label="机构/公司" onChange={(value) => updateItem(index, { organization: value })} value={item.organization} />
              <Field label="职位/学历" onChange={(value) => updateItem(index, { role: value })} value={item.role} />
              <Field label="地点" onChange={(value) => updateItem(index, { location: value })} value={item.location} />
              <Field label="开始" onChange={(value) => updateItem(index, { startDate: value })} value={item.startDate} />
              <Field label="结束" onChange={(value) => updateItem(index, { endDate: value })} value={item.endDate} />
              <TextAreaField
                label="要点"
                onChange={(value) => updateItem(index, { highlights: textToLines(value) })}
                rows={5}
                value={linesToText(item.highlights)}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="button secondary wide" onClick={() => setResume({ ...resume, [field]: [...items, emptyItem()] })} type="button">
        {addLabel}
      </button>
    </EditorSection>
  );
}

function ProjectsEditor({ resume, setResume }: EditorProps) {
  const updateItem = (index: number, patch: Partial<ProjectItem>) => {
    const projects = resume.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    setResume({ ...resume, projects });
  };

  return (
    <EditorSection title="项目经历">
      <div className="stack-list">
        {resume.projects.map((item, index) => (
          <div className="item-card" key={item.id}>
            <div className="card-actions">
              <strong>{item.name || "项目"}</strong>
              <button
                className="link-button"
                onClick={() => setResume({ ...resume, projects: resume.projects.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                删除
              </button>
            </div>
            <div className="field-grid">
              <Field label="项目名" onChange={(value) => updateItem(index, { name: value })} value={item.name} />
              <Field label="角色" onChange={(value) => updateItem(index, { role: value })} value={item.role} />
              <Field label="链接" onChange={(value) => updateItem(index, { url: value })} value={item.url} />
              <Field label="技术栈" onChange={(value) => updateItem(index, { techStack: value })} value={item.techStack} />
              <TextAreaField
                label="要点"
                onChange={(value) => updateItem(index, { highlights: textToLines(value) })}
                rows={5}
                value={linesToText(item.highlights)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="button secondary wide"
        onClick={() =>
          setResume({
            ...resume,
            projects: [
              ...resume.projects,
              { id: createId("project"), name: "项目名称", role: "角色", url: "", techStack: "", highlights: ["说明职责和结果。"] }
            ]
          })
        }
        type="button"
      >
        新增项目
      </button>
    </EditorSection>
  );
}

function SkillsEditor({ resume, setResume }: EditorProps) {
  const updateSkill = (index: number, patch: Partial<SkillGroup>) => {
    const skills = resume.skills.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    setResume({ ...resume, skills });
  };
  const updateAward = (index: number, patch: Partial<ResumeData["awards"][number]>) => {
    const awards = resume.awards.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    setResume({ ...resume, awards });
  };

  return (
    <EditorSection title="技能与奖项">
      <div className="stack-list">
        {resume.skills.map((group, index) => (
          <div className="item-card compact" key={group.id}>
            <div className="card-actions">
              <strong>{group.category || "技能"}</strong>
              <button
                className="link-button"
                onClick={() => setResume({ ...resume, skills: resume.skills.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                删除
              </button>
            </div>
            <div className="field-grid">
              <Field label="分类" onChange={(value) => updateSkill(index, { category: value })} value={group.category} />
              <Field label="技能" onChange={(value) => updateSkill(index, { items: value.split(",").map((item) => item.trim()) })} value={group.items.join(", ")} />
            </div>
          </div>
        ))}
      </div>
      <button
        className="button secondary wide"
        onClick={() => setResume({ ...resume, skills: [...resume.skills, { id: createId("skill"), category: "新分类", items: [] }] })}
        type="button"
      >
        新增技能分类
      </button>
      <div className="subsection-rule">
        <strong>奖项证书</strong>
      </div>
      <div className="stack-list">
        {resume.awards.map((award, index) => (
          <div className="item-card compact" key={award.id}>
            <div className="card-actions">
              <strong>{award.title || "奖项"}</strong>
              <button
                className="link-button"
                onClick={() => setResume({ ...resume, awards: resume.awards.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                删除
              </button>
            </div>
            <div className="field-grid">
              <Field label="名称" onChange={(value) => updateAward(index, { title: value })} value={award.title} />
              <Field label="机构" onChange={(value) => updateAward(index, { issuer: value })} value={award.issuer} />
              <Field label="日期" onChange={(value) => updateAward(index, { date: value })} value={award.date} />
            </div>
          </div>
        ))}
      </div>
      <button
        className="button secondary wide"
        onClick={() =>
          setResume({
            ...resume,
            awards: [...resume.awards, { id: createId("award"), title: "奖项名称", issuer: "颁发机构", date: "" }]
          })
        }
        type="button"
      >
        新增奖项
      </button>
    </EditorSection>
  );
}

function SourceEditor({
  sourceTex,
  onUpdate,
  onReset
}: {
  sourceTex: string;
  onUpdate: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <EditorSection title="LaTeX 源码">
      <textarea className="source-editor" onChange={(event) => onUpdate(event.target.value)} spellCheck={false} value={sourceTex} />
      <button className="button secondary wide" onClick={onReset} type="button">
        重置为模板源码
      </button>
    </EditorSection>
  );
}
