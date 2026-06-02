# Testing Guidance

- Bug fixes need regression tests when feasible.
- Features need tests for new behavior and user flows.
- Refactors need behavior-guarding tests.
- Dependency upgrades need install, lockfile, typecheck, lint, build, and relevant suite checks when available.
- Docs-only changes should run docs lint if available.
