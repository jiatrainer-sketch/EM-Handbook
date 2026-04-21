import { Link } from 'react-router-dom';
import { Plus, UserRound, X } from 'lucide-react';
import CaseSelector from '@/components/CaseSelector';
import { useActiveCase } from '@/hooks/useActiveCase';
import { listCases } from '@/lib/caseManager';
import type { PatientCase } from '@/types/case';

function caseLabel(c: PatientCase): string {
  const parts: string[] = [c.name];
  if (c.age) parts.push(`${c.age}y`);
  if (c.sex && c.sex !== 'unknown') parts.push(c.sex);
  if (c.weight) parts.push(`${c.weight}kg`);
  return parts.join(' · ');
}

export default function CaseBanner() {
  const { activeCase, setActive } = useActiveCase();
  const hasAnyCase = listCases().length > 0;

  if (activeCase) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs dark:border-blue-800 dark:bg-blue-950">
        <UserRound size={14} className="shrink-0 text-blue-600 dark:text-blue-400" />
        <Link
          to={`/cases/${activeCase.id}`}
          className="flex-1 truncate font-medium text-blue-800 hover:underline dark:text-blue-200"
        >
          {caseLabel(activeCase)}
          {activeCase.chiefComplaint ? ` — ${activeCase.chiefComplaint}` : ''}
        </Link>
        <CaseSelector />
        <button
          onClick={() => setActive(null)}
          className="shrink-0 rounded p-0.5 text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-900"
          aria-label="ปิดเคส"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs">
      <span className="flex-1 text-muted-foreground">💡 ยังไม่เลือกเคส — เปิดเคสเพื่อให้ Dr. AI รู้บริบทคนไข้</span>
      {hasAnyCase && <CaseSelector />}
      <Link
        to="/cases"
        className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-[11px] hover:bg-accent"
      >
        <Plus size={11} /> เคสใหม่
      </Link>
    </div>
  );
}
