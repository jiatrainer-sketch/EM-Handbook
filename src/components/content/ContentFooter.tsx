import { Card, CardContent } from '@/components/ui/card';

type ContentFooterProps = {
  source?: string;
  lastReviewed?: string;
};

export default function ContentFooter({
  source,
  lastReviewed,
}: ContentFooterProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="space-y-1 pt-4 text-xs text-muted-foreground">
        {source ? (
          <p>
            <span aria-hidden>📚</span> Source: {source}
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
