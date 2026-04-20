import { MessageSquare, Wrench, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAiChat } from '@/components/ai/AiChatProvider';
import { Button } from '@/components/ui/button';
import { trackToolUsed } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type ToolCard = {
  icon: string;
  title: string;
  description: string;
  comingSoon: boolean;
  route?: string;
  action?: 'ai' | 'navigate';
};

const TOOLS: ToolCard[] = [
  {
    icon: '🤖',
    title: 'ถาม AI',
    description:
      'ถาม AI เกี่ยวกับ dose, protocol, workup, หรือ consult — ตอบเร็ว กระชับ',
    comingSoon: false,
    action: 'ai',
  },
  {
    icon: '📝',
    title: 'Pre-op Clearance Helper',
    description: 'คำนวณ RCRI + แนะนำ labs + red flags + Thai summary',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/preop',
  },
  {
    icon: '💬',
    title: 'Consult Reply Generator',
    description: 'ช่วยเขียน consult reply แบบมีโครงสร้าง (SOAP) — คัดลอกได้ทันที',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/consult',
  },
  {
    icon: '🫁',
    title: 'Ventilator Quick Start',
    description: 'คำนวณ IBW + mode + TV + PEEP + FiO₂ ตาม scenario + แปล ABG',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/ventilator',
  },
  {
    icon: '🧠',
    title: 'NIHSS Calculator',
    description: 'NIH Stroke Scale — 15 items + interpretation + tPA guide',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/nihss',
  },
  {
    icon: '💊',
    title: 'Drug Dose Calculator',
    description: 'คำนวณ dose + volume + rate ตามน้ำหนัก (epi, amio, insulin, RSI meds)',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/dose-calc',
  },
  {
    icon: '🫧',
    title: 'ABG Analyzer',
    description:
      'แปลผล ABG อัตโนมัติ — primary disorder, compensation (Winter), anion gap, Δ/Δ, P/F, A-a gradient',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/abg',
  },
  {
    icon: '🧂',
    title: 'Electrolyte Calculator',
    description: 'Na correction, K replacement, Ca/Mg/Phos — ขนาดยา + วิธีให้ + ข้อควรระวัง',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/electrolyte',
  },
  {
    icon: '🧠',
    title: 'GCS Calculator',
    description: 'Glasgow Coma Scale — E/V/M + interpretation + intubation threshold',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/gcs',
  },
  {
    icon: '🫘',
    title: 'CrCl / eGFR Calculator',
    description: 'Cockcroft-Gault, MDRD, CKD-EPI 2021 — CKD staging + drug dosing thresholds',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/crcl',
  },
  {
    icon: '⏱',
    title: 'Sepsis Bundle Timer',
    description: 'SSC 1-hr/3-hr/6-hr bundle checklist พร้อม timer นับจาก T0',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/sepsis-timer',
  },
  {
    icon: '💧',
    title: 'Fluid Calculator',
    description: 'Maintenance (Holliday-Segar), Deficit, Bolus, Free water deficit, Transfusion',
    comingSoon: false,
    action: 'navigate',
    route: '/tools/fluid',
  },
];

export default function Tools() {
  const chat = useAiChat();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Tools</h1>
        <p className="text-sm text-muted-foreground">
          เครื่องมือช่วยแพทย์ — ตรวจสอบทุกครั้งก่อนใช้จริง
        </p>
      </div>

      <ul className="space-y-3 text-sm">
        {TOOLS.map((tool) => (
          <li
            key={tool.title}
            className={cn(
              'rounded-lg border bg-card p-3',
              tool.comingSoon && 'opacity-60',
            )}
          >
            <div className="mb-1 flex items-center gap-2 font-medium">
              <span aria-hidden>{tool.icon}</span>
              {tool.title}
              {tool.comingSoon && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
                  เร็วๆ นี้
                </span>
              )}
            </div>
            <p className="mb-3 text-muted-foreground">{tool.description}</p>
            {tool.comingSoon ? (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="cursor-not-allowed"
                aria-label={`${tool.title} — เร็วๆ นี้`}
              >
                <Wrench className="mr-2 h-4 w-4" aria-hidden />
                เร็วๆ นี้
              </Button>
            ) : tool.action === 'ai' ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  trackToolUsed(tool.title);
                  chat.open();
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
                เปิด AI ช่วยเหลือ
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!tool.route) return;
                  trackToolUsed(tool.title);
                  navigate(tool.route);
                }}
              >
                เปิดเครื่องมือ
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            )}
          </li>
        ))}
      </ul>

      <p className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
        ⚠️ เครื่องมือช่วยร่าง/คำนวณเท่านั้น — ตรวจความถูกต้อง + adapt ให้ตรงบริบทคนไข้จริงทุกครั้ง
      </p>
    </div>
  );
}
