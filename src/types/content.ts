export const CATEGORIES = [
  'score',
  'drip',
  'order',
  'ladder',
  'protocol',
  'reference',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export interface ContentFrontmatter {
  id: string;
  title: string;
  category: Category;
  tags?: string[];
  keywords?: string[];
  related?: string[];
  source?: string;
  last_reviewed?: string;
  confidence?: Confidence;
}

export interface ContentMeta extends ContentFrontmatter {
  /** Vite module path; used internally by the loader. */
  path: string;
}
