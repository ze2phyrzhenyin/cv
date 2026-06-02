# Architecture

## Current MVP

```text
Next.js App Router
  ├─ structured resume editor
  ├─ template selector
  ├─ A4 draft preview renderer
  ├─ compiled PDF iframe preview
  ├─ LaTeX source editor/export
  └─ API routes

API routes
  ├─ GET /api/templates
  ├─ GET /api/templates/:templateId
  ├─ GET /api/resumes
  ├─ POST /api/resumes
  ├─ GET /api/resumes/:resumeId
  └─ POST /api/compile
  └─ GET /api/compile/:jobId
  └─ GET /api/compile/:jobId/pdf

Core libs
  ├─ Resume JSON types
  ├─ Zod validation
  ├─ LaTeX escaping
  ├─ LaTeX template rendering
  └─ resume quality checks
```

`POST /api/compile` validates Resume JSON, renders LaTeX source, and writes a file-backed compile job under `.data/compile/jobs`. It intentionally does not run TeX on the main web process.

The compile worker is an independent process:

```text
pnpm run worker:compile
  ↓
poll .data/compile/jobs
  ↓
write isolated workspace/main.tex
  ↓
latexmk -xelatex
  ↓
copy PDF to .data/compile/artifacts
  ↓
API serves /api/compile/:jobId/pdf
  ↓
Browser embeds the generated PDF in the preview panel
```

Saved resumes are file-backed during the MVP:

```text
.data/resumes/
  resume_*.json
```

Each save appends an immutable version. Compile jobs can carry `resumeId` and `versionId`; when the Worker succeeds it stores the generated `pdfJobId` and `pdfUrl` back on that version.

Template packages are also file-backed:

```text
.data/templates/
  modern-tech.json
  academic-clean.json
  ats-classic.json
  cross-border-ecommerce.json
  campus-operations.json
  product-marketing.json
```

Each package stores `meta`, `tags`, and reusable LaTeX components such as preamble, header, section, entry, bullets, and skills. Built-in templates are seeded only when missing so local template edits are not overwritten.

## Next Phase

```text
API service
  ↓ create compile job
Redis queue
  ↓
Compile Worker
  ↓ render main.tex
Docker sandbox
  ↓ latexmk -xelatex
S3/MinIO
  ↓ signed PDF URL
Browser preview
```

The current worker supports local `latexmk` mode and Docker mode. Docker mode runs with no network, CPU/memory/process limits, and `no-new-privileges`. Redis queue and object storage are still reserved for production scale-out.
