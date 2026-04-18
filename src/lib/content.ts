import type { ComponentType } from 'react';
import {
  CATEGORIES,
  SEVERITY_LEVELS,
  type ContentFrontmatter,
  type ContentMeta,
} from '@/types/content';
import { CONTENT_REGISTRY } from '@/content/_registry.generated';

type MDXModule = {
  default: ComponentType<Record<string, unknown>>;
  frontmatter?: Partial<ContentFrontmatter>;
};

/**
 * Content is split in two so the initial JS bundle stays small:
 *
 *   CONTENT_REGISTRY — generated at build time (scripts/generate-content-
 *                      registry.mjs). Contains just the parsed frontmatter
 *                      of every MDX piece, no body text. Imported eagerly.
 *
 *   LOADERS          — lazy dynamic imports of the real MDX modules. Each
 *                      one becomes a separate chunk that is only fetched
 *                      when the user navigates to /content/<id>.
 *
 * This lets search + browse + related links work synchronously at startup,
 * while the rendered clinical body is code-split per piece.
 */
const LOADERS = import.meta.glob<MDXModule>('/src/content/**/*.mdx');

function fileIdFromPath(path: string): string {
  const base = path.split('/').pop() ?? path;
  return base.replace(/\.mdx$/, '');
}

interface InternalEntry extends ContentMeta {
  loader: () => Promise<MDXModule>;
}

function buildRegistry(): Map<string, InternalEntry> {
  const registry = new Map<string, InternalEntry>();
  for (const entry of CONTENT_REGISTRY) {
    const loader = LOADERS[entry.path];
    if (!loader) {
      console.warn(
        `[content] registry references missing file ${entry.path}; did you run \`npm run build:registry\`?`,
      );
      continue;
    }
    const fm = entry.frontmatter;
    const id = (fm.id ?? entry.id ?? fileIdFromPath(entry.path)).trim();
    if (!id) continue;
    if (registry.has(id)) {
      console.warn(`[content] duplicate id "${id}" at ${entry.path}`);
      continue;
    }
    if (!fm.title) {
      console.warn(`[content] missing title for ${entry.path}`);
      continue;
    }
    if (!fm.category || !CATEGORIES.includes(fm.category)) {
      console.warn(
        `[content] invalid category for ${entry.path}: ${String(fm.category)}`,
      );
      continue;
    }
    if (fm.severity && !SEVERITY_LEVELS.includes(fm.severity)) {
      console.warn(
        `[content] unknown severity "${String(fm.severity)}" at ${entry.path}; ignoring`,
      );
    }
    registry.set(id, {
      id,
      title: fm.title,
      titleTh: fm.titleTh,
      category: fm.category,
      subcategory: fm.subcategory,
      tags: fm.tags,
      keywords: fm.keywords,
      related: fm.related,
      source: fm.source,
      last_reviewed: fm.last_reviewed,
      confidence: fm.confidence,
      severity:
        fm.severity && SEVERITY_LEVELS.includes(fm.severity)
          ? fm.severity
          : undefined,
      path: entry.path,
      loader,
    });
  }
  return registry;
}

const REGISTRY = buildRegistry();

function metaOf(entry: InternalEntry): ContentMeta {
  const { loader: _loader, ...meta } = entry;
  void _loader;
  return meta;
}

export function listContent(): ContentMeta[] {
  return Array.from(REGISTRY.values(), metaOf);
}

export function getContentMeta(id: string): ContentMeta | undefined {
  const entry = REGISTRY.get(id);
  return entry ? metaOf(entry) : undefined;
}

export function listByCategory(category: ContentMeta['category']): ContentMeta[] {
  return listContent().filter((c) => c.category === category);
}

export async function loadContent(id: string): Promise<
  | { meta: ContentMeta; Component: ComponentType<Record<string, unknown>> }
  | null
> {
  const entry = REGISTRY.get(id);
  if (!entry) return null;
  const mod = await entry.loader();
  return { meta: metaOf(entry), Component: mod.default };
}

/**
 * Synchronous metadata-only lookup. Returns null if not found; never
 * triggers a chunk fetch. Use loadContent() to render the MDX body.
 */
export function getContent(id: string): { meta: ContentMeta } | null {
  const entry = REGISTRY.get(id);
  if (!entry) return null;
  return { meta: metaOf(entry) };
}
