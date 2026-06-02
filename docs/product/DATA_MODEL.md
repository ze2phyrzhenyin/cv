# Data Model

The MVP stores browser drafts in local storage and saved versions in `.data/resumes` as JSON files. The server routes validate the same `ResumeData` shape with Zod.

Templates are stored as JSON packages in `.data/templates`. A package contains:

- `meta`: public template metadata
- `version`: template package version
- `tags`: search/filter labels
- `components`: reusable LaTeX snippets for preamble, header, section, entry, bullets, skills, and footer

Production storage should use:

- `users`
- `resumes`
- `resume_versions`
- `templates`
- `compile_jobs`
- `assets`

The resume body should remain JSONB instead of raw LaTeX so templates can evolve without rewriting user content.
