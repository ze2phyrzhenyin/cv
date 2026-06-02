---
name: pr-risk-review
description: Use this skill when the user asks to review a PR, inspect a diff, find risks, or check whether changes have hidden problems. Do not use it when the user wants direct implementation or broad style feedback. Key trigger scenarios include "review", "PR", "有没有坑", "检查改动", and "代码审查".
---

# pr-risk-review

## Goal

Review code changes in read-only mode and report real behavioral, security, data, reliability, or test-coverage risks.

## Trigger examples

- "看下这个 PR 有没有坑"
- "review 这次改动"
- "检查改动风险"
- "代码审查一下"

## Do not use when

- The user asks you to fix the issues immediately.
- The user only wants formatting, naming, or subjective style preferences.
- There is no diff, PR, commit, or change context to inspect.

## Workflow

1. Stay read-only.
2. Inspect the diff, touched files, call sites, and relevant tests.
3. Prioritize concrete bugs, regressions, security concerns, data loss, compatibility issues, and missing tests.
4. Avoid pure style suggestions unless they hide a real defect.
5. Report findings first, ordered by severity, with file and line references when possible.

## Boundaries

- Do not modify files.
- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.

## Required output

- Findings ordered by severity, or a clear statement that no issues were found.
- Evidence and file references for each finding.
- Missing tests or residual risks.
- Tests: report inspected or run commands, if any.
- Docs decision.
- Risks.
