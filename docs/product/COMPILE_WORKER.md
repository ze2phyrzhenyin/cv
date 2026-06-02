# Compile Worker

## Local Mode

```bash
pnpm run worker:compile
```

Requirements:

- `latexmk`
- `xelatex`
- CJK font support, preferably Noto Sans CJK, PingFang SC, or Fandol

## Docker Mode

```bash
docker build -t resume-tex-compiler:local compiler
RESUME_TEX_COMPILE_MODE=docker RESUME_TEX_DOCKER_IMAGE=resume-tex-compiler:local pnpm run worker:compile
```

The Docker runner uses:

- `--network none`
- `--cpus 0.5`
- `--memory 512m`
- `--pids-limit 128`
- `--security-opt no-new-privileges`

## Data Layout

```text
.data/compile/
  jobs/
    job_*.json
  workspaces/
    job_*/
      main.tex
      build/
  artifacts/
    job_*.pdf
```

Set `RESUME_TEX_DATA_DIR` to move this outside the repository.
