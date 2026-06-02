import { NextResponse } from "next/server";

import { listTemplateMetas } from "@/server/templates/store";

export async function GET() {
  return NextResponse.json({ templates: await listTemplateMetas() });
}
