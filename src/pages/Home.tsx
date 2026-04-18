import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import PieceList from '@/components/home/PieceList';
import { useFavorites } from '@/hooks/useFavorites';
import { listByCategory } from '@/lib/content';
import { CATEGORIES, type Category } from '@/types/content';

const BROWSE_LABELS: Record<Category, string> = {
  score: 'Scores',
  drip: 'Drips',
  order: 'Orders',
  ladder: 'Ladders',
  protocol: 'Protocols',
  symptom: 'Symptoms',
  reference: 'Reference',
};

export default function Home() {
  const { pinned, recents, pinLimit } = useFavorites();

  return (
    <div className="space-y-6">
      <section>
        <Link
          to="/search"
          className="flex items-center gap-2 rounded-lg border bg-card p-3 text-sm text-muted-foreground hover:bg-accent"
        >
          <SearchIcon size={16} aria-hidden />
          <span>ค้นหา score / drip / protocol…</span>
          <kbd className="ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] sm:inline-flex">
            ⌘K
          </kbd>
        </Link>
      </section>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            ⭐ ปักหมุด
          </h2>
          <span className="text-[11px] text-muted-foreground">
            {pinned.length}/{pinLimit}
          </span>
        </div>
        <PieceList
          ids={pinned}
          variant="tile"
          emptyText="ยังไม่ได้ปักหมุด — กดปุ่ม 📌 ในหน้าเนื้อหาเพื่อเพิ่ม"
        />
      </section>

      {recents.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">
            🕒 เปิดล่าสุด
          </h2>
          <PieceList ids={recents.slice(0, 5)} variant="row" />
        </section>
      ) : null}

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          📂 Browse
        </h2>
        <ul className="divide-y rounded-lg border bg-card text-sm">
          {CATEGORIES.filter((c) => c !== 'reference').map((c) => {
            const count = listByCategory(c).length;
            return (
              <li key={c}>
                <Link
                  to={`/browse/${c}`}
                  className="flex justify-between px-3 py-2.5 text-muted-foreground hover:bg-accent active:bg-accent/80"
                >
                  <span className="text-foreground">{BROWSE_LABELS[c]}</span>
                  <span>{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <nav className="flex flex-col gap-2 text-sm">
        <Link
          to="/tools"
          className="rounded-lg border bg-card px-3 py-3 hover:bg-accent"
        >
          🛠 Tools →
        </Link>
        <Link
          to="/symptoms"
          className="rounded-lg border bg-card px-3 py-3 hover:bg-accent"
        >
          🆘 By symptom →
        </Link>
      </nav>
    </div>
  );
}
