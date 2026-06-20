import type { AcademicItem, BasicField, ProjectItem, ResumeData, ResumeSectionId, TemplateMeta, TimelineItem } from "@/types/resume";
import { parseInlineFormat } from "./inline-format";
import type { InlineFormat } from "./inline-format";
import { getBasicFieldLabelText, getBasicFieldPlacement, getResumeAccentColor, normalizeResumeLanguage } from "./resume-language";

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

export function escapeLatex(input: string | null | undefined): string {
  return (input ?? "").replace(/[\\{}$&#_%~^]/g, (char) => latexEscapeMap[char] ?? char);
}

function cleanLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function chunkFields(fields: BasicField[]): BasicField[][] {
  if (fields.length <= 3) {
    return [fields];
  }

  const rows = [fields.slice(0, 3)];
  for (let index = 3; index < fields.length; index += 2) {
    rows.push(fields.slice(index, index + 2));
  }
  return rows;
}

function renderHighlights(highlights: string[]): string {
  const lines = cleanLines(highlights);
  if (lines.length === 0) {
    return "";
  }

  return [
    "\\begin{itemize}[leftmargin=*, label={-}, itemsep=2pt, topsep=2pt]",
    ...lines.map((line) => `  \\item ${renderInlineLatex(line)}`),
    "\\end{itemize}"
  ].join("\n");
}

function renderTimeline(items: TimelineItem[]): string {
  return items
    .map((item) => {
      const dates = cleanLines([item.startDate, item.endDate]).join(" -- ");
      const meta = cleanLines([dates, item.location]).map(renderInlineLatex).join(" \\quad ");
      return [
        `\\resumeEntry{${renderInlineLatex(item.organization)}}{${renderInlineLatex(item.role)}}{${meta}}`,
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
      const meta = cleanLines([item.role, item.techStack]).map(renderInlineLatex).join(" \\quad ");
      return [
        `\\resumeEntry{${renderInlineLatex(item.name)}}{${meta}}{${renderInlineLatex(item.url)}}`,
        renderHighlights(item.highlights)
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function formatDoi(doi: string): string {
  const value = doi.trim();
  return value ? `DOI: ${value}` : "";
}

function renderAcademic(items: AcademicItem[]): string {
  return items
    .map((item) => {
      const meta = cleanLines([item.authors, item.venue, item.publicationStatus, item.contribution]).map(renderInlineLatex).join(" \\quad ");
      const side = cleanLines([item.date, formatDoi(item.doi), item.url]).map(renderInlineLatex).join(" \\quad ");
      return [
        `\\resumeEntry{${renderInlineLatex(item.title)}}{${meta}}{${side}}`,
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

  return [`\\resumeSection{${escapeLatex(title)}}`, body].join("\n");
}

function accentDefinition(resume: ResumeData, template: TemplateMeta): string {
  return `\\definecolor{ResumeAccent}{HTML}{${getResumeAccentColor(resume, template).replace("#", "")}}`;
}

export function generateLatex(resume: ResumeData, template: TemplateMeta): string {
  const data = normalizeResumeLanguage(resume);

  const skillLines = data.skills
    .filter((group) => group.category.trim() || group.items.some(Boolean))
    .map((group) => {
      const items = cleanLines(group.items).map(renderInlineLatex).join(", ");
      return `\\textbf{${renderInlineLatex(group.category)}}: ${items}\\\\`;
    })
    .join("\n");
  const awardLines = data.awards
    .map((award) => {
      const meta = cleanLines([award.issuer, award.date]).map(renderInlineLatex).join(" \\quad ");
      return `\\resumeEntry{${renderInlineLatex(award.title)}}{${meta}}{}`;
    })
    .join("\n");
  const sectionBodies: Record<ResumeSectionId, string> = {
    basics: "",
    summary: renderInlineLatex(data.summary),
    experience: renderTimeline(data.experience),
    academic: renderAcademic(data.academic),
    projects: renderProjects(data.projects),
    education: renderTimeline(data.education),
    skillsAwards: [skillLines, awardLines].filter(Boolean).join("\n\n")
  };
  const sections = data.sections
    .filter((section) => section.visible)
    .map((section) => (section.id === "basics" ? renderBasicInfo(data.basicFields) : renderSection(section.title, sectionBodies[section.id])))
    .filter(Boolean);

  return [
    "\\documentclass[11pt,a4paper]{article}",
    "\\usepackage[margin=1.45cm]{geometry}",
    "\\usepackage{fontspec}",
    "\\usepackage{xcolor}",
    "\\usepackage{enumitem}",
    "\\usepackage[normalem]{ulem}",
    "\\usepackage[hidelinks]{hyperref}",
    "\\IfFontExistsTF{Songti SC}{\\setmainfont{Songti SC}}{\\IfFontExistsTF{Noto Serif CJK SC}{\\setmainfont{Noto Serif CJK SC}}{\\IfFontExistsTF{Noto Sans CJK SC}{\\setmainfont{Noto Sans CJK SC}}{\\IfFontExistsTF{FandolSong-Regular}{\\setmainfont{FandolSong-Regular}}{\\setmainfont{TeX Gyre Termes}}}}}",
    "\\pagestyle{empty}",
    "\\setlength{\\parindent}{0pt}",
    "\\setlength{\\parskip}{3pt}",
    "\\setlist[itemize]{noitemsep}",
    "\\XeTeXlinebreaklocale \"zh\"",
    "\\XeTeXlinebreakskip=0pt plus 1pt",
    "\\emergencystretch=2em",
    "\\sloppy",
    accentDefinition(data, template),
    "\\newcommand{\\resumeSection}[1]{%",
    "  \\vspace{7pt}{\\large\\bfseries\\color{ResumeAccent}#1}\\par\\vspace{2pt}{\\color{ResumeAccent!28}\\hrule height 0.4pt}\\vspace{4pt}",
    "}",
    "\\newcommand{\\resumeEntry}[3]{%",
    "  \\textbf{#1}\\hfill {\\small #3}\\\\",
    "  {\\small #2}\\vspace{2pt}",
    "}",
    "\\begin{document}",
    ...sections,
    "\\end{document}"
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n\n");
}

function renderBasicInfo(fields: BasicField[]): string {
  const name = fields.find((field) => getBasicFieldPlacement(field) === "name" && field.value.trim())?.value.trim() ?? "";
  const headlines = fields.filter((field) => getBasicFieldPlacement(field) === "headline" && field.value.trim());
  const details = fields
    .filter((field) => getBasicFieldPlacement(field) === "contact" && field.value.trim());
  const detailRows = chunkFields(details)
    .map((row) =>
      row
        .map(renderInlineBasicField)
        .filter(Boolean)
        .join(" \\quad \\textcolor{black!45}{|} \\quad ")
    )
    .filter(Boolean)
    .join("\\\\[2pt]\n");
  const body = [
    name ? `{\\Huge\\bfseries\\color{ResumeAccent}${renderInlineLatex(name)}}\\\\[-1pt]` : "",
    ...headlines.map((field, index) => {
      const spacing = index === headlines.length - 1 ? "4pt" : "1pt";
      return `{\\large ${renderInlineBasicField(field)}}\\\\[${spacing}]`;
    }),
    detailRows ? `{\\small ${detailRows}}` : ""
  ].filter(Boolean);

  if (body.length === 0) {
    return "";
  }

  return [
    "\\begin{center}",
    ...body,
    "\\end{center}",
    "\\vspace{-2pt}",
    "{\\color{ResumeAccent}\\hrule height 0.8pt}",
    "\\vspace{5pt}"
  ].join("\n");
}

function renderInlineBasicField(field: BasicField): string {
  const label = getBasicFieldLabelText(field);
  const value = renderInlineLatex(field.value.trim());
  if (!value) {
    return "";
  }
  return label ? `\\textbf{${escapeLatex(label)}} ${value}` : value;
}

function renderInlineLatex(value: string): string {
  return parseInlineFormat(value)
    .map((segment) => applyLatexFormats(escapeLatex(segment.text), segment.formats))
    .join("");
}

function applyLatexFormats(value: string, formats: InlineFormat[]): string {
  return [...formats].reverse().reduce((next, format) => {
    switch (format) {
      case "bold":
        return `\\textbf{${next}}`;
      case "italic":
        return `\\textit{${next}}`;
      case "underline":
        return `\\uline{${next}}`;
      case "strike":
        return `\\sout{${next}}`;
    }
  }, value);
}
