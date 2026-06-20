import { readFile } from "node:fs/promises";

import { artifactPdfPath } from "./paths";

export async function readPdf(jobId: string): Promise<Buffer> {
  return readFile(artifactPdfPath(jobId));
}
