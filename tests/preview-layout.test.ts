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

    expect(globalCss).toContain('font-family: "Songti SC", "Noto Serif CJK SC", "Times New Roman", serif;');
    expect(htmlPdfSource).not.toContain("font-size: 16px !important");
    expect(htmlPdfSource).not.toContain("line-height: 1.42 !important");
  });

  it("renders default basic field marks as built-in icons", () => {
    const previewSource = readFileSync("src/components/resume-preview.tsx", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(previewSource).toContain("basic-field-icon");
    expect(globalCss).toContain(".basic-field-icon.icon-email");
    expect(globalCss).toContain(".basic-field-icon.icon-location");
  });

  it("exposes inline format controls and preview styles", () => {
    const builderSource = readFileSync("src/components/resume-builder.tsx", "utf-8");
    const previewSource = readFileSync("src/components/resume-preview.tsx", "utf-8");
    const globalCss = readFileSync("src/app/globals.css", "utf-8");

    expect(builderSource).toContain("inline-format-toolbar");
    expect(previewSource).toContain("parseInlineFormat");
    expect(globalCss).toContain(".inline-format.underline.strike");
  });
});
