import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DrugId =
  | 'epi-arrest'
  | 'epi-anaphylaxis-im'
  | 'epi-drip'
  | 'amiodarone-bolus'
  | 'amiodarone-drip'
  | 'mag-torsades'
  | 'mag-preeclampsia'
  | 'insulin-dka-drip'
  | 'heparin-bolus'
  | 'heparin-drip'
  | 'propofol-induction'
  | 'propofol-maintenance'
  | 'ketamine-induction'
  | 'ketamine-analgesic'
  | 'etomidate'
  | 'succinylcholine'
  | 'rocuronium';

type DrugCalc = {
  id: DrugId;
  title: string;
  titleTh: string;
  category: 'cardiac' | 'shock' | 'sedation' | 'paralytic' | 'misc';
  doseMgPerKg?: number;
  doseFixed?: string;
  concentration?: string;
  maxDose?: string;
  pitfalls: string[];
  compute: (weightKg: number) => { dose: string; volume: string; rate?: string; note?: string };
};

const DRUGS: DrugCalc[] = [
  {
    id: 'epi-arrest',
    title: 'Epinephrine — cardiac arrest (IV)',
    titleTh: 'Epi 1:10,000 สำหรับ cardiac arrest',
    category: 'cardiac',
    doseFixed: '1 mg IV push q 3–5 min',
    concentration: '1 mg in 10 mL (1:10,000) = 0.1 mg/mL',
    pitfalls: ['ห้ามใช้ 1:1,000 (0.1%) IV push', 'Flush line with 20 mL NSS after'],
    compute: () => ({
      dose: '1 mg IV',
      volume: '10 mL of 1:10,000 (0.1 mg/mL)',
      note: 'Repeat q 3–5 min during arrest. Flush 20 mL after.',
    }),
  },
  {
    id: 'epi-anaphylaxis-im',
    title: 'Epinephrine — anaphylaxis (IM)',
    titleTh: 'Epi IM สำหรับ anaphylaxis',
    category: 'shock',
    doseFixed: '0.3–0.5 mg IM (adult)',
    concentration: '1 mg/mL (1:1,000)',
    pitfalls: [
      'IM ต้นขาด้านข้าง (vastus lateralis) — ไม่ใช่ deltoid',
      'ซ้ำทุก 5–15 นาทีถ้าอาการไม่ดีขึ้น',
    ],
    compute: (w) => {
      const dose = w < 30 ? 0.01 * w : 0.3;
      return {
        dose: `${dose.toFixed(2)} mg IM`,
        volume: `${dose.toFixed(2)} mL of 1:1,000`,
        note: 'Adult: 0.3–0.5 mg. Peds: 0.01 mg/kg (max 0.3 mg).',
      };
    },
  },
  {
    id: 'epi-drip',
    title: 'Epinephrine drip (shock)',
    titleTh: 'Epi drip สำหรับ refractory shock',
    category: 'shock',
    concentration: '1 mg in 250 mL NS = 4 mcg/mL',
    pitfalls: ['Central line preferred', 'ติด A-line', 'ระวัง tachyarrhythmia, ischemia'],
    compute: (w) => {
      const startMcg = 0.05 * w;
      const maxMcg = 1.0 * w;
      const mlHrStart = (startMcg * 60) / 4;
      const mlHrMax = (maxMcg * 60) / 4;
      return {
        dose: `${startMcg.toFixed(1)}–${maxMcg.toFixed(0)} mcg/min (0.05–1 mcg/kg/min)`,
        volume: '1 mg in 250 mL NS (4 mcg/mL)',
        rate: `${mlHrStart.toFixed(1)}–${mlHrMax.toFixed(1)} mL/hr`,
      };
    },
  },
  {
    id: 'amiodarone-bolus',
    title: 'Amiodarone — VT/VF arrest',
    titleTh: 'Amiodarone bolus ใน arrest',
    category: 'cardiac',
    doseFixed: '300 mg IV (first), 150 mg (second)',
    concentration: '150 mg/3 mL vial',
    pitfalls: [
      'ใน arrest: 300 mg IV push (ไม่ต้อง dilute เร่งด่วน)',
      'Non-arrest: dilute in D5W 20 mL, IV over 10 min',
    ],
    compute: () => ({
      dose: 'First: 300 mg IV. Second: 150 mg IV if needed.',
      volume: '6 mL (300 mg) → 3 mL (150 mg) of 50 mg/mL',
      note: 'In arrest: push; otherwise dilute + slow infusion.',
    }),
  },
  {
    id: 'amiodarone-drip',
    title: 'Amiodarone drip (post-ROSC / stable VT)',
    titleTh: 'Amiodarone drip',
    category: 'cardiac',
    concentration: '450 mg in 250 mL D5W = 1.8 mg/mL (or 900 mg in 500 mL)',
    pitfalls: [
      'D5W only (saline incompatible)',
      'Central line preferred > 24 hr',
      'Hypotension on bolus — slow or pause',
    ],
    compute: () => ({
      dose: '1 mg/min × 6 hr, then 0.5 mg/min × 18 hr (total 24 hr)',
      volume: '450 mg in 250 mL D5W',
      rate: 'First 6 hr: 33 mL/hr; next 18 hr: 17 mL/hr',
      note: 'Total 1.05 g over 24 hr',
    }),
  },
  {
    id: 'mag-torsades',
    title: 'Magnesium sulfate — torsades',
    titleTh: 'MgSO₄ สำหรับ torsades',
    category: 'cardiac',
    doseFixed: '2 g IV bolus',
    concentration: '50% MgSO₄ = 500 mg/mL',
    pitfalls: ['IV push over 1 min in torsades', 'Repeat 2 g if needed', 'ไม่ต้องรอตรวจ Mg level ก่อน'],
    compute: () => ({
      dose: '2 g IV',
      volume: '4 mL of 50% MgSO₄ (or 2 g in 100 mL NS over 15 min if non-arrest)',
      note: 'Push over 1 min in torsades; slower in stable',
    }),
  },
  {
    id: 'mag-preeclampsia',
    title: 'Magnesium — pre-eclampsia / eclampsia',
    titleTh: 'MgSO₄ loading + maintenance ใน pre-eclampsia',
    category: 'cardiac',
    doseFixed: 'Load 4–6 g → drip 1–2 g/hr',
    concentration: '50% MgSO₄ = 500 mg/mL',
    pitfalls: [
      'Monitor DTR, resp rate, UOP',
      'Ca gluconate 1 g IV ready (antidote)',
      'Renal adjustment: halve drip if oliguria',
    ],
    compute: () => ({
      dose: 'Load: 4–6 g IV over 20 min → Maintenance: 1–2 g/hr IV × 24 hr post-delivery',
      volume: 'Load: 8–12 mL of 50% MgSO₄ + NS 100 mL',
      rate: 'Maintenance (20 g in 500 mL = 40 mg/mL): 25–50 mL/hr',
      note: 'Antidote: Ca gluconate 1 g IV',
    }),
  },
  {
    id: 'insulin-dka-drip',
    title: 'Insulin drip (DKA)',
    titleTh: 'Insulin drip ใน DKA',
    category: 'misc',
    concentration: '100 U in 100 mL NS = 1 U/mL',
    pitfalls: [
      'Start only when K > 3.3',
      'Skip bolus (recent evidence)',
      'Target BG drop 50–75 mg/dL/hr',
      'Add D5W when BG ≤ 200 to continue insulin until AG closes',
    ],
    compute: (w) => {
      const rate = 0.1 * w;
      return {
        dose: `${rate.toFixed(1)} U/hr (0.1 U/kg/hr)`,
        volume: '100 U in 100 mL NS (1 U/mL)',
        rate: `${rate.toFixed(1)} mL/hr`,
        note: 'No bolus needed. Check K before start.',
      };
    },
  },
  {
    id: 'heparin-bolus',
    title: 'Heparin bolus (ACS / PE / DVT)',
    titleTh: 'Heparin loading dose',
    category: 'misc',
    doseFixed: '60–80 U/kg IV bolus',
    concentration: '1,000 U/mL or 5,000 U/mL vial',
    pitfalls: [
      'STEMI: 60 U/kg (max 4,000)',
      'PE/DVT: 80 U/kg',
      'Obese: use actual weight up to ~ 150 kg',
    ],
    compute: (w) => {
      const stemi = Math.min(60 * w, 4000);
      const pe = Math.min(80 * w, 10000);
      return {
        dose: `STEMI: ${stemi.toFixed(0)} U | PE/DVT: ${pe.toFixed(0)} U`,
        volume: `STEMI: ${(stemi / 1000).toFixed(2)} mL | PE/DVT: ${(pe / 1000).toFixed(2)} mL of 1,000 U/mL`,
        note: 'Max STEMI 4,000 U; Max PE/DVT 10,000 U',
      };
    },
  },
  {
    id: 'heparin-drip',
    title: 'Heparin drip (PE/DVT nomogram)',
    titleTh: 'Heparin drip after loading',
    category: 'misc',
    concentration: '25,000 U in 500 mL NS = 50 U/mL',
    pitfalls: [
      'aPTT q 6 hr until therapeutic',
      'Target aPTT 1.5–2.5× control (lab-specific)',
      'Check CBC q day (HIT monitoring)',
    ],
    compute: (w) => {
      const rate = 18 * w;
      const mlhr = rate / 50;
      return {
        dose: `${rate.toFixed(0)} U/hr (18 U/kg/hr for PE/DVT)`,
        volume: '25,000 U in 500 mL NS (50 U/mL)',
        rate: `${mlhr.toFixed(1)} mL/hr`,
        note: 'STEMI: 12 U/kg/hr. Adjust per aPTT.',
      };
    },
  },
  {
    id: 'propofol-induction',
    title: 'Propofol — RSI induction',
    titleTh: 'Propofol สำหรับ RSI',
    category: 'sedation',
    doseMgPerKg: 1.5,
    concentration: '10 mg/mL (1%)',
    pitfalls: [
      'Reduce 50% in hemodynamically unstable / elderly',
      'Egg/soy allergy — avoid',
    ],
    compute: (w) => {
      const dose = 1.5 * w;
      const low = 0.5 * w;
      return {
        dose: `${dose.toFixed(0)} mg (1.5 mg/kg standard; ${low.toFixed(0)} mg if unstable)`,
        volume: `${(dose / 10).toFixed(1)} mL of 10 mg/mL`,
        note: 'Onset 30 sec, duration 5–10 min',
      };
    },
  },
  {
    id: 'propofol-maintenance',
    title: 'Propofol drip — ICU sedation',
    titleTh: 'Propofol drip',
    category: 'sedation',
    concentration: '10 mg/mL (1%)',
    pitfalls: [
      'PRIS risk if > 67 mcg/kg/min for > 48 hr',
      'Monitor TG, lactate, CK if prolonged',
    ],
    compute: (w) => {
      const startMcg = 25 * w;
      const maxMcg = 75 * w;
      const startMlhr = (startMcg * 60) / 1000 / 10;
      const maxMlhr = (maxMcg * 60) / 1000 / 10;
      return {
        dose: `${startMcg.toFixed(0)}–${maxMcg.toFixed(0)} mcg/min (25–75 mcg/kg/min)`,
        volume: '10 mg/mL',
        rate: `${startMlhr.toFixed(1)}–${maxMlhr.toFixed(1)} mL/hr`,
      };
    },
  },
  {
    id: 'ketamine-induction',
    title: 'Ketamine — RSI induction',
    titleTh: 'Ketamine สำหรับ RSI',
    category: 'sedation',
    doseMgPerKg: 1.5,
    concentration: '50 mg/mL (or 100 mg/mL)',
    pitfalls: [
      'Maintains BP — good in unstable/septic',
      'Bronchodilation — good in asthma',
      'Hypertensive / ↑ICP relative contraindication (modern view: acceptable)',
    ],
    compute: (w) => {
      const dose = 1.5 * w;
      return {
        dose: `${dose.toFixed(0)} mg (1–2 mg/kg)`,
        volume: `${(dose / 50).toFixed(1)} mL of 50 mg/mL`,
        note: 'Onset 30 sec, duration 10–20 min',
      };
    },
  },
  {
    id: 'ketamine-analgesic',
    title: 'Ketamine — subdissociative analgesia',
    titleTh: 'Ketamine ขนาดบรรเทาปวด',
    category: 'sedation',
    doseMgPerKg: 0.3,
    concentration: '50 mg/mL diluted to 1 mg/mL',
    pitfalls: [
      'Slow push over 10 min (avoid dissociation)',
      'Or drip 0.1–0.3 mg/kg/hr',
    ],
    compute: (w) => {
      const dose = 0.3 * w;
      return {
        dose: `${dose.toFixed(0)} mg IV slow over 10 min (0.1–0.3 mg/kg)`,
        volume: `Dilute in 100 mL NS, infuse over 10 min`,
        note: 'Good for opioid-sparing or multimodal',
      };
    },
  },
  {
    id: 'etomidate',
    title: 'Etomidate — RSI induction',
    titleTh: 'Etomidate สำหรับ RSI',
    category: 'sedation',
    doseMgPerKg: 0.3,
    concentration: '2 mg/mL',
    pitfalls: [
      'Hemodynamically stable (good in shock/trauma)',
      'Adrenal suppression (avoid in sepsis — controversial)',
      'Myoclonus common',
    ],
    compute: (w) => {
      const dose = 0.3 * w;
      return {
        dose: `${dose.toFixed(0)} mg (0.3 mg/kg)`,
        volume: `${(dose / 2).toFixed(1)} mL of 2 mg/mL`,
        note: 'Onset 30 sec, duration 5–10 min',
      };
    },
  },
  {
    id: 'succinylcholine',
    title: 'Succinylcholine — RSI paralytic',
    titleTh: 'Succinylcholine (SCh) สำหรับ RSI',
    category: 'paralytic',
    doseMgPerKg: 1.5,
    concentration: '20 mg/mL',
    pitfalls: [
      'AVOID if: hyperkalemia, burn > 5 d, crush injury, denervation, rhabdo, MH hx',
      'Fasciculations → mild K rise (~ 0.5 mEq)',
      'Short duration (5–10 min) — needs long-acting NMB if prolonged intubation',
    ],
    compute: (w) => {
      const dose = 1.5 * w;
      return {
        dose: `${dose.toFixed(0)} mg (1.5 mg/kg; peds 2 mg/kg)`,
        volume: `${(dose / 20).toFixed(1)} mL of 20 mg/mL`,
        note: 'Onset 45–60 sec, duration 5–10 min',
      };
    },
  },
  {
    id: 'rocuronium',
    title: 'Rocuronium — RSI paralytic',
    titleTh: 'Rocuronium สำหรับ RSI',
    category: 'paralytic',
    doseMgPerKg: 1.2,
    concentration: '10 mg/mL',
    pitfalls: [
      'Long duration (45–60 min) — vs SCh 5–10 min',
      'Reversal: Sugammadex 16 mg/kg for immediate',
      'Preferred over SCh if contraindication',
    ],
    compute: (w) => {
      const dose = 1.2 * w;
      return {
        dose: `${dose.toFixed(0)} mg (1.2 mg/kg for RSI)`,
        volume: `${(dose / 10).toFixed(1)} mL of 10 mg/mL`,
        note: 'Onset 60–90 sec, duration 45–60 min',
      };
    },
  },
];

