import type { PatientCase, ToolSession } from '@/types/case';

const STORAGE_KEY = 'em-handbook-cases';
const MAX_CASES = 20;

// ─── Reactive store plumbing ─────────────────────────────────────────────────
//
// Every mutation bumps `version` and notifies subscribers. Hooks plug in via
// `useSyncExternalStore(subscribeCases, getCasesVersion)` so any component
// that reads case data re-renders when another component mutates it. Without
// this, `HomeCasesWidget`, `CaseBanner`, `Cases`, `CaseDetail` all held stale
// data until an unrelated re-render happened.

const listeners = new Set<() => void>();
let version = 0;
let cachedSorted: PatientCase[] | null = null;

export function subscribeCases(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCasesVersion(): number {
  return version;
}

export function notifyCaseChange(): void {
  cachedSorted = null;
  version += 1;
  listeners.forEach((l) => l());
}

// ─── Storage ─────────────────────────────────────────────────────────────────

function load(): PatientCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PatientCase[];
  } catch {
    return [];
  }
}

function save(cases: PatientCase[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch {
    // storage full — ignore
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function listCases(): PatientCase[] {
  // Cached so useSyncExternalStore getSnapshot returns a stable reference
  // between renders when nothing changed (Object.is equality).
  if (cachedSorted) return cachedSorted;
  cachedSorted = load().sort((a, b) => b.updatedAt - a.updatedAt);
  return cachedSorted;
}

export function getCase(id: string): PatientCase | undefined {
  return load().find((c) => c.id === id);
}

export function createCase(data: Omit<PatientCase, 'id' | 'toolSessions' | 'createdAt' | 'updatedAt'>): PatientCase {
  const cases = load();
  const now = Date.now();
  const newCase: PatientCase = {
    ...data,
    id: `case-${now}-${Math.random().toString(36).slice(2, 7)}`,
    toolSessions: [],
    createdAt: now,
    updatedAt: now,
  };
  const trimmed = [newCase, ...cases].slice(0, MAX_CASES);
  save(trimmed);
  notifyCaseChange();
  return newCase;
}

export function updateCase(id: string, patch: Partial<Omit<PatientCase, 'id' | 'createdAt'>>): PatientCase | null {
  const cases = load();
  const idx = cases.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...cases[idx], ...patch, id, updatedAt: Date.now() };
  cases[idx] = updated;
  save(cases);
  notifyCaseChange();
  return updated;
}

export function deleteCase(id: string): void {
  save(load().filter((c) => c.id !== id));
  notifyCaseChange();
}

export function addToolSession(caseId: string, session: Omit<ToolSession, 'timestamp'>): void {
  const cases = load();
  const idx = cases.findIndex((c) => c.id === caseId);
  if (idx === -1) return;
  const ts: ToolSession = { ...session, timestamp: Date.now() };
  const MAX_SESSIONS = 10;
  cases[idx] = {
    ...cases[idx],
    toolSessions: [ts, ...cases[idx].toolSessions].slice(0, MAX_SESSIONS),
    updatedAt: Date.now(),
  };
  save(cases);
  notifyCaseChange();
}
