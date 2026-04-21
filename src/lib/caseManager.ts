import type { PatientCase, ToolSession } from '@/types/case';

const STORAGE_KEY = 'em-handbook-cases';
const MAX_CASES = 20;

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

export function listCases(): PatientCase[] {
  return load().sort((a, b) => b.updatedAt - a.updatedAt);
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
  return newCase;
}

export function updateCase(id: string, patch: Partial<Omit<PatientCase, 'id' | 'createdAt'>>): PatientCase | null {
  const cases = load();
  const idx = cases.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...cases[idx], ...patch, id, updatedAt: Date.now() };
  cases[idx] = updated;
  save(cases);
  return updated;
}

export function deleteCase(id: string): void {
  save(load().filter((c) => c.id !== id));
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
}
