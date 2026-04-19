import type { ReactNode } from 'react';

type CalloutType = 'danger' | 'warning' | 'info' | 'success' | 'tip';

const STYLES: Record<
  CalloutType,
  { border: string; bg: string; titleColor: string; icon: string; defaultTitle: string }
> = {
  danger: {
    border: 'border-red-500 dark:border-red-600',
    bg: 'bg-red-50 dark:bg-red-950/40',
    titleColor: 'text-red-700 dark:text-red-400',
    icon: '🚨',
    defaultTitle: 'Critical',
  },
  warning: {
    border: 'border-amber-400 dark:border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    titleColor: 'text-amber-700 dark:text-amber-400',
    icon: '⚠️',
    defaultTitle: 'Warning',
  },
  info: {
    border: 'border-blue-400 dark:border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    titleColor: 'text-blue-700 dark:text-blue-400',
    icon: 'ℹ️',
    defaultTitle: 'Note',
  },
  success: {
    border: 'border-emerald-400 dark:border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    titleColor: 'text-emerald-700 dark:text-emerald-400',
    icon: '✅',
    defaultTitle: 'Key Point',
  },
  tip: {
    border: 'border-purple-400 dark:border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    titleColor: 'text-purple-700 dark:text-purple-400',
    icon: '💡',
    defaultTitle: 'Tip',
  },
};

type Props = {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
};

export default function Callout({ type = 'info', title, children }: Props) {
  const s = STYLES[type];
  const label = title ?? s.defaultTitle;
  return (
    <div
      className={`not-prose my-4 rounded-lg border-l-4 px-4 py-3 text-sm ${s.border} ${s.bg}`}
      role={type === 'danger' || type === 'warning' ? 'alert' : undefined}
    >
      <p className={`mb-1.5 font-semibold ${s.titleColor}`}>
        {s.icon} {label}
      </p>
      <div className="prose prose-sm dark:prose-invert max-w-none [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
