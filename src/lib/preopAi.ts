import { ChatError, streamChat } from './aiClient';

export type SurgeryLevel = 'low' | 'intermediate' | 'high';

export type ProcedureSuggestion = {
  level: SurgeryLevel;
  reason: string;
};

export type RcriMatchKey = 'ihd' | 'hf' | 'cvd' | 'insulinDm' | 'crHigh';

export type ComorbidSuggestion = {
  rcri: Array<{ key: RcriMatchKey; reason: string }>;
  other: string[];
};

export type MedPlanItem = {
  name: string;
  instruction: string;
};

export type MedPlan = {
  continue: MedPlanItem[];
  hold: MedPlanItem[];
  restart: MedPlanItem[];
  notes?: string[];
};

export type LabFinding = {
  lab: string;
  value: string;
  severity: 'mild' | 'moderate' | 'severe';
  verdict: 'proceed' | 'optimize' | 'postpone';
  target: string;
  workup?: string[];
  correction: string[];
  recheck: string;
};

const AI_SYSTEM_HINT = `(Output must be valid JSON only. No markdown fences, no commentary.)`;

function extractJson<T>(raw: string): T {
  let s = raw.trim();
  // Strip optional ```json fences
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  // Find first { or [ and last } or ] as fallback
  const start = Math.min(
    ...['{', '['].map((c) => {
      const i = s.indexOf(c);
      return i === -1 ? Infinity : i;
    }),
  );
  const end = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
  if (start !== Infinity && end > start) {
    s = s.slice(start, end + 1);
  }
  return JSON.parse(s) as T;
}

async function askJson<T>(userPrompt: string, maxTokens = 800): Promise<T> {
  const { content } = await streamChat(
    [{ role: 'user', content: `${userPrompt}\n\n${AI_SYSTEM_HINT}` }],
    () => {
      /* ignore stream chunks for one-shot calls */
    },
    { maxTokens },
  );
  try {
    return extractJson<T>(content);
  } catch (e) {
    throw new ChatError(
      `AI ตอบในรูปแบบที่ไม่คาดคิด — ลองใหม่อีกครั้ง (${
        e instanceof Error ? e.message : 'parse error'
      })`,
      null,
    );
  }
}

export async function aiClassifyProcedure(
  procedure: string,
): Promise<ProcedureSuggestion> {
  const prompt = `You are classifying surgery risk per the RCRI (Lee) framework for a pre-op clearance tool.

Surgery risk categories:
- "low": cataract, endoscopy, breast, superficial, ambulatory
- "intermediate": ortho (incl. hip, spine, knee), head/neck, urologic, prostate, carotid, intraperitoneal non-major
- "high": suprainguinal vascular, intrathoracic, major intra-abdominal (Whipple, colectomy)

Procedure: "${procedure}"

Respond with JSON: {"level": "low"|"intermediate"|"high", "reason": "Thai reason ≤20 words"}`;
  return askJson<ProcedureSuggestion>(prompt, 200);
}

export async function aiMapComorbidities(
  text: string,
): Promise<ComorbidSuggestion> {
  const prompt = `You are mapping free-text comorbidities to the RCRI criteria for a pre-op tool.

RCRI criteria (each = 1 point):
- "ihd": ischemic heart disease (prior MI, positive stress test, angina, Q waves, nitrate use, PCI/CABG)
- "hf": heart failure (history, pulmonary edema, S3, bilateral rales, redistribution CXR)
- "cvd": cerebrovascular disease (prior stroke or TIA)
- "insulinDm": insulin-dependent DM (must be on insulin currently)
- "crHigh": Cr > 2.0 mg/dL (or eGFR <30)

Free-text comorbidities (Thai/English): "${text}"

Rules:
- Only match RCRI if criteria clearly fit.
- DM without insulin → NOT "insulinDm" (put in "other" instead).
- Elevated Cr without stated value: ask — put in "other" with a note.
- Put ALL other clinically relevant conditions (AF, COPD, CKD, cirrhosis, HTN, anticoagulation, etc.) in "other".

Respond with JSON:
{
  "rcri": [{"key": "ihd"|"hf"|"cvd"|"insulinDm"|"crHigh", "reason": "Thai reason ≤15 words"}],
  "other": ["Thai/English label ≤10 words each"]
}`;
  return askJson<ComorbidSuggestion>(prompt, 600);
}

