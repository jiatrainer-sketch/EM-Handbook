import { useEffect, useState, type ComponentType } from 'react';
import { Link, useParams } from 'react-router-dom';
import ContentFooter from '@/components/content/ContentFooter';
import ContentHeader from '@/components/content/ContentHeader';
import FavoriteButton from '@/components/content/FavoriteButton';
import RelatedLinks from '@/components/content/RelatedLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRecordVisit } from '@/hooks/useFavorites';
import { trackContentView } from '@/lib/analytics';
import { getContentMeta, loadContent } from '@/lib/content';

type MDXComp = ComponentType<Record<string, unknown>>;

export default function Content() {
  const { id } = useParams<{ id: string }>();
  const meta = id ? getContentMeta(id) : undefined;
  useRecordVisit(meta?.id);

  const [Component, setComponent] = useState<MDXComp | null>(null);
  const [loading, setLoading] = useState<boolean>(!!meta);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!meta) return;
    trackContentView(meta.id, meta.category);
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setComponent(null);
    loadContent(meta.id)
      .then((res) => {
        if (cancelled) return;
        if (!res) {
          setLoadError('Content not found');
          return;
        }
        setComponent(() => res.Component);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'โหลดเนื้อหาไม่สำเร็จ');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [meta?.id]);

  if (!meta) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6 text-center">
          <h1 className="text-xl font-semibold">ไม่พบเนื้อหา</h1>
          <p className="text-sm text-muted-foreground">
            ไม่พบ content id <code className="font-mono">{id ?? '-'}</code>
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">← กลับหน้าหลัก</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <article className="space-y-6">
      <ContentHeader
        title={meta.title}
        titleTh={meta.titleTh}
        category={meta.category}
        subcategory={meta.subcategory}
        confidence={meta.confidence}
        severity={meta.severity}
      />

      <FavoriteButton id={meta.id} label={meta.title} />

      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:scroll-mt-20">
        {loading && !Component && <ContentSkeleton />}
        {loadError && (
          <p className="text-sm text-destructive">โหลดไม่สำเร็จ: {loadError}</p>
        )}
        {Component && <Component />}
      </div>

      {meta.related && meta.related.length > 0 ? (
        <RelatedLinks ids={meta.related} />
      ) : null}

      <ContentFooter source={meta.source} lastReviewed={meta.last_reviewed} />
    </article>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
      <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-6 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
    </div>
  );
}
