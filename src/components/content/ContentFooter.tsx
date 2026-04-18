import { Card, CardContent } from '@/components/ui/card';
import type { SourceRef } from '@/types/content';

type ContentFooterProps = {
  source?: SourceRef;
  lastReviewed?: string;
};

function SourceLine({ source }: { source: SourceRef }) {
  if (typeof source === 'string') return <>{source}</>;
  const yearSuffix = source.year ? ` (${source.year})` : '';
  return source.url ? (
    <>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-4 hover:underline"
      >
        {source.name}
      </a>
      {yearSuffix}
    </>
  ) : (
    <>
      {source.name}
      {yearSuffix}
    </>
  );
}

export default function ContentFooter({
  source,
  lastReviewed,
}: ContentFooterProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="space-y-1 pt-4 text-xs text-muted-foreground">
        {source ? (
          <p>
            <span aria-hidden>📚</span> Source: <SourceLine source={source} />
          </p>
        ) : null}
        {lastReviewed ? (
          <p>
            <span aria-hidden>📅</span> Last reviewed: {lastReviewed}
          </p>
        ) : null}
        <p>
          <span aria-hidden>⚠️</span> เครื่องมือช่วยคิด ตัดสินใจด้วยดุลยพินิจแพทย์
        </p>
      </CardContent>
    </Card>
  );
}
