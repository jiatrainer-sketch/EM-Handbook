import { useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FOCUS_EVENT = 'em:focus-search';

/** Programmatic focus from anywhere (e.g. Cmd+K hook). */
export function focusSearch() {
  window.dispatchEvent(new Event(FOCUS_EVENT));
}

type Props = {
  value: string;
  onChange: (next: string) => void;
  /** Sticky below the app header. */
  sticky?: boolean;
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  sticky = false,
  autoFocus = false,
  className,
  placeholder = 'ค้นหา score / drip / protocol…',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function handle() {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.select();
    }
    window.addEventListener(FOCUS_EVENT, handle);
    return () => window.removeEventListener(FOCUS_EVENT, handle);
  }, []);

  return (
    <div
      className={cn(
        sticky &&
          'sticky top-14 z-30 -mx-4 border-b bg-background/85 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/65',
        className,
      )}
    >
      <label className="relative flex items-center">
        <SearchIcon
          size={18}
          aria-hidden
          className="pointer-events-none absolute left-3 text-muted-foreground"
        />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-label="ค้นหา"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && value) {
              e.preventDefault();
              onChange('');
            }
          }}
          className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-9 text-base outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {value ? (
          <button
            type="button"
            aria-label="ล้างคำค้น"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <X size={16} aria-hidden />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        )}
      </label>
    </div>
  );
}
