# PR Review Flow Prompt

Review only the current diff or specified PR.

The review must be read-only:

- Do not modify files.
- Do not run write commands.
- Do not push.
- Do not create PRs.
- Do not merge, release, or deploy.

Each finding must include:

- severity
- file
- evidence
- impact
- suggested fix

Prioritize correctness, regression, security, tests, docs, maintainability, and obvious performance risks. Avoid pure style suggestions unless they represent a real risk.
