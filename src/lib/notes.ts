/**
 * Saved AI answers. Same storage pattern as userPrefs.ts — tolerant reads,
 * in-tab pub/sub, per-item IDs so the UI can show "saved" state.
 */

const KEY = 'em:notes';
const CHANGE_EVENT = 'em:notes-change';
const MAX_NOTES = 100;

export type Note = {
  id: string;
  savedAt: number;
  contextId?: string;
  contextTitle?: string;
  question: string;
  answer: string;
};

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function safeId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isNote(x: unknown): x is Note {
  if (!x || typeof x !== 'object') return false;
  const n = x as Partial<Note>;
  return (
    typeof n.id === 'string' &&
    typeof n.savedAt === 'number' &&
    typeof n.question === 'string' &&
    typeof n.answer === 'string'
  );
}

export function getNotes(): Note[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isNote);
  } catch {
    return [];
  }
}

function write(notes: Note[]): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(notes));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // quota — drop silently
  }
}

export type SaveNoteInput = Omit<Note, 'id' | 'savedAt'>;

export function saveNote(input: SaveNoteInput): Note {
  const note: Note = { ...input, id: safeId(), savedAt: Date.now() };
  const next = [note, ...getNotes()].slice(0, MAX_NOTES);
  write(next);
  return note;
}

export function deleteNote(id: string): void {
  write(getNotes().filter((n) => n.id !== id));
}

export function subscribeNotes(listener: () => void): () => void {
  function onCustom() {
    listener();
  }
  function onStorage(e: StorageEvent) {
    if (e.key === KEY) listener();
  }
  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}
