import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookmarkCheck,
  BookmarkPlus,
  FileText,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  StopCircle,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { streamChat, ChatError, type ChatMessage } from '@/lib/aiClient';
import { saveNote } from '@/lib/notes';
import {
  useCurrentContentContext,
  type ContentContext,
} from '@/hooks/useCurrentContentContext';
import { useActiveCase } from '@/hooks/useActiveCase';
import { useAiChat } from './AiChatProvider';
import { listCases, createCase, addToolSession } from '@/lib/caseManager';
import type { PatientCase, Sex } from '@/types/case';

// ─── Types ───────────────────────────────────────────────────────────────────

type SheetMode = 'selector' | 'resume' | 'general' | 'new-case';
type Role = 'user' | 'assistant';

type UserMessage = { id: string; role: 'user'; content: string };
type AssistantMessage = {
  id: string;
  role: 'assistant';
  content: string;
  streaming?: boolean;
  question: string;
  context?: { id: string; title: string };
};
type Message = UserMessage | AssistantMessage;

type NewCaseFormData = {
  name: string;
  age: string;
  sex: Sex;
  weight: string;
  chiefComplaint: string;
};

const EMPTY_NEW_CASE: NewCaseFormData = {
  name: '',
  age: '',
  sex: 'unknown',
  weight: '',
  chiefComplaint: '',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function buildCaseLabel(c: PatientCase): string {
  const parts: string[] = [c.name];
  if (c.age) parts.push(`${c.age}y`);
  if (c.sex && c.sex !== 'unknown') parts.push(c.sex);
  if (c.weight) parts.push(`${c.weight}kg`);
  if (c.renal?.egfr != null) parts.push(`eGFR ${c.renal.egfr}`);
  if (c.renal?.onDialysis) parts.push('dialysis');
  if (c.comorbidities?.length) parts.push(c.comorbidities.join(', '));
  if (c.chiefComplaint) parts.push(c.chiefComplaint);
  return parts.filter(Boolean).join(' · ');
}

function withContext(
  question: string,
  ctx: ContentContext | null,
  caseLabel?: string,
): string {
  const lines: string[] = [];
  if (caseLabel) lines.push(`[Active case: ${caseLabel}]`);
  if (ctx) {
    const titleTh = ctx.titleTh ? ` (${ctx.titleTh})` : '';
    lines.push(`[ผู้ใช้กำลังเปิดหน้า: ${ctx.title}${titleTh} · id=${ctx.id}]`);
  }
  return lines.length > 0 ? `${lines.join('\n')}\n\n${question}` : question;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AiChatSheet() {
  const { isOpen, close } = useAiChat();
  const context = useCurrentContentContext();
  const { activeCase, setActive } = useActiveCase();

  const [mode, setMode] = useState<SheetMode>('selector');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextEnabled, setContextEnabled] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [newCaseForm, setNewCaseForm] = useState<NewCaseFormData>(EMPTY_NEW_CASE);
  const [cases, setCases] = useState<PatientCase[]>(() => listCases());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // When sheet opens: always show the mode selector first.
  // User picks explicitly — avoids surprise context switches and makes all
  // three modes (resume / general / new) discoverable every session.
  useEffect(() => {
    if (isOpen) {
      setCases(listCases());
      setMode('selector');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-enable context chip on page change
  useEffect(() => {
    setContextEnabled(true);
  }, [context?.id]);

  // Auto-scroll as messages stream
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canSend = draft.trim().length > 0 && !isLoading;
  const activeContext = contextEnabled ? context : null;

  function switchMode(next: SheetMode) {
    if (isLoading) abortRef.current?.abort();
    if (next === 'selector') setCases(listCases());
    setMode(next);
    setMessages([]);
    setDraft('');
    setError(null);
    setSavedIds(new Set());
  }

  // ── Send ────────────────────────────────────────────────────────────────────

  const handleSend = useCallback(async () => {
    const prompt = draft.trim();
    if (!prompt || isLoading) return;

    const attachedCtx = contextEnabled && context ? context : null;
    const userMsg: UserMessage = { id: newId(), role: 'user', content: prompt };
    const streamingId = newId();
    const streamingMsg: AssistantMessage = {
      id: streamingId,
      role: 'assistant',
      content: '',
      streaming: true,
      question: prompt,
      context: attachedCtx ? { id: attachedCtx.id, title: attachedCtx.title } : undefined,
    };

    const nextHistory = [...messages, userMsg];
    setMessages([...nextHistory, streamingMsg]);
    setDraft('');
    setError(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const caseLabel =
      mode === 'resume' && activeCase ? buildCaseLabel(activeCase) : undefined;

    const apiMessages: ChatMessage[] = nextHistory.map((m, i, arr) =>
      i === arr.length - 1
        ? { role: 'user', content: withContext(prompt, attachedCtx, caseLabel) }
        : { role: m.role, content: m.content },
    );

    let accumulated = '';
    try {
      await streamChat(
        apiMessages,
        (acc) => {
          accumulated = acc;
          setMessages((prev) =>
            prev.map((m) => (m.id === streamingId ? { ...m, content: acc } : m)),
          );
        },
        { signal: controller.signal },
      );
      setMessages((prev) =>
        prev.map((m) => (m.id === streamingId ? { ...m, streaming: false } : m)),
      );
      // Auto-save to case in resume mode
      if (mode === 'resume' && activeCase && accumulated) {
        addToolSession(activeCase.id, {
          toolId: 'dr-ai',
          toolName: 'Dr. AI',
          summary: accumulated.slice(0, 120),
        });
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? { ...m, streaming: false, content: m.content || '(หยุด)' }
              : m,
          ),
        );
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== streamingId));
        setError(
          e instanceof ChatError
            ? e.message
            : e instanceof Error
              ? e.message
              : 'เกิดข้อผิดพลาด',
        );
      }
    } finally {
      abortRef.current = null;
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }, [context, contextEnabled, draft, isLoading, messages, mode, activeCase]);

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleClear() {
    if (isLoading) abortRef.current?.abort();
    setMessages([]);
    setDraft('');
    setError(null);
    setSavedIds(new Set());
    textareaRef.current?.focus();
  }

  const handleSaveNote = useCallback((msg: AssistantMessage) => {
    saveNote({
      question: msg.question,
      answer: msg.content,
      contextId: msg.context?.id,
      contextTitle: msg.context?.title,
    });
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.add(msg.id);
      return next;
    });
  }, []);

  function handleCreateCase(e: React.FormEvent) {
    e.preventDefault();
    if (!newCaseForm.name.trim()) return;
    const c = createCase({
      name: newCaseForm.name.trim(),
      age: newCaseForm.age ? Number(newCaseForm.age) : undefined,
      sex: newCaseForm.sex,
      weight: newCaseForm.weight ? Number(newCaseForm.weight) : undefined,
      chiefComplaint: newCaseForm.chiefComplaint.trim() || undefined,
    });
    setActive(c.id);
    setNewCaseForm(EMPTY_NEW_CASE);
    switchMode('resume');
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) {
          if (isLoading) abortRef.current?.abort();
          close();
        }
      }}
    >
      <SheetContent side="bottom" className="flex h-[85dvh] flex-col gap-0 p-0">
        {/* ── Selector ── */}
        {mode === 'selector' && (
          <SelectorView
            cases={cases}
            activeCase={activeCase}
            onResume={(id) => {
              setActive(id);
              switchMode('resume');
            }}
            onGeneral={() => switchMode('general')}
            onNewCase={() => switchMode('new-case')}
          />
        )}

        {/* ── New case form ── */}
        {mode === 'new-case' && (
          <NewCaseView
            form={newCaseForm}
            onChange={setNewCaseForm}
            onSubmit={handleCreateCase}
            onBack={() => switchMode('selector')}
          />
        )}

        {/* ── Chat (resume / general) ── */}
        {(mode === 'resume' || mode === 'general') && (
          <>
            <header className="flex items-center gap-2 border-b px-4 py-3">
              <button
                type="button"
                onClick={() => switchMode('selector')}
                className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent"
                aria-label="กลับ"
              >
                <ArrowLeft size={16} aria-hidden />
              </button>
              <Sparkles size={16} className="shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-sm leading-none">Dr. AI</SheetTitle>
                <SheetDescription className="mt-0.5 truncate text-xs">
                  {mode === 'resume' && activeCase
                    ? buildCaseLabel(activeCase)
                    : 'General — ไม่บันทึกในเคส'}
                </SheetDescription>
              </div>
              {mode === 'general' && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  ไม่บันทึก
                </span>
              )}
              {mode === 'resume' && activeCase && (
                <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                  บันทึกอัตโนมัติ
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={messages.length === 0 && !draft && !error}
                aria-label="ล้างการสนทนา"
              >
                <Trash2 size={16} aria-hidden />
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {messages.length === 0 ? (
                <EmptyState mode={mode} activeCase={activeCase} />
              ) : (
                <>
                  <ul className="space-y-3">
                    {messages.map((m) => (
                      <li key={m.id}>
                        {m.role === 'assistant' ? (
                          m.streaming && m.content === '' ? (
                            <ThinkingBubble />
                          ) : (
                            <AssistantRow
                              message={m}
                              saved={savedIds.has(m.id)}
                              onSave={mode === 'general' ? () => handleSaveNote(m) : undefined}
                              streaming={m.streaming}
                              autoSaved={mode === 'resume' && !m.streaming}
                            />
                          )
                        ) : (
                          <MessageBubble role="user" content={m.content} />
                        )}
                      </li>
                    ))}
                    {error && (
                      <li>
                        <ErrorBubble text={error} />
                      </li>
                    )}
                  </ul>
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            <div className="border-t bg-background/95 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
              {activeContext && (
                <ContextChip
                  context={activeContext}
                  onRemove={() => setContextEnabled(false)}
                />
              )}
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="พิมพ์คำถาม… (Cmd+Enter เพื่อส่ง)"
                  rows={2}
                  disabled={isLoading}
                  className="max-h-40 min-h-[44px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-70"
                />
                {isLoading ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleStop}
                    className="h-11"
                    aria-label="หยุด"
                  >
                    <StopCircle size={16} aria-hidden />
                    <span className="ml-1.5 hidden sm:inline">หยุด</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void handleSend()}
                    disabled={!canSend}
                    className="h-11"
                    aria-label="ส่งคำถาม"
                  >
                    <Send size={16} aria-hidden />
                    <span className="ml-1.5 hidden sm:inline">ส่ง</span>
                  </Button>
                )}
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Enter = ขึ้นบรรทัดใหม่ · Cmd/Ctrl+Enter = ส่ง
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Selector view ────────────────────────────────────────────────────────────

function SelectorView({
  cases,
  activeCase,
  onResume,
  onGeneral,
  onNewCase,
}: {
  cases: PatientCase[];
  activeCase: PatientCase | null;
  onResume: (id: string) => void;
  onGeneral: () => void;
  onNewCase: () => void;
}) {
  const otherCases = cases.filter((c) => c.id !== activeCase?.id).slice(0, 3);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <Sparkles size={18} className="text-primary" aria-hidden />
        <div className="flex-1">
          <SheetTitle className="text-base">Dr. AI</SheetTitle>
          <SheetDescription className="text-xs">เลือกโหมดการสนทนา</SheetDescription>
        </div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {/* Active case — shown prominently */}
        {activeCase && (
          <button
            type="button"
            onClick={() => onResume(activeCase.id)}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-blue-300 bg-blue-50 px-4 py-3 text-left hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900"
          >
            <UserRound size={20} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-blue-800 dark:text-blue-200">
                ▶ {activeCase.name}
              </div>
              <div className="truncate text-[11px] text-blue-600/80 dark:text-blue-400/80">
                {[
                  activeCase.age ? `${activeCase.age}y` : '',
                  activeCase.sex && activeCase.sex !== 'unknown' ? activeCase.sex : '',
                  activeCase.chiefComplaint ?? '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              ใช้งานอยู่
            </span>
          </button>
        )}

        {/* Other recent cases */}
        {otherCases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onResume(c.id)}
            className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left hover:bg-accent"
          >
            <UserRound size={16} className="shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{c.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {[
                  c.age ? `${c.age}y` : '',
                  c.sex && c.sex !== 'unknown' ? c.sex : '',
                  c.chiefComplaint ?? '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </div>
          </button>
        ))}

        <div className={cn('space-y-2', cases.length > 0 && 'border-t pt-2')}>
          {/* General chat */}
          <button
            type="button"
            onClick={onGeneral}
            className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left hover:bg-accent"
          >
            <MessageCircle size={16} className="shrink-0 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">General chat</div>
              <div className="text-[11px] text-muted-foreground">ถามทั่วไป — ไม่บันทึกในเคส</div>
            </div>
          </button>

          {/* New case */}
          <button
            type="button"
            onClick={onNewCase}
            className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left hover:bg-accent"
          >
            <Plus size={16} className="shrink-0 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">เพิ่มเคสใหม่</div>
              <div className="text-[11px] text-muted-foreground">
                บันทึกข้อมูลคนไข้ก่อนเริ่มถาม
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New case form view ───────────────────────────────────────────────────────

function NewCaseView({
  form,
  onChange,
  onSubmit,
  onBack,
}: {
  form: NewCaseFormData;
  onChange: (f: NewCaseFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent"
          aria-label="กลับ"
        >
          <ArrowLeft size={16} aria-hidden />
        </button>
        <div className="flex-1">
          <SheetTitle className="text-base">เคสใหม่</SheetTitle>
          <SheetDescription className="text-xs">สร้างเคสก่อนเริ่มถาม Dr. AI</SheetDescription>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">ชื่อ / HN *</span>
            <input
              type="text"
              required
              autoFocus
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              placeholder="เช่น HN001, Pt A"
              className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">อายุ</span>
              <input
                type="number"
                min={0}
                max={120}
                value={form.age}
                onChange={(e) => onChange({ ...form, age: e.target.value })}
                placeholder="ปี"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">เพศ</span>
              <select
                value={form.sex}
                onChange={(e) => onChange({ ...form, sex: e.target.value as Sex })}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              >
                <option value="unknown">-</option>
                <option value="M">ชาย</option>
                <option value="F">หญิง</option>
              </select>
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">น้ำหนัก</span>
              <input
                type="number"
                min={1}
                max={300}
                value={form.weight}
                onChange={(e) => onChange({ ...form, weight: e.target.value })}
                placeholder="kg"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
          </div>

          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Chief complaint</span>
            <input
              type="text"
              value={form.chiefComplaint}
              onChange={(e) => onChange({ ...form, chiefComplaint: e.target.value })}
              placeholder="เช่น Sepsis, DKA"
              className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </label>

          <p className="text-[11px] text-muted-foreground">
            🔒 เก็บใน browser เท่านั้น · อย่าใส่ชื่อจริง
          </p>

          <Button type="submit" size="sm" className="w-full">
            สร้างเคสและเริ่มถาม
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContextChip({
  context,
  onRemove,
}: {
  context: ContentContext;
  onRemove: () => void;
}) {
  const label = context.titleTh ?? context.title;
  return (
    <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 py-1 pl-2.5 pr-1 text-xs text-primary">
      <FileText size={12} aria-hidden />
      <span className="truncate">อ้างอิง: {label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="เอา context ออก"
        className="ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:bg-primary/20"
      >
        <X size={12} aria-hidden />
      </button>
    </div>
  );
}

function AssistantRow({
  message,
  saved,
  onSave,
  streaming,
  autoSaved,
}: {
  message: AssistantMessage;
  saved: boolean;
  onSave?: () => void;
  streaming?: boolean;
  autoSaved?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <MessageBubble role="assistant" content={message.content} streaming={streaming} />
      {!streaming && autoSaved && (
        <span className="ml-1 inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
          <BookmarkCheck size={12} aria-hidden />
          บันทึกในเคสแล้ว
        </span>
      )}
      {!streaming && onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className={cn(
            'ml-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] transition-colors',
            saved
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
          aria-label={saved ? 'บันทึกแล้ว' : 'บันทึกคำตอบ'}
        >
          {saved ? (
            <>
              <BookmarkCheck size={12} aria-hidden />
              <span>บันทึกแล้ว</span>
            </>
          ) : (
            <>
              <BookmarkPlus size={12} aria-hidden />
              <span>บันทึกคำตอบ</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

function EmptyState({
  mode,
  activeCase,
}: {
  mode: 'resume' | 'general';
  activeCase: PatientCase | null;
}) {
  if (mode === 'resume' && activeCase) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <UserRound size={28} aria-hidden className="text-blue-400/60" />
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {activeCase.name}
        </p>
        <p className="max-w-[28ch] text-xs text-muted-foreground">
          ถาม dosing, อ่านผล lab, adjust ยา หรืออะไรก็ได้เกี่ยวกับเคสนี้
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
      <Sparkles size={24} aria-hidden className="text-primary/60" />
      <p className="max-w-[28ch]">
        ถามเรื่อง dosing, protocol, renal adjust, หรือ workup ก็ได้
      </p>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: Role;
  content: string;
  streaming?: boolean;
}) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border bg-card text-card-foreground',
        )}
      >
        {content}
        {streaming && (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse rounded-sm bg-current opacity-70"
          />
        )}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-1.5 rounded-2xl border bg-card px-3 py-2 text-sm text-muted-foreground">
        <span className="inline-flex gap-0.5" aria-hidden>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:240ms]" />
        </span>
        <span>กำลังคิด…</span>
      </div>
    </div>
  );
}

function ErrorBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start">
      <div className="inline-flex max-w-[85%] items-start gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}
