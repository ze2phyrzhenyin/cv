import type { ResumeData, ResumeLanguage } from "@/types/resume";
import { normalizeResumeLanguage } from "./resume-language";

export const sampleResumes: Record<ResumeLanguage, ResumeData> = {
  "zh-CN": normalizeResumeLanguage({
    language: "zh-CN",
    sections: [
      { id: "basics", title: "基本信息", visible: true },
      { id: "education", title: "教育经历", visible: true },
      { id: "experience", title: "工作经历", visible: true },
      { id: "academic", title: "学术经历", visible: true },
      { id: "skillsAwards", title: "技能", visible: true },
      { id: "summary", title: "简介", visible: false },
      { id: "projects", title: "项目", visible: false }
    ],
    basics: {
      name: "Zhaoyang SUI",
      title: "MIAGE 硕士预科学生",
      email: "zhaoyang.sui@ut-capitole.fr",
      phone: "(+33) 07 43 64 47 77",
      location: "Toulouse, France",
      website: "",
      github: "",
      linkedin: ""
    },
    basicFields: [
      { id: "name", key: "name", label: "姓名", value: "Zhaoyang SUI", placement: "name", labelMode: "none" },
      { id: "title", key: "title", label: "身份", value: "MIAGE 硕士预科学生", placement: "headline", labelMode: "none" },
      { id: "age", label: "年龄", value: "23 岁", placement: "contact", labelMode: "mark", labelIcon: "age" },
      { id: "location", key: "location", label: "城市", value: "Toulouse, France", placement: "contact", labelMode: "mark", labelIcon: "location" },
      { id: "nationality", label: "国籍", value: "中国", placement: "contact", labelMode: "mark", labelIcon: "nationality" },
      { id: "phone", key: "phone", label: "电话", value: "(+33) 07 43 64 47 77", placement: "contact", labelMode: "mark", labelIcon: "phone" },
      { id: "email", key: "email", label: "邮箱", value: "zhaoyang.sui@ut-capitole.fr", placement: "contact", labelMode: "mark", labelIcon: "email" }
    ],
    summary: "",
    education: [
      {
        id: "edu-miage",
        organization: "图卢兹第一大学",
        role: "MIAGE 硕士入学预科",
        location: "图卢兹，法国",
        startDate: "2025年9月",
        endDate: "至今",
        highlights: []
      },
      {
        id: "edu-shnu",
        organization: "上海师范大学",
        role: "计算机科学本科",
        location: "上海，中国",
        startDate: "2020年10月",
        endDate: "2024年6月",
        highlights: ["平均成绩：76.13/100"]
      }
    ],
    experience: [
      {
        id: "exp-zhunshi",
        organization: "Shanghai Zhunshi Intelligent Information Technology Co., Ltd.",
        role: "C++ 开发工程师",
        location: "上海",
        startDate: "2023年5月",
        endDate: "2023年12月",
        highlights: [
          "开发 .xml/.xsd 格式转换算法，结合递归与 Visual Studio 转换功能。",
          "独立开发公司网站，使用 React、Node.js、Nginx。"
        ]
      },
      {
        id: "exp-lankuaikei",
        organization: "Shanghai Lankuaikei Technology Development Co., Ltd.",
        role: "测试工程师",
        location: "上海",
        startDate: "2022年7月",
        endDate: "2022年9月",
        highlights: ["测试大屏端和移动端软件，并编写测试文档。"]
      }
    ],
    academic: [
      {
        id: "academic-hcii-2025",
        title: "New Objects, New Methods, and New Verifications Bie-modernist Cultural Computing on Contemporary South Korean Literary Works",
        authors: "Zhaoyang SUI 等",
        venue: "HCII 2025",
        publicationStatus: "已发表会议论文",
        date: "2025年1月",
        doi: "",
        url: "",
        contribution: "技术实现升级",
        highlights: []
      },
      {
        id: "academic-hcii-2024",
        title: "Bie-Modernism Cultural Computing of Literary Works of \"Three Musketeers of Tie Xi\" Based on the Pre-trained Dialogue Models ChatGLM3",
        authors: "Zhaoyang SUI 等",
        venue: "HCII 2024",
        publicationStatus: "已发表会议论文",
        date: "2024年1月",
        doi: "",
        url: "",
        contribution: "大语言模型微调编程",
        highlights: ["基于 46 部中文小说训练 P-Tuning v2 模型，用于文学概念分类。"]
      },
      {
        id: "academic-wcee-2024",
        title: "Intelligent Damage Recognition of Timber Structure Connections Based on X-ray Digital Radiography Method",
        authors: "Zhaoyang SUI 等",
        venue: "WCEE 2024",
        publicationStatus: "已发表会议论文",
        date: "2023年4月",
        doi: "",
        url: "",
        contribution: "程序开发与算法设计",
        highlights: []
      }
    ],
    projects: [],
    skills: [
      {
        id: "skill-languages",
        category: "语言",
        items: ["中文：母语", "英语：B1+", "法语：B1+"]
      },
      {
        id: "skill-computing",
        category: "信息技术",
        items: [
          "C/C++、Python、Java、R、SQL",
          "Linux 部署",
          "深度学习、LLM 微调、RAG",
          "React、Node.js、Nginx"
        ]
      }
    ],
    awards: []
  }),
  en: normalizeResumeLanguage({
    language: "en",
    sections: [
      { id: "basics", title: "Basic Info", visible: true },
      { id: "education", title: "Education", visible: true },
      { id: "experience", title: "Work Experience", visible: true },
      { id: "academic", title: "Academic Experience", visible: true },
      { id: "skillsAwards", title: "Skills", visible: true },
      { id: "summary", title: "Summary", visible: false },
      { id: "projects", title: "Projects", visible: false }
    ],
    basics: {
      name: "Zhaoyang SUI",
      title: "MIAGE Master's Preparatory Year Student",
      email: "zhaoyang.sui@ut-capitole.fr",
      phone: "(+33) 07 43 64 47 77",
      location: "Toulouse, France",
      website: "",
      github: "",
      linkedin: ""
    },
    basicFields: [
      { id: "name", key: "name", label: "Name", value: "Zhaoyang SUI", placement: "name", labelMode: "none" },
      { id: "title", key: "title", label: "Profile", value: "MIAGE Master's Preparatory Year Student", placement: "headline", labelMode: "none" },
      { id: "age", label: "Age", value: "23", placement: "contact", labelMode: "mark", labelIcon: "age" },
      { id: "location", key: "location", label: "Location", value: "Toulouse, France", placement: "contact", labelMode: "mark", labelIcon: "location" },
      { id: "nationality", label: "Nationality", value: "Chinese", placement: "contact", labelMode: "mark", labelIcon: "nationality" },
      { id: "phone", key: "phone", label: "Phone", value: "(+33) 07 43 64 47 77", placement: "contact", labelMode: "mark", labelIcon: "phone" },
      { id: "email", key: "email", label: "Email", value: "zhaoyang.sui@ut-capitole.fr", placement: "contact", labelMode: "mark", labelIcon: "email" }
    ],
    summary: "",
    education: [
      {
        id: "edu-miage",
        organization: "Toulouse 1 Capitole University",
        role: "Preparatory year for MIAGE Master's admission",
        location: "Toulouse, France",
        startDate: "September 2025",
        endDate: "Present",
        highlights: []
      },
      {
        id: "edu-shnu",
        organization: "Shanghai Normal University",
        role: "Bachelor's degree in Computer Science",
        location: "Shanghai, China",
        startDate: "October 2020",
        endDate: "June 2024",
        highlights: ["Average grade: 76.13/100"]
      }
    ],
    experience: [
      {
        id: "exp-zhunshi",
        organization: "Shanghai Zhunshi Intelligent Information Technology Co., Ltd.",
        role: "C++ Development Engineer",
        location: "Shanghai",
        startDate: "May 2023",
        endDate: "December 2023",
        highlights: [
          "Developed .xml/.xsd conversion algorithms with recursion and Visual Studio conversion tooling.",
          "Built the company website with React, Node.js, and Nginx."
        ]
      },
      {
        id: "exp-lankuaikei",
        organization: "Shanghai Lankuaikei Technology Development Co., Ltd.",
        role: "Test Engineer",
        location: "Shanghai",
        startDate: "July 2022",
        endDate: "September 2022",
        highlights: ["Tested large-screen and mobile software, and wrote test documentation."]
      }
    ],
    academic: [
      {
        id: "academic-hcii-2025",
        title: "New Objects, New Methods, and New Verifications Bie-modernist Cultural Computing on Contemporary South Korean Literary Works",
        authors: "Zhaoyang SUI et al.",
        venue: "HCII 2025",
        publicationStatus: "Published conference paper",
        date: "January 2025",
        doi: "",
        url: "",
        contribution: "Technical implementation upgrade",
        highlights: []
      },
      {
        id: "academic-hcii-2024",
        title: "Bie-Modernism Cultural Computing of Literary Works of \"Three Musketeers of Tie Xi\" Based on the Pre-trained Dialogue Models ChatGLM3",
        authors: "Zhaoyang SUI et al.",
        venue: "HCII 2024",
        publicationStatus: "Published conference paper",
        date: "January 2024",
        doi: "",
        url: "",
        contribution: "LLM fine-tuning programming",
        highlights: ["Trained P-Tuning v2 models on 46 Chinese novels for literary concept classification."]
      },
      {
        id: "academic-wcee-2024",
        title: "Intelligent Damage Recognition of Timber Structure Connections Based on X-ray Digital Radiography Method",
        authors: "Zhaoyang SUI et al.",
        venue: "WCEE 2024",
        publicationStatus: "Published conference paper",
        date: "April 2023",
        doi: "",
        url: "",
        contribution: "Programming and algorithm design",
        highlights: []
      }
    ],
    projects: [],
    skills: [
      {
        id: "skill-languages",
        category: "Languages",
        items: ["Chinese: native", "English: B1+", "French: B1+"]
      },
      {
        id: "skill-computing",
        category: "Technical Skills",
        items: [
          "C/C++, Python, Java, R, SQL",
          "Linux deployment",
          "Deep learning, LLM fine-tuning, RAG",
          "React, Node.js, Nginx"
        ]
      }
    ],
    awards: []
  }),
  fr: normalizeResumeLanguage({
    language: "fr",
    sections: [
      { id: "basics", title: "Infos de base", visible: true },
      { id: "education", title: "Formation", visible: true },
      { id: "experience", title: "Expérience professionnelle", visible: true },
      { id: "academic", title: "Expérience académique", visible: true },
      { id: "skillsAwards", title: "Compétences", visible: true },
      { id: "summary", title: "Profil", visible: false },
      { id: "projects", title: "Projets", visible: false }
    ],
    basics: {
      name: "Zhaoyang SUI",
      title: "Étudiant en année préparatoire Master MIAGE",
      email: "zhaoyang.sui@ut-capitole.fr",
      phone: "(+33) 07 43 64 47 77",
      location: "Toulouse, France",
      website: "",
      github: "",
      linkedin: ""
    },
    basicFields: [
      { id: "name", key: "name", label: "Nom", value: "Zhaoyang SUI", placement: "name", labelMode: "none" },
      { id: "title", key: "title", label: "Profil", value: "Étudiant en année préparatoire Master MIAGE", placement: "headline", labelMode: "none" },
      { id: "age", label: "Âge", value: "23 ans", placement: "contact", labelMode: "mark", labelIcon: "age" },
      { id: "location", key: "location", label: "Lieu", value: "Toulouse, France", placement: "contact", labelMode: "mark", labelIcon: "location" },
      { id: "nationality", label: "Nationalité", value: "chinoise", placement: "contact", labelMode: "mark", labelIcon: "nationality" },
      { id: "phone", key: "phone", label: "Téléphone", value: "(+33) 07 43 64 47 77", placement: "contact", labelMode: "mark", labelIcon: "phone" },
      { id: "email", key: "email", label: "E-mail", value: "zhaoyang.sui@ut-capitole.fr", placement: "contact", labelMode: "mark", labelIcon: "email" }
    ],
    summary: "",
    education: [
      {
        id: "edu-miage",
        organization: "Université Toulouse 1 Capitole",
        role: "Année préparatoire pour entrer en Master MIAGE",
        location: "Toulouse, France",
        startDate: "Septembre 2025",
        endDate: "Présent",
        highlights: []
      },
      {
        id: "edu-shnu",
        organization: "Université normale de Shanghai",
        role: "Licence en Informatique",
        location: "Shanghai, Chine",
        startDate: "Octobre 2020",
        endDate: "Juin 2024",
        highlights: ["Moyenne : 76,13/100"]
      }
    ],
    experience: [
      {
        id: "exp-zhunshi",
        organization: "Shanghai Zhunshi Intelligent Information Technology Co., Ltd.",
        role: "Ingénieur de développement C++",
        location: "Shanghai",
        startDate: "Mai 2023",
        endDate: "Décembre 2023",
        highlights: [
          "Conversion .xml/.xsd avec récursivité et outils Visual Studio.",
          "Développement du site web de l'entreprise avec React, Node.js et Nginx."
        ]
      },
      {
        id: "exp-lankuaikei",
        organization: "Shanghai Lankuaikei Technology Development Co., Ltd.",
        role: "Ingénieur de test",
        location: "Shanghai",
        startDate: "Juillet 2022",
        endDate: "Septembre 2022",
        highlights: ["Test de logiciels pour grands écrans et mobiles, et rédaction de la documentation de test."]
      }
    ],
    academic: [
      {
        id: "academic-hcii-2025",
        title: "New Objects, New Methods, and New Verifications Bie-modernist Cultural Computing on Contemporary South Korean Literary Works",
        authors: "Zhaoyang SUI et al.",
        venue: "HCII 2025",
        publicationStatus: "Article de conférence publié",
        date: "Janvier 2025",
        doi: "",
        url: "",
        contribution: "Mise à niveau de l'implémentation technique",
        highlights: []
      },
      {
        id: "academic-hcii-2024",
        title: "Bie-Modernism Cultural Computing of Literary Works of \"Three Musketeers of Tie Xi\" Based on the Pre-trained Dialogue Models ChatGLM3",
        authors: "Zhaoyang SUI et al.",
        venue: "HCII 2024",
        publicationStatus: "Article de conférence publié",
        date: "Janvier 2024",
        doi: "",
        url: "",
        contribution: "Programmation du fine-tuning LLM",
        highlights: ["Entraînement P-Tuning v2 sur 46 romans chinois pour classifier des concepts littéraires."]
      },
      {
        id: "academic-wcee-2024",
        title: "Intelligent Damage Recognition of Timber Structure Connections Based on X-ray Digital Radiography Method",
        authors: "Zhaoyang SUI et al.",
        venue: "WCEE 2024",
        publicationStatus: "Article de conférence publié",
        date: "Avril 2023",
        doi: "",
        url: "",
        contribution: "Programmation et conception algorithmique",
        highlights: []
      }
    ],
    projects: [],
    skills: [
      {
        id: "skill-languages",
        category: "Langues",
        items: ["Chinois : langue maternelle", "Anglais : B1+", "Français : B1+"]
      },
      {
        id: "skill-computing",
        category: "Informatique",
        items: [
          "C/C++, Python, Java, R, SQL",
          "Linux",
          "Deep learning, fine-tuning LLM, RAG",
          "React, Node.js, Nginx"
        ]
      }
    ],
    awards: []
  })
};

export const sampleResume: ResumeData = sampleResumes["zh-CN"];
