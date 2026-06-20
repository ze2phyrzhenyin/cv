import { NextResponse } from "next/server";

import { templateIdSchema } from "@/lib/validation";
import { readTemplatePackage } from "@/server/templates/store";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { templateId: string } }) {
  const parsed = templateIdSchema.safeParse(params.templateId);
  if (!parsed.success) {
    return NextResponse.json({ status: "failed", errorMessage: "模板不存在。" }, { status: 404 });
  }

  const templatePackage = await readTemplatePackage(parsed.data);
  if (!templatePackage) {
    return NextResponse.json({ status: "failed", errorMessage: "模板不存在。" }, { status: 404 });
  }

  return NextResponse.json({ template: templatePackage });
}
