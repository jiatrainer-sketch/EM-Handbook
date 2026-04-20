import { ChatError, streamChat } from '../aiClient';
import { buildToolPrompt } from './prompts';
import type { AIToolInput } from './types';

export type { ChatError };

/**
 * Stream AI co-pilot suggestions for a tool.
 * Calls onChunk with accumulated markdown text as tokens arrive.
 * Returns full content string on completion.
 */
export async function streamToolSuggestions(
  input: AIToolInput,
  onChunk: (accumulated: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const userMessage = buildToolPrompt(input);
  const result = await streamChat(
    [{ role: 'user', content: userMessage }],
    onChunk,
    { maxTokens: 1500, signal },
  );
  return result.content;
}
