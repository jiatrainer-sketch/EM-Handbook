import { UserRound, X } from 'lucide-react';
import { useActiveCase } from '@/hooks/useActiveCase';
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
  if (!activeCase) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs dark:border-blue-800 dark:bg-blue-950">
      <UserRound size={14} className="shrink-0 text-blue-600 dark:text-blue-400" />
      <span className="flex-1 truncate font-medium text-blue-800 dark:text-blue-200">
        {caseLabel(activeCase)}
        {activeCase.chiefComplaint ? ` — ${activeCase.chiefComplaint}` : ''}
      </span>
      <button
        onClick={() => setActive(null)}
        className="shrink-0 rounded p-0.5 text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-900"
        aria-label="ปิด case"
      >
        <X size={12} />
      </button>
    </div>
  );
}
