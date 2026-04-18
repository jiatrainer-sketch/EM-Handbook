import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import ThemeToggle from './ThemeToggle';
import AIFab from '@/components/ai/AIFab';
import AiChatSheet from '@/components/ai/AiChatSheet';
import { AiChatProvider } from '@/components/ai/AiChatProvider';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';

export default function Layout() {
  useSearchShortcut();
  return (
    <AiChatProvider>
      <div className="min-h-dvh">
        <Header right={<ThemeToggle />} />
        <main className="mx-auto max-w-screen-sm px-4 pb-24 pt-4">
          <Outlet />
        </main>
        <AIFab />
        <AiChatSheet />
        <BottomNav />
      </div>
    </AiChatProvider>
  );
}
