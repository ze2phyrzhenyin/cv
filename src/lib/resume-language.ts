import type {
  BasicField,
  BasicFieldLabelIcon,
  BasicFieldLabelMode,
  BasicFieldPlacement,
  Basics,
  ResumeData,
  ResumeLanguage,
  ResumeSectionConfig,
  ResumeSectionId,
  TemplateMeta
} from "@/types/resume";

type ResumeCopy = {
  label: string;
  basics: string;
  summary: string;
  experience: string;
  projects: string;
  education: string;
  skillsAwards: string;
  contactAria: string;
  namePlaceholder: string;
  titlePlaceholder: string;
  locationPlaceholder: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
};

type AppCopy = {
  appSubtitle: string;
  languageAria: string;
  moduleAria: string;
  editorAria: string;
  previewAria: string;
  previewTitle: string;
  previewDraft: string;
  previewPdf: string;
  buttons: {
    exportTex: string;
    downloadPdf: string;
    printPdf: string;
    generate: string;
    generating: string;
    delete: string;
    addField: string;
    moveUp: string;
    moveDown: string;
    resetSource: string;
  };
  logs: {
    queryFailed: string;
    timeout: string;
  };
  tabs: {
    presentation: string;
    basics: string;
    summary: string;
    experience: string;
    projects: string;
    education: string;
    skills: string;
    source: string;
  };
  editor: {
    presentation: string;
    accentColor: string;
    accentHex: string;
    sectionOrder: string;
    showSection: string;
    sectionName: string;
    basics: string;
    fieldLabel: string;
    fieldValue: string;
    fieldPlacement: string;
    placementName: string;
    placementHeadline: string;
    placementContact: string;
    placementHidden: string;
    labelMode: string;
    labelModeText: string;
    labelModeMark: string;
    labelModeCustom: string;
    labelModeNone: string;
    fieldIcon: string;
    fieldMark: string;
    formatToolbar: string;
    formatBold: string;
    formatItalic: string;
    formatUnderline: string;
    formatStrike: string;
    iconEmail: string;
    iconPhone: string;
    iconLocation: string;
    iconWebsite: string;
    iconGithub: string;
    iconLinkedin: string;
    iconLink: string;
    customField: string;
    summary: string;
    summaryLabel: string;
    experience: string;
    addExperience: string;
    newExperienceOrg: string;
    newExperienceRole: string;
    newExperienceBullet: string;
    education: string;
    addEducation: string;
    newEducationOrg: string;
    newEducationRole: string;
    newEducationBullet: string;
    organization: string;
    role: string;
    location: string;
    start: string;
    end: string;
    highlights: string;
    projects: string;
    projectName: string;
    projectRole: string;
    projectUrl: string;
    projectStack: string;
    projectFallback: string;
    addProject: string;
    newProjectName: string;
    newProjectRole: string;
    newProjectBullet: string;
    skillsAwards: string;
    skillFallback: string;
    skillCategory: string;
    skillItems: string;
    addSkill: string;
    newSkillCategory: string;
    awards: string;
    awardFallback: string;
    awardTitle: string;
    awardIssuer: string;
    awardDate: string;
    addAward: string;
    newAwardTitle: string;
    newAwardIssuer: string;
    source: string;
  };
  draftBanner: string;
  failedBanner: string;
  compilingBanner: string;
};

type ResumeLike = Omit<ResumeData, "language" | "theme" | "sections" | "basicFields"> &
  Partial<Pick<ResumeData, "language" | "theme" | "sections" | "basicFields">>;

export const resumeLanguages: ResumeLanguage[] = ["zh-CN", "en", "fr"];

export const languageLabels: Record<ResumeLanguage, string> = {
  "zh-CN": "中文",
  en: "English",
  fr: "Français"
};

export const defaultAccentColor = "#0f766e";

export const resumeSectionIds: ResumeSectionId[] = ["basics", "summary", "experience", "projects", "education", "skillsAwards"];

