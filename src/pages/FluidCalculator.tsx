import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type Tab = 'maintenance' | 'deficit' | 'bolus' | 'fwd' | 'transfusion';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'maintenance', label: 'Maintenance', icon: '💧' },
  { id: 'deficit', label: 'Deficit', icon: '📉' },
  { id: 'bolus', label: 'Bolus', icon: '💉' },
  { id: 'fwd', label: 'Free Water Deficit', icon: '🧂' },
  { id: 'transfusion', label: 'Transfusion', icon: '🩸' },
];

function toNum(s: string): number | null {
  if (!s.trim()) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
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
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium text-right', highlight && 'text-primary')}>{value}</span>
    </div>
  );
}

// ---- Maintenance (Holliday-Segar) ----
function MaintenanceTab() {
  const [wt, setWt] = useState('');

  const result = useMemo(() => {
    const w = toNum(wt);
    if (w == null) return null;
    let rate: number;
    if (w <= 10) rate = w * 100;
    else if (w <= 20) rate = 1000 + (w - 10) * 50;
    else rate = 1500 + (w - 20) * 20;
    const hourly = Math.round(rate / 24);
    return { daily: Math.round(rate), hourly };
  }, [wt]);

  return (
    <div className="space-y-3">
      <Field label="น้ำหนัก" value={wt} onChange={setWt} unit="kg" placeholder="60" />
      {result && (
        <ResultBox>
          <Row label="Maintenance fluid/day (Holliday-Segar)" value={`${result.daily} mL/day`} highlight />
          <Row label="Rate" value={`${result.hourly} mL/hr`} />
          <div className="border-t pt-2 text-xs text-muted-foreground space-y-0.5">
            <div>สูตร: &lt;10 kg → 100 mL/kg; 10–20 kg → 1000 + 50×(kg-10); &gt;20 kg → 1500 + 20×(kg-20)</div>
            <div>ผู้ใหญ่ปกติ: ~30–35 mL/kg/day หรือ 1.5–2 L/day</div>
            <div>ปรับเพิ่มถ้า: fever (+10–15% per °C above 37.5), diaphoresis, tachypnea</div>
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="fluid"
        getInput={() => ({
          data: { 'Type': 'Maintenance', Weight: wt ? `${wt} kg` : undefined, 'Daily': result ? `${result.daily} mL/day` : undefined, 'Hourly rate': result ? `${result.hourly} mL/hr` : undefined },
          bw: toNum(wt) ?? 60,
        })}
      />
    </div>
  );
}

// ---- Deficit ----
function DeficitTab() {
  const [wt, setWt] = useState('');
  const [percent, setPercent] = useState('5');

  const result = useMemo(() => {
    const w = toNum(wt);
    const p = toNum(percent);
    if (w == null || p == null) return null;
    const deficit = w * (p / 100) * 1000; // mL
    const half8hr = deficit / 2;
    const remaining16hr = deficit / 2;
    return { deficit: Math.round(deficit), half8hr: Math.round(half8hr), remaining16hr: Math.round(remaining16hr), rate8: Math.round(half8hr / 8), rate16: Math.round(remaining16hr / 16) };
  }, [wt, percent]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="น้ำหนัก" value={wt} onChange={setWt} unit="kg" placeholder="60" />
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">% Dehydration</label>
          <div className="flex gap-1">
            {['3', '5', '8', '10'].map((p) => (
              <button key={p} onClick={() => setPercent(p)}
                className={cn('flex-1 rounded-md border py-2 text-sm', percent === p ? 'border-primary bg-primary/10 font-medium' : 'bg-card hover:bg-accent')}>
                {p}%
              </button>
            ))}
          </div>
        </div>
      </div>
      {result && (
        <ResultBox>
          <Row label="Total deficit" value={`${result.deficit} mL`} highlight />
          <Row label="ครึ่งแรก (8 hr)" value={`${result.half8hr} mL → ${result.rate8} mL/hr`} />
          <Row label="ครึ่งหลัง (16 hr)" value={`${result.remaining16hr} mL → ${result.rate16} mL/hr`} />
          <div className="border-t pt-2 text-xs text-muted-foreground">
            รวม maintenance ด้วยในการคำนวณ total IV rate จริง
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="fluid"
        getInput={() => ({
          data: { 'Type': 'Deficit replacement', Weight: wt ? `${wt} kg` : undefined, 'Dehydration': `${percent}%`, 'Deficit': result ? `${result.deficit} mL` : undefined },
          bw: toNum(wt) ?? 60,
        })}
      />
    </div>
  );
}

// ---- Bolus ----
function BolusTab() {
  const [wt, setWt] = useState('');
  const [dosePerKg, setDosePerKg] = useState('10');

  const result = useMemo(() => {
    const w = toNum(wt);
    const d = toNum(dosePerKg);
    if (w == null || d == null) return null;
    return { volume: Math.round(w * d) };
  }, [wt, dosePerKg]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="น้ำหนัก" value={wt} onChange={setWt} unit="kg" placeholder="60" />
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Dose (mL/kg)</label>
          <div className="grid grid-cols-3 gap-1">
            {['10', '20', '30'].map((d) => (
              <button key={d} onClick={() => setDosePerKg(d)}
                className={cn('rounded-md border py-2 text-sm', dosePerKg === d ? 'border-primary bg-primary/10 font-medium' : 'bg-card hover:bg-accent')}>
                {d} mL/kg
              </button>
            ))}
          </div>
        </div>
      </div>
      <Field label="หรือกำหนด dose เอง (mL/kg)" value={dosePerKg} onChange={setDosePerKg} unit="mL/kg" placeholder="20" />
      {result && (
        <ResultBox>
          <Row label="IV bolus volume" value={`${result.volume} mL`} highlight />
          <div className="border-t pt-2 text-xs text-muted-foreground space-y-0.5">
            <div>Sepsis: 30 mL/kg NS/LR over 3 hr; reevaluate after each 500 mL in shock</div>
            <div>Peds: 10–20 mL/kg LR over 15–30 min; reassess</div>
            <div>LR preferred ใน sepsis (SMART trial: ลด AKI vs NS)</div>
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="fluid"
        getInput={() => ({
          data: { 'Type': 'Bolus', Weight: wt ? `${wt} kg` : undefined, 'Dose': `${dosePerKg} mL/kg`, 'Volume': result ? `${result.volume} mL` : undefined },
          bw: toNum(wt) ?? 60,
        })}
      />
    </div>
  );
}

// ---- Free Water Deficit ----
function FWDTab() {
  const [na, setNa] = useState('');
  const [wt, setWt] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  const result = useMemo(() => {
    const naVal = toNum(na);
    const wtVal = toNum(wt);
    if (naVal == null || wtVal == null) return null;
    const tbw = wtVal * (sex === 'male' ? 0.6 : 0.5);
    const deficit = tbw * ((naVal / 140) - 1);
    const rate24 = deficit > 0 ? Math.round((deficit * 1000) / 24) : null;
    const rate48 = deficit > 0 ? Math.round((deficit * 1000) / 48) : null;
    return { deficit: Math.round(deficit * 10) / 10, tbw: Math.round(tbw * 10) / 10, rate24, rate48 };
  }, [na, wt, sex]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Na ที่วัดได้" value={na} onChange={setNa} unit="mEq/L" placeholder="155" />
        <Field label="น้ำหนัก" value={wt} onChange={setWt} unit="kg" placeholder="60" />
      </div>
      <div className="flex gap-2">
        {(['male', 'female'] as const).map((s) => (
          <button key={s} onClick={() => setSex(s)}
            className={cn('flex-1 rounded-md border py-2 text-sm', sex === s ? 'border-primary bg-primary/10 font-medium' : 'bg-card hover:bg-accent')}>
            {s === 'male' ? '♂ ชาย' : '♀ หญิง'}
          </button>
        ))}
      </div>
      {result && (
        <ResultBox>
          <Row label="TBW" value={`${result.tbw} L`} />
          {result.deficit > 0 ? (
            <>
              <Row label="Free water deficit" value={`${result.deficit} L`} highlight />
              <Row label="Rate สำหรับแก้ใน 24 hr" value={`${result.rate24} mL/hr`} />
              <Row label="Rate สำหรับแก้ใน 48 hr (safer)" value={`${result.rate48} mL/hr`} />
            </>
          ) : (
            <Row label="Free water excess" value={`${Math.abs(result.deficit)} L (hyponatremia)`} />
          )}
          <div className="border-t pt-2 text-xs text-muted-foreground">
            ลด Na ไม่เกิน 10–12 mEq/L/day ใน hypernatremia chronic; ใช้ D5W หรือ hypotonic saline
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="fluid"
        getInput={() => ({
          data: { 'Type': 'Free water deficit', Na: na ? `${na} mEq/L` : undefined, Weight: wt ? `${wt} kg` : undefined, Sex: sex, 'Deficit': result ? `${result.deficit} L` : undefined },
          bw: toNum(wt) ?? 60,
        })}
      />
    </div>
  );
}

// ---- Transfusion ----
function TransfusionTab() {
  const [hb, setHb] = useState('');
  const [targetHb, setTargetHb] = useState('8');
  const [wt, setWt] = useState('');

  const result = useMemo(() => {
    const hbVal = toNum(hb);
    const targetVal = toNum(targetHb);
    const wtVal = toNum(wt);
    if (hbVal == null || targetVal == null || wtVal == null) return null;
    if (hbVal >= targetVal) return { units: 0, note: `Hb ${hbVal} ≥ target ${targetVal} → ไม่จำเป็นต้องให้เลือด` };
    // 1 unit pRBC ≈ เพิ่ม Hb 1 g/dL ใน 70 kg; หรือ 3 mL/kg ≈ 1 g/dL
    const hbDiff = targetVal - hbVal;
    const units = Math.ceil(hbDiff); // rough 1 unit ≈ 1 g/dL in adult
    const exactFormula = Math.round((hbDiff * wtVal * 3)); // mL pRBC
    return { units, mlNeeded: exactFormula, note: null };
  }, [hb, targetHb, wt]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Hb ปัจจุบัน" value={hb} onChange={setHb} unit="g/dL" placeholder="7.0" />
        <Field label="น้ำหนัก" value={wt} onChange={setWt} unit="kg" placeholder="60" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Target Hb (g/dL)</label>
        <div className="flex gap-2">
          {['7', '8', '9', '10'].map((t) => (
            <button key={t} onClick={() => setTargetHb(t)}
              className={cn('flex-1 rounded-md border py-2 text-sm', targetHb === t ? 'border-primary bg-primary/10 font-medium' : 'bg-card hover:bg-accent')}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {result && (
        <ResultBox>
          {result.note ? (
            <div className="text-green-600 dark:text-green-400 font-medium">{result.note}</div>
          ) : (
            <>
              <Row label="pRBC ประมาณ" value={`${result.units} units`} highlight />
              <Row label="คำนวณจาก formula (3 mL/kg/1 g/dL)" value={`${result.mlNeeded} mL pRBC`} />
            </>
          )}
          <div className="border-t pt-2 text-xs text-muted-foreground space-y-0.5">
            <div>Restrictive strategy: target Hb ≥7 (general), ≥8 (cardiac/post-op), ≥9 (ACS)</div>
            <div>1 unit pRBC ≈ 200–250 mL; ให้ใน 2–4 hr; recheck Hb หลัง 15–30 min</div>
            <div>FFP: 10–15 mL/kg สำหรับ coagulopathy (INR &gt;1.5)</div>
            <div>Plt: 1 pool ≈ เพิ่ม 20–40K; target &gt;50K (bleeding), &gt;100K (CNS/ophthalmic)</div>
          </div>
        </ResultBox>
      )}
      <AITreatmentPanel
        tool="fluid"
        getInput={() => ({
          data: { 'Type': 'Transfusion', 'Hb current': hb ? `${hb} g/dL` : undefined, 'Target Hb': `${targetHb} g/dL`, Weight: wt ? `${wt} kg` : undefined, 'pRBC needed': result && !result.note ? `${result.units} units` : 'ไม่จำเป็น' },
          bw: toNum(wt) ?? 60,
        })}
      />
    </div>
  );
}

export default function FluidCalculator() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('maintenance');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Fluid Calculator</h1>
          <p className="text-xs text-muted-foreground">Maintenance · Deficit · Bolus · Free Water · Transfusion</p>
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

      {tab === 'maintenance' && <MaintenanceTab />}
      {tab === 'deficit' && <DeficitTab />}
      {tab === 'bolus' && <BolusTab />}
      {tab === 'fwd' && <FWDTab />}
      {tab === 'transfusion' && <TransfusionTab />}

      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
