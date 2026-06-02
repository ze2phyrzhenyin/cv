---
name: test-writer
description: Use this skill when the user asks to add tests, write cases, improve coverage, or protect behavior. Do not use it for feature implementation or production code changes unless tests reveal a clear bug. Key trigger scenarios include "补测试", "写测试", "加用例", and "覆盖率".
---

# test-writer

## Goal

Add focused tests that cover the requested behavior while following existing project test patterns.

## Trigger examples

- "给 auth 模块补测试"
- "写测试覆盖这个边界"
- "加用例"
- "提高覆盖率"

## Do not use when

- The user primarily asks for a feature or bug fix.
- The only way to add tests requires broad production refactors.

## Workflow

1. Inspect existing test structure, fixtures, helpers, naming, and command patterns.
2. Identify the behavior and risk to cover.
3. Add targeted tests with existing helpers.
4. Default to not changing production code.
5. If tests expose a clear bug, report it before changing production code unless the user already authorized fixes.
6. Run the new tests and related existing tests.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Do not weaken assertions just to pass tests.

## Required output

- Summary of coverage added.
- Tests added or updated.
- Production files changed, if any, with reason.
- Commands run and results.
- Docs decision.
- Risks.
- Next action.