const CATEGORY_LABELS: Record<DrugCalc['category'], string> = {
  cardiac: 'Cardiac',
  shock: 'Shock / vasopressor',
  sedation: 'Sedation / analgesic',
  paralytic: 'Paralytic',
  misc: 'Other',
};

export default function DoseCalculator() {
  const [weightStr, setWeightStr] = useState('');
  const [selectedId, setSelectedId] = useState<DrugId>('epi-arrest');
  const [toast, setToast] = useState<string | null>(null);

  const weight = Number(weightStr) || 0;
  const selected = DRUGS.find((d) => d.id === selectedId)!;

  const result = useMemo(() => {
    if (weight <= 0) return null;
    return selected.compute(weight);
  }, [selected, weight]);

  async function handleCopy() {
    if (!result) return;
    const text = [
      selected.title,
      `Weight: ${weight} kg`,
      `Dose: ${result.dose}`,
      `Concentration: ${selected.concentration ?? '—'}`,
      `Volume: ${result.volume}`,
      result.rate ? `Rate: ${result.rate}` : '',
      result.note ? `Note: ${result.note}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setToast('คัดลอกแล้ว');
    } catch {
      setToast('คัดลอกไม่สำเร็จ');
    }
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <div className="space-y-4 pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Drug Dose Calculator</h1>
        <p className="text-sm text-muted-foreground">
          คำนวณ dose + volume + rate ตามน้ำหนัก — ตรวจทานทุกครั้งก่อนให้จริง
        </p>
      </header>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <label className="space-y-1 block">
          <span className="text-xs text-muted-foreground">น้ำหนัก (kg)</span>
          <input
            type="number"
            inputMode="numeric"
            value={weightStr}
            onChange={(e) => setWeightStr(e.target.value)}
            placeholder="70"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1 block">
          <span className="text-xs text-muted-foreground">เลือกยา</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value as DrugId)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {(Object.keys(CATEGORY_LABELS) as DrugCalc['category'][]).map((cat) => (
              <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
                {DRUGS.filter((d) => d.category === cat).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <div>
          <h2 className="text-base font-semibold">{selected.title}</h2>
          <p className="text-xs text-muted-foreground">{selected.titleTh}</p>
        </div>

        {weight <= 0 ? (
          <p className="text-sm text-muted-foreground">ใส่น้ำหนักเพื่อคำนวณ</p>
        ) : result ? (
          <div className="space-y-2">
            <div className="rounded-md bg-emerald-50 p-3 dark:bg-emerald-950/40">
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Dose</p>
              <p className="text-xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                {result.dose}
              </p>
            </div>
            {selected.concentration && (
              <div className="rounded-md bg-muted/40 p-3 text-sm">
                <span className="font-medium">Concentration: </span>
                {selected.concentration}
              </div>
            )}
            <div className="rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-950/40">
              <p className="text-xs text-blue-700 dark:text-blue-300">Volume / mL</p>
              <p className="font-semibold tabular-nums text-blue-900 dark:text-blue-100">
                {result.volume}
              </p>
            </div>
            {result.rate && (
              <div className="rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
                <p className="text-xs text-amber-700 dark:text-amber-300">Infusion rate</p>
                <p className="font-semibold tabular-nums text-amber-900 dark:text-amber-100">
                  {result.rate}
                </p>
              </div>
            )}
            {result.note && (
              <p className="rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
                ℹ️ {result.note}
              </p>
            )}
            <Button size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" aria-hidden />
              คัดลอก
            </Button>
          </div>
        ) : null}

        {selected.pitfalls.length > 0 && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950">
            <p className="mb-1 font-medium text-amber-800 dark:text-amber-200">
              ⚠️ Pitfalls
            </p>
            <ul className={cn('list-disc space-y-0.5 pl-4 text-amber-900 dark:text-amber-200')}>
              {selected.pitfalls.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <p className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
        ⚠️ เครื่องมือช่วยคำนวณเท่านั้น — ตรวจสอบ dose + ยืนยันกับแหล่งอ้างอิงทุกครั้ง
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
