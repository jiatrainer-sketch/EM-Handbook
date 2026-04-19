import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ItemKey =
  | 'loc'
  | 'locQuestions'
  | 'locCommands'
  | 'gaze'
  | 'visual'
  | 'facial'
  | 'motorArmL'
  | 'motorArmR'
  | 'motorLegL'
  | 'motorLegR'
  | 'ataxia'
  | 'sensory'
  | 'language'
  | 'dysarthria'
  | 'extinction';

type ItemDef = {
  key: ItemKey;
  title: string;
  titleTh: string;
  options: { value: number; label: string }[];
};

const ITEMS: ItemDef[] = [
  {
    key: 'loc',
    title: '1a. Level of consciousness',
    titleTh: 'ระดับความรู้สึกตัว',
    options: [
      { value: 0, label: '0 — Alert, responsive' },
      { value: 1, label: '1 — Not alert, arousable by minor stimulation' },
      { value: 2, label: '2 — Not alert, requires repeated/painful stimulation' },
      { value: 3, label: '3 — Unresponsive / only reflex movements' },
    ],
  },
  {
    key: 'locQuestions',
    title: '1b. LOC questions (month + age)',
    titleTh: 'ถามเดือนปัจจุบัน + อายุ',
    options: [
      { value: 0, label: '0 — Both correct' },
      { value: 1, label: '1 — Answers one correctly' },
      { value: 2, label: '2 — Neither correct (or aphasia, intubated)' },
    ],
  },
  {
    key: 'locCommands',
    title: '1c. LOC commands (open/close eye, grip hand)',
    titleTh: 'ทำตามคำสั่ง',
    options: [
      { value: 0, label: '0 — Performs both tasks correctly' },
      { value: 1, label: '1 — Performs one task correctly' },
      { value: 2, label: '2 — Performs neither task' },
    ],
  },
  {
    key: 'gaze',
    title: '2. Best gaze',
    titleTh: 'การมองตาม',
    options: [
      { value: 0, label: '0 — Normal' },
      { value: 1, label: '1 — Partial gaze palsy' },
      { value: 2, label: '2 — Forced deviation or total gaze paresis' },
    ],
  },
  {
    key: 'visual',
    title: '3. Visual fields',
    titleTh: 'ลานสายตา',
    options: [
      { value: 0, label: '0 — No visual loss' },
      { value: 1, label: '1 — Partial hemianopia' },
      { value: 2, label: '2 — Complete hemianopia' },
      { value: 3, label: '3 — Bilateral hemianopia (blind)' },
    ],
  },
  {
    key: 'facial',
    title: '4. Facial palsy',
    titleTh: 'กล้ามเนื้อใบหน้าอ่อนแรง',
    options: [
      { value: 0, label: '0 — Normal symmetry' },
      { value: 1, label: '1 — Minor (flattened nasolabial)' },
      { value: 2, label: '2 — Partial paralysis (lower face)' },
      { value: 3, label: '3 — Complete paralysis (upper + lower)' },
    ],
  },
  {
    key: 'motorArmL',
    title: '5a. Motor arm — LEFT',
    titleTh: 'แรงแขนข้างซ้าย (ยกแขน 90° × 10 วินาที)',
    options: [
      { value: 0, label: '0 — No drift (holds 90° × 10 sec)' },
      { value: 1, label: '1 — Drift (before 10 sec, no fall)' },
      { value: 2, label: '2 — Some effort against gravity' },
      { value: 3, label: '3 — No effort against gravity (falls)' },
      { value: 4, label: '4 — No movement' },
    ],
  },
  {
    key: 'motorArmR',
    title: '5b. Motor arm — RIGHT',
    titleTh: 'แรงแขนข้างขวา',
    options: [
      { value: 0, label: '0 — No drift' },
      { value: 1, label: '1 — Drift' },
      { value: 2, label: '2 — Some effort against gravity' },
      { value: 3, label: '3 — No effort against gravity' },
      { value: 4, label: '4 — No movement' },
    ],
  },
  {
    key: 'motorLegL',
    title: '6a. Motor leg — LEFT',
    titleTh: 'แรงขาข้างซ้าย (ยกขา 30° × 5 วินาที)',
    options: [
      { value: 0, label: '0 — No drift (holds 30° × 5 sec)' },
      { value: 1, label: '1 — Drift (before 5 sec)' },
      { value: 2, label: '2 — Some effort against gravity' },
      { value: 3, label: '3 — No effort against gravity' },
      { value: 4, label: '4 — No movement' },
    ],
  },
  {
    key: 'motorLegR',
    title: '6b. Motor leg — RIGHT',
    titleTh: 'แรงขาข้างขวา',
    options: [
      { value: 0, label: '0 — No drift' },
      { value: 1, label: '1 — Drift' },
      { value: 2, label: '2 — Some effort against gravity' },
      { value: 3, label: '3 — No effort against gravity' },
      { value: 4, label: '4 — No movement' },
    ],
  },
  {
    key: 'ataxia',
    title: '7. Limb ataxia (finger-nose + heel-shin)',
    titleTh: 'การเคลื่อนไหวไม่ประสานกัน',
    options: [
      { value: 0, label: '0 — Absent' },
      { value: 1, label: '1 — Present in 1 limb' },
      { value: 2, label: '2 — Present in 2 or more limbs' },
    ],
  },
  {
    key: 'sensory',
    title: '8. Sensory (pin prick)',
    titleTh: 'ความรู้สึกสัมผัส',
    options: [
      { value: 0, label: '0 — Normal' },
      { value: 1, label: '1 — Mild-to-moderate sensory loss' },
      { value: 2, label: '2 — Severe-to-total sensory loss' },
    ],
  },
  {
    key: 'language',
    title: '9. Best language',
    titleTh: 'การพูด / เข้าใจภาษา',
    options: [
      { value: 0, label: '0 — No aphasia, normal' },
      { value: 1, label: '1 — Mild-moderate aphasia (loss of fluency, comprehension)' },
      { value: 2, label: '2 — Severe aphasia (fragmentary, listener carries conversation)' },
      { value: 3, label: '3 — Mute, global aphasia; no speech or auditory comprehension' },
    ],
  },
  {
    key: 'dysarthria',
    title: '10. Dysarthria',
    titleTh: 'การออกเสียง',
    options: [
      { value: 0, label: '0 — Normal' },
      { value: 1, label: '1 — Mild-moderate (slurred)' },
      { value: 2, label: '2 — Severe (nearly unintelligible or worse)' },
    ],
  },
  {
    key: 'extinction',
    title: '11. Extinction / inattention (neglect)',
    titleTh: 'การไม่สนใจซีก (neglect)',
    options: [
      { value: 0, label: '0 — No abnormality' },
      { value: 1, label: '1 — Inattention in 1 modality' },
      { value: 2, label: '2 — Profound inattention in > 1 modality' },
    ],
  },
];

