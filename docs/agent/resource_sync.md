# Resource Sync

Resource sync keeps project-local workflow files aligned with the framework defaults after `cx init`.

Resources include:

- `AGENTS.md`
- `.cx/config.yaml`
- `.cx/policies`
- `.cx/prompts`
- `.agents/skills`
- `docs/agent`
- optional PR template

## Status

- `missing`: manifest and lock know the resource, but the target file is gone.
- `unchanged`: target checksum matches the lock and the framework source has not changed.
- `modified_locally`: target checksum differs from the installed checksum.
- `outdated`: framework source changed and target has not been locally modified.
- `new_in_pack`: framework manifest has a resource missing from the lock.
- `unknown_in_lock`: lock has a resource no longer present in the manifest.
- `conflict`: framework source changed and target was also locally modified.

## Upgrade Strategy

Run status first, inspect diffs, then sync:

```bash
cx resource-status .
cx resource-diff . --resource skill.bug-fix-minimal
cx sync-resources .
```

All writes require `--yes`.

## Conflict Handling

Local modifications are skipped by default. To overwrite a local modification, use both `--force` and `--backup` with `--yes`.

## Backup Rules

Backups are written next to the original file with a `.bak` suffix before overwriting.

## Lock File

`.cx/resource-lock.yaml` records the installed resource id, target path, source checksum, installed checksum, and resource pack version. It must not record secrets or environment values.

## Skill Installation

`cx install-skill` installs only built-in skills into `.agents/skills` or the configured `skills_dir`. It does not download remote skills, install from URLs, call Codex, call gh, push, or create PRs.
