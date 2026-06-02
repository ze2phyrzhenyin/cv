# API Plan

Implemented:

```http
GET /api/templates
GET /api/templates/:templateId
GET /api/resumes
POST /api/resumes
GET /api/resumes/:resumeId
POST /api/compile
GET /api/compile/:jobId
GET /api/compile/:jobId/pdf
```

`POST /api/compile` returns `202 Accepted` with a queued job. The browser polls `GET /api/compile/:jobId` until `success` or `failed`.

`POST /api/resumes` appends a new immutable version. When `resumeId` is omitted it creates a new resume.

`GET /api/templates/:templateId` returns the stored template package, including reusable LaTeX components.

Reserved:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/me

GET    /api/resumes
POST   /api/resumes
GET    /api/resumes/:id
PATCH  /api/resumes/:id
DELETE /api/resumes/:id

GET  /api/resumes/:id/versions
POST /api/resumes/:id/versions

POST /api/assets/upload
DELETE /api/assets/:id
```
