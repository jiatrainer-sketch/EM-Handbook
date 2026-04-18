import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Sex = 'M' | 'F';
type Scenario = 'normal' | 'ards' | 'obstructive' | 'neuro';

type FormState = {
  heightCm: string;
  actualKg: string;
  sex: Sex;
  scenario: Scenario;
};

const SCENARIOS: Record<Scenario, string> = {
  normal: 'Normal lung / postop',
  ards: 'ARDS (lung protective)',
  obstructive: 'Obstructive (asthma/COPD)',
  neuro: 'Neuro (brain injury/stroke)',
};

function calcIbw(heightCm: number, sex: Sex): number {
  // Devine formula (most common in vent literature)
  // Male:   50 + 0.91 × (height_cm − 152.4)
  // Female: 45.5 + 0.91 × (height_cm − 152.4)
  if (!heightCm || heightCm < 100) return 0;
  const base = sex === 'M' ? 50 : 45.5;
  return Math.round((base + 0.91 * (heightCm - 152.4)) * 10) / 10;
}

type Settings = {
  mode: string;
  vtRange: string;
  vtLowMl: number;
  vtHighMl: number;
  rr: string;
  peep: string;
  fio2: string;
  ie: string;
  plateauTarget?: string;
  notes: string[];
};

function settingsFor(scenario: Scenario, ibw: number): Settings {
  switch (scenario) {
    case 'ards': {
      const low = 4 * ibw;
      const high = 6 * ibw;
      return {
        mode: 'VC-AC',
        vtRange: '4–6 mL/kg IBW',
        vtLowMl: Math.round(low),
        vtHighMl: Math.round(high),
        rr: '14–20 (watch auto-PEEP)',
        peep: '8–12 (titrate per PEEP/FiO₂ table)',
        fio2: 'Start 60–100%, titrate to SpO₂ 88–95%',
        ie: '1:2',
        plateauTarget: 'Plateau pressure &lt; 30 cmH₂O ⚠️',
        notes: [
          'Lung-protective: Vt 4–6 mL/kg IBW',
          'Permissive hypercapnia OK (pH ≥ 7.20)',
          'Prone position if P/F &lt; 150 (16 hr/day)',
          'Neuromuscular blockade if severe (48 hr)',
          'Target driving pressure (Pplat − PEEP) &lt; 15',
        ],
      };
    }
    case 'obstructive': {
      const low = 6 * ibw;
      const high = 8 * ibw;
      return {
        mode: 'VC-AC or PCV',
        vtRange: '6–8 mL/kg IBW',
        vtLowMl: Math.round(low),
        vtHighMl: Math.round(high),
        rr: '8–12 (prolonged expiration!)',
        peep: '5 (low to avoid air trapping)',
        fio2: '40–60%, titrate to SpO₂ ≥ 92%',
        ie: '1:3 to 1:4',
        plateauTarget: 'Plateau &lt; 30; watch auto-PEEP',
        notes: [
          'Long expiratory time is the key (I:E 1:3 to 1:4)',
          'Watch auto-PEEP (intrinsic PEEP)',
          'Permissive hypercapnia acceptable',
          'Concurrent: bronchodilator + steroid + Mg',
          'Reduce RR if auto-PEEP (even if hypercapnia)',
        ],
      };
    }
    case 'neuro': {
      const low = 6 * ibw;
      const high = 8 * ibw;
      return {
        mode: 'VC-AC',
        vtRange: '6–8 mL/kg IBW',
        vtLowMl: Math.round(low),
        vtHighMl: Math.round(high),
        rr: '14–20 (target PaCO₂ 35–40)',
        peep: '5–8 (avoid high → ↑ ICP)',
        fio2: 'Titrate to SpO₂ ≥ 95%',
        ie: '1:2',
        notes: [
          'Target PaCO₂ 35–40 (or 30–35 if impending herniation)',
          'Avoid hypoxia + hypercapnia (both ↑ ICP)',
          'Sedation: propofol preferred (easier neuro check)',
          'Head of bed 30°',
          'ABG q 4–6 hr until stable',
        ],
      };
    }
    default: {
      const low = 6 * ibw;
      const high = 8 * ibw;
      return {
        mode: 'VC-AC (or PSV if weaning)',
        vtRange: '6–8 mL/kg IBW',
        vtLowMl: Math.round(low),
        vtHighMl: Math.round(high),
        rr: '12–16',
        peep: '5',
        fio2: '40% (titrate SpO₂ 92–96%)',
        ie: '1:2',
        notes: [
          'Standard initial settings for intubated, non-ARDS, non-obstructive',
          'Consider PSV once RR stable + cooperative',
          'Wake + SBT daily',
        ],
      };
    }
  }
}

function buildSummary(form: FormState, ibw: number, s: Settings): string {
  const lines: string[] = [];
  const height = form.heightCm || '?';
  const weight = form.actualKg || '?';
  lines.push('Ventilator initial settings');
  lines.push(
    `Pt: ${form.sex}, Ht ${height} cm, Actual ${weight} kg, IBW ${ibw} kg`,
  );
  lines.push(`Scenario: ${SCENARIOS[form.scenario]}`);
  lines.push('');
  lines.push(`Mode: ${s.mode}`);
  lines.push(
    `Vt: ${s.vtRange} = ${s.vtLowMl}–${s.vtHighMl} mL (based on IBW)`,
  );
  lines.push(`RR: ${s.rr}`);
  lines.push(`PEEP: ${s.peep}`);
  lines.push(`FiO₂: ${s.fio2}`);
  lines.push(`I:E: ${s.ie}`);
  if (s.plateauTarget) lines.push(s.plateauTarget.replace(/&lt;/g, '<'));
  lines.push('');
  lines.push('Notes:');
  s.notes.forEach((n) => lines.push(`- ${n}`));
  lines.push('');
  lines.push('ABG within 30 min; titrate to response.');
  return lines.join('\n');
}

