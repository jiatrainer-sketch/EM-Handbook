import { useEffect, useMemo, useState } from 'react';
import { Copy, History as HistoryIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Sex = 'M' | 'F';
type SurgeryRisk = 'low' | 'intermediate' | 'high';
type AsaClass = 'I' | 'II' | 'III' | 'IV' | 'V';
type RedFlagKey =
  | 'recentMi'
  | 'decompensatedHf'
  | 'severeAs'
  | 'activeAcs'
  | 'uncontrolledHt';

type FormState = {
  age: string;
  sex: Sex;
  weight: string;
  surgery: SurgeryRisk;
  asa: AsaClass;
  ihd: boolean;
  hf: boolean;
  cvd: boolean;
  insulinDm: boolean;
  crHigh: boolean;
  redFlags: Record<RedFlagKey, boolean>;
};

type HistoryEntry = {
  ts: number;
  summary: string;
  form: FormState;
};

const HISTORY_KEY = 'em:preop-history';
const HISTORY_MAX = 5;

const DEFAULT_FORM: FormState = {
  age: '',
  sex: 'M',
  weight: '60',
  surgery: 'low',
  asa: 'II',
  ihd: false,
  hf: false,
  cvd: false,
  insulinDm: false,
  crHigh: false,
  redFlags: {
    recentMi: false,
    decompensatedHf: false,
    severeAs: false,
    activeAcs: false,
    uncontrolledHt: false,
  },
};

const SURGERY_LABELS: Record<SurgeryRisk, string> = {
  low: 'Low risk (cataract, endoscopy, breast)',
  intermediate: 'Intermediate (ortho, head/neck, urologic)',
  high: 'High risk (vascular, intra-abd, intra-thoracic)',
};

const RED_FLAG_LABELS: Record<RedFlagKey, { label: string; action: string }> = {
  recentMi: { label: 'Recent MI < 60 days', action: 'POSTPONE elective' },
  decompensatedHf: { label: 'Decompensated HF', action: 'OPTIMIZE first' },
  severeAs: { label: 'Severe AS', action: 'Cardiology MANDATORY' },
  activeAcs: { label: 'Active ACS', action: 'EMERGENT cardiac eval' },
  uncontrolledHt: {
    label: 'Uncontrolled HT > 180/110',
    action: 'DEFER until controlled',
  },
};

function rcriScore(f: FormState): number {
  let n = 0;
  if (f.surgery === 'high') n += 1;
  if (f.ihd) n += 1;
  if (f.hf) n += 1;
  if (f.cvd) n += 1;
  if (f.insulinDm) n += 1;
  if (f.crHigh) n += 1;
  return n;
}

function riskBand(score: number): {
  category: string;
  categoryTh: string;
  pct: string;
  color: string;
} {
  if (score === 0)
    return {
      category: 'Very Low',
      categoryTh: 'ความเสี่ยงต่ำมาก',
      pct: '0.4',
      color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
    };
  if (score === 1)
    return {
      category: 'Low',
      categoryTh: 'ความเสี่ยงต่ำ',
      pct: '0.9',
      color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
    };
  if (score === 2)
    return {
      category: 'Intermediate',
      categoryTh: 'ความเสี่ยงปานกลาง',
      pct: '6.6',
      color: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
    };
  return {
    category: 'High',
    categoryTh: 'ความเสี่ยงสูง',
    pct: '>11',
    color: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100',
  };
}

function recommendations(score: number): string[] {
  if (score <= 1) {
    return [
      'ดำเนินการผ่าตัดได้',
      'Pre-op labs ตาม indication',
      'ไม่ต้อง cardiac testing เพิ่ม',
    ];
  }
  if (score === 2) {
    return [
      'พิจารณา stress test ถ้า poor METs (<4)',
      'Optimize comorbidities',
      'Baseline ECG',
    ];
  }
  return [
    'Consult Cardiology',
    'Echocardiogram',
    'พิจารณา stress test / CAG',
    'Optimize ก่อน elective surgery',
    'ICU postop ถ้า high-risk surgery',
  ];
}

function labChecklist(f: FormState): string[] {
  const age = Number(f.age) || 0;
  const labs: string[] = [];
  if (f.surgery !== 'low') labs.push('CBC');
  if (age >= 40 && age <= 65) {
    labs.push('BUN / Cr');
    const ecgSex = f.sex === 'M' ? age >= 45 : age >= 55;
    if (ecgSex) labs.push('ECG');
  }
  if (age > 65) {
    labs.push('BUN / Cr', 'Glucose', 'CXR', 'ECG');
  }
  if (f.insulinDm) labs.push('HbA1c');
  if (f.ihd || f.hf) labs.push('Troponin (baseline)', 'Echo');
  if (f.cvd) labs.push('Carotid US (ถ้า TIA/stroke < 6 เดือน)');
  return Array.from(new Set(labs));
}

function clearanceVerdict(score: number, anyRedFlag: boolean): string {
  if (anyRedFlag) return 'Postpone / Optimize first';
  if (score <= 1) return 'Proceed';
  if (score === 2) return 'Proceed with caution';
  return 'Optimize first';
}

function buildSummary(f: FormState): string {
  const score = rcriScore(f);
  const band = riskBand(score);
  const labs = labChecklist(f);
  const recs = recommendations(score);
  const activeFlags = (Object.keys(f.redFlags) as RedFlagKey[]).filter(
    (k) => f.redFlags[k],
  );
  const anyFlag = activeFlags.length > 0;
  const lines: string[] = [];
  lines.push('Pre-op Clearance');
  lines.push(
    `Patient: ${f.age || '?'}/${f.sex}, BW ${f.weight || '?'} kg`,
  );
  lines.push(
    `ASA: ${f.asa}, RCRI: ${score} points (${band.category}, ${band.pct}% 30-day MACE)`,
  );
  lines.push(
    `Surgery risk: ${f.surgery[0].toUpperCase() + f.surgery.slice(1)}`,
  );
  lines.push('');
  lines.push('Recommendations:');
  recs.forEach((r) => lines.push(`- ${r}`));
  if (labs.length) {
    lines.push('');
    lines.push(`Labs: ${labs.join(', ')}`);
  }
  if (anyFlag) {
    lines.push('');
    lines.push('Red flags:');
    activeFlags.forEach((k) =>
      lines.push(
        `- ${RED_FLAG_LABELS[k].label} → ${RED_FLAG_LABELS[k].action}`,
      ),
    );
  }
  lines.push('');
  lines.push(`Clearance: ${clearanceVerdict(score, anyFlag)}`);
  return lines.join('\n');
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e: unknown): e is HistoryEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as HistoryEntry).ts === 'number' &&
        typeof (e as HistoryEntry).summary === 'string',
    );
  } catch {
    return [];
  }
}

