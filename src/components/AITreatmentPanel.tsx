import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark, BookmarkCheck, Bot, ChevronDown, ChevronUp, Copy, MessageCircle, RefreshCw, Send, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buildToolPrompt } from '@/lib/aiSuggestions/prompts';
import { ChatError, streamChat, type ChatMessage } from '@/lib/aiClient';
import { useActiveCase } from '@/hooks/useActiveCase';
import { addToolSession, createCase } from '@/lib/caseManager';
import CaseSelector from './CaseSelector';
import type { AIToolInput } from '@/lib/aiSuggestions/types';
import type { PatientCase } from '@/types/case';

const TOOL_NAMES: Record<string, string> = {
  abg: 'ABG Analyzer', vent: 'Ventilator', preop: 'Pre-op Helper',
  consult: 'Consult Reply', nihss: 'NIHSS', 'dose-calc': 'Drug Dose Calc',
  electrolyte: 'Electrolyte Calc', gcs: 'GCS', crcl: 'CrCl/eGFR',
  'sepsis-timer': 'Sepsis Bundle', fluid: 'Fluid Calc',
  'heart-pathway': 'HEART Pathway', anticoag: 'Anticoag Manager',
  'shock-index': 'Shock Index', 'sedation-helper': 'Sedation Helper',
};

interface Props {
  tool: string;
  getInput: () => Omit<AIToolInput, 'tool'>;
  className?: string;
}

type Status = 'idle' | 'loading' | 'followup-loading' | 'done' | 'error';

type Turn = { role: 'user' | 'assistant'; content: string };

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeLines = [];
      } else {
        inCode = false;
        elements.push(
          <pre key={key++} className="my-2 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>,
        );
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <div key={key++} className="mt-3 mb-1 text-sm font-semibold text-foreground">{line.slice(4)}</div>,
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <div key={key++} className="mt-3 mb-1 text-base font-bold text-foreground">{line.slice(3)}</div>,
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <div key={key++} className="mt-2 text-sm font-semibold">{line.slice(2, -2)}</div>,
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={key++} className="flex gap-1.5 text-xs leading-relaxed">
          <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
          <span>{formatInline(line.slice(2))}</span>
        </div>,
      );
    } else if (line.match(/^---+$/)) {
      elements.push(<hr key={key++} className="my-2 border-border" />);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-1" />);
    } else {
      elements.push(
        <div key={key++} className="text-xs leading-relaxed">{formatInline(line)}</div>,
      );
    }
  }

  if (inCode && codeLines.length > 0) {
    elements.push(
      <pre key={key++} className="my-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
        <code>{codeLines.join('\n')}</code>
      </pre>,
    );
  }

  return elements;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
}

function caseContextLines(c: PatientCase): Record<string, string | number | null | undefined> {
  const extra: Record<string, string | number | null | undefined> = {};
  if (c.age) extra['Case: Age'] = `${c.age} ปี`;
  if (c.sex && c.sex !== 'unknown') extra['Case: Sex'] = c.sex === 'M' ? 'ชาย' : 'หญิง';
  if (c.weight) extra['Case: BW'] = `${c.weight} kg`;
  if (c.chiefComplaint) extra['Case: Chief complaint'] = c.chiefComplaint;
  if (c.comorbidities?.length) extra['Case: Comorbidities'] = c.comorbidities.join(', ');
  if (c.renal?.egfr != null) extra['Case: eGFR'] = `${c.renal.egfr} mL/min`;
  if (c.renal?.onDialysis) extra['Case: Dialysis'] = 'Yes — dose accordingly';
  if (c.renal?.ckdStage) extra['Case: CKD stage'] = c.renal.ckdStage;
  // Include recent cross-tool / Dr. AI sessions so the tool panel can reference
  // earlier recommendations about the same patient. Mirrors what the floating
  // Dr. AI Resume mode already injects, so history flows in both directions.
  if (c.toolSessions?.length) {
    const recent = c.toolSessions.slice(0, 5);
    const lines = recent.map((s) => {
      const t = new Date(s.timestamp);
      const hhmm = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
      return `[${hhmm} ${s.toolName}] ${s.summary.slice(0, 180)}`;
    });
    extra['Case: Previous sessions'] = lines.join(' || ');
  }
  return extra;
}

