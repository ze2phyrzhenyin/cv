import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = new Set(process.argv.slice(2));
const protectedBranches = readProtectedBranches();

if (!args.has("--yes")) {
  fail("publish:all requires --yes.");
}

const branch = runCapture("git", ["branch", "--show-current"]).trim();
if (!branch) {
  fail("Cannot determine current git branch.");
}
if (protectedBranches.has(branch)) {
  fail(`Refusing to push protected branch: ${branch}.`);
}

const upstream = runCapture("git", ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], { allowFailure: true }).trim();
if (!upstream) {
  fail(`Branch ${branch} has no upstream. Set one explicitly before publishing.`);
}

run("pnpm", ["run", "typecheck"]);
run("pnpm", ["run", "test"]);

const status = runCapture("git", ["status", "--porcelain=v1"]).trim();
if (status) {
  fail("Refusing to push with uncommitted changes. Commit the intended changes first, then rerun pnpm publish:all -- --yes.");
}

run("git", ["push"]);
console.log(`Published ${branch} to ${upstream}.`);

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (result.status !== 0 && !options.allowFailure) {
    const message = result.stderr.trim() || result.stdout.trim() || `${command} ${commandArgs.join(" ")} failed.`;
    fail(message);
  }

  return result.stdout;
}

function readProtectedBranches() {
  const branches = new Set(["main", "master", "develop", "release"]);

  try {
    const config = readFileSync(".cx/config.yaml", "utf-8");
    const match = config.match(/protected_branches:\n((?:- .+\n?)+)/);
    if (!match) {
      return branches;
    }

    for (const line of match[1].split("\n")) {
      const branch = line.replace(/^- /, "").trim();
      if (branch) {
        branches.add(branch);
      }
    }
  } catch {
    // Defaults above preserve the protection boundary when config is unavailable.
  }

  return branches;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
