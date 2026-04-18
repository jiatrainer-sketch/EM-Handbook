import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookmarkCheck,
  BookmarkPlus,
  FileText,
  Send,
  Sparkles,
  StopCircle,
  Trash2,
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
import { sendChat, ChatError, type ChatMessage } from '@/lib/aiClient';
import { saveNote } from '@/lib/notes';
import {
  useCurrentContentContext,
  type ContentContext,
} from '@/hooks/useCurrentContentContext';
import { useAiChat } from './AiChatProvider';

type Role = 'user' | 'assistant';

type UserMessage = { id: string; role: 'user'; content: string };
type AssistantMessage = {
  id: string;
  role: 'assistant';
  content: string;
  /** The user question that produced this answer (for Save-to-notes). */
  question: string;
  /** Context attached to the request, if any. */
  context?: { id: string; title: string };
};
type Message = UserMessage | AssistantMessage;

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Prefix a user turn with a compact context line when the chip is enabled.
 * Kept out of the cached system prompt so the system-prompt cache prefix
 * stays stable across sessions regardless of which piece the user is on.
 */
function withContext(question: string, ctx: ContentContext | null): string {
  if (!ctx) return question;
  const titleTh = ctx.titleTh ? ` (${ctx.titleTh})` : '';
  return `[ผู้ใช้กำลังเปิดหน้า: ${ctx.title}${titleTh} · id=${ctx.id}]\n\n${question}`;
}

export default function AiChatSheet() {
  const { isOpen, close } = useAiChat();
  const context = useCurrentContentContext();

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextEnabled, setContextEnabled] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Re-enable the chip whenever the user navigates to a new piece; they can
  // still toggle it off for this session. Disabling survives within-piece
  // changes so a user who said "no thanks" isn't re-prompted on every send.
  useEffect(() => {
    setContextEnabled(true);
  }, [context?.id]);

  const canSend = draft.trim().length > 0 && !isLoading;
  const activeContext = contextEnabled ? context : null;

  const handleSend = useCallback(async () => {
    const prompt = draft.trim();
    if (!prompt || isLoading) return;

    const attachedContext = contextEnabled && context ? context : null;
    const userMsg: UserMessage = { id: newId(), role: 'user', content: prompt };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setDraft('');
    setError(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // Attach the context only to the latest turn. Prior turns stay as
    // originally sent so we don't over-inflate every subsequent request.
    const apiMessages: ChatMessage[] = nextHistory.map((m, i, arr) =>
      i === arr.length - 1
        ? { role: 'user', content: withContext(prompt, attachedContext) }
        : { role: m.role, content: m.content },
    );

    try {
      const result = await sendChat(apiMessages, { signal: controller.signal });
      const assistantMsg: AssistantMessage = {
        id: newId(),
        role: 'assistant',
        content: result.content || '(ว่าง)',
        question: prompt,
        context: attachedContext
          ? { id: attachedContext.id, title: attachedContext.title }
          : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // user hit stop — leave the user turn visible, no assistant reply
      } else if (e instanceof ChatError) {
        setError(e.message);
      } else {
        setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด');
      }
    } finally {
      abortRef.current = null;
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }, [context, contextEnabled, draft, isLoading, messages]);

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
      <SheetContent
        side="bottom"
        className="flex h-[85dvh] flex-col gap-0 p-0"
      >
        <header className="flex items-center gap-2 border-b px-4 py-3">
          <Sparkles size={18} className="text-primary" aria-hidden />
          <div className="flex-1">
            <SheetTitle className="text-base">ถาม AI</SheetTitle>
            <SheetDescription className="text-xs">
              ผู้ช่วยหมอ med รพ.ชุมชน — ตอบเร็ว กระชับ
            </SheetDescription>
          </div>
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
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id}>
                  {m.role === 'assistant' ? (
                    <AssistantRow
                      message={m}
                      saved={savedIds.has(m.id)}
                      onSave={() => handleSaveNote(m)}
                    />
                  ) : (
                    <MessageBubble role="user" content={m.content} />
                  )}
                </li>
              ))}
              {isLoading ? (
                <li>
                  <ThinkingBubble />
                </li>
              ) : null}
              {error ? (
                <li>
                  <ErrorBubble text={error} />
                </li>
              ) : null}
            </ul>
          )}
        </div>

        <div className="border-t bg-background/95 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
          {activeContext ? (
            <ContextChip
              context={activeContext}
              onRemove={() => setContextEnabled(false)}
            />
          ) : null}
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
      </SheetContent>
    </Sheet>
  );
}

function ContextChip({
  context,
  onRemove,
}: {
  context: ContentContext;
  onRemove: () => void;
}) {
  const label = useMemo(
    () => context.titleTh ?? context.title,
    [context.title, context.titleTh],
  );
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
}: {
  message: AssistantMessage;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <MessageBubble role="assistant" content={message.content} />
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
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
      <Sparkles size={24} aria-hidden className="text-primary/60" />
      <p className="max-w-[28ch]">
        ถามเรื่อง dosing, protocol, renal adjust, หรือ workup ก็ได้
      </p>
    </div>
  );
}

function MessageBubble({ role, content }: { role: Role; content: string }) {
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
