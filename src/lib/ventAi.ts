import { ChatError, streamChat } from './aiClient';
import { extractJson } from './jsonUtils';

export type AbgValues = {
  pH: number | null;
  paco2: number | null;
  pao2: number | null;
  hco3: number | null;
  fio2: number | null;
  be: number | null;
  lactate: number | null;
  na: number | null;
  k: number | null;
  notes: string;
};

export type VentAdjustment = {
  param: 'Vt' | 'RR' | 'PEEP' | 'FiO2' | 'I:E' | 'Other';
  from?: string;
  to: string;
  reason: string;
};

export type AbgInterpretation = {
  primaryDisorder: string;
  compensation: string;
  pfRatio: number | null;
  ardsGrade: 'none' | 'mild' | 'moderate' | 'severe' | null;
  redFlags: string[];
  adjustments: VentAdjustment[];
  recheck: string;
  notes: string[];
};

const AI_SYSTEM_HINT = `(Output must be valid JSON only. No markdown fences, no commentary.)`;

export async function extractAbgFromImage(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
): Promise<AbgValues> {
  const res = await fetch('/api/ai/extract-abg', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ imageBase64, mediaType }),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) msg = body.error;
    } catch {
      // ignore
    }
    throw new ChatError(msg, res.status);
  }
  const data = (await res.json()) as { values: AbgValues };
  return data.values;
}

export async function interpretAbgAndAdjustVent(
  abg: Partial<AbgValues>,
  currentSettings: {
    mode?: string;
    vt?: string;
    rr?: string;
    peep?: string;
    fio2?: string;
    ie?: string;
  },
  context: { scenario: string; ibwKg: number | null },
): Promise<AbgInterpretation> {
  const abgLines = (Object.entries(abg) as [keyof AbgValues, AbgValues[keyof AbgValues]][])
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const settingsLines = Object.entries(currentSettings)
    .filter(([, v]) => v && v.trim() !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const prompt = `You are a critical care physician. Interpret this ABG and suggest specific ventilator adjustments for a Thai community hospital.

Patient context:
- Scenario: ${context.scenario}
${context.ibwKg ? `- IBW: ${context.ibwKg} kg (use for Vt targets)` : ''}

Current ventilator settings: """
${settingsLines || '(not provided)'}
"""

ABG values: """
${abgLines || '(incomplete)'}
"""

Analyze and respond in Thai (ใช้ภาษาไทย). Respond with JSON:
{
  "primaryDisorder": "Thai primary acid-base disorder (เช่น 'Respiratory acidosis' / 'Metabolic acidosis with respiratory compensation')",
  "compensation": "Thai explanation of compensation adequacy (Winter's formula for metabolic acidosis, etc.)",
  "pfRatio": number | null,
  "ardsGrade": "none" | "mild" | "moderate" | "severe" | null,
  "redFlags": ["Thai red flags — pH <7.20, P/F <100, auto-PEEP, etc."],
  "adjustments": [
    {
      "param": "Vt" | "RR" | "PEEP" | "FiO2" | "I:E" | "Other",
      "from": "current value (optional)",
      "to": "new value",
      "reason": "Thai reasoning (e.g., 'ลด MV เพื่อลด PaCO2 จาก 55 → 40')"
    }
  ],
  "recheck": "Thai recheck timing (e.g., 'ABG ซ้ำใน 30 นาที')",
  "notes": ["additional Thai notes (e.g., lung-protective reminder, permissive hypercapnia)"]
}

Rules:
- For ARDS (P/F ≤300 mild / ≤200 moderate / ≤100 severe): target Vt 4–6 mL/kg IBW, plateau <30
- For obstructive (asthma/COPD): prolonged I:E, watch auto-PEEP, allow permissive hypercapnia
- For neuro: target PaCO2 35–40, avoid hypoxia/hypercapnia (↑ ICP)
- pH 7.20–7.25 acceptable if hypercapnia is protective strategy; <7.20 must address
- Don't fabricate values — if ABG incomplete, state which param you cannot evaluate`;

  const { content } = await streamChat(
    [{ role: 'user', content: `${prompt}\n\n${AI_SYSTEM_HINT}` }],
    () => {
      /* ignore stream chunks */
    },
    { maxTokens: 1500 },
  );
  try {
    return extractJson<AbgInterpretation>(content);
  } catch (e) {
    throw new ChatError(
      `AI ตอบในรูปแบบที่ไม่คาดคิด — ลองใหม่ (${e instanceof Error ? e.message : 'parse error'})`,
      null,
    );
  }
}
