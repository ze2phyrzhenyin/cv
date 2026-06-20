import type { TemplateId, TemplateMeta, TemplatePackage } from "@/types/resume";

export const unifiedTemplateId = "unified-cv" satisfies TemplateId;

export const templatePackages: TemplatePackage[] = [
  {
    version: "1.0.0",
    tags: ["cv", "latex", "unified"],
    meta: {
      id: unifiedTemplateId,
      name: "CV 版式",
      category: "统一版式",
      language: "zh-CN",
      engine: "xelatex",
      layout: "unified",
      accentColor: "#0f766e",
      description: "单一、可自定义的 CV 版式，支持三语内容、主题色、章节和基本信息字段配置。",
      supports: {
        chinese: true,
        avatar: false
      }
    },
    components: unifiedComponents(unifiedTemplateId)
  }
];

export const templates: TemplateMeta[] = templatePackages.map((templatePackage) => templatePackage.meta);

export function normalizeTemplateId(_id: unknown): TemplateId {
  return unifiedTemplateId;
}

export function getTemplate(id: unknown): TemplateMeta {
  const normalizedId = normalizeTemplateId(id);
  return templates.find((template) => template.id === normalizedId) ?? templates[0];
}

export function getTemplatePackage(id: unknown): TemplatePackage {
  const normalizedId = normalizeTemplateId(id);
  return templatePackages.find((templatePackage) => templatePackage.meta.id === normalizedId) ?? templatePackages[0];
}

function unifiedComponents(templateId: TemplateId) {
  return [
    {
      id: `${templateId}-preamble`,
      name: "统一导言区",
      kind: "preamble" as const,
      description: "字体、页边距、颜色、链接、列表和内联文字格式设置。",
      tex: "\\usepackage{fontspec}\\n\\IfFontExistsTF{Songti SC}{\\setmainfont{Songti SC}}{...}\\n\\usepackage{xcolor}\\n\\usepackage{enumitem}\\n\\usepackage[normalem]{ulem}\\n\\usepackage[hidelinks]{hyperref}"
    },
    {
      id: `${templateId}-header`,
      name: "CV 开头",
      kind: "header" as const,
      description: "章节标签、姓名、目标标题、基本信息字段和强调分割线。",
      tex: "{\\small\\bfseries\\color{ResumeAccent}基本信息}\\\\\\n{\\Huge\\textbf{姓名}}\\\\\\n{职位}\\\\\\n\\rule{\\textwidth}{1.1pt}"
    },
    {
      id: `${templateId}-entry`,
      name: "时间轴条目",
      kind: "entry" as const,
      description: "左侧机构与职位，右侧时间地点。",
      tex: "\\newcommand{\\resumeEntry}[3]{\\textbf{#1}\\hfill {\\small #3}\\\\{\\small #2}}"
    },
    {
      id: `${templateId}-bullets`,
      name: "短横线要点列表",
      kind: "bullets" as const,
      description: "用于经历、项目和奖项说明。",
      tex: "\\begin{itemize}[leftmargin=*, label={-}, itemsep=1pt]\\item ...\\end{itemize}"
    }
  ];
}
