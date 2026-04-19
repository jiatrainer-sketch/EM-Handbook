/**
 * Tolerant JSON extractor for LLM output.
 * - strips markdown fences (```json ... ```)
 * - trims to first {/[ .. last }/]
 * - removes trailing commas (AI common mistake)
 * - attempts to auto-close missing brackets if output was truncated
 */
export function extractJson<T>(raw: string): T {
  let s = raw.trim();

  // 1. Strip markdown fences
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  // 2. Locate JSON region (first { or [ to last } or ])
  const firstBrace = s.indexOf('{');
  const firstBracket = s.indexOf('[');
  const start =
    firstBrace === -1
      ? firstBracket
      : firstBracket === -1
        ? firstBrace
        : Math.min(firstBrace, firstBracket);

  if (start === -1) {
    throw new SyntaxError('no JSON object/array in response');
  }

  const lastBrace = s.lastIndexOf('}');
  const lastBracket = s.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);
  s = end > start ? s.slice(start, end + 1) : s.slice(start);

  // 3. Try as-is
  try {
    return JSON.parse(s) as T;
  } catch {
    // continue to repair attempts
  }

  // 4. Remove trailing commas before } or ]
  let repaired = s.replace(/,(\s*[}\]])/g, '$1');
  try {
    return JSON.parse(repaired) as T;
  } catch {
    // continue
  }

  // 5. If output was truncated (token limit hit), attempt auto-close
  const openBraces = (repaired.match(/\{/g) ?? []).length;
  const closeBraces = (repaired.match(/\}/g) ?? []).length;
  const openBrackets = (repaired.match(/\[/g) ?? []).length;
  const closeBrackets = (repaired.match(/\]/g) ?? []).length;

  // Strip possibly incomplete trailing entry (up to last complete ] or })
  const lastComplete = Math.max(
    repaired.lastIndexOf('"'),
    repaired.lastIndexOf('}'),
    repaired.lastIndexOf(']'),
  );
  if (lastComplete > 0) {
    repaired = repaired.slice(0, lastComplete + 1);
  }
  // Drop trailing partial key:value (cuts after last `,`)
  const lastComma = repaired.lastIndexOf(',');
  if (lastComma > 0 && !/[}\]]\s*$/.test(repaired)) {
    repaired = repaired.slice(0, lastComma);
  }
  // Close unmatched brackets in reverse-open order
  const bracketsToClose: string[] = [];
  if (openBrackets > closeBrackets) {
    for (let i = 0; i < openBrackets - closeBrackets; i++) bracketsToClose.push(']');
  }
  if (openBraces > closeBraces) {
    for (let i = 0; i < openBraces - closeBraces; i++) bracketsToClose.push('}');
  }
  repaired += bracketsToClose.reverse().join('');

  try {
    return JSON.parse(repaired) as T;
  } catch (e) {
    throw e instanceof Error ? e : new SyntaxError('JSON parse failed');
  }
}
