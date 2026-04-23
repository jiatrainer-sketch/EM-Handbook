import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Edit2, Trash2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCase, deleteCase, updateCase } from '@/lib/caseManager';
import { useActiveCase } from '@/hooks/useActiveCase';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeId, setActive } = useActiveCase();
  // Derived from the reactive store — `updateCase` triggers a re-render via
  // useActiveCase's subscription, so we always read the fresh case.
  const caseData = id ? getCase(id) : undefined;
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(caseData?.name ?? '');

  if (!caseData) {
    return (
      <div className="space-y-4">
        <Link to="/cases" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> กลับ
        </Link>
        <p className="text-sm text-muted-foreground">ไม่พบเคส</p>
      </div>
    );
  }

  function saveName() {
    if (!id || !nameInput.trim()) return;
    updateCase(id, { name: nameInput.trim() });
    setEditName(false);
  }

  function handleDelete() {
    if (!id) return;
    deleteCase(id);
    if (activeId === id) setActive(null);
    navigate('/cases');
  }

  const isActive = activeId === caseData.id;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link to="/cases" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Cases
        </Link>
      </div>

      {/* Case header */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-full p-2 ${isActive ? 'bg-blue-100 dark:bg-blue-900' : 'bg-muted'}`}>
            <UserRound size={16} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'} />
          </div>
          <div className="flex-1 min-w-0">
            {editName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="flex-1 rounded-md border bg-background px-2 py-1 text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={saveName}>บันทึก</Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditName(false); setNameInput(caseData.name); }}>ยกเลิก</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{caseData.name}</h1>
                <button onClick={() => setEditName(true)} className="rounded p-1 hover:bg-accent text-muted-foreground">
                  <Edit2 size={12} />
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {[
                caseData.age ? `${caseData.age} ปี` : '',
                caseData.sex === 'M' ? 'ชาย' : caseData.sex === 'F' ? 'หญิง' : '',
                caseData.weight ? `${caseData.weight} kg` : '',
              ].filter(Boolean).join(' · ')}
            </p>
            {caseData.chiefComplaint && (
              <p className="mt-1 text-xs text-muted-foreground">{caseData.chiefComplaint}</p>
            )}
          </div>
        </div>

        {(caseData.renal || caseData.comorbidities?.length) && (
          <div className="border-t pt-3 space-y-1 text-xs">
            {caseData.renal?.egfr != null && (
              <p><span className="text-muted-foreground">eGFR:</span> {caseData.renal.egfr} mL/min/1.73m²</p>
            )}
            {caseData.renal?.onDialysis && (
              <p className="text-amber-700 dark:text-amber-400">🔴 Dialysis patient — dose accordingly</p>
            )}
            {caseData.renal?.ckdStage && (
              <p><span className="text-muted-foreground">CKD:</span> {caseData.renal.ckdStage}</p>
            )}
            {caseData.comorbidities?.length ? (
              <p><span className="text-muted-foreground">Comorbidities:</span> {caseData.comorbidities.join(', ')}</p>
            ) : null}
          </div>
        )}

        <div className="flex gap-2 border-t pt-3">
          <Button
            size="sm"
            variant={isActive ? 'outline' : 'default'}
            onClick={() => setActive(isActive ? null : caseData.id)}
          >
            {isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 size={13} className="mr-1" /> ลบเคส
          </Button>
        </div>
      </div>

      {/* Tool sessions */}
      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <Clock size={13} /> ประวัติการใช้ Tools
        </h2>
        {caseData.toolSessions.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
            ยังไม่มี — กด 🔖 ใน Dr. AI panel เพื่อบันทึก
          </div>
        ) : (
          <ul className="divide-y rounded-lg border bg-card text-sm">
            {caseData.toolSessions.map((s, i) => (
              <li key={i} className="px-3 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs">{s.toolName}</span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(s.timestamp)}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">{s.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-[11px] text-muted-foreground">
        สร้าง: {formatDate(caseData.createdAt)} · อัปเดต: {formatDate(caseData.updatedAt)}
      </p>
    </div>
  );
}
