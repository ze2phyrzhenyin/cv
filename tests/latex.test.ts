import { describe, expect, it } from "vitest";

import { sampleResume } from "../src/lib/fixtures";
import { escapeLatex, generateLatex } from "../src/lib/latex";
import { getTemplate } from "../src/lib/templates";

describe("escapeLatex", () => {
  it("escapes LaTeX special characters without corrupting inserted commands", () => {
    expect(escapeLatex("C++ & Python_Dev 50% $x {a} ~ ^ \\")).toBe(
      String.raw`C++ \& Python\_Dev 50\% \$x \{a\} \textasciitilde{} \textasciicircum{} \textbackslash{}`
    );
  });
});

describe("generateLatex", () => {
  it("renders a complete xelatex document from resume json", () => {
    const tex = generateLatex(sampleResume, getTemplate("modern-tech"));

    expect(tex).toContain("\\documentclass");
    expect(tex).toContain("\\usepackage{xeCJK}");
    expect(tex).toContain("\\section*{工作经历}");
    expect(tex).toContain("PostgreSQL");
  });

  it("renders the cross-border ecommerce template as a one-page style source", () => {
    const tex = generateLatex(sampleResume, getTemplate("cross-border-ecommerce"));

    expect(tex).toContain("\\definecolor{resumeBlue}");
    expect(tex).toContain("\\sectionTitle{实践经历}");
    expect(tex).toContain("\\begin{resumeBullets}");
  });

  it("escapes user supplied content in generated sections", () => {
    const tex = generateLatex(
      {
        ...sampleResume,
        basics: { ...sampleResume.basics, name: "Foo_Bar" },
        summary: "R&D achieved 50% uptime gain"
      },
      getTemplate("ats-classic")
    );

    expect(tex).toContain("Foo\\_Bar");
    expect(tex).toContain("R\\&D achieved 50\\% uptime gain");
  });
});
