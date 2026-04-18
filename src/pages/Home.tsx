import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">EM Handbook</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          อุ่นใจตอนเวร ไม่ใช่เวรกรรม
        </p>
      </header>

      <section>
        <div className="rounded-lg border bg-card p-3 text-sm text-muted-foreground">
          🔍 Search bar placeholder
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Browse</h2>
        <ul className="space-y-1 text-sm">
          <li>Scores (10)</li>
          <li>Drips (10)</li>
          <li>Orders (11)</li>
          <li>Ladders (6)</li>
          <li>Protocols (35)</li>
        </ul>
      </section>

      <nav className="flex flex-col gap-2 text-sm">
        <Link to="/tools" className="text-primary underline-offset-4 hover:underline">
          🛠 Tools →
        </Link>
        <Link
          to="/symptoms"
          className="text-primary underline-offset-4 hover:underline"
        >
          🆘 By symptom →
        </Link>
      </nav>
    </div>
  );
}
