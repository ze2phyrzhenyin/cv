# CI Analysis Guidance

Use `cx ci-analyze` for read-only CI failure analysis and `cx fix-ci` only for one conservative repair attempt based on a saved analysis result.

## Classification

- `caused_by_current_change`: evidence points to the current diff or PR.
- `flaky_test`: failure is intermittent or timing-dependent.
- `external_service`: failure depends on a third-party service.
- `permission_or_secret`: failure needs credentials, tokens, or permission changes.
- `infrastructure`: failure depends on runner, network, cache, or platform infrastructure.
- `dependency_download`: failure occurs while fetching or installing dependencies.
- `environment_mismatch`: local or CI environment differs from expected setup.
- `deploy_environment`: failure belongs to deployment environment or release pipeline state.
- `unknown`: evidence is insufficient.

## Safe To Attempt Fix

- `caused_by_current_change` may be safe when the diff clearly caused the failure.
- `environment_mismatch` may be safe when the fix is local setup or checked-in configuration.
- `dependency_download` is usually unsafe unless evidence points to lockfile or install configuration.
- `flaky_test` is unsafe unless evidence clearly points to this PR introducing the flake.
- `external_service`, `permission_or_secret`, `infrastructure`, `deploy_environment`, and `unknown` are unsafe for automated code repair.

## Stop Conditions

Stop instead of modifying code when the failure requires credentials, permissions, external service access, infrastructure changes, release systems, or deployment environments.

Stop when the analysis suggests too many files, lacks concrete evidence, or points outside the current PR scope.

## Validation Commands

Validation commands must be explicit and must pass the same safety filter as `cx verify`. Do not run remote writes, destructive git operations, environment dumps, `.env` reads, infrastructure apply/delete commands, release commands, deployment commands, or PR merge commands.

## `cx fix-ci` Boundaries

- Runs at most one repair attempt.
- Uses workspace-write Codex only when the saved analysis marks the issue safe.
- Does not stage files.
- Does not commit.
- Does not push.
- Does not create a PR.
- Does not merge.
- Does not release.
- Does not deploy.
- Does not repair unrelated lint, broad refactors, or historical issues.