type Scores = Record<ItemKey, number>;

const DEFAULT_SCORES: Scores = {
  loc: 0,
  locQuestions: 0,
  locCommands: 0,
  gaze: 0,
  visual: 0,
  facial: 0,
  motorArmL: 0,
  motorArmR: 0,
  motorLegL: 0,
  motorLegR: 0,
  ataxia: 0,
  sensory: 0,
  language: 0,
  dysarthria: 0,
  extinction: 0,
};

function interpretScore(total: number): { category: string; description: string; color: string } {
  if (total === 0)
    return {
      category: 'No stroke symptoms',
      description: 'ไม่มีอาการ stroke',
      color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
    };
  if (total <= 4)
    return {
      category: 'Minor stroke',
      description: 'stroke ระดับเบา',
      color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
    };
  if (total <= 15)
    return {
      category: 'Moderate stroke',
      description: 'stroke ระดับปานกลาง',
      color: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
    };
  if (total <= 20)
    return {
      category: 'Moderate-severe stroke',
      description: 'stroke ระดับปานกลาง-รุนแรง',
      color: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100',
    };
  return {
    category: 'Severe stroke',
    description: 'stroke ระดับรุนแรง',
    color: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100',
  };
}

export default function NIHSSCalculator() {
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [toast, setToast] = useState<string | null>(null);

  const total = useMemo(
    () => Object.values(scores).reduce((sum, v) => sum + v, 0),
    [scores],
  );

  const interp = useMemo(() => interpretScore(total), [total]);

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push('NIHSS (National Institutes of Health Stroke Scale)');
    lines.push(`Total: ${total} / 42 — ${interp.category}`);
    lines.push('');
    lines.push('Breakdown:');
    ITEMS.forEach((item) => {
      lines.push(`  ${item.title}: ${scores[item.key]}`);
    });
    lines.push('');
    lines.push('Interpretation:');
    lines.push(`  ${total} points — ${interp.category} (${interp.description})`);
    lines.push('');
    lines.push('tPA eligibility considerations:');
    lines.push('  - NIHSS ≥ 6 usually warrants consideration (below may still benefit)');
    lines.push('  - Time window: ≤ 4.5 hr from symptom onset (standard)');
    lines.push('  - Select cases up to 9 hr with advanced imaging (DAWN/DEFUSE-3)');
    lines.push('  - Thrombectomy if LVO + appropriate window (up to 24 hr selected)');
    lines.push('  - Consider stroke center transfer for any eligible candidate');
    return lines.join('\n');
  }, [scores, total, interp]);

  const update = (key: ItemKey, value: number) =>
    setScores((s) => ({ ...s, [key]: value }));

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setToast('คัดลอกแล้ว');
    } catch {
      setToast('คัดลอกไม่สำเร็จ');
    }
    setTimeout(() => setToast(null), 1800);
  }

  function handleReset() {
    setScores(DEFAULT_SCORES);
  }

  return (
    <div className="space-y-4 pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">NIHSS Calculator</h1>
        <p className="text-sm text-muted-foreground">
          NIH Stroke Scale — ประเมิน stroke severity + ช่วยตัดสินใจ tPA / thrombectomy
        </p>
      </header>

      <section className={cn('rounded-lg border p-4', interp.color)}>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums">{total}</span>
          <span className="text-sm">/ 42 คะแนน</span>
        </div>
        <p className="text-sm font-medium">{interp.category}</p>
        <p className="text-xs opacity-80">{interp.description}</p>
      </section>

      {ITEMS.map((item) => (
        <section key={item.key} className="space-y-2 rounded-lg border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">{item.title}</h2>
              <p className="text-xs text-muted-foreground">{item.titleTh}</p>
            </div>
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {scores[item.key]} pt
            </span>
          </div>
          <div className="space-y-1">
            {item.options.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex cursor-pointer items-start gap-2 rounded-md border p-2 text-sm',
                  scores[item.key] === opt.value && 'border-primary bg-primary/5',
                )}
              >
                <input
                  type="radio"
                  name={item.key}
                  checked={scores[item.key] === opt.value}
                  onChange={() => update(item.key, opt.value)}
                  className="mt-1"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold">tPA eligibility (reminder)</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>ทำ NIHSS ภายใน ≤ 4.5 ชม. ตั้งแต่เริ่มอาการ</li>
          <li>NIHSS ≥ 6 มักใช้เป็น threshold แต่คะแนนต่ำกว่ายังอาจได้ประโยชน์</li>
          <li>รู้ absolute + relative contraindications ก่อนสั่ง alteplase / tenecteplase</li>
          <li>LVO (M1, ICA, basilar) → พิจารณา thrombectomy (ถึง 24 ชม.ในบางกรณี)</li>
          <li>Transfer ไป stroke center ถ้าเข้าเกณฑ์</li>
        </ul>
      </section>

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
          className="h-60 w-full resize-none rounded-md border bg-muted/40 p-3 font-mono text-xs"
        />
        <Button size="sm" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </section>

      <p className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
        ⚠️ เครื่องมือช่วยคำนวณเท่านั้น — ตรวจสอบการประเมิน + ตัดสินใจร่วมกับ stroke team
      </p>

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
