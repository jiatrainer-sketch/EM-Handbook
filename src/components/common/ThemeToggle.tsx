import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemePreference } from '@/hooks/useTheme';

const ICONS: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemePreference, string> = {
  light: 'ธีมสว่าง',
  dark: 'ธีมมืด',
  system: 'ตามระบบ',
};

export default function ThemeToggle() {
  const { preference, cycle } = useTheme();
  const Icon = ICONS[preference];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`สลับธีม (${LABELS[preference]})`}
      title={LABELS[preference]}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/80 hover:bg-accent hover:text-foreground"
    >
      <Icon size={18} strokeWidth={2} aria-hidden />
    </button>
  );
}
