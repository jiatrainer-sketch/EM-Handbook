const SYMPTOMS = [
  { emoji: '💔', label: 'Chest pain' },
  { emoji: '🧠', label: 'Altered mental status' },
  { emoji: '💧', label: 'Shock / Hypotension' },
  { emoji: '🫁', label: 'Dyspnea / Respiratory' },
  { emoji: '🔥', label: 'Fever + suspected sepsis' },
  { emoji: '⚡', label: 'Seizure' },
  { emoji: '🩸', label: 'Bleeding' },
  { emoji: '📈', label: 'Hypertensive crisis' },
  { emoji: '🌡', label: 'Electrolyte emergency' },
  { emoji: '🏥', label: 'Pre-op consult' },
];

export default function Symptoms() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">ตามอาการ</h1>
      <ul className="space-y-1 text-sm">
        {SYMPTOMS.map((s) => (
          <li key={s.label} className="rounded-lg border bg-card p-3">
            <span className="mr-2">{s.emoji}</span>
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
