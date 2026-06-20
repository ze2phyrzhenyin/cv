import type { ResumeData, ResumeLanguage } from "@/types/resume";
import { normalizeResumeLanguage } from "./resume-language";

export const sampleResumes: Record<ResumeLanguage, ResumeData> = {
  "zh-CN": normalizeResumeLanguage({
    language: "zh-CN",
    basics: {
      name: "张三",
      title: "后端开发工程师",
      email: "zhangsan@example.com",
      phone: "+86 138 0000 0000",
      location: "上海",
      website: "https://example.com",
      github: "https://github.com/example",
      linkedin: ""
    },
    summary:
      "3 年后端开发经验，熟悉 TypeScript、Java、PostgreSQL 与分布式系统。关注接口稳定性、性能优化和工程化交付。",
    education: [
      {
        id: "edu-1",
        organization: "上海交通大学",
        role: "计算机科学与技术 本科",
        location: "上海",
        startDate: "2019-09",
        endDate: "2023-06",
        highlights: ["GPA 3.8/4.0", "校级优秀毕业生"]
      }
    ],
    experience: [
      {
        id: "exp-1",
        organization: "某科技公司",
        role: "后端开发工程师",
        location: "上海",
        startDate: "2023-07",
        endDate: "至今",
        highlights: [
          "负责订单系统核心接口开发，支持日均百万级请求。",
          "将关键接口 P95 延迟从 420ms 降低至 180ms。",
          "设计 Redis 缓存策略，降低数据库峰值查询压力。"
        ]
      }
    ],
    projects: [
      {
        id: "project-1",
        name: "在线简历生成系统",
        role: "全栈开发",
        url: "https://example.com",
        techStack: "Next.js, TypeScript, LaTeX, PostgreSQL",
        highlights: [
          "设计结构化 Resume JSON，并通过模板引擎生成 LaTeX 源码。",
          "封装编译任务接口，预留容器化 XeLaTeX Worker。"
        ]
      }
    ],
    skills: [
      {
        id: "skill-1",
        category: "编程语言",
        items: ["TypeScript", "Java", "Python"]
      },
      {
        id: "skill-2",
        category: "数据库",
        items: ["PostgreSQL", "Redis", "MySQL"]
      }
    ],
    awards: [
      {
        id: "award-1",
        title: "ACM 校赛一等奖",
        issuer: "上海交通大学",
        date: "2022"
      }
    ]
  }),
  en: normalizeResumeLanguage({
    language: "en",
    basics: {
      name: "Zhang San",
      title: "Backend Software Engineer",
      email: "zhangsan@example.com",
      phone: "+86 138 0000 0000",
      location: "Shanghai",
      website: "https://example.com",
      github: "https://github.com/example",
      linkedin: ""
    },
    summary:
      "Backend engineer with 3 years of experience in TypeScript, Java, PostgreSQL, and distributed systems. Focused on API reliability, performance optimization, and engineering delivery.",
    education: [
      {
        id: "edu-1",
        organization: "Shanghai Jiao Tong University",
        role: "B.S. in Computer Science and Technology",
        location: "Shanghai",
        startDate: "2019-09",
        endDate: "2023-06",
        highlights: ["GPA 3.8/4.0", "Outstanding Graduate Award"]
      }
    ],
    experience: [
      {
        id: "exp-1",
        organization: "Technology Company",
        role: "Backend Software Engineer",
        location: "Shanghai",
        startDate: "2023-07",
        endDate: "Present",
        highlights: [
          "Built core order-service APIs supporting over 1M requests per day.",
          "Reduced P95 latency on key endpoints from 420 ms to 180 ms.",
          "Designed a Redis caching strategy that reduced peak database read pressure."
        ]
      }
    ],
    projects: [
      {
        id: "project-1",
        name: "Online Resume Generator",
        role: "Full-Stack Developer",
        url: "https://example.com",
        techStack: "Next.js, TypeScript, LaTeX, PostgreSQL",
        highlights: [
          "Designed a structured Resume JSON format and generated LaTeX source through a template engine.",
          "Built the compile-job API and reserved a containerized XeLaTeX worker path."
        ]
      }
    ],
    skills: [
      {
        id: "skill-1",
        category: "Programming Languages",
        items: ["TypeScript", "Java", "Python"]
      },
      {
        id: "skill-2",
        category: "Databases",
        items: ["PostgreSQL", "Redis", "MySQL"]
      }
    ],
    awards: [
      {
        id: "award-1",
        title: "First Prize, ACM Campus Contest",
        issuer: "Shanghai Jiao Tong University",
        date: "2022"
      }
    ]
  }),
  fr: normalizeResumeLanguage({
    language: "fr",
    basics: {
      name: "Zhang San",
      title: "Ingénieur logiciel backend",
      email: "zhangsan@example.com",
      phone: "+86 138 0000 0000",
      location: "Shanghai",
      website: "https://example.com",
      github: "https://github.com/example",
      linkedin: ""
    },
    summary:
      "Ingénieur backend avec 3 ans d'expérience en TypeScript, Java, PostgreSQL et systèmes distribués. Spécialisé dans la fiabilité des API, l'optimisation des performances et la livraison technique.",
    education: [
      {
        id: "edu-1",
        organization: "Université Jiao Tong de Shanghai",
        role: "Licence en informatique et technologies",
        location: "Shanghai",
        startDate: "2019-09",
        endDate: "2023-06",
        highlights: ["GPA 3.8/4.0", "Diplômé d'excellence"]
      }
    ],
    experience: [
      {
        id: "exp-1",
        organization: "Entreprise technologique",
        role: "Ingénieur logiciel backend",
        location: "Shanghai",
        startDate: "2023-07",
        endDate: "Aujourd'hui",
        highlights: [
          "Développement d'API centrales du système de commandes, avec plus d'un million de requêtes quotidiennes.",
          "Réduction de la latence P95 des endpoints clés de 420 ms à 180 ms.",
          "Conception d'une stratégie de cache Redis réduisant la pression de lecture en pic sur la base de données."
        ]
      }
    ],
    projects: [
      {
        id: "project-1",
        name: "Générateur de CV en ligne",
        role: "Développeur full-stack",
        url: "https://example.com",
        techStack: "Next.js, TypeScript, LaTeX, PostgreSQL",
        highlights: [
          "Conception d'un format Resume JSON structuré et génération du code LaTeX via un moteur de templates.",
          "Mise en place de l'API de compilation et préparation d'un worker XeLaTeX conteneurisé."
        ]
      }
    ],
    skills: [
      {
        id: "skill-1",
        category: "Langages de programmation",
        items: ["TypeScript", "Java", "Python"]
      },
      {
        id: "skill-2",
        category: "Bases de données",
        items: ["PostgreSQL", "Redis", "MySQL"]
      }
    ],
    awards: [
      {
        id: "award-1",
        title: "Premier prix, concours ACM du campus",
        issuer: "Université Jiao Tong de Shanghai",
        date: "2022"
      }
    ]
  })
};

export const sampleResume: ResumeData = sampleResumes["zh-CN"];
