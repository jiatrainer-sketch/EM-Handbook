// GENERATED FILE — do not edit by hand.
// Run `npm run build:registry` (or any `npm run build`) to refresh.
//
// Produced by scripts/generate-content-registry.mjs: every MDX piece's
// frontmatter is bundled here so content.ts can load metadata without
// embedding the raw MDX text in the main JS chunk.

import type { ContentFrontmatter } from '@/types/content';

export type RegistryEntry = {
  id: string;
  path: string;
  frontmatter: Partial<ContentFrontmatter>;
};

export const CONTENT_REGISTRY: RegistryEntry[] = [
  {
    "id": "smoke-test",
    "path": "/src/content/_smoke-test.mdx",
    "frontmatter": {
      "id": "smoke-test",
      "title": "MDX Smoke Test",
      "category": "reference",
      "tags": [
        "dev",
        "fixture"
      ],
      "keywords": [
        "smoke",
        "test",
        "mdx"
      ],
      "related": [
        "smoke-test",
        "does-not-exist"
      ],
      "source": "Dev fixture — not clinical content",
      "last_reviewed": "2025-04",
      "confidence": "high"
    }
  },
  {
    "id": "amiodarone-drip",
    "path": "/src/content/drips/amiodarone-drip.mdx",
    "frontmatter": {
      "id": "amiodarone-drip",
      "title": "Amiodarone Drip",
      "titleTh": "Amiodarone drip",
      "category": "drip",
      "subcategory": "antiarrhythmic",
      "tags": [
        "amiodarone",
        "antiarrhythmic",
        "vf-vt",
        "atrial-fibrillation",
        "icu"
      ],
      "keywords": [
        "amiodarone",
        "Cordarone",
        "antiarrhythmic",
        "VF VT",
        "rapid AF",
        "ยา amiodarone",
        "ยา antiarrhythmic"
      ],
      "related": [
        "vf-vt",
        "svt",
        "bradycardia"
      ],
      "source": {
        "name": "AHA ACLS + ESC Arrhythmia Guidelines",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "dobutamine-drip",
    "path": "/src/content/drips/dobutamine-drip.mdx",
    "frontmatter": {
      "id": "dobutamine-drip",
      "title": "Dobutamine Drip",
      "titleTh": "Dobutamine drip",
      "category": "drip",
      "subcategory": "inotrope",
      "tags": [
        "dobutamine",
        "inotrope",
        "cardiogenic-shock",
        "heart-failure",
        "icu"
      ],
      "keywords": [
        "dobutamine",
        "inotrope",
        "cardiogenic shock",
        "heart failure",
        "low cardiac output",
        "cold wet shock",
        "ยา inotrope"
      ],
      "related": [
        "septic-shock",
        "dopamine-drip",
        "norepinephrine-drip",
        "epinephrine-drip"
      ],
      "source": {
        "name": "ESC Heart Failure Guidelines + ACC/AHA Shock Guidelines",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "dopamine-drip",
    "path": "/src/content/drips/dopamine-drip.mdx",
    "frontmatter": {
      "id": "dopamine-drip",
      "title": "Dopamine Drip",
      "titleTh": "Dopamine drip",
      "category": "drip",
      "subcategory": "inotrope-vasopressor",
      "tags": [
        "dopamine",
        "inotrope",
        "vasopressor",
        "bradycardia",
        "icu"
      ],
      "keywords": [
        "dopamine",
        "inotrope",
        "vasopressor",
        "symptomatic bradycardia",
        "cardiogenic shock",
        "pacing bridge",
        "ยา inotrope"
      ],
      "related": [
        "bradycardia",
        "norepinephrine-drip",
        "septic-shock"
      ],
      "source": {
        "name": "Thai HAD protocols (Fakthahospital; Hospital for Tropical Diseases, Mahidol) + ACC/AHA Bradycardia Guideline",
        "year": 2024
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "epinephrine-drip",
    "path": "/src/content/drips/epinephrine-drip.mdx",
    "frontmatter": {
      "id": "epinephrine-drip",
      "title": "Epinephrine Drip",
      "titleTh": "Epinephrine (Adrenaline) drip",
      "category": "drip",
      "subcategory": "vasopressor",
      "tags": [
        "epinephrine",
        "adrenaline",
        "vasopressor",
        "anaphylaxis",
        "cardiac-arrest",
        "icu"
      ],
      "keywords": [
        "epinephrine",
        "adrenaline",
        "epinephrine drip",
        "anaphylaxis drip",
        "post-arrest",
        "cardiogenic shock",
        "ยา epinephrine",
        "ยา adrenaline"
      ],
      "related": [
        "anaphylaxis",
        "vf-vt",
        "asystole",
        "septic-shock",
        "norepinephrine-drip"
      ],
      "source": {
        "name": "AHA ACLS + Surviving Sepsis Campaign",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "esmolol-drip",
    "path": "/src/content/drips/esmolol-drip.mdx",
    "frontmatter": {
      "id": "esmolol-drip",
      "title": "Esmolol Drip",
      "titleTh": "Esmolol drip",
      "category": "drip",
      "subcategory": "antihypertensive",
      "tags": [
        "esmolol",
        "beta blocker",
        "ultra short acting",
        "aortic dissection"
      ],
      "keywords": [
        "esmolol",
        "ultra-short beta blocker",
        "beta-1 selective",
        "aortic dissection",
        "rate control",
        "thyroid storm",
        "ยา esmolol"
      ],
      "related": [
        "ht-emergency",
        "aortic-dissection",
        "labetalol-drip",
        "thyroid-storm"
      ],
      "source": {
        "name": "ACC/AHA Hypertension Guideline (2017) + ESC",
        "year": 2017
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "labetalol-drip",
    "path": "/src/content/drips/labetalol-drip.mdx",
    "frontmatter": {
      "id": "labetalol-drip",
      "title": "Labetalol Drip",
      "titleTh": "Labetalol drip",
      "category": "drip",
      "subcategory": "antihypertensive",
      "tags": [
        "labetalol",
        "hypertensive emergency",
        "beta blocker",
        "alpha blocker",
        "pregnancy"
      ],
      "keywords": [
        "labetalol",
        "alpha-beta blocker",
        "hypertensive emergency",
        "preeclampsia",
        "aortic dissection",
        "ยา labetalol"
      ],
      "related": [
        "ht-emergency",
        "aortic-dissection",
        "esmolol-drip",
        "nicardipine-drip"
      ],
      "source": {
        "name": "ACC/AHA Hypertension Guideline (2017) + ESC",
        "year": 2017
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "milrinone-drip",
    "path": "/src/content/drips/milrinone-drip.mdx",
    "frontmatter": {
      "id": "milrinone-drip",
      "title": "Milrinone Drip",
      "titleTh": "Milrinone drip",
      "category": "drip",
      "subcategory": "inotrope-vasodilator",
      "tags": [
        "milrinone",
        "inodilator",
        "heart failure",
        "pulmonary hypertension"
      ],
      "keywords": [
        "milrinone",
        "inodilator",
        "phosphodiesterase inhibitor",
        "PDE3",
        "heart failure",
        "cardiogenic shock",
        "pulmonary hypertension",
        "ยา milrinone"
      ],
      "related": [
        "dopamine-drip",
        "norepinephrine-drip",
        "septic-shock"
      ],
      "source": {
        "name": "HFSA/ACC/AHA HF Guideline (2022) + ESC HF",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "nicardipine-drip",
    "path": "/src/content/drips/nicardipine-drip.mdx",
    "frontmatter": {
      "id": "nicardipine-drip",
      "title": "Nicardipine Drip",
      "titleTh": "Nicardipine drip สำหรับ HT emergency",
      "category": "drip",
      "subcategory": "antihypertensive",
      "tags": [
        "nicardipine",
        "antihypertensive",
        "ht-emergency",
        "stroke",
        "icu"
      ],
      "keywords": [
        "nicardipine",
        "cardene",
        "hypertensive emergency",
        "BP control",
        "post-stroke BP",
        "ยาลดความดัน",
        "ความดันสูง"
      ],
      "related": [
        "ht-emergency",
        "stroke-pathway",
        "stemi"
      ],
      "source": {
        "name": "AHA HT Emergency Guideline + Rama HT protocol",
        "year": 2017
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "nitroglycerin-drip",
    "path": "/src/content/drips/nitroglycerin-drip.mdx",
    "frontmatter": {
      "id": "nitroglycerin-drip",
      "title": "Nitroglycerin (NTG) Drip",
      "titleTh": "NTG drip สำหรับ ACS / pulmonary edema",
      "category": "drip",
      "subcategory": "vasodilator",
      "tags": [
        "nitroglycerin",
        "ntg",
        "vasodilator",
        "stemi",
        "pulmonary-edema",
        "chf"
      ],
      "keywords": [
        "nitroglycerin",
        "NTG",
        "GTN",
        "glyceryl trinitrate",
        "vasodilator",
        "pulmonary edema",
        "acute CHF",
        "ACS",
        "ยา nitrate"
      ],
      "related": [
        "stemi",
        "ht-emergency"
      ],
      "source": {
        "name": "ACC/AHA STEMI + HF Guidelines + Rama",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "norepinephrine-drip",
    "path": "/src/content/drips/norepinephrine-drip.mdx",
    "frontmatter": {
      "id": "norepinephrine-drip",
      "title": "Norepinephrine Drip",
      "titleTh": "Norepinephrine (Levophed) drip",
      "category": "drip",
      "subcategory": "vasopressor",
      "tags": [
        "norepinephrine",
        "vasopressor",
        "levophed",
        "shock",
        "icu"
      ],
      "keywords": [
        "norepinephrine",
        "noradrenaline",
        "levophed",
        "NE",
        "vasopressor",
        "septic shock",
        "cardiogenic shock",
        "MAP",
        "titration",
        "ความดันตก",
        "ยา vasopressor"
      ],
      "related": [
        "septic-shock",
        "anaphylaxis",
        "dopamine-drip"
      ],
      "source": {
        "name": "Surviving Sepsis Campaign + Rama IV Drug Drip Reference",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "vasopressin-drip",
    "path": "/src/content/drips/vasopressin-drip.mdx",
    "frontmatter": {
      "id": "vasopressin-drip",
      "title": "Vasopressin Drip",
      "titleTh": "Vasopressin drip",
      "category": "drip",
      "subcategory": "vasopressor",
      "tags": [
        "vasopressin",
        "septic shock",
        "vasopressor",
        "adjunct"
      ],
      "keywords": [
        "vasopressin",
        "AVP",
        "argipressin",
        "catecholamine-sparing",
        "septic shock adjunct",
        "V1a receptor",
        "ยา vasopressin"
      ],
      "related": [
        "septic-shock",
        "norepinephrine-drip",
        "dopamine-drip"
      ],
      "source": {
        "name": "Surviving Sepsis Campaign (2021) + VASST/VANISH trials",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "acetaminophen-overdose",
    "path": "/src/content/protocols/acetaminophen-overdose.mdx",
    "frontmatter": {
      "id": "acetaminophen-overdose",
      "title": "Acetaminophen Overdose",
      "titleTh": "Paracetamol overdose",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "acetaminophen",
        "paracetamol",
        "overdose",
        "poisoning",
        "toxicology",
        "liver",
        "lifesaving"
      ],
      "keywords": [
        "acetaminophen",
        "paracetamol",
        "overdose",
        "APAP",
        "Rumack-Matthew",
        "NAC",
        "N-acetylcysteine",
        "hepatotoxicity",
        "King's College criteria",
        "ยาพารา overdose"
      ],
      "related": [
        "tca-overdose",
        "hypoglycemia"
      ],
      "source": {
        "name": "AAPCC + UpToDate Acetaminophen Poisoning + King's College Criteria",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "acute-cholangitis",
    "path": "/src/content/protocols/acute-cholangitis.mdx",
    "frontmatter": {
      "id": "acute-cholangitis",
      "title": "Acute cholangitis",
      "titleTh": "ท่อน้ำดีอักเสบเฉียบพลัน",
      "category": "protocol",
      "subcategory": "GI",
      "tags": [
        "cholangitis",
        "biliary",
        "ERCP",
        "Charcot triad"
      ],
      "keywords": [
        "cholangitis",
        "Charcot",
        "Reynold",
        "ERCP",
        "biliary sepsis",
        "ท่อน้ำดี",
        "ถุงน้ำดี"
      ],
      "related": [
        "septic-shock"
      ],
      "source": {
        "name": "Tokyo Guidelines 2018 (TG18) + IDSA",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "acute-limb-ischemia",
    "path": "/src/content/protocols/acute-limb-ischemia.mdx",
    "frontmatter": {
      "id": "acute-limb-ischemia",
      "title": "Acute Limb Ischemia",
      "titleTh": "แขน/ขาขาดเลือดเฉียบพลัน",
      "category": "protocol",
      "subcategory": "vascular",
      "tags": [
        "limb ischemia",
        "vascular",
        "embolism",
        "thrombosis",
        "lifesaving"
      ],
      "keywords": [
        "acute limb ischemia",
        "ALI",
        "6 Ps",
        "Rutherford",
        "heparin",
        "embolectomy",
        "peripheral vascular",
        "แขนขาขาดเลือด"
      ],
      "related": [
        "aortic-dissection",
        "pe-pathway",
        "stemi"
      ],
      "source": {
        "name": "ACC/AHA Lower Extremity PAD Guideline (2016) + ESVS",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "acute-pulmonary-edema",
    "path": "/src/content/protocols/acute-pulmonary-edema.mdx",
    "frontmatter": {
      "id": "acute-pulmonary-edema",
      "title": "Acute pulmonary edema (cardiogenic)",
      "titleTh": "น้ำท่วมปอดเฉียบพลัน",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "pulmonary edema",
        "CHF",
        "NIV",
        "lasix"
      ],
      "keywords": [
        "pulmonary edema",
        "CHF",
        "heart failure",
        "LASA",
        "LMNOP",
        "furosemide",
        "nitroglycerin",
        "NIV",
        "BiPAP",
        "น้ำท่วมปอด"
      ],
      "related": [
        "stemi",
        "cardiac-tamponade"
      ],
      "source": {
        "name": "ESC 2021 Acute HF + AHA/ACC 2022",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "adrenal-crisis",
    "path": "/src/content/protocols/adrenal-crisis.mdx",
    "frontmatter": {
      "id": "adrenal-crisis",
      "title": "Adrenal Crisis",
      "titleTh": "Adrenal Crisis ต่อมหมวกไตวายเฉียบพลัน",
      "category": "protocol",
      "subcategory": "endocrine",
      "tags": [
        "adrenal-crisis",
        "adrenal-insufficiency",
        "endocrine-emergency",
        "shock",
        "icu"
      ],
      "keywords": [
        "adrenal crisis",
        "adrenal insufficiency",
        "Addisonian crisis",
        "hydrocortisone",
        "ต่อมหมวกไตวาย",
        "cortisol deficiency"
      ],
      "related": [
        "hypoglycemia",
        "hyperkalemia",
        "septic-shock"
      ],
      "source": {
        "name": "Endocrine Society Clinical Practice Guideline",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "alcoholic-ketoacidosis",
    "path": "/src/content/protocols/alcoholic-ketoacidosis.mdx",
    "frontmatter": {
      "id": "alcoholic-ketoacidosis",
      "title": "Alcoholic ketoacidosis (AKA)",
      "titleTh": "ภาวะกรดคีโตนจากสุรา",
      "category": "protocol",
      "subcategory": "metabolic",
      "tags": [
        "AKA",
        "ketoacidosis",
        "alcohol",
        "thiamine"
      ],
      "keywords": [
        "alcoholic ketoacidosis",
        "AKA",
        "starvation ketosis",
        "thiamine",
        "Wernicke",
        "dextrose",
        "สุรา",
        "เหล้า"
      ],
      "related": [
        "dka",
        "toxic-alcohol-ingestion"
      ],
      "source": {
        "name": "Tintinalli EM + UpToDate",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "anaphylaxis",
    "path": "/src/content/protocols/anaphylaxis.mdx",
    "frontmatter": {
      "id": "anaphylaxis",
      "title": "Anaphylaxis",
      "titleTh": "Anaphylaxis แพ้รุนแรง",
      "category": "protocol",
      "subcategory": "allergy",
      "tags": [
        "anaphylaxis",
        "allergy",
        "emergency",
        "lifesaving",
        "epinephrine"
      ],
      "keywords": [
        "anaphylaxis",
        "allergic reaction",
        "adrenaline",
        "epinephrine",
        "shock",
        "angioedema",
        "แพ้ยา",
        "แพ้อาหาร"
      ],
      "related": [
        "epinephrine-drip",
        "septic-shock"
      ],
      "source": {
        "name": "WAO Anaphylaxis Guidelines",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "aortic-dissection",
    "path": "/src/content/protocols/aortic-dissection.mdx",
    "frontmatter": {
      "id": "aortic-dissection",
      "title": "Aortic Dissection",
      "titleTh": "หลอดเลือดแดงใหญ่ฉีกขาด",
      "category": "protocol",
      "subcategory": "vascular",
      "tags": [
        "aortic dissection",
        "vascular",
        "hypertensive emergency",
        "lifesaving"
      ],
      "keywords": [
        "aortic dissection",
        "Stanford A",
        "Stanford B",
        "tearing chest pain",
        "CTA aorta",
        "TEE",
        "labetalol",
        "esmolol",
        "nitroprusside",
        "หลอดเลือดแดงฉีก"
      ],
      "related": [
        "ht-emergency",
        "stemi",
        "pe-pathway",
        "labetalol-drip",
        "esmolol-drip"
      ],
      "source": {
        "name": "ACC/AHA Thoracic Aortic Disease Guideline (2022) + ESC",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "asystole",
    "path": "/src/content/protocols/asystole.mdx",
    "frontmatter": {
      "id": "asystole",
      "title": "Asystole / PEA",
      "titleTh": "Asystole / PEA ไม่มีชีพจร",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "arrest",
        "cardiac",
        "acls",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "asystole",
        "PEA",
        "pulseless electrical activity",
        "cardiac arrest",
        "flat line",
        "หัวใจหยุดเต้น",
        "ไม่มีชีพจร"
      ],
      "related": [
        "vf-vt",
        "bradycardia",
        "epinephrine-drip",
        "post-arrest-care"
      ],
      "source": {
        "name": "AHA ACLS Guidelines",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "bradycardia",
    "path": "/src/content/protocols/bradycardia.mdx",
    "frontmatter": {
      "id": "bradycardia",
      "title": "Symptomatic Bradycardia",
      "titleTh": "หัวใจเต้นช้ามีอาการ",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "bradycardia",
        "cardiac",
        "acls",
        "emergency"
      ],
      "keywords": [
        "bradycardia",
        "slow heart rate",
        "heart block",
        "AV block",
        "pacing",
        "atropine",
        "หัวใจช้า"
      ],
      "related": [
        "vf-vt",
        "asystole",
        "dopamine-drip",
        "epinephrine-drip"
      ],
      "source": {
        "name": "AHA ACLS Guidelines",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "cardiac-tamponade",
    "path": "/src/content/protocols/cardiac-tamponade.mdx",
    "frontmatter": {
      "id": "cardiac-tamponade",
      "title": "Cardiac tamponade",
      "titleTh": "ภาวะหัวใจถูกบีบรัดจากน้ำรอบหัวใจ",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "tamponade",
        "pericardial effusion",
        "pericardiocentesis"
      ],
      "keywords": [
        "cardiac tamponade",
        "pericardial effusion",
        "Beck's triad",
        "pulsus paradoxus",
        "pericardiocentesis",
        "หัวใจถูกบีบ"
      ],
      "related": [
        "acute-pulmonary-edema"
      ],
      "source": {
        "name": "ESC 2015 pericardial + ACLS",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "diabetic-foot-infection",
    "path": "/src/content/protocols/diabetic-foot-infection.mdx",
    "frontmatter": {
      "id": "diabetic-foot-infection",
      "title": "Diabetic foot infection",
      "titleTh": "แผลติดเชื้อที่เท้าในผู้ป่วยเบาหวาน",
      "category": "protocol",
      "subcategory": "ID",
      "tags": [
        "diabetic foot",
        "cellulitis",
        "osteomyelitis",
        "necrotizing fasciitis"
      ],
      "keywords": [
        "diabetic foot",
        "cellulitis",
        "osteomyelitis",
        "gangrene",
        "debridement",
        "แผลเบาหวาน",
        "แผลติดเชื้อ"
      ],
      "related": [
        "septic-shock"
      ],
      "source": {
        "name": "IDSA 2023 Diabetic Foot Infection guidelines",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "dka",
    "path": "/src/content/protocols/dka.mdx",
    "frontmatter": {
      "id": "dka",
      "title": "Diabetic Ketoacidosis (DKA)",
      "titleTh": "DKA น้ำตาลสูง ketoacidosis",
      "category": "protocol",
      "subcategory": "endocrine",
      "tags": [
        "dka",
        "endocrine",
        "diabetes",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "DKA",
        "diabetic ketoacidosis",
        "ketoacidosis",
        "hyperglycemia",
        "anion gap",
        "insulin drip",
        "HHS",
        "เบาหวานวิกฤต",
        "น้ำตาลสูง"
      ],
      "related": [
        "hyperkalemia",
        "hypoglycemia",
        "septic-shock"
      ],
      "source": {
        "name": "ADA Consensus + Thai Endocrine Society",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "ht-emergency",
    "path": "/src/content/protocols/ht-emergency.mdx",
    "frontmatter": {
      "id": "ht-emergency",
      "title": "Hypertensive Emergency",
      "titleTh": "HT Emergency ความดันสูงรุนแรงฉุกเฉิน",
      "category": "protocol",
      "subcategory": "cardiology",
      "tags": [
        "ht-emergency",
        "hypertension",
        "crisis",
        "end-organ-damage",
        "icu"
      ],
      "keywords": [
        "hypertensive emergency",
        "hypertensive crisis",
        "HT crisis",
        "ความดันสูงฉุกเฉิน",
        "ความดันสูงวิกฤต",
        "malignant HT",
        "end organ damage"
      ],
      "related": [
        "stemi",
        "stroke-pathway",
        "nicardipine-drip",
        "nitroglycerin-drip"
      ],
      "source": {
        "name": "AHA Guideline + Thai HT Society",
        "year": 2017
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "hyperkalemia",
    "path": "/src/content/protocols/hyperkalemia.mdx",
    "frontmatter": {
      "id": "hyperkalemia",
      "title": "Hyperkalemia",
      "titleTh": "Hyperkalemia โพแทสเซียมสูง",
      "category": "protocol",
      "subcategory": "electrolyte",
      "tags": [
        "hyperkalemia",
        "electrolyte",
        "renal",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "hyperkalemia",
        "hyperK",
        "high potassium",
        "K high",
        "peaked T",
        "wide QRS",
        "โพแทสเซียมสูง",
        "K สูง"
      ],
      "related": [
        "vf-vt",
        "asystole",
        "bradycardia",
        "dka"
      ],
      "source": {
        "name": "KDIGO Clinical Practice Guideline + Thai Nephrology Society",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "hypertensive-emergency-pregnancy",
    "path": "/src/content/protocols/hypertensive-emergency-pregnancy.mdx",
    "frontmatter": {
      "id": "hypertensive-emergency-pregnancy",
      "title": "Hypertensive emergency in pregnancy (severe pre-eclampsia / eclampsia)",
      "titleTh": "ความดันสูงวิกฤตในหญิงตั้งครรภ์",
      "category": "protocol",
      "subcategory": "OB",
      "tags": [
        "pregnancy",
        "preeclampsia",
        "eclampsia",
        "MgSO4"
      ],
      "keywords": [
        "preeclampsia",
        "eclampsia",
        "HELLP",
        "magnesium sulfate",
        "labetalol",
        "hydralazine",
        "ตั้งครรภ์",
        "ครรภ์เป็นพิษ"
      ],
      "related": [
        "severe-hypertension"
      ],
      "source": {
        "name": "ACOG 2020 + Thai RTCOG guideline",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "hypocalcemia-symptomatic",
    "path": "/src/content/protocols/hypocalcemia-symptomatic.mdx",
    "frontmatter": {
      "id": "hypocalcemia-symptomatic",
      "title": "Symptomatic Hypocalcemia",
      "titleTh": "แคลเซียมต่ำมีอาการ",
      "category": "protocol",
      "subcategory": "endo-electrolyte",
      "tags": [
        "hypocalcemia",
        "calcium",
        "tetany",
        "electrolyte",
        "emergency"
      ],
      "keywords": [
        "hypocalcemia",
        "low calcium",
        "tetany",
        "Chvostek",
        "Trousseau",
        "calcium gluconate",
        "corrected calcium",
        "QT prolongation",
        "hypomagnesemia",
        "แคลเซียมต่ำ",
        "ชักเกร็ง"
      ],
      "related": [
        "hyperkalemia",
        "hyponatremia-symptomatic",
        "hypocalcemia-symptomatic"
      ],
      "source": {
        "name": "Endocrine Society Clinical Practice Guideline + KDIGO",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "hypoglycemia",
    "path": "/src/content/protocols/hypoglycemia.mdx",
    "frontmatter": {
      "id": "hypoglycemia",
      "title": "Hypoglycemia",
      "titleTh": "Hypoglycemia น้ำตาลต่ำ",
      "category": "protocol",
      "subcategory": "endocrine",
      "tags": [
        "hypoglycemia",
        "endocrine",
        "diabetes",
        "emergency"
      ],
      "keywords": [
        "hypoglycemia",
        "hypo",
        "low blood sugar",
        "low glucose",
        "D50",
        "glucagon",
        "sulfonylurea",
        "octreotide",
        "น้ำตาลต่ำ",
        "น้ำตาลลด"
      ],
      "related": [
        "dka",
        "septic-shock"
      ],
      "source": {
        "name": "ADA Standards of Care + Thai Endocrine Society",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "hyponatremia-symptomatic",
    "path": "/src/content/protocols/hyponatremia-symptomatic.mdx",
    "frontmatter": {
      "id": "hyponatremia-symptomatic",
      "title": "Symptomatic Hyponatremia",
      "titleTh": "โซเดียมต่ำมีอาการ",
      "category": "protocol",
      "subcategory": "endo-electrolyte",
      "tags": [
        "hyponatremia",
        "sodium",
        "seizure",
        "electrolyte",
        "emergency",
        "ods"
      ],
      "keywords": [
        "hyponatremia",
        "low sodium",
        "3% NaCl",
        "hypertonic saline",
        "osmotic demyelination",
        "ODS",
        "SIADH",
        "cerebral salt wasting",
        "โซเดียมต่ำ"
      ],
      "related": [
        "hypocalcemia-symptomatic",
        "status-epilepticus",
        "hyperkalemia"
      ],
      "source": {
        "name": "European / US Hyponatremia Guidelines + Harrison's",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "meningitis-empiric",
    "path": "/src/content/protocols/meningitis-empiric.mdx",
    "frontmatter": {
      "id": "meningitis-empiric",
      "title": "Bacterial Meningitis — Empiric Therapy",
      "titleTh": "Meningitis รักษาแบบ empiric",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "meningitis",
        "cns-infection",
        "empiric",
        "antibiotic",
        "dexamethasone",
        "icu"
      ],
      "keywords": [
        "meningitis",
        "bacterial meningitis",
        "เยื่อหุ้มสมองอักเสบ",
        "CSF",
        "LP",
        "lumbar puncture",
        "dexamethasone",
        "ceftriaxone"
      ],
      "related": [
        "status-epilepticus",
        "septic-shock"
      ],
      "source": {
        "name": "IDSA Bacterial Meningitis Guideline",
        "year": 2004
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "pe-pathway",
    "path": "/src/content/protocols/pe-pathway.mdx",
    "frontmatter": {
      "id": "pe-pathway",
      "title": "Pulmonary Embolism — Pathway",
      "titleTh": "PE ลิ่มเลือดอุดปอด",
      "category": "protocol",
      "subcategory": "pulmonary",
      "tags": [
        "pe",
        "pulmonary embolism",
        "dvt",
        "anticoagulation",
        "lifesaving"
      ],
      "keywords": [
        "pulmonary embolism",
        "PE",
        "Wells score",
        "PERC",
        "D-dimer",
        "CTPA",
        "heparin",
        "enoxaparin",
        "rivaroxaban",
        "apixaban",
        "alteplase",
        "massive PE",
        "ลิ่มเลือด",
        "ลิ่มเลือดอุดปอด"
      ],
      "related": [
        "wells-pe",
        "aortic-dissection",
        "severe-asthma",
        "norepinephrine-drip"
      ],
      "source": {
        "name": "ESC 2019 Pulmonary Embolism Guideline + ACCP/CHEST 2021",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "septic-shock",
    "path": "/src/content/protocols/septic-shock.mdx",
    "frontmatter": {
      "id": "septic-shock",
      "title": "Septic Shock",
      "titleTh": "Septic Shock ติดเชื้อในกระแสเลือดรุนแรง",
      "category": "protocol",
      "subcategory": "sepsis",
      "tags": [
        "sepsis",
        "septic-shock",
        "emergency",
        "icu",
        "lifesaving"
      ],
      "keywords": [
        "sepsis",
        "septic shock",
        "bundle",
        "antibiotic",
        "norepinephrine",
        "lactate",
        "qSOFA",
        "ติดเชื้อ",
        "ความดันตก"
      ],
      "related": [
        "norepinephrine-drip",
        "anaphylaxis",
        "qsofa",
        "sofa"
      ],
      "source": {
        "name": "Surviving Sepsis Campaign Guidelines",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "severe-asthma",
    "path": "/src/content/protocols/severe-asthma.mdx",
    "frontmatter": {
      "id": "severe-asthma",
      "title": "Severe Asthma Exacerbation",
      "titleTh": "Asthma กำเริบรุนแรง",
      "category": "protocol",
      "subcategory": "pulmonary",
      "tags": [
        "asthma",
        "bronchospasm",
        "exacerbation",
        "respiratory",
        "icu"
      ],
      "keywords": [
        "asthma",
        "severe asthma",
        "status asthmaticus",
        "หอบหืด",
        "หอบหืดกำเริบ",
        "bronchospasm",
        "salbutamol",
        "ipratropium",
        "magnesium"
      ],
      "related": [
        "anaphylaxis"
      ],
      "source": {
        "name": "GINA Guideline + Thai Asthma Guideline",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "status-epilepticus",
    "path": "/src/content/protocols/status-epilepticus.mdx",
    "frontmatter": {
      "id": "status-epilepticus",
      "title": "Status Epilepticus",
      "titleTh": "Status Epilepticus ชักต่อเนื่อง",
      "category": "protocol",
      "subcategory": "neurology",
      "tags": [
        "status-epilepticus",
        "seizure",
        "neurology",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "status epilepticus",
        "SE",
        "seizure",
        "convulsive",
        "refractory",
        "lorazepam",
        "diazepam",
        "phenytoin",
        "levetiracetam",
        "midazolam",
        "ชัก",
        "ชักต่อเนื่อง"
      ],
      "related": [
        "hypoglycemia",
        "stroke-pathway"
      ],
      "source": {
        "name": "AES (American Epilepsy Society) Guideline",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "stemi",
    "path": "/src/content/protocols/stemi.mdx",
    "frontmatter": {
      "id": "stemi",
      "title": "ST-Elevation MI (STEMI)",
      "titleTh": "STEMI หัวใจขาดเลือดเฉียบพลัน",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "stemi",
        "mi",
        "acs",
        "cardiac",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "STEMI",
        "MI",
        "myocardial infarction",
        "heart attack",
        "ST elevation",
        "PCI",
        "fibrinolytic",
        "streptokinase",
        "tenecteplase",
        "aspirin",
        "clopidogrel",
        "ticagrelor",
        "หัวใจขาดเลือด",
        "หัวใจวาย"
      ],
      "related": [
        "vf-vt",
        "bradycardia",
        "stroke-pathway",
        "norepinephrine-drip"
      ],
      "source": {
        "name": "ACC/AHA STEMI Guidelines + Thai Heart Association",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "stroke-pathway",
    "path": "/src/content/protocols/stroke-pathway.mdx",
    "frontmatter": {
      "id": "stroke-pathway",
      "title": "Acute Stroke Pathway",
      "titleTh": "Stroke อัมพาตเฉียบพลัน",
      "category": "protocol",
      "subcategory": "neurology",
      "tags": [
        "stroke",
        "neurology",
        "tpa",
        "thrombolysis",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "stroke",
        "CVA",
        "ischemic stroke",
        "hemorrhagic stroke",
        "tPA",
        "alteplase",
        "NIHSS",
        "thrombectomy",
        "fast track",
        "อัมพาต",
        "stroke fast track"
      ],
      "related": [
        "stemi",
        "status-epilepticus",
        "hypoglycemia"
      ],
      "source": {
        "name": "AHA/ASA Guidelines + Thai Stroke Society Fast Track",
        "year": 2019
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "subarachnoid-hemorrhage",
    "path": "/src/content/protocols/subarachnoid-hemorrhage.mdx",
    "frontmatter": {
      "id": "subarachnoid-hemorrhage",
      "title": "Subarachnoid hemorrhage (SAH)",
      "titleTh": "เลือดออกใต้เยื่อหุ้มสมอง",
      "category": "protocol",
      "subcategory": "neuro",
      "tags": [
        "SAH",
        "thunderclap headache",
        "aneurysm",
        "nimodipine"
      ],
      "keywords": [
        "SAH",
        "aneurysm",
        "thunderclap",
        "worst headache",
        "Hunt-Hess",
        "vasospasm",
        "ปวดหัว",
        "เลือดออกสมอง"
      ],
      "related": [
        "stroke-pathway",
        "status-epilepticus"
      ],
      "source": {
        "name": "AHA/ASA 2023 SAH guidelines",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "svt",
    "path": "/src/content/protocols/svt.mdx",
    "frontmatter": {
      "id": "svt",
      "title": "Supraventricular Tachycardia (SVT)",
      "titleTh": "SVT หัวใจเต้นเร็วผิดปกติ",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "svt",
        "tachycardia",
        "cardiac",
        "acls",
        "emergency"
      ],
      "keywords": [
        "SVT",
        "supraventricular tachycardia",
        "AVNRT",
        "narrow complex tachycardia",
        "adenosine",
        "cardioversion",
        "vagal maneuvers",
        "หัวใจเต้นเร็ว"
      ],
      "related": [
        "vf-vt",
        "bradycardia",
        "adenosine"
      ],
      "source": {
        "name": "AHA ACLS Guidelines",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "tachyarrhythmia-unstable",
    "path": "/src/content/protocols/tachyarrhythmia-unstable.mdx",
    "frontmatter": {
      "id": "tachyarrhythmia-unstable",
      "title": "Unstable Tachyarrhythmia",
      "titleTh": "หัวใจเต้นเร็วผิดจังหวะ มีอาการ",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "tachyarrhythmia",
        "cardioversion",
        "acls",
        "cardiac",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "unstable tachycardia",
        "synchronized cardioversion",
        "SVT",
        "AF",
        "atrial fibrillation",
        "VT",
        "ventricular tachycardia",
        "amiodarone",
        "etomidate",
        "หัวใจเต้นเร็ว"
      ],
      "related": [
        "svt",
        "vf-vt",
        "bradycardia",
        "amiodarone-drip"
      ],
      "source": {
        "name": "AHA ACLS (2020) + ESC 2020 Tachycardia",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "tca-overdose",
    "path": "/src/content/protocols/tca-overdose.mdx",
    "frontmatter": {
      "id": "tca-overdose",
      "title": "Tricyclic Antidepressant Overdose",
      "titleTh": "TCA overdose",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "tca",
        "overdose",
        "poisoning",
        "toxicology",
        "lifesaving"
      ],
      "keywords": [
        "TCA",
        "tricyclic",
        "amitriptyline",
        "nortriptyline",
        "imipramine",
        "overdose",
        "sodium bicarbonate",
        "NaHCO3",
        "wide QRS",
        "seizure",
        "TCA overdose",
        "ยาแก้ซึมเศร้า overdose"
      ],
      "related": [
        "status-epilepticus",
        "acetaminophen-overdose",
        "hyperkalemia"
      ],
      "source": {
        "name": "AACT/EAPCCT Position Paper (2018) + UpToDate Poisoning",
        "year": 2018
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "thyroid-storm",
    "path": "/src/content/protocols/thyroid-storm.mdx",
    "frontmatter": {
      "id": "thyroid-storm",
      "title": "Thyroid Storm",
      "titleTh": "Thyroid Storm ไทรอยด์เป็นพิษวิกฤต",
      "category": "protocol",
      "subcategory": "endocrine",
      "tags": [
        "thyroid-storm",
        "thyrotoxicosis",
        "endocrine-emergency",
        "icu"
      ],
      "keywords": [
        "thyroid storm",
        "thyrotoxic crisis",
        "hyperthyroid crisis",
        "ไทรอยด์เป็นพิษ",
        "ไทรอยด์วิกฤต",
        "Burch-Wartofsky",
        "PTU",
        "methimazole"
      ],
      "related": [
        "adrenal-crisis"
      ],
      "source": {
        "name": "ATA Hyperthyroidism Guideline",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "toxic-alcohol-ingestion",
    "path": "/src/content/protocols/toxic-alcohol-ingestion.mdx",
    "frontmatter": {
      "id": "toxic-alcohol-ingestion",
      "title": "Toxic alcohol ingestion (methanol, ethylene glycol)",
      "titleTh": "พิษจากแอลกอฮอล์พิษ (เมทานอล, เอทิลีน ไกลคอล)",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "methanol",
        "ethylene glycol",
        "toxic alcohol",
        "fomepizole"
      ],
      "keywords": [
        "methanol",
        "ethylene glycol",
        "antifreeze",
        "wood alcohol",
        "fomepizole",
        "ethanol antidote",
        "osmolar gap",
        "เมทานอล",
        "แอลกอฮอล์ปลอม"
      ],
      "related": [
        "acid-base-abg-interpretation",
        "alcoholic-ketoacidosis"
      ],
      "source": {
        "name": "AACT 2002 + UpToDate",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "ugib-variceal",
    "path": "/src/content/protocols/ugib-variceal.mdx",
    "frontmatter": {
      "id": "ugib-variceal",
      "title": "UGIB — Variceal Bleeding",
      "titleTh": "UGIB เลือดออกจากเส้นเลือดขอด (varices)",
      "category": "protocol",
      "subcategory": "gastrointestinal",
      "tags": [
        "ugib",
        "variceal-bleed",
        "varices",
        "cirrhosis",
        "portal-htn",
        "icu"
      ],
      "keywords": [
        "UGIB",
        "variceal bleeding",
        "esophageal varices",
        "gastric varices",
        "เลือดออกทางเดินอาหาร",
        "เส้นเลือดขอด",
        "terlipressin",
        "octreotide",
        "band ligation",
        "Sengstaken-Blakemore",
        "portal hypertension",
        "cirrhosis"
      ],
      "related": [
        "septic-shock"
      ],
      "source": {
        "name": "AASLD + Baveno VI/VII Consensus",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "vf-vt",
    "path": "/src/content/protocols/vf-vt.mdx",
    "frontmatter": {
      "id": "vf-vt",
      "title": "VF/VT (Pulseless)",
      "titleTh": "VF/VT ไม่มีชีพจร",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "arrest",
        "cardiac",
        "acls",
        "emergency",
        "lifesaving"
      ],
      "keywords": [
        "VF",
        "VT",
        "ventricular fibrillation",
        "pulseless VT",
        "cardiac arrest",
        "defibrillation",
        "ACLS",
        "หัวใจหยุดเต้น",
        "ช็อตไฟฟ้า"
      ],
      "related": [
        "asystole",
        "bradycardia",
        "amiodarone-drip",
        "epinephrine-drip",
        "post-arrest-care"
      ],
      "source": {
        "name": "AHA ACLS Guidelines",
        "year": 2020,
        "url": "https://cpr.heart.org"
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "curb-65",
    "path": "/src/content/scores/curb-65.mdx",
    "frontmatter": {
      "id": "curb-65",
      "title": "CURB-65 Score",
      "titleTh": "CURB-65 ประเมินความรุนแรง CAP",
      "category": "score",
      "subcategory": "pulmonary",
      "tags": [
        "curb-65",
        "pneumonia",
        "cap",
        "respiratory",
        "severity"
      ],
      "keywords": [
        "CURB-65",
        "CURB 65",
        "community acquired pneumonia",
        "CAP",
        "pneumonia severity",
        "admit",
        "ปอดบวม"
      ],
      "related": [
        "septic-shock",
        "qsofa"
      ],
      "source": {
        "name": "Lim et al. / BTS Guidelines",
        "year": 2003
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "gcs",
    "path": "/src/content/scores/gcs.mdx",
    "frontmatter": {
      "id": "gcs",
      "title": "Glasgow Coma Scale (GCS)",
      "titleTh": "GCS ประเมินระดับความรู้สึกตัว",
      "category": "score",
      "subcategory": "neurology",
      "tags": [
        "gcs",
        "neurology",
        "consciousness",
        "trauma"
      ],
      "keywords": [
        "GCS",
        "Glasgow Coma Scale",
        "eye opening",
        "motor response",
        "verbal response",
        "coma",
        "head injury",
        "ระดับความรู้สึกตัว",
        "GCS score"
      ],
      "related": [
        "stroke-pathway",
        "status-epilepticus",
        "hypoglycemia"
      ],
      "source": {
        "name": "Teasdale & Jennett, Lancet 1974 / Thai Trauma",
        "year": 1974
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "heart-score",
    "path": "/src/content/scores/heart-score.mdx",
    "frontmatter": {
      "id": "heart-score",
      "title": "HEART Score",
      "titleTh": "HEART Score ประเมิน chest pain ที่ ED",
      "category": "score",
      "subcategory": "cardiology",
      "tags": [
        "heart-score",
        "chest-pain",
        "acs",
        "triage",
        "cardiology"
      ],
      "keywords": [
        "HEART",
        "chest pain",
        "ACS",
        "MACE",
        "risk stratification",
        "troponin",
        "เจ็บหน้าอก"
      ],
      "related": [
        "stemi"
      ],
      "source": {
        "name": "Backus et al. Neth Heart J",
        "year": 2008
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "nihss",
    "path": "/src/content/scores/nihss.mdx",
    "frontmatter": {
      "id": "nihss",
      "title": "NIH Stroke Scale (NIHSS)",
      "titleTh": "NIHSS ประเมินความรุนแรง stroke",
      "category": "score",
      "subcategory": "neurology",
      "tags": [
        "nihss",
        "stroke",
        "neurology",
        "tpa",
        "severity"
      ],
      "keywords": [
        "NIHSS",
        "NIH Stroke Scale",
        "stroke severity",
        "tPA",
        "thrombectomy",
        "ประเมิน stroke"
      ],
      "related": [
        "stroke-pathway",
        "gcs"
      ],
      "source": {
        "name": "NINDS NIH Stroke Scale",
        "year": 1989
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "qsofa",
    "path": "/src/content/scores/qsofa.mdx",
    "frontmatter": {
      "id": "qsofa",
      "title": "qSOFA Score",
      "titleTh": "qSOFA คะแนนคัดกรอง sepsis",
      "category": "score",
      "subcategory": "sepsis",
      "tags": [
        "qsofa",
        "sepsis",
        "screening",
        "emergency"
      ],
      "keywords": [
        "qSOFA",
        "quick SOFA",
        "sepsis screening",
        "sepsis",
        "sepsis-3",
        "คัดกรอง sepsis"
      ],
      "related": [
        "septic-shock",
        "norepinephrine-drip"
      ],
      "source": {
        "name": "Sepsis-3 Consensus (JAMA 2016)",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "rcri",
    "path": "/src/content/scores/rcri.mdx",
    "frontmatter": {
      "id": "rcri",
      "title": "RCRI — Revised Cardiac Risk Index",
      "titleTh": "RCRI ประเมินความเสี่ยงหัวใจก่อนผ่าตัด",
      "category": "score",
      "subcategory": "cardiac",
      "tags": [
        "rcri",
        "preop",
        "cardiac risk",
        "perioperative"
      ],
      "keywords": [
        "RCRI",
        "Revised Cardiac Risk Index",
        "Lee index",
        "perioperative",
        "pre-operative",
        "cardiac risk",
        "noncardiac surgery",
        "pre-op"
      ],
      "related": [
        "wells-pe",
        "sofa",
        "stemi"
      ],
      "source": {
        "name": "Lee TH et al. Circulation 1999 + ACC/AHA Perioperative Guideline 2014",
        "year": 2014
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "sofa",
    "path": "/src/content/scores/sofa.mdx",
    "frontmatter": {
      "id": "sofa",
      "title": "SOFA Score",
      "titleTh": "SOFA score ประเมินอวัยวะล้มเหลวในภาวะวิกฤต",
      "category": "score",
      "subcategory": "sepsis",
      "tags": [
        "sofa",
        "sepsis",
        "organ failure",
        "icu",
        "mortality"
      ],
      "keywords": [
        "SOFA",
        "Sequential Organ Failure Assessment",
        "sepsis",
        "mortality",
        "organ failure",
        "qSOFA",
        "ICU severity"
      ],
      "related": [
        "qsofa",
        "septic-shock",
        "wells-pe",
        "rcri"
      ],
      "source": {
        "name": "Vincent JL et al. Intensive Care Med 1996 + Sepsis-3 (2016)",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "wells-pe",
    "path": "/src/content/scores/wells-pe.mdx",
    "frontmatter": {
      "id": "wells-pe",
      "title": "Wells Score for Pulmonary Embolism",
      "titleTh": "Wells score สำหรับ PE",
      "category": "score",
      "subcategory": "pulmonary",
      "tags": [
        "wells",
        "pe",
        "pulmonary embolism",
        "risk stratification"
      ],
      "keywords": [
        "Wells score",
        "pulmonary embolism",
        "PE risk",
        "D-dimer",
        "CTPA",
        "PERC"
      ],
      "related": [
        "pe-pathway",
        "sofa"
      ],
      "source": {
        "name": "Wells PS et al. Ann Intern Med 2001 + ESC 2019 PE Guideline",
        "year": 2019
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "abdominal-pain",
    "path": "/src/content/symptoms/abdominal-pain.mdx",
    "frontmatter": {
      "id": "abdominal-pain",
      "title": "Abdominal Pain",
      "titleTh": "ปวดท้อง",
      "category": "symptom",
      "subcategory": "gi",
      "tags": [
        "abdominal pain",
        "acute abdomen",
        "gi",
        "surgical"
      ],
      "keywords": [
        "abdominal pain",
        "acute abdomen",
        "peritonitis",
        "AAA",
        "bowel obstruction",
        "appendicitis",
        "cholecystitis",
        "ปวดท้อง"
      ],
      "related": [
        "ugib-variceal",
        "dka",
        "sepsis-shock",
        "aortic-dissection"
      ],
      "source": {
        "name": "Tintinalli + Sabiston + ACS Acute Care Surgery",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "altered-mental-status",
    "path": "/src/content/symptoms/altered-mental-status.mdx",
    "frontmatter": {
      "id": "altered-mental-status",
      "title": "Altered Mental Status",
      "titleTh": "สับสน / ซึม / ไม่รู้สึกตัว",
      "category": "symptom",
      "subcategory": "neuro",
      "tags": [
        "altered mental status",
        "AMS",
        "confusion",
        "coma",
        "neuro"
      ],
      "keywords": [
        "altered mental status",
        "AMS",
        "confusion",
        "delirium",
        "coma",
        "GCS",
        "AEIOU TIPS",
        "สับสน",
        "ซึม",
        "ไม่รู้สึกตัว"
      ],
      "related": [
        "hypoglycemia",
        "stroke-pathway",
        "meningitis-empiric",
        "thyroid-storm",
        "status-epilepticus",
        "hyponatremia-symptomatic"
      ],
      "source": {
        "name": "Tintinalli + Stroke Guidelines + UpToDate AMS Workup",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "chest-pain",
    "path": "/src/content/symptoms/chest-pain.mdx",
    "frontmatter": {
      "id": "chest-pain",
      "title": "Chest Pain",
      "titleTh": "เจ็บหน้าอก",
      "category": "symptom",
      "subcategory": "cardiac",
      "tags": [
        "chest pain",
        "acs",
        "cardiac",
        "emergency"
      ],
      "keywords": [
        "chest pain",
        "ACS",
        "acute coronary syndrome",
        "aortic dissection",
        "PE",
        "pneumothorax",
        "pericarditis",
        "เจ็บหน้าอก"
      ],
      "related": [
        "stemi",
        "aortic-dissection",
        "pe-pathway",
        "tachyarrhythmia-unstable"
      ],
      "source": {
        "name": "ACC/AHA ACS Guideline + ESC Aortic Guideline",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "dyspnea",
    "path": "/src/content/symptoms/dyspnea.mdx",
    "frontmatter": {
      "id": "dyspnea",
      "title": "Dyspnea",
      "titleTh": "หายใจเหนื่อย",
      "category": "symptom",
      "subcategory": "respiratory",
      "tags": [
        "dyspnea",
        "shortness of breath",
        "respiratory"
      ],
      "keywords": [
        "dyspnea",
        "SOB",
        "shortness of breath",
        "respiratory failure",
        "tachypnea",
        "หายใจเหนื่อย",
        "หายใจไม่พอ"
      ],
      "related": [
        "pe-pathway",
        "severe-asthma",
        "anaphylaxis",
        "septic-shock",
        "stemi"
      ],
      "source": {
        "name": "Tintinalli Emergency Medicine + UpToDate",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "fever",
    "path": "/src/content/symptoms/fever.mdx",
    "frontmatter": {
      "id": "fever",
      "title": "Fever",
      "titleTh": "ไข้",
      "category": "symptom",
      "subcategory": "infectious",
      "tags": [
        "fever",
        "sepsis",
        "infection",
        "pyrexia"
      ],
      "keywords": [
        "fever",
        "sepsis",
        "infection",
        "qSOFA",
        "lactate",
        "sepsis bundle",
        "ไข้",
        "sepsis screen"
      ],
      "related": [
        "septic-shock",
        "meningitis-empiric",
        "qsofa",
        "sofa",
        "altered-mental-status"
      ],
      "source": {
        "name": "Surviving Sepsis Campaign (2021) + IDSA guidelines",
        "year": 2021
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "nausea-vomiting",
    "path": "/src/content/symptoms/nausea-vomiting.mdx",
    "frontmatter": {
      "id": "nausea-vomiting",
      "title": "Nausea / Vomiting",
      "titleTh": "คลื่นไส้ อาเจียน",
      "category": "symptom",
      "subcategory": "GI",
      "tags": [
        "nausea",
        "vomiting",
        "GI"
      ],
      "keywords": [
        "nausea",
        "vomiting",
        "emesis",
        "antiemetic",
        "คลื่นไส้",
        "อาเจียน"
      ],
      "related": [
        "ugib",
        "dka",
        "status-epilepticus",
        "acute-cholangitis"
      ],
      "source": {
        "name": "Tintinalli Emergency Medicine + UpToDate",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "rash",
    "path": "/src/content/symptoms/rash.mdx",
    "frontmatter": {
      "id": "rash",
      "title": "Rash",
      "titleTh": "ผื่น",
      "category": "symptom",
      "subcategory": "dermatology",
      "tags": [
        "rash",
        "dermatology",
        "drug reaction",
        "SJS",
        "anaphylaxis"
      ],
      "keywords": [
        "rash",
        "urticaria",
        "petechiae",
        "purpura",
        "SJS",
        "TEN",
        "DRESS",
        "anaphylaxis",
        "ผื่น",
        "ลมพิษ"
      ],
      "related": [
        "anaphylaxis",
        "septic-shock"
      ],
      "source": {
        "name": "Fitzpatrick Dermatology + UpToDate",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "urinary",
    "path": "/src/content/symptoms/urinary.mdx",
    "frontmatter": {
      "id": "urinary",
      "title": "Urinary symptoms",
      "titleTh": "ปัสสาวะผิดปกติ",
      "category": "symptom",
      "subcategory": "GU",
      "tags": [
        "urinary",
        "UTI",
        "dysuria",
        "hematuria"
      ],
      "keywords": [
        "dysuria",
        "frequency",
        "urgency",
        "hematuria",
        "anuria",
        "oliguria",
        "UTI",
        "pyelonephritis",
        "ปัสสาวะ",
        "ขัดเบา"
      ],
      "related": [
        "septic-shock",
        "dka"
      ],
      "source": {
        "name": "IDSA UTI guidelines + Tintinalli EM",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  }
];
