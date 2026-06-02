import type { TemplateId, TemplateMeta, TemplatePackage } from "@/types/resume";

export const templatePackages: TemplatePackage[] = [
  {
    version: "1.0.0",
    tags: ["tech", "compact", "projects"],
    meta: {
      id: "modern-tech",
      name: "Modern Tech",
      category: "技术岗",
      language: "zh-CN",
      engine: "xelatex",
      layout: "compact",
      accentColor: "#0f766e",
      description: "紧凑的技术简历，强调项目、技能和量化结果。",
      supports: {
        chinese: true,
        atsMode: false,
        avatar: false
      }
    },
    components: commonComponents("modern-tech")
  },
  {
    version: "1.0.0",
    tags: ["academic", "cv", "clean"],
    meta: {
      id: "academic-clean",
      name: "Academic Clean",
      category: "科研/留学",
      language: "zh-CN",
      engine: "xelatex",
      layout: "classic",
      accentColor: "#9f1239",
      description: "偏学术 CV 的清晰版式，适合教育、项目和奖项。",
      supports: {
        chinese: true,
        atsMode: false,
        avatar: false
      }
    },
    components: commonComponents("academic-clean")
  },
  {
    version: "1.0.0",
    tags: ["ats", "plain", "single-column"],
    meta: {
      id: "ats-classic",
      name: "ATS Classic",
      category: "通用 ATS",
      language: "zh-CN",
      engine: "xelatex",
      layout: "ats",
      accentColor: "#3f3f46",
      description: "单栏、少装饰、文本优先，适合招聘系统解析。",
      supports: {
        chinese: true,
        atsMode: true,
        avatar: false
      }
    },
    components: commonComponents("ats-classic")
  },
  {
    version: "1.0.0",
    tags: ["ecommerce", "operations", "campus", "replica"],
    meta: {
      id: "cross-border-ecommerce",
      name: "跨境电商运营",
      category: "电商/运营",
      language: "zh-CN",
      engine: "xelatex",
      layout: "operation",
      accentColor: "#003B66",
      description: "复刻用户提供的蓝色标题简历版式，适合应届生、电商运营、新媒体运营。",
      supports: {
        chinese: true,
        atsMode: false,
        avatar: false
      }
    },
    components: operationComponents("cross-border-ecommerce")
  },
  {
    version: "1.0.0",
    tags: ["campus", "operations", "internship"],
    meta: {
      id: "campus-operations",
      name: "应届运营通用",
      category: "应届/运营",
      language: "zh-CN",
      engine: "xelatex",
      layout: "operation",
      accentColor: "#1d4ed8",
      description: "面向应届生运营岗位，突出校园经历、实习实践和工具能力。",
      supports: {
        chinese: true,
        atsMode: false,
        avatar: false
      }
    },
    components: operationComponents("campus-operations")
  },
  {
    version: "1.0.0",
    tags: ["marketing", "product", "content"],
    meta: {
      id: "product-marketing",
      name: "产品市场推广",
      category: "市场/推广",
      language: "zh-CN",
      engine: "xelatex",
      layout: "classic",
      accentColor: "#7c2d12",
      description: "适合市场推广、内容运营、产品助理，强调活动执行和传播效果。",
      supports: {
        chinese: true,
        atsMode: false,
        avatar: false
      }
    },
    components: commonComponents("product-marketing")
  }
];

export const templates: TemplateMeta[] = templatePackages.map((templatePackage) => templatePackage.meta);

export function getTemplate(id: TemplateId): TemplateMeta {
  return templates.find((template) => template.id === id) ?? templates[0];
}

export function getTemplatePackage(id: TemplateId): TemplatePackage {
  return templatePackages.find((templatePackage) => templatePackage.meta.id === id) ?? templatePackages[0];
}

function commonComponents(templateId: TemplateId) {
  return [
    {
      id: `${templateId}-preamble`,
      name: "基础导言区",
      kind: "preamble" as const,
      description: "字体、页边距、颜色和列表设置。",
      tex: "\\usepackage{fontspec}\\n\\usepackage{xeCJK}\\n\\usepackage{xcolor}\\n\\usepackage{enumitem}"
    },
    {
      id: `${templateId}-header`,
      name: "居中姓名抬头",
      kind: "header" as const,
      description: "姓名、目标职位和联系方式。",
      tex: "\\begin{center}{\\LARGE\\textbf{姓名}}\\\\\\n{职位}\\\\\\n{联系方式}\\end{center}"
    },
    {
      id: `${templateId}-entry`,
      name: "左右时间轴条目",
      kind: "entry" as const,
      description: "左侧机构与职位，右侧时间地点。",
      tex: "\\newcommand{\\resumeEntry}[3]{\\textbf{#1}\\hfill {\\small #3}\\\\{\\small #2}}"
    },
    {
      id: `${templateId}-bullets`,
      name: "紧凑要点列表",
      kind: "bullets" as const,
      description: "用于经历、项目和奖项说明。",
      tex: "\\begin{itemize}[leftmargin=*, itemsep=1pt]\\item ...\\end{itemize}"
    }
  ];
}

function operationComponents(templateId: TemplateId) {
  return [
    {
      id: `${templateId}-preamble`,
      name: "蓝色运营模板导言区",
      kind: "preamble" as const,
      description: "宋体/Times 风格、蓝色标题、细分割线。",
      tex: "\\usepackage{fontspec}\\n\\usepackage{xeCJK}\\n\\usepackage{xcolor}\\n\\usepackage{fontawesome5}"
    },
    {
      id: `${templateId}-header`,
      name: "应届生居中抬头",
      kind: "header" as const,
      description: "姓名、毕业年份、求职方向和三段联系方式。",
      tex: "{\\fontsize{22pt}{28pt}\\selectfont\\bfseries\\color{resumeBlue}姓名}\\par\\n求职方向：跨境电商运营"
    },
    {
      id: `${templateId}-section`,
      name: "蓝色分割线章节",
      kind: "section" as const,
      description: "章节标题为深蓝色，下方浅色横线。",
      tex: "\\newcommand{\\sectionTitle}[1]{{\\large\\bfseries\\color{resumeBlue}#1}\\par\\hrule}"
    },
    {
      id: `${templateId}-entry`,
      name: "运营经历条目",
      kind: "entry" as const,
      description: "公司/项目、说明、时间和补充信息两行排版。",
      tex: "\\newcommand{\\entry}[4]{\\begin{tabularx}{\\textwidth}{X r}#1 & #3\\\\#2 & #4\\end{tabularx}}"
    },
    {
      id: `${templateId}-skills`,
      name: "分组技能",
      kind: "skills" as const,
      description: "平台运营、AI 工具、PS 与办公能力等分组。",
      tex: "\\textbf{平台与运营能力}\\n\\begin{itemize}\\item ...\\end{itemize}"
    }
  ];
}
