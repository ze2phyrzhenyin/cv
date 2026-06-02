---
name: safe-refactor
description: Use this skill when the user asks to restructure, simplify, organize, or improve internal code shape while preserving behavior. Do not use it for bug fixes, features, dependency upgrades, or style-only churn. Key trigger scenarios include "重构", "整理代码", and "优化结构".
---

# safe-refactor

## Goal

Improve internal structure while keeping external behavior unchanged.

## Trigger examples

- "重构这个模块"
- "整理代码"
- "优化结构"
- "把重复逻辑收一下"

## Do not use when

- The task requires new behavior.
- The task fixes a user-visible bug.
- The behavior is not covered well enough and no verification path exists.

## Workflow

1. Establish current behavior and relevant tests before editing.
2. Define a small refactor boundary.
3. Make behavior-preserving changes only.
4. Avoid combining refactor with feature or bug work.
5. Run behavior-guarding tests.
6. Report any behavior that could not be verified.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Do not change public APIs, outputs, persistence formats, or workflows unless explicitly approved.

## Required output

- Summary of refactor.
- Files changed.
- Behavior preservation evidence.
- Tests run and results.
- Docs decision.
- Risks.
- Next action.
