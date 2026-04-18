#!/usr/bin/env node
// Scan src/content/**/*.mdx, parse YAML frontmatter, and emit
// src/content/_registry.generated.ts. This lets content.ts import a small
// typed registry (just metadata + a lazy loader map key) instead of
// embedding the raw text of every MDX file in the main bundle.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = resolve(ROOT, 'src/content');
const OUT_PATH = resolve(CONTENT_DIR, '_registry.generated.ts');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(path);
    }
  }
  return files;
}

function extractFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    const parsed = parseYaml(match[1]);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.warn('[content-registry] failed to parse frontmatter:', err?.message ?? err);
    return null;
  }
}

function fileIdFromPath(path) {
  const base = path.split(/[/\\]/).pop() ?? path;
  return base.replace(/\.mdx$/, '');
}

async function main() {
  const files = await walk(CONTENT_DIR);
  const entries = [];

  for (const file of files.sort()) {
    const raw = await readFile(file, 'utf8');
    const fm = extractFrontmatter(raw);
    if (!fm) continue;
    const relPath = relative(ROOT, file).split('\\').join('/');
    // We store paths relative to /src so they match the same keys that
    // Vite's import.meta.glob('/src/content/**/*.mdx') produces.
    const globKey = '/' + relPath;
    const id = (fm.id ?? fileIdFromPath(file)).trim();
    entries.push({
      id,
      path: globKey,
      frontmatter: fm,
    });
  }

  const header = `// GENERATED FILE — do not edit by hand.
// Run \`npm run build:registry\` (or any \`npm run build\`) to refresh.
//
// Produced by scripts/generate-content-registry.mjs: every MDX piece's
// frontmatter is bundled here so content.ts can load metadata without
// embedding the raw MDX text in the main JS chunk.

import type { ContentFrontmatter } from '@/types/content';

export type RegistryEntry = {
  id: string;
  path: string;
  frontmatter: Partial<ContentFrontmatter>;
};

export const CONTENT_REGISTRY: RegistryEntry[] = ${JSON.stringify(entries, null, 2)};
`;

  await writeFile(OUT_PATH, header, 'utf8');
  console.info(
    `[content-registry] wrote ${entries.length} entries → ${relative(ROOT, OUT_PATH)}`,
  );
}

main().catch((err) => {
  console.error('[content-registry] failed', err);
  process.exit(1);
});
