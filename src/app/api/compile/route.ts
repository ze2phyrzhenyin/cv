import { NextResponse } from "next/server";

import { generateLatex } from "@/lib/latex";
import { analyzeResume } from "@/lib/quality";
import { getTemplate } from "@/lib/templates";
import { compileRequestSchema } from "@/lib/validation";
import { createCompileJob, jobResponse } from "@/server/compile/job-store";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = compileRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "failed",
        errorMessage: "Resume JSON 校验失败。",
        issues: parsed.error.issues
      },
      { status: 400 }
    );
  }

  const template = getTemplate(parsed.data.templateId);
  const sourceTex = parsed.data.sourceTex ?? generateLatex(parsed.data.resume, template);
  const issues = analyzeResume(parsed.data.resume);
  const job = await createCompileJob({
    resumeId: parsed.data.resumeId,
    versionId: parsed.data.versionId,
    resume: parsed.data.resume,
    templateId: parsed.data.templateId,
    sourceTex,
    issues,
    engine: template.engine,
    options: parsed.data.options
  });

  return NextResponse.json(jobResponse(job), { status: 202 });
}
