import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type Sex = 'M' | 'F';

type ClinicalContext =
  | 'post-intubation'
  | 'fight-vent'
  | 'ards'
  | 'delirium'
  | 'procedural'
  | 'weaning';

const CONTEXT_LABELS: Record<ClinicalContext, string> = {
  'post-intubation': 'Post-intubation sedation (ทั่วไป)',
  'fight-vent': 'Fight ventilator / Agitation',
  'ards': 'ARDS รุนแรง (P/F < 150)',
  'delirium': 'Delirium + agitation',
  'procedural': 'Procedural sedation (short-term)',
  'weaning': 'Weaning จาก sedation / ventilator',
};

const RASS_LABELS: Record<string, string> = {
  '+4': '+4 Combative',
  '+3': '+3 Very agitated',
  '+2': '+2 Agitated',
  '+1': '+1 Restless',
  '0': '0 Alert & calm',
  '-1': '-1 Drowsy',
  '-2': '-2 Light sedation',
  '-3': '-3 Moderate sedation',
  '-4': '-4 Deep sedation',
  '-5': '-5 Unarousable',
};

type Comorbidity =
  | 'renal'
  | 'hepatic'
  | 'hemodynamic'
  | 'elderly'
  | 'delirium'
  | 'chronic-opioid';

const COMORBIDITY_LABELS: Record<Comorbidity, string> = {
  renal: 'Renal failure (eGFR < 30)',
  hepatic: 'Hepatic failure',
  hemodynamic: 'Hemodynamic instability',
  elderly: 'Elderly (> 75 ปี)',
  delirium: 'Delirium present',
  'chronic-opioid': 'Chronic opioid use',
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function CheckItem({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded"
      />
      <span>{label}</span>
    </label>
  );
}

export default function SedationHelper() {
  const navigate = useNavigate();

  const [age, setAge] = useState('');
  const [bw, setBw] = useState('60');
  const [sex, setSex] = useState<Sex>('M');
  const [context, setContext] = useState<ClinicalContext>('post-intubation');
  const [currentRass, setCurrentRass] = useState('+2');
  const [targetRass, setTargetRass] = useState('-2');
  const [comorbidities, setComorbidities] = useState<Record<Comorbidity, boolean>>({
    renal: false,
    hepatic: false,
    hemodynamic: false,
    elderly: false,
    delirium: false,
    'chronic-opioid': false,
  });
  const [onFentanyl, setOnFentanyl] = useState(false);
  const [fentanylRate, setFentanylRate] = useState('');
  const [onMidazolam, setOnMidazolam] = useState(false);
  const [midazolamRate, setMidazolamRate] = useState('');
  const [onPropofol, setOnPropofol] = useState(false);
  const [propofolRate, setPropofolRate] = useState('');
  const [notes, setNotes] = useState('');

  const bwNum = parseFloat(bw) || 60;

  const activeComorbidities = (Object.keys(comorbidities) as Comorbidity[])
    .filter((k) => comorbidities[k])
    .map((k) => COMORBIDITY_LABELS[k]);

  const currentMeds: string[] = [];
  if (onFentanyl) currentMeds.push(`Fentanyl drip${fentanylRate ? ` @ ${fentanylRate} mL/hr` : ''}`);
  if (onMidazolam) currentMeds.push(`Midazolam drip${midazolamRate ? ` @ ${midazolamRate} mL/hr` : ''}`);
  if (onPropofol) currentMeds.push(`Propofol drip${propofolRate ? ` @ ${propofolRate} mL/hr` : ''}`);

  const rassOptions = Object.entries(RASS_LABELS).map(([v, l]) => ({
    value: v,
    label: l,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Sedation Helper</h1>
          <p className="text-xs text-muted-foreground">
            AI แนะนำ regimen + dose สำหรับ ICU sedation
          </p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="text-sm font-medium">ข้อมูลผู้ป่วย</div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="อายุ">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="60"
              className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
          <Field label="น้ำหนัก (kg)">
            <input
              type="number"
              value={bw}
              onChange={(e) => setBw(e.target.value)}
              placeholder="60"
              className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
        </div>
        <div className="flex gap-4">
          {(['M', 'F'] as Sex[]).map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                checked={sex === s}
                onChange={() => setSex(s)}
                className="h-4 w-4"
              />
              {s === 'M' ? 'ชาย' : 'หญิง'}
            </label>
          ))}
        </div>
      </div>

      {/* Clinical Context */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="text-sm font-medium">สถานการณ์คลินิก</div>
        <Field label="Context">
          <Select
            value={context}
            onChange={(v) => setContext(v as ClinicalContext)}
            options={Object.entries(CONTEXT_LABELS).map(([v, l]) => ({
              value: v,
              label: l,
            }))}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="RASS ปัจจุบัน">
            <Select
              value={currentRass}
              onChange={setCurrentRass}
              options={rassOptions}
            />
          </Field>
          <Field label="Target RASS">
            <Select
              value={targetRass}
              onChange={setTargetRass}
              options={rassOptions}
            />
          </Field>
        </div>
      </div>

      {/* Comorbidities */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="text-sm font-medium">โรคร่วม / ข้อควรระวัง</div>
        <div className="space-y-2">
          {(Object.keys(comorbidities) as Comorbidity[]).map((k) => (
            <CheckItem
              key={k}
              checked={comorbidities[k]}
              onChange={(v) =>
                setComorbidities((prev) => ({ ...prev, [k]: v }))
              }
              label={COMORBIDITY_LABELS[k]}
            />
          ))}
        </div>
      </div>

      {/* Current Medications */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="text-sm font-medium">ยาที่ให้อยู่ปัจจุบัน</div>
        <div className="space-y-3">
          {[
            { key: 'fentanyl', label: 'Fentanyl drip', on: onFentanyl, setOn: setOnFentanyl, rate: fentanylRate, setRate: setFentanylRate },
            { key: 'midazolam', label: 'Midazolam drip', on: onMidazolam, setOn: setOnMidazolam, rate: midazolamRate, setRate: setMidazolamRate },
            { key: 'propofol', label: 'Propofol drip', on: onPropofol, setOn: setOnPropofol, rate: propofolRate, setRate: setPropofolRate },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <CheckItem
                checked={item.on}
                onChange={item.setOn}
                label={item.label}
              />
              {item.on && (
                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => item.setRate(e.target.value)}
                    placeholder="rate"
                    className="w-20 rounded-md border bg-card px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground">mL/hr</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border bg-card p-4 space-y-2">
        <div className="text-sm font-medium">หมายเหตุเพิ่มเติม (optional)</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="เช่น ผู้ป่วย prone position, ECMO, แพ้ยา..."
          rows={2}
          className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Quick Reference */}
      <div
        className={cn(
          'rounded-lg border p-3 text-xs space-y-1',
          context === 'ards' ? 'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30' : 'bg-muted/40',
        )}
      >
        <div className="font-medium">
          {context === 'ards' ? '⚠️ ARDS Protocol' : '💡 หลักการ Analgosedation'}
        </div>
        {context === 'ards' ? (
          <div>P/F &lt; 150 → Fentanyl + Propofol/Midazolam → Cisatracurium NMB (ถ้าจำเป็น) | BIS 40–60 + TOF 1–2/4</div>
        ) : context === 'delirium' ? (
          <div>ลด/หยุด Benzodiazepine → Dexmedetomidine | ± Haloperidol 2.5–5 mg IV PRN | CAM-ICU ทุก 8 hr</div>
        ) : context === 'weaning' ? (
          <div>SAT (หยุด sedative) + SBT ทุกเช้า | เปลี่ยนเป็น Dexmedetomidine | ลด Fentanyl 25% ทุก 4–6 hr</div>
        ) : (
          <div>CPOT ก่อน → Analgesia (Fentanyl) → Sedative เฉพาะถ้าจำเป็น | Target RASS −1 ถึง −2</div>
        )}
      </div>

      <AITreatmentPanel
        tool="sedation-helper"
        getInput={() => ({
          data: {
            Age: age || undefined,
            Sex: sex,
            'BW': `${bwNum} kg`,
            Context: CONTEXT_LABELS[context],
            'Current RASS': RASS_LABELS[currentRass],
            'Target RASS': RASS_LABELS[targetRass],
            Comorbidities: activeComorbidities.length ? activeComorbidities.join(', ') : 'ไม่มี',
            'Current Meds': currentMeds.length ? currentMeds.join(', ') : 'ยังไม่มี',
            Notes: notes || undefined,
          },
          bw: bwNum,
        })}
      />

      <p className="text-xs text-muted-foreground">
        ⚠️ AI-generated — verify clinically | ตรวจสอบและ adapt ให้ตรงบริบทคนไข้ก่อนใช้จริงทุกครั้ง
      </p>
    </div>
  );
}
