import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trackToolUsed } from '@/lib/analytics';

type AbgForm = {
  pH: string;
  paco2: string;
  hco3: string;
  pao2: string;
  fio2: string;
  na: string;
  cl: string;
  albumin: string;
  lactate: string;
};

type AcidBaseDisorder =
  | 'normal'
  | 'respiratory-acidosis'
  | 'respiratory-alkalosis'
  | 'metabolic-acidosis'
  | 'metabolic-alkalosis'
  | 'mixed';

type Interpretation = {
  primary: AcidBaseDisorder;
  primaryLabel: string;
  compensation: string;
  isCompensated: 'adequate' | 'inadequate' | 'additional-disorder' | 'na';
  isAcute: 'acute' | 'chronic' | 'mixed' | 'na';
  anionGap: number | null;
  correctedAG: number | null;
  deltaRatio: number | null;
  deltaInterpretation: string | null;
  pfRatio: number | null;
  ardsGrade: 'none' | 'mild' | 'moderate' | 'severe' | null;
  aaGradient: number | null;
  aaElevated: boolean | null;
  notes: string[];
};

const EMPTY: AbgForm = {
  pH: '',
  paco2: '',
  hco3: '',
  pao2: '',
  fio2: '',
  na: '',
  cl: '',
  albumin: '',
  lactate: '',
};

