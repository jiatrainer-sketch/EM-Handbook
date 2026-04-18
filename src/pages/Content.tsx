import { useParams } from 'react-router-dom';
import { getContent } from '@/lib/content';

export default function Content() {
  const { id } = useParams<{ id: string }>();
  const entry = id ? getContent(id) : null;

  if (!entry) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">ไม่พบเนื้อหา</h1>
        <p className="text-sm text-muted-foreground">id: {id ?? '-'}</p>
      </div>
    );
  }

  const { meta, Component } = entry;
  return (
    <article className="space-y-3">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>
        <p className="text-xs uppercase text-muted-foreground">{meta.category}</p>
      </header>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <Component />
      </div>
    </article>
  );
}
