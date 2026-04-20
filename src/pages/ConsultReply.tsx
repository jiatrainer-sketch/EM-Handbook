import { useEffect, useMemo, useState } from 'react';
import { Copy, Save, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AITreatmentPanel from '@/components/AITreatmentPanel';

type Specialty =
  | 'Cardiology'
  | 'Neurology'
  | 'Surgery'
  | 'OB-GYN'
  | 'Pediatrics'
  | 'ICU'
  | 'Orthopedics'
  | 'Psychiatry'
  | 'Other';

const SPECIALTIES: Specialty[] = [
  'Cardiology',
  'Neurology',
  'Surgery',
  'OB-GYN',
  'Pediatrics',
  'ICU',
  'Orthopedics',
  'Psychiatry',
  'Other',
];

type FormState = {
  specialty: Specialty;
  specialtyOther: string;
  ward: string;
  cc: string;
  hpi: string;
  pmh: string;
  bp: string;
  hr: string;
  rr: string;
  spo2: string;
  temp: string;
  peGeneral: string;
  peHeent: string;
  peCvs: string;
  peRs: string;
  peAbd: string;
  peNeuro: string;
  peSkin: string;
  labs: string;
  imaging: string;
  assessment: string;
  question: string;
  currentMgmt: string;
  action: 'bedside' | 'phone' | 'admit' | '';
};

type TemplateEntry = {
  ts: number;
  name: string;
  form: FormState;
};

const TEMPLATE_KEY = 'em:consult-templates';
const TEMPLATE_MAX = 3;

const DEFAULT_FORM: FormState = {
  specialty: 'Cardiology',
  specialtyOther: '',
  ward: 'ER',
  cc: '',
  hpi: '',
  pmh: '',
  bp: '',
  hr: '',
  rr: '',
  spo2: '',
  temp: '',
  peGeneral: '',
  peHeent: '',
  peCvs: '',
  peRs: '',
  peAbd: '',
  peNeuro: '',
  peSkin: '',
  labs: '',
  imaging: '',
  assessment: '',
  question: '',
  currentMgmt: '',
  action: '',
};

type TabKey = 'form' | 'preview';

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

function loadTemplates(): TemplateEntry[] {
  try {
    const raw = localStorage.getItem(TEMPLATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is TemplateEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as TemplateEntry).ts === 'number' &&
        typeof (e as TemplateEntry).name === 'string',
    );
  } catch {
    return [];
  }
}

