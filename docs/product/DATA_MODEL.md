# Data Model

The MVP stores browser drafts in local storage and saved versions in `.data/resumes` as JSON files. The server routes validate the same `ResumeData` shape with Zod.

`ResumeData.language` marks the content version and currently accepts `zh-CN`, `en`, or `fr`; missing legacy values default to `zh-CN` during validation and draft hydration.

`ResumeData.theme.accentColor` stores the user-selected CV accent color. `ResumeData.sections` stores visible CV section IDs, display names, and order. `ResumeData.basicFields` stores the editable basic-information fields shown in the CV; canonical fields can still sync back to the legacy `basics` object for compatibility. Each basic field may also store `placement`, `labelMode`, `labelIcon`, and `labelMark` so the same data can render as the name, a headline line, a contact-line item, or be hidden, with text labels, built-in icon marks, custom marks, or no label.

Inline text styling is stored directly in string fields with lightweight markers such as `[[b]]...[[/b]]`, `[[i]]...[[/i]]`, `[[u]]...[[/u]]`, and `[[s]]...[[/s]]`. Preview rendering, browser PDF rendering, and LaTeX export parse those markers into bold, italic, underline, and strikethrough output.

The frontend exposes one unified CV layout. Template packages are still stored as JSON packages in `.data/templates` as an internal compatibility layer, but the API only exposes `unified-cv`; legacy template IDs are normalized to that single layout. A package contains:

- `meta`: public template metadata
- `version`: template package version
- `tags`: search/filter labels
- `components`: reusable LaTeX snippets for preamble, header, entry, bullets, and footer

Production storage should use:

- `users`
- `resumes`
- `resume_versions`
- `templates`
- `compile_jobs`
- `assets`

The resume body should remain JSONB instead of raw LaTeX so templates can evolve without rewriting user content.
