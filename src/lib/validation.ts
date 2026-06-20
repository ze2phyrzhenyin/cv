import { z } from "zod";

import { normalizeResumeLanguage } from "./resume-language";
import { unifiedTemplateId } from "./templates";
import type { TemplateId } from "@/types/resume";

export const templateIdSchema = z.string().min(1).transform((): TemplateId => unifiedTemplateId);

export const resumeLanguageSchema = z.enum(["zh-CN", "en", "fr"]);

export const resumeSectionIdSchema = z.enum(["basics", "summary", "experience", "projects", "education", "skillsAwards"]);

export const basicFieldKeySchema = z.enum(["name", "title", "email", "phone", "location", "website", "github", "linkedin"]);

export const basicFieldPlacementSchema = z.enum(["name", "headline", "contact", "hidden"]);

export const basicFieldLabelModeSchema = z.enum(["text", "mark", "custom", "none"]);

export const basicFieldLabelIconSchema = z.enum(["email", "phone", "location", "website", "github", "linkedin", "link"]);

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

export const resumeDataSchema = z
  .object({
    language: resumeLanguageSchema.default("zh-CN"),
    theme: z
      .object({
        accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0f766e")
      })
      .optional(),
    sections: z
      .array(
        z.object({
          id: resumeSectionIdSchema,
          title: z.string().default(""),
          visible: z.boolean().default(true)
        })
      )
      .optional(),
    basicFields: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().default(""),
          value: z.string().default(""),
          key: basicFieldKeySchema.optional(),
          placement: basicFieldPlacementSchema.optional(),
          labelMode: basicFieldLabelModeSchema.optional(),
          labelMark: z.string().default("").optional(),
          labelIcon: basicFieldLabelIconSchema.optional()
        })
      )
      .optional(),
    basics: z.object({
      name: z.string().default(""),
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
  })
  .transform((resume) => normalizeResumeLanguage(resume));

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
