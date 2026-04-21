import { useLocation } from 'react-router-dom';
import CaseBanner from '@/components/CaseBanner';

// Routes where the persistent case banner should appear.
// Home has its own cases widget; Cases pages manage state directly.
const HIDE_PREFIXES = ['/', '/cases', '/search', '/browse', '/symptoms'];

function shouldShow(pathname: string): boolean {
  if (pathname === '/') return false;
  if (pathname.startsWith('/cases')) return false;
  if (pathname.startsWith('/content/')) return false;
  if (HIDE_PREFIXES.includes(pathname)) return false;
  // Show on /tools, /tools/*, and anywhere else by default
  return true;
}

export default function PageCaseBanner() {
  const { pathname } = useLocation();
  if (!shouldShow(pathname)) return null;
  return (
    <div className="mb-3">
      <CaseBanner />
    </div>
  );
}