export default function AITreatmentPanel({ tool, getInput, className }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [initialResponse, setInitialResponse] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [followUpDraft, setFollowUpDraft] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [toolPromptRef, setToolPromptRef] = useState<string>('');
  const abortRef = useRef<AbortController | null>(null);
  const followUpInputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);
  const { activeCase, activeId, setActive } = useActiveCase();

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns, status]);

  const generate = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setInitialResponse('');
    setTurns([]);
    setError('');
    setSaved(false);
    setOpen(true);

    try {
      const input = getInput();
      const mergedData = activeCase
        ? { ...caseContextLines(activeCase), ...input.data }
        : input.data;
      const mergedBw = input.bw ?? activeCase?.weight ?? undefined;
      const mergedInput: AIToolInput = { tool, data: mergedData, bw: mergedBw };
      const prompt = buildToolPrompt(mergedInput);
      setToolPromptRef(prompt);

      let accumulated = '';
      await streamChat(
        [{ role: 'user', content: prompt }],
        (acc) => {
          accumulated = acc;
          setInitialResponse(acc);
        },
        { maxTokens: 1500, signal: controller.signal },
      );
      setInitialResponse(accumulated);
      setStatus('done');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setStatus('error');
      setError(e instanceof ChatError ? e.message : e instanceof Error ? e.message : 'เกิดข้อผิดพลาด');
    }
  }, [tool, getInput, activeCase]);

  const sendFollowUp = useCallback(async () => {
    const question = followUpDraft.trim();
    if (!question || !initialResponse || status === 'loading' || status === 'followup-loading') return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userTurn: Turn = { role: 'user', content: question };
    const streamingTurn: Turn = { role: 'assistant', content: '' };
    const priorTurns = [...turns, userTurn];
    setTurns([...priorTurns, streamingTurn]);
    setFollowUpDraft('');
    setStatus('followup-loading');
    setError('');

    const messages: ChatMessage[] = [
      { role: 'user', content: toolPromptRef },
      { role: 'assistant', content: initialResponse },
      ...priorTurns.map((t) => ({ role: t.role, content: t.content })),
    ];

    try {
      let accumulated = '';
      await streamChat(
        messages,
        (acc) => {
          accumulated = acc;
          setTurns([...priorTurns, { role: 'assistant', content: acc }]);
        },
        { maxTokens: 1000, signal: controller.signal },
      );
      const finalTurns = [...priorTurns, { role: 'assistant' as const, content: accumulated }];
      setTurns(finalTurns);
      setStatus('done');

      // Auto-save follow-up to active case
      if (activeId) {
        const convoSummary = finalTurns
          .map((t) => `${t.role === 'user' ? '❓' : '💬'} ${t.content.slice(0, 120)}`)
          .join(' · ')
          .slice(0, 500);
        addToolSession(activeId, {
          toolId: tool,
          toolName: `${TOOL_NAMES[tool] ?? tool} (ถามต่อ)`,
          summary: convoSummary,
        });
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // Trim the empty streaming turn
        setTurns(priorTurns);
        setStatus('done');
        return;
      }
      setTurns(priorTurns);
      setStatus('error');
      setError(e instanceof ChatError ? e.message : e instanceof Error ? e.message : 'เกิดข้อผิดพลาด');
    }
  }, [followUpDraft, initialResponse, status, turns, toolPromptRef, activeId, tool]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const copyAll = useCallback(() => {
    const full = [
      initialResponse,
      ...turns.map((t) => `\n\n${t.role === 'user' ? '❓' : '💬'} ${t.content}`),
    ].join('');
    if (full) navigator.clipboard.writeText(full).catch(() => undefined);
  }, [initialResponse, turns]);

  const handleSave = useCallback(() => {
    if (!initialResponse) return;
    // If no active case yet, create a quick anonymous one so the user isn't
    // blocked from saving. Named by tool + time so the entry is traceable.
    let targetId = activeId;
    if (!targetId) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const newCase = createCase({
        name: `${TOOL_NAMES[tool] ?? tool} ${hh}:${mm}`,
      });
      setActive(newCase.id);
      targetId = newCase.id;
    }
    const convoExtra = turns.length
      ? ' · ' + turns.map((t) => `${t.role === 'user' ? '❓' : '💬'} ${t.content.slice(0, 80)}`).join(' · ')
      : '';
    const summary = (initialResponse.slice(0, 300) + convoExtra).replace(/\n+/g, ' ').slice(0, 500);
    addToolSession(targetId, {
      toolId: tool,
      toolName: TOOL_NAMES[tool] ?? tool,
      summary,
    });
    setSaved(true);
  }, [activeId, initialResponse, turns, tool, setActive]);

  const focusFollowUp = useCallback(() => {
    setOpen(true);
    // Defer to next frame so the textarea is mounted if body was just expanded.
    requestAnimationFrame(() => {
      followUpInputRef.current?.focus();
      followUpInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  const clearConvo = useCallback(() => {
    setTurns([]);
    setFollowUpDraft('');
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void sendFollowUp();
    }
  };

  const isBusy = status === 'loading' || status === 'followup-loading';
  const hasContent = initialResponse.length > 0;

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Bot className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1 text-sm font-medium">Dr. AI</span>
        <CaseSelector />

        {isBusy ? (
          <Button size="sm" variant="ghost" onClick={cancel} className="h-7 px-2 text-xs text-muted-foreground">
            <X className="mr-1 h-3 w-3" /> ยกเลิก
          </Button>
        ) : (
          <Button
            size="sm"
            variant={status === 'idle' ? 'default' : 'outline'}
            onClick={generate}
            className="h-7 px-3 text-xs"
          >
            {status === 'done' || status === 'error' ? (
              <><RefreshCw className="mr-1 h-3 w-3" /> ทำใหม่</>
            ) : (
              <><Bot className="mr-1 h-3 w-3" /> สร้างคำแนะนำ</>
            )}
          </Button>
        )}

        {hasContent && status !== 'loading' && (
          <Button
            size="sm"
            variant="ghost"
            disabled={saved}
            onClick={handleSave}
            className="h-7 px-2"
            aria-label={saved ? 'บันทึกแล้ว' : activeId ? `บันทึกลงเคส ${activeCase?.name ?? ''}` : 'บันทึกเป็นเคสใหม่'}
            title={saved ? 'บันทึกแล้ว' : activeId ? `บันทึกลง ${activeCase?.name ?? 'เคส'}` : 'บันทึกเป็นเคสใหม่'}
          >
            {saved ? <BookmarkCheck className="h-3 w-3 text-emerald-500" /> : <Bookmark className="h-3 w-3" />}
          </Button>
        )}

        {hasContent && (
          <Button size="sm" variant="ghost" onClick={copyAll} className="h-7 px-2" aria-label="คัดลอก" title="คัดลอก">
            <Copy className="h-3 w-3" />
          </Button>
        )}

        {hasContent && status !== 'loading' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={focusFollowUp}
            className="h-7 px-2"
            aria-label="ถามต่อ"
            title="ถามต่อ"
          >
            <MessageCircle className="h-3 w-3" />
          </Button>
        )}

        {hasContent && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpen((o) => !o)}
            className="h-7 px-2"
            aria-label={open ? 'ย่อ' : 'ขยาย'}
          >
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        )}
      </div>

      {/* Body */}
      {open && (
        <div className="border-t">
          {/* Initial response + conversation scroll area */}
          <div className="max-h-[480px] overflow-y-auto px-3 py-3">
            {status === 'loading' && !initialResponse && (
              <div className="space-y-2 py-2">
                {[80, 60, 90, 50].map((w, i) => (
                  <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}

            {status === 'error' && !initialResponse && (
              <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                {error || 'เกิดข้อผิดพลาด — ลองใหม่'}
              </div>
            )}

            {initialResponse && (
              <div className="space-y-0.5 text-sm">
                {renderMarkdown(initialResponse)}
              </div>
            )}

            {turns.length > 0 && (
              <div className="mt-4 space-y-3 border-t pt-3">
                {turns.map((t, i) => (
                  <div key={i} className={t.role === 'user' ? 'flex justify-end' : ''}>
                    <div
                      className={cn(
                        'max-w-[90%] rounded-2xl px-3 py-2 text-xs',
                        t.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'border bg-muted/30',
                      )}
                    >
                      {t.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{t.content}</p>
                      ) : (
                        <div className="space-y-0.5">{renderMarkdown(t.content)}</div>
                      )}
                    </div>
                  </div>
                ))}
                {status === 'error' && error && (
                  <div className="rounded-md bg-destructive/10 p-2 text-[11px] text-destructive">{error}</div>
                )}
              </div>
            )}

            <div ref={scrollBottomRef} />
          </div>

          {/* Follow-up input — only show after initial generation */}
          {hasContent && status !== 'loading' && (
            <div className="border-t bg-muted/20 px-3 py-2">
              <div className="mb-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MessageCircle size={11} />
                <span>ถามต่อ Dr. AI</span>
                {activeCase && <span className="ml-auto text-blue-600 dark:text-blue-400">💾 บันทึกอัตโนมัติลง {activeCase.name}</span>}
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  ref={followUpInputRef}
                  value={followUpDraft}
                  onChange={(e) => setFollowUpDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="เช่น ถ้า K = 6.5 ต้องปรับยังไง?"
                  rows={2}
                  disabled={status === 'followup-loading'}
                  className="max-h-32 min-h-[36px] flex-1 resize-none rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60"
                />
                <Button
                  size="sm"
                  onClick={() => void sendFollowUp()}
                  disabled={!followUpDraft.trim() || status === 'followup-loading'}
                  className="h-8 shrink-0 px-2.5"
                  aria-label="ส่ง"
                >
                  {status === 'followup-loading' ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
                {turns.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearConvo}
                    disabled={status === 'followup-loading'}
                    className="h-8 shrink-0 px-2"
                    aria-label="ล้างการสนทนา"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Cmd/Ctrl+Enter = ส่ง</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