function saveTemplate(name: string, form: FormState) {
  const prev = loadTemplates();
  const next = [{ ts: Date.now(), name, form }, ...prev].slice(0, TEMPLATE_MAX);
  try {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function joinNonEmpty(parts: string[], sep = ' | '): string {
  return parts.filter((p) => p.trim().length > 0).join(sep);
}

function buildReply(f: FormState): string {
  const lines: string[] = [];
  const specialty = f.specialty === 'Other' ? f.specialtyOther || 'Other' : f.specialty;
  const now = new Date();
  const dateStr = now.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  lines.push(`Consult ${specialty}`);
  lines.push(`Date: ${dateStr}`);
  lines.push(`Ward/ER: ${f.ward || 'ER'}`);
  lines.push('');

  // SUBJECTIVE
  if (f.cc || f.hpi || f.pmh) {
    lines.push('===== SUBJECTIVE =====');
    if (f.cc) lines.push(`CC: ${f.cc}`);
    if (f.hpi) {
      lines.push('HPI:');
      lines.push(f.hpi);
    }
    if (f.pmh) lines.push(`PMH: ${f.pmh}`);
    lines.push('');
  }

  // OBJECTIVE
  const vitalsParts: string[] = [];
  if (f.bp) vitalsParts.push(`BP ${f.bp} mmHg`);
  if (f.hr) vitalsParts.push(`HR ${f.hr}/min`);
  if (f.rr) vitalsParts.push(`RR ${f.rr}/min`);
  if (f.spo2) vitalsParts.push(`SpO2 ${f.spo2}%`);
  if (f.temp) vitalsParts.push(`T ${f.temp}°C`);

  const peParts = [
    f.peGeneral ? `General: ${f.peGeneral}` : '',
    f.peHeent ? `HEENT: ${f.peHeent}` : '',
    f.peCvs ? `CVS: ${f.peCvs}` : '',
    f.peRs ? `RS: ${f.peRs}` : '',
    f.peAbd ? `Abd: ${f.peAbd}` : '',
    f.peNeuro ? `Neuro: ${f.peNeuro}` : '',
    f.peSkin ? `Ext/Skin: ${f.peSkin}` : '',
  ].filter((p) => p.length > 0);

  const hasObjective = vitalsParts.length > 0 || peParts.length > 0 || f.labs || f.imaging;
  if (hasObjective) {
    lines.push('===== OBJECTIVE =====');
    if (vitalsParts.length > 0) {
      lines.push('Vital Signs:');
      lines.push(joinNonEmpty(vitalsParts, ' | '));
    }
    if (peParts.length > 0) {
      lines.push('PE:');
      peParts.forEach((p) => lines.push(p));
    }
    if (f.labs) {
      lines.push('Labs:');
      lines.push(f.labs);
    }
    if (f.imaging) {
      lines.push('Imaging:');
      lines.push(f.imaging);
    }
    lines.push('');
  }

  // ASSESSMENT
  if (f.assessment) {
    lines.push('===== ASSESSMENT =====');
    lines.push(f.assessment);
    lines.push('');
  }

  // PLAN / QUESTION
  if (f.question || f.currentMgmt || f.action) {
    lines.push('===== PLAN / QUESTION =====');
    if (f.question) {
      lines.push(`Question for ${specialty}:`);
      lines.push(f.question);
      lines.push('');
    }
    if (f.currentMgmt) {
      lines.push('Current management:');
      lines.push(f.currentMgmt);
      lines.push('');
    }
    if (f.action) {
      lines.push('Requested action:');
      lines.push(
        `${f.action === 'bedside' ? '☑' : '☐'} ขอ consult bedside`,
      );
      lines.push(
        `${f.action === 'phone' ? '☑' : '☐'} ขอคำแนะนำทางโทรศัพท์`,
      );
      lines.push(
        `${f.action === 'admit' ? '☑' : '☐'} ขอ admit/transfer`,
      );
      lines.push('');
    }
  }

  lines.push('Thank you.');
  lines.push('Physician: ____________________');
  lines.push('Contact: ext / phone ____________________');

  return lines.join('\n').trim();
}

export default function ConsultReply() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [toast, setToast] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateEntry[]>([]);
  const [tab, setTab] = useState<TabKey>('form');

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const reply = useMemo(() => buildReply(form), [form]);

  const ccOk = form.cc.trim().length > 0;
  const hpiOk = form.hpi.trim().length >= 10;
  const questionOk = form.question.trim().length > 0;
  const canCopy = ccOk && hpiOk && questionOk;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCopy() {
    if (!canCopy) {
      setToast('กรอก CC, HPI (≥ 10 ตัวอักษร), Question ก่อน');
      setTimeout(() => setToast(null), 2200);
      return;
    }
    const clean = reply.replace(/^={3,}.*?={3,}$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
    try {
      await navigator.clipboard.writeText(clean);
      setToast('คัดลอกแล้ว');
      setTimeout(() => setToast(null), 1800);
    } catch {
      setToast('คัดลอกไม่สำเร็จ');
      setTimeout(() => setToast(null), 1800);
    }
  }

  function handleSaveTemplate() {
    const name = window.prompt('ตั้งชื่อ template:', `${form.specialty} ${formatTs(Date.now())}`);
    if (!name) return;
    saveTemplate(name, form);
    setTemplates(loadTemplates());
    setToast('บันทึก template แล้ว');
    setTimeout(() => setToast(null), 1800);
  }

  function handleLoadTemplate(entry: TemplateEntry) {
    setForm(entry.form);
    setToast('โหลด template แล้ว');
    setTimeout(() => setToast(null), 1500);
  }

  function handleReset() {
    if (window.confirm('ล้างฟอร์มทั้งหมด?')) {
      setForm(DEFAULT_FORM);
    }
  }

  function handleClearTemplates() {
    if (!window.confirm('ลบ template ทั้งหมด?')) return;
    try {
      localStorage.removeItem(TEMPLATE_KEY);
    } catch {
      // ignore
    }
    setTemplates([]);
  }

  return (
    <div className="space-y-4 pb-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Consult Reply Generator</h1>
        <p className="text-sm text-muted-foreground">
          ร่าง consult reply แบบโครงสร้าง SOAP — คัดลอกแล้วส่งต่อได้ทันที
        </p>
      </header>

      {/* Mobile tabs */}
      <div className="flex gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => setTab('form')}
          className={cn(
            'flex-1 rounded-md border px-3 py-2 text-sm font-medium',
            tab === 'form' ? 'border-primary bg-primary text-primary-foreground' : 'bg-background',
          )}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={cn(
            'flex-1 rounded-md border px-3 py-2 text-sm font-medium',
            tab === 'preview' ? 'border-primary bg-primary text-primary-foreground' : 'bg-background',
          )}
        >
          Preview
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* FORM COLUMN */}
        <div className={cn('space-y-4', tab === 'preview' && 'hidden sm:block')}>
          {/* Templates */}
          {templates.length > 0 && (
            <section className="rounded-lg border bg-muted/30 p-3 text-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">Templates ({templates.length})</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={handleClearTemplates}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  ล้าง
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {templates.map((t) => (
                  <button
                    key={t.ts}
                    type="button"
                    onClick={() => handleLoadTemplate(t)}
                    className="rounded-full border bg-background px-2 py-1 text-xs hover:bg-accent"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </section>
          )}

          <Section title="Specialty + Ward">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.specialty}
                onChange={(e) => update('specialty', e.target.value as Specialty)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={form.ward}
                onChange={(e) => update('ward', e.target.value)}
                placeholder="Ward/ER"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            {form.specialty === 'Other' && (
              <input
                type="text"
                value={form.specialtyOther}
                onChange={(e) => update('specialtyOther', e.target.value)}
                placeholder="ระบุ specialty"
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            )}
          </Section>

          <Section title="Subjective">
            <Field
              label="CC (Chief complaint)"
              required
              valid={ccOk}
            >
              <input
                type="text"
                value={form.cc}
                onChange={(e) => update('cc', e.target.value)}
                placeholder="เช่น ไข้ 3 วัน ร่วมกับเจ็บหน้าอก"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field
              label="HPI (History of present illness)"
              required
              valid={hpiOk}
              hint="อย่างน้อย 10 ตัวอักษร"
            >
              <textarea
                value={form.hpi}
                onChange={(e) => update('hpi', e.target.value)}
                rows={4}
                placeholder="Narrative ภาษาไทย + English terms ได้"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="PMH (ไม่บังคับ)">
              <input
                type="text"
                value={form.pmh}
                onChange={(e) => update('pmh', e.target.value)}
                placeholder="เช่น HT, DM, CAD s/p PCI"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>
          </Section>

          <Section title="Vital Signs">
            <div className="grid grid-cols-5 gap-2">
              {(
                [
                  { k: 'bp', p: 'BP' },
                  { k: 'hr', p: 'HR' },
                  { k: 'rr', p: 'RR' },
                  { k: 'spo2', p: 'SpO₂' },
                  { k: 'temp', p: 'T' },
                ] as const
              ).map(({ k, p }) => (
                <input
                  key={k}
                  type="text"
                  value={form[k] as string}
                  onChange={(e) => update(k, e.target.value)}
                  placeholder={p}
                  className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                />
              ))}
            </div>
          </Section>

          <Section title="PE (เว้นว่างถ้าปกติ/ไม่เกี่ยว)">
            <PeRow label="General" value={form.peGeneral} onChange={(v) => update('peGeneral', v)} placeholder="alert, oriented, NAD" />
            <PeRow label="HEENT" value={form.peHeent} onChange={(v) => update('peHeent', v)} />
            <PeRow label="CVS" value={form.peCvs} onChange={(v) => update('peCvs', v)} placeholder="normal S1 S2, no murmur" />
            <PeRow label="RS" value={form.peRs} onChange={(v) => update('peRs', v)} placeholder="clear bilateral" />
            <PeRow label="Abd" value={form.peAbd} onChange={(v) => update('peAbd', v)} placeholder="soft, non-tender" />
            <PeRow label="Neuro" value={form.peNeuro} onChange={(v) => update('peNeuro', v)} placeholder="grossly intact, GCS 15" />
            <PeRow label="Ext/Skin" value={form.peSkin} onChange={(v) => update('peSkin', v)} />
          </Section>

          <Section title="Investigations">
            <Field label="Labs">
              <textarea
                value={form.labs}
                onChange={(e) => update('labs', e.target.value)}
                rows={3}
                placeholder="CBC: Hb 12, WBC 14k, Plt 200k..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Imaging">
              <textarea
                value={form.imaging}
                onChange={(e) => update('imaging', e.target.value)}
                rows={2}
                placeholder="CXR: ..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>
          </Section>

          <Section title="Assessment">
            <textarea
              value={form.assessment}
              onChange={(e) => update('assessment', e.target.value)}
              rows={2}
              placeholder="Primary diagnosis / differential"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </Section>

          <Section title="Plan / Question">
            <Field
              label="Question for specialist"
              required
              valid={questionOk}
            >
              <textarea
                value={form.question}
                onChange={(e) => update('question', e.target.value)}
                rows={3}
                placeholder="เช่น ขอความเห็น management ต่อ / ขอรับเคส admit"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Current management">
              <textarea
                value={form.currentMgmt}
                onChange={(e) => update('currentMgmt', e.target.value)}
                rows={2}
                placeholder="สิ่งที่ทำไปแล้ว"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Requested action">
              <div className="space-y-1.5 text-sm">
                {(
                  [
                    { k: 'bedside', label: 'ขอ consult bedside' },
                    { k: 'phone', label: 'ขอคำแนะนำทางโทรศัพท์' },
                    { k: 'admit', label: 'ขอ admit/transfer' },
                  ] as const
                ).map(({ k, label }) => (
                  <label key={k} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="action"
                      checked={form.action === k}
                      onChange={() => update('action', k)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
                {form.action && (
                  <button
                    type="button"
                    onClick={() => update('action', '')}
                    className="text-xs text-muted-foreground underline"
                  >
                    ล้างการเลือก
                  </button>
                )}
              </div>
            </Field>
          </Section>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleSaveTemplate}>
              <Save className="mr-2 h-4 w-4" />
              Save template
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear form
            </Button>
          </div>
        </div>

        {/* PREVIEW COLUMN */}
        <div
          className={cn(
            'space-y-3 sm:sticky sm:top-16 sm:self-start',
            tab === 'form' && 'hidden sm:block',
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Preview (SOAP)</h2>
            <Button size="sm" onClick={handleCopy} disabled={!canCopy}>
              <Copy className="mr-2 h-4 w-4" />
              คัดลอก
            </Button>
          </div>
          <pre className="h-[36rem] w-full overflow-auto whitespace-pre-wrap rounded-md border bg-muted/40 p-3 font-mono text-xs">
            {reply}
          </pre>
          {!canCopy && (
            <p className="text-xs text-muted-foreground">
              ⚠️ กรอก <strong>CC + HPI (≥ 10 chars) + Question</strong> ก่อน copy
            </p>
          )}
        </div>
      </div>

      <AITreatmentPanel
        tool="consult"
        getInput={() => ({
          data: {
            Specialty: form.specialty === 'Other' ? form.specialtyOther : form.specialty,
            Ward: form.ward || undefined,
            CC: form.cc || undefined,
            HPI: form.hpi || undefined,
            PMH: form.pmh || undefined,
            Vitals:
              [form.bp && `BP ${form.bp}`, form.hr && `HR ${form.hr}`, form.rr && `RR ${form.rr}`, form.spo2 && `SpO₂ ${form.spo2}`, form.temp && `T ${form.temp}`]
                .filter(Boolean)
                .join(', ') || undefined,
            Labs: form.labs || undefined,
            Imaging: form.imaging || undefined,
            Assessment: form.assessment || undefined,
            Question: form.question || undefined,
            'Current Mgmt': form.currentMgmt || undefined,
            Action: form.action || undefined,
          },
          bw: 60,
        })}
      />

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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-lg border bg-card p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  required,
  valid,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  valid?: boolean;
  hint?: string;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-xs text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
        {required && valid === false && (
          <span className="ml-2 text-[11px] text-destructive">
            (required)
          </span>
        )}
        {hint && <span className="ml-2 text-[11px] text-muted-foreground">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function PeRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-16 shrink-0 text-xs text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
