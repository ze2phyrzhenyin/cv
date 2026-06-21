import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("preview layout", () => {
  it("does not render a floating draft banner inside the CV paper preview", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(builderSource).not.toContain("preview-banner");
    expect(globalCss).not.toContain("preview-banner");
  });

  it("keeps compile logs out of the visible application shell", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(builderSource).not.toContain("log-panel");
    expect(globalCss).not.toContain("log-panel");
    expect(builderSource).not.toContain("window.print");
  });

  it("keeps draft preview and generated PDF typography on the same stylesheet path", () => {
    const globalCss = readFileSync("src/app/globals.css", "utf-8");
    const htmlPdfSource = readFileSync("src/server/compile/html-pdf.tsx", "utf-8");
    const compilerSource = readFileSync("src/server/compile/compiler.ts", "utf-8");

    expect(globalCss).toContain('font-family: "Songti SC", "Noto Serif CJK SC", "Times New Roman", serif;');
    expect(htmlPdfSource).toContain("ResumePreview");
    expect(htmlPdfSource).toContain("renderToStaticMarkup");
    expect(htmlPdfSource).toContain("overflow: visible !important");
    expect(htmlPdfSource).toContain("aspect-ratio: auto !important");
    expect(compilerSource).toContain('return "browser";');
    expect(htmlPdfSource).not.toContain("font-size: 16px !important");
    expect(htmlPdfSource).not.toContain("line-height: 1.42 !important");
  });

  it("compiles pasted LaTeX source through the LaTeX worker path", () => {
    const compilerSource = readFileSync("src/server/compile/compiler.ts", "utf-8");

    expect(compilerSource).toContain("hasManualLatexSource");
    expect(compilerSource).toContain("normalizeLatexSource(job.sourceTex)");
    expect(compilerSource).toContain('return "local";');
  });

  it("renders default basic field marks as built-in icons", () => {
    const previewSource = readFileSync("src/components/resume-preview.tsx", "utf-8");
    const fixtureSource = readFileSync("src/lib/fixtures.ts", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(previewSource).toContain("react-icons/fa6");
    expect(previewSource).toContain("BASIC_FIELD_ICONS");
    expect(previewSource).toContain("FaCakeCandles");
    expect(previewSource).toContain("FaFlag");
    expect(fixtureSource).toContain('labelIcon: "age"');
    expect(fixtureSource).toContain('labelIcon: "nationality"');
    expect(previewSource).toContain("basic-field-icon");
    expect(globalCss).not.toContain(".basic-field-icon.icon-email::before");
    expect(globalCss).not.toContain(".basic-field-icon.icon-phone::after");
    expect(globalCss).not.toContain(".basic-field-icon.icon-github::before");
  });

  it("exposes inline format controls and preview styles", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const previewSource = readFileSync("src/components/resume-preview.tsx", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(builderSource).toContain("inline-format-toolbar");
    expect(previewSource).toContain("parseInlineFormat");
    expect(globalCss).toContain(".inline-format.underline.strike");
  });

  it("exposes an AI prompt workflow for external LaTeX generation", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const languageSource = readFileSync("src/lib/resume-language.ts", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(builderSource).toContain("buildAiLatexPrompt");
    expect(builderSource).toContain("copyPrompt");
    expect(builderSource).toContain("downloadPrompt");
    expect(builderSource).toContain("document.execCommand(\"copy\")");
    expect(languageSource).toContain("copyPrompt");
    expect(languageSource).toContain("latexSourceHint");
    expect(globalCss).toContain(".source-workflow");
    expect(globalCss).toContain(".prompt-editor");
  });

  it("keeps upgraded sample drafts recoverable without hiding custom drafts", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const languageSource = readFileSync("src/lib/resume-language.ts", "utf-8");

    expect(builderSource).toContain("sampleDraftVersion");
    expect(builderSource).toContain("zhaoyang-academic-v5");
    expect(builderSource).toContain("isLegacyBundledSample");
    expect(builderSource).toContain("draftVersion: sampleDraftVersion");
    expect(builderSource).toContain("resetToSample");
    expect(languageSource).toContain("resetSample");
  });

  it("uses compact academic entries and collapsible editor cards", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const previewSource = readFileSync("src/components/resume-preview.tsx", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(builderSource).toContain("CollapsibleCard");
    expect(builderSource).toContain("collapsible-card");
    expect(previewSource).toContain("academic-entry");
    expect(previewSource).toContain("formatDoi");
    expect(globalCss).toContain(".resume-section.academic-section");
    expect(globalCss).toContain(".academic-entry .entry-head strong");
    expect(globalCss).toContain(".collapsible-card > summary");
  });

  it("keeps the default CV sample within a tighter A4 page and warns on overflow", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const languageSource = readFileSync("src/lib/resume-language.ts", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(builderSource).toContain("pageOverflow");
    expect(builderSource).toContain("paper.scrollHeight - paper.clientHeight");
    expect(builderSource).toContain("MutationObserver");
    expect(builderSource).toContain("draft-page-warning");
    expect(languageSource).toContain("pageOverflowWarning");
    expect(globalCss).toContain("font-size: 15.5px;");
    expect(globalCss).toContain("line-height: 1.38;");
    expect(globalCss).toContain("padding: 40px 48px;");
    expect(globalCss).toContain(".draft-page-warning");
  });

  it("keeps the bundled multilingual sample wording intact", () => {
    const fixtureSource = readFileSync("src/lib/fixtures.ts", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(fixtureSource).toContain("Programmation avec des langages avancés");
    expect(fixtureSource).toContain("Développement d'algorithmes de conversion de formats de fichiers");
    expect(fixtureSource).toContain("负责大语言模型微调相关编程工作。");
    expect(fixtureSource).toContain("Advanced programming: C/C++, Python, Java, R, SQL");
    expect(globalCss).toContain("grid-template-columns: max-content minmax(0, 1fr);");
  });
});
