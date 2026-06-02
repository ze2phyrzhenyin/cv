# Fix CI Task

Use the supplied CI analysis as the only source of scope. Make at most one guarded repair attempt.

Rules:

- Read the analysis first.
- Only address the current CI failure.
- Do not repair unrelated lint, formatting, or historical issues.
- Do not do broad refactors.
- Do not add production dependencies unless the analysis explicitly requires it and the change is safe.
- Do not modify secrets, permission models, release systems, or deployment configuration.
- Stop if the fix requires credentials, external systems, infrastructure access, release systems, or deployment environments.
- Keep the change minimal and focused on the suggested files.
- Do not stage files.
- Do not commit.
- Do not push.
- Do not create a PR.
- Do not merge.
- Do not release.
- Do not deploy.
- Do not start another CI repair loop.

Required output:

- root cause
- files inspected
- files changed
- validation commands
- risks
- whether another CI run is needed
- next action
