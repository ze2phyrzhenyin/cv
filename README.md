# ResumeTeX

ResumeTeX 是一个基于 `restaurant` 目录下 `ai-dev-framework` 工作流初始化的 LaTeX 简历制作 MVP。

当前版本优先打通可运行闭环：

- 结构化填写简历信息
- 使用统一 CV 版式生成 LaTeX
- 生成 LaTeX 源码
- 浏览器内 A4 预览
- 导出 `.tex`
- 通过 LaTeX Worker 生成真实 PDF 并预览/下载
- 本地草稿自动保存
- 中文、English、Français 三种网站与简历内容版本
- 自定义主题色、CV 章节名称与顺序
- 基本信息字段自由增删改

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

## Protected Publish

```bash
pnpm publish:all -- --yes
```

受保护发布命令会先运行 `pnpm run typecheck` 和 `pnpm run test`，然后把当前分支推送到已配置的 GitHub upstream。它必须带 `--yes`，会拒绝受保护分支，且会在存在未提交改动时停止；它不会自动提交文件，也不会部署到阿里云。

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

## Layout

前端现在只暴露统一 CV 版式，不再让用户选择多个模板。模板 API 只返回 `unified-cv`；旧模板 ID 会在服务端归一化到统一版式，保存版本和编译任务继续携带 `templateId` 作为兼容字段。

用户可在展示设置里修改主题色、CV 章节名称、章节显示状态和章节顺序。基本信息字段通过 `basicFields` 存储，可新增、删除、改名、排序，且可配置显示位置、标签文字、默认图案标识和自定义标识。正文编辑框支持对选中文字应用加粗、斜体、下划线和删除线，并同步到预览、PDF 和 LaTeX 导出。

## Framework Notes

本项目已安装 `restaurant` 框架的 `.cx` 工作流资源：

- `AGENTS.md`
- `.cx/config.yaml`
- `.cx/policies`
- `.cx/prompts`
- `.agents/skills`
- `docs/agent`

项目本身采用与框架内 `smart-menu-mvp` blueprint 相同的轻量 Next.js/TypeScript 思路，但业务域替换为 ResumeTeX。
