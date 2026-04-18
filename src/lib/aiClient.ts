export type ChatRole = 'user' | 'assistant';
export type ChatMessage = { role: ChatRole; content: string };

export type ChatUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
};

export type ChatResult = {
  content: string;
  usage: ChatUsage;
  model: string;
};

export class ChatError extends Error {
  status: number | null;
  constructor(message: string, status: number | null) {
    super(message);
    this.name = 'ChatError';
    this.status = status;
  }
}

type SendOptions = {
  signal?: AbortSignal;
  /** Optional per-request ceiling; server still caps at 1500. */
  maxTokens?: number;
};

/** POST /api/ai/chat — the Vercel function owns the API key and model choice. */
export async function sendChat(
  messages: ChatMessage[],
  opts: SendOptions = {},
): Promise<ChatResult> {
  let res: Response;
  try {
    res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, max_tokens: opts.maxTokens }),
      signal: opts.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ChatError(
      e instanceof Error ? e.message : 'เครือข่ายไม่พร้อม',
      null,
    );
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ChatError('เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง', res.status);
  }

  if (!res.ok) {
    const msg =
      body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `HTTP ${res.status}`;
    throw new ChatError(msg, res.status);
  }

  const data = body as Partial<ChatResult>;
  if (typeof data.content !== 'string' || !data.usage || typeof data.model !== 'string') {
    throw new ChatError('เซิร์ฟเวอร์ตอบกลับรูปแบบไม่ถูกต้อง', res.status);
  }
  return data as ChatResult;
}
