import { MessageCircle } from 'lucide-react';

type AIFabProps = {
  onClick?: () => void;
};

export default function AIFab({ onClick }: AIFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="ถาม AI"
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95"
      style={{ bottom: 'calc(72px + env(safe-area-inset-bottom))' }}
    >
      <MessageCircle size={24} strokeWidth={2.25} aria-hidden />
    </button>
  );
}
