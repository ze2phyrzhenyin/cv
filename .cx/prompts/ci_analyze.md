# CI Analysis Task

Analyze the supplied GitHub checks, PR metadata, logs, commits, and diff. This is read-only analysis.

Return these fields:

- failing_checks
- likely_root_cause
- classification
- evidence
- whether_caused_by_current_change
- safe_to_attempt_fix
- suggested_files_to_inspect
- suggested_fix_strategy
- validation_commands
- risks
- stop_conditions

Choose exactly one classification:

- caused_by_current_change
- flaky_test
- external_service
- permission_or_secret
- infrastructure
- dependency_download
- environment_mismatch
- deploy_environment
- unknown

`safe_to_attempt_fix` rules:

- `caused_by_current_change` may be true when evidence points to this diff.
- `environment_mismatch` may be true only for local setup or configuration mismatches that can be safely changed.
- `dependency_download` is usually false unless evidence points to lockfile or install configuration.
- `flaky_test` is false unless evidence clearly points to this PR introducing the flake.
- `external_service`, `permission_or_secret`, `infrastructure`, `deploy_environment`, and `unknown` are false.

Stop instead of suggesting code changes when the issue needs credentials, permissions, external services, infrastructure access, release systems, or deployment environments.
