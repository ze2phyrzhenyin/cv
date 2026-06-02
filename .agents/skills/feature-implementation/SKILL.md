---
name: feature-implementation
description: Use this skill when the user asks to add, implement, support, or enable a new capability. Do not use it for bug fixes, pure tests, review, docs-only changes, or refactors that should preserve behavior. Key trigger scenarios include "加一个功能", "实现", "支持", and "新增".
---

# feature-implementation

## Goal

Implement a focused feature slice with an upfront plan, tests, and necessary documentation.

## Trigger examples

- "新增邮箱登录支持"
- "实现导出功能"
- "支持配置环境变量"
- "加一个功能"

## Do not use when

- The user reports broken existing behavior.
- The user asks only for tests or documentation.
- The change is too broad to plan safely without clarification.

## Workflow

1. Inspect current behavior and extension points.
2. Produce a short plan before editing.
3. Define expected behavior, edge cases, tests, and docs impact.
4. Implement the smallest coherent feature slice.
5. Add or update tests for the new behavior.
6. Update docs when public behavior, setup, or operations change.
7. Run relevant tests.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Do not silently expand scope beyond the requested feature.

## Required output

- Summary of feature implemented.
- Files changed.
- Tests added or updated.
- Docs decision.
- Commands run and results.
- Risks.
- Next action.
