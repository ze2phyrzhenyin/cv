import type { ResumeData } from "@/types/resume";

export const sampleResume: ResumeData = {
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
};
