import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  getCase,
  getCasesVersion,
  notifyCaseChange,
  subscribeCases,
} from '@/lib/caseManager';

const ACTIVE_KEY = 'em-handbook-active-case';

function readActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function useActiveCase() {
  // Re-render whenever the cases store changes — covers create/update/delete/
  // addToolSession/setActive across any component, not just this hook's caller.
  useSyncExternalStore(subscribeCases, getCasesVersion, () => 0);

  const activeId = readActiveId();
  const activeCase = activeId ? getCase(activeId) ?? null : null;

  const setActive = useCallback((id: string | null) => {
    try {
      if (id) localStorage.setItem(ACTIVE_KEY, id);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch {
      /* ignore */
    }
    notifyCaseChange();
  }, []);

  // Clear activeId if the referenced case was deleted.
  useEffect(() => {
    if (activeId && !getCase(activeId)) setActive(null);
  }, [activeId, setActive]);

  return { activeCase, activeId, setActive };
}
