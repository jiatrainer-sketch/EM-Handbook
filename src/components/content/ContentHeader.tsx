import { cn } from '@/lib/utils';
import type { Category, Confidence, Severity } from '@/types/content';

type ContentHeaderProps = {
  title: string;
  titleTh?: string;
  category: Category;
  subcategory?: string;
  confidence?: Confidence;
  severity?: Severity;
};

const CATEGORY_LABELS: Record<Category, string> = {
  score: 'Score',
  drip: 'Drip',
  order: 'Order',
  ladder: 'Ladder',
  protocol: 'Protocol',
  reference: 'Reference',
};

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  high: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
  medium: 'border-amber-500/40 text-amber-700 dark:text-amber-300',
  low: 'border-rose-500/40 text-rose-700 dark:text-rose-300',
};

const SEVERITY_STYLES: Record<Severity, string> = {
  critical:
    'border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  high: 'border-orange-500/40 text-orange-700 dark:text-orange-300',
  medium: 'border-amber-500/40 text-amber-700 dark:text-amber-300',
  low: 'border-slate-400/40 text-slate-600 dark:text-slate-300',
};

export default function ContentHeader({
  title,
  titleTh,
  category,
  subcategory,
  confidence,
  severity,
}: ContentHeaderProps) {
  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-md border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          {CATEGORY_LABELS[category]}
          {subcategory ? (
            <span className="ml-1 font-normal opacity-70">
              · {subcategory}
            </span>
          ) : null}
        </span>
        {severity ? (
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
              SEVERITY_STYLES[severity],
            )}
            title={`Severity: ${severity}`}
          >
            {severity}
          </span>
        ) : null}
        {confidence ? (
          <span
            className={cn(
              'inline-flex items-center rounded-md border bg-background px-2 py-0.5 text-xs font-medium',
              CONFIDENCE_STYLES[confidence],
            )}
            title={`Confidence: ${confidence}`}
          >
            ● {confidence}
          </span>
        ) : null}
      </div>
      <div>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        {titleTh ? (
          <p className="text-base text-muted-foreground">{titleTh}</p>
        ) : null}
      </div>
    </header>
  );
}