const resumeCopy: Record<ResumeLanguage, ResumeCopy> = {
  "zh-CN": {
    label: "中文",
    basics: "基本信息",
    summary: "简介",
    experience: "工作",
    projects: "项目",
    education: "教育",
    skillsAwards: "技能/奖项",
    contactAria: "基本信息",
    namePlaceholder: "姓名",
    titlePlaceholder: "目标职位",
    locationPlaceholder: "现居地待填写",
    phonePlaceholder: "电话待填写",
    emailPlaceholder: "邮箱待填写"
  },
  en: {
    label: "English",
    basics: "Basic Info",
    summary: "Summary",
    experience: "Work",
    projects: "Projects",
    education: "Education",
    skillsAwards: "Skills/Awards",
    contactAria: "Basic information",
    namePlaceholder: "Name",
    titlePlaceholder: "Target Role",
    locationPlaceholder: "Location TBD",
    phonePlaceholder: "Phone TBD",
    emailPlaceholder: "Email TBD"
  },
  fr: {
    label: "Français",
    basics: "Infos de base",
    summary: "Profil",
    experience: "Expérience",
    projects: "Projets",
    education: "Formation",
    skillsAwards: "Compétences/Prix",
    contactAria: "Informations de base",
    namePlaceholder: "Nom",
    titlePlaceholder: "Poste visé",
    locationPlaceholder: "Lieu à renseigner",
    phonePlaceholder: "Téléphone à renseigner",
    emailPlaceholder: "E-mail à renseigner"
  }
};

const basicFieldLabels: Record<ResumeLanguage, Record<keyof Basics, string>> = {
  "zh-CN": {
    name: "姓名",
    title: "目标职位",
    email: "邮箱",
    phone: "电话",
    location: "城市",
    website: "网站",
    github: "GitHub",
    linkedin: "LinkedIn"
  },
  en: {
    name: "Name",
    title: "Target Role",
    email: "Email",
    phone: "Phone",
    location: "Location",
    website: "Website",
    github: "GitHub",
    linkedin: "LinkedIn"
  },
  fr: {
    name: "Nom",
    title: "Poste visé",
    email: "E-mail",
    phone: "Téléphone",
    location: "Lieu",
    website: "Site web",
    github: "GitHub",
    linkedin: "LinkedIn"
  }
};

const basicFieldMarks: Record<keyof Basics, string> = {
  name: "",
  title: "",
  email: "mail",
  phone: "tel",
  location: "loc",
  website: "web",
  github: "GH",
  linkedin: "in"
};

const basicFieldIcons: Partial<Record<keyof Basics, BasicFieldLabelIcon>> = {
  email: "email",
  phone: "phone",
  location: "location",
  website: "website",
  github: "github",
  linkedin: "linkedin"
};

