---
name: docs-update
description: Use this skill when the user asks to update README, docs, changelog, release notes, setup instructions, or explanations. Do not use it for code implementation or broad documentation rewrites not tied to the request. Key trigger scenarios include "文档", "README", "changelog", "release notes", and "说明".
---

# docs-update

## Goal

Update only the documentation needed for the requested change or discovered behavior.

## Trigger examples

- "更新部署文档"
- "README 说明补一下"
- "写 changelog"
- "补充使用说明"

## Do not use when

- The user asks to implement behavior before documenting it.
- The requested change requires release notes based on commits or PRs; use release-notes for that narrower task.
- A broad rewrite would exceed the requested scope.

## Workflow

1. Determine the exact documentation scope before editing.
2. Inspect current behavior, commands, or configuration that the docs describe.
3. Update only directly relevant sections.
4. Avoid unrelated rewrites, tone changes, or large restructuring.
5. Run docs lint, link checks, or formatting checks if available.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Do not document unimplemented behavior as available.

## Required output

- Summary of docs updated.
- Files changed.
- Tests or docs checks run and results.
- Docs decision.
- Risks.
- Next action.
