import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

function toNum(s: string): number | null {
  if (!s.trim()) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function interpretSI(si: number): { label: string; color: string; action: string } {
  if (si < 0.6) return { label: 'Normal', color: 'text-green-600 dark:text-green-400', action: 'ไม่มีสัญญาณ hemodynamic compromise' };
  if (si < 0.9) return { label: 'Borderline', color: 'text-yellow-500', action: 'Monitor ต่อเนื่อง, ประเมิน volume status' };
  if (si < 1.4) return { label: 'Overt Shock', color: 'text-orange-500', action: 'Resuscitate ทันที — IV bolus, identify source' };
  return { label: 'Severe Shock', color: 'text-red-600 dark:text-red-400', action: 'Critical — vasopressor, ICU, urgent intervention' };
}

function Field({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-1">
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {unit && <span className="flex items-center rounded-md border bg-muted px-2 text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

export default function ShockIndex() {
  const navigate = useNavigate();
  const [hr, setHr] = useState('');
  const [sbp, setSbp] = useState('');
  const [age, setAge] = useState('');
  const [wt, setWt] = useState('');

  const result = useMemo(() => {
    const hrVal = toNum(hr);
    const sbpVal = toNum(sbp);
    const ageVal = toNum(age);
    if (hrVal == null || sbpVal == null) return null;

    const si = hrVal / sbpVal;
    const msi = si * (ageVal ?? 60); // Modified Shock Index × age factor

    const interp = interpretSI(si);
    const ageAdj = ageVal != null ? (hrVal / sbpVal) * (ageVal / 10) : null;

    return { si, msi, ageAdj, interp, hrVal, sbpVal };
  }, [hr, sbp, age]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Shock Index</h1>
          <p className="text-xs text-muted-foreground">SI · Modified SI · Age-adjusted SI</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Heart Rate" value={hr} onChange={setHr} unit="bpm" placeholder="100" />
        <Field label="Systolic BP" value={sbp} onChange={setSbp} unit="mmHg" placeholder="100" />
        <Field label="อายุ (optional)" value={age} onChange={setAge} unit="ปี" placeholder="60" />
        <Field label="น้ำหนัก (optional)" value={wt} onChange={setWt} unit="kg" placeholder="60" />
      </div>

      {result && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-muted p-3">
              <div className="text-xs text-muted-foreground">Shock Index</div>
              <div className="text-2xl font-bold tabular-nums">{result.si.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">HR/SBP</div>
            </div>
            <div className="rounded-md bg-muted p-3">
              <div className="text-xs text-muted-foreground">Modified SI</div>
              <div className="text-2xl font-bold tabular-nums">{result.msi.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">SI × age/10</div>
            </div>
            {result.ageAdj != null && (
              <div className="rounded-md bg-muted p-3">
                <div className="text-xs text-muted-foreground">Age-adj</div>
                <div className="text-2xl font-bold tabular-nums">{result.ageAdj.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">SI × age/10</div>
              </div>
            )}
          </div>
          <div className="text-center">
            <div className={cn('text-lg font-bold', result.interp.color)}>{result.interp.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{result.interp.action}</div>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1">
        <div className="font-medium">Reference ranges</div>
        <div>SI &lt; 0.6: Normal | 0.6–0.9: Borderline | 0.9–1.4: Shock | &gt;1.4: Severe shock</div>
        <div>SI ≥ 1.0 + trauma → transfusion likely needed (MTP protocol)</div>
        <div>Modified SI ≥ 1.3 in OB → significant hemodynamic instability</div>
      </div>

      <AITreatmentPanel
        tool="shock-index"
        getInput={() => ({
          data: {
            HR: hr ? `${hr} bpm` : undefined,
            SBP: sbp ? `${sbp} mmHg` : undefined,
            Age: age || undefined,
            Weight: wt ? `${wt} kg` : undefined,
            'Shock Index': result ? result.si.toFixed(2) : undefined,
            Risk: result?.interp.label || undefined,
          },
          bw: toNum(wt) ?? 60,
        })}
      />

      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