const appCopy: Record<ResumeLanguage, AppCopy> = {
  "zh-CN": {
    appSubtitle: "结构化 LaTeX 简历",
    languageAria: "语言版本",
    moduleAria: "简历模块",
    editorAria: "简历编辑",
    previewAria: "PDF 预览",
    previewTitle: "CV 预览",
    previewDraft: "草稿预览",
    previewPdf: "LaTeX PDF 预览",
    buttons: {
      exportTex: "导出 .tex",
      downloadPdf: "下载 PDF",
      printPdf: "打开 PDF",
      generate: "生成 PDF",
      generating: "生成中",
      delete: "删除",
      addField: "新增字段",
      moveUp: "上移",
      moveDown: "下移",
      resetSource: "重置为模板源码"
    },
    logs: {
      queryFailed: "查询编译任务失败",
      timeout: "编译任务等待超时，请确认 Worker 是否正在运行。"
    },
    tabs: {
      presentation: "展示",
      basics: "基本信息",
      summary: "简介",
      experience: "工作",
      projects: "项目",
      education: "教育",
      skills: "技能/奖项",
      source: "LaTeX"
    },
    editor: {
      presentation: "展示设置",
      accentColor: "主题色",
      accentHex: "颜色值",
      sectionOrder: "CV 章节名称与顺序",
      showSection: "显示",
      sectionName: "章节名",
      basics: "基本信息",
      fieldLabel: "字段名",
      fieldValue: "内容",
      fieldPlacement: "显示位置",
      placementName: "姓名",
      placementHeadline: "姓名下方",
      placementContact: "联系行",
      placementHidden: "隐藏",
      labelMode: "标签样式",
      labelModeText: "文字",
      labelModeMark: "标识",
      labelModeCustom: "自定义标识",
      labelModeNone: "不显示",
      fieldIcon: "默认图案",
      fieldMark: "标识内容",
      formatToolbar: "文本格式",
      formatBold: "加粗",
      formatItalic: "斜体",
      formatUnderline: "下划线",
      formatStrike: "删除线",
      iconEmail: "邮箱图案",
      iconPhone: "电话图案",
      iconLocation: "位置图案",
      iconWebsite: "网站图案",
      iconGithub: "GitHub 图案",
      iconLinkedin: "LinkedIn 图案",
      iconLink: "链接图案",
      customField: "自定义字段",
      summary: "个人简介",
      summaryLabel: "简介",
      experience: "工作经历",
      addExperience: "新增工作经历",
      newExperienceOrg: "公司名称",
      newExperienceRole: "职位",
      newExperienceBullet: "负责的业务、动作和结果。",
      education: "教育经历",
      addEducation: "新增教育经历",
      newEducationOrg: "学校",
      newEducationRole: "专业/学历",
      newEducationBullet: "GPA、奖学金或核心课程。",
      organization: "机构/公司",
      role: "职位/学历",
      location: "地点",
      start: "开始",
      end: "结束",
      highlights: "要点",
      projects: "项目经历",
      projectName: "项目名",
      projectRole: "角色",
      projectUrl: "链接",
      projectStack: "技术栈",
      projectFallback: "项目",
      addProject: "新增项目",
      newProjectName: "项目名称",
      newProjectRole: "角色",
      newProjectBullet: "说明职责和结果。",
      skillsAwards: "技能与奖项",
      skillFallback: "技能",
      skillCategory: "分类",
      skillItems: "技能",
      addSkill: "新增技能分类",
      newSkillCategory: "新分类",
      awards: "奖项证书",
      awardFallback: "奖项",
      awardTitle: "名称",
      awardIssuer: "机构",
      awardDate: "日期",
      addAward: "新增奖项",
      newAwardTitle: "奖项名称",
      newAwardIssuer: "颁发机构",
      source: "LaTeX 源码"
    },
    draftBanner: "当前显示草稿",
    failedBanner: "生成失败，当前显示草稿",
    compilingBanner: "Worker 正在生成 PDF"
  },
  en: {
    appSubtitle: "Structured LaTeX resume",
    languageAria: "Language version",
    moduleAria: "Resume modules",
    editorAria: "Resume editor",
    previewAria: "PDF preview",
    previewTitle: "CV Preview",
    previewDraft: "Draft preview",
    previewPdf: "LaTeX PDF preview",
    buttons: {
      exportTex: "Export .tex",
      downloadPdf: "Download PDF",
      printPdf: "Open PDF",
      generate: "Generate PDF",
      generating: "Generating",
      delete: "Delete",
      addField: "Add field",
      moveUp: "Move up",
      moveDown: "Move down",
      resetSource: "Reset to template source"
    },
    logs: {
      queryFailed: "Failed to query compile job",
      timeout: "Compile job timed out. Check whether the worker is running."
    },
    tabs: {
      presentation: "Display",
      basics: "Basic Info",
      summary: "Summary",
      experience: "Work",
      projects: "Projects",
      education: "Education",
      skills: "Skills/Awards",
      source: "LaTeX"
    },
    editor: {
      presentation: "Display Settings",
      accentColor: "Theme color",
      accentHex: "Color value",
      sectionOrder: "CV section names and order",
      showSection: "Show",
      sectionName: "Section name",
      basics: "Basic Info",
      fieldLabel: "Field name",
      fieldValue: "Content",
      fieldPlacement: "Display position",
      placementName: "Name",
      placementHeadline: "Under name",
      placementContact: "Contact line",
      placementHidden: "Hidden",
      labelMode: "Label style",
      labelModeText: "Text",
      labelModeMark: "Mark",
      labelModeCustom: "Custom mark",
      labelModeNone: "None",
      fieldIcon: "Default icon",
      fieldMark: "Mark text",
      formatToolbar: "Text formatting",
      formatBold: "Bold",
      formatItalic: "Italic",
      formatUnderline: "Underline",
      formatStrike: "Strikethrough",
      iconEmail: "Email icon",
      iconPhone: "Phone icon",
      iconLocation: "Location icon",
      iconWebsite: "Website icon",
      iconGithub: "GitHub icon",
      iconLinkedin: "LinkedIn icon",
      iconLink: "Link icon",
      customField: "Custom field",
      summary: "Professional Summary",
      summaryLabel: "Summary",
      experience: "Work Experience",
      addExperience: "Add work experience",
      newExperienceOrg: "Company",
      newExperienceRole: "Role",
      newExperienceBullet: "Describe the responsibility, action, and result.",
      education: "Education",
      addEducation: "Add education",
      newEducationOrg: "School",
      newEducationRole: "Degree / Major",
      newEducationBullet: "GPA, scholarship, or core courses.",
      organization: "Organization / Company",
      role: "Role / Degree",
      location: "Location",
      start: "Start",
      end: "End",
      highlights: "Highlights",
      projects: "Projects",
      projectName: "Project name",
      projectRole: "Role",
      projectUrl: "Link",
      projectStack: "Tech stack",
      projectFallback: "Project",
      addProject: "Add project",
      newProjectName: "Project name",
      newProjectRole: "Role",
      newProjectBullet: "Describe your responsibility and result.",
      skillsAwards: "Skills and Awards",
      skillFallback: "Skill",
      skillCategory: "Category",
      skillItems: "Skills",
      addSkill: "Add skill category",
      newSkillCategory: "New category",
      awards: "Awards / Certificates",
      awardFallback: "Award",
      awardTitle: "Name",
      awardIssuer: "Issuer",
      awardDate: "Date",
      addAward: "Add award",
      newAwardTitle: "Award name",
      newAwardIssuer: "Issuer",
      source: "LaTeX Source"
    },
    draftBanner: "Showing draft",
    failedBanner: "Generation failed, showing draft",
    compilingBanner: "Worker is generating PDF"
  },
  fr: {
    appSubtitle: "CV LaTeX structuré",
    languageAria: "Version linguistique",
    moduleAria: "Modules du CV",
    editorAria: "Éditeur de CV",
    previewAria: "Aperçu PDF",
    previewTitle: "Aperçu du CV",
    previewDraft: "Aperçu brouillon",
    previewPdf: "Aperçu PDF LaTeX",
    buttons: {
      exportTex: "Exporter .tex",
      downloadPdf: "Télécharger PDF",
      printPdf: "Ouvrir PDF",
      generate: "Générer PDF",
      generating: "Génération",
      delete: "Supprimer",
      addField: "Ajouter un champ",
      moveUp: "Monter",
      moveDown: "Descendre",
      resetSource: "Réinitialiser le code source"
    },
    logs: {
      queryFailed: "Impossible de consulter la compilation",
      timeout: "La compilation a expiré. Vérifiez que le worker fonctionne."
    },
    tabs: {
      presentation: "Affichage",
      basics: "Infos",
      summary: "Profil",
      experience: "Expérience",
      projects: "Projets",
      education: "Formation",
      skills: "Compétences/Prix",
      source: "LaTeX"
    },
    editor: {
      presentation: "Paramètres d'affichage",
      accentColor: "Couleur thème",
      accentHex: "Valeur couleur",
      sectionOrder: "Noms et ordre des sections du CV",
      showSection: "Afficher",
      sectionName: "Nom de section",
      basics: "Infos de base",
      fieldLabel: "Nom du champ",
      fieldValue: "Contenu",
      fieldPlacement: "Position",
      placementName: "Nom",
      placementHeadline: "Sous le nom",
      placementContact: "Ligne contact",
      placementHidden: "Masqué",
      labelMode: "Style libellé",
      labelModeText: "Texte",
      labelModeMark: "Repère",
      labelModeCustom: "Repère perso.",
      labelModeNone: "Aucun",
      fieldIcon: "Icône par défaut",
      fieldMark: "Repère",
      formatToolbar: "Mise en forme",
      formatBold: "Gras",
      formatItalic: "Italique",
      formatUnderline: "Souligner",
      formatStrike: "Barrer",
      iconEmail: "Icône e-mail",
      iconPhone: "Icône téléphone",
      iconLocation: "Icône lieu",
      iconWebsite: "Icône site web",
      iconGithub: "Icône GitHub",
      iconLinkedin: "Icône LinkedIn",
      iconLink: "Icône lien",
      customField: "Champ personnalisé",
      summary: "Profil",
      summaryLabel: "Profil",
      experience: "Expérience professionnelle",
      addExperience: "Ajouter une expérience",
      newExperienceOrg: "Entreprise",
      newExperienceRole: "Poste",
      newExperienceBullet: "Décrivez la responsabilité, l'action et le résultat.",
      education: "Formation",
      addEducation: "Ajouter une formation",
      newEducationOrg: "École",
      newEducationRole: "Diplôme / spécialité",
      newEducationBullet: "GPA, bourse ou cours principaux.",
      organization: "Organisation / entreprise",
      role: "Poste / diplôme",
      location: "Lieu",
      start: "Début",
      end: "Fin",
      highlights: "Points clés",
      projects: "Projets",
      projectName: "Nom du projet",
      projectRole: "Rôle",
      projectUrl: "Lien",
      projectStack: "Technologies",
      projectFallback: "Projet",
      addProject: "Ajouter un projet",
      newProjectName: "Nom du projet",
      newProjectRole: "Rôle",
      newProjectBullet: "Décrivez votre responsabilité et le résultat.",
      skillsAwards: "Compétences et prix",
      skillFallback: "Compétence",
      skillCategory: "Catégorie",
      skillItems: "Compétences",
      addSkill: "Ajouter une catégorie",
      newSkillCategory: "Nouvelle catégorie",
      awards: "Prix / certificats",
      awardFallback: "Prix",
      awardTitle: "Nom",
      awardIssuer: "Organisme",
      awardDate: "Date",
      addAward: "Ajouter un prix",
      newAwardTitle: "Nom du prix",
      newAwardIssuer: "Organisme",
      source: "Source LaTeX"
    },
    draftBanner: "Aperçu brouillon",
    failedBanner: "Génération échouée, aperçu brouillon",
    compilingBanner: "Le worker génère le PDF"
  }
};

