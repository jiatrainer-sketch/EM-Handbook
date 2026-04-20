import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type BundleItem = {
  id: string;
  label: string;
  detail: string;
  deadline: number; // minutes from T0
};

const BUNDLE_1HR: BundleItem[] = [
  { id: 'lactate', label: 'Lactate', detail: 'Measure serum lactate (recheck if >2 mmol/L)', deadline: 60 },
  { id: 'bc', label: 'Blood cultures', detail: 'BC ×2 (aerobic + anaerobic) ก่อน abx ถ้าไม่ delay >45 min', deadline: 60 },
  { id: 'abx', label: 'Broad-spectrum antibiotics', detail: 'ให้ทันที — เป้าหมาย <1 hr จาก diagnosis', deadline: 60 },
  { id: 'fluid', label: 'IV Crystalloid 30 mL/kg', detail: 'ถ้า hypotension (MAP <65) หรือ lactate ≥4', deadline: 60 },
  { id: 'vaso', label: 'Vasopressor (ถ้าจำเป็น)', detail: 'Norepinephrine เป้า MAP ≥65 ถ้าไม่ตอบ fluid', deadline: 60 },
];

const BUNDLE_3HR: BundleItem[] = [
  { id: 'recheck-lactate', label: 'Recheck lactate', detail: 'ถ้า lactate เริ่มต้น ≥2 mmol/L', deadline: 180 },
  { id: 'reassess', label: 'Reassess fluid status', detail: 'MAP, UOP, lung exam, echo ถ้าทำได้', deadline: 180 },
  { id: 'uop', label: 'Urine output ≥0.5 mL/kg/hr', detail: 'Foley catheter; assess fluid response', deadline: 180 },
];

const BUNDLE_6HR: BundleItem[] = [
  { id: 'vaso-map', label: 'MAP ≥65 ด้วย vasopressor', detail: 'Titrate norepinephrine ถ้ายังใช้อยู่', deadline: 360 },
  { id: 'cvp', label: 'Reassess volume / dynamic parameters', detail: 'PLR, pulse pressure variation, echo', deadline: 360 },
  { id: 'remeasure-lactate', label: 'Re-measure lactate (ถ้า >2 เริ่มต้น)', detail: 'Target lactate clearance ≥10%/2 hr', deadline: 360 },
  { id: 'source', label: 'Source control', detail: 'ระบุ source + drainage/debridement ถ้าต้องการ', deadline: 360 },
];

type CheckState = Record<string, boolean>;

