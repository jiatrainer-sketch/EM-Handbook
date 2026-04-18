import { cn } from '@/lib/utils';
import type { Category, Confidence } from '@/types/content';

type ContentHeaderProps = {
  title: string;
  category: Category;
  confidence?: Confidence;
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

export default function ContentHeader({
  title,
  category,
  confidence,
}: ContentHeaderProps) {
  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-md border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          {CATEGORY_LABELS[category]}
        </span>
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
      <h1 className="text-2xl font-semibold leading-tight tracking-tight">
        {title}
      </h1>
    </header>
  );
}
