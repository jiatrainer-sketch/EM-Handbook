import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-6">
      <section>
        <div className="rounded-lg border bg-card p-3 text-sm text-muted-foreground">
          🔍 ค้นหา...
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          ⭐ Pinned
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg border bg-card p-3">CHA₂DS₂</div>
          <div className="rounded-lg border bg-card p-3">Norepi</div>
          <div className="rounded-lg border bg-card p-3">Sepsis</div>
          <div className="rounded-lg border bg-card p-3">DKA</div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          📂 Browse
        </h2>
        <ul className="divide-y rounded-lg border bg-card text-sm">
          <li className="flex justify-between px-3 py-2.5">
            <span>Scores</span>
            <span className="text-muted-foreground">10</span>
          </li>
          <li className="flex justify-between px-3 py-2.5">
            <span>Drips</span>
            <span className="text-muted-foreground">10</span>
          </li>
          <li className="flex justify-between px-3 py-2.5">
            <span>Orders</span>
            <span className="text-muted-foreground">11</span>
          </li>
          <li className="flex justify-between px-3 py-2.5">
            <span>Ladders</span>
            <span className="text-muted-foreground">6</span>
          </li>
          <li className="flex justify-between px-3 py-2.5">
            <span>Protocols</span>
            <span className="text-muted-foreground">35</span>
          </li>
        </ul>
      </section>

      <nav className="flex flex-col gap-2 text-sm">
        <Link
          to="/tools"
          className="rounded-lg border bg-card px-3 py-3 hover:bg-accent"
        >
          🛠 Tools →
        </Link>
        <Link
          to="/symptoms"
          className="rounded-lg border bg-card px-3 py-3 hover:bg-accent"
        >
          🆘 By symptom →
        </Link>
      </nav>
    </div>
  );
}
