import { NavLink } from 'react-router-dom';
import { Activity, Home, Search, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { to: '/', label: 'หน้าหลัก', icon: Home, end: true },
  { to: '/search', label: 'ค้นหา', icon: Search, end: false },
  { to: '/tools', label: 'Tools', icon: Wrench, end: false },
  { to: '/symptoms', label: 'อาการ', icon: Activity, end: false },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="หลัก"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-screen-sm">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              <Icon size={22} strokeWidth={2} aria-hidden />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
