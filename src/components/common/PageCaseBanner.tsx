import { useLocation } from 'react-router-dom';
import CaseBanner from '@/components/CaseBanner';

// Routes (and their sub-routes) where the persistent case banner should be
// hidden. Home has its own cases widget; Cases pages manage state directly;
// content pieces render their own header.
const HIDE_PREFIXES = ['/cases', '/content', '/search', '/browse', '/symptoms'];

function shouldShow(pathname: string): boolean {
  if (pathname === '/') return false;
  return !HIDE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
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
