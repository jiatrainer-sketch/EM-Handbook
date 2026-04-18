import { Link, useParams } from 'react-router-dom';
import ContentFooter from '@/components/content/ContentFooter';
import ContentHeader from '@/components/content/ContentHeader';
import FavoriteButton from '@/components/content/FavoriteButton';
import RelatedLinks from '@/components/content/RelatedLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRecordVisit } from '@/hooks/useFavorites';
import { getContent } from '@/lib/content';

export default function Content() {
  const { id } = useParams<{ id: string }>();
  const entry = id ? getContent(id) : null;
  useRecordVisit(entry ? entry.meta.id : undefined);

  if (!entry) {
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

  const { meta, Component } = entry;

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
        <Component />
      </div>

      {meta.related && meta.related.length > 0 ? (
        <RelatedLinks ids={meta.related} />
      ) : null}

      <ContentFooter source={meta.source} lastReviewed={meta.last_reviewed} />
    </article>
  );
}
