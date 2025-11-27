#!/usr/bin/env bun
import fs from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";
import { resolveRefs } from "json-refs";
import jsonSchemaToZod from "../node_modules/json-schema-to-zod/src/index";

const routerJsonSchemas = path.resolve(
  __dirname,
  "../../../../router/resources/json_schemas",
);
const outDir = path.resolve(__dirname, "../generated/router_schemas");

async function getJsonFilesByShell(findRoot: string) {
  const out = await $`find ${findRoot} -type f -name '*.json' -print0`.text();
  // find -print0 - files separated by NUL
  const files = out.split("\0").filter(Boolean);
  return files;
}

async function convertFile(file: string) {
  const rel = path.relative(routerJsonSchemas, file);
  const target = path.join(outDir, rel).replace(/\.json$/, ".ts");
  const targetDir = path.dirname(target);
  await fs.mkdir(targetDir, { recursive: true });

  const rawText = await fs.readFile(file, "utf-8");
  const raw = JSON.parse(rawText) as Record<string, unknown>;

  const originalCwd = process.cwd();
  let resolvedSchema: Record<string, unknown> | undefined;
  try {
    process.chdir(routerJsonSchemas);
    const resolvedResult = await resolveRefs(raw);
    resolvedSchema = resolvedResult.resolved as Record<string, unknown>;
  } finally {
    process.chdir(originalCwd);
  }
  if (!resolvedSchema) {
    throw new Error(`Failed to resolve schema refs for ${file}`);
  }
  // If schema has no type at root level and has properties, add type: "object"
  if (
    !resolvedSchema.type &&
    (resolvedSchema.properties || resolvedSchema.required)
  ) {
    resolvedSchema.type = "object";
  }

  const outCode = jsonSchemaToZod(resolvedSchema, {
    name: path.basename(target, ".ts"),
    depth: 1000,
    module: "esm",
    type: true,
  });

  await fs.writeFile(target, outCode, "utf-8");
  console.log("Generated", target);
}

async function generateIndexFiles(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries
    .filter(
      (e) => e.isFile() && e.name.endsWith(".ts") && e.name !== "index.ts",
    )
    .map((e) => e.name);
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  // Only create index.ts when this directory actually contains schema files
  if (files.length > 0) {
    const contentLines: string[] = [];
    files.sort();
    for (const f of files) {
      const base = f.replace(/\.ts$/, "");
      contentLines.push(`export * from './${base}';`);
    }
    const out = `${contentLines.join("\n")}\n`;
    await fs.writeFile(path.join(dir, "index.ts"), out, "utf-8");
  }
  // Recurse into subdirectories to generate their indexes too
  for (const d of dirs) {
    await generateIndexFiles(path.join(dir, d));
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const files = await getJsonFilesByShell(routerJsonSchemas);
  await Promise.all(files.map(convertFile));
  await generateIndexFiles(outDir);
  await $`bun x biome check --write ${outDir}`;
}

if (import.meta.main) {
  await main();
}
