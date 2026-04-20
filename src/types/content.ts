export const CATEGORIES = [
  'score',
  'drip',
  'order',
  'ladder',
  'protocol',
  'symptom',
  'reference',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export type Severity = (typeof SEVERITY_LEVELS)[number];

export interface SourceObject {
  name: string;
  year?: number | string;
  url?: string;
}

export type SourceRef = string | SourceObject;

export interface ContentFrontmatter {
  id: string;
  title: string;
  /** Optional Thai-language title for display alongside the canonical title. */
  titleTh?: string;
  category: Category;
  /** Free-form subcategory, e.g. "cardiac", "endo". */
  subcategory?: string;
  tags?: string[];
  keywords?: string[];
  related?: string[];
  source?: SourceRef;
  last_reviewed?: string;
  confidence?: Confidence;
  severity?: Severity;
  /** One-line English clinical use summary (scores) */
  usedFor?: string;
  /** Thai clinical scenario where this score is applied */
  clinicalContext?: string;
}

export interface ContentMeta extends ContentFrontmatter {
  /** Vite module path; used internally by the loader. */
  path: string;
}
