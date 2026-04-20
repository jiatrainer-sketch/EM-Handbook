import { useMemo, useRef, useState } from 'react';
import { Camera, Copy, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  extractAbgFromImage,
  interpretAbgAndAdjustVent,
  type AbgInterpretation,
  type AbgValues,
} from '@/lib/ventAi';
import AITreatmentPanel from '@/components/AITreatmentPanel';

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

type AbgForm = {
  pH: string;
  paco2: string;
  pao2: string;
  hco3: string;
  fio2: string;
};

const DEFAULT_ABG: AbgForm = { pH: '', paco2: '', pao2: '', hco3: '', fio2: '' };

export default function VentilatorQuickStart() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [toast, setToast] = useState<string | null>(null);
  const [abg, setAbg] = useState<AbgForm>(DEFAULT_ABG);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [interpLoading, setInterpLoading] = useState(false);
  const [interpError, setInterpError] = useState<string | null>(null);
  const [interpResult, setInterpResult] = useState<AbgInterpretation | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const height = Number(form.heightCm) || 0;
  const ibw = useMemo(() => calcIbw(height, form.sex), [height, form.sex]);
  const settings = useMemo(() => settingsFor(form.scenario, ibw), [form.scenario, ibw]);
  const summary = useMemo(() => buildSummary(form, ibw, settings), [form, ibw, settings]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  async function compressImageToBase64(file: File): Promise<{ data: string; mediaType: 'image/jpeg' }> {
    const bitmap = await createImageBitmap(file);
    const maxDim = 1280;
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('ไม่สามารถใช้ canvas ได้');
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.82),
    );
    if (!blob) throw new Error('compress รูปไม่สำเร็จ');
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    return { data: b64, mediaType: 'image/jpeg' };
  }

  async function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking same file
    if (!file) return;
    setOcrError(null);
    setOcrLoading(true);
    try {
      const { data, mediaType } = await compressImageToBase64(file);
      const values: AbgValues = await extractAbgFromImage(data, mediaType);
      setAbg((prev) => ({
        pH: values.pH != null ? String(values.pH) : prev.pH,
        paco2: values.paco2 != null ? String(values.paco2) : prev.paco2,
        pao2: values.pao2 != null ? String(values.pao2) : prev.pao2,
        hco3: values.hco3 != null ? String(values.hco3) : prev.hco3,
        fio2:
          values.fio2 != null
            ? String(values.fio2 > 1 ? values.fio2 / 100 : values.fio2)
            : prev.fio2,
      }));
      showToast(values.notes ? `OCR สำเร็จ: ${values.notes}` : 'OCR เติมค่าแล้ว — ตรวจสอบก่อนใช้');
    } catch (err) {
      setOcrError(err instanceof Error ? err.message : 'OCR ล้มเหลว');
    } finally {
      setOcrLoading(false);
    }
  }

  async function handleInterpret() {
    const hasAny = Object.values(abg).some((v) => v.trim() !== '');
    if (!hasAny) return;
    setInterpError(null);
    setInterpLoading(true);
    setInterpResult(null);
    try {
      const abgParsed: Partial<AbgValues> = {
        pH: abg.pH ? Number(abg.pH) : null,
        paco2: abg.paco2 ? Number(abg.paco2) : null,
        pao2: abg.pao2 ? Number(abg.pao2) : null,
        hco3: abg.hco3 ? Number(abg.hco3) : null,
        fio2: abg.fio2 ? Number(abg.fio2) : null,
      };
      const result = await interpretAbgAndAdjustVent(
        abgParsed,
        {
          mode: settings.mode,
          vt: settings.vtRange,
          rr: settings.rr,
          peep: settings.peep,
          fio2: settings.fio2,
          ie: settings.ie,
        },
        { scenario: SCENARIOS[form.scenario], ibwKg: ibw || null },
      );
      setInterpResult(result);
    } catch (err) {
      setInterpError(err instanceof Error ? err.message : 'AI ล้มเหลว');
    } finally {
      setInterpLoading(false);
    }
  }

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

      {/* ── ABG interpreter + AI vent adjustment ── */}
      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">ABG + ปรับ Ventilator (AI)</h2>
        <p className="text-xs text-muted-foreground">
          กรอกค่า ABG หรือถ่ายรูปรายงาน → AI แปลผล + แนะนำปรับ vent
        </p>

        {/* Photo OCR */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelected}
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={ocrLoading}
          >
            {ocrLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังอ่าน…
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" /> 📷 ถ่ายรูป ABG
              </>
            )}
          </Button>
          <span className="text-[11px] text-muted-foreground">
            (รูปจะถูก compress + ส่งให้ AI extract — ยืนยันค่าก่อน interpret)
          </span>
        </div>
        {ocrError && (
          <div className="rounded-md bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
            OCR: {ocrError}
          </div>
        )}

        {/* Manual entry / OCR pre-filled */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {([
            { key: 'pH', label: 'pH', placeholder: '7.40' },
            { key: 'paco2', label: 'PaCO₂', placeholder: '40' },
            { key: 'pao2', label: 'PaO₂', placeholder: '90' },
            { key: 'hco3', label: 'HCO₃⁻', placeholder: '24' },
            { key: 'fio2', label: 'FiO₂ (0.21–1.0)', placeholder: '0.4' },
          ] as const).map(({ key, label, placeholder }) => (
            <label key={key} className="space-y-1">
              <span className="text-[11px] text-muted-foreground">{label}</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                value={abg[key]}
                onChange={(e) => setAbg((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleInterpret}
            disabled={interpLoading || !Object.values(abg).some((v) => v.trim())}
          >
            {interpLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> วิเคราะห์…
              </>
            ) : (
              '🤖 AI แปล + แนะนำปรับ vent'
            )}
          </Button>
          {(interpResult || Object.values(abg).some((v) => v.trim())) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAbg(DEFAULT_ABG);
                setInterpResult(null);
                setInterpError(null);
              }}
            >
              <X className="mr-1 h-3 w-3" /> ล้างค่า
            </Button>
          )}
        </div>

        {interpError && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
            {interpError}
          </div>
        )}

        {interpResult && (
          <div className="space-y-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950">
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">🧠 Interpretation</p>
              <p className="mt-1">
                <strong>Primary disorder:</strong> {interpResult.primaryDisorder}
              </p>
              <p>
                <strong>Compensation:</strong> {interpResult.compensation}
              </p>
              {interpResult.pfRatio != null && (
                <p>
                  <strong>P/F ratio:</strong> {interpResult.pfRatio}
                  {interpResult.ardsGrade && interpResult.ardsGrade !== 'none' && (
                    <span className="ml-1 text-red-700 dark:text-red-300">
                      → ARDS {interpResult.ardsGrade}
                    </span>
                  )}
                </p>
              )}
            </div>

            {interpResult.redFlags.length > 0 && (
              <div>
                <p className="font-medium text-red-700 dark:text-red-300">⚠️ Red flags</p>
                <ul className="ml-4 list-disc">
                  {interpResult.redFlags.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {interpResult.adjustments.length > 0 && (
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">🔧 แนะนำปรับ</p>
                <div className="space-y-1">
                  {interpResult.adjustments.map((a, i) => (
                    <div key={i} className="rounded bg-background/60 p-2">
                      <p>
                        <strong>{a.param}:</strong>{' '}
                        {a.from ? `${a.from} → ` : ''}
                        <span className="font-semibold text-blue-800 dark:text-blue-200">
                          {a.to}
                        </span>
                      </p>
                      <p className="text-muted-foreground">{a.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p>
              <strong>Recheck:</strong> {interpResult.recheck}
            </p>

            {interpResult.notes.length > 0 && (
              <div>
                <p className="font-medium">Notes</p>
                <ul className="ml-4 list-disc">
                  {interpResult.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11px] italic text-muted-foreground">
              ⚠️ AI เป็นตัวช่วยคิด — ตรวจสอบและ adapt ให้เข้ากับคนไข้จริงเสมอ
            </p>
          </div>
        )}
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

      <AITreatmentPanel
        tool="vent"
        getInput={() => ({
          data: {
            Height: form.heightCm ? `${form.heightCm} cm` : undefined,
            Weight: form.actualKg ? `${form.actualKg} kg` : undefined,
            Sex: form.sex,
            Scenario: SCENARIOS[form.scenario],
            IBW: ibw ? `${ibw} kg` : undefined,
            Mode: settings.mode,
            VT: settings.vtRange,
            PEEP: settings.peep,
            FiO2: settings.fio2,
            pH: abg.pH || undefined,
            PaCO2: abg.paco2 || undefined,
            PaO2: abg.pao2 || undefined,
            HCO3: abg.hco3 || undefined,
            'AI Interp': interpResult?.primaryDisorder || undefined,
          },
          bw: Number(form.actualKg) || Number(ibw) || 60,
        })}
      />

      <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1.5">
        <div className="font-medium text-muted-foreground">📚 ดูเพิ่มเติม</div>
        <div className="flex flex-col gap-1">
          <Link to="/reference/high-alert-drip-table" className="text-primary hover:underline">💊 High Alert Drip Table — สูตรผสม vasopressor + sedative ครบ</Link>
          <Link to="/reference/icu-sedation-protocol" className="text-primary hover:underline">🛏️ ICU Sedation Protocol — analgosedation stepwise</Link>
          <Link to="/tools/sedation-helper" className="text-primary hover:underline">🤖 AI Sedation Helper — แนะนำ regimen ตามคนไข้</Link>
        </div>
      </div>

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
