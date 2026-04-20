import { Link } from 'react-router-dom';
import { getContentMeta } from '@/lib/content';

type Variant = 'tile' | 'row';

type Props = {
  ids: readonly string[];
  variant?: Variant;
  emptyText?: string;
};

/** Resolves ids → known content metas, dropping unknown ids silently. */
function resolve(ids: readonly string[]) {
  return ids
    .map((id) => getContentMeta(id))
    .filter((m): m is NonNullable<ReturnType<typeof getContentMeta>> => !!m);
}

export default function PieceList({ ids, variant = 'tile', emptyText }: Props) {
  const items = resolve(ids);
  if (items.length === 0) {
    return emptyText ? (
      <p className="rounded-lg border bg-card p-3 text-center text-xs text-muted-foreground">
        {emptyText}
      </p>
    ) : null;
  }

  if (variant === 'tile') {
    return (
      <ul className="grid grid-cols-2 gap-2">
        {items.map((m) => (
          <li key={m.id}>
            <Link
              to={`/content/${m.id}`}
              className="block h-full rounded-lg border bg-card p-3 text-sm hover:bg-accent active:bg-accent/80"
            >
              <span className="block font-medium leading-tight">{m.title}</span>
              {m.titleTh ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {m.titleTh}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border bg-card text-sm">
      {items.map((m) => (
        <li key={m.id}>
          <Link
            to={`/content/${m.id}`}
            className="flex flex-col gap-0.5 px-3 py-2.5 hover:bg-accent active:bg-accent/80"
          >
            <span className="font-medium leading-tight">{m.title}</span>
            {m.titleTh ? (
              <span className="text-xs text-muted-foreground">{m.titleTh}</span>
            ) : null}
            {m.clinicalContext ? (
              <span className="text-[11px] text-muted-foreground/70 leading-snug">
                ใช้ใน: {m.clinicalContext}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