const DEFAULT_FORM: FormState = {
  heightCm: '',
  actualKg: '',
  sex: 'M',
  scenario: 'normal',
};

export default function VentilatorQuickStart() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [toast, setToast] = useState<string | null>(null);

  const height = Number(form.heightCm) || 0;
  const ibw = useMemo(() => calcIbw(height, form.sex), [height, form.sex]);
  const settings = useMemo(() => settingsFor(form.scenario, ibw), [form.scenario, ibw]);
  const summary = useMemo(() => buildSummary(form, ibw, settings), [form, ibw, settings]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setToast('คัดลอกแล้ว');
      setTimeout(() => setToast(null), 1800);
    } catch {
      setToast('คัดลอกไม่สำเร็จ');
      setTimeout(() => setToast(null), 1800);
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Ventilator Quick Start</h1>
        <p className="text-sm text-muted-foreground">
          IBW + initial settings by scenario — ตรวจสอบ + adapt ก่อนใช้จริง
        </p>
      </header>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">ข้อมูลผู้ป่วย</h2>
        <div className="grid grid-cols-3 gap-3">
          <label className="space-y-1">
            <span className="text-xs text-muted-foreground">Height (cm)</span>
            <input
              type="number"
              inputMode="numeric"
              value={form.heightCm}
              onChange={(e) => update('heightCm', e.target.value)}
              placeholder="170"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-muted-foreground">Actual wt (kg)</span>
            <input
              type="number"
              inputMode="numeric"
              value={form.actualKg}
              onChange={(e) => update('actualKg', e.target.value)}
              placeholder="70"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-muted-foreground">Sex</span>
            <div className="flex gap-2">
              {(['M', 'F'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update('sex', s)}
                  aria-pressed={form.sex === s}
                  className={cn(
                    'flex-1 rounded-md border px-2 py-2 text-sm',
                    form.sex === s
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-background',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="rounded-md bg-muted/40 p-3">
          <span className="text-xs text-muted-foreground">IBW (Devine)</span>
          <div className="text-2xl font-semibold tabular-nums">
            {ibw ? `${ibw} kg` : '—'}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {form.sex === 'M' ? '50' : '45.5'} + 0.91 × (ht − 152.4)
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">Clinical scenario</h2>
        <div className="grid gap-2">
          {(Object.keys(SCENARIOS) as Scenario[]).map((s) => (
            <label
              key={s}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm',
                form.scenario === s && 'border-primary bg-primary/5',
              )}
            >
              <input
                type="radio"
                name="scenario"
                checked={form.scenario === s}
                onChange={() => update('scenario', s)}
              />
              <span>{SCENARIOS[s]}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">Initial settings — {SCENARIOS[form.scenario]}</h2>
        <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="font-medium">Mode</dt>
          <dd>{settings.mode}</dd>

          <dt className="font-medium">Vt</dt>
          <dd>
            {settings.vtRange}{' '}
            {ibw > 0 && (
              <span className="text-muted-foreground">
                = {settings.vtLowMl}–{settings.vtHighMl} mL
              </span>
            )}
          </dd>

          <dt className="font-medium">RR</dt>
          <dd>{settings.rr}</dd>

          <dt className="font-medium">PEEP</dt>
          <dd>{settings.peep}</dd>

          <dt className="font-medium">FiO₂</dt>
          <dd>{settings.fio2}</dd>

          <dt className="font-medium">I:E</dt>
          <dd>{settings.ie}</dd>

          {settings.plateauTarget && (
            <>
              <dt className="font-medium">Plateau</dt>
              <dd dangerouslySetInnerHTML={{ __html: settings.plateauTarget }} />
            </>
          )}
        </dl>

        {settings.notes.length > 0 && (
          <div>
            <h3 className="mt-2 mb-1 text-xs font-semibold text-muted-foreground">
              Notes
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {settings.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">ABG Response Guide</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-1 pr-2">Issue</th>
              <th className="py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-1 pr-2">Hypoxia</td>
              <td className="py-1">↑ FiO₂, ↑ PEEP</td>
            </tr>
            <tr className="border-b">
              <td className="py-1 pr-2">Hypercapnia</td>
              <td className="py-1">↑ RR (cautious), ↑ Vt if low</td>
            </tr>
            <tr className="border-b">
              <td className="py-1 pr-2">pH &lt; 7.25</td>
              <td className="py-1">Address ventilation first</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">pH &gt; 7.55</td>
              <td className="py-1">↓ RR, ↓ Vt</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Copy-ready summary</h2>
          <Button size="sm" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            คัดลอก
          </Button>
        </div>
        <textarea
          readOnly
          value={summary}
          className="h-56 w-full resize-none rounded-md border bg-muted/40 p-3 font-mono text-xs"
        />
      </section>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs text-background shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