export function getResumeLanguage(resume: { language?: unknown }): ResumeLanguage {
  return resumeLanguages.includes(resume.language as ResumeLanguage) ? (resume.language as ResumeLanguage) : "zh-CN";
}

export function getResumeCopy(input: ResumeData | ResumeLanguage): ResumeCopy {
  const language = typeof input === "string" ? input : getResumeLanguage(input);
  return resumeCopy[language];
}

export function getAppCopy(input: ResumeData | ResumeLanguage): AppCopy {
  const language = typeof input === "string" ? input : getResumeLanguage(input);
  return appCopy[language];
}

export function getDefaultBasicFieldMark(key: keyof Basics | undefined): string {
  return key ? basicFieldMarks[key] : "";
}

export function getDefaultBasicFieldIcon(key: keyof Basics | undefined): BasicFieldLabelIcon | undefined {
  return key ? basicFieldIcons[key] : undefined;
}

export function getBasicFieldPlacement(field: Pick<BasicField, "key" | "placement">): BasicFieldPlacement {
  if (isBasicFieldPlacement(field.placement)) {
    return field.placement;
  }
  if (field.key === "name") {
    return "name";
  }
  if (field.key === "title") {
    return "headline";
  }
  return "contact";
}

export function getBasicFieldLabelMode(field: Pick<BasicField, "key" | "placement" | "labelMode">): BasicFieldLabelMode {
  if (isBasicFieldLabelMode(field.labelMode)) {
    return field.labelMode;
  }
  const placement = getBasicFieldPlacement(field);
  if (placement === "name" || placement === "headline") {
    return "none";
  }
  return getDefaultBasicFieldIcon(field.key) ? "mark" : "text";
}

