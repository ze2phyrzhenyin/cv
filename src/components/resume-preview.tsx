import type { CSSProperties } from "react";
import React from "react";
import { FaCakeCandles, FaEnvelope, FaFlag, FaGithub, FaGlobe, FaLink, FaLinkedin, FaLocationDot, FaPhone } from "react-icons/fa6";
import type { IconType } from "react-icons";

import { parseInlineFormat } from "@/lib/inline-format";
import type { InlineFormat } from "@/lib/inline-format";
import {
  getBasicFieldLabelIcon,
  getBasicFieldLabelMode,
  getBasicFieldLabelText,
  getBasicFieldPlacement,
  getResumeAccentColor,
  getResumeCopy,
  normalizeResumeLanguage
} from "@/lib/resume-language";
import type { BasicField, BasicFieldLabelIcon, ResumeData, ResumeSectionId, TemplateMeta } from "@/types/resume";

const BASIC_FIELD_ICONS: Record<BasicFieldLabelIcon, IconType> = {
  email: FaEnvelope,
  phone: FaPhone,
  location: FaLocationDot,
  website: FaGlobe,
  github: FaGithub,
  linkedin: FaLinkedin,
  link: FaLink,
  age: FaCakeCandles,
  nationality: FaFlag
};

type ResumePreviewProps = {
  resume: ResumeData;
  template: TemplateMeta;
};

