import { listQueuedJobs } from "./job-store";
import { processCompileJob } from "./compiler";

export async function processNextQueuedJob(): Promise<string | null> {
  const [job] = await listQueuedJobs();
  if (!job) {
    return null;
  }

  await processCompileJob(job.jobId);
  return job.jobId;
}

export async function runCompileWorker(options: { once?: boolean; pollMs?: number } = {}): Promise<void> {
  const pollMs = options.pollMs ?? Number.parseInt(process.env.RESUME_TEX_WORKER_POLL_MS || "1000", 10);

  while (true) {
    const processed = await processNextQueuedJob();
    if (options.once) {
      return;
    }
    if (!processed) {
      await sleep(pollMs);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
