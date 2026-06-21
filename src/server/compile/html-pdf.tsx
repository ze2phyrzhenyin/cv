import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright-core";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ResumePreview } from "../../components/resume-preview";
import { getTemplate } from "../../lib/templates";
import type { CompileJobRecord } from "./types";

const pdfWidthPx = 820;
const pdfHeightPx = 1159.7;

export async function renderResumePdf(job: CompileJobRecord, outputPdf: string, workspace: string): Promise<string> {
  const executablePath = await findChromiumExecutable();
  const css = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf-8");
  const template = getTemplate(job.templateId);
  const previewMarkup = renderToStaticMarkup(React.createElement(ResumePreview, { resume: job.resume, template }));
  const html = renderHtml(previewMarkup, css);

  await writeFile(path.join(workspace, "preview.html"), html, "utf-8");

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"]
  });

  try {
    const page = await browser.newPage({ viewport: { width: pdfWidthPx, height: Math.ceil(pdfHeightPx) } });
    await page.emulateMedia({ media: "screen" });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: outputPdf,
      width: `${pdfWidthPx}px`,
      height: `${pdfHeightPx}px`,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      printBackground: true,
      preferCSSPageSize: true
    });
  } finally {
    await browser.close();
  }

  return `HTML preview rendered to PDF with Chromium at ${executablePath}.`;
}

async function findChromiumExecutable(): Promise<string> {
  const candidates = [
    process.env.RESUME_TEX_CHROMIUM_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/lib64/chromium-browser/headless_shell"
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Keep trying known system paths.
    }
  }

  throw new Error("Chromium executable not found.");
}

function renderHtml(previewMarkup: string, css: string): string {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <style>
${css}

@page {
  size: ${pdfWidthPx}px ${pdfHeightPx}px;
  margin: 0;
}

html,
body {
  background: #ffffff;
  margin: 0;
  min-height: ${pdfHeightPx}px;
  width: ${pdfWidthPx}px;
}

body {
  display: block;
}

.resume-page {
  aspect-ratio: auto !important;
  box-shadow: none !important;
  max-width: none !important;
  min-height: ${pdfHeightPx}px;
  overflow: visible !important;
  width: ${pdfWidthPx}px !important;
}
    </style>
  </head>
  <body>${previewMarkup}</body>
</html>`;
}
