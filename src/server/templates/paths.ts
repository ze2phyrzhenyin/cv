import path from "node:path";

import type { TemplateId } from "../../types/resume";

export function templateDataRoot(): string {
  return process.env.RESUME_TEX_DATA_DIR
    ? path.resolve(process.env.RESUME_TEX_DATA_DIR, "templates")
    : path.join(process.cwd(), ".data", "templates");
}

export function templateFile(templateId: TemplateId): string {
  return path.join(templateDataRoot(), `${templateId}.json`);
}
