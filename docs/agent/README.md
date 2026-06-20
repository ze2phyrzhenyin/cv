# Agent Notes

This directory is for agent-facing documentation that expands on `AGENTS.md`.

The MVP framework is dry-run by default. It may compile instructions for future agent runs, but it must not call GitHub, MCP tools, the Codex API, or `codex exec`.

Remote deployment/upload is allowed only through the `L5_deploy` gate after an explicit user request, relevant local validation, and secret-safe command review. Deployment commands must not read, print, commit, copy, or expose secrets.

Standing instructions such as "always upload after updates" are not approval gates. Remote writes may be bundled into protected one-command flows, but every push, PR, deploy, or upload command must be explicitly triggered in the current task and include the required guarded `--yes` flag.
