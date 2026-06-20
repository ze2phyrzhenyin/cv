"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";

import { PdfCanvasPreview } from "@/components/pdf-canvas-preview";
import { ResumePreview } from "@/components/resume-preview";
import { sampleResume, sampleResumes } from "@/lib/fixtures";
import { applyInlineFormat } from "@/lib/inline-format";
import type { InlineFormat } from "@/lib/inline-format";
import { generateLatex } from "@/lib/latex";
import {
  getAppCopy,
  getDefaultBasicFieldIcon,
  getDefaultBasicFieldMark,
  getResumeLanguage,
  languageLabels,
  normalizeResumeLanguage,
  resumeLanguages
} from "@/lib/resume-language";
import { getTemplate, normalizeTemplateId, unifiedTemplateId } from "@/lib/templates";
import type {
  BasicField,
  BasicFieldLabelIcon,
  Basics,
  CompileResult,
  ProjectItem,
  ResumeData,
  ResumeLanguage,
  ResumeSectionConfig,
  SkillGroup,
  TemplateId,
  TimelineItem
} from "@/types/resume";

type SectionId = "presentation" | "basics" | "summary" | "experience" | "projects" | "education" | "skills" | "source";

const storageKey = "resume-tex-draft-v1";
const previewPageWidth = 820;
const previewPageHeight = 1159.7;
const previewScreenScale = 0.745;

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
  const [templateId, setTemplateId] = useState<TemplateId>(unifiedTemplateId);
  const [activeSection, setActiveSection] = useState<SectionId>("basics");
  const [compileState, setCompileState] = useState<"idle" | "compiling" | "success" | "failed">("idle");
  const [sourceOverride, setSourceOverride] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compiledFingerprint, setCompiledFingerprint] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  const activeLanguage = getResumeLanguage(resume);
  const copy = getAppCopy(activeLanguage);
  const editorSections: Array<{ id: SectionId; label: string }> = [
    { id: "presentation", label: copy.tabs.presentation },
    { id: "basics", label: copy.tabs.basics },
    { id: "summary", label: copy.tabs.summary },
    { id: "experience", label: copy.tabs.experience },
    { id: "projects", label: copy.tabs.projects },
    { id: "education", label: copy.tabs.education },
    { id: "skills", label: copy.tabs.skills },
    { id: "source", label: copy.tabs.source }
  ];
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
        templateId?: string;
        resumeId?: string;
        currentVersionId?: string;
      };
      if (parsed.resume) {
        setResume(normalizeResumeLanguage(parsed.resume));
      }
      if (parsed.templateId) {
        setTemplateId(normalizeTemplateId(parsed.templateId));
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
  }, [currentVersionId, isHydrated, resume, resumeId, templateId]);

  function handleLanguageChange(language: ResumeLanguage) {
    if (language === activeLanguage) {
      return;
    }

    setResume(sampleResumes[language]);
    setSourceOverride(null);
    setPdfUrl(null);
    setCompiledFingerprint(null);
    setCompileState("idle");
    setResumeId(null);
    setCurrentVersionId(null);
  }

  async function handleCompile() {
    const submittedFingerprint = currentFingerprint;
    setCompileState("compiling");
    setPdfUrl(null);
    setCompiledFingerprint(null);

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
      return;
    }

    try {
      const result = await pollCompileJob(queued.jobId, () => undefined, copy);
      if (result.status !== "success") {
        setCompileState("failed");
        return;
      }

      if (currentFingerprintRef.current !== submittedFingerprint) {
        setCompileState("idle");
        return;
      }

      setCompileState("success");
      setPdfUrl(result.pdfUrl ?? null);
      setCompiledFingerprint(submittedFingerprint);
    } catch {
      setCompileState("failed");
    }
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
    }
  }

  function downloadPdfUrl(url: string): string {
    return `${url}${url.includes("?") ? "&" : "?"}download=1`;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <strong>ResumeTeX</strong>
          <span>{copy.appSubtitle}</span>
        </div>
        <div className="switcher-group unified">
          <div className="language-tabs" role="tablist" aria-label={copy.languageAria}>
            {resumeLanguages.map((language) => (
              <button
                aria-selected={activeLanguage === language}
                className="language-tab"
                key={language}
                onClick={() => handleLanguageChange(language)}
                type="button"
              >
                {languageLabels[language]}
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar-actions">
          <button className="button secondary" onClick={exportTex} type="button">
            {copy.buttons.exportTex}
          </button>
          {pdfIsFresh && pdfUrl ? (
            <a className="button secondary" href={downloadPdfUrl(pdfUrl)}>
              {copy.buttons.downloadPdf}
            </a>
          ) : null}
          <button className="button secondary" disabled={!pdfIsFresh || !pdfUrl} onClick={printPdf} type="button">
            {copy.buttons.printPdf}
          </button>
          <button className="button primary" disabled={compileState === "compiling"} onClick={handleCompile} type="button">
            {compileState === "compiling" ? copy.buttons.generating : copy.buttons.generate}
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="side-nav">
          <nav aria-label={copy.moduleAria}>
            {editorSections.map((section) => (
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

        </aside>

        <section className="editor-panel" aria-label={copy.editorAria}>
          {activeSection === "presentation" ? <PresentationEditor copy={copy} resume={resume} setResume={setResume} /> : null}
          {activeSection === "basics" ? <BasicsEditor copy={copy} resume={resume} setResume={setResume} /> : null}
          {activeSection === "summary" ? <SummaryEditor copy={copy} resume={resume} setResume={setResume} /> : null}
          {activeSection === "experience" ? (
            <TimelineEditor
              addLabel={copy.editor.addExperience}
              emptyItem={() => ({
                id: createId("exp"),
                organization: copy.editor.newExperienceOrg,
                role: copy.editor.newExperienceRole,
                location: "",
                startDate: "",
                endDate: "",
                highlights: [copy.editor.newExperienceBullet]
              })}
              copy={copy}
              field="experience"
              resume={resume}
              setResume={setResume}
              title={copy.editor.experience}
            />
          ) : null}
          {activeSection === "projects" ? <ProjectsEditor copy={copy} resume={resume} setResume={setResume} /> : null}
          {activeSection === "education" ? (
            <TimelineEditor
              addLabel={copy.editor.addEducation}
              emptyItem={() => ({
                id: createId("edu"),
                organization: copy.editor.newEducationOrg,
                role: copy.editor.newEducationRole,
                location: "",
                startDate: "",
                endDate: "",
                highlights: [copy.editor.newEducationBullet]
              })}
              copy={copy}
              field="education"
              resume={resume}
              setResume={setResume}
              title={copy.editor.education}
            />
          ) : null}
          {activeSection === "skills" ? <SkillsEditor copy={copy} resume={resume} setResume={setResume} /> : null}
          {activeSection === "source" ? (
            <SourceEditor copy={copy} sourceTex={sourceTex} onReset={() => setSourceOverride(null)} onUpdate={setSourceOverride} />
          ) : null}
        </section>

        <section className="preview-panel" aria-label={copy.previewAria}>
          <div className="preview-head">
            <div>
              <strong>{copy.previewTitle}</strong>
              <span>{pdfIsFresh ? copy.previewPdf : previewStatusLabel(compileState, copy)}</span>
            </div>
            <span>{compileState === "compiling" ? "running" : template.engine}</span>
          </div>
          <div className="print-area">
            {pdfIsFresh && pdfUrl ? (
              <PdfCanvasPreview title={copy.previewPdf} url={pdfUrl} />
            ) : (
              <ScaledDraftPreview resume={resume} template={template} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ScaledDraftPreview({ resume, template }: { resume: ResumeData; template: ReturnType<typeof getTemplate> }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(previewScreenScale);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    function updateScale() {
      const availableWidth = frame?.clientWidth || previewPageWidth;
      const nextScale = Math.min(previewScreenScale, availableWidth / previewPageWidth);
      setScale(Math.max(0.45, Number(nextScale.toFixed(3))));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  const width = previewPageWidth * scale;
  const height = previewPageHeight * scale;
  const style = {
    "--preview-scale": scale,
    "--preview-width": `${width}px`,
    "--preview-height": `${height}px`
  } as CSSProperties;

  return (
    <div className="draft-preview-frame" ref={frameRef}>
      <div className="draft-preview" style={style}>
        <ResumePreview resume={resume} template={template} />
      </div>
    </div>
  );
}

async function pollCompileJob(jobId: string, onUpdate: (result: CompileResult) => void, copy: ReturnType<typeof getAppCopy>): Promise<CompileResult> {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    await sleep(1000);
    const response = await fetch(`/api/compile/${jobId}`, { cache: "no-store" });
    const result = (await response.json()) as CompileResult;

    if (!response.ok) {
      throw new Error(result.errorMessage ?? copy.logs.queryFailed);
    }

    onUpdate(result);

    if (result.status === "success" || result.status === "failed") {
      return result;
    }
  }

  throw new Error(copy.logs.timeout);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function previewStatusLabel(compileState: "idle" | "compiling" | "success" | "failed", copy: BuilderCopy): string {
  if (compileState === "compiling") {
    return copy.compilingBanner;
  }
  if (compileState === "failed") {
    return copy.failedBanner;
  }
  return copy.previewDraft;
}

function applyBasicFields(resume: ResumeData, basicFields: BasicField[]): ResumeData {
  const basics = basicFields.reduce<Basics>(
    (next, field) => {
      if (field.key) {
        next[field.key] = field.value;
      }
      return next;
    },
    { ...resume.basics }
  );

  return { ...resume, basics, basicFields };
}

function Field({
  label,
  value,
  onChange,
  copy,
  placeholder,
  richText = false,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  copy?: BuilderCopy;
  placeholder?: string;
  richText?: boolean;
  type?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="field">
      <span>{label}</span>
      {richText && copy ? <InlineFormatToolbar controlRef={inputRef} copy={copy} onChange={onChange} value={value} /> : null}
      <input ref={inputRef} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  copy,
  richText = false,
  rows = 5
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  copy?: BuilderCopy;
  richText?: boolean;
  rows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="field full">
      <span>{label}</span>
      {richText && copy ? <InlineFormatToolbar controlRef={textareaRef} copy={copy} onChange={onChange} value={value} /> : null}
      <textarea ref={textareaRef} onChange={(event) => onChange(event.target.value)} rows={rows} value={value} />
    </div>
  );
}

function InlineFormatToolbar({
  controlRef,
  copy,
  value,
  onChange
}: {
  controlRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
  copy: BuilderCopy;
  value: string;
  onChange: (value: string) => void;
}) {
  const actions: Array<{ format: InlineFormat; label: string; text: string; className: string }> = [
    { format: "bold", label: copy.editor.formatBold, text: "B", className: "bold" },
    { format: "italic", label: copy.editor.formatItalic, text: "I", className: "italic" },
    { format: "underline", label: copy.editor.formatUnderline, text: "U", className: "underline" },
    { format: "strike", label: copy.editor.formatStrike, text: "S", className: "strike" }
  ];

  function applyFormat(format: InlineFormat) {
    const control = controlRef.current;
    if (!control) {
      return;
    }

    const result = applyInlineFormat(value, control.selectionStart ?? value.length, control.selectionEnd ?? value.length, format);
    onChange(result.value);
    window.requestAnimationFrame(() => {
      control.focus();
      control.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  return (
    <div aria-label={copy.editor.formatToolbar} className="inline-format-toolbar" role="toolbar">
      {actions.map((action) => (
        <button
          aria-label={action.label}
          className={`format-button ${action.className}`}
          key={action.format}
          onClick={() => applyFormat(action.format)}
          onMouseDown={(event) => event.preventDefault()}
          title={action.label}
          type="button"
        >
          {action.text}
        </button>
      ))}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type BuilderCopy = ReturnType<typeof getAppCopy>;

function PresentationEditor({ copy, resume, setResume }: EditorProps) {
  const moveSection = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= resume.sections.length) {
      return;
    }

    const sections = [...resume.sections];
    const [section] = sections.splice(index, 1);
    sections.splice(targetIndex, 0, section);
    setResume({ ...resume, sections });
  };
  const updateSection = (index: number, patch: Partial<ResumeSectionConfig>) => {
    const sections = resume.sections.map((section, sectionIndex) => (sectionIndex === index ? { ...section, ...patch } : section));
    setResume({ ...resume, sections });
  };

  return (
    <EditorSection title={copy.editor.presentation}>
      <div className="field-grid">
        <label className="field color-field">
          <span>{copy.editor.accentColor}</span>
          <input
            onChange={(event) => setResume({ ...resume, theme: { ...resume.theme, accentColor: event.target.value } })}
            type="color"
            value={resume.theme.accentColor}
          />
        </label>
        <Field
          label={copy.editor.accentHex}
          onChange={(value) => setResume({ ...resume, theme: { ...resume.theme, accentColor: value } })}
          value={resume.theme.accentColor}
        />
      </div>

      <div className="subsection-rule">
        <strong>{copy.editor.sectionOrder}</strong>
      </div>
      <div className="stack-list">
        {resume.sections.map((section, index) => (
          <div className="item-card compact section-config-card" key={section.id}>
            <div className="card-actions">
              <label className="check-field">
                <input checked={section.visible} onChange={(event) => updateSection(index, { visible: event.target.checked })} type="checkbox" />
                <span>{copy.editor.showSection}</span>
              </label>
              <div className="row-actions">
                <button className="button secondary small" disabled={index === 0} onClick={() => moveSection(index, -1)} type="button">
                  {copy.buttons.moveUp}
                </button>
                <button className="button secondary small" disabled={index === resume.sections.length - 1} onClick={() => moveSection(index, 1)} type="button">
                  {copy.buttons.moveDown}
                </button>
              </div>
            </div>
            <Field label={copy.editor.sectionName} onChange={(value) => updateSection(index, { title: value })} value={section.title} />
          </div>
        ))}
      </div>
    </EditorSection>
  );
}

function BasicsEditor({ copy, resume, setResume }: EditorProps) {
  const placementOptions = [
    { label: copy.editor.placementName, value: "name" },
    { label: copy.editor.placementHeadline, value: "headline" },
    { label: copy.editor.placementContact, value: "contact" },
    { label: copy.editor.placementHidden, value: "hidden" }
  ];
  const labelModeOptions = [
    { label: copy.editor.labelModeText, value: "text" },
    { label: copy.editor.labelModeMark, value: "mark" },
    { label: copy.editor.labelModeCustom, value: "custom" },
    { label: copy.editor.labelModeNone, value: "none" }
  ];
  const iconOptions: Array<{ label: string; value: BasicFieldLabelIcon }> = [
    { label: copy.editor.iconEmail, value: "email" },
    { label: copy.editor.iconPhone, value: "phone" },
    { label: copy.editor.iconLocation, value: "location" },
    { label: copy.editor.iconWebsite, value: "website" },
    { label: copy.editor.iconGithub, value: "github" },
    { label: copy.editor.iconLinkedin, value: "linkedin" },
    { label: copy.editor.iconLink, value: "link" }
  ];
  const updateField = (index: number, patch: Partial<BasicField>) => {
    const basicFields = resume.basicFields.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field));
    setResume(applyBasicFields(resume, basicFields));
  };
  const removeField = (index: number) => {
    const basicFields = resume.basicFields.filter((_, fieldIndex) => fieldIndex !== index);
    setResume(applyBasicFields(resume, basicFields));
  };
  const moveField = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= resume.basicFields.length) {
      return;
    }

    const basicFields = [...resume.basicFields];
    const [field] = basicFields.splice(index, 1);
    basicFields.splice(targetIndex, 0, field);
    setResume(applyBasicFields(resume, basicFields));
  };

  return (
    <EditorSection title={copy.editor.basics}>
      <SectionTitleField copy={copy} resume={resume} sectionId="basics" setResume={setResume} />
      <div className="stack-list">
        {resume.basicFields.map((field, index) => {
          const labelMode = field.labelMode ?? "text";
          const showIconSelect = labelMode === "mark";
          const showMarkInput = labelMode === "custom";
          return (
            <div className="item-card compact" key={field.id}>
              <div className="card-actions">
                <strong>{field.label || copy.editor.customField}</strong>
                <div className="row-actions">
                  <button className="button secondary small" disabled={index === 0} onClick={() => moveField(index, -1)} type="button">
                    {copy.buttons.moveUp}
                  </button>
                  <button className="button secondary small" disabled={index === resume.basicFields.length - 1} onClick={() => moveField(index, 1)} type="button">
                    {copy.buttons.moveDown}
                  </button>
                  <button className="link-button" onClick={() => removeField(index)} type="button">
                    {copy.buttons.delete}
                  </button>
                </div>
              </div>
              <div className="field-grid">
                <Field label={copy.editor.fieldLabel} onChange={(value) => updateField(index, { label: value })} value={field.label} />
                <Field copy={copy} label={copy.editor.fieldValue} onChange={(value) => updateField(index, { value })} richText value={field.value} />
                <SelectField
                  label={copy.editor.fieldPlacement}
                  onChange={(value) => updateField(index, { placement: value as BasicField["placement"] })}
                  options={placementOptions}
                  value={field.placement ?? "contact"}
                />
                <SelectField
                  label={copy.editor.labelMode}
                  onChange={(value) => updateField(index, { labelMode: value as BasicField["labelMode"] })}
                  options={labelModeOptions}
                  value={labelMode}
                />
                {showIconSelect ? (
                  <SelectField
                    label={copy.editor.fieldIcon}
                    onChange={(value) => updateField(index, { labelIcon: value as BasicFieldLabelIcon })}
                    options={iconOptions}
                    value={field.labelIcon ?? getDefaultBasicFieldIcon(field.key) ?? "link"}
                  />
                ) : null}
                {showMarkInput ? (
                  <Field
                    label={copy.editor.fieldMark}
                    onChange={(value) => updateField(index, { labelMark: value })}
                    value={field.labelMark ?? getDefaultBasicFieldMark(field.key)}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="button secondary wide"
        onClick={() =>
          setResume({
            ...resume,
            basicFields: [
              ...resume.basicFields,
              {
                id: createId("basic-field"),
                label: copy.editor.customField,
                value: "",
                placement: "contact",
                labelMode: "text",
                labelMark: "",
                labelIcon: "link"
              }
            ]
          })
        }
        type="button"
      >
        {copy.buttons.addField}
      </button>
    </EditorSection>
  );
}

function SummaryEditor({ copy, resume, setResume }: EditorProps) {
  return (
    <EditorSection title={copy.editor.summary}>
      <SectionTitleField copy={copy} resume={resume} sectionId="summary" setResume={setResume} />
      <TextAreaField copy={copy} label={copy.editor.summaryLabel} onChange={(value) => setResume({ ...resume, summary: value })} richText rows={8} value={resume.summary} />
    </EditorSection>
  );
}

type EditorProps = {
  copy: BuilderCopy;
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

function SectionTitleField({
  copy,
  resume,
  sectionId,
  setResume
}: {
  copy: BuilderCopy;
  resume: ResumeData;
  sectionId: ResumeSectionConfig["id"];
  setResume: (resume: ResumeData) => void;
}) {
  const section = resume.sections.find((item) => item.id === sectionId);

  if (!section) {
    return null;
  }

  return (
    <div className="section-name-inline">
      <Field
        label={copy.editor.sectionName}
        onChange={(value) =>
          setResume({
            ...resume,
            sections: resume.sections.map((item) => (item.id === sectionId ? { ...item, title: value } : item))
          })
        }
        value={section.title}
      />
    </div>
  );
}

function TimelineEditor({
  copy,
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
      <SectionTitleField copy={copy} resume={resume} sectionId={field === "experience" ? "experience" : "education"} setResume={setResume} />
      <div className="stack-list">
        {items.map((item, index) => (
          <div className="item-card" key={item.id}>
            <div className="card-actions">
              <strong>{item.organization || title}</strong>
              <button className="link-button" onClick={() => removeItem(index)} type="button">
                {copy.buttons.delete}
              </button>
            </div>
            <div className="field-grid">
              <Field copy={copy} label={copy.editor.organization} onChange={(value) => updateItem(index, { organization: value })} richText value={item.organization} />
              <Field copy={copy} label={copy.editor.role} onChange={(value) => updateItem(index, { role: value })} richText value={item.role} />
              <Field copy={copy} label={copy.editor.location} onChange={(value) => updateItem(index, { location: value })} richText value={item.location} />
              <Field label={copy.editor.start} onChange={(value) => updateItem(index, { startDate: value })} value={item.startDate} />
              <Field label={copy.editor.end} onChange={(value) => updateItem(index, { endDate: value })} value={item.endDate} />
              <TextAreaField
                copy={copy}
                label={copy.editor.highlights}
                onChange={(value) => updateItem(index, { highlights: textToLines(value) })}
                richText
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

function ProjectsEditor({ copy, resume, setResume }: EditorProps) {
  const updateItem = (index: number, patch: Partial<ProjectItem>) => {
    const projects = resume.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    setResume({ ...resume, projects });
  };

  return (
    <EditorSection title={copy.editor.projects}>
      <SectionTitleField copy={copy} resume={resume} sectionId="projects" setResume={setResume} />
      <div className="stack-list">
        {resume.projects.map((item, index) => (
          <div className="item-card" key={item.id}>
            <div className="card-actions">
              <strong>{item.name || copy.editor.projectFallback}</strong>
              <button
                className="link-button"
                onClick={() => setResume({ ...resume, projects: resume.projects.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                {copy.buttons.delete}
              </button>
            </div>
            <div className="field-grid">
              <Field copy={copy} label={copy.editor.projectName} onChange={(value) => updateItem(index, { name: value })} richText value={item.name} />
              <Field copy={copy} label={copy.editor.projectRole} onChange={(value) => updateItem(index, { role: value })} richText value={item.role} />
              <Field label={copy.editor.projectUrl} onChange={(value) => updateItem(index, { url: value })} value={item.url} />
              <Field copy={copy} label={copy.editor.projectStack} onChange={(value) => updateItem(index, { techStack: value })} richText value={item.techStack} />
              <TextAreaField
                copy={copy}
                label={copy.editor.highlights}
                onChange={(value) => updateItem(index, { highlights: textToLines(value) })}
                richText
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
              { id: createId("project"), name: copy.editor.newProjectName, role: copy.editor.newProjectRole, url: "", techStack: "", highlights: [copy.editor.newProjectBullet] }
            ]
          })
        }
        type="button"
      >
        {copy.editor.addProject}
      </button>
    </EditorSection>
  );
}

function SkillsEditor({ copy, resume, setResume }: EditorProps) {
  const updateSkill = (index: number, patch: Partial<SkillGroup>) => {
    const skills = resume.skills.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    setResume({ ...resume, skills });
  };
  const updateAward = (index: number, patch: Partial<ResumeData["awards"][number]>) => {
    const awards = resume.awards.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    setResume({ ...resume, awards });
  };

  return (
    <EditorSection title={copy.editor.skillsAwards}>
      <SectionTitleField copy={copy} resume={resume} sectionId="skillsAwards" setResume={setResume} />
      <div className="stack-list">
        {resume.skills.map((group, index) => (
          <div className="item-card compact" key={group.id}>
            <div className="card-actions">
              <strong>{group.category || copy.editor.skillFallback}</strong>
              <button
                className="link-button"
                onClick={() => setResume({ ...resume, skills: resume.skills.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                {copy.buttons.delete}
              </button>
            </div>
            <div className="field-grid">
              <Field copy={copy} label={copy.editor.skillCategory} onChange={(value) => updateSkill(index, { category: value })} richText value={group.category} />
              <Field copy={copy} label={copy.editor.skillItems} onChange={(value) => updateSkill(index, { items: value.split(",").map((item) => item.trim()) })} richText value={group.items.join(", ")} />
            </div>
          </div>
        ))}
      </div>
      <button
        className="button secondary wide"
        onClick={() => setResume({ ...resume, skills: [...resume.skills, { id: createId("skill"), category: copy.editor.newSkillCategory, items: [] }] })}
        type="button"
      >
        {copy.editor.addSkill}
      </button>
      <div className="subsection-rule">
        <strong>{copy.editor.awards}</strong>
      </div>
      <div className="stack-list">
        {resume.awards.map((award, index) => (
          <div className="item-card compact" key={award.id}>
            <div className="card-actions">
              <strong>{award.title || copy.editor.awardFallback}</strong>
              <button
                className="link-button"
                onClick={() => setResume({ ...resume, awards: resume.awards.filter((_, itemIndex) => itemIndex !== index) })}
                type="button"
              >
                {copy.buttons.delete}
              </button>
            </div>
            <div className="field-grid">
              <Field copy={copy} label={copy.editor.awardTitle} onChange={(value) => updateAward(index, { title: value })} richText value={award.title} />
              <Field copy={copy} label={copy.editor.awardIssuer} onChange={(value) => updateAward(index, { issuer: value })} richText value={award.issuer} />
              <Field label={copy.editor.awardDate} onChange={(value) => updateAward(index, { date: value })} value={award.date} />
            </div>
          </div>
        ))}
      </div>
      <button
        className="button secondary wide"
        onClick={() =>
          setResume({
            ...resume,
            awards: [...resume.awards, { id: createId("award"), title: copy.editor.newAwardTitle, issuer: copy.editor.newAwardIssuer, date: "" }]
          })
        }
        type="button"
      >
        {copy.editor.addAward}
      </button>
    </EditorSection>
  );
}

function SourceEditor({
  copy,
  sourceTex,
  onUpdate,
  onReset
}: {
  copy: BuilderCopy;
  sourceTex: string;
  onUpdate: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <EditorSection title={copy.editor.source}>
      <textarea className="source-editor" onChange={(event) => onUpdate(event.target.value)} spellCheck={false} value={sourceTex} />
      <button className="button secondary wide" onClick={onReset} type="button">
        {copy.buttons.resetSource}
      </button>
    </EditorSection>
  );
}
