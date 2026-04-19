import { useState } from 'react';
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

// Canonical sub-category groups — maps display label → subcategory strings in frontmatter
const PROTOCOL_GROUPS: { key: string; label: string; emoji: string; match: string[] }[] = [
  { key: 'cardiac', label: 'Cardiac / Resus', emoji: '❤️', match: ['cardiac', 'cardiology'] },
  { key: 'neuro', label: 'Neurology', emoji: '🧠', match: ['neurology', 'neuro'] },
  { key: 'pulmonary', label: 'Pulmonary', emoji: '🫁', match: ['pulmonary', 'respiratory'] },
  { key: 'endo', label: 'Endocrine / Electrolyte', emoji: '🧬', match: ['endocrine', 'endo-electrolyte', 'electrolyte', 'metabolic'] },
  { key: 'id', label: 'Infectious / Sepsis', emoji: '🦠', match: ['infectious-disease', 'sepsis', 'ID'] },
  { key: 'gi', label: 'GI / Hepatology', emoji: '🫄', match: ['GI', 'gastrointestinal', 'gi', 'hepatology'] },
  { key: 'renal', label: 'Renal', emoji: '🫘', match: ['renal', 'nephrology'] },
  { key: 'vascular', label: 'Vascular', emoji: '🩸', match: ['vascular'] },
  { key: 'tox', label: 'Toxicology', emoji: '☠️', match: ['toxicology'] },
  { key: 'ob', label: 'OB / Pregnancy', emoji: '🤰', match: ['OB', 'ob', 'obstetric'] },
  { key: 'allergy', label: 'Allergy / Immuno', emoji: '🤧', match: ['allergy'] },
  { key: 'other', label: 'Other', emoji: '📋', match: [] },
];

const DRIP_GROUPS: { key: string; label: string; emoji: string; match: string[] }[] = [
  { key: 'vasopressor', label: 'Vasopressors', emoji: '💉', match: ['vasopressor', 'inotrope-vasopressor'] },
  { key: 'inotrope', label: 'Inotropes', emoji: '❤️‍🔥', match: ['inotrope', 'inotrope-vasodilator'] },
  { key: 'antihyp', label: 'Antihypertensives', emoji: '📉', match: ['antihypertensive', 'vasodilator'] },
  { key: 'antiarr', label: 'Antiarrhythmics', emoji: '⚡', match: ['antiarrhythmic'] },
  { key: 'sedation', label: 'Sedation / Analgesia', emoji: '💤', match: ['sedation'] },
  { key: 'other', label: 'Other', emoji: '📋', match: [] },
];

function isCategory(value: string | undefined): value is Category {
  return !!value && (CATEGORIES as readonly string[]).includes(value);
}

type GroupSpec = typeof PROTOCOL_GROUPS;

function groupItems(
  items: { id: string; subcategory?: string }[],
  groups: GroupSpec,
): { group: GroupSpec[number]; ids: string[] }[] {
  const assigned = new Set<string>();
  const result: { group: GroupSpec[number]; ids: string[] }[] = [];

  for (const group of groups) {
    if (group.key === 'other') continue;
    const ids = items
      .filter((m) => !assigned.has(m.id) && group.match.includes(m.subcategory ?? ''))
      .map((m) => m.id);
    ids.forEach((id) => assigned.add(id));
    if (ids.length > 0) result.push({ group, ids });
  }

  // Remaining uncategorised → "Other"
  const otherIds = items.filter((m) => !assigned.has(m.id)).map((m) => m.id);
  if (otherIds.length > 0) {
    const otherGroup = groups.find((g) => g.key === 'other')!;
    result.push({ group: otherGroup, ids: otherIds });
  }

  return result;
}

export default function Browse() {
  const { category } = useParams<{ category: string }>();
  const [activeFilter, setActiveFilter] = useState<string>('all');

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
  const label = LABELS[category];
  const useGroups = category === 'protocol' || category === 'drip';
  const groupSpec = category === 'drip' ? DRIP_GROUPS : PROTOCOL_GROUPS;
  const grouped = useGroups ? groupItems(items, groupSpec) : [];

  // Filter chips
  const visibleGroups =
    activeFilter === 'all'
      ? grouped
      : grouped.filter((g) => g.group.key === activeFilter);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{label.en}</h1>
        <p className="text-sm text-muted-foreground">
          {label.th} · {items.length} รายการ
        </p>
      </div>

      {useGroups && grouped.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            All
          </button>
          {grouped.map(({ group }) => (
            <button
              key={group.key}
              onClick={() => setActiveFilter(group.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeFilter === group.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {group.emoji} {group.label}
            </button>
          ))}
        </div>
      )}

      {useGroups ? (
        <div className="space-y-5">
          {visibleGroups.map(({ group, ids }) => (
            <section key={group.key}>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                {group.emoji} {group.label}
                <span className="ml-1.5 font-normal opacity-60">({ids.length})</span>
              </h2>
              <PieceList ids={ids} variant="row" />
            </section>
          ))}
        </div>
      ) : (
        <PieceList
          ids={items.map((m) => m.id)}
          variant="row"
          emptyText="ยังไม่มีเนื้อหาในหมวดนี้ — กำลังทยอยเพิ่ม"
        />
      )}
    </div>
  );
}
