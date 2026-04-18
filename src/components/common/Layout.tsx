import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import AIFab from '@/components/ai/AIFab';

export default function Layout() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-screen-sm px-4 pb-24 pt-4">
        <Outlet />
      </main>
      <AIFab onClick={() => console.info('AI FAB tapped — bottom sheet arrives on Day 6.')} />
      <BottomNav />
    </div>
  );
}
