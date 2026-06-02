---
name: codebase-map
description: Use this skill when the user asks to understand the project structure, architecture, entry points, runtime commands, or what a module does. Do not use it for edits, bug fixes, refactors, PR creation, deployment, or implementation work. Key trigger scenarios include "解释", "看看架构", "项目怎么跑", and "模块干嘛".
---

# codebase-map

## Goal

Produce a read-only map of the codebase or requested module so the user can understand structure, entry points, commands, dependencies, and risk areas.

## Trigger examples

- "解释一下这个项目"
- "看看架构"
- "项目怎么跑"
- "这个模块干嘛"

## Do not use when

- The user asks to change code, fix a bug, write tests, refactor, deploy, release, or create a PR.
- The task requires executing unsafe commands or modifying files.

## Workflow

1. Inspect repository structure, manifests, configuration, scripts, and tests in read-only mode.
2. Identify application entry points, main modules, data flow, and key external integrations.
3. Find documented run, test, build, and lint commands.
4. Summarize notable risks, missing documentation, or unclear ownership boundaries.
5. Recommend concrete next steps only after the map is complete.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Stay read-only for this skill.

## Required output

- Project structure.
- Entry points and runtime flow.
- How to run, test, build, or lint if discoverable.
- Important modules and what they do.
- Risk points or unknowns.
- Tests: report commands inspected or why none were run.
- Docs decision.
- Risks.