function toNum(s: string): number | null {
  if (!s.trim()) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function interpret(f: AbgForm): Interpretation | null {
  const pH = toNum(f.pH);
  const paco2 = toNum(f.paco2);
  const hco3 = toNum(f.hco3);
  if (pH == null || paco2 == null || hco3 == null) return null;

  const pao2 = toNum(f.pao2);
  const fio2Raw = toNum(f.fio2);
  const fio2 = fio2Raw != null && fio2Raw > 1 ? fio2Raw / 100 : fio2Raw;
  const na = toNum(f.na);
  const cl = toNum(f.cl);
  const albumin = toNum(f.albumin);
  const lactate = toNum(f.lactate);

  const notes: string[] = [];

  // ---- primary disorder ----
  let primary: AcidBaseDisorder = 'normal';
  let primaryLabel = 'Normal acid-base';
  const acidemia = pH < 7.35;
  const alkalemia = pH > 7.45;

  if (acidemia) {
    if (paco2 > 45 && hco3 >= 22) {
      primary = 'respiratory-acidosis';
      primaryLabel = 'Respiratory acidosis';
    } else if (hco3 < 22) {
      primary = 'metabolic-acidosis';
      primaryLabel = 'Metabolic acidosis';
      if (paco2 > 45) {
        primary = 'mixed';
        primaryLabel = 'Mixed metabolic + respiratory acidosis';
      }
    } else {
      primary = 'mixed';
      primaryLabel = 'Mixed acidosis';
    }
  } else if (alkalemia) {
    if (paco2 < 35 && hco3 <= 26) {
      primary = 'respiratory-alkalosis';
      primaryLabel = 'Respiratory alkalosis';
    } else if (hco3 > 26) {
      primary = 'metabolic-alkalosis';
      primaryLabel = 'Metabolic alkalosis';
      if (paco2 < 35) {
        primary = 'mixed';
        primaryLabel = 'Mixed metabolic + respiratory alkalosis';
      }
    } else {
      primary = 'mixed';
      primaryLabel = 'Mixed alkalosis';
    }
  } else {
    // Normal pH — still check compensation-like disorders
    if (paco2 > 45 && hco3 > 26) {
      primary = 'mixed';
      primaryLabel = 'Compensated or mixed (↑ PaCO₂ + ↑ HCO₃)';
    } else if (paco2 < 35 && hco3 < 22) {
      primary = 'mixed';
      primaryLabel = 'Compensated or mixed (↓ PaCO₂ + ↓ HCO₃)';
    }
  }

  // ---- compensation ----
  let compensation = '';
  let isCompensated: Interpretation['isCompensated'] = 'na';
  let isAcute: Interpretation['isAcute'] = 'na';

  if (primary === 'metabolic-acidosis') {
    const expected = 1.5 * hco3 + 8;
    const low = expected - 2;
    const high = expected + 2;
    compensation = `Expected PaCO₂ (Winter's) = 1.5×${hco3} + 8 = ${low.toFixed(1)}–${high.toFixed(1)}. Actual ${paco2}.`;
    if (paco2 < low) {
      isCompensated = 'additional-disorder';
      compensation += ' → over-compensation = added respiratory alkalosis.';
    } else if (paco2 > high) {
      isCompensated = 'additional-disorder';
      compensation += ' → inadequate compensation = added respiratory acidosis.';
    } else {
      isCompensated = 'adequate';
      compensation += ' → appropriate respiratory compensation.';
    }
  } else if (primary === 'metabolic-alkalosis') {
    const expected = 0.7 * (hco3 - 24) + 40;
    const low = expected - 2;
    const high = expected + 2;
    compensation = `Expected PaCO₂ = 0.7×(HCO₃−24) + 40 = ${low.toFixed(1)}–${high.toFixed(1)}. Actual ${paco2}.`;
    if (paco2 < low) {
      isCompensated = 'additional-disorder';
      compensation += ' → over-compensation = added respiratory alkalosis.';
    } else if (paco2 > high) {
      isCompensated = 'additional-disorder';
      compensation += ' → inadequate compensation.';
    } else {
      isCompensated = 'adequate';
      compensation += ' → appropriate compensation.';
    }
  } else if (primary === 'respiratory-acidosis') {
    const acuteExpected = 24 + (paco2 - 40) * 0.1;
    const chronicExpected = 24 + (paco2 - 40) * 0.35;
    compensation = `Acute expected HCO₃ ≈ ${acuteExpected.toFixed(1)}; Chronic ≈ ${chronicExpected.toFixed(1)}. Actual ${hco3}.`;
    if (Math.abs(hco3 - acuteExpected) < Math.abs(hco3 - chronicExpected)) {
      isAcute = 'acute';
      compensation += ' → acute pattern.';
    } else {
      isAcute = 'chronic';
      compensation += ' → chronic / compensated pattern.';
    }
    isCompensated = 'adequate';
  } else if (primary === 'respiratory-alkalosis') {
    const acuteExpected = 24 - (40 - paco2) * 0.2;
    const chronicExpected = 24 - (40 - paco2) * 0.5;
    compensation = `Acute expected HCO₃ ≈ ${acuteExpected.toFixed(1)}; Chronic ≈ ${chronicExpected.toFixed(1)}. Actual ${hco3}.`;
    if (Math.abs(hco3 - acuteExpected) < Math.abs(hco3 - chronicExpected)) {
      isAcute = 'acute';
      compensation += ' → acute pattern.';
    } else {
      isAcute = 'chronic';
      compensation += ' → chronic / compensated pattern.';
    }
    isCompensated = 'adequate';
  }

  // ---- anion gap ----
  let anionGap: number | null = null;
  let correctedAG: number | null = null;
  let deltaRatio: number | null = null;
  let deltaInterpretation: string | null = null;
  if (na != null && cl != null) {
    anionGap = na - cl - hco3;
    if (albumin != null) {
      correctedAG = anionGap + 2.5 * (4 - albumin);
    }
    const usedAG = correctedAG ?? anionGap;
    if (primary === 'metabolic-acidosis' || primary === 'mixed') {
      const deltaAG = usedAG - 12;
      const deltaHCO3 = 24 - hco3;
      if (deltaHCO3 > 0) {
        deltaRatio = deltaAG / deltaHCO3;
        if (deltaRatio < 0.4) {
          deltaInterpretation = 'Pure NAGMA (non-anion gap metabolic acidosis)';
        } else if (deltaRatio < 1) {
          deltaInterpretation = 'AGMA + NAGMA (mixed)';
        } else if (deltaRatio >= 1 && deltaRatio <= 2) {
          deltaInterpretation = 'Pure AGMA (anion-gap metabolic acidosis)';
        } else {
          deltaInterpretation = 'AGMA + metabolic alkalosis (or pre-existing ↑ HCO₃)';
        }
      }
    }
  }

  // ---- P/F ratio ----
  let pfRatio: number | null = null;
  let ardsGrade: Interpretation['ardsGrade'] = null;
  if (pao2 != null && fio2 != null && fio2 > 0) {
    pfRatio = pao2 / fio2;
    if (pfRatio <= 100) ardsGrade = 'severe';
    else if (pfRatio <= 200) ardsGrade = 'moderate';
    else if (pfRatio <= 300) ardsGrade = 'mild';
    else ardsGrade = 'none';
  }

  // ---- A-a gradient (sea level, 37°C, PB 760) ----
  let aaGradient: number | null = null;
  let aaElevated: boolean | null = null;
  if (pao2 != null && fio2 != null && fio2 > 0) {
    const pAO2 = fio2 * (760 - 47) - paco2 / 0.8;
    aaGradient = pAO2 - pao2;
    // Age-based expected: (age/4) + 4; if age unknown, use > 15 as abnormal
    aaElevated = aaGradient > 15;
  }

  // ---- notes ----
  if (lactate != null && lactate > 2) {
    notes.push(`Lactate ${lactate} mmol/L — elevated; consider shock, sepsis, ischemia, metformin, seizure.`);
  }
  if (pH < 7.2) {
    notes.push('Severe acidemia (pH < 7.2) — urgent correction needed.');
  }
  if (pH > 7.55) {
    notes.push('Severe alkalemia (pH > 7.55) — workup cause.');
  }
  if (anionGap != null && anionGap > 12) {
    notes.push(`Anion gap ${anionGap.toFixed(1)} — elevated (MUDPILES: methanol, uremia, DKA/lactic, paraldehyde/propylene glycol, INH/iron, lactic, ethylene glycol, salicylate).`);
  }
  if (correctedAG != null && anionGap != null && Math.abs(correctedAG - anionGap) > 2) {
    notes.push(`Albumin-corrected AG = ${correctedAG.toFixed(1)} (vs measured ${anionGap.toFixed(1)}); use corrected value.`);
  }
  if (pfRatio != null && pfRatio <= 300) {
    notes.push(`P/F ratio ${pfRatio.toFixed(0)} — ARDS ${ardsGrade}. Consider low Vt (4–6 mL/kg IBW), high PEEP, prone for moderate/severe.`);
  }

  return {
    primary,
    primaryLabel,
    compensation,
    isCompensated,
    isAcute,
    anionGap,
    correctedAG,
    deltaRatio,
    deltaInterpretation,
    pfRatio,
    ardsGrade,
    aaGradient,
    aaElevated,
    notes,
  };
}

export default function AbgAnalyzer() {
  const [form, setForm] = useState<AbgForm>(EMPTY);

  const result = useMemo(() => interpret(form), [form]);

  const update = (k: keyof AbgForm, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    trackToolUsed('abg-analyzer');
  };

  const summary = useMemo(() => {
    if (!result) return '';
    const lines: string[] = [];
    lines.push(`ABG: pH ${form.pH}, PaCO₂ ${form.paco2}, HCO₃ ${form.hco3}`);
    if (form.pao2) lines.push(`PaO₂ ${form.pao2}, FiO₂ ${form.fio2 || '-'}`);
    lines.push(`Primary: ${result.primaryLabel}`);
    if (result.compensation) lines.push(`Compensation: ${result.compensation}`);
    if (result.anionGap != null) {
      const ag = result.correctedAG ?? result.anionGap;
      lines.push(`Anion gap: ${ag.toFixed(1)}${result.correctedAG ? ' (corrected)' : ''}`);
    }
    if (result.deltaInterpretation) lines.push(`Delta-delta: ${result.deltaInterpretation}`);
    if (result.pfRatio != null) lines.push(`P/F ratio: ${result.pfRatio.toFixed(0)} → ARDS ${result.ardsGrade}`);
    if (result.aaGradient != null) lines.push(`A-a gradient: ${result.aaGradient.toFixed(0)}${result.aaElevated ? ' (↑)' : ''}`);
    if (result.notes.length) lines.push('---', ...result.notes);
    return lines.join('\n');
  }, [form, result]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">ABG Analyzer</h1>
        <p className="text-sm text-muted-foreground">
          แปลผล arterial blood gas อัตโนมัติ — primary disorder, compensation, anion gap, P/F, A-a
        </p>
      </div>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">ค่า ABG หลัก</h2>
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="pH" value={form.pH} onChange={(v) => update('pH', v)} placeholder="7.40" />
          <NumberInput label="PaCO₂ (mmHg)" value={form.paco2} onChange={(v) => update('paco2', v)} placeholder="40" />
          <NumberInput label="HCO₃ (mEq/L)" value={form.hco3} onChange={(v) => update('hco3', v)} placeholder="24" />
          <NumberInput label="PaO₂ (mmHg)" value={form.pao2} onChange={(v) => update('pao2', v)} placeholder="90" />
          <NumberInput label="FiO₂ (0.21–1.0)" value={form.fio2} onChange={(v) => update('fio2', v)} placeholder="0.21" />
          <NumberInput label="Lactate (mmol/L)" value={form.lactate} onChange={(v) => update('lactate', v)} placeholder="1.0" />
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">
          ค่าเสริม (สำหรับ anion gap)
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="Na (mEq/L)" value={form.na} onChange={(v) => update('na', v)} placeholder="140" />
          <NumberInput label="Cl (mEq/L)" value={form.cl} onChange={(v) => update('cl', v)} placeholder="104" />
          <NumberInput label="Albumin (g/dL)" value={form.albumin} onChange={(v) => update('albumin', v)} placeholder="4.0" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          ใส่ albumin เพื่อคำนวณ corrected AG (ลด 2.5 ต่อทุก 1 g/dL ที่ albumin ต่ำกว่า 4)
        </p>
      </section>

      {result && (
        <section className="space-y-4">
          <div
            className={cn(
              'rounded-lg border-l-4 bg-card p-4',
              result.primary.includes('acidosis') ? 'border-red-500' : '',
              result.primary.includes('alkalosis') ? 'border-amber-500' : '',
              result.primary === 'normal' ? 'border-emerald-500' : '',
              result.primary === 'mixed' ? 'border-purple-500' : '',
            )}
          >
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Primary disorder
            </h2>
            <p className="text-lg font-semibold">{result.primaryLabel}</p>
            {result.isAcute !== 'na' && (
              <p className="text-xs text-muted-foreground">({result.isAcute})</p>
            )}
          </div>

          {result.compensation && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Compensation
              </h3>
              <p className="text-sm">{result.compensation}</p>
            </div>
          )}

          {result.anionGap != null && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Anion gap
              </h3>
              <p className="text-sm">
                <strong>AG:</strong> {result.anionGap.toFixed(1)}
                {result.correctedAG != null &&
                  ` (corrected for albumin: ${result.correctedAG.toFixed(1)})`}
              </p>
              {result.deltaRatio != null && (
                <p className="mt-1 text-sm">
                  <strong>Δ/Δ ratio:</strong> {result.deltaRatio.toFixed(2)} → {result.deltaInterpretation}
                </p>
              )}
            </div>
          )}

          {result.pfRatio != null && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Oxygenation
              </h3>
              <p className="text-sm">
                <strong>P/F ratio:</strong> {result.pfRatio.toFixed(0)}
                {result.ardsGrade !== 'none' && ` → ARDS ${result.ardsGrade}`}
              </p>
              {result.aaGradient != null && (
                <p className="mt-1 text-sm">
                  <strong>A-a gradient:</strong> {result.aaGradient.toFixed(0)} mmHg
                  {result.aaElevated ? ' (↑ — V/Q mismatch, shunt, diffusion)' : ' (normal)'}
                </p>
              )}
            </div>
          )}

          {result.notes.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Notes
              </h3>
              <ul className="space-y-1 text-sm">
                {result.notes.map((n, i) => (
                  <li key={i}>• {n}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(summary).catch(() => {});
              }}
            >
              <Copy size={14} /> Copy summary
            </Button>
          </div>
        </section>
      )}

      {!result && (
        <p className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          กรอกค่า pH, PaCO₂, HCO₃ (ขั้นต่ำ) เพื่อให้ระบบวิเคราะห์
        </p>
      )}

      <footer className="space-y-1 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
        <p>
          <strong>Formulas ที่ใช้:</strong>
        </p>
        <ul className="ml-4 list-disc space-y-0.5">
          <li>Winter's: Expected PaCO₂ = 1.5×HCO₃ + 8 ±2</li>
          <li>Metabolic alkalosis: PaCO₂ ↑ 0.7 per HCO₃ ↑</li>
          <li>Respiratory acidosis acute: HCO₃ ↑ 1 per 10 PaCO₂ ↑</li>
          <li>Respiratory acidosis chronic: HCO₃ ↑ 3.5 per 10 PaCO₂ ↑</li>
          <li>Corrected AG = AG + 2.5 × (4 − albumin)</li>
          <li>Delta ratio = ΔAG / ΔHCO₃</li>
          <li>P/F = PaO₂ / FiO₂ (ARDS: ≤300 mild, ≤200 moderate, ≤100 severe)</li>
          <li>A-a = FiO₂(760−47) − PaCO₂/0.8 − PaO₂ (sea level)</li>
        </ul>
      </footer>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
      />
    </label>
  );
}
