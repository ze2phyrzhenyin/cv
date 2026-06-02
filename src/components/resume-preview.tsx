import type { CSSProperties } from "react";

import type { ResumeData, TemplateMeta } from "@/types/resume";

type ResumePreviewProps = {
  resume: ResumeData;
  template: TemplateMeta;
};

function clean(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function DateLine({ startDate, endDate, location }: { startDate: string; endDate: string; location: string }) {
  return <span>{clean([clean([startDate, endDate]).join(" - "), location]).join(" · ")}</span>;
}

export function ResumePreview({ resume, template }: ResumePreviewProps) {
  const style = {
    "--resume-accent": template.accentColor
  } as CSSProperties;
  const contact = clean([
    resume.basics.email,
    resume.basics.phone,
    resume.basics.location,
    resume.basics.website,
    resume.basics.github,
    resume.basics.linkedin
  ]);

  return (
    <article className={`resume-page ${template.id}`} style={style}>
      <header className="resume-header">
        <div>
          <h1>{resume.basics.name || "姓名"}</h1>
          <p>{resume.basics.title || "目标职位"}</p>
        </div>
        <ul aria-label="联系方式">
          {contact.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </header>

      <ResumeSection title="个人简介" visible={Boolean(resume.summary.trim())}>
        <p>{resume.summary}</p>
      </ResumeSection>

      <ResumeSection title="工作经历" visible={resume.experience.length > 0}>
        {resume.experience.map((item) => (
          <div className="resume-entry" key={item.id}>
            <div className="entry-head">
              <div>
                <strong>{item.organization}</strong>
                <span>{item.role}</span>
              </div>
              <DateLine startDate={item.startDate} endDate={item.endDate} location={item.location} />
            </div>
            <BulletList items={item.highlights} />
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="项目经历" visible={resume.projects.length > 0}>
        {resume.projects.map((item) => (
          <div className="resume-entry" key={item.id}>
            <div className="entry-head">
              <div>
                <strong>{item.name}</strong>
                <span>{clean([item.role, item.techStack]).join(" · ")}</span>
              </div>
              <span>{item.url}</span>
            </div>
            <BulletList items={item.highlights} />
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="教育经历" visible={resume.education.length > 0}>
        {resume.education.map((item) => (
          <div className="resume-entry" key={item.id}>
            <div className="entry-head">
              <div>
                <strong>{item.organization}</strong>
                <span>{item.role}</span>
              </div>
              <DateLine startDate={item.startDate} endDate={item.endDate} location={item.location} />
            </div>
            <BulletList items={item.highlights} />
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="技能" visible={resume.skills.length > 0}>
        <div className="skill-lines">
          {resume.skills.map((group) => (
            <p key={group.id}>
              <strong>{group.category}</strong>
              <span>{clean(group.items).join(" · ")}</span>
            </p>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title="奖项" visible={resume.awards.length > 0}>
        {resume.awards.map((award) => (
          <div className="award-line" key={award.id}>
            <strong>{award.title}</strong>
            <span>{clean([award.issuer, award.date]).join(" · ")}</span>
          </div>
        ))}
      </ResumeSection>
    </article>
  );
}

function ResumeSection({
  title,
  visible,
  children
}: {
  title: string;
  visible: boolean;
  children: React.ReactNode;
}) {
  if (!visible) {
    return null;
  }

  return (
    <section className="resume-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  const lines = clean(items);

  if (lines.length === 0) {
    return null;
  }

  return (
    <ul className="resume-bullets">
      {lines.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
