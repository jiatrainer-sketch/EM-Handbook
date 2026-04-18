# CLAUDE.md — guidance for Claude Code sessions on this repo

## 🚨 Model choice for the app's AI feature — SONNET, not Opus

The in-app AI assistant (`api/ai/chat.ts`) **must default to Claude Sonnet 4.6**,
not Opus. This has been flipped back to Opus repeatedly by mistake — please
do not do that again.

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
