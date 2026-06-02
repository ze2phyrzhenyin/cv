import { NextResponse } from "next/server";

import { readResume } from "@/server/resumes/store";

export async function GET(_request: Request, { params }: { params: { resumeId: string } }) {
  const resume = await readResume(params.resumeId).catch(() => null);

  if (!resume) {
    return NextResponse.json({ status: "failed", errorMessage: "简历不存在。" }, { status: 404 });
  }

  return NextResponse.json({ resume });
}
