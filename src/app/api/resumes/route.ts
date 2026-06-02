import { NextResponse } from "next/server";

import { saveResumeRequestSchema } from "@/lib/validation";
import { listResumes, saveResumeVersion } from "@/server/resumes/store";

export async function GET() {
  return NextResponse.json({ resumes: await listResumes() });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = saveResumeRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "failed",
        errorMessage: "简历数据校验失败。",
        issues: parsed.error.issues
      },
      { status: 400 }
    );
  }

  const result = await saveResumeVersion(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
