# Packaging Readiness

This project is prepared for local editable installation and package-resource validation.

Local install:

```bash
python3 -m pip install -e .
cx doctor
```

The CLI entry point is:

```text
cx = "cx.cli:app"
```

Package resources live under `src/cx/resources/defaults/` so installed CLI commands can read default skills, policies, prompts, docs, profiles, and templates.

This readiness phase does not publish to PyPI, create tags, create GitHub releases, merge, release, or deploy.
