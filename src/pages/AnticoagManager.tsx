import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type Tab = 'warfarin' | 'doac' | 'heparin' | 'bridging';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'warfarin', label: 'Warfarin', icon: '🔄' },
  { id: 'doac', label: 'DOAC', icon: '💊' },
  { id: 'heparin', label: 'Heparin/LMWH', icon: '💉' },
  { id: 'bridging', label: 'Bridging', icon: '🌉' },
];

function Field({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-1">
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {unit && <span className="flex items-center rounded-md border bg-muted px-2 text-xs text-muted-foreground whitespace-nowrap">{unit}</span>}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-card p-3 text-sm space-y-2">{children}</div>;
}

// ---- Warfarin ----
function WarfarinTab() {
  const [inr, setInr] = useState('');
  const [bleeding, setBleeding] = useState('none');

  const inrVal = parseFloat(inr) || null;

  const management = (() => {
    if (!inrVal) return null;
    if (bleeding === 'major') {
      return {
        urgency: 'Major Bleeding — Reverse Now',
        color: 'text-red-600 dark:text-red-400',
        steps: [
          'Vitamin K 10 mg IV slow (over 20–30 min)',
          '4-factor PCC (Octaplex/Beriplex) 25–50 U/kg IV — preferred (rapid ~15 min)',
          'หรือ FFP 15–20 mL/kg ถ้าไม่มี PCC',
          'Source control (GI scope, surgery, IR)',
          'Transfuse pRBC ถ้า Hb < 7–8 g/dL',
        ],
      };
    }
    if (bleeding === 'minor') {
      return {
        urgency: 'Minor Bleeding — Symptomatic Management',
        color: 'text-orange-500',
        steps: [
          'Hold warfarin 1–2 doses',
          'Vitamin K 2.5–5 mg PO หรือ IV (ช้า)',
          'Recheck INR ใน 24–48 hr',
          'Local hemostasis ถ้าทำได้',
        ],
      };
    }
    if (inrVal > 10) return { urgency: 'INR > 10 — No bleeding', color: 'text-orange-500', steps: ['Hold warfarin', 'Vitamin K 5–10 mg PO', 'Recheck INR ใน 24 hr', 'Monitor bleeding symptoms'] };
    if (inrVal > 4.5) return { urgency: 'INR 4.5–10 — Supratherapeutic', color: 'text-yellow-500', steps: ['Hold 1–2 doses warfarin', 'Vitamin K 1–2.5 mg PO ถ้า bleeding risk สูง', 'Recheck INR ใน 24–48 hr'] };
    if (inrVal > 3) return { urgency: 'INR 3–4.5 — Slightly above target', color: 'text-yellow-500', steps: ['ลด dose warfarin 10–20%', 'Recheck INR ใน 1 wk', 'Check interacting drugs/food'] };
    if (inrVal < 1.5) return { urgency: 'INR < 1.5 — Sub-therapeutic', color: 'text-blue-500', steps: ['เพิ่ม dose warfarin 10–20%', 'Recheck INR ใน 3–5 วัน', 'Check compliance, diet, interactions'] };
    return { urgency: `INR ${inrVal.toFixed(1)} — Therapeutic`, color: 'text-green-600 dark:text-green-400', steps: ['Maintain current dose', 'Recheck INR ใน 4–6 wk'] };
  })();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="INR ปัจจุบัน" value={inr} onChange={setInr} placeholder="2.5" />
        <Select label="Bleeding status" value={bleeding} onChange={setBleeding} options={[
          { value: 'none', label: 'ไม่มี bleeding' },
          { value: 'minor', label: 'Minor bleeding' },
          { value: 'major', label: 'Major bleeding' },
        ]} />
      </div>
      {management && (
        <InfoBox>
          <div className={cn('font-semibold', management.color)}>{management.urgency}</div>
          <ul className="space-y-1">
            {management.steps.map((s, i) => (
              <li key={i} className="flex gap-1.5 text-xs">
                <span className="shrink-0 text-muted-foreground">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </InfoBox>
      )}
      <AITreatmentPanel
        tool="anticoag"
        getInput={() => ({
          data: { Anticoagulant: 'Warfarin', INR: inr || undefined, 'Bleeding status': bleeding },
        })}
      />
    </div>
  );
}

// ---- DOAC ----
function DoacTab() {
  const [drug, setDrug] = useState('apixaban');
  const [bleeding, setBleeding] = useState('none');
  const [lastDose, setLastDose] = useState('');

  const reversals: Record<string, { agent: string; dose: string; note: string }> = {
    apixaban: { agent: 'Andexanet alfa', dose: 'High dose: 800 mg IV bolus → 960 mg/hr × 2 hr\nLow dose: 400 mg → 480 mg/hr × 2 hr', note: 'หรือ 4-factor PCC 50 U/kg ถ้าไม่มี andexanet (off-label)' },
    rivaroxaban: { agent: 'Andexanet alfa', dose: 'ขึ้นกับ dose และ timing (see ข้างบน)', note: '4-factor PCC 50 U/kg เป็น alternative' },
    dabigatran: { agent: 'Idarucizumab (Praxbind)', dose: '5 g IV (2×2.5 g) — specific reversal', note: 'Dialysis เอาออกได้ 50–60% ต่อ session ถ้าไม่มี idarucizumab' },
    edoxaban: { agent: 'Andexanet alfa (off-label)', dose: '4-factor PCC 50 U/kg (preferred alternative)', note: 'ยังไม่มี specific reversal approved' },
  };
  const rev = reversals[drug];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select label="DOAC" value={drug} onChange={setDrug} options={[
          { value: 'apixaban', label: 'Apixaban (Eliquis)' },
          { value: 'rivaroxaban', label: 'Rivaroxaban (Xarelto)' },
          { value: 'dabigatran', label: 'Dabigatran (Pradaxa)' },
          { value: 'edoxaban', label: 'Edoxaban (Lixiana)' },
        ]} />
        <Select label="Bleeding status" value={bleeding} onChange={setBleeding} options={[
          { value: 'none', label: 'ไม่มี bleeding / elective' },
          { value: 'minor', label: 'Minor bleeding' },
          { value: 'major', label: 'Life-threatening bleeding' },
        ]} />
        <Field label="ให้ยาครั้งสุดท้ายกี่ชั่วโมงที่แล้ว" value={lastDose} onChange={setLastDose} unit="ชม." placeholder="4" />
      </div>
      {bleeding === 'major' && rev && (
        <InfoBox>
          <div className="text-red-600 dark:text-red-400 font-semibold">Major Bleeding — Reverse Immediately</div>
          <div className="text-xs font-medium">Specific reversal: {rev.agent}</div>
          <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{rev.dose}</pre>
          <div className="text-xs text-muted-foreground border-t pt-1">{rev.note}</div>
          <div className="text-xs text-muted-foreground">Activated charcoal ถ้าให้ยาภายใน 2–4 hr (ยังไม่ absorb)</div>
        </InfoBox>
      )}
      {bleeding === 'minor' && (
        <InfoBox>
          <div className="text-orange-500 font-semibold">Minor Bleeding</div>
          <ul className="text-xs space-y-0.5">
            <li>• Hold DOAC (2–3 doses)</li>
            <li>• Local hemostasis</li>
            <li>• Reassess ใน 12–24 hr</li>
            <li>• Restart เมื่อ bleeding หยุด + reassess indication</li>
          </ul>
        </InfoBox>
      )}
      {bleeding === 'none' && lastDose && (
        <InfoBox>
          <div className="text-sm font-medium">Elective reversal / Procedure</div>
          <div className="text-xs text-muted-foreground">
            Last dose {lastDose} hr ago — {parseFloat(lastDose) < 24 ? 'ยังอาจมี drug effect: รอ 12–24 hr หรือ delay ถ้าทำได้' : 'Drug effect ลดแล้ว: ทำ procedure ได้ถ้า renal function ปกติ'}
          </div>
        </InfoBox>
      )}
      <AITreatmentPanel
        tool="anticoag"
        getInput={() => ({
          data: { Anticoagulant: drug, 'Bleeding status': bleeding, 'Last dose (hr ago)': lastDose || undefined },
        })}
      />
    </div>
  );
}

// ---- Heparin / LMWH ----
function HeparinTab() {
  const [type, setType] = useState('ufh');
  const [wt, setWt] = useState('');
  const [indication] = useState('vte');

  const wtVal = parseFloat(wt) || 60;

  const protocols: Record<string, { doses: string[]; monitoring: string[] }> = {
    ufh: {
      doses: [
        `Bolus: 80 U/kg IV = ${Math.round(80 * wtVal)} U (max 5000 U)`,
        `Initial infusion: 18 U/kg/hr = ${Math.round(18 * wtVal)} U/hr`,
        'Titrate per weight-based nomogram',
        'Target aPTT 60–100 sec (anti-Xa 0.3–0.7 IU/mL)',
      ],
      monitoring: ['aPTT q 6 hr จนถึง target 2×, then q 24 hr', 'Platelet q 2–3 วัน (HIT surveillance)', 'CBC, renal function baseline'],
    },
    enoxaparin: {
      doses: [
        `VTE treatment: 1 mg/kg SC q 12 hr = ${Math.round(1 * wtVal)} mg q 12 hr`,
        `หรือ 1.5 mg/kg OD = ${Math.round(1.5 * wtVal)} mg OD (ถ้าไม่ซับซ้อน)`,
        `ACS (NSTEMI): 1 mg/kg SC q 12 hr (max 100 mg/dose)`,
        `VTE prophylaxis: 40 mg SC OD`,
        'ปรับ dose ถ้า CrCl < 30: 1 mg/kg OD (monitor anti-Xa)',
      ],
      monitoring: ['Anti-Xa level ถ้า CrCl < 30, morbid obesity, pregnancy', 'Target anti-Xa (treatment): 0.6–1.0 IU/mL (q 12 hr) หรือ 1.0–2.0 (OD)', 'Platelet q 3–5 วัน'],
    },
    fondaparinux: {
      doses: [
        `VTE: 7.5 mg SC OD (wt 50–100 kg); 5 mg (<50 kg); 10 mg (>100 kg)`,
        `Avoid ถ้า CrCl < 30`,
        `ACS: 2.5 mg SC OD × ≤8 วัน`,
      ],
      monitoring: ['CBC baseline', 'ไม่ต้องการ anti-Xa routine monitoring', 'Renal function ทุก 3–5 วัน'],
    },
  };

  const p = protocols[type] ?? protocols.ufh;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select label="ชนิด" value={type} onChange={setType} options={[
          { value: 'ufh', label: 'UFH (unfractionated heparin)' },
          { value: 'enoxaparin', label: 'Enoxaparin (Clexane)' },
          { value: 'fondaparinux', label: 'Fondaparinux (Arixtra)' },
        ]} />
        <Field label="น้ำหนัก" value={wt} onChange={setWt} unit="kg" placeholder="60" />
      </div>
      <InfoBox>
        <div className="font-medium text-sm">{type === 'ufh' ? 'UFH Protocol' : type === 'enoxaparin' ? 'Enoxaparin' : 'Fondaparinux'}</div>
        <div className="space-y-0.5">
          {p.doses.map((d, i) => <div key={i} className="text-xs">• {d}</div>)}
        </div>
        <div className="border-t pt-2">
          <div className="text-xs font-medium text-muted-foreground mb-1">Monitoring:</div>
          {p.monitoring.map((m, i) => <div key={i} className="text-xs text-muted-foreground">• {m}</div>)}
        </div>
      </InfoBox>
      <AITreatmentPanel
        tool="anticoag"
        getInput={() => ({
          data: { Anticoagulant: type, Indication: indication, Weight: wt ? `${wt} kg` : undefined },
          bw: wtVal,
        })}
      />
    </div>
  );
}

// ---- Bridging ----
function BridgingTab() {
  const [indication, setIndication] = useState('af-low');

  const bridging: Record<string, { need: string; color: string; protocol: string[] }> = {
    'af-low': { need: 'ไม่จำเป็น (Low risk)', color: 'text-green-600 dark:text-green-400', protocol: ['หยุด warfarin 5 วันก่อน', 'ไม่ต้อง bridging heparin', 'Restart warfarin 12–24 hr หลัง procedure'] },
    'af-mod': { need: 'Individualize (Moderate)', color: 'text-yellow-500', protocol: ['Discuss risk/benefit กับ patient', 'Hematology/cardiology consult', 'หยุด warfarin 5 วัน, LMWH bridging ถ้าตัดสินว่าจำเป็น'] },
    'af-high': { need: 'Bridging แนะนำ (High risk)', color: 'text-orange-500', protocol: ['หยุด warfarin 5 วันก่อน', 'Enoxaparin 1 mg/kg SC q 12 hr เริ่มเมื่อ INR < 2', 'หยุด LMWH 24 hr ก่อน procedure (หรือ 12 hr ถ้า low-dose prophylaxis)', 'Restart LMWH 48–72 hr หลัง procedure', 'Restart warfarin 12–24 hr หลัง procedure เมื่อ hemostasis เรียบร้อย'] },
    'mech-valve': { need: 'Bridging จำเป็น (Mechanical valve)', color: 'text-red-600 dark:text-red-400', protocol: ['หยุด warfarin 5 วัน', 'UFH IV หรือ Enoxaparin 1 mg/kg q 12 hr', 'หยุด UFH 4–6 hr ก่อน; LMWH 24 hr ก่อน', 'Restart anticoag 24–48 hr หลัง procedure'] },
    'vte-recent': { need: 'Bridging จำเป็น (VTE < 3 เดือน)', color: 'text-red-600 dark:text-red-400', protocol: ['Hematology consult urgently', 'Enoxaparin bridging', 'พิจารณา IVC filter ถ้า surgery จำเป็นภายใน 1 เดือนของ VTE'] },
  };

  const b = bridging[indication] ?? bridging['af-low'];

  return (
    <div className="space-y-3">
      <Select label="Indication for anticoagulation" value={indication} onChange={setIndication} options={[
        { value: 'af-low', label: 'AF — Low risk (CHADS₂ 0–1)' },
        { value: 'af-mod', label: 'AF — Moderate risk (CHADS₂ 2)' },
        { value: 'af-high', label: 'AF — High risk (CHADS₂ ≥ 3, prior stroke/TIA)' },
        { value: 'mech-valve', label: 'Mechanical heart valve' },
        { value: 'vte-recent', label: 'VTE < 3 months' },
      ]} />
      <InfoBox>
        <div className={cn('font-semibold', b.color)}>{b.need}</div>
        <ul className="space-y-0.5">
          {b.protocol.map((p, i) => (
            <li key={i} className="flex gap-1.5 text-xs">
              <span className="shrink-0 text-muted-foreground">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </InfoBox>
      <AITreatmentPanel
        tool="anticoag"
        getInput={() => ({
          data: { Context: 'Bridging anticoagulation', Indication: indication },
        })}
      />
    </div>
  );
}

export default function AnticoagManager() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('warfarin');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Anticoagulation Manager</h1>
          <p className="text-xs text-muted-foreground">Reversal · DOAC · Heparin · Bridging</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
              tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent')}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === 'warfarin' && <WarfarinTab />}
      {tab === 'doac' && <DoacTab />}
      {tab === 'heparin' && <HeparinTab />}
      {tab === 'bridging' && <BridgingTab />}

      <p className="text-xs text-muted-foreground">⚠️ ตรวจสอบผลและ adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง</p>
    </div>
  );
}