function clean(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function cleanInline(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function chunkDetails(fields: BasicField[]): BasicField[][] {
  if (fields.length <= 3) {
    return [fields];
  }

  return [fields.slice(0, 3), fields.slice(3)];
}

function DateLine({ startDate, endDate, location }: { startDate: string; endDate: string; location: string }) {
  return (
    <span>
      <InlineJoin values={cleanInline([cleanInline([startDate, endDate]).join(" - "), location])} separator=" · " />
    </span>
  );
}

function formatDoi(doi: string): string {
  const value = doi.trim();
  return value ? `DOI: ${value}` : "";
}

export function ResumePreview({ resume, template }: ResumePreviewProps) {
  const data = normalizeResumeLanguage(resume);
  const copy = getResumeCopy(data);
  const style = {
    "--resume-accent": getResumeAccentColor(data, template)
  } as CSSProperties;
  const sectionBodies: Record<ResumeSectionId, React.ReactNode> = {
    basics: null,
    summary: <p><InlineText value={data.summary} /></p>,
    experience: (
      <>
        {data.experience.map((item) => (
          <div className="resume-entry" key={item.id}>
            <div className="entry-head">
              <div>
                <strong><InlineText value={item.organization} /></strong>
                <span><InlineText value={item.role} /></span>
              </div>
              <DateLine startDate={item.startDate} endDate={item.endDate} location={item.location} />
            </div>
            <BulletList items={item.highlights} />
          </div>
        ))}
      </>
    ),
    academic: (
      <>
        {data.academic.map((item) => (
          <div className="resume-entry academic-entry" key={item.id}>
            <div className="entry-head">
              <div>
                <strong><InlineText value={item.title} /></strong>
                <span><InlineJoin values={cleanInline([item.authors, item.venue, item.publicationStatus])} separator=" · " /></span>
                {item.contribution.trim() ? (
                  <span><InlineText value={item.contribution} /></span>
                ) : null}
              </div>
              <span><InlineJoin values={cleanInline([item.date, formatDoi(item.doi), item.url])} separator=" · " /></span>
            </div>
            <BulletList items={item.highlights} />
          </div>
        ))}
      </>
    ),
    projects: (
      <>
        {data.projects.map((item) => (
          <div className="resume-entry" key={item.id}>
            <div className="entry-head">
              <div>
                <strong><InlineText value={item.name} /></strong>
                <span><InlineJoin values={cleanInline([item.role, item.techStack])} separator=" · " /></span>
              </div>
              <span><InlineText value={item.url} /></span>
            </div>
            <BulletList items={item.highlights} />
          </div>
        ))}
      </>
    ),
    education: (
      <>
        {data.education.map((item) => (
          <div className="resume-entry" key={item.id}>
            <div className="entry-head">
              <div>
                <strong><InlineText value={item.organization} /></strong>
                <span><InlineText value={item.role} /></span>
              </div>
              <DateLine startDate={item.startDate} endDate={item.endDate} location={item.location} />
            </div>
            <BulletList items={item.highlights} />
          </div>
        ))}
      </>
    ),
    skillsAwards: <SkillsAwards resume={data} />
  };

  return (
    <article className={`resume-page ${template.id}`} style={style}>
      {data.sections
        .filter((section) => section.visible && hasSectionContent(data, section.id))
        .map((section) => (
          section.id === "basics" ? (
            <ResumeHeader key={section.id} ariaLabel={copy.contactAria} fields={data.basicFields} />
          ) : (
            <ResumeSection className={section.id === "academic" ? "academic-section" : undefined} key={section.id} title={section.title}>
              {sectionBodies[section.id]}
            </ResumeSection>
          )
        ))}
    </article>
  );
}

function ResumeSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={["resume-section", className].filter(Boolean).join(" ")}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ResumeHeader({ fields, ariaLabel }: { fields: BasicField[]; ariaLabel: string }) {
  const name = fields.find((field) => getBasicFieldPlacement(field) === "name" && field.value.trim())?.value.trim();
  const headlines = fields.filter((field) => getBasicFieldPlacement(field) === "headline" && field.value.trim());
  const details = fields.filter((field) => getBasicFieldPlacement(field) === "contact" && field.value.trim());
  const contactRows = chunkDetails(details);

  return (
    <header className="resume-header-block">
      {name ? <h1><InlineText value={name} /></h1> : null}
      {headlines.map((field) => (
        <p className="resume-headline-line" key={field.id}>
          <InlineBasicField field={field} />
        </p>
      ))}
      {details.length > 0 ? (
        <div aria-label={ariaLabel} className="resume-contact-rows" role="list">
          {contactRows.map((row, rowIndex) => (
            <div className="resume-contact-row" key={`contact-row-${rowIndex}`} role="presentation">
              {row.map((field) => (
                <span className="resume-contact-item" key={field.id} role="listitem">
                  <InlineBasicField field={field} />
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
}

function InlineBasicField({ field }: { field: BasicField }) {
  const labelMode = getBasicFieldLabelMode(field);
  const icon = getBasicFieldLabelIcon(field);
  const label = getBasicFieldLabelText(field);

  return (
    <>
      {labelMode === "mark" && icon ? <BasicFieldIcon icon={icon} label={field.label} /> : label ? <strong>{label}</strong> : null}
      <span><InlineText value={field.value} /></span>
    </>
  );
}

function BasicFieldIcon({ icon, label }: { icon: BasicFieldLabelIcon; label: string }) {
  const Icon = BASIC_FIELD_ICONS[icon];

  return <Icon aria-label={label} className={`basic-field-icon icon-${icon}`} role="img" />;
}

function SkillsAwards({ resume }: { resume: ResumeData }) {
  return (
    <div className="skills-awards">
      {resume.skills.length > 0 ? (
        <div className="skill-lines">
          {resume.skills.map((group) => (
            <p key={group.id}>
              <strong><InlineText value={group.category} /></strong>
              <span><InlineJoin values={cleanInline(group.items)} separator=" · " /></span>
            </p>
          ))}
        </div>
      ) : null}
      {resume.awards.map((award) => (
        <div className="award-line" key={award.id}>
          <strong><InlineText value={award.title} /></strong>
          <span><InlineJoin values={cleanInline([award.issuer, award.date])} separator=" · " /></span>
        </div>
      ))}
    </div>
  );
}

function hasSectionContent(resume: ResumeData, sectionId: ResumeSectionId): boolean {
  switch (sectionId) {
    case "basics":
      return resume.basicFields.some((field) => field.value.trim() && getBasicFieldPlacement(field) !== "hidden");
    case "summary":
      return Boolean(resume.summary.trim());
    case "experience":
      return resume.experience.length > 0;
    case "academic":
      return resume.academic.length > 0;
    case "projects":
      return resume.projects.length > 0;
    case "education":
      return resume.education.length > 0;
    case "skillsAwards":
      return resume.skills.length > 0 || resume.awards.length > 0;
  }
}

function BulletList({ items }: { items: string[] }) {
  const lines = clean(items);

  if (lines.length === 0) {
    return null;
  }

  return (
    <ul className="resume-bullets">
      {lines.map((item) => (
        <li key={item}><InlineText value={item} /></li>
      ))}
    </ul>
  );
}

function InlineJoin({ values, separator }: { values: string[]; separator: string }) {
  return (
    <>
      {values.map((value, index) => (
        <React.Fragment key={`${value}-${index}`}>
          {index > 0 ? separator : null}
          <InlineText value={value} />
        </React.Fragment>
      ))}
    </>
  );
}

function InlineText({ value }: { value: string }) {
  const segments = parseInlineFormat(value);

  return (
    <>
      {segments.map((segment, index) => {
        const className = inlineFormatClassName(segment.formats);
        return className ? (
          <span className={className} key={`${segment.text}-${index}`}>
            {segment.text}
          </span>
        ) : (
          <React.Fragment key={`${segment.text}-${index}`}>{segment.text}</React.Fragment>
        );
      })}
    </>
  );
}

function inlineFormatClassName(formats: InlineFormat[]): string {
  return formats.length > 0 ? `inline-format ${Array.from(new Set(formats)).join(" ")}` : "";
}
