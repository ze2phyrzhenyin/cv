import { describe, expect, it } from "vitest";

import { sampleResume, sampleResumes } from "../src/lib/fixtures";
import { escapeLatex, generateLatex } from "../src/lib/latex";
import { getTemplate } from "../src/lib/templates";
import { normalizeResumeLanguage } from "../src/lib/resume-language";

describe("escapeLatex", () => {
  it("escapes LaTeX special characters without corrupting inserted commands", () => {
    expect(escapeLatex("C++ & Python_Dev 50% $x {a} ~ ^ \\")).toBe(
      String.raw`C++ \& Python\_Dev 50\% \$x \{a\} \textasciitilde{} \textasciicircum{} \textbackslash{}`
    );
  });
});

describe("generateLatex", () => {
  it("renders a complete xelatex document from resume json", () => {
    const tex = generateLatex(sampleResume, getTemplate("unified-cv"));

    expect(tex).toContain("\\documentclass[11pt,a4paper]{article}");
    expect(tex).toContain("\\usepackage{fontspec}");
    expect(tex).toContain("\\usepackage[normalem]{ulem}");
    expect(tex).toContain("\\setmainfont{Songti SC}");
    expect(tex).toContain("{\\Huge\\bfseries\\color{ResumeAccent}Zhaoyang SUI}");
    expect(tex).toContain("\\textbf{mail} zhaoyang.sui@ut-capitole.fr");
    expect(tex).toContain("\\textcolor{black!45}{|}");
    expect(tex).toContain("\\hrule height 0.8pt");
    expect(tex).toContain("\\XeTeXlinebreaklocale \"zh\"");
    expect(tex).toContain("\\resumeSection{工作经历}");
    expect(tex).toContain("\\resumeSection{学术经历}");
    expect(tex).toContain("\\begin{itemize}[leftmargin=*, label={-}");
    expect(tex).toContain("Zhaoyang SUI 等");
    expect(tex).toContain("已发表会议论文");
    expect(tex).toContain("大语言模型微调编程");
    expect(tex).toContain("P-Tuning v2");
  });

  it("renders language-specific section headings for English and French resumes", () => {
    const englishTex = generateLatex(sampleResumes.en, getTemplate("unified-cv"));
    const frenchTex = generateLatex(sampleResumes.fr, getTemplate("unified-cv"));

    expect(englishTex).toContain("\\resumeSection{Work Experience}");
    expect(englishTex).toContain("\\resumeSection{Academic Experience}");
    expect(englishTex).toContain("MIAGE Master's Preparatory Year Student");
    expect(englishTex).toContain("Published conference paper");
    expect(frenchTex).toContain("\\resumeSection{Expérience professionnelle}");
    expect(frenchTex).toContain("\\resumeSection{Expérience académique}");
    expect(frenchTex).toContain("Étudiant en année préparatoire Master MIAGE");
    expect(frenchTex).toContain("Article de conférence publié");
  });

  it("honors custom accent color, basic fields, and section order", () => {
    const tex = generateLatex(
      normalizeResumeLanguage({
        ...sampleResumes.en,
        theme: { accentColor: "#ff5500" },
        basicFields: [
          { id: "name", key: "name", label: "Legal Name", value: "Foo_Bar" },
          { id: "portfolio", label: "Portfolio", value: "https://example.com/cv" }
        ],
        sections: [
          { id: "projects", title: "Case Studies", visible: true },
          { id: "basics", title: "Identity", visible: true },
          { id: "summary", title: "About", visible: true }
        ]
      }),
      getTemplate("unified-cv")
    );

    expect(tex).toContain("\\definecolor{ResumeAccent}{HTML}{ff5500}");
    expect(tex.indexOf("\\resumeSection{Case Studies}")).toBeLessThan(tex.indexOf("Foo\\_Bar"));
    expect(tex).toContain("Foo\\_Bar");
    expect(tex).toContain("\\textbf{Portfolio} https://example.com/cv");
    expect(tex).not.toContain("Email:");
  });

  it("renders customizable basic field placement and label marks", () => {
    const tex = generateLatex(
      normalizeResumeLanguage({
        ...sampleResume,
        basicFields: [
          { id: "name", key: "name", label: "姓名", value: "张三", placement: "name", labelMode: "none" },
          { id: "age", label: "年龄", value: "26", placement: "headline", labelMode: "text" },
          { id: "email", key: "email", label: "邮箱", value: "zhangsan@example.com", placement: "contact", labelMode: "mark", labelIcon: "email" },
          { id: "phone", key: "phone", label: "电话", value: "+86 138 0000 0000", placement: "contact", labelMode: "none" },
          { id: "hidden", label: "Hidden", value: "secret", placement: "hidden", labelMode: "text" }
        ]
      }),
      getTemplate("unified-cv")
    );

    expect(tex).toContain("\\textbf{年龄} 26");
    expect(tex).toContain("\\textbf{mail} zhangsan@example.com");
    expect(tex).toContain("+86 138 0000 0000");
    expect(tex).not.toContain("\\textbf{电话} +86");
    expect(tex).not.toContain("secret");
  });

  it("escapes user supplied content in generated sections", () => {
    const tex = generateLatex(
      {
        ...sampleResume,
        sections: sampleResume.sections.map((section) => (section.id === "summary" ? { ...section, visible: true } : section)),
        basicFields: sampleResume.basicFields.map((field) => (field.key === "name" ? { ...field, value: "Foo_Bar" } : field)),
        summary: "R&D achieved 50% uptime gain"
      },
      getTemplate("unified-cv")
    );

    expect(tex).toContain("Foo\\_Bar");
    expect(tex).toContain("R\\&D achieved 50\\% uptime gain");
  });

  it("renders inline formatting markers as LaTeX commands", () => {
    const tex = generateLatex(
      {
        ...sampleResume,
        sections: sampleResume.sections.map((section) => (section.id === "summary" ? { ...section, visible: true } : section)),
        summary: "Built [[b]]fast[[/b]], [[i]]typed[[/i]], [[u]]stable[[/u]], and [[s]]legacy[[/s]] APIs",
        experience: [
          {
            ...sampleResume.experience[0],
            highlights: ["Reduced [[b]]P95 latency[[/b]] while keeping R&D cost under 50%."]
          }
        ]
      },
      getTemplate("unified-cv")
    );

    expect(tex).toContain("\\textbf{fast}");
    expect(tex).toContain("\\textit{typed}");
    expect(tex).toContain("\\uline{stable}");
    expect(tex).toContain("\\sout{legacy}");
    expect(tex).toContain("\\textbf{P95 latency}");
    expect(tex).toContain("R\\&D cost under 50\\%.");
  });
});
