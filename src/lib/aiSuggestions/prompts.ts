import type { AIToolInput } from './types';

const OUTPUT_STRUCTURE = `
ตอบเป็น markdown ตามโครงสร้างนี้ทุกครั้ง:

### 🔴 Immediate Actions (ทำทันที)
- [3–5 action items, Thai + English technical terms]

### 💊 Drug Recommendations (ยาที่แนะนำ)
**[ชื่อยา (English)]**
- ขนาด: [Dose] — คำนวณจาก BW ที่ระบุ
- วิธีให้: [Route + frequency]
- ระยะเวลา: [Duration, Thai]
- เหตุผล: [1-line rationale, Thai]

(ระบุทุกยาที่แนะนำ)

### ⚠️ ข้อควรระวัง (Warnings)
- [Contraindications, critical pitfalls, interactions]

### 🔬 Labs to Order (แลปเพิ่มเติม)
- [Specific labs relevant to this case]

### 📊 Monitoring Plan (การติดตาม)
- [Parameter]: ทุก [X] ชั่วโมง — เป้าหมาย [target]

### 🚨 เมื่อไหร่ต้อง Escalate
- [Criterion → call senior / ICU / consult specialty]

### 📋 Copy-Ready Order
\`\`\`
Dx: [diagnosis]
BW: [BW] kg

Orders:
- [order 1]
- [order 2]

Monitoring:
- [monitor plan]

Reassess: [timing]
\`\`\`

### 💡 Clinical Pearls
- [Pro tip or common pitfall, 1–3 items]

---
⚠️ AI-generated — verify clinically before use | แพทย์ต้องพิจารณาตามบริบทคนไข้เสมอ`;

const TOOL_CONTEXT: Record<string, string> = {
  electrolyte: `วิเคราะห์ค่าอิเล็กโทรไลต์และแนะนำการรักษา ระบุ IV vs PO, rate, monitoring พิเศษ (เช่น ECG สำหรับ K, respiratory monitor สำหรับ Mg)`,
  gcs: `ประเมิน GCS และแนะนำ next step — airway management, neuroimaging, ยา RSI ถ้าต้อง intubate, neuro consult`,
  crcl: `วิเคราะห์ eGFR/CrCl และแนะนำการปรับยาเฉพาะ — ระบุยาที่ต้องลด dose, ยาที่ต้อง avoid, nephrotoxin alert`,
  'sepsis-timer': `แนะนำ empirical antibiotics และ sepsis bundle ตาม source ที่สงสัย, vasopressor protocol, target endpoints`,
  fluid: `แนะนำกลยุทธ์ fluid resuscitation — type, rate, endpoint monitoring, vasopressor threshold`,
  abg: `วิเคราะห์ ABG อย่างละเอียด — DDx ตาม MUDPILES/HARDUP/ฯลฯ, แนะนำ management ตาม disorder`,
  nihss: `ประเมิน stroke score และแนะนำ — tPA eligibility, BP target, imaging, thrombectomy criteria`,
  'dose-calc': `อธิบายยาที่คำนวณ — preparation, วิธีให้, pitfalls, alternatives`,
  'heart-pathway': `แนะนำ disposition ตาม HEART score — discharge criteria, outpatient follow-up, ACS medications`,
  anticoag: `แนะนำ reversal strategy และ management ตาม anticoagulant ที่ใช้`,
  'shock-index': `วิเคราะห์ shock index และแนะนำ — DDx shock, resuscitation priority, vasopressor choice`,
  preop: `แนะนำ pre-op optimization ตาม cardiac risk — labs, consult, medications to hold/continue`,
  consult: `ช่วยสรุป consult note — problem, assessment, recommendation แบบกระชับ`,
  vent: `แนะนำ ventilator settings ตาม scenario — lung-protective, weaning readiness, ABG targets`,
};

export function buildToolPrompt(input: AIToolInput): string {
  const bw = input.bw ?? 60;
  const context = TOOL_CONTEXT[input.tool] ?? `เครื่องมือ: ${input.tool}`;

  const dataLines = Object.entries(input.data)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `  ${k}: ${v}`)
    .join('\n');

  return `คุณเป็น AI Co-pilot สำหรับเครื่องมือ "${input.tool}" ใน EM Handbook (รพ.ชุมชน ไทย)

บริบทเครื่องมือ: ${context}

ข้อมูลผู้ป่วยปัจจุบัน:
${dataLines || '  (ยังไม่มีข้อมูล — ใช้ค่า standard สำหรับ BW 60 kg)'}

น้ำหนักมาตรฐาน: ${bw} kg (ใช้สำหรับ dose calculation ทุกยา)

${OUTPUT_STRUCTURE}`;
}
