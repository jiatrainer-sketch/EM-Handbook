import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  KEYS,
  PIN_LIMIT,
  RECENTS_LIMIT,
  getFavorites,
  getPinned,
  getRecents,
  recordVisit as recordVisitImpl,
  subscribePrefs,
  toggleFavorite as toggleFavoriteImpl,
  togglePin as togglePinImpl,
  type PrefKey,
  type TogglePinResult,
} from '@/lib/userPrefs';

export { PIN_LIMIT, RECENTS_LIMIT };

const EMPTY: readonly string[] = Object.freeze([]);

/** Module-level caches keep the snapshot reference-stable for useSyncExternalStore. */
const cache: Record<PrefKey, readonly string[]> = {
  [KEYS.favorites]: EMPTY,
  [KEYS.pinned]: EMPTY,
  [KEYS.recents]: EMPTY,
};
let hydrated = false;

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  cache[KEYS.favorites] = Object.freeze(getFavorites());
  cache[KEYS.pinned] = Object.freeze(getPinned());
  cache[KEYS.recents] = Object.freeze(getRecents());
}

function refresh(key: PrefKey) {
  if (key === KEYS.favorites) cache[key] = Object.freeze(getFavorites());
  else if (key === KEYS.pinned) cache[key] = Object.freeze(getPinned());
  else if (key === KEYS.recents) cache[key] = Object.freeze(getRecents());
}

function makeStore(key: PrefKey) {
  return {
    subscribe(onChange: () => void) {
      hydrate();
      return subscribePrefs((changed) => {
        if (changed === key) {
          refresh(key);
          onChange();
        }
      });
    },
    get(): readonly string[] {
      hydrate();
      return cache[key];
    },
    serverGet(): readonly string[] {
      return EMPTY;
    },
  };
}

const favStore = makeStore(KEYS.favorites);
const pinStore = makeStore(KEYS.pinned);
const recStore = makeStore(KEYS.recents);

export function useFavorites() {
  const favorites = useSyncExternalStore(
    favStore.subscribe,
    favStore.get,
    favStore.serverGet,
  );
  const pinned = useSyncExternalStore(
    pinStore.subscribe,
    pinStore.get,
    pinStore.serverGet,
  );
  const recents = useSyncExternalStore(
    recStore.subscribe,
    recStore.get,
    recStore.serverGet,
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );
  const isPinned = useCallback(
    (id: string) => pinned.includes(id),
    [pinned],
  );

  const toggleFavorite = useCallback((id: string) => {
    const next = toggleFavoriteImpl(id);
    cache[KEYS.favorites] = Object.freeze(next);
    return next;
  }, []);

  const togglePin = useCallback((id: string): TogglePinResult => {
    const result = togglePinImpl(id);
    cache[KEYS.pinned] = Object.freeze(result.pinned);
    return result;
  }, []);

  return {
    favorites,
    pinned,
    recents,
    isFavorite,
    isPinned,
    toggleFavorite,
    togglePin,
    pinLimit: PIN_LIMIT,
  };
}

/** Side-effect helper for content pages — records the visit on mount. */
export function useRecordVisit(id: string | undefined) {
  useEffect(() => {
    if (!id) return;
    const next = recordVisitImpl(id);
    cache[KEYS.recents] = Object.freeze(next);
  }, [id]);
}
