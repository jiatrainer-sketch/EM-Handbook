import { useMemo, useRef, useState } from 'react';
import { Camera, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trackToolUsed } from '@/lib/analytics';
import { extractAbgFromImage } from '@/lib/ventAi';
import AITreatmentPanel from '@/components/AITreatmentPanel';

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
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrHighlight, setOcrHighlight] = useState<Set<keyof AbgForm>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => interpret(form), [form]);

  const update = (k: keyof AbgForm, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    trackToolUsed('abg-analyzer');
  };

  async function compressImageToBase64(file: File): Promise<{ data: string; mediaType: 'image/jpeg' }> {
    const bitmap = await createImageBitmap(file);
    const maxDim = 1280;
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob) throw new Error('compress ไม่สำเร็จ');
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return { data: btoa(binary), mediaType: 'image/jpeg' };
  }

  async function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setOcrError(null);
    setOcrLoading(true);
    setOcrHighlight(new Set());
    try {
      const { data, mediaType } = await compressImageToBase64(file);
      const values = await extractAbgFromImage(data, mediaType);
      const filled = new Set<keyof AbgForm>();
      setForm((prev) => {
        const next = { ...prev };
        if (values.pH != null) { next.pH = String(values.pH); filled.add('pH'); }
        if (values.paco2 != null) { next.paco2 = String(values.paco2); filled.add('paco2'); }
        if (values.hco3 != null) { next.hco3 = String(values.hco3); filled.add('hco3'); }
        if (values.pao2 != null) { next.pao2 = String(values.pao2); filled.add('pao2'); }
        if (values.fio2 != null) { next.fio2 = String(values.fio2 > 1 ? values.fio2 / 100 : values.fio2); filled.add('fio2'); }
        if (values.lactate != null) { next.lactate = String(values.lactate); filled.add('lactate'); }
        if (values.na != null) { next.na = String(values.na); filled.add('na'); }
        return next;
      });
      setOcrHighlight(filled);
      setTimeout(() => setOcrHighlight(new Set()), 4000);
    } catch (err) {
      setOcrError(err instanceof Error ? err.message : 'OCR ล้มเหลว');
    } finally {
      setOcrLoading(false);
    }
  }

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

      {/* Photo OCR */}
      <section className="rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-semibold flex-1">📷 Photo OCR</h2>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoSelected} />
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={ocrLoading} className="h-7 px-3 text-xs">
            {ocrLoading ? <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> กำลัง OCR...</> : <><Camera className="mr-1 h-3 w-3" /> ถ่าย/อัปโหลดรูป ABG</>}
          </Button>
        </div>
        {ocrError && <p className="text-xs text-destructive">{ocrError}</p>}
        {ocrHighlight.size > 0 && <p className="text-xs text-green-600 dark:text-green-400">OCR เติมค่าแล้ว (ไฮไลต์เขียว) — ตรวจสอบก่อนใช้</p>}
        <p className="text-xs text-muted-foreground">ถ่ายรูปหน้าจอ ABG machine → AI แตกค่าอัตโนมัติ</p>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">ค่า ABG หลัก</h2>
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="pH" value={form.pH} onChange={(v) => update('pH', v)} placeholder="7.40" highlight={ocrHighlight.has('pH')} />
          <NumberInput label="PaCO₂ (mmHg)" value={form.paco2} onChange={(v) => update('paco2', v)} placeholder="40" highlight={ocrHighlight.has('paco2')} />
          <NumberInput label="HCO₃ (mEq/L)" value={form.hco3} onChange={(v) => update('hco3', v)} placeholder="24" highlight={ocrHighlight.has('hco3')} />
          <NumberInput label="PaO₂ (mmHg)" value={form.pao2} onChange={(v) => update('pao2', v)} placeholder="90" highlight={ocrHighlight.has('pao2')} />
          <NumberInput label="FiO₂ (0.21–1.0)" value={form.fio2} onChange={(v) => update('fio2', v)} placeholder="0.21" highlight={ocrHighlight.has('fio2')} />
          <NumberInput label="Lactate (mmol/L)" value={form.lactate} onChange={(v) => update('lactate', v)} placeholder="1.0" highlight={ocrHighlight.has('lactate')} />
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

      <AITreatmentPanel
        tool="abg"
        getInput={() => ({
          data: {
            pH: form.pH || undefined,
            PaCO2: form.paco2 ? `${form.paco2} mmHg` : undefined,
            HCO3: form.hco3 ? `${form.hco3} mEq/L` : undefined,
            PaO2: form.pao2 ? `${form.pao2} mmHg` : undefined,
            FiO2: form.fio2 || undefined,
            Lactate: form.lactate ? `${form.lactate} mmol/L` : undefined,
            Na: form.na ? `${form.na} mEq/L` : undefined,
            Cl: form.cl ? `${form.cl} mEq/L` : undefined,
            Albumin: form.albumin ? `${form.albumin} g/dL` : undefined,
            'Primary disorder': result?.primaryLabel || undefined,
            'Anion Gap': result?.anionGap != null ? String(result.anionGap.toFixed(1)) : undefined,
            'P/F ratio': result?.pfRatio != null ? String(result.pfRatio.toFixed(0)) : undefined,
          },
        })}
      />

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
  highlight,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  highlight?: boolean;
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
        className={cn(
          'w-full rounded-md border bg-background px-2 py-1.5 text-sm transition-colors',
          highlight && 'border-green-500 bg-green-50 dark:bg-green-950/30',
        )}
      />
    </label>
  );
}
