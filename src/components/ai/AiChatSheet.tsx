import { useCallback, useRef, useState } from 'react';
import { AlertCircle, Send, Sparkles, StopCircle, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sendChat, ChatError, type ChatMessage } from '@/lib/aiClient';
import { useAiChat } from './AiChatProvider';

type Role = 'user' | 'assistant';
type Message = { id: string; role: Role; content: string };

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AiChatSheet() {
  const { isOpen, close } = useAiChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canSend = draft.trim().length > 0 && !isLoading;

  const handleSend = useCallback(async () => {
    const prompt = draft.trim();
    if (!prompt || isLoading) return;

    const userMsg: Message = { id: newId(), role: 'user', content: prompt };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setDraft('');
    setError(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const apiMessages: ChatMessage[] = nextHistory.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const result = await sendChat(apiMessages, { signal: controller.signal });
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', content: result.content || '(ว่าง)' },
      ]);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // User hit stop — silently drop, leave the user turn in view.
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
  }, [draft, isLoading, messages]);

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
    textareaRef.current?.focus();
  }

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
                  <MessageBubble role={m.role} content={m.content} />
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
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
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
