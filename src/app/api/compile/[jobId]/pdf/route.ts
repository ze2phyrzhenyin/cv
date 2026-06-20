import { NextResponse } from "next/server";

import { readPdf } from "@/server/compile/artifacts";
import { readCompileJob } from "@/server/compile/job-store";

export async function GET(request: Request, { params }: { params: { jobId: string } }) {
  const job = await readCompileJob(params.jobId).catch(() => null);

  if (!job || job.status !== "success") {
    return NextResponse.json({ status: "failed", errorMessage: "PDF 尚未生成。" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const disposition = searchParams.get("download") === "1" ? "attachment" : "inline";
  const pdf = await readPdf(params.jobId);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${params.jobId}.pdf"`,
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
