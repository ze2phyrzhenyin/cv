import { NextResponse } from "next/server";

import { readPdf } from "@/server/compile/compiler";
import { readCompileJob } from "@/server/compile/job-store";

export async function GET(_request: Request, { params }: { params: { jobId: string } }) {
  const job = await readCompileJob(params.jobId).catch(() => null);

  if (!job || job.status !== "success") {
    return NextResponse.json({ status: "failed", errorMessage: "PDF 尚未生成。" }, { status: 404 });
  }

  const pdf = await readPdf(params.jobId);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${params.jobId}.pdf"`,
      "Cache-Control": "private, max-age=300"
    }
  });
}
