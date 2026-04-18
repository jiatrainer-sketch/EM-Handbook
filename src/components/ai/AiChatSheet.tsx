import { useRef, useState } from 'react';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = draft.trim().length > 0;

  function handleSend() {
    if (!canSend) return;
    // Network wiring lands in the next milestone. For now we just echo the
    // prompt into the transcript so the UI shell is exercisable.
    const userMsg: Message = { id: newId(), role: 'user', content: draft.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  function handleClear() {
    setMessages([]);
    setDraft('');
    textareaRef.current?.focus();
  }

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : close())}>
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
            disabled={messages.length === 0 && !draft}
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
              className="max-h-40 min-h-[44px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleSend}
              disabled={!canSend}
              className="h-11"
              aria-label="ส่งคำถาม"
            >
              <Send size={16} aria-hidden />
              <span className="ml-1.5 hidden sm:inline">ส่ง</span>
            </Button>
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