function saveToHistory(form: FormState, summary: string) {
  const prev = loadHistory();
  const next: HistoryEntry[] = [{ ts: Date.now(), summary, form }, ...prev].slice(
    0,
    HISTORY_MAX,
  );
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // storage full — ignore
  }
}

function formatTs(ts: number): string {
  try {
    return new Date(ts).toLocaleString('th-TH', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return new Date(ts).toISOString();
  }
}

export default function PreopHelper() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [toast, setToast] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Auto-check "high-risk surgery" column internally; surgery=high drives
  // RCRI directly via rcriScore(). No separate checkbox needed since the
  // "surgery risk" select is the single source of truth for that criterion.

  const score = rcriScore(form);
  const band = useMemo(() => riskBand(score), [score]);
  const recs = useMemo(() => recommendations(score), [score]);
  const labs = useMemo(() => labChecklist(form), [form]);
  const activeFlags = (Object.keys(form.redFlags) as RedFlagKey[]).filter(
    (k) => form.redFlags[k],
  );
  const summary = useMemo(() => buildSummary(form), [form]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setToast('คัดลอกแล้ว');
      saveToHistory(form, summary);
      setHistory(loadHistory());
      setTimeout(() => setToast(null), 1800);
    } catch {
      setToast('คัดลอกไม่สำเร็จ');
      setTimeout(() => setToast(null), 1800);
    }
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
  }

  function handleLoad(entry: HistoryEntry) {
    setForm(entry.form);
    setShowHistory(false);
  }

  function handleClearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
    setHistory([]);
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleFlag = (key: RedFlagKey) =>
    setForm((f) => ({
      ...f,
      redFlags: { ...f.redFlags, [key]: !f.redFlags[key] },
    }));

  return (
    <div className="space-y-4 pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Pre-op Clearance Helper</h1>
        <p className="text-sm text-muted-foreground">
          RCRI calculator + แนะนำ workup — ตรวจสอบก่อนใช้จริงทุกครั้ง
        </p>
      </header>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">ข้อมูลผู้ป่วย</h2>
        <div className="grid grid-cols-3 gap-3">
          <label className="space-y-1">
            <span className="text-xs text-muted-foreground">Age</span>
            <input
              type="number"
              inputMode="numeric"
              min={18}
              max={120}
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="70"
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
          <label className="space-y-1">
            <span className="text-xs text-muted-foreground">BW (kg)</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={300}
              value={form.weight}
              onChange={(e) => update('weight', e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">Surgery risk</h2>
        <div className="space-y-2">
          {(Object.keys(SURGERY_LABELS) as SurgeryRisk[]).map((k) => (
            <label
              key={k}
              className={cn(
                'flex cursor-pointer items-start gap-2 rounded-md border p-2 text-sm',
                form.surgery === k && 'border-primary bg-primary/5',
              )}
            >
              <input
                type="radio"
                name="surgery"
                checked={form.surgery === k}
                onChange={() => update('surgery', k)}
                className="mt-1"
              />
              <span>{SURGERY_LABELS[k]}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Comorbidities (RCRI)</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {score} / 6 points
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <Checkbox
            checked={form.surgery === 'high'}
            disabled
            label="High-risk surgery (auto จาก Surgery risk ด้านบน)"
          />
          <Checkbox
            checked={form.ihd}
            onChange={() => update('ihd', !form.ihd)}
            label="Ischemic heart disease"
          />
          <Checkbox
            checked={form.hf}
            onChange={() => update('hf', !form.hf)}
            label="Heart failure"
          />
          <Checkbox
            checked={form.cvd}
            onChange={() => update('cvd', !form.cvd)}
            label="Cerebrovascular disease (stroke / TIA)"
          />
          <Checkbox
            checked={form.insulinDm}
            onChange={() => update('insulinDm', !form.insulinDm)}
            label="Insulin-dependent diabetes"
          />
          <Checkbox
            checked={form.crHigh}
            onChange={() => update('crHigh', !form.crHigh)}
            label="Serum Cr > 2.0 mg/dL"
          />
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">ASA Class</h2>
        <div className="grid grid-cols-5 gap-2">
          {(['I', 'II', 'III', 'IV', 'V'] as AsaClass[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update('asa', c)}
              aria-pressed={form.asa === c}
              className={cn(
                'rounded-md border py-2 text-sm font-medium',
                form.asa === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">Red flags</h2>
        <p className="text-xs text-muted-foreground">
          เช็คถ้ามีจริง — ถ้าติดข้อใดข้อหนึ่ง ให้พิจารณา postpone / optimize
        </p>
        <div className="space-y-2 text-sm">
          {(Object.keys(RED_FLAG_LABELS) as RedFlagKey[]).map((k) => (
            <Checkbox
              key={k}
              checked={form.redFlags[k]}
              onChange={() => toggleFlag(k)}
              label={RED_FLAG_LABELS[k].label}
            />
          ))}
        </div>
      </section>

      {/* OUTPUT */}
      <section
        className={cn(
          'rounded-lg border p-4',
          band.color.replace('text-', 'text-') /* keep same */,
          band.color,
        )}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums">{score}</span>
          <span className="text-sm">points</span>
        </div>
        <p className="text-sm font-medium">
          {band.category} risk — {band.pct}% 30-day major cardiac event
        </p>
        <p className="text-xs opacity-80">({band.categoryTh})</p>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">Recommendations</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {recs.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {labs.length > 0 && (
        <section className="space-y-3 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Lab checklist</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {labs.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      )}

      {activeFlags.length > 0 && (
        <section className="space-y-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
          <h2 className="text-sm font-semibold">⚠️ Red flags ที่ตรวจพบ</h2>
          <ul className="list-disc space-y-1 pl-5">
            {activeFlags.map((k) => (
              <li key={k}>
                <strong>{RED_FLAG_LABELS[k].label}</strong> →{' '}
                {RED_FLAG_LABELS[k].action}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Copy-ready summary</h2>
          <Button size="sm" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" aria-hidden />
            คัดลอก
          </Button>
        </div>
        <textarea
          readOnly
          value={summary}
          className="h-48 w-full resize-none rounded-md border bg-muted/40 p-3 font-mono text-xs"
        />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleReset}>
            Reset form
          </Button>
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold"
          aria-expanded={showHistory}
        >
          <span className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" aria-hidden />
            ประวัติการคำนวณ ({history.length})
          </span>
          <span className="text-xs text-muted-foreground">
            {showHistory ? 'ซ่อน' : 'แสดง'}
          </span>
        </button>
        {showHistory && (
          <div className="space-y-3 border-t p-4">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                ยังไม่มีประวัติ — กด &ldquo;คัดลอก&rdquo; จะบันทึกอัตโนมัติ
              </p>
            ) : (
              <>
                <ul className="space-y-2">
                  {history.map((entry) => (
                    <li
                      key={entry.ts}
                      className="rounded-md border p-3 text-xs"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">
                          {formatTs(entry.ts)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoad(entry)}
                        >
                          โหลดอีกครั้ง
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-[11px] text-muted-foreground">
                        {entry.summary.split('\n').slice(0, 3).join('\n')}
                        {entry.summary.split('\n').length > 3 ? '\n…' : ''}
                      </pre>
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearHistory}
                  className="text-muted-foreground"
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                  ล้างประวัติ
                </Button>
              </>
            )}
          </div>
        )}
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

function Checkbox({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange?: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-0.5 h-4 w-4"
      />
      <span>{label}</span>
    </label>
  );
}
