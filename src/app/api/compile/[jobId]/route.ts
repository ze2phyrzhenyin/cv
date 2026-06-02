import { NextResponse } from "next/server";

import { jobResponse, readCompileJob } from "@/server/compile/job-store";

export async function GET(_request: Request, { params }: { params: { jobId: string } }) {
  const job = await readCompileJob(params.jobId).catch(() => null);

  if (!job) {
    return NextResponse.json({ status: "failed", errorMessage: "编译任务不存在。" }, { status: 404 });
  }

  return NextResponse.json(jobResponse(job));
}
