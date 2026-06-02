---
name: dependency-upgrade
description: Use this skill when the user asks to upgrade dependencies, migrate versions, or move to the latest compatible release. Do not use it for unrelated CI failures, feature work, or broad modernization without an explicit upgrade target. Key trigger scenarios include "升级依赖", "升级到最新版", and "迁移版本".
---

# dependency-upgrade

## Goal

Upgrade dependencies safely while accounting for breaking changes, lockfiles, compatibility code, and setup documentation.

## Trigger examples

- "升级依赖"
- "升级到最新版"
- "迁移版本"
- "把 Typer 升一下"

## Do not use when

- The user asks for a feature or bug fix that does not require dependency changes.
- The upgrade target or package is unclear and cannot be inferred.

## Workflow

1. Identify package names, current versions, target versions, and lockfiles.
2. Review breaking changes, migration notes, and compatibility requirements.
3. Plan the smallest safe upgrade path before editing.
4. Update dependency manifests and lockfiles consistently.
5. Adjust compatibility code only where required.
6. Update setup docs when installation, runtime, or deployment steps change.
7. Run the full relevant test suite for affected areas.

## Boundaries

- Do not modify unrelated files.
- Do not add production dependencies unless explicitly approved.
- Do not execute destructive git commands.
- Do not read, print, commit, or otherwise expose secrets.
- Do not push, create PRs, merge, release, or deploy unless the user explicitly requests it and approval gates are cleared.
- Do not combine multiple major upgrades without explicit approval.

## Required output

- Dependency versions changed.
- Breaking changes considered.
- Files changed, including lockfiles.
- Tests run and results.
- Docs decision.
- Risks.
- Next action.
