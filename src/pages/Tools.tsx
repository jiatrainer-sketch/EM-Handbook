import { MessageSquare } from 'lucide-react';
import { useAiChat } from '@/components/ai/AiChatProvider';
import { Button } from '@/components/ui/button';

export default function Tools() {
  const chat = useAiChat();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Tools</h1>
        <p className="text-sm text-muted-foreground">
          ใช้ AI ช่วยร่าง note / consult reply — ผู้สั่งการรักษาต้องตรวจทุกครั้ง
        </p>
      </div>

      <ul className="space-y-3 text-sm">
        <li className="rounded-lg border bg-card p-3">
          <div className="mb-1 font-medium">📝 Pre-op Clearance Helper</div>
          <p className="mb-3 text-muted-foreground">
            ช่วยร่าง pre-op note + คำนวณ RCRI + แนะนำ workup
          </p>
          <Button size="sm" variant="outline" onClick={chat.open}>
            <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
            เปิด AI ช่วยเหลือ
          </Button>
        </li>

        <li className="rounded-lg border bg-card p-3">
          <div className="mb-1 font-medium">💬 Consult Reply Generator</div>
          <p className="mb-3 text-muted-foreground">
            ช่วยเขียน consult reply แบบมีโครงสร้าง (CC / HPI / PE / A&amp;P)
          </p>
          <Button size="sm" variant="outline" onClick={chat.open}>
            <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
            เปิด AI ช่วยเหลือ
          </Button>
        </li>
      </ul>

      <p className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
        ⚠️ AI ช่วยร่างเท่านั้น — ตรวจความถูกต้อง + adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง
      </p>
    </div>
  );
}
