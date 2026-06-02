# ResumeTeX

ResumeTeX 是一个基于 `restaurant` 目录下 `ai-dev-framework` 工作流初始化的 LaTeX 简历制作 MVP。

当前版本优先打通可运行闭环：

- 结构化填写简历信息
- 选择 3 个 LaTeX 简历模板
- 生成 LaTeX 源码
- 浏览器内 A4 预览
- 导出 `.tex`
- 通过浏览器打印为 PDF
- 本地草稿自动保存

容器化 TeX Live 编译 Worker、PostgreSQL、Redis、对象存储和用户系统保留在产品文档里，作为下一阶段实现范围。

## Commands

```bash
pnpm install
pnpm run dev
pnpm run worker:compile
pnpm run typecheck
pnpm run test
pnpm run build
```

开发时需要两个进程：

```bash
pnpm run dev
pnpm run worker:compile
```

Web 服务启动后打开 `http://localhost:3000`。如果端口被占用，Next.js 会自动切换到下一个端口。

## Compile Worker

`POST /api/compile` 会把任务写入 `.data/compile/jobs`，不会在 Web 请求里直接跑 TeX。Worker 通过 `pnpm run worker:compile` 轮询队列，生成的 PDF 存在 `.data/compile/artifacts`，前端会轮询任务状态并显示下载入口。

默认使用本机 `latexmk` 和 `xelatex`：

```bash
pnpm run worker:compile
```

也可以切到 Docker 沙箱模式：

```bash
docker build -t resume-tex-compiler:local compiler
RESUME_TEX_COMPILE_MODE=docker RESUME_TEX_DOCKER_IMAGE=resume-tex-compiler:local pnpm run worker:compile
```

Docker 模式会禁用网络并限制 CPU、内存和进程数。生产环境仍建议替换为 Redis/BullMQ 队列和对象存储。

## Templates

模板以包的形式存储在 `.data/templates`，首次访问模板 API 时会从内置模板自动初始化。当前内置模板包括：

- `modern-tech`
- `academic-clean`
- `ats-classic`
- `cross-border-ecommerce`
- `campus-operations`
- `product-marketing`

每个模板包包含公开元数据、标签和 LaTeX 组件片段，例如 preamble、header、section、entry、bullets、skills。`GET /api/templates/:templateId` 可以查看完整模板包。

## Framework Notes

本项目已安装 `restaurant` 框架的 `.cx` 工作流资源：

- `AGENTS.md`
- `.cx/config.yaml`
- `.cx/policies`
- `.cx/prompts`
- `.agents/skills`
- `docs/agent`

项目本身采用与框架内 `smart-menu-mvp` blueprint 相同的轻量 Next.js/TypeScript 思路，但业务域替换为 ResumeTeX。
