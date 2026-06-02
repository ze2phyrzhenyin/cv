import type { QualityIssue, ResumeData } from "@/types/resume";

function hasQuantifiedResult(text: string): boolean {
  return /(\d|%|提升|降低|减少|增长|百万|千|ms|qps|p95|p99)/i.test(text);
}

export function analyzeResume(resume: ResumeData): QualityIssue[] {
  const issues: QualityIssue[] = [];

  if (!resume.basics.email.trim() || !resume.basics.phone.trim()) {
    issues.push({ level: "warning", message: "联系方式不完整。" });
  }

  if (resume.summary.length > 180) {
    issues.push({ level: "warning", message: "个人简介偏长，建议压缩到 3 行以内。" });
  }

  const allHighlights = [
    ...resume.experience.flatMap((item) => item.highlights),
    ...resume.projects.flatMap((item) => item.highlights)
  ].filter(Boolean);

  if (allHighlights.length > 0 && allHighlights.filter(hasQuantifiedResult).length < Math.ceil(allHighlights.length / 3)) {
    issues.push({ level: "info", message: "量化结果偏少，可补充规模、耗时、转化率或性能指标。" });
  }

  const longBullet = allHighlights.find((item) => item.length > 95);
  if (longBullet) {
    issues.push({ level: "warning", message: "存在过长经历要点，建议拆成更短的结果描述。" });
  }

  const roughLength =
    resume.summary.length +
    allHighlights.join("").length +
    resume.education.flatMap((item) => item.highlights).join("").length +
    resume.skills.flatMap((group) => group.items).join("").length;

  if (roughLength > 2600) {
    issues.push({ level: "info", message: "内容可能超过一页，可切换双页模板或精简项目。" });
  }

  return issues;
}