export function getBasicFieldLabelIcon(field: Pick<BasicField, "key" | "placement" | "labelMode" | "labelIcon">): BasicFieldLabelIcon | undefined {
  if (getBasicFieldLabelMode(field) !== "mark") {
    return undefined;
  }
  return isBasicFieldLabelIcon(field.labelIcon) ? field.labelIcon : getDefaultBasicFieldIcon(field.key) ?? "link";
}

export function getBasicFieldLabelText(field: BasicField): string {
  const mode = getBasicFieldLabelMode(field);
  if (mode === "none") {
    return "";
  }
  if (mode === "custom") {
    return field.labelMark?.trim() ?? "";
  }
  if (mode === "mark") {
    return (field.labelMark?.trim() || getDefaultBasicFieldMark(field.key) || field.label).trim();
  }
  return field.label.trim();
}

export function getDefaultSections(language: ResumeLanguage): ResumeSectionConfig[] {
  const copy = getResumeCopy(language);
  return resumeSectionIds.map((id) => ({
    id,
    title: copy[id],
    visible: true
  }));
}

export function normalizeResumeLanguage(resume: ResumeLike): ResumeData {
  const language = getResumeLanguage(resume);
  const basics = normalizeBasics(resume.basics);
  const hasBasicFields = Array.isArray(resume.basicFields);
  const basicFields = hasBasicFields ? normalizeBasicFields(resume.basicFields ?? [], basics, language) : createDefaultBasicFields(basics, language);
  const syncedBasics = syncBasicsFromFields(basics, basicFields);

  return {
    ...resume,
    language,
    theme: normalizeTheme(resume.theme),
    sections: normalizeSections(resume.sections, language),
    basicFields,
    basics: syncedBasics
  };
}

