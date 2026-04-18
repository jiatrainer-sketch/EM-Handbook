import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `คุณคือ AI ผู้ช่วยหมอ med รพ.ชุมชนของไทย — รวม Hospitalist + Emergency Medicine

วิธีตอบ:
- ตอบเป็นภาษาไทย ใช้ศัพท์แพทย์ภาษาอังกฤษเมื่อจำเป็น (drug names, ACLS terms, lab values)
- กระชับ ตรงประเด็น — เน้น actionable: dose, route, frequency, workup, next step
- ใช้ bullet / numbered list; ใช้ code block เมื่อใส่ dosing หรือ order set

ยา + dose:
- ระบุ dose, route, frequency, duration ชัดเจน
- เตือน renal adjustment เมื่อ drug ขับไต (eGFR cutoff + dose ที่แก้แล้ว)
- เตือน elderly dose / frailty พิจารณาเริ่มน้อย titrate
- ห้ามแต่งตัวเลข dose ที่ไม่แน่ใจ — ถ้าไม่รู้ให้บอกว่าไม่ทราบ

บริบท รพ.ชุมชน:
- Resource จำกัด — basic lab, CXR, US bedside ได้; CT/MRI มักต้อง refer
- บอกเมื่อควร refer STAT (เช่น STEMI → PCI center, stroke → thrombolysis center, unstable GIB → endoscopy)
- แนะนำ empirical therapy ที่เริ่มได้ก่อน refer

ถ้าไม่รู้ / ไม่แน่ใจ:
- บอกตรงๆ ว่าไม่ทราบ หรือข้อมูลไม่พอ
- แนะนำแหล่งอ้างอิง (AHA, SSC, IDSA, UpToDate) แทนการเดา
- ไม่ fabricate ตัวเลข protocol หรือ guideline

ข้อจำกัด:
- ไม่ใช่ diagnostic tool — เป็นตัวช่วยคิด, ยืนยันด้วยดุลยพินิจแพทย์เสมอ
- ไม่ทดแทน consult specialty เมื่อเคสซับซ้อน`;

const MODEL = process.env.AI_MODEL ?? 'claude-sonnet-4-6';

const MAX_TOKENS_DEFAULT = 1000;
const MAX_TOKENS_LIMIT = 1500;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

type UsageSummary = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
};

const PRICING: Record<string, { input: number; output: number }> = {
  'claude-opus-4-7': { input: 5, output: 25 },
  'claude-opus-4-6': { input: 5, output: 25 },
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-haiku-4-5': { input: 1, output: 5 },
};

function estimateCostUSD(model: string, usage: UsageSummary): number {
  const p = PRICING[model];
  if (!p) return 0;
  const perTok = (n: number, perMillion: number) => (n / 1_000_000) * perMillion;
  return (
    perTok(usage.input_tokens, p.input) +
    perTok(usage.cache_read_input_tokens, p.input * 0.1) +
    perTok(usage.cache_creation_input_tokens, p.input * 1.25) +
    perTok(usage.output_tokens, p.output)
  );
}

function isChatMessage(x: unknown): x is ChatMessage {
  if (!x || typeof x !== 'object') return false;
  const m = x as { role?: unknown; content?: unknown };
  return (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
}

function sanitize(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .map((m) => ({ role: m.role, content: m.content.trim() }))
    .filter((m) => m.content.length > 0)
    .slice(-20);
}

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

  const body: unknown = req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'invalid body' });
    return;
  }

  const rawMessages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(rawMessages) || !rawMessages.every(isChatMessage)) {
    res.status(400).json({ error: 'messages must be [{role,content}]' });
    return;
  }
  const messages = sanitize(rawMessages);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'last message must be from user' });
    return;
  }

  const requestedMax = (body as { max_tokens?: unknown }).max_tokens;
  const max_tokens = Math.min(
    MAX_TOKENS_LIMIT,
    Math.max(200, typeof requestedMax === 'number' ? requestedMax : MAX_TOKENS_DEFAULT),
  );

  // Switch to SSE streaming
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx/Vercel edge buffering
  res.flushHeaders();

  function send(data: object) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  const client = new Anthropic();
  const t0 = Date.now();

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    });

    for await (const event of stream) {
      if (req.socket?.destroyed) break;
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        send({ type: 'delta', text: event.delta.text });
      }
    }

    const final = await stream.finalMessage();
    const usage: UsageSummary = {
      input_tokens: final.usage.input_tokens,
      output_tokens: final.usage.output_tokens,
      cache_creation_input_tokens: final.usage.cache_creation_input_tokens ?? 0,
      cache_read_input_tokens: final.usage.cache_read_input_tokens ?? 0,
    };

    const cost = estimateCostUSD(MODEL, usage);
    console.info(
      `[ai/chat] model=${MODEL} in=${usage.input_tokens} out=${usage.output_tokens} ` +
        `cache_r=${usage.cache_read_input_tokens} cache_w=${usage.cache_creation_input_tokens} ` +
        `cost=$${cost.toFixed(4)} latency=${Date.now() - t0}ms`,
    );

    send({ type: 'done', usage, model: MODEL });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`[ai/chat] Anthropic ${err.status}: ${err.message}`);
      const safe = err.status && err.status < 500 ? err.message : 'upstream error';
      send({ type: 'error', error: safe });
    } else {
      console.error('[ai/chat] unexpected', err);
      send({ type: 'error', error: 'internal error' });
    }
  } finally {
    res.end();
  }
}
