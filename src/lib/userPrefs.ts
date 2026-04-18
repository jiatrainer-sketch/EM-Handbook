/**
 * Local-first storage for the per-user "shelves":
 *  - favorites: open-ended list of saved pieces
 *  - pinned:    up to PIN_LIMIT items the user wants on Home (ordered)
 *  - recents:   MRU history of visited pieces (capped)
 *
 * Reads are tolerant: bad JSON, missing storage, and unknown ids all
 * silently degrade to an empty list. Writes notify same-tab subscribers
 * via a window event (the native `storage` event only fires across tabs).
 */

export const PIN_LIMIT = 5;
export const RECENTS_LIMIT = 10;

export const KEYS = {
  favorites: 'em:favorites',
  pinned: 'em:pinned',
  recents: 'em:recents',
} as const;

export type PrefKey = (typeof KEYS)[keyof typeof KEYS];

const CHANGE_EVENT = 'em:prefs-change';

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function readList(key: PrefKey): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: string[] = [];
    const seen = new Set<string>();
    for (const item of parsed) {
      if (typeof item !== 'string') continue;
      const v = item.trim();
      if (!v || seen.has(v)) continue;
      seen.add(v);
      out.push(v);
    }
    return out;
  } catch {
    return [];
  }
}

function writeList(key: PrefKey, list: string[]): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
  } catch {
    // quota / private mode — silently drop the write.
  }
}

export function getFavorites(): string[] {
  return readList(KEYS.favorites);
}

export function getPinned(): string[] {
  return readList(KEYS.pinned).slice(0, PIN_LIMIT);
}

export function getRecents(): string[] {
  return readList(KEYS.recents).slice(0, RECENTS_LIMIT);
}

export function toggleFavorite(id: string): string[] {
  const current = getFavorites();
  const idx = current.indexOf(id);
  const next =
    idx >= 0
      ? current.filter((x) => x !== id)
      : [id, ...current];
  writeList(KEYS.favorites, next);
  return next;
}

export type TogglePinResult =
  | { ok: true; pinned: string[] }
  | { ok: false; reason: 'limit'; pinned: string[] };

export function togglePin(id: string): TogglePinResult {
  const current = getPinned();
  const idx = current.indexOf(id);
  if (idx >= 0) {
    const next = current.filter((x) => x !== id);
    writeList(KEYS.pinned, next);
    return { ok: true, pinned: next };
  }
  if (current.length >= PIN_LIMIT) {
    return { ok: false, reason: 'limit', pinned: current };
  }
  const next = [...current, id];
  writeList(KEYS.pinned, next);
  return { ok: true, pinned: next };
}

export function recordVisit(id: string): string[] {
  const current = getRecents();
  const next = [id, ...current.filter((x) => x !== id)].slice(0, RECENTS_LIMIT);
  writeList(KEYS.recents, next);
  return next;
}

type Listener = (key: PrefKey) => void;

export function subscribePrefs(listener: Listener): () => void {
  function onCustom(e: Event) {
    const detail = (e as CustomEvent<{ key: PrefKey }>).detail;
    if (detail?.key) listener(detail.key);
  }
  function onStorage(e: StorageEvent) {
    if (!e.key) return;
    if (e.key === KEYS.favorites || e.key === KEYS.pinned || e.key === KEYS.recents) {
      listener(e.key);
    }
  }
  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}
