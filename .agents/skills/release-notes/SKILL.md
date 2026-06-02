---
name: release-notes
description: Use this skill when the user asks to draft release notes, changelog entries, or user-facing change summaries from commits, PRs, or diffs. Do not use it for creating releases, deploying, tagging, or inventing changes without source evidence. Key trigger scenarios include "release notes", "changelog", "发布说明", and "根据 PR 写更新说明".
---

# release-notes

## Goal

Generate accurate release notes from available commits, PRs, diffs, or explicit change records without inventing changes.

## Trigger examples

- "写 release notes"
- "根据这些 PR 生成 changelog"
- "发布说明整理一下"
- "总结这次版本变化"

## Do not use when

- The user asks to perform an actual release, tag, deploy, merge, or push.
- There are no commits, PRs, diffs, or explicit notes to summarize.
- The request is a general docs update rather than release-specific notes.

## Workflow

1. Identify the source of truth: commits, PRs, diffs, issue links, or provided notes.
2. Extract user-visible changes, fixes, migrations, deprecations, and risks.
3. Group changes into clear categories.
4. Avoid claims not supported by source evidence.
5. Flag unclear or missing context instead of filling gaps.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Do not create tags, publish artifacts, or deploy.

## Required output

- Draft release notes or changelog.
- Source evidence used.
- Files changed, if any.
- Tests: report not applicable unless checks were requested.
- Docs decision.
- Risks.
- Next action.
