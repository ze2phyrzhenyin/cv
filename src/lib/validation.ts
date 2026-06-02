import { z } from "zod";

export const templateIdSchema = z.enum([
  "modern-tech",
  "academic-clean",
  "ats-classic",
  "cross-border-ecommerce",
  "campus-operations",
  "product-marketing"
]);

export const timelineItemSchema = z.object({
  id: z.string().min(1),
  organization: z.string().min(1),
  role: z.string().min(1),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  highlights: z.array(z.string()).default([])
});

export const projectItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().default(""),
  url: z.string().default(""),
  techStack: z.string().default(""),
  highlights: z.array(z.string()).default([])
});

export const resumeDataSchema = z.object({
  basics: z.object({
    name: z.string().min(1),
    title: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    location: z.string().default(""),
    website: z.string().default(""),
    github: z.string().default(""),
    linkedin: z.string().default("")
  }),
  summary: z.string().default(""),
  education: z.array(timelineItemSchema).default([]),
  experience: z.array(timelineItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: z
    .array(
      z.object({
        id: z.string().min(1),
        category: z.string().min(1),
        items: z.array(z.string()).default([])
      })
    )
    .default([]),
  awards: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        issuer: z.string().default(""),
        date: z.string().default("")
      })
    )
    .default([])
});

export const compileRequestSchema = z.object({
  resumeId: z.string().min(1).optional(),
  versionId: z.string().min(1).optional(),
  resume: resumeDataSchema,
  templateId: templateIdSchema,
  sourceTex: z.string().min(1).optional(),
  options: z
    .object({
      fontSize: z.enum(["10pt", "11pt", "12pt"]).default("10pt"),
      showAvatar: z.boolean().default(false)
    })
    .default({})
});

export const saveResumeRequestSchema = z.object({
  resumeId: z.string().min(1).optional(),
  title: z.string().min(1).max(120),
  resume: resumeDataSchema,
  templateId: templateIdSchema,
  sourceTex: z.string().min(1).optional()
});
