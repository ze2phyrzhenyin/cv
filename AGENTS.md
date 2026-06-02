# AGENTS.md

This repository contains a local, guarded AI development workflow framework. Codex agents working here must follow these rules.

## Default Workflow

- Start with read-only analysis before modifying files.
- For ambiguous tasks, write a short plan before making changes.
- Make the smallest practical change that satisfies the user request.
- Prefer existing project structure and patterns over new abstractions.
- Do not add production dependencies unless the user explicitly approves them.

## Git And Release Safety

- Do not execute destructive git commands such as reset, path checkout, or force-push operations unless the user explicitly requests the exact operation.
- Do not push or create PRs except through explicit user commands with `cx push --yes` or `cx pr --yes`.
- Do not merge, release, or deploy; those execution paths are not implemented.
- This MVP must not implement merge, release, deploy, MCP, or automatic Codex execution outside the guarded `cx run --yes` flow.
- PRs must be draft by default and protected branches must be refused for push and PR head branches.
- PR review is read-only analysis only; do not auto-fix findings during `cx pr-review`.
- Do not read, print, commit, or otherwise expose secrets.
- CI analysis must start read-only through `cx ci-analyze`.
- CI fixes must be based on a saved analysis result and must not loop indefinitely.
- `cx fix-ci` must not commit, push, create PRs, merge, release, or deploy.
- Profile and config changes must not enable merge, release, or deploy paths.
- `cx init` is dry-run by default and must not overwrite existing target files unless `--force` is supplied.
- Resource sync must protect user local edits by default and record `.cx/resource-lock.yaml`.
- Do not overwrite existing AGENTS, skills, policies, prompts, docs, or templates unless the user explicitly uses the guarded overwrite flags.
- Do not install skills from the network or from remote URLs.
- New skills must pass `cx skill-lint`.
- New or changed routing rules must update `evals/golden_prompts.yaml` and pass `cx eval`.
- `cx project-kickoff` only generates planning documents; it must not generate business code.
- `cx task-new` only creates local task cards; it must not execute the task.
- `cx readiness` is a pre-work check and must not modify files.
- Business blueprints must stay reusable and must not mix generated app source into the framework root.
- `cx blueprint-init` and `cx blueprint-kickoff` are dry-run by default and must require `--yes` for writes.
- Blueprint overwrites must require guarded overwrite flags and backups.
- Smart Menu v1 must not activate payment, POS, or AI integrations.
- Do not weaken safety boundaries just to make tests pass.
- Do not fix unrelated lint, historical issues, or broad refactors while handling CI failures.
- Do not modify secrets, permission models, or deployment configuration unless the user explicitly requests it and approval gates pass.

## Change Policy

- Bug fixes require regression tests when a test can reasonably cover the behavior.
- Features require tests and necessary documentation updates.
- Refactors must preserve behavior and should include test coverage or a clear verification note.
- Keep edits scoped to files relevant to the task.
- For CI failures, stop when the issue requires credentials, permissions, external services, infrastructure, release systems, or deployment environments.

## End Of Task Report

Every final response must include:

- Files changed.
- Tests run.
- Docs decision.
- Risks or follow-up concerns.
