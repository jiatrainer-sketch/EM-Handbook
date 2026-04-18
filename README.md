# EM-Handbook (อุ่นใจตอนเวร)

Thai physician emergency medicine reference app.
เปิดมา find fast. ใช้ตอนเวร.

## Features

- 50+ curated clinical content pieces (protocols, drips, scores, symptoms)
- AI chat (Claude Sonnet 4.6, streaming)
- Pre-op Clearance Helper (RCRI calculator)
- Consult Reply Generator (structured SOAP format)
- Ventilator Quick Start (mode + settings by scenario)
- Offline PWA support
- Dark mode
- Search (Thai + English)

## Tech Stack

- React 18 + Vite 5
- TypeScript
- React Router 7
- MDX content + build-time frontmatter registry
- Tailwind + shadcn/ui
- Claude API (Vercel serverless)
- PWA (vite-plugin-pwa)

## Development

```bash
npm install
npm run dev
```

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-xxx
AI_MODEL=claude-sonnet-4-6
```

⚠️ Keep `AI_MODEL` as Sonnet. See [CLAUDE.md](./CLAUDE.md) for why.

## Scripts

```bash
npm install             # Install dependencies
npm run dev             # Start dev server (http://localhost:5173)
npm run build           # Production build
npm run preview         # Preview production build locally
npm run typecheck       # tsc -b --noEmit
npm run build:registry  # Regenerate src/content/_registry.generated.ts
```

Build regenerates the content registry automatically, so you rarely need
to run `build:registry` by itself.

## Content Authoring

### Creating new content

1. Create file: `src/content/<category>/<id>.mdx`
   - Categories: `protocols`, `drips`, `scores`, `symptoms`, `reference`
   - ID: kebab-case (e.g., `pe-pathway.mdx`)
2. Add the frontmatter block (schema below)
3. Write the clinical body only — metadata (related / source / disclaimer)
   is rendered automatically from frontmatter
4. Run `npm run build` (or `npm run build:registry`) — the generated
   registry will pick the new piece up

### Frontmatter schema

```yaml
---
id: kebab-case-id
title: English Title
titleTh: "Thai Title"
category: protocol | drip | score | symptom | reference
subcategory: cardiac      # free-form
tags: [arrest, cardiac, acls]
keywords:
  - en_term
  - คำไทย
related: [content-id-1, content-id-2]
source:
  name: "Guideline or textbook"
  year: 2024
  url: "https://..."       # optional
last_reviewed: "2026-04"
confidence: high | medium | low
severity: critical | high | medium | low
---
```

### Body conventions

The body is **clinical content only**. These sections are auto-rendered
by the framework and must not appear in the file:

- `## Related` → `RelatedLinks` from `frontmatter.related`
- `## Source` / `## References` → `ContentFooter` from `frontmatter.source`
  and `frontmatter.last_reviewed`
- `## Disclaimer` → always rendered by `ContentFooter`

- **BW 60 kg** is the reference adult for weight-based drug calculations
  (mcg/kg/min, mg/kg boluses, mL/hr drip rates) — show the per-kg formula
  first, then the worked example at 60 kg
- MDX escape: `<` → `&lt;`, `>` → `&gt;` (both at start of line and inline)
- Suggested body order: Criteria / Diagnosis → Immediate Actions → Drug
  Preparation → Dose Tables → Monitoring → Pitfalls → Copy-Ready Order

See `src/types/content.ts` for the full `ContentFrontmatter` TypeScript
schema and `src/content/protocols/vf-vt.mdx` for the canonical example.

### Medical accuracy

- Cite guidelines in `source` frontmatter
- Thai-specific drug practices preferred (e.g., Dopa 2:1)
- Verify doses against Thai hospital HAD protocols when available
- Mark uncertain content with `confidence: low`

## Deployment

### Vercel (production)

- Auto-deploys on push to `main`
- Env vars in Vercel dashboard:
  - `ANTHROPIC_API_KEY` (required)
  - `AI_MODEL` (optional, default `claude-sonnet-4-6`)
- Live: https://em-handbook.vercel.app

### Manual deploy

```bash
npm run build
# dist/ is ready for any static host; deploy api/ai/chat.ts to a
# Node-compatible serverless runtime for AI chat.
```

## Project Structure

```
api/ai/chat.ts          # Claude API proxy (Vercel serverless, SSE)
scripts/                # Build-time helpers (content registry)
src/
  components/           # UI components (shadcn + custom)
  content/              # MDX content pieces
    _registry.generated.ts  # auto-generated, do not edit
    protocols/
    drips/
    scores/
    symptoms/
  hooks/                # React hooks
  lib/                  # content loader, search, storage, aiClient
  pages/                # route pages
  types/                # shared TypeScript types
public/                 # static assets (icons, manifest)
```

## Contributing

1. **Medical accuracy first** — cite sources
2. **Follow existing patterns** — view similar content before creating
3. **Mobile-first** — test on narrow viewport
4. **Thai-friendly** — UI Thai, technical terms English
5. **Small commits** — granular history preferred

### Issue reporting

Found medical inaccuracy? File an issue with:
- Content ID affected
- What's wrong
- Recommended correction
- Source citation

## License

- **Code:** MIT License
- **Content:** CC-BY 4.0 (attribution required)
- **Third-party drug guidelines:** cited sources retain their respective licenses

## Acknowledgments

- Thai hospital High Alert Drug protocols (Fakthahospital, Hospital for Tropical Diseases — Mahidol, etc.)
- ACC/AHA, ESC, KDIGO, Surviving Sepsis, IDSA guidelines
- Built with Claude Sonnet 4.6 (Anthropic)
- Inspired by: the need for "ค้นแล้วเจอตอนเวร"

---

**Made with ☕ for Thai ED / med physicians.**
"อุ่นใจตอนเวร"
