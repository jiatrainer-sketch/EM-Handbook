import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SymptomCard = {
  id: string;
  icon: string;
  title: string;
  titleTh: string;
  comingSoon: boolean;
};

// First 5 are real content pieces created in Session 7; remaining 3 stay
// as "coming soon" stubs until their content is authored.
const SYMPTOMS: SymptomCard[] = [
  {
    id: 'dyspnea',
    icon: '🫁',
    title: 'Dyspnea',
    titleTh: 'หายใจเหนื่อย',
    comingSoon: false,
  },
  {
    id: 'chest-pain',
    icon: '💔',
    title: 'Chest pain',
    titleTh: 'เจ็บหน้าอก',
    comingSoon: false,
  },
  {
    id: 'abdominal-pain',
    icon: '🫃',
    title: 'Abdominal pain',
    titleTh: 'ปวดท้อง',
    comingSoon: false,
  },
  {
    id: 'altered-mental-status',
    icon: '🧠',
    title: 'Altered mental status',
    titleTh: 'สับสน / ซึม',
    comingSoon: false,
  },
  {
    id: 'fever',
    icon: '🔥',
    title: 'Fever',
    titleTh: 'ไข้',
    comingSoon: false,
  },
  {
    id: 'nausea-vomiting',
    icon: '🤢',
    title: 'Nausea / vomiting',
    titleTh: 'คลื่นไส้ อาเจียน',
    comingSoon: true,
  },
  {
    id: 'urinary',
    icon: '💧',
    title: 'Urinary symptoms',
    titleTh: 'ปัสสาวะผิดปกติ',
    comingSoon: true,
  },
  {
    id: 'rash',
    icon: '🟥',
    title: 'Rash',
    titleTh: 'ผื่น',
    comingSoon: true,
  },
];

export default function Symptoms() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">ตามอาการ</h1>
        <p className="text-sm text-muted-foreground">
          เลือกอาการเพื่อดู red flags, workup, protocols ที่เกี่ยวข้อง
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SYMPTOMS.map((s) => {
          const interactive = !s.comingSoon;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!interactive}
                onClick={() => interactive && navigate(`/content/${s.id}`)}
                className={cn(
                  'flex h-full w-full flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left transition-colors',
                  interactive && 'hover:bg-accent',
                  !interactive && 'cursor-not-allowed opacity-60',
                )}
                aria-label={`${s.title} / ${s.titleTh}${s.comingSoon ? ' — เร็วๆ นี้' : ''}`}
              >
                <span className="text-2xl" aria-hidden>
                  {s.icon}
                </span>
                <span className="text-sm font-medium leading-tight">
                  {s.titleTh}
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.title}
                </span>
                {s.comingSoon && (
                  <span className="mt-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-normal text-muted-foreground">
                    เร็วๆ นี้
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
