import { useParams } from 'react-router-dom';
import SmokeTest, { frontmatter as smokeFm } from '@/content/_smoke-test.mdx';

export default function Content() {
  const { id } = useParams<{ id: string }>();

  if (id === 'smoke-test') {
    const title = (smokeFm.title as string | undefined) ?? 'Content';
    return (
      <article className="prose prose-sm dark:prose-invert">
        <h1>{title}</h1>
        <SmokeTest />
      </article>
    );
  }

  return (
    <article className="space-y-2">
      <h1 className="text-2xl font-semibold">Content: {id}</h1>
      <p className="text-sm text-muted-foreground">
        Universal MDX content viewer placeholder — renderer comes on Day 3.
      </p>
    </article>
  );
}
