import { access, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";

import { normalizeTemplateId, templatePackages } from "../../lib/templates";
import type { TemplateMeta, TemplatePackage } from "../../types/resume";
import { templateDataRoot, templateFile } from "./paths";

async function ensureTemplateStore(): Promise<void> {
  await mkdir(templateDataRoot(), { recursive: true });
}

export async function seedTemplates(): Promise<void> {
  await ensureTemplateStore();
  await Promise.all(templatePackages.map((templatePackage) => writeTemplatePackageIfMissing(templatePackage)));
}

export async function listTemplateMetas(): Promise<TemplateMeta[]> {
  await seedTemplates();
  const files = await readdir(templateDataRoot());
  const supportedIds = new Set(templatePackages.map((templatePackage) => templatePackage.meta.id));
  const packages = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => JSON.parse(await readFile(`${templateDataRoot()}/${file}`, "utf-8")) as TemplatePackage)
  );

  return packages
    .filter((templatePackage) => supportedIds.has(templatePackage.meta.id))
    .map((templatePackage) => templatePackage.meta)
    .sort((left, right) => left.category.localeCompare(right.category));
}

export async function readTemplatePackage(templateId: unknown): Promise<TemplatePackage | null> {
  await seedTemplates();
  try {
    return JSON.parse(await readFile(templateFile(normalizeTemplateId(templateId)), "utf-8")) as TemplatePackage;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function writeTemplatePackage(templatePackage: TemplatePackage): Promise<void> {
  await ensureTemplateStore();
  const target = templateFile(templatePackage.meta.id);
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(templatePackage, null, 2)}\n`, "utf-8");
  await rename(tmp, target);
}

async function writeTemplatePackageIfMissing(templatePackage: TemplatePackage): Promise<void> {
  try {
    await access(templateFile(templatePackage.meta.id));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeTemplatePackage(templatePackage);
      return;
    }
    throw error;
  }
}
