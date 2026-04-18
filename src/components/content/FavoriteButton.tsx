import { useState } from 'react';
import { Heart, Pin, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

type Props = {
  id: string;
  /** Optional title for the toast/aria — defaults to the id. */
  label?: string;
};

export default function FavoriteButton({ id, label }: Props) {
  const { isFavorite, isPinned, toggleFavorite, togglePin, pinLimit } =
    useFavorites();
  const fav = isFavorite(id);
  const pinned = isPinned(id);
  const [notice, setNotice] = useState<string | null>(null);

  const name = label ?? id;

  function showNotice(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2200);
  }

  function onPin() {
    const result = togglePin(id);
    if (!result.ok && result.reason === 'limit') {
      showNotice(`ปักหมุดได้สูงสุด ${pinLimit} รายการ`);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-pressed={fav}
        aria-label={fav ? `เอา ${name} ออกจากรายการโปรด` : `เพิ่ม ${name} ในรายการโปรด`}
        onClick={() => toggleFavorite(id)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors',
          fav
            ? 'border-rose-500/60 bg-rose-500/10 text-rose-600 dark:text-rose-300'
            : 'border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )}
      >
        <Heart
          size={18}
          aria-hidden
          fill={fav ? 'currentColor' : 'none'}
          strokeWidth={2}
        />
      </button>
      <button
        type="button"
        aria-pressed={pinned}
        aria-label={pinned ? `ถอดหมุด ${name}` : `ปักหมุด ${name} ที่หน้าหลัก`}
        onClick={onPin}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors',
          pinned
            ? 'border-amber-500/60 bg-amber-500/10 text-amber-600 dark:text-amber-300'
            : 'border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )}
      >
        {pinned ? (
          <PinOff size={18} aria-hidden strokeWidth={2} />
        ) : (
          <Pin size={18} aria-hidden strokeWidth={2} />
        )}
      </button>
      {notice ? (
        <span
          role="status"
          className="ml-2 text-xs text-muted-foreground"
        >
          {notice}
        </span>
      ) : null}
    </div>
  );
}
