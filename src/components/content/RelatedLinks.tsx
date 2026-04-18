import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getContentMeta } from '@/lib/content';

type RelatedLinksProps = {
  ids: string[];
};

export default function RelatedLinks({ ids }: RelatedLinksProps) {
  if (ids.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="mb-2 text-sm font-medium text-muted-foreground"
      >
        Related
      </h2>
      <ul className="divide-y rounded-lg border bg-card text-sm">
        {ids.map((id) => {
          const meta = getContentMeta(id);
          if (!meta) {
            return (
              <li
                key={id}
                className="flex items-center justify-between px-3 py-2.5 text-muted-foreground"
              >
                <span className="line-through opacity-70">{id}</span>
                <span className="text-xs uppercase">missing</span>
              </li>
            );
          }
          return (
            <li key={id}>
              <Link
                to={`/content/${meta.id}`}
                className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-accent"
              >
                <span className="flex flex-col">
                  <span className="font-medium">{meta.title}</span>
                  <span className="text-xs uppercase text-muted-foreground">
                    {meta.category}
                  </span>
                </span>
                <ArrowRight size={16} className="text-muted-foreground" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
