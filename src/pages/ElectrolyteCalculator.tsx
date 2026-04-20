import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type Tab = 'na' | 'k' | 'ca' | 'mg' | 'phos';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'na', label: 'Na', icon: '🧂' },
  { id: 'k', label: 'K', icon: '🫀' },
  { id: 'ca', label: 'Ca', icon: '🦴' },
  { id: 'mg', label: 'Mg', icon: '💊' },
  { id: 'phos', label: 'Phos', icon: '⚗️' },
];

function toNum(s: string): number | null {
  if (!s.trim()) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function Field({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string;
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
        {unit && <span className="flex items-center rounded-md border bg-muted px-2 text-xs text-muted-foreground whitespace-nowrap">{unit}</span>}
      </div>
    </div>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">{children}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

// ---- Na Tab ----
function NaTab() {
  const [na, setNa] = useState('');
  const [glucose, setGlucose] = useState('');
  const [wt, setWt] = useState('');
  const [targetNa, setTargetNa] = useState('140');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  const result = useMemo(() => {
    const naVal = toNum(na);
    const glucoseVal = toNum(glucose);
    const wtVal = toNum(wt);
    const targetVal = toNum(targetNa) ?? 140;

    const corrected = naVal != null && glucoseVal != null
      ? naVal + 1.6 * ((glucoseVal - 100) / 100)
      : null;

    const tbw = wtVal != null ? wtVal * (sex === 'male' ? 0.6 : 0.5) : null;

    const naSource = corrected ?? naVal;
    const waterDeficit = naSource != null && tbw != null
      ? tbw * ((naSource / targetVal) - 1)
      : null;

    let severity = '';
    let color = '';
    if (naSource != null) {
      if (naSource < 120) { severity = 'Severe hyponatremia — emergent'; color = 'text-red-600 dark:text-red-400'; }
      else if (naSource < 130) { severity = 'Moderate hyponatremia'; color = 'text-orange-500'; }
      else if (naSource < 135) { severity = 'Mild hyponatremia'; color = 'text-yellow-500'; }
      else if (naSource > 155) { severity = 'Severe hypernatremia'; color = 'text-red-600 dark:text-red-400'; }
      else if (naSource > 150) { severity = 'Moderate hypernatremia'; color = 'text-orange-500'; }
      else if (naSource > 145) { severity = 'Mild hypernatremia'; color = 'text-yellow-500'; }
      else { severity = 'Normal'; color = 'text-green-600 dark:text-green-400'; }
    }

    return { corrected, waterDeficit, severity, color };
  }, [na, glucose, wt, targetNa, sex]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Na ที่วัดได้" value={na} onChange={setNa} unit="mEq/L" placeholder="130" />
        <Field label="Glucose (ถ้ามี)" value={glucose} onChange={setGlucose} unit="mg/dL" placeholder="100" />
        <Field label="น้ำหนัก" value={wt} onChange={setWt} unit="kg" placeholder="60" />
        <Field label="Target Na" value={targetNa} onChange={setTargetNa} unit="mEq/L" placeholder="140" />
      </div>
      <div className="flex gap-2">
        {(['male', 'female'] as const).map((s) => (
          <button key={s} onClick={() => setSex(s)}
            className={cn('flex-1 rounded-md border py-2 text-sm', sex === s ? 'border-primary bg-primary/10 font-medium' : 'bg-card hover:bg-accent')}>
            {s === 'male' ? '♂ ชาย' : '♀ หญิง'}
          </button>
        ))}
      </div>
      {(result.corrected != null || result.severity) && (
        <ResultBox>
          {result.corrected != null && <Row label="Corrected Na (for hyperglycemia)" value={`${result.corrected.toFixed(1)} mEq/L`} />}
          {result.waterDeficit != null && (
            <Row
              label={result.waterDeficit > 0 ? 'Free water deficit' : 'Free water excess'}
              value={`${Math.abs(result.waterDeficit).toFixed(1)} L`}
            />
          )}
          {result.severity && (
            <div className={cn('font-medium', result.color)}>{result.severity}</div>
          )}
          <div className="border-t pt-2 text-xs text-muted-foreground space-y-0.5">
            <div>Hyponatremia correction: ไม่เกิน 8–10 mEq/L/day (chronic) หรือ 1–2 mEq/L/hr (acute symptomatic)</div>
            <div>Hypernatremia correction: ไม่เกิน 10–12 mEq/L/day</div>
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="electrolyte"
        getInput={() => ({
          data: { Electrolyte: 'Na', 'Na measured': na ? `${na} mEq/L` : undefined, Glucose: glucose ? `${glucose} mg/dL` : undefined, Weight: wt ? `${wt} kg` : undefined, Sex: sex, 'Corrected Na': result.corrected ? `${result.corrected.toFixed(1)} mEq/L` : undefined, Severity: result.severity || undefined },
          bw: toNum(wt) ?? 60,
        })}
      />
    </div>
  );
}

// ---- K Tab ----
function KTab() {
  const [k, setK] = useState('');
  const [wt, setWt] = useState('');

  const result = useMemo(() => {
    const kVal = toNum(k);
    let severity = ''; let color = ''; let replacement = '';
    if (kVal == null) return null;
    if (kVal < 2.5) { severity = 'Severe hypokalemia — emergent'; color = 'text-red-600 dark:text-red-400'; replacement = 'KCl 40 mEq IV over 4 hr (max 20 mEq/hr ถ้า central line); repeat q 4–6 hr'; }
    else if (kVal < 3.0) { severity = 'Moderate hypokalemia'; color = 'text-orange-500'; replacement = 'KCl 40–80 mEq/day IV หรือ PO; recheck K q 4–6 hr'; }
    else if (kVal < 3.5) { severity = 'Mild hypokalemia'; color = 'text-yellow-500'; replacement = 'KCl 40 mEq PO หรือ IV ช้าๆ; oral preferred ถ้าทนได้'; }
    else if (kVal > 6.0) { severity = 'Severe hyperkalemia — emergent'; color = 'text-red-600 dark:text-red-400'; replacement = 'Calcium gluconate 1–2 g IV; insulin 10U + D50W; Kayexalate/Patiromer; consider dialysis'; }
    else if (kVal > 5.5) { severity = 'Moderate hyperkalemia'; color = 'text-orange-500'; replacement = 'Kayexalate 15 g PO; furosemide ถ้า volume overloaded; monitor ECG'; }
    else if (kVal > 5.0) { severity = 'Mild hyperkalemia'; color = 'text-yellow-500'; replacement = 'ลด K intake; recheck; stop K supplements'; }
    else { severity = 'Normal (3.5–5.0)'; color = 'text-green-600 dark:text-green-400'; replacement = 'ไม่ต้องการ replacement'; }

    const deficit = kVal < 3.5 && wt ? `ประมาณ deficit: ${((3.5 - kVal) * 100).toFixed(0)}–${((3.5 - kVal) * 200).toFixed(0)} mEq` : null;
    return { severity, color, replacement, deficit };
  }, [k, wt]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="K ที่วัดได้" value={k} onChange={setK} unit="mEq/L" placeholder="3.5" />
        <Field label="น้ำหนัก (optional)" value={wt} onChange={setWt} unit="kg" placeholder="60" />
      </div>
      {result && (
        <ResultBox>
          <div className={cn('font-medium', result.color)}>{result.severity}</div>
          <Row label="การรักษา" value={result.replacement} />
          {result.deficit && <div className="text-xs text-muted-foreground">{result.deficit}</div>}
          <div className="border-t pt-2 text-xs text-muted-foreground">
            ECG changes: peaked T (hyperK early), QRS wide, sine wave (severe); flat T, U wave (hypoK)
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="electrolyte"
        getInput={() => ({
          data: { Electrolyte: 'K', 'K measured': k ? `${k} mEq/L` : undefined, Weight: wt || undefined, Severity: result?.severity || undefined },
          bw: toNum(wt) ?? 60,
        })}
      />
    </div>
  );
}

// ---- Ca Tab ----
function CaTab() {
  const [ca, setCa] = useState('');
  const [albumin, setAlbumin] = useState('');

  const result = useMemo(() => {
    const caVal = toNum(ca);
    const albVal = toNum(albumin);
    if (caVal == null) return null;

    const corrected = albVal != null ? caVal + 0.8 * (4.0 - albVal) : null;
    const display = corrected ?? caVal;

    let severity = ''; let color = ''; let mgmt = '';
    if (display < 7.0) { severity = 'Severe hypocalcemia — emergent'; color = 'text-red-600 dark:text-red-400'; mgmt = 'Calcium gluconate 2–3 g IV over 10 min; CaCl₂ 1 g IV ถ้า cardiac arrest'; }
    else if (display < 8.0) { severity = 'Moderate hypocalcemia'; color = 'text-orange-500'; mgmt = 'Calcium gluconate 1–2 g IV over 30 min; oral Ca + Vit D'; }
    else if (display < 8.5) { severity = 'Mild hypocalcemia'; color = 'text-yellow-500'; mgmt = 'Oral calcium carbonate 1–2 g TID + Vit D'; }
    else if (display > 14.0) { severity = 'Hypercalcemic crisis'; color = 'text-red-600 dark:text-red-400'; mgmt = 'NS 200–300 mL/hr aggressive hydration; furosemide ถ้า volume overloaded; calcitonin 4–8 IU/kg IM/SC; zoledronic acid'; }
    else if (display > 12.0) { severity = 'Severe hypercalcemia'; color = 'text-orange-500'; mgmt = 'NS hydration; bisphosphonate; treat cause'; }
    else if (display > 10.5) { severity = 'Mild-moderate hypercalcemia'; color = 'text-yellow-500'; mgmt = 'Hydration PO/IV; reduce Ca intake; follow-up'; }
    else { severity = 'Normal (8.5–10.5)'; color = 'text-green-600 dark:text-green-400'; mgmt = 'ไม่ต้องการ intervention เฉพาะ'; }

    return { corrected, display, severity, color, mgmt };
  }, [ca, albumin]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Total Ca ที่วัดได้" value={ca} onChange={setCa} unit="mg/dL" placeholder="8.5" />
        <Field label="Albumin (ถ้ามี)" value={albumin} onChange={setAlbumin} unit="g/dL" placeholder="4.0" />
      </div>
      {result && (
        <ResultBox>
          {result.corrected != null && <Row label="Corrected Ca (for albumin)" value={`${result.corrected.toFixed(1)} mg/dL`} />}
          <div className={cn('font-medium', result.color)}>{result.severity}</div>
          <Row label="การรักษา" value={result.mgmt} />
          <div className="border-t pt-2 text-xs text-muted-foreground">
            Trousseau/Chvostek (+) → symptomatic hypocalcemia → IV calcium ทันที
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="electrolyte"
        getInput={() => ({
          data: { Electrolyte: 'Ca', 'Ca measured': ca ? `${ca} mg/dL` : undefined, Albumin: albumin ? `${albumin} g/dL` : undefined, 'Corrected Ca': result?.corrected ? `${result.corrected.toFixed(1)} mg/dL` : undefined, Severity: result?.severity || undefined },
        })}
      />
    </div>
  );
}

// ---- Mg Tab ----
function MgTab() {
  const [mg, setMg] = useState('');

  const result = useMemo(() => {
    const mgVal = toNum(mg);
    if (mgVal == null) return null;

    let severity = ''; let color = ''; let mgmt = '';
    if (mgVal < 1.0) { severity = 'Severe hypomagnesemia'; color = 'text-red-600 dark:text-red-400'; mgmt = 'MgSO₄ 2–4 g IV over 5–15 min (emergent); then 6–8 g/day continuous infusion'; }
    else if (mgVal < 1.5) { severity = 'Moderate hypomagnesemia'; color = 'text-orange-500'; mgmt = 'MgSO₄ 1–2 g IV over 1 hr; repeat prn; oral Mg oxide 400–800 mg/day'; }
    else if (mgVal < 1.8) { severity = 'Mild hypomagnesemia'; color = 'text-yellow-500'; mgmt = 'Oral Mg oxide 400 mg TID; recheck Mg ใน 24–48 hr'; }
    else if (mgVal > 4.0) { severity = 'Severe hypermagnesemia'; color = 'text-red-600 dark:text-red-400'; mgmt = 'Calcium gluconate 1 g IV (antagonist); dialysis ถ้า renal failure'; }
    else if (mgVal > 2.5) { severity = 'Mild hypermagnesemia'; color = 'text-yellow-500'; mgmt = 'หยุด Mg supplement; hydration + furosemide; monitor DTR'; }
    else { severity = 'Normal (1.8–2.4)'; color = 'text-green-600 dark:text-green-400'; mgmt = 'ไม่ต้องการ intervention'; }

    return { severity, color, mgmt };
  }, [mg]);

  return (
    <div className="space-y-3">
      <Field label="Mg ที่วัดได้" value={mg} onChange={setMg} unit="mEq/L" placeholder="1.8" />
      {result && (
        <ResultBox>
          <div className={cn('font-medium', result.color)}>{result.severity}</div>
          <Row label="การรักษา" value={result.mgmt} />
          <div className="border-t pt-2 text-xs text-muted-foreground space-y-0.5">
            <div>Hypomagnesemia มักพร้อมกับ hypoK, hypoP, hypoCa</div>
            <div>MgSO₄ IV: ระวัง respiratory depression ถ้าให้เร็ว → monitor DTR + RR</div>
            <div>Hypermagnesemia: DTR หาย (Mg &gt;4), respiratory arrest (Mg &gt;10)</div>
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="electrolyte"
        getInput={() => ({
          data: { Electrolyte: 'Mg', 'Mg measured': mg ? `${mg} mEq/L` : undefined, Severity: result?.severity || undefined },
        })}
      />
    </div>
  );
}

// ---- Phos Tab ----
function PhosTab() {
  const [phos, setPhos] = useState('');

  const result = useMemo(() => {
    const phosVal = toNum(phos);
    if (phosVal == null) return null;

    let severity = ''; let color = ''; let mgmt = '';
    if (phosVal < 1.0) { severity = 'Severe hypophosphatemia'; color = 'text-red-600 dark:text-red-400'; mgmt = 'Sodium/potassium phosphate 0.32 mmol/kg IV over 12 hr; ต้องมอนิเตอร์ Ca ขณะให้ IV phos'; }
    else if (phosVal < 2.0) { severity = 'Moderate hypophosphatemia'; color = 'text-orange-500'; mgmt = 'IV phos ถ้า symptomatic; oral neutral phosphate tablet 250–500 mg TID'; }
    else if (phosVal < 2.5) { severity = 'Mild hypophosphatemia'; color = 'text-yellow-500'; mgmt = 'Oral phosphate supplement; skim milk (phosphate-rich); recheck ใน 24–48 hr'; }
    else if (phosVal > 6.0) { severity = 'Severe hyperphosphatemia'; color = 'text-orange-600'; mgmt = 'Phosphate binder (calcium carbonate/sevelamer); dialysis ถ้า CKD stage 5; restrict phosphate diet'; }
    else if (phosVal > 4.5) { severity = 'Mild-moderate hyperphosphatemia'; color = 'text-yellow-500'; mgmt = 'Phosphate binder กับอาหาร; low-phosphate diet; check PTH, Ca'; }
    else { severity = 'Normal (2.5–4.5)'; color = 'text-green-600 dark:text-green-400'; mgmt = 'ไม่ต้องการ intervention'; }

    return { severity, color, mgmt };
  }, [phos]);

  return (
    <div className="space-y-3">
      <Field label="Phosphorus ที่วัดได้" value={phos} onChange={setPhos} unit="mg/dL" placeholder="3.5" />
      {result && (
        <ResultBox>
          <div className={cn('font-medium', result.color)}>{result.severity}</div>
          <Row label="การรักษา" value={result.mgmt} />
          <div className="border-t pt-2 text-xs text-muted-foreground space-y-0.5">
            <div>Hypophosphatemia: อ่อนแรง, respiratory failure, rhabdomyolysis ในรายรุนแรง</div>
            <div>IV phos: ให้ช้า + monitor Ca (อาจทำ hypocalcemia)</div>
            <div>Refeeding syndrome: hypophos + hypoK + hypoMg หลังเริ่ม feeding</div>
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="electrolyte"
        getInput={() => ({
          data: { Electrolyte: 'Phosphorus', 'Phos measured': phos ? `${phos} mg/dL` : undefined, Severity: result?.severity || undefined },
        })}
      />
    </div>
  );
}

export default function ElectrolyteCalculator() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('na');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Electrolyte Calculator</h1>
          <p className="text-xs text-muted-foreground">Na · K · Ca · Mg · Phosphorus</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
              tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent',
            )}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'na' && <NaTab />}
      {tab === 'k' && <KTab />}
      {tab === 'ca' && <CaTab />}
      {tab === 'mg' && <MgTab />}
      {tab === 'phos' && <PhosTab />}

      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
