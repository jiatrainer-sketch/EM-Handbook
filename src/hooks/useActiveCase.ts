import { useCallback, useEffect, useState } from 'react';
import { getCase } from '@/lib/caseManager';

const ACTIVE_KEY = 'em-handbook-active-case';

export function useActiveCase() {
  const [activeId, setActiveId] = useState<string | null>(() => {
    try { return localStorage.getItem(ACTIVE_KEY); } catch { return null; }
  });

  const activeCase = activeId ? getCase(activeId) ?? null : null;

  const setActive = useCallback((id: string | null) => {
    setActiveId(id);
    try {
      if (id) localStorage.setItem(ACTIVE_KEY, id);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch { /* ignore */ }
  }, []);

  // clear if case was deleted
  useEffect(() => {
    if (activeId && !getCase(activeId)) setActive(null);
  }, [activeId, setActive]);

  return { activeCase, activeId, setActive };
}
