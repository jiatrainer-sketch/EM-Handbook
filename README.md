# EM-Handbook

> คู่มือ Emergency Medicine สำหรับหมอ med รพ.ชุมชน — "อุ่นใจตอนเวร ไม่ใช่เวรกรรม"

## Content authoring

MDX pieces live under `src/content/{scores,drips,orders,ladders,protocols}/`
and must start with a YAML frontmatter block. The **body is the clinical
content only** — do **not** repeat metadata in the body. The following are
rendered automatically from frontmatter + layout and must not appear as
markdown sections in the file:

- `## Related` → rendered by `RelatedLinks` from `frontmatter.related`
- `## Source` / `## References` → rendered by `ContentFooter` from
  `frontmatter.source` and `frontmatter.last_reviewed`
- `## Disclaimer` → always rendered by `ContentFooter`

See `src/types/content.ts` for the full `ContentFrontmatter` schema.