function useTimer() {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [t0, setT0] = useState<number | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    const now = Date.now();
    setT0(now);
    setElapsed(0);
    setStarted(true);
    if (interval.current) clearInterval(interval.current);
    interval.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - now) / 1000));
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    setStarted(false);
  }, []);

  const reset = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    setStarted(false);
    setElapsed(0);
    setT0(null);
  }, []);

  useEffect(() => () => { if (interval.current) clearInterval(interval.current); }, []);

  return { started, elapsed, t0, start, stop, reset };
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function BundleSection({
  title,
  color,
  items,
  checks,
  onToggle,
  elapsedMin,
}: {
  title: string;
  color: string;
  items: BundleItem[];
  checks: CheckState;
  onToggle: (id: string) => void;
  elapsedMin: number;
}) {
  const allDone = items.every((i) => checks[i.id]);
  return (
    <div className={cn('rounded-lg border p-3 space-y-2', allDone && 'opacity-60')}>
      <div className={cn('text-sm font-semibold', color)}>{title}</div>
      {items.map((item) => {
        const deadline = item.deadline;
        const overdue = elapsedMin > deadline && !checks[item.id];
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={cn(
              'flex w-full items-start gap-2 rounded-md p-2 text-left text-sm transition-colors',
              checks[item.id] ? 'bg-green-50 dark:bg-green-950/30' : overdue ? 'bg-red-50 dark:bg-red-950/30' : 'bg-card hover:bg-accent',
            )}
          >
            {checks[item.id]
              ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              : <Circle className={cn('mt-0.5 h-4 w-4 shrink-0', overdue ? 'text-red-500' : 'text-muted-foreground')} />
            }
            <div>
              <div className={cn('font-medium', checks[item.id] && 'line-through text-muted-foreground')}>{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.detail}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function SepsisBundleTimer() {
  const navigate = useNavigate();
  const timer = useTimer();
  const [checks, setChecks] = useState<CheckState>({});

  const elapsedMin = Math.floor(timer.elapsed / 60);

  const toggle = useCallback((id: string) => {
    setChecks((c) => ({ ...c, [id]: !c[id] }));
  }, []);

  const allItems = [...BUNDLE_1HR, ...BUNDLE_3HR, ...BUNDLE_6HR];
  const doneCount = allItems.filter((i) => checks[i.id]).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Sepsis Bundle Timer</h1>
          <p className="text-xs text-muted-foreground">SSC 1-hr bundle + 3-hr + 6-hr checklist</p>
        </div>
      </div>

      {/* Timer */}
      <div className="rounded-lg border bg-card p-4 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Timer className="h-4 w-4" />
          <span>เวลาตั้งแต่ T0 (diagnosis)</span>
        </div>
        <div className={cn(
          'text-5xl font-bold tabular-nums',
          elapsedMin >= 60 && !timer.started ? 'text-muted-foreground' : elapsedMin >= 60 ? 'text-red-600 dark:text-red-400' : elapsedMin >= 45 ? 'text-orange-500' : '',
        )}>
          {formatTime(timer.elapsed)}
        </div>
        <div className="text-xs text-muted-foreground">{doneCount}/{allItems.length} tasks complete</div>
        <div className="flex justify-center gap-2">
          {!timer.started
            ? <Button size="sm" onClick={timer.start}>เริ่มจับเวลา (T0)</Button>
            : <Button size="sm" variant="outline" onClick={timer.stop}>หยุดชั่วคราว</Button>
          }
          <Button size="sm" variant="outline" onClick={() => { timer.reset(); setChecks({}); }}>Reset</Button>
        </div>
      </div>

      <BundleSection
        title="1-Hour Bundle (Surviving Sepsis Campaign)"
        color="text-red-600 dark:text-red-400"
        items={BUNDLE_1HR}
        checks={checks}
        onToggle={toggle}
        elapsedMin={elapsedMin}
      />
      <BundleSection
        title="3-Hour Reassessment"
        color="text-orange-600 dark:text-orange-400"
        items={BUNDLE_3HR}
        checks={checks}
        onToggle={toggle}
        elapsedMin={elapsedMin}
      />
      <BundleSection
        title="6-Hour Bundle"
        color="text-yellow-600 dark:text-yellow-400"
        items={BUNDLE_6HR}
        checks={checks}
        onToggle={toggle}
        elapsedMin={elapsedMin}
      />

      <AITreatmentPanel
        tool="sepsis-timer"
        getInput={() => ({
          data: {
            'เวลาที่ผ่านมา': `${elapsedMin} นาที`,
            'Tasks completed': `${doneCount}/${allItems.length}`,
            'Bundle 1-hr': BUNDLE_1HR.filter(i => checks[i.id]).map(i => i.label).join(', ') || 'ยังไม่ทำ',
          },
        })}
      />

      <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1">
        <div className="font-medium">Sepsis definition (Sepsis-3)</div>
        <div>Sepsis: organ dysfunction + suspected infection (SOFA ≥2 from baseline)</div>
        <div>Septic shock: vasopressor + lactate &gt;2 mmol/L ร่วมกับ hypotension (MAP &lt;65)</div>
        <div className="text-red-600 dark:text-red-400 font-medium">Abx delay 1 hr → mortality ↑ 7–10% ใน septic shock</div>
      </div>

      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
