# CLAUDE.md — guidance for Claude Code sessions on this repo

## 🚨 In-app AI feature: Sonnet + SSE streaming (non-negotiable)

The in-app AI assistant (`api/ai/chat.ts`) has two requirements that keep
getting regressed. Please do not regress them:

### 1. Model = `claude-sonnet-4-6` (not Opus)

- Default model: `claude-sonnet-4-6`
- Env var override: `AI_MODEL` on Vercel (keep it `claude-sonnet-4-6`)
- Do **not** change the `??` fallback in `api/ai/chat.ts` to an Opus ID
- Do **not** change `.env.local.example` to an Opus default

Why Sonnet:
- 5× cheaper than Opus ($3/$15 vs $15/$75 per 1M tokens)
- Sufficient quality for Thai medical Q&A at this app's scope
- App budget ceiling is $10/month — an Opus default blows through that in
  ~130 queries; Sonnet gives ~700 queries for the same money

If you genuinely need Opus for a one-off test, flip `AI_MODEL` on Vercel
temporarily and flip it back the same session. Do not commit an Opus default.

### 2. Streaming = SSE (not one-shot)

The handler must use `client.messages.stream(...)` and pipe token deltas
back as Server-Sent Events. Do **not** switch back to `messages.create()`
and JSON response — the user complained explicitly that the app felt slow
when it waited for the full reply.

- Server emits `{type:"delta", text}` per token, then `{type:"done", usage, model}`
- Client (`src/lib/aiClient.ts`) must read `text/event-stream` and surface
  deltas as they arrive
- Do not buffer on the server (`X-Accel-Buffering: no` header is required
  so Vercel's edge does not hold the response)

### Other speed levers (apply in order when the app feels slow)

1. Keep `MAX_TOKENS_DEFAULT` low (currently 600) — shorter answers finish
   sooner. Clients can request up to `MAX_TOKENS_LIMIT` (1500) when needed.
2. Prefer Haiku 4.5 (`claude-haiku-4-5`) for obviously simple lookups if
   we ever add a "quick mode" toggle — 3× faster than Sonnet.
3. System prompt is already wrapped with `cache_control: ephemeral`. If
   the prompt grows past the cache minimum (~1024 tokens for Sonnet),
   prefix cost drops ~10× automatically on repeat calls in a session.
4. Consider moving the handler to Vercel Edge runtime if cold starts
   become a problem — but that requires rewriting the Node SSE handler
   to use Web `ReadableStream` APIs.

## Content authoring policy

MDX pieces live under `src/content/{scores,drips,orders,ladders,protocols}/`
and must start with a YAML frontmatter block. The **body is clinical content
only** — do not repeat metadata. These sections are rendered automatically
from frontmatter and must not appear as markdown in the body:

- `## Related` → `RelatedLinks` from `frontmatter.related`
- `## Source` / `## References` → `ContentFooter` from `frontmatter.source`
  and `frontmatter.last_reviewed`
- `## Disclaimer` → always rendered by `ContentFooter`

See `src/types/content.ts` for the full `ContentFrontmatter` schema and
`src/content/protocols/vf-vt.mdx` for the canonical example.

## MDX gotchas

- `<50 yr` → must be escaped as `&lt; 50 yr` (MDX parses `<` as JSX)
- Same for any `<number` in body text
- Emoji in headings is fine

## Dev branch convention

Feature work lives on `claude/setup-em-handbook-*` branches. Do not push
directly to `main`. Create new commits rather than amending.
