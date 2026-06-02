import { constants } from "node:fs";
import { access, copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

import { artifactPdfPath, workspacePath } from "./paths";
import { readCompileJob, updateCompileJob } from "./job-store";
import { attachCompilePdf } from "../resumes/store";

type CommandResult = {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
};

const maxLogLength = 24000;

export async function processCompileJob(jobId: string): Promise<void> {
  const job = await readCompileJob(jobId);
  if (!job || job.status !== "queued") {
    return;
  }

  const workspace = workspacePath(jobId);
  const buildDir = path.join(workspace, "build");
  const outputPdf = path.join(buildDir, "main.pdf");
  const finalPdf = artifactPdfPath(jobId);

  await updateCompileJob(jobId, {
    status: "running",
    startedAt: new Date().toISOString(),
    log: "Compile job picked up by worker."
  });

  try {
    await rm(workspace, { recursive: true, force: true });
    await mkdir(buildDir, { recursive: true });
    await writeFile(path.join(workspace, "main.tex"), job.sourceTex, "utf-8");

    const commandResult =
      compileMode() === "docker" ? await runDockerLatex(workspace) : await runLocalLatex(workspace);

    const log = truncateLog([commandResult.stdout, commandResult.stderr].filter(Boolean).join("\n"));

    if (commandResult.timedOut) {
      await failJob(jobId, "LaTeX 编译超时。", log);
      return;
    }

    if (commandResult.code !== 0) {
      await failJob(jobId, parseLatexError(log), log);
      return;
    }

    await access(outputPdf, constants.R_OK);
    await copyFile(outputPdf, finalPdf);
    if (job.resumeId && job.versionId) {
      await attachCompilePdf(job.resumeId, job.versionId, {
        jobId,
        pdfUrl: `/api/compile/${jobId}/pdf`
      });
    }
    await updateCompileJob(jobId, {
      status: "success",
      pdfPath: finalPdf,
      pdfUrl: `/api/compile/${jobId}/pdf`,
      finishedAt: new Date().toISOString(),
      log: log || "LaTeX compile completed."
    });
  } catch (error) {
    await failJob(jobId, humanError(error), "");
  } finally {
    if (process.env.RESUME_TEX_KEEP_WORKSPACE !== "1") {
      await rm(workspace, { recursive: true, force: true }).catch(() => undefined);
    }
  }
}

function compileMode(): "local" | "docker" {
  return process.env.RESUME_TEX_COMPILE_MODE === "docker" ? "docker" : "local";
}

async function runLocalLatex(workspace: string): Promise<CommandResult> {
  return runCommand(
    "latexmk",
    [
      "-xelatex",
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-file-line-error",
      "-outdir=build",
      "main.tex"
    ],
    workspace
  );
}

async function runDockerLatex(workspace: string): Promise<CommandResult> {
  const image = process.env.RESUME_TEX_DOCKER_IMAGE || "texlive/texlive:latest";
  return runCommand(
    "docker",
    [
      "run",
      "--rm",
      "--network",
      "none",
      "--cpus",
      process.env.RESUME_TEX_DOCKER_CPUS || "0.5",
      "--memory",
      process.env.RESUME_TEX_DOCKER_MEMORY || "512m",
      "--pids-limit",
      process.env.RESUME_TEX_DOCKER_PIDS || "128",
      "--security-opt",
      "no-new-privileges",
      "-v",
      `${workspace}:/workspace`,
      "-w",
      "/workspace",
      image,
      "latexmk",
      "-xelatex",
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-file-line-error",
      "-outdir=build",
      "main.tex"
    ],
    workspace
  );
}

function runCommand(command: string, args: string[], cwd: string): Promise<CommandResult> {
  const timeoutMs = Number.parseInt(process.env.RESUME_TEX_COMPILE_TIMEOUT_MS || "15000", 10);

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env: {
        ...process.env,
        openin_any: "p",
        openout_any: "p"
      },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout = appendLog(stdout, chunk.toString("utf-8"));
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = appendLog(stderr, chunk.toString("utf-8"));
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ code: 127, stdout, stderr: appendLog(stderr, humanError(error)), timedOut });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });
  });
}

async function failJob(jobId: string, errorMessage: string, log: string): Promise<void> {
  await updateCompileJob(jobId, {
    status: "failed",
    errorMessage,
    finishedAt: new Date().toISOString(),
    log
  });
}

function parseLatexError(log: string): string {
  if (/font.*not found/i.test(log) || /Package fontspec Error/i.test(log)) {
    return "编译环境缺少模板所需字体，请安装 Noto Sans CJK 或切换编译镜像。";
  }
  if (/Undefined control sequence/i.test(log)) {
    return "LaTeX 源码包含无法识别的命令。";
  }
  if (/File .* not found/i.test(log)) {
    return "模板或图片文件缺失。";
  }
  if (/Emergency stop/i.test(log)) {
    return "LaTeX 编译异常终止，请检查源码结构。";
  }
  return "LaTeX 编译失败，请查看日志。";
}

function humanError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown compile worker error.";
}

function appendLog(existing: string, next: string): string {
  return truncateLog(existing + next);
}

function truncateLog(log: string): string {
  if (log.length <= maxLogLength) {
    return log;
  }
  return `${log.slice(0, maxLogLength)}\n... log truncated ...`;
}

export async function readPdf(jobId: string): Promise<Buffer> {
  return readFile(artifactPdfPath(jobId));
}
