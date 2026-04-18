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
  maxTokens?: number;
};

type SseEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; usage: ChatUsage; model: string }
  | { type: 'error'; error: string };

/**
 * Stream /api/ai/chat over SSE. Calls onChunk with the full accumulated text
 * after each delta so the UI can replace the message content directly.
 * Resolves with the final ChatResult when the stream closes cleanly.
 * Throws ChatError on API errors, or re-throws DOMException AbortError on cancel.
 */
export async function streamChat(
  messages: ChatMessage[],
  onChunk: (accumulatedText: string) => void,
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

  // Pre-stream errors still come back as JSON (validation / auth failures)
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) msg = body.error;
    } catch {
      // ignore parse failure
    }
    throw new ChatError(msg, res.status);
  }

  if (!res.body) {
    throw new ChatError('เซิร์ฟเวอร์ไม่ส่งข้อมูล', res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';
  let usage: ChatUsage | null = null;
  let model = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by \n\n; parse complete events only
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        for (const line of part.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          let event: SseEvent;
          try {
            event = JSON.parse(line.slice(6)) as SseEvent;
          } catch {
            continue;
          }
          if (event.type === 'delta') {
            accumulated += event.text;
            onChunk(accumulated);
          } else if (event.type === 'done') {
            usage = event.usage;
            model = event.model;
          } else if (event.type === 'error') {
            throw new ChatError(event.error, null);
          }
        }
      }
    }
  } catch (e) {
    reader.cancel().catch(() => undefined);
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    if (e instanceof ChatError) throw e;
    throw new ChatError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด', null);
  }

  return {
    content: accumulated,
    usage: usage ?? {
      input_tokens: 0,
      output_tokens: 0,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
    model: model || 'unknown',
  };
}
