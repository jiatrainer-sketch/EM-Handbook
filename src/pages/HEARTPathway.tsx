import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type Option = { val: number; label: string; sublabel?: string };

const HISTORY_OPTS: Option[] = [
  { val: 2, label: '2 — Highly suspicious', sublabel: 'Classic ACS features: central chest pressure, radiation, diaphoresis' },
  { val: 1, label: '1 — Moderately suspicious', sublabel: 'Some classic features or atypical presentation' },
  { val: 0, label: '0 — Slightly suspicious', sublabel: 'Non-specific, no typical features' },
];

const ECG_OPTS: Option[] = [
  { val: 2, label: '2 — Significant ST deviation', sublabel: 'New ST depression/elevation ≥1 mm, LBBB (new), LVH with repolarisation' },
  { val: 1, label: '1 — Non-specific repolarisation', sublabel: 'BBB, LVH without repolarisation, early repolarisation, paced rhythm' },
  { val: 0, label: '0 — Normal', sublabel: 'Normal ECG or unchanged from old' },
];

const AGE_OPTS: Option[] = [
  { val: 2, label: '2 — อายุ ≥ 65 ปี', sublabel: '' },
  { val: 1, label: '1 — อายุ 45–64 ปี', sublabel: '' },
  { val: 0, label: '0 — อายุ < 45 ปี', sublabel: '' },
];

const RF_OPTS: Option[] = [
  { val: 2, label: '2 — ≥ 3 risk factors หรือ known CAD', sublabel: 'Known CAD (history MI, PCI, CABG) OR ≥3: DM, HTN, hypercholesterolaemia, smoking, obesity, family hx' },
  { val: 1, label: '1 — 1–2 risk factors', sublabel: '1 or 2 of: DM, HTN, hypercholesterolaemia, smoking, obesity, family hx' },
  { val: 0, label: '0 — No known risk factors', sublabel: 'None of the above' },
];

const TROP_OPTS: Option[] = [
  { val: 2, label: '2 — &gt; 3× normal limit', sublabel: 'Significantly elevated troponin' },
  { val: 1, label: '1 — 1–3× normal limit', sublabel: 'Mildly elevated troponin' },
  { val: 0, label: '0 — ≤ normal limit', sublabel: 'Troponin within normal range' },
];

function interpretHEART(score: number): { risk: string; mace30: string; color: string; disposition: string } {
  if (score <= 3) return { risk: 'Low Risk', mace30: '0.9–1.7%', color: 'text-green-600 dark:text-green-400', disposition: 'พิจารณา discharge + outpatient f/u 72 hr' };
  if (score <= 6) return { risk: 'Moderate Risk', mace30: '12–16.6%', color: 'text-orange-500', disposition: 'Admit — serial troponin + cardiology consult' };
  return { risk: 'High Risk', mace30: '50–65%', color: 'text-red-600 dark:text-red-400', disposition: 'Admit ICU/HDU — urgent cardiology / cath lab' };
}

function ScoreRow({ label, opts, value, onChange }: {
  label: string; opts: Option[]; value: number | null; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium">{label}</div>
      {opts.map((o) => (
        <button
          key={o.val}
          onClick={() => onChange(o.val)}
          className={cn(
            'w-full rounded-md border px-3 py-2 text-left text-sm transition-colors',
            value === o.val ? 'border-primary bg-primary/10 font-medium' : 'border-border bg-card hover:bg-accent',
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: o.label }} />
          {o.sublabel && <div className="text-xs text-muted-foreground">{o.sublabel}</div>}
        </button>
      ))}
    </div>
  );
}

export default function HEARTPathway() {
  const navigate = useNavigate();
  const [h, setH] = useState<number | null>(null);
  const [e, setE] = useState<number | null>(null);
  const [a, setA] = useState<number | null>(null);
  const [r, setR] = useState<number | null>(null);
  const [t, setT] = useState<number | null>(null);

  const score = useMemo(() => {
    if (h == null || e == null || a == null || r == null || t == null) return null;
    return h + e + a + r + t;
  }, [h, e, a, r, t]);

  const interp = useMemo(() => score != null ? interpretHEART(score) : null, [score]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">HEART Pathway</h1>
          <p className="text-xs text-muted-foreground">History · ECG · Age · Risk factors · Troponin</p>
        </div>
      </div>

      {score != null && interp && (
        <div className="rounded-lg border bg-card p-4 text-center space-y-1">
          <div className="text-4xl font-bold tabular-nums">HEART {score}/10</div>
          <div className={cn('text-sm font-semibold', interp.color)}>{interp.risk}</div>
          <div className="text-xs text-muted-foreground">30-day MACE: {interp.mace30}</div>
          <div className="mt-2 rounded-md bg-muted p-2 text-xs">{interp.disposition}</div>
        </div>
      )}

      <div className="space-y-5">
        <ScoreRow label="H — History" opts={HISTORY_OPTS} value={h} onChange={setH} />
        <ScoreRow label="E — ECG" opts={ECG_OPTS} value={e} onChange={setE} />
        <ScoreRow label="A — Age" opts={AGE_OPTS} value={a} onChange={setA} />
        <ScoreRow label="R — Risk Factors" opts={RF_OPTS} value={r} onChange={setR} />
        <ScoreRow label="T — Troponin" opts={TROP_OPTS} value={t} onChange={setT} />
      </div>

      <AITreatmentPanel
        tool="heart-pathway"
        getInput={() => ({
          data: {
            'HEART Score': score ?? '—',
            History: h ?? '—',
            ECG: e ?? '—',
            Age: a ?? '—',
            'Risk Factors': r ?? '—',
            Troponin: t ?? '—',
            Risk: interp?.risk ?? '—',
            'MACE 30-day': interp?.mace30 ?? '—',
          },
        })}
      />

      <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1">
        <div className="font-medium">Serial Troponin Protocol</div>
        <div>0-hr + 3-hr (หรือ 1-hr ถ้าใช้ hs-Troponin): ถ้า negative ทั้งคู่ + HEART ≤3 → discharge safe</div>
        <div>hs-Troponin I: URL ~16–34 ng/L (lab dependent); serial Δ &lt;5–6 ng/L = negative</div>
      </div>

      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
