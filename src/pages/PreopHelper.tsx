import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Copy, History as HistoryIcon, Loader2, Trash2 } from 'lucide-react';
import { aiClassifyProcedure, aiMapComorbidities, type ComorbidSuggestion, type ProcedureSuggestion } from '@/lib/preopAi';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Sex = 'M' | 'F';
type SurgeryRisk = 'low' | 'intermediate' | 'high';
type AsaClass = 'I' | 'II' | 'III' | 'IV' | 'V' | 'unknown';
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
  procedureName: string;
  surgery: SurgeryRisk;
  asa: AsaClass;
  ihd: boolean;
  hf: boolean;
  cvd: boolean;
  insulinDm: boolean;
  crHigh: boolean;
  redFlags: Record<RedFlagKey, boolean>;
  comorbidInput: string;
  otherComorbids: string[];
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
  procedureName: '',
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
  comorbidInput: '',
  otherComorbids: [],
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

const ASA_INFO: Record<Exclude<AsaClass, 'unknown'>, { desc: string; examples: string }> = {
  I:   { desc: 'แข็งแรงดี ไม่มีโรค',                    examples: 'สุขภาพดี ไม่สูบบุหรี่ ไม่อ้วน' },
  II:  { desc: 'มีโรคเรื้อรัง คุมได้ดี limit น้อย',      examples: 'HT/DM คุมดี, สูบบุหรี่, อ้วน (BMI 30–40), ตั้งครรภ์' },
  III: { desc: 'มีโรคเรื้อรัง limit function ชัดเจน',    examples: 'DM/HT ควบคุมไม่ดี, CKD, COPD, EF <40%, BMI >40, post-MI >3 เดือน' },
  IV:  { desc: 'โรครุนแรง ภัยต่อชีวิตตลอดเวลา',          examples: 'MI/stroke <3 เดือน, decompHF, sepsis, DKA, ARF ต้อง dialysis' },
  V:   { desc: 'ใกล้ตาย — ไม่ผ่าตัดก็ไม่รอด 24 ชม.',    examples: 'Ruptured AAA, massive trauma, fulminant liver failure' },
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
  lines.push(`Patient: ${f.age || '?'}/${f.sex}, BW ${f.weight || '?'} kg`);
  if (f.procedureName) lines.push(`Procedure: ${f.procedureName}`);
  const asaLabel = f.asa === 'unknown' ? 'ไม่ทราบ' : f.asa;
  lines.push(
    `ASA: ${asaLabel}, RCRI: ${score} points (${band.category}, ${band.pct}% 30-day MACE)`,
  );
  lines.push(`Surgery risk: ${f.surgery[0].toUpperCase() + f.surgery.slice(1)}`);
  if (f.otherComorbids.length > 0) {
    lines.push(`Other comorbidities: ${f.otherComorbids.join(', ')}`);
  }
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
  const [surgeryAi, setSurgeryAi] = useState<{
    loading: boolean; error: string | null; suggest: ProcedureSuggestion | null;
  }>({ loading: false, error: null, suggest: null });
  const [comorbidAi, setComorbidAi] = useState<{
    loading: boolean; error: string | null; suggest: ComorbidSuggestion | null;
  }>({ loading: false, error: null, suggest: null });

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Auto-check "high-risk surgery" column internally; surgery=high drives
  // RCRI directly via rcriScore(). No separate checkbox needed since the
  // "surgery risk" select is the single source of truth for that criterion.

  async function handleClassifyProcedure() {
    if (!form.procedureName.trim()) return;
    setSurgeryAi({ loading: true, error: null, suggest: null });
    try {
      const result = await aiClassifyProcedure(form.procedureName);
      setSurgeryAi({ loading: false, error: null, suggest: result });
    } catch (e) {
      setSurgeryAi({ loading: false, error: e instanceof Error ? e.message : 'เกิดข้อผิดพลาด', suggest: null });
    }
  }

  function confirmSurgeryLevel() {
    if (!surgeryAi.suggest) return;
    update('surgery', surgeryAi.suggest.level);
    setSurgeryAi((s) => ({ ...s, suggest: null }));
  }

  async function handleMapComorbid() {
    if (!form.comorbidInput.trim()) return;
    setComorbidAi({ loading: true, error: null, suggest: null });
    try {
      const result = await aiMapComorbidities(form.comorbidInput);
      setComorbidAi({ loading: false, error: null, suggest: result });
    } catch (e) {
      setComorbidAi({
        loading: false,
        error: e instanceof Error ? e.message : 'เกิดข้อผิดพลาด',
        suggest: null,
      });
    }
  }

  function confirmComorbidMap() {
    if (!comorbidAi.suggest) return;
    const { rcri, other } = comorbidAi.suggest;
    setForm((f) => {
      const next = { ...f, otherComorbids: other };
      rcri.forEach(({ key }) => {
        if (key === 'ihd') next.ihd = true;
        else if (key === 'hf') next.hf = true;
        else if (key === 'cvd') next.cvd = true;
        else if (key === 'insulinDm') next.insulinDm = true;
        else if (key === 'crHigh') next.crHigh = true;
      });
      return next;
    });
    setComorbidAi((s) => ({ ...s, suggest: null }));
  }

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
        <div className="flex gap-2">
          <input
            type="text"
            value={form.procedureName}
            onChange={(e) => {
              update('procedureName', e.target.value);
              setSurgeryAi({ loading: false, error: null, suggest: null });
            }}
            placeholder="ชื่อหัตถการ เช่น 'ผ่าตัดเปลี่ยนข้อสะโพก' หรือ 'appendectomy'"
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleClassifyProcedure}
            disabled={!form.procedureName.trim() || surgeryAi.loading}
          >
            {surgeryAi.loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : '🤖 AI จัดระดับ'}
          </Button>
        </div>

        {surgeryAi.loading && (
          <div className="flex items-center gap-2 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> AI กำลังวิเคราะห์…
          </div>
        )}
        {surgeryAi.error && (
          <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
            {surgeryAi.error} —{' '}
            <button type="button" className="underline"
              onClick={() => setSurgeryAi({ loading: false, error: null, suggest: null })}>
              ล้าง
            </button>
          </div>
        )}
        {surgeryAi.suggest && (
          <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              🤖 AI แนะนำ:{' '}
              <span className="capitalize">{surgeryAi.suggest.level}</span> risk
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {surgeryAi.suggest.reason}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={confirmSurgeryLevel}>
                <CheckCircle className="mr-1 h-3 w-3" /> ยืนยัน — Apply
              </Button>
              <Button size="sm" variant="ghost"
                onClick={() => setSurgeryAi({ loading: false, error: null, suggest: null })}>
                ยกเลิก
              </Button>
            </div>
          </div>
        )}

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
            {score} / 6 คะแนน
          </span>
        </div>
        <InfoCallout title="RCRI คืออะไร? + MACE endpoint">
          <p className="mb-1 font-medium">Revised Cardiac Risk Index (Lee 1999)</p>
          <p className="mb-2">ประเมินโอกาสเกิด <strong>30-day MACE</strong> (Major Adverse Cardiac Events) หลัง non-cardiac surgery</p>
          <p className="mb-1 font-medium">MACE ในที่นี้ = 5 events:</p>
          <ul className="mb-2 list-disc space-y-0.5 pl-4">
            <li>MI — กล้ามเนื้อหัวใจตาย</li>
            <li>Pulmonary edema — น้ำท่วมปอดจากหัวใจ</li>
            <li>VF/VT arrest — หัวใจห้องล่างเต้นผิดจังหวะจนหยุด</li>
            <li>Complete heart block — AV block ขั้น 3</li>
            <li>Cardiac death</li>
          </ul>
          <p className="mb-0.5 text-[11px] italic opacity-70">
            หมายเหตุ: MACE ที่ใช้ใน cardiology trial ทั่วไป (3-point MACE) = CV death + MI + stroke ซึ่งต่างจาก RCRI
          </p>
          <div className="mt-2 rounded bg-blue-100 p-2 dark:bg-blue-900/30 text-[11px]">
            <table className="w-full">
              <thead><tr className="font-medium"><td>Score</td><td>ระดับ</td><td>30-day MACE</td></tr></thead>
              <tbody>
                <tr><td>0</td><td>Very Low</td><td>0.4%</td></tr>
                <tr><td>1</td><td>Low</td><td>0.9%</td></tr>
                <tr><td>2</td><td>Intermediate</td><td>6.6%</td></tr>
                <tr><td>≥3</td><td>High</td><td>&gt;11%</td></tr>
              </tbody>
            </table>
          </div>
        </InfoCallout>
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

        <div className="space-y-2 pt-2">
          <p className="text-xs font-medium text-muted-foreground">
            โรคประจำตัวอื่น ๆ (ไทย/Eng) — AI จะจับคู่ RCRI + แสดงโรคอื่น
          </p>
          <div className="flex gap-2">
            <textarea
              value={form.comorbidInput}
              onChange={(e) => {
                update('comorbidInput', e.target.value);
                setComorbidAi({ loading: false, error: null, suggest: null });
              }}
              placeholder="เช่น AF on warfarin, COPD, CKD stage 3, DM ไม่ใช้ insulin, ตับแข็ง"
              rows={2}
              className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              className="self-end"
              onClick={handleMapComorbid}
              disabled={!form.comorbidInput.trim() || comorbidAi.loading}
            >
              {comorbidAi.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '🤖 AI แปลง'}
            </Button>
          </div>

          {comorbidAi.loading && (
            <div className="flex items-center gap-2 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> AI กำลังวิเคราะห์…
            </div>
          )}
          {comorbidAi.error && (
            <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
              {comorbidAi.error} —{' '}
              <button
                type="button"
                className="underline"
                onClick={() => setComorbidAi({ loading: false, error: null, suggest: null })}
              >
                ล้าง
              </button>
            </div>
          )}
          {comorbidAi.suggest && (
            <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                🤖 AI แนะนำ — กดยืนยันเพื่อ apply
              </p>
              {comorbidAi.suggest.rcri.length > 0 && (
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-300">จับคู่ RCRI:</p>
                  {comorbidAi.suggest.rcri.map((m) => (
                    <p key={m.key} className="ml-2 text-amber-700 dark:text-amber-300">
                      ✓ <strong>{m.key}</strong> — {m.reason}
                    </p>
                  ))}
                </div>
              )}
              {comorbidAi.suggest.other.length > 0 && (
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-300">โรคอื่น ๆ:</p>
                  {comorbidAi.suggest.other.map((o) => (
                    <p key={o} className="ml-2 text-amber-700 dark:text-amber-300">• {o}</p>
                  ))}
                </div>
              )}
              {comorbidAi.suggest.rcri.length === 0 && comorbidAi.suggest.other.length === 0 && (
                <p className="text-amber-700 dark:text-amber-300">ไม่พบโรคที่จับคู่ได้</p>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={confirmComorbidMap}>
                  <CheckCircle className="mr-1 h-3 w-3" /> ยืนยัน — Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setComorbidAi({ loading: false, error: null, suggest: null })}
                >
                  ยกเลิก
                </Button>
              </div>
            </div>
          )}

          {form.otherComorbids.length > 0 && (
            <div className="rounded-md bg-muted/40 px-3 py-2 text-xs">
              <span className="font-medium">โรคอื่น ๆ (confirmed): </span>
              {form.otherComorbids.join(', ')}
              <button
                type="button"
                className="ml-2 text-destructive underline"
                onClick={() => update('otherComorbids', [])}
              >
                ลบ
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">ASA Physical Status</h2>
        <InfoCallout title="ASA Class คืออะไร?">
          <p className="mb-2">American Society of Anesthesiologists — ประเมินความพร้อมก่อน anesthesia (ไม่เข้าสูตร RCRI แต่ใส่ใน summary)</p>
          <div className="space-y-1.5">
            {(Object.keys(ASA_INFO) as Exclude<AsaClass, 'unknown'>[]).map((k) => (
              <div key={k} className="flex gap-2">
                <span className="w-5 shrink-0 font-bold">{k}</span>
                <span>
                  {ASA_INFO[k].desc}
                  <span className="text-blue-700/70 dark:text-blue-300/70"> — {ASA_INFO[k].examples}</span>
                </span>
              </div>
            ))}
          </div>
        </InfoCallout>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {(['I', 'II', 'III', 'IV', 'V', 'unknown'] as AsaClass[]).map((c) => (
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
              {c === 'unknown' ? '? ไม่ทราบ' : c}
            </button>
          ))}
        </div>
        {form.asa !== 'unknown' && (
          <p className="text-xs text-muted-foreground">
            <strong>ASA {form.asa}</strong> — {ASA_INFO[form.asa].desc}
            <span className="ml-1 opacity-70">({ASA_INFO[form.asa].examples})</span>
          </p>
        )}
        <p className="text-[11px] text-muted-foreground">
          ถ้าไม่ทราบ กด "? ไม่ทราบ" — ข้ามได้ ไม่กระทบคะแนน RCRI
        </p>
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

function InfoCallout({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium text-blue-700 dark:text-blue-300"
      >
        <span>ℹ️ {title}</span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="border-t border-blue-200 px-3 pb-3 pt-2 text-xs text-blue-900 dark:border-blue-900 dark:text-blue-100">
          {children}
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
