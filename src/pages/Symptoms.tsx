import PieceList from '@/components/home/PieceList';

type SymptomEntry = {
  emoji: string;
  label: string;
  labelTh: string;
  contentIds: string[];
};

const SYMPTOMS: SymptomEntry[] = [
  {
    emoji: '💔',
    label: 'Chest pain',
    labelTh: 'เจ็บหน้าอก',
    contentIds: ['stemi', 'vf-vt', 'svt'],
  },
  {
    emoji: '🧠',
    label: 'Altered mental status',
    labelTh: 'ซึม / สับสน',
    contentIds: [
      'hypoglycemia',
      'stroke-pathway',
      'status-epilepticus',
      'hyperkalemia',
      'dka',
    ],
  },
  {
    emoji: '💧',
    label: 'Shock / Hypotension',
    labelTh: 'ช็อก / ความดันตก',
    contentIds: [
      'septic-shock',
      'anaphylaxis',
      'norepinephrine-drip',
      'dopamine-drip',
    ],
  },
  {
    emoji: '🫁',
    label: 'Dyspnea / Respiratory',
    labelTh: 'หายใจเหนื่อย',
    contentIds: ['anaphylaxis', 'septic-shock'],
  },
  {
    emoji: '🔥',
    label: 'Fever + suspected sepsis',
    labelTh: 'ไข้ + สงสัย sepsis',
    contentIds: ['septic-shock', 'norepinephrine-drip'],
  },
  {
    emoji: '⚡',
    label: 'Seizure',
    labelTh: 'ชัก',
    contentIds: ['status-epilepticus', 'hypoglycemia'],
  },
  {
    emoji: '🩸',
    label: 'Bleeding',
    labelTh: 'เลือดออก',
    contentIds: ['stroke-pathway', 'stemi'],
  },
  {
    emoji: '📈',
    label: 'Hypertensive crisis',
    labelTh: 'ความดันสูงวิกฤต',
    contentIds: [],
  },
  {
    emoji: '🌡',
    label: 'Electrolyte emergency',
    labelTh: 'เกลือแร่ผิดปกติ',
    contentIds: ['hyperkalemia', 'dka'],
  },
  {
    emoji: '🏎',
    label: 'Bradycardia / Tachycardia',
    labelTh: 'หัวใจเต้นผิดปกติ',
    contentIds: ['bradycardia', 'svt', 'vf-vt', 'asystole'],
  },
];

export default function Symptoms() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">ตามอาการ</h1>
        <p className="text-sm text-muted-foreground">
          เลือกอาการ → ดู protocol / drip ที่เกี่ยวข้อง
        </p>
      </div>

      {SYMPTOMS.map((s) => (
        <section key={s.label}>
          <h2 className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-medium">
            <span aria-hidden>{s.emoji}</span>
            <span>{s.label}</span>
            <span className="text-xs text-muted-foreground">· {s.labelTh}</span>
          </h2>
          <PieceList
            ids={s.contentIds}
            variant="row"
            emptyText="ยังไม่มีเนื้อหา — ลองค้นใน Search หรือถาม AI"
          />
        </section>
      ))}
    </div>
  );
}