export function getResumeAccentColor(resume: ResumeData, template: TemplateMeta): string {
  return isHexColor(resume.theme?.accentColor) ? resume.theme.accentColor : template.accentColor;
}

export function isHexColor(value: string | undefined): value is string {
  return Boolean(value && /^#[0-9a-fA-F]{6}$/.test(value));
}

function normalizeBasics(basics: Basics): Basics {
  return {
    name: basics.name ?? "",
    title: basics.title ?? "",
    email: basics.email ?? "",
    phone: basics.phone ?? "",
    location: basics.location ?? "",
    website: basics.website ?? "",
    github: basics.github ?? "",
    linkedin: basics.linkedin ?? ""
  };
}

function normalizeTheme(theme: ResumeLike["theme"]): ResumeData["theme"] {
  return {
    accentColor: isHexColor(theme?.accentColor) ? theme.accentColor : defaultAccentColor
  };
}

function createDefaultBasicFields(basics: Basics, language: ResumeLanguage): BasicField[] {
  return (Object.keys(basicFieldLabels[language]) as Array<keyof Basics>).map((key) => {
    const placement = getBasicFieldPlacement({ key });
    return {
      id: key,
      key,
      label: basicFieldLabels[language][key],
      value: basics[key] ?? "",
      placement,
      labelMode: getBasicFieldLabelMode({ key, placement }),
      labelMark: getDefaultBasicFieldMark(key),
      labelIcon: getDefaultBasicFieldIcon(key)
    };
  });
}

function normalizeBasicFields(fields: BasicField[], basics: Basics, language: ResumeLanguage): BasicField[] {
  return fields.map((field, index) => {
    const key = isBasicKey(field.key) ? field.key : undefined;
    const placement = getBasicFieldPlacement({ key, placement: field.placement });
    const labelMode = getBasicFieldLabelMode({ key, placement, labelMode: field.labelMode });
    return {
      id: field.id || `basic-${index}`,
      key,
      label: field.label || (key ? basicFieldLabels[language][key] : getAppCopy(language).editor.customField),
      value: field.value ?? (key ? basics[key] : ""),
      placement,
      labelMode,
      labelMark: field.labelMark ?? getDefaultBasicFieldMark(key),
      labelIcon: isBasicFieldLabelIcon(field.labelIcon) ? field.labelIcon : getDefaultBasicFieldIcon(key)
    };
  });
}

function syncBasicsFromFields(basics: Basics, fields: BasicField[]): Basics {
  return fields.reduce(
    (next, field) => {
      if (isBasicKey(field.key)) {
        next[field.key] = field.value;
      }
      return next;
    },
    { ...basics }
  );
}

function normalizeSections(sections: ResumeSectionConfig[] | undefined, language: ResumeLanguage): ResumeSectionConfig[] {
  const defaults = getDefaultSections(language);
  if (!Array.isArray(sections) || sections.length === 0) {
    return defaults;
  }

  const normalized = sections
    .filter((section) => resumeSectionIds.includes(section.id))
    .map((section) => {
      const fallback = defaults.find((item) => item.id === section.id);
      return {
        id: section.id,
        title: section.title || fallback?.title || section.id,
        visible: section.visible !== false
      };
    });
  const existingIds = new Set(normalized.map((section) => section.id));
  const missing = defaults.filter((section) => !existingIds.has(section.id));

  return [...normalized, ...missing];
}

function isBasicKey(value: unknown): value is keyof Basics {
  return typeof value === "string" && value in basicFieldLabels["zh-CN"];
}

function isBasicFieldPlacement(value: unknown): value is BasicFieldPlacement {
  return value === "name" || value === "headline" || value === "contact" || value === "hidden";
}

function isBasicFieldLabelMode(value: unknown): value is BasicFieldLabelMode {
  return value === "text" || value === "mark" || value === "custom" || value === "none";
}

function isBasicFieldLabelIcon(value: unknown): value is BasicFieldLabelIcon {
  return value === "email" || value === "phone" || value === "location" || value === "website" || value === "github" || value === "linkedin" || value === "link";
}
