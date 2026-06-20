"use client";

import { useEffect, useRef, useState } from "react";

type PdfCanvasPreviewProps = {
  title: string;
  url: string;
};

type RenderState = "loading" | "ready" | "failed";
type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
type PdfLoadingTask = ReturnType<PdfJsModule["getDocument"]>;

export function PdfCanvasPreview({ title, url }: PdfCanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderState, setRenderState] = useState<RenderState>("loading");

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PdfLoadingTask | null = null;

    async function renderPdf() {
      setRenderState("loading");

      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl(url);

        loadingTask = pdfjs.getDocument({ url });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;

        if (!canvas || cancelled) {
          await pdf.destroy();
          return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
          await pdf.destroy();
          throw new Error("Canvas context is unavailable.");
        }

        const parentWidth = canvas.parentElement?.clientWidth ?? 820;
        const baseViewport = page.getViewport({ scale: 1 });
        const displayScale = Math.max(0.6, Math.min(1.6, parentWidth / baseViewport.width));
        const viewport = page.getViewport({ scale: displayScale });
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        await page.render({ canvasContext: context, viewport }).promise;
        await pdf.destroy();

        if (!cancelled) {
          setRenderState("ready");
        }
      } catch {
        if (!cancelled) {
          setRenderState("failed");
        }
      }
    }

    void renderPdf();

    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, [url]);

  return (
    <div className="pdf-canvas-shell">
      <canvas aria-label={title} className="pdf-canvas" ref={canvasRef} />
      {renderState !== "ready" ? (
        <div className={`pdf-canvas-status ${renderState}`} role="status">
          {renderState === "loading" ? "正在渲染 PDF" : "PDF 预览加载失败，请使用打开 PDF"}
        </div>
      ) : null}
    </div>
  );
}

function workerUrl(pdfUrl: string): string {
  const parsed = new URL(pdfUrl, window.location.href);
  const apiIndex = parsed.pathname.indexOf("/api/");
  const basePath = apiIndex > -1 ? parsed.pathname.slice(0, apiIndex) : "";

  return `${parsed.origin}${basePath}/pdf.worker.min.mjs`;
}
