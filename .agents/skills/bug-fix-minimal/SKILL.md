---
name: bug-fix-minimal
description: Use this skill when the user reports a bug, failure, broken behavior, error, regression, or something that stopped working. Do not use it for broad refactors, feature requests, code review, dependency upgrades, or docs-only tasks. Key trigger scenarios include "修", "bug", "报错", "失败", "挂了", "broken", and "失效".
---

# bug-fix-minimal

## Goal

Fix the reported bug with the smallest practical behavior change and protect the fix with a regression test.

## Trigger examples

- "修一下登录失效"
- "这个接口报错"
- "CI 里这个测试失败"
- "页面挂了"

## Do not use when

- The user asks for a new feature, broad cleanup, architecture redesign, or docs-only update.
- The issue is only a review request without permission to edit.

## Workflow

1. Reproduce, localize, or reason from evidence about the failing behavior.
2. Identify the smallest responsible code path.
3. Make the minimal fix that restores expected behavior.
4. Add or update a regression test that would fail without the fix.
5. Run the regression test first, then broader relevant tests when risk justifies it.
6. Document user-visible or configuration behavior changes if any.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Avoid unrelated refactors while fixing the bug.

## Required output

- Summary of the root cause and fix.
- Files changed.
- Regression tests added or updated.
- Commands run and results.
- Docs decision.
- Risks.
- Next action.
