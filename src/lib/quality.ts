import type { QualityIssue, ResumeData } from "@/types/resume";
import { getResumeLanguage, normalizeResumeLanguage } from "./resume-language";

const qualityMessages = {
  "zh-CN": {
    contact: "联系方式不完整。",
    summaryLong: "个人简介偏长，建议压缩到 3 行以内。",
    quantified: "量化结果偏少，可补充规模、耗时、转化率或性能指标。",
    longBullet: "存在过长经历要点，建议拆成更短的结果描述。",
    tooLong: "内容可能超过一页，可切换双页模板或精简项目。"
  },
  en: {
    contact: "Contact information is incomplete.",
    summaryLong: "The summary is long. Keep it within about 3 lines.",
    quantified: "Few bullets include quantified results. Add scale, time, conversion, or performance metrics.",
    longBullet: "At least one bullet is too long. Split it into shorter result statements.",
    tooLong: "The content may exceed one page. Trim projects or reduce detail."
  },
  fr: {
    contact: "Les coordonnées sont incomplètes.",
    summaryLong: "Le profil est long. Essayez de le limiter à environ 3 lignes.",
    quantified: "Peu de points contiennent des résultats chiffrés. Ajoutez volume, durée, conversion ou performance.",
    longBullet: "Au moins un point est trop long. Séparez-le en résultats plus courts.",
    tooLong: "Le contenu peut dépasser une page. Réduisez les projets ou les détails."
  }
} satisfies Record<ReturnType<typeof getResumeLanguage>, Record<string, string>>;

function hasQuantifiedResult(text: string): boolean {
  return /(\d|%|提升|降低|减少|增长|百万|千|ms|qps|p95|p99)/i.test(text);
}

export function analyzeResume(resume: ResumeData): QualityIssue[] {
  const data = normalizeResumeLanguage(resume);
  const messages = qualityMessages[getResumeLanguage(data)];
  const issues: QualityIssue[] = [];
  const hasEmail = data.basicFields.some((field) => field.key === "email" && field.value.trim());
  const hasPhone = data.basicFields.some((field) => field.key === "phone" && field.value.trim());

  if (!hasEmail || !hasPhone) {
    issues.push({ level: "warning", message: messages.contact });
  }

  if (data.summary.length > 180) {
    issues.push({ level: "warning", message: messages.summaryLong });
  }

  const allHighlights = [
    ...data.experience.flatMap((item) => item.highlights),
    ...data.academic.flatMap((item) => item.highlights),
    ...data.projects.flatMap((item) => item.highlights)
  ].filter(Boolean);

  if (allHighlights.length > 0 && allHighlights.filter(hasQuantifiedResult).length < Math.ceil(allHighlights.length / 3)) {
    issues.push({ level: "info", message: messages.quantified });
  }

  const longBullet = allHighlights.find((item) => item.length > 95);
  if (longBullet) {
    issues.push({ level: "warning", message: messages.longBullet });
  }

  const roughLength =
    data.summary.length +
    allHighlights.join("").length +
    data.education.flatMap((item) => item.highlights).join("").length +
    data.skills.flatMap((group) => group.items).join("").length;

  if (roughLength > 2600) {
    issues.push({ level: "info", message: messages.tooLong });
  }

  return issues;
}
