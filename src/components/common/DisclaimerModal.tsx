import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'em:disclaimer-accepted-v1';

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      if (window.localStorage.getItem(STORAGE_KEY) !== '1') setOpen(true);
    } catch {
      // localStorage blocked → surface the modal anyway (soft-warn)
      setOpen(true);
    }
  }, []);

  function handleAccept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore — user can still accept for this session
    }
    setOpen(false);
  }

  // Controlled dialog: we only honor the explicit Accept button. Close via Esc
  // or overlay click snaps back open so the reader can't slip past the
  // disclaimer on first visit.
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setOpen(true);
      }}
    >
      <DialogContent
        className="max-w-md"
        hideClose
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>ก่อนเริ่มใช้งาน</DialogTitle>
          <DialogDescription>
            EM-Handbook เป็นคู่มืออ้างอิง ไม่ใช่คำสั่งการรักษา
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• ตรวจสอบ dose / protocol ทุกครั้งก่อนใช้งานกับคนไข้จริง</li>
          <li>
            • คำนวณ drug dose อ้างอิง <strong>BW 60 kg</strong> — ต้อง rescale
            ตาม weight จริงของคนไข้
          </li>
          <li>
            • AI chat เป็นเครื่องมือช่วย ไม่ใช่คำวินิจฉัย — ผู้สั่งการรักษารับผิดชอบทุกการตัดสินใจ
          </li>
          <li>
            • ข้อมูล Favorites / Pinned / Recents / Notes เก็บเฉพาะในเครื่องนี้
          </li>
        </ul>

        <DialogFooter>
          <Button onClick={handleAccept} className="w-full sm:w-auto">
            รับทราบและเริ่มใช้งาน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
