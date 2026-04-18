import { Link, useParams } from 'react-router-dom';
import PieceList from '@/components/home/PieceList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { listByCategory } from '@/lib/content';
import { CATEGORIES, type Category } from '@/types/content';

const LABELS: Record<Category, { en: string; th: string }> = {
  score: { en: 'Scores', th: 'คะแนนประเมิน' },
  drip: { en: 'Drips', th: 'ยาดริป' },
  order: { en: 'Orders', th: 'ชุดคำสั่ง' },
  ladder: { en: 'Ladders', th: 'Ladder (stepwise)' },
  protocol: { en: 'Protocols', th: 'แนวทางการรักษา' },
  symptom: { en: 'Symptoms', th: 'ตามอาการ' },
  reference: { en: 'Reference', th: 'อ้างอิง' },
};

function isCategory(value: string | undefined): value is Category {
  return !!value && (CATEGORIES as readonly string[]).includes(value);
}

export default function Browse() {
  const { category } = useParams<{ category: string }>();

  if (!isCategory(category)) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6 text-center">
          <h1 className="text-xl font-semibold">ไม่พบหมวดนี้</h1>
          <p className="text-sm text-muted-foreground">
            หมวดที่ขอไม่มีใน registry
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">← กลับหน้าหลัก</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const items = listByCategory(category);
  const ids = items.map((m) => m.id);
  const label = LABELS[category];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{label.en}</h1>
        <p className="text-sm text-muted-foreground">
          {label.th} · {items.length} รายการ
        </p>
      </div>
      <PieceList
        ids={ids}
        variant="row"
        emptyText="ยังไม่มีเนื้อหาในหมวดนี้ — กำลังทยอยเพิ่ม"
      />
    </div>
  );
}
