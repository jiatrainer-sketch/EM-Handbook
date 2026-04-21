import { useState } from 'react';
import { ChevronDown, UserRound, X } from 'lucide-react';
import { listCases } from '@/lib/caseManager';
import { useActiveCase } from '@/hooks/useActiveCase';

export default function CaseSelector() {
  const { activeCase, activeId, setActive } = useActiveCase();
  const [open, setOpen] = useState(false);
  const cases = listCases();

  if (cases.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
        aria-label="เลือกเคส"
      >
        <UserRound size={12} className={activeCase ? 'text-blue-500' : ''} />
        <span className="max-w-[80px] truncate">
          {activeCase ? activeCase.name : 'เลือกเคส'}
        </span>
        <ChevronDown size={12} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">เลือกเคส</span>
              <button onClick={() => setOpen(false)} className="rounded p-0.5 hover:bg-accent">
                <X size={12} />
              </button>
            </div>
            <ul className="max-h-52 overflow-y-auto py-1">
              {activeId && (
                <li>
                  <button
                    onClick={() => { setActive(null); setOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-muted-foreground hover:bg-accent"
                  >
                    — ไม่เลือกเคส
                  </button>
                </li>
              )}
              {cases.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => { setActive(c.id); setOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-accent ${activeId === c.id ? 'text-blue-600 font-medium dark:text-blue-400' : 'text-foreground'}`}
                  >
                    <div className="truncate">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {[c.age ? `${c.age}y` : '', c.sex && c.sex !== 'unknown' ? c.sex : ''].filter(Boolean).join(' · ')}
                      {c.renal?.egfr != null ? ` · eGFR ${c.renal.egfr}` : ''}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
