import { useCallback, useRef, useState } from 'react';
import { Bookmark, BookmarkCheck, Bot, ChevronDown, ChevronUp, Copy, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { streamToolSuggestions } from '@/lib/aiSuggestions/api';
import { ChatError } from '@/lib/aiClient';
import { useActiveCase } from '@/hooks/useActiveCase';
import { addToolSession } from '@/lib/caseManager';
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
  /** Tool name — used for prompt routing */
  tool: string;
  /** Call this to get current tool data snapshot when user clicks Generate */
  getInput: () => Omit<AIToolInput, 'tool'>;
  /** Additional CSS class for the container */
  className?: string;
}

type Status = 'idle' | 'loading' | 'done' | 'error';

// Minimal markdown renderer — handles the standardized AI output format
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
        <div key={key++} className="mt-3 mb-1 text-sm font-semibold text-foreground">
          {line.slice(4)}
        </div>,
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <div key={key++} className="mt-3 mb-1 text-base font-bold text-foreground">
          {line.slice(3)}
        </div>,
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <div key={key++} className="mt-2 text-sm font-semibold">
          {line.slice(2, -2)}
        </div>,
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
        <div key={key++} className="text-xs leading-relaxed">
          {formatInline(line)}
        </div>,
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
  // Handle **bold** inline
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
  return extra;
}

export default function AITreatmentPanel({ tool, getInput, className }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { activeCase, activeId } = useActiveCase();

  const generate = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setContent('');
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
      await streamToolSuggestions(
        mergedInput,
        (acc) => setContent(acc),
        controller.signal,
      );
      setStatus('done');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setStatus('error');
      setError(e instanceof ChatError ? e.message : e instanceof Error ? e.message : 'เกิดข้อผิดพลาด');
    }
  }, [tool, getInput]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus('idle');
  }, []);

  const copyAll = useCallback(() => {
    if (content) navigator.clipboard.writeText(content).catch(() => undefined);
  }, [content]);

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Bot className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1 text-sm font-medium">Dr. AI</span>
        <CaseSelector />

        {status === 'loading' ? (
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

        {status === 'done' && content && activeId && (
          <Button
            size="sm"
            variant="ghost"
            disabled={saved}
            onClick={() => {
              if (!activeId || !content) return;
              addToolSession(activeId, {
                toolId: tool,
                toolName: TOOL_NAMES[tool] ?? tool,
                summary: content.slice(0, 300).replace(/\n+/g, ' '),
              });
              setSaved(true);
            }}
            className="h-7 px-2"
            aria-label={saved ? 'บันทึกแล้ว' : 'บันทึกลงเคส'}
          >
            {saved ? <BookmarkCheck className="h-3 w-3 text-emerald-500" /> : <Bookmark className="h-3 w-3" />}
          </Button>
        )}

        {(status === 'done' || status === 'loading') && content && (
          <Button size="sm" variant="ghost" onClick={copyAll} className="h-7 px-2">
            <Copy className="h-3 w-3" />
          </Button>
        )}

        {(status === 'done' || status === 'loading') && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpen((o) => !o)}
            className="h-7 px-2"
          >
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        )}
      </div>

      {/* Content area */}
      {open && (
        <div className="border-t px-3 py-3">
          {status === 'loading' && !content && (
            <div className="space-y-2 py-2">
              {[80, 60, 90, 50].map((w, i) => (
                <div key={i} className={`h-3 animate-pulse rounded bg-muted`} style={{ width: `${w}%` }} />
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
              {error || 'เกิดข้อผิดพลาด — ลองใหม่'}
            </div>
          )}

          {content && (
            <div className="space-y-0.5 text-sm">
              {renderMarkdown(content)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
