import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ⚠️ DEFAULT = SONNET 4.6. See chat.ts for rationale. Do not regress to Opus.
const MODEL = process.env.AI_MODEL ?? 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `คุณเป็น AI OCR ที่เชี่ยวชาญการอ่านรายงาน ABG (arterial blood gas) จากรูปถ่าย
output เครื่อง ABG มาตรฐาน (Radiometer, Siemens, i-STAT, Nova, Roche ฯลฯ).

หน้าที่:
- แตกค่าจากรูป → ส่งกลับเป็น JSON เท่านั้น
- ไม่ต้องวิเคราะห์/interpret — แค่แตกค่า
- ถ้าอ่านไม่ออก/ไม่ชัด → ใส่ null (อย่าเดา)
- units ที่คาดหวัง:
  - pH: no unit, ~6.8–7.8
  - PaCO2 / pCO2: mmHg (~10–100)
  - PaO2 / pO2: mmHg (~30–600)
  - HCO3 / HCO3- / Bicarb: mmol/L หรือ mEq/L (~5–50)
  - FiO2: fraction 0.21–1.0 หรือ percent 21–100 (ส่งกลับเป็น fraction เสมอ)
  - BE (base excess): mmol/L, range -30 to +30
  - Lactate: mmol/L, 0–20
  - Na/K/Ca: mmol/L (ถ้ามีในรูป)
- ห้าม fabricate — if not visible, return null`;

const USER_PROMPT = `แตกค่า ABG จากรูปนี้ ส่งกลับเป็น JSON เท่านั้น (ไม่มี markdown fences, ไม่มีคำอธิบาย):

{
  "pH": number | null,
  "paco2": number | null,
  "pao2": number | null,
  "hco3": number | null,
  "fio2": number | null,
  "be": number | null,
  "lactate": number | null,
  "na": number | null,
  "k": number | null,
  "notes": "string — หมายเหตุพิเศษ เช่น 'อ่านได้ไม่ชัด', หรือ '' ถ้าไม่มี"
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
      max_tokens: 500,
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

    // Parse JSON, stripping optional fences
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
      `[ai/extract-abg] model=${MODEL} in=${result.usage.input_tokens} out=${result.usage.output_tokens} latency=${Date.now() - t0}ms`,
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
      console.error(`[ai/extract-abg] Anthropic ${err.status}: ${err.message}`);
      const safe = err.status && err.status < 500 ? err.message : 'upstream error';
      res.status(err.status ?? 500).json({ error: safe });
    } else {
      console.error('[ai/extract-abg] unexpected', err);
      res.status(500).json({ error: 'internal error' });
    }
  }
}
