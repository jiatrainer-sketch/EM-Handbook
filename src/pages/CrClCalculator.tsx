import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type Form = {
  age: string;
  weight: string;
  creatinine: string;
  sex: 'male' | 'female';
  race: 'non-black' | 'black';
};

const EMPTY: Form = { age: '', weight: '', creatinine: '', sex: 'male', race: 'non-black' };

function toNum(s: string): number | null {
  if (!s.trim()) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type Results = {
  cg: number | null;
  mdrd: number | null;
  ckdepi: number | null;
};

function calcCrCl(f: Form): Results {
  const age = toNum(f.age);
  const wt = toNum(f.weight);
  const scr = toNum(f.creatinine);

  // Cockcroft-Gault (mL/min)
  let cg: number | null = null;
  if (age != null && wt != null && scr != null) {
    cg = ((140 - age) * wt) / (72 * scr);
    if (f.sex === 'female') cg *= 0.85;
    cg = Math.max(0, cg);
  }

  // MDRD (mL/min/1.73m²) — 4-variable
  let mdrd: number | null = null;
  if (age != null && scr != null) {
    mdrd = 186 * Math.pow(scr, -1.154) * Math.pow(age, -0.203);
    if (f.sex === 'female') mdrd *= 0.742;
    if (f.race === 'black') mdrd *= 1.212;
    mdrd = Math.round(mdrd * 10) / 10;
  }

  // CKD-EPI 2021 (mL/min/1.73m²) — no race factor
  let ckdepi: number | null = null;
  if (age != null && scr != null) {
    const kappa = f.sex === 'female' ? 0.7 : 0.9;
    const alpha = f.sex === 'female' ? -0.241 : -0.302;
    const scrK = scr / kappa;
    const min = Math.min(scrK, 1);
    const max = Math.max(scrK, 1);
    ckdepi = 142 * Math.pow(min, alpha) * Math.pow(max, -1.2) * Math.pow(0.9938, age);
    if (f.sex === 'female') ckdepi *= 1.012;
    ckdepi = Math.round(ckdepi * 10) / 10;
  }

  return { cg: cg != null ? Math.round(cg * 10) / 10 : null, mdrd, ckdepi };
}

function ckdStage(gfr: number): { stage: string; label: string; color: string } {
  if (gfr >= 90) return { stage: 'G1', label: 'Normal / High', color: 'text-green-600 dark:text-green-400' };
  if (gfr >= 60) return { stage: 'G2', label: 'Mildly decreased', color: 'text-yellow-500 dark:text-yellow-400' };
  if (gfr >= 45) return { stage: 'G3a', label: 'Mild-moderate decrease', color: 'text-orange-500' };
  if (gfr >= 30) return { stage: 'G3b', label: 'Moderate-severe decrease', color: 'text-orange-600' };
  if (gfr >= 15) return { stage: 'G4', label: 'Severely decreased', color: 'text-red-600 dark:text-red-400' };
  return { stage: 'G5', label: 'Kidney failure', color: 'text-red-700 dark:text-red-300 font-bold' };
}

function Field({ label, value, onChange, placeholder, unit }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; unit?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {unit && <span className="flex items-center rounded-md border bg-muted px-2 text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

export default function CrClCalculator() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);

  const results = useMemo(() => calcCrCl(form), [form]);
  const ckdFromEpi = results.ckdepi != null ? ckdStage(results.ckdepi) : null;

  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">CrCl / eGFR Calculator</h1>
          <p className="text-xs text-muted-foreground">Cockcroft-Gault · MDRD · CKD-EPI 2021</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="อายุ" value={form.age} onChange={set('age')} placeholder="60" unit="ปี" />
        <Field label="น้ำหนัก (actual body weight)" value={form.weight} onChange={set('weight')} placeholder="60" unit="kg" />
        <Field label="Serum Creatinine" value={form.creatinine} onChange={set('creatinine')} placeholder="1.0" unit="mg/dL" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">เพศ</div>
          <div className="flex gap-2">
            {(['male', 'female'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setForm((f) => ({ ...f, sex: s }))}
                className={cn('flex-1 rounded-md border py-2 text-sm', form.sex === s ? 'border-primary bg-primary/10 font-medium' : 'bg-card hover:bg-accent')}
              >
                {s === 'male' ? '♂ ชาย' : '♀ หญิง'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">เชื้อชาติ (MDRD)</div>
          <div className="flex gap-2">
            {(['non-black', 'black'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setForm((f) => ({ ...f, race: r }))}
                className={cn('flex-1 rounded-md border py-2 text-sm', form.race === r ? 'border-primary bg-primary/10 font-medium' : 'bg-card hover:bg-accent')}
              >
                {r === 'black' ? 'Black' : 'Other'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(results.cg != null || results.mdrd != null || results.ckdepi != null) && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="text-sm font-semibold">ผลการคำนวณ</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-muted p-2">
              <div className="text-xs text-muted-foreground">Cockcroft-Gault</div>
              <div className="text-lg font-bold">{results.cg ?? '—'}</div>
              <div className="text-xs text-muted-foreground">mL/min</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <div className="text-xs text-muted-foreground">MDRD</div>
              <div className="text-lg font-bold">{results.mdrd ?? '—'}</div>
              <div className="text-xs text-muted-foreground">mL/min/1.73m²</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <div className="text-xs text-muted-foreground">CKD-EPI 2021</div>
              <div className="text-lg font-bold">{results.ckdepi ?? '—'}</div>
              <div className="text-xs text-muted-foreground">mL/min/1.73m²</div>
            </div>
          </div>
          {ckdFromEpi && (
            <div className="text-center">
              <span className={cn('text-sm font-medium', ckdFromEpi.color)}>
                CKD {ckdFromEpi.stage} — {ckdFromEpi.label}
              </span>
              <div className="text-xs text-muted-foreground">(based on CKD-EPI)</div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1">
        <div className="font-medium">Drug dosing thresholds (CG-based)</div>
        <div>CrCl &lt; 30: ยาส่วนใหญ่ต้องปรับ dose หรือ avoid (metformin, DOAC บางชนิด)</div>
        <div>CrCl &lt; 15: dialysis consideration; dabigatran/rivaroxaban → avoid</div>
        <div>MDRD/CKD-EPI เหมาะสำหรับ staging CKD; CG ใช้สำหรับ drug dosing</div>
      </div>

      <AITreatmentPanel
        tool="crcl"
        getInput={() => ({
          data: {
            Age: form.age,
            Weight: form.weight ? `${form.weight} kg` : undefined,
            Creatinine: form.creatinine ? `${form.creatinine} mg/dL` : undefined,
            Sex: form.sex,
            'CG (CrCl)': results.cg ? `${results.cg} mL/min` : undefined,
            'MDRD (eGFR)': results.mdrd ? `${results.mdrd} mL/min/1.73m²` : undefined,
            'CKD-EPI (eGFR)': results.ckdepi ? `${results.ckdepi} mL/min/1.73m²` : undefined,
            'CKD Stage': ckdFromEpi ? `${ckdFromEpi.stage} — ${ckdFromEpi.label}` : undefined,
          },
          bw: toNum(form.weight) ?? 60,
        })}
      />

      <Button variant="outline" size="sm" onClick={() => setForm(EMPTY)} className="w-full">Reset</Button>
      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
