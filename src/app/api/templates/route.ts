import { NextResponse } from "next/server";

import { listTemplateMetas } from "@/server/templates/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ templates: await listTemplateMetas() });
}