export async function aiPlanMeds(
  meds: string,
  ctx: { surgery: SurgeryLevel; hasCkd: boolean },
): Promise<MedPlan> {
  const prompt = `You are generating a peri-operative medication plan for a Thai community hospital pre-op tool.

Patient current medications (Thai/English, may include dose): """
${meds}
"""

Surgery risk: ${ctx.surgery}
CKD / renal concern: ${ctx.hasCkd ? 'yes' : 'no'}

Classify each medication into exactly one of:
- "continue": keep taking through morning of surgery (with sip of water)
- "hold": stop before surgery — specify exact timing
- "restart": post-op restart — specify timing + conditions

Apply evidence-based rules:
- β-blocker, statin, AED, thyroid, inhaler, steroid (stress dose) → continue
- ACE-I/ARB → hold morning of surgery (hypotension risk)
- Diuretics → hold morning of surgery
- Metformin → hold day of surgery (lactic acidosis if AKI/contrast)
- SGLT-2i → hold 3–4 days before (DKA risk)
- GLP-1 RA → hold 1 week (aspiration)
- Warfarin → hold 5 days, bridge LMWH if mech valve or CHA₂DS₂-VASc ≥4
- DOACs → hold 2–3 days (adjust for CrCl; apixaban/rivaroxaban 48h; dabigatran 72h if CrCl >50, 96h if 30–50)
- Antiplatelet (clopidogrel) → hold 5–7 days; ASA often continued (surgery-dependent)
- NSAIDs → hold 3–7 days
- Herbal/supplement (ginkgo, garlic, ginseng) → hold 7 days

Respond in Thai (ใช้ภาษาไทย). Respond with JSON:
{
  "continue": [{"name": "drug name", "instruction": "Thai note"}],
  "hold": [{"name": "drug name", "instruction": "Thai note (timing)"}],
  "restart": [{"name": "drug name", "instruction": "Thai note (timing + conditions)"}],
  "notes": ["ข้อควรระวัง (optional)"]
}`;
  return askJson<MedPlan>(prompt, 1200);
}

export async function aiAnalyzeLabs(
  labs: Record<string, string>,
  other: string,
  ctx: { surgery: SurgeryLevel; age: number },
): Promise<LabFinding[]> {
  const labLines = Object.entries(labs)
    .filter(([, v]) => v && v.trim() !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  const prompt = `You are analyzing pre-operative labs for a Thai community hospital.

Surgery risk: ${ctx.surgery}${ctx.age > 0 ? `, Age ${ctx.age}` : ''}

Lab values: """
${labLines || '(none provided)'}
"""
Other lab notes: "${other || 'none'}"

Evaluate each value and identify ABNORMAL results that impact pre-op clearance. Use these thresholds:
- Hb: <7 emergent only; <8 postpone elective high-risk; <10 optimize if IHD/elderly; target ≥8 (≥10 if cardiac/elderly)
- Na: <130 postpone elective; correct ≤8 mEq/24h (avoid ODS); target ≥130 (≥133 ideal)
- K: <3.0 or >5.5 postpone; target 3.5–5.0
- Cr / eGFR: if rising → rule out AKI; adjust renal-dosed drugs
- Platelet: <50k postpone major sx; <100k postpone neuro/spine; target >50k
- INR: >1.5 postpone elective; reverse if needed
- BG: random >300 postpone; HbA1c >9% consider optimize; target peri-op 140–180
- Albumin: <3.0 predicts complications; optimize nutrition if time permits
- AST/ALT: 3× ULN → work up liver; Child-Pugh if cirrhosis

For each abnormal lab, provide JSON entry:
- "lab": lab name + value (e.g., "Na 128")
- "severity": "mild" | "moderate" | "severe"
- "verdict": "proceed" | "optimize" | "postpone"
- "target": target value for elective surgery
- "workup": array of workup to find cause (optional)
- "correction": array of correction steps in Thai (with rate limits if applicable)
- "recheck": timing of recheck

Respond with JSON array of findings (empty array [] if all normal). Respond in Thai where instructions allow.`;
  return askJson<LabFinding[]>(prompt, 1500);
}
