import type { ComponentType } from 'react';
import {
  CATEGORIES,
  SEVERITY_LEVELS,
  type ContentFrontmatter,
  type ContentMeta,
} from '@/types/content';

type MDXModule = {
  default: ComponentType<Record<string, unknown>>;
  frontmatter?: Partial<ContentFrontmatter>;
};

/**
 * All MDX content is bundled eagerly. With ~70 short pieces this keeps the
 * registry + renderer synchronous and the whole library available offline
 * after first paint. Revisit chunk-splitting if total bundle grows large.
 */
const MODULES = import.meta.glob<MDXModule>('/src/content/**/*.mdx', {
  eager: true,
});

interface RegistryEntry extends ContentMeta {
  Component: ComponentType<Record<string, unknown>>;
}

function fileIdFromPath(path: string): string {
  const base = path.split('/').pop() ?? path;
  return base.replace(/\.mdx$/, '');
}

function buildRegistry(): Map<string, RegistryEntry> {
  const registry = new Map<string, RegistryEntry>();
  for (const [path, mod] of Object.entries(MODULES)) {
    const fm = mod.frontmatter ?? {};
    const id = (fm.id ?? fileIdFromPath(path)).trim();
    if (!id) continue;
    if (registry.has(id)) {
      console.warn(`[content] duplicate id "${id}" at ${path}`);
      continue;
    }
    if (!fm.title) {
      console.warn(`[content] missing title for ${path}`);
      continue;
    }
    if (!fm.category || !CATEGORIES.includes(fm.category)) {
      console.warn(`[content] invalid category for ${path}: ${String(fm.category)}`);
      continue;
    }
    if (fm.severity && !SEVERITY_LEVELS.includes(fm.severity)) {
      console.warn(
        `[content] unknown severity "${String(fm.severity)}" at ${path}; ignoring`,
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
      path,
      Component: mod.default,
    });
  }
  return registry;
}

const REGISTRY = buildRegistry();

function metaOf(entry: RegistryEntry): ContentMeta {
  const { Component: _Component, ...meta } = entry;
  void _Component;
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

export function getContent(id: string):
  | { meta: ContentMeta; Component: ComponentType<Record<string, unknown>> }
  | null {
  const entry = REGISTRY.get(id);
  if (!entry) return null;
  return { meta: metaOf(entry), Component: entry.Component };
}
