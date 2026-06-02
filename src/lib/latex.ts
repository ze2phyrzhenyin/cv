import type { ProjectItem, ResumeData, TemplateMeta, TimelineItem } from "@/types/resume";

const latexEscapeMap: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  "$": "\\$",
  "&": "\\&",
  "#": "\\#",
  "_": "\\_",
  "%": "\\%",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}"
};

export function escapeLatex(input: string): string {
  return input.replace(/[\\{}$&#_%~^]/g, (char) => latexEscapeMap[char] ?? char);
}

function cleanLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function joinContact(items: string[]): string {
  return cleanLines(items).map(escapeLatex).join(" $\\cdot$ ");
}

function renderHighlights(highlights: string[]): string {
  const lines = cleanLines(highlights);
  if (lines.length === 0) {
    return "";
  }

  return [
    "\\begin{itemize}[leftmargin=*, itemsep=1pt, topsep=2pt]",
    ...lines.map((line) => `  \\item ${escapeLatex(line)}`),
    "\\end{itemize}"
  ].join("\n");
}

function renderTimeline(items: TimelineItem[]): string {
  return items
    .map((item) => {
      const dates = cleanLines([item.startDate, item.endDate]).join(" -- ");
      const meta = cleanLines([dates, item.location]).map(escapeLatex).join(" \\quad ");
      return [
        `\\resumeEntry{${escapeLatex(item.organization)}}{${escapeLatex(item.role)}}{${meta}}`,
        renderHighlights(item.highlights)
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function renderProjects(items: ProjectItem[]): string {
  return items
    .map((item) => {
      const meta = cleanLines([item.role, item.techStack, item.url]).map(escapeLatex).join(" \\quad ");
      return [
        `\\resumeEntry{${escapeLatex(item.name)}}{${meta}}{}`,
        renderHighlights(item.highlights)
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function renderSection(title: string, body: string): string {
  if (!body.trim()) {
    return "";
  }

  return [`\\section*{${escapeLatex(title)}}`, body].join("\n");
}

function accentDefinition(template: TemplateMeta): string {
  return `\\definecolor{ResumeAccent}{HTML}{${template.accentColor.replace("#", "")}}`;
}

export function generateLatex(resume: ResumeData, template: TemplateMeta): string {
  if (template.layout === "operation") {
    return generateOperationLatex(resume, template);
  }

  const contact = joinContact([
    resume.basics.email,
    resume.basics.phone,
    resume.basics.location,
    resume.basics.website,
    resume.basics.github,
    resume.basics.linkedin
  ]);
  const skillLines = resume.skills
    .filter((group) => group.category.trim() || group.items.some(Boolean))
    .map((group) => {
      const items = cleanLines(group.items).map(escapeLatex).join(", ");
      return `\\textbf{${escapeLatex(group.category)}}: ${items}\\\\`;
    })
    .join("\n");
  const awardLines = resume.awards
    .map((award) => {
      const meta = cleanLines([award.issuer, award.date]).map(escapeLatex).join(" \\quad ");
      return `\\resumeEntry{${escapeLatex(award.title)}}{${meta}}{}`;
    })
    .join("\n");
  const headerRule = template.id === "ats-classic" ? "\\vspace{2pt}\\hrule\\vspace{6pt}" : "\\color{ResumeAccent}\\rule{\\textwidth}{1.2pt}\\color{black}";

  return [
    "\\documentclass[10pt,a4paper]{article}",
    "\\usepackage[margin=1.35cm]{geometry}",
    "\\usepackage{fontspec}",
    "\\usepackage{xeCJK}",
    "\\usepackage{xcolor}",
    "\\usepackage{enumitem}",
    "\\usepackage[hidelinks]{hyperref}",
    "\\IfFontExistsTF{TeX Gyre Heros}{\\setmainfont{TeX Gyre Heros}}{\\setmainfont{Helvetica}}",
    "\\IfFontExistsTF{Noto Sans CJK SC}{\\setCJKmainfont{Noto Sans CJK SC}}{\\IfFontExistsTF{PingFang SC}{\\setCJKmainfont{PingFang SC}}{\\setCJKmainfont{FandolSong-Regular}}}",
    "\\pagestyle{empty}",
    "\\setlength{\\parindent}{0pt}",
    "\\setlist[itemize]{noitemsep}",
    accentDefinition(template),
    "\\newcommand{\\resumeEntry}[3]{%",
    "  \\textbf{#1}\\hfill {\\small #3}\\\\",
    "  {\\small #2}\\vspace{2pt}",
    "}",
    "\\begin{document}",
    `\\begin{center}{\\LARGE\\textbf{${escapeLatex(resume.basics.name)}}}\\\\`,
    `\\vspace{3pt}{\\large ${escapeLatex(resume.basics.title)}}\\\\`,
    `\\vspace{3pt}{\\small ${contact}}\\end{center}`,
    headerRule,
    renderSection("个人简介", escapeLatex(resume.summary)),
    renderSection("工作经历", renderTimeline(resume.experience)),
    renderSection("项目经历", renderProjects(resume.projects)),
    renderSection("教育经历", renderTimeline(resume.education)),
    renderSection("技能", skillLines),
    renderSection("奖项", awardLines),
    "\\end{document}"
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n\n");
}

function generateOperationLatex(resume: ResumeData, template: TemplateMeta): string {
  const contactParts = [
    ["\\faMapMarker*", resume.basics.location || "现居地待填写"],
    ["\\faPhone*", resume.basics.phone || "电话待填写"],
    ["\\faEnvelope", resume.basics.email || "邮箱待填写"]
  ];
  const education = renderOperationTimeline(resume.education);
  const practice = [renderOperationTimeline(resume.experience), renderOperationProjects(resume.projects)].filter(Boolean).join("\n\n\\vspace{3pt}\n");
  const skills = renderOperationSkills(resume);
  const awards = resume.awards
    .map((award) => {
      const meta = cleanLines([award.issuer, award.date]).map(escapeLatex).join(" \\quad ");
      return `\\entry{${escapeLatex(award.title)}}{${meta}}{}{}`
    })
    .join("\n");

  return [
    "\\documentclass[10pt,a4paper]{article}",
    "\\usepackage[margin=20mm, top=16mm, bottom=14mm]{geometry}",
    "\\usepackage{fontspec}",
    "\\usepackage{xeCJK}",
    "\\usepackage{xcolor}",
    "\\usepackage{enumitem}",
    "\\usepackage{tabularx}",
    "\\usepackage{fontawesome5}",
    "\\usepackage[hidelinks]{hyperref}",
    "\\IfFontExistsTF{Times New Roman}{\\setmainfont{Times New Roman}}{\\setmainfont{TeX Gyre Termes}}",
    "\\IfFontExistsTF{Songti SC}{\\setCJKmainfont{Songti SC}}{\\IfFontExistsTF{Noto Serif CJK SC}{\\setCJKmainfont{Noto Serif CJK SC}}{\\setCJKmainfont{FandolSong-Regular}}}",
    `\\definecolor{resumeBlue}{HTML}{${template.accentColor.replace("#", "")}}`,
    "\\definecolor{resumeMuted}{HTML}{58718C}",
    "\\definecolor{resumeRule}{HTML}{D8E1EA}",
    "\\pagestyle{empty}",
    "\\setlength{\\parindent}{0pt}",
    "\\setlength{\\tabcolsep}{0pt}",
    "\\linespread{1.08}",
    "\\newcommand{\\sectionTitle}[1]{%",
    "  \\vspace{12pt}",
    "  {\\large\\bfseries\\color{resumeBlue}#1}\\par",
    "  \\vspace{5pt}",
    "  {\\color{resumeRule}\\hrule height 0.7pt}",
    "  \\vspace{6pt}",
    "}",
    "\\newcommand{\\entry}[4]{%",
    "  \\begin{tabularx}{\\textwidth}{@{}X r@{}}",
    "    {\\bfseries #1} & {\\color{resumeMuted}#3} \\\\",
    "    {\\color{resumeMuted}#2} & {\\color{resumeMuted}#4}",
    "  \\end{tabularx}",
    "  \\vspace{4pt}",
    "}",
    "\\newlist{resumeBullets}{itemize}{1}",
    "\\setlist[resumeBullets]{leftmargin=2.1em, label={\\color{resumeMuted}—}, itemsep=2pt, topsep=1pt, parsep=0pt}",
    "\\begin{document}",
    "\\begin{center}",
    `  {\\fontsize{22pt}{28pt}\\selectfont\\bfseries\\color{resumeBlue}${escapeLatex(resume.basics.name || "姓名待填写")}}\\par`,
    "  \\vspace{6pt}",
    `  {\\large ${escapeLatex(resume.basics.title || "2026 届应届毕业生 / 求职方向：跨境电商运营")}}\\par`,
    "  \\vspace{10pt}",
    `  {${contactParts.map(([icon, value]) => `${icon} \\ ${escapeLatex(value)}`).join(" \\qquad ")}}`,
    "\\end{center}",
    renderOperationSection("教育背景", education),
    renderOperationSection("实践经历", practice),
    renderOperationSection("技能", skills),
    renderOperationSection("奖项", awards),
    "\\end{document}"
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n\n");
}

function renderOperationSection(title: string, body: string): string {
  if (!body.trim()) {
    return "";
  }
  return [`\\sectionTitle{${escapeLatex(title)}}`, body].join("\n\n");
}

function renderOperationTimeline(items: TimelineItem[]): string {
  return items
    .map((item) => {
      const dates = cleanLines([item.startDate, item.endDate]).join(" -- ");
      return [
        `\\entry{${escapeLatex(item.role)}}{${escapeLatex(item.organization)}}{${escapeLatex(dates)}}{${escapeLatex(item.location)}}`,
        renderOperationHighlights(item.highlights)
      ].join("\n");
    })
    .join("\n\n\\vspace{3pt}\n");
}

function renderOperationProjects(items: ProjectItem[]): string {
  return items
    .map((item) => {
      const meta = cleanLines([item.role, item.techStack]).join(" / ");
      return [
        `\\entry{${escapeLatex(item.name)}}{${escapeLatex(meta)}}{${escapeLatex(item.url)}}{}`,
        renderOperationHighlights(item.highlights)
      ].join("\n");
    })
    .join("\n\n\\vspace{3pt}\n");
}

function renderOperationHighlights(highlights: string[]): string {
  const lines = cleanLines(highlights);
  if (lines.length === 0) {
    return "";
  }
  return [
    "\\begin{resumeBullets}",
    ...lines.map((line) => `  \\item ${escapeLatex(line)}`),
    "\\end{resumeBullets}"
  ].join("\n");
}

function renderOperationSkills(resume: ResumeData): string {
  return resume.skills
    .filter((group) => group.category.trim() || group.items.some(Boolean))
    .map((group) =>
      [
        `{\\bfseries ${escapeLatex(group.category)}}`,
        "\\begin{resumeBullets}",
        ...cleanLines(group.items).map((item) => `  \\item ${escapeLatex(item)}`),
        "\\end{resumeBullets}"
      ].join("\n")
    )
    .join("\n\n\\vspace{2pt}\n");
}
