import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Eye = 1 | 2 | 3 | 4;
type Verbal = 1 | 2 | 3 | 4 | 5;
type Motor = 1 | 2 | 3 | 4 | 5 | 6;

const EYE_OPTIONS: { val: Eye; label: string; sublabel: string }[] = [
  { val: 4, label: 'E4 — Spontaneous', sublabel: 'ลืมตาเองโดยไม่ต้องกระตุ้น' },
  { val: 3, label: 'E3 — To speech', sublabel: 'ลืมตาเมื่อเรียก' },
  { val: 2, label: 'E2 — To pain', sublabel: 'ลืมตาเมื่อกดเจ็บ' },
  { val: 1, label: 'E1 — None', sublabel: 'ไม่ลืมตาเลย' },
];

const VERBAL_OPTIONS: { val: Verbal; label: string; sublabel: string }[] = [
  { val: 5, label: 'V5 — Oriented', sublabel: 'บอกชื่อ สถานที่ เวลาได้ถูกต้อง' },
  { val: 4, label: 'V4 — Confused', sublabel: 'พูดได้ แต่สับสน' },
  { val: 3, label: 'V3 — Words', sublabel: 'พูดได้เป็นคำๆ ไม่เป็นประโยค' },
  { val: 2, label: 'V2 — Sounds', sublabel: 'เปล่งเสียงไม่ใช่คำ (唸, ร้อง)' },
  { val: 1, label: 'V1 — None', sublabel: 'ไม่มีเสียงเลย' },
];

const MOTOR_OPTIONS: { val: Motor; label: string; sublabel: string }[] = [
  { val: 6, label: 'M6 — Obeys commands', sublabel: 'ทำตามคำสั่งได้' },
  { val: 5, label: 'M5 — Localizes pain', sublabel: 'เคลื่อนมือไปที่เจ็บ' },
  { val: 4, label: 'M4 — Withdraws', sublabel: 'ดึงออกจากที่เจ็บ (flexion)' },
  { val: 3, label: 'M3 — Abnormal flexion', sublabel: 'Decorticate (flexion arm, extension leg)' },
  { val: 2, label: 'M2 — Extension', sublabel: 'Decerebrate (extension ทั้งหมด)' },
  { val: 1, label: 'M1 — None', sublabel: 'ไม่มีการเคลื่อนไหว' },
];

function interpretGCS(gcs: number): { label: string; color: string; mgmt: string } {
  if (gcs === 15) return { label: 'ปกติ (Normal)', color: 'text-green-600 dark:text-green-400', mgmt: 'ไม่ต้องการ intervention เฉพาะ' };
  if (gcs >= 13) return { label: 'Mild impairment', color: 'text-yellow-600 dark:text-yellow-400', mgmt: 'Monitor close, หา cause' };
  if (gcs >= 9) return { label: 'Moderate impairment', color: 'text-orange-600 dark:text-orange-400', mgmt: 'Admit, consider CT head, monitor airway' };
  if (gcs >= 6) return { label: 'Severe impairment', color: 'text-red-600 dark:text-red-400', mgmt: 'Airway protection, likely intubation' };
  return { label: 'Coma / ภาวะวิกฤต', color: 'text-red-700 dark:text-red-300 font-bold', mgmt: 'Intubate immediately, ICU' };
}

function RadioGroup<T extends number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { val: T; label: string; sublabel: string }[];
  value: T | null;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold">{label}</div>
      <div className="space-y-1">
        {options.map((o) => (
          <button
            key={o.val}
            onClick={() => onChange(o.val)}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-left text-sm transition-colors',
              value === o.val
                ? 'border-primary bg-primary/10 font-medium'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            <div>{o.label}</div>
            <div className="text-xs text-muted-foreground">{o.sublabel}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GCSCalculator() {
  const navigate = useNavigate();
  const [eye, setEye] = useState<Eye | null>(null);
  const [verbal, setVerbal] = useState<Verbal | null>(null);
  const [motor, setMotor] = useState<Motor | null>(null);

  const gcs = useMemo(() => {
    if (eye == null || verbal == null || motor == null) return null;
    return eye + verbal + motor;
  }, [eye, verbal, motor]);

  const interp = useMemo(() => (gcs != null ? interpretGCS(gcs) : null), [gcs]);

  function reset() {
    setEye(null);
    setVerbal(null);
    setMotor(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">GCS Calculator</h1>
          <p className="text-xs text-muted-foreground">Glasgow Coma Scale — E + V + M</p>
        </div>
      </div>

      {gcs != null && interp != null && (
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-4xl font-bold tabular-nums">
            GCS {gcs}/15
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            E{eye} + V{verbal} + M{motor}
          </div>
          <div className={cn('mt-2 text-sm font-medium', interp.color)}>{interp.label}</div>
          <div className="mt-1 text-xs text-muted-foreground">{interp.mgmt}</div>
        </div>
      )}

      <div className="space-y-4">
        <RadioGroup label="👁 Eye Opening (E)" options={EYE_OPTIONS} value={eye} onChange={setEye} />
        <RadioGroup label="🗣 Verbal Response (V)" options={VERBAL_OPTIONS} value={verbal} onChange={setVerbal} />
        <RadioGroup label="🖐 Motor Response (M)" options={MOTOR_OPTIONS} value={motor} onChange={setMotor} />
      </div>

      <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
        <div className="font-medium text-foreground">Intubation threshold</div>
        <div>GCS ≤ 8 → พิจารณา definitive airway</div>
        <div>GCS &lt; 15 + deteriorating → monitor q 1 hr, CT หากเหมาะสม</div>
      </div>

      <Button variant="outline" size="sm" onClick={reset} className="w-full">
        Reset
      </Button>

      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
