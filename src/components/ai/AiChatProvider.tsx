import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type AiChatState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const AiChatCtx = createContext<AiChatState | null>(null);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );
  return <AiChatCtx.Provider value={value}>{children}</AiChatCtx.Provider>;
}

export function useAiChat(): AiChatState {
  const ctx = useContext(AiChatCtx);
  if (!ctx) throw new Error('useAiChat must be used inside <AiChatProvider>');
  return ctx;
}
