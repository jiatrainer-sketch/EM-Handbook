import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, UserRound, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listCases, createCase, deleteCase } from '@/lib/caseManager';
import { useActiveCase } from '@/hooks/useActiveCase';
import type { PatientCase, Sex } from '@/types/case';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function caseLabel(c: PatientCase): string {
  const parts: string[] = [];
  if (c.age) parts.push(`${c.age} ปี`);
  if (c.sex && c.sex !== 'unknown') parts.push(c.sex === 'M' ? 'ชาย' : 'หญิง');
  if (c.weight) parts.push(`${c.weight} kg`);
  return parts.join(' · ');
}

type NewCaseForm = {
  name: string;
  age: string;
  sex: Sex;
  weight: string;
  chiefComplaint: string;
  egfr: string;
  onDialysis: boolean;
  comorbidities: string;
};

const EMPTY_FORM: NewCaseForm = {
  name: '',
  age: '',
  sex: 'unknown',
  weight: '',
  chiefComplaint: '',
  egfr: '',
  onDialysis: false,
  comorbidities: '',
};

export default function Cases() {
  // Reactive via useActiveCase's subscription to the cases store — any mutation
  // (createCase/deleteCase/...) re-renders this component automatically.
  const cases = listCases();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewCaseForm>(EMPTY_FORM);
  const { activeId, setActive } = useActiveCase();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const c = createCase({
      name: form.name.trim(),
      age: form.age ? Number(form.age) : undefined,
      sex: form.sex,
      weight: form.weight ? Number(form.weight) : undefined,
      chiefComplaint: form.chiefComplaint.trim() || undefined,
      renal: form.egfr || form.onDialysis ? {
        egfr: form.egfr ? Number(form.egfr) : undefined,
        onDialysis: form.onDialysis || undefined,
      } : undefined,
      comorbidities: form.comorbidities.trim()
        ? form.comorbidities.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
    });
    setActive(c.id);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteCase(id);
    if (activeId === id) setActive(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cases</h1>
          <p className="text-sm text-muted-foreground">บันทึกข้อมูลคนไข้ — ช่วย Dr. AI แนะนำ dose ที่ตรงบริบท</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} className="mr-1" /> เพิ่มเคส
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-lg border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold">เคสใหม่</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2 block text-xs">
              <span className="mb-1 block text-muted-foreground">ชื่อ / HN (ห้ามใส่ข้อมูลที่ระบุตัวตน) *</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="เช่น HN001, Pt A"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">อายุ</span>
              <input
                type="number"
                min={0}
                max={120}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="ปี"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">เพศ</span>
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value as Sex })}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              >
                <option value="unknown">ไม่ระบุ</option>
                <option value="M">ชาย (M)</option>
                <option value="F">หญิง (F)</option>
              </select>
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">น้ำหนัก (kg)</span>
              <input
                type="number"
                min={1}
                max={300}
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="kg"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">eGFR (mL/min/1.73m²)</span>
              <input
                type="number"
                min={0}
                value={form.egfr}
                onChange={(e) => setForm({ ...form, egfr: e.target.value })}
                placeholder="ถ้าทราบ"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="col-span-2 block text-xs">
              <span className="mb-1 block text-muted-foreground">Chief complaint / สาเหตุที่มา</span>
              <input
                type="text"
                value={form.chiefComplaint}
                onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })}
                placeholder="เช่น Sepsis, DKA, Chest pain"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="col-span-2 block text-xs">
              <span className="mb-1 block text-muted-foreground">Comorbidities (คั่นด้วยลูกน้ำ)</span>
              <input
                type="text"
                value={form.comorbidities}
                onChange={(e) => setForm({ ...form, comorbidities: e.target.value })}
                placeholder="เช่น DM, CKD G3, HF"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="col-span-2 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={form.onDialysis}
                onChange={(e) => setForm({ ...form, onDialysis: e.target.checked })}
                className="rounded"
              />
              <span className="text-muted-foreground">ผู้ป่วย Dialysis (HD/PD)</span>
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">บันทึกและเปิดใช้งาน</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
              ยกเลิก
            </Button>
          </div>
        </form>
      )}

      {cases.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          ยังไม่มีเคส — กดปุ่ม "เพิ่มเคส" เพื่อเริ่มต้น
        </div>
      ) : (
        <ul className="divide-y rounded-lg border bg-card text-sm">
          {cases.map((c) => (
            <li
              key={c.id}
              className={`flex items-center gap-3 px-3 py-3 ${activeId === c.id ? 'bg-blue-50 dark:bg-blue-950/30' : ''}`}
            >
              <button
                onClick={() => setActive(activeId === c.id ? null : c.id)}
                className="shrink-0"
                aria-label={activeId === c.id ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
              >
                <UserRound size={16} className={activeId === c.id ? 'text-blue-500' : 'text-muted-foreground'} />
              </button>
              <Link to={`/cases/${c.id}`} className="flex-1 min-w-0 hover:opacity-80">
                <div className="font-medium truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">{caseLabel(c)}{c.chiefComplaint ? ` · ${c.chiefComplaint}` : ''}</div>
                <div className="text-[10px] text-muted-foreground/70">{formatDate(c.updatedAt)}</div>
              </Link>
              {activeId === c.id && (
                <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 shrink-0">ใช้งานอยู่</span>
              )}
              <ChevronRight size={14} className="shrink-0 text-muted-foreground" />
              <button
                onClick={(e) => handleDelete(c.id, e)}
                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="ลบเคส"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
        🔒 ข้อมูลเก็บใน browser เท่านั้น — ไม่ส่งไปเซิร์ฟเวอร์ · อย่าใส่ชื่อจริงหรือข้อมูลระบุตัวตน
      </p>
    </div>
  );
}
