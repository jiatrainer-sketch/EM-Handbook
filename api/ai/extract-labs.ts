import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ⚠️ DEFAULT = SONNET 4.6. See chat.ts for rationale. Do not regress to Opus.
const MODEL = process.env.AI_MODEL ?? 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `คุณเป็น AI OCR ที่เชี่ยวชาญการอ่านผล lab (blood chemistry, CBC, coagulation)
จากรูปถ่ายรายงานผล lab ของโรงพยาบาลหรือ printout ของเครื่อง.

หน้าที่:
- แตกค่าจากรูป → ส่งกลับเป็น JSON เท่านั้น
- ไม่ต้องวิเคราะห์/interpret — แค่แตกค่า
- ถ้าอ่านไม่ออก/ไม่ชัด → ใส่ null (อย่าเดา)
- รองรับหน่วยต่างกัน (mmol/L vs mEq/L, mg/dL vs mg% vs μmol/L)
  - ส่งกลับเป็น conventional US units:
    - Hb g/dL, Na mEq/L, K mEq/L, Ca mg/dL
    - Cr mg/dL (not μmol/L), eGFR mL/min/1.73m²
    - Platelet × 10³ /μL (i.e., /1000), INR unitless
    - FBS mg/dL (ไม่ใช่ mmol/L)
    - Albumin g/dL (ไม่ใช่ g/L → หาร 10)
    - AST/ALT U/L
  - ถ้าในรูปเป็น mmol/L → convert: Cr μmol/L ÷ 88.4 = mg/dL; glucose mmol/L × 18 = mg/dL
- ห้าม fabricate — ถ้าไม่เห็นในรูป ให้ null`;

const USER_PROMPT = `แตกค่า lab จากรูปนี้ ส่งกลับ JSON เท่านั้น (ไม่มี markdown fences, ไม่มีคำอธิบาย):

{
  "hb": number | null,
  "na": number | null,
  "k": number | null,
  "ca": number | null,
  "cr": number | null,
  "egfr": number | null,
  "platelet": number | null,
  "inr": number | null,
  "fbs": number | null,
  "albumin": number | null,
  "ast": number | null,
  "alt": number | null,
  "other": "string — lab อื่นที่น่าสนใจ เช่น 'HbA1c 9.2%, TSH 0.02, Mg 1.4', หรือ '' ถ้าไม่มี",
  "notes": "string — หมายเหตุพิเศษ (เช่น 'อ่านบางค่าไม่ชัด', หน่วยที่ convert), หรือ '' ถ้าไม่มี"
}`;

type Body = {
  imageBase64?: string;
  mediaType?: 'image/jpeg' | 'image/png' | 'image/webp';
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'server missing ANTHROPIC_API_KEY' });
    return;
  }

  const body = (req.body ?? {}) as Body;
  if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
    res.status(400).json({ error: 'imageBase64 required' });
    return;
  }
  const mediaType = body.mediaType ?? 'image/jpeg';
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(mediaType)) {
    res.status(400).json({ error: 'unsupported mediaType' });
    return;
  }

  const client = new Anthropic();
  const t0 = Date.now();

  try {
    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: body.imageBase64 },
            },
            { type: 'text', text: USER_PROMPT },
          ],
        },
      ],
    });

    const textBlock = result.content.find((b) => b.type === 'text');
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      res.status(502).json({ error: 'AI ตอบในรูปแบบที่ parse ไม่ได้', raw });
      return;
    }

    console.info(
      `[ai/extract-labs] model=${MODEL} in=${result.usage.input_tokens} out=${result.usage.output_tokens} latency=${Date.now() - t0}ms`,
    );

    res.status(200).json({
      values: parsed,
      model: MODEL,
      usage: {
        input_tokens: result.usage.input_tokens,
        output_tokens: result.usage.output_tokens,
      },
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`[ai/extract-labs] Anthropic ${err.status}: ${err.message}`);
      const safe = err.status && err.status < 500 ? err.message : 'upstream error';
      res.status(err.status ?? 500).json({ error: safe });
    } else {
      console.error('[ai/extract-labs] unexpected', err);
      res.status(500).json({ error: 'internal error' });
    }
  }
}
