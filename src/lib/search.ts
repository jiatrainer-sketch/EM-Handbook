import Fuse, { type IFuseOptions, type FuseResult } from 'fuse.js';
import { listContent } from '@/lib/content';
import type { ContentMeta } from '@/types/content';

export interface SearchHit {
  meta: ContentMeta;
  score: number;
}

const FUSE_OPTIONS: IFuseOptions<ContentMeta> = {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.4,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'titleTh', weight: 0.45 },
    { name: 'keywords', weight: 0.4 },
    { name: 'tags', weight: 0.25 },
    { name: 'id', weight: 0.2 },
    { name: 'subcategory', weight: 0.1 },
  ],
};

let fuse: Fuse<ContentMeta> | null = null;

function getFuse(): Fuse<ContentMeta> {
  if (!fuse) fuse = new Fuse(listContent(), FUSE_OPTIONS);
  return fuse;
}

export function search(query: string, limit = 30): SearchHit[] {
  const q = query.trim();
  if (q.length < 2) return [];
  return getFuse()
    .search(q, { limit })
    .map((r: FuseResult<ContentMeta>) => ({ meta: r.item, score: r.score ?? 1 }));
}
