import { Link } from 'react-router-dom';
import { CATEGORIES, type Category } from '@/types/content';
import type { SearchHit } from '@/lib/search';

const CATEGORY_LABEL_TH: Record<Category, string> = {
  score: 'Scores',
  drip: 'Drips',
  order: 'Order Sets',
  ladder: 'Ladders',
  protocol: 'Protocols',
  reference: 'Reference',
};

type Props = {
  query: string;
  hits: SearchHit[];
};

export default function SearchResults({ query, hits }: Props) {
  if (query.trim().length < 2) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อเริ่มค้นหา
      </p>
    );
  }
  if (hits.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        ไม่พบผลลัพธ์สำหรับ <span className="font-medium">"{query}"</span>
      </p>
    );
  }

  const groups = new Map<Category, SearchHit[]>();
  for (const hit of hits) {
    const cat = hit.meta.category;
    const arr = groups.get(cat);
    if (arr) arr.push(hit);
    else groups.set(cat, [hit]);
  }

  return (
    <div className="space-y-5" aria-live="polite">
      <p className="text-xs text-muted-foreground">
        พบ {hits.length} รายการ
      </p>
      {CATEGORIES.filter((c) => groups.has(c)).map((cat) => (
        <section key={cat}>
          <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {CATEGORY_LABEL_TH[cat]}
          </h2>
          <ul className="divide-y divide-border rounded-md border">
            {groups.get(cat)!.map(({ meta }) => (
              <li key={meta.id}>
                <Link
                  to={`/content/${meta.id}`}
                  className="flex flex-col gap-0.5 px-3 py-2.5 hover:bg-accent active:bg-accent/80"
                >
                  <span className="text-sm font-medium leading-tight">
                    {meta.title}
                  </span>
                  {meta.titleTh ? (
                    <span className="text-xs text-muted-foreground">
                      {meta.titleTh}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
