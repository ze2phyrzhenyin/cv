---
name: ci-failure-debugger
description: Use this skill when CI, a workflow, an action, or an automated check failed and the user wants diagnosis or repair. Do not use it for unrelated local bugs, feature work, or dependency upgrades unless the CI failure is the main symptom. Key trigger scenarios include "CI", "workflow failed", "action failed", and "流水线失败".
---

# ci-failure-debugger

## Goal

Diagnose the failed check, determine whether it was caused by the current change, and apply the smallest safe fix when edits are allowed.

## Trigger examples

- "CI 挂了"
- "workflow failed"
- "GitHub action failed"
- "流水线失败，帮我看下"

## Do not use when

- The user asks for a general bug fix unrelated to CI.
- The task is purely about updating dependencies or releasing software.

## Workflow

1. Identify the failing job, command, log excerpt, and affected environment.
2. Determine whether the failure is caused by the current change, pre-existing breakage, infrastructure, dependency drift, or test flakiness.
3. Reproduce the failing check locally when practical.
4. Apply the smallest fix to code, test, config, or workflow files.
5. Re-run the failed check or closest local equivalent.
6. Report whether the failure appears introduced by the current change.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Do not mask failures by deleting tests or disabling checks without explicit approval.

## Required output

- Failed check and likely cause.
- Whether the current change caused the failure.
- Files changed.
- Commands run and results.
- Tests added or updated.
- Docs decision.
- Risks.
- Next action.
