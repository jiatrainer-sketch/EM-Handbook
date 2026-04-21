import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, UserRound } from 'lucide-react';
import { useActiveCase } from '@/hooks/useActiveCase';
import { listCases } from '@/lib/caseManager';
import type { PatientCase } from '@/types/case';

function caseSubline(c: PatientCase): string {
  const parts: string[] = [];
  if (c.age) parts.push(`${c.age}y`);
  if (c.sex && c.sex !== 'unknown') parts.push(c.sex === 'M' ? 'ชาย' : 'หญิง');
  if (c.weight) parts.push(`${c.weight} kg`);
  if (c.renal?.egfr != null) parts.push(`eGFR ${c.renal.egfr}`);
  if (c.renal?.onDialysis) parts.push('dialysis');
  if (c.chiefComplaint) parts.push(c.chiefComplaint);
  return parts.join(' · ');
}

export default function HomeCasesWidget() {
  const { activeCase, activeId, setActive } = useActiveCase();
  const [cases] = useState(() => listCases());

  const recentOthers = cases.filter((c) => c.id !== activeId).slice(0, 3);

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">🏥 Cases</h2>
        <Link to="/cases" className="text-[11px] text-muted-foreground hover:underline">
          ดูทั้งหมด →
        </Link>
      </div>

      <div className="space-y-1.5">
        {/* Active case card */}
        {activeCase ? (
          <div className="flex items-center gap-3 rounded-lg border-2 border-blue-300 bg-blue-50 px-3 py-2.5 dark:border-blue-700 dark:bg-blue-950">
            <UserRound size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <Link
              to={`/cases/${activeCase.id}`}
              className="min-w-0 flex-1 hover:opacity-80"
            >
              <div className="truncate text-sm font-semibold text-blue-800 dark:text-blue-200">
                {activeCase.name}
              </div>
              <div className="truncate text-[11px] text-blue-600/80 dark:text-blue-400/80">
                {caseSubline(activeCase) || 'ไม่ระบุข้อมูลเพิ่มเติม'}
              </div>
            </Link>
            <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              ใช้งานอยู่
            </span>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="shrink-0 text-[10px] text-blue-500/60 hover:text-blue-600 dark:text-blue-400/60"
              aria-label="ปิดเคส"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
            <UserRound size={14} className="shrink-0 opacity-50" />
            <span className="flex-1">ยังไม่มีเคส active — เปิดเคสเพื่อให้ Dr. AI รู้บริบทคนไข้</span>
          </div>
        )}

        {/* Recent other cases */}
        {recentOthers.length > 0 && (
          <ul className="divide-y rounded-lg border bg-card text-sm">
            {recentOthers.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => setActive(c.id)}
                  className="shrink-0"
                  aria-label="เปิดใช้งาน"
                >
                  <UserRound size={14} className="text-muted-foreground hover:text-primary" />
                </button>
                <Link to={`/cases/${c.id}`} className="min-w-0 flex-1 hover:opacity-80">
                  <div className="truncate font-medium">{c.name}</div>
                  {caseSubline(c) && (
                    <div className="truncate text-[11px] text-muted-foreground">
                      {caseSubline(c)}
                    </div>
                  )}
                </Link>
                <ChevronRight size={13} className="shrink-0 text-muted-foreground" />
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to="/cases"
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border bg-background px-3 py-2 text-xs hover:bg-accent"
          >
            <Plus size={12} /> เพิ่มเคสใหม่
          </Link>
          {cases.length > 0 && (
            <Link
              to="/cases"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border bg-background px-3 py-2 text-xs hover:bg-accent"
            >
              เคสทั้งหมด ({cases.length})
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
