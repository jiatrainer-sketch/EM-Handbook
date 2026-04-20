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
      "titleTh": "อะมิโอดาโรน (ไดรป์)",
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
    "id": "dexmedetomidine-drip",
    "path": "/src/content/drips/dexmedetomidine-drip.mdx",
    "frontmatter": {
      "id": "dexmedetomidine-drip",
      "title": "Dexmedetomidine Drip",
      "titleTh": "เด็กซ์เมเดโตมิดีน (ไดรป์)",
      "category": "drip",
      "subcategory": "sedation",
      "tags": [
        "dexmedetomidine",
        "alpha-2 agonist",
        "sedation",
        "delirium"
      ],
      "keywords": [
        "dexmedetomidine",
        "precedex",
        "alpha-2",
        "sedation without respiratory depression",
        "weaning",
        "delirium"
      ],
      "related": [
        "propofol-drip"
      ],
      "source": {
        "name": "SCCM PADIS 2018 + SEDCOM trial",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "dobutamine-drip",
    "path": "/src/content/drips/dobutamine-drip.mdx",
    "frontmatter": {
      "id": "dobutamine-drip",
      "title": "Dobutamine Drip",
      "titleTh": "โดบูตามีน (ไดรป์)",
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
      "titleTh": "โดพามีน (ไดรป์)",
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
      "title": "Epinephrine (Adrenaline) Drip",
      "titleTh": "อีพิเนฟริน / อะดรีนาลีน (ไดรป์)",
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
      "titleTh": "เอสโมลอล (ไดรป์)",
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
      "titleTh": "ลาเบทาลอล (ไดรป์)",
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
      "titleTh": "มิลรีโนน (ไดรป์)",
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
      "titleTh": "นิคาร์ดิพีน (ไดรป์)",
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
      "titleTh": "ไนโตรกลีเซอริน (ไดรป์)",
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
      "title": "Norepinephrine (Levophed) Drip",
      "titleTh": "นอร์อีพิเนฟริน (ไดรป์)",
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
    "id": "phenylephrine-drip",
    "path": "/src/content/drips/phenylephrine-drip.mdx",
    "frontmatter": {
      "id": "phenylephrine-drip",
      "title": "Phenylephrine Drip",
      "titleTh": "ฟีนีลเอฟริน (ไดรป์)",
      "category": "drip",
      "subcategory": "vasopressor",
      "tags": [
        "phenylephrine",
        "alpha agonist",
        "vasopressor"
      ],
      "keywords": [
        "phenylephrine",
        "neosynephrine",
        "alpha-1",
        "vasopressor",
        "post-spinal hypotension"
      ],
      "related": [
        "norepinephrine-drip",
        "vasopressin-drip"
      ],
      "source": {
        "name": "ACLS + Stoelting's Pharmacology",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "propofol-drip",
    "path": "/src/content/drips/propofol-drip.mdx",
    "frontmatter": {
      "id": "propofol-drip",
      "title": "Propofol Drip",
      "titleTh": "โพรพอฟอล (ไดรป์)",
      "category": "drip",
      "subcategory": "sedation",
      "tags": [
        "propofol",
        "sedation",
        "ICU",
        "intubation"
      ],
      "keywords": [
        "propofol",
        "diprivan",
        "sedation",
        "ICU",
        "propofol infusion syndrome",
        "PRIS"
      ],
      "related": [
        "dexmedetomidine-drip"
      ],
      "source": {
        "name": "SCCM PADIS 2018 + Stoelting",
        "year": 2022
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
      "titleTh": "วาโซเพรสซิน (ไดรป์)",
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
    "id": "analgesia-ladder",
    "path": "/src/content/ladders/analgesia-ladder.mdx",
    "frontmatter": {
      "id": "analgesia-ladder",
      "title": "Analgesia Ladder (Acute Pain, ED)",
      "titleTh": "ขั้นบันไดยาแก้ปวดเฉียบพลัน",
      "category": "ladder",
      "subcategory": "general",
      "tags": [
        "analgesia",
        "pain",
        "opioid",
        "NSAID",
        "ladder"
      ],
      "keywords": [
        "analgesia ladder",
        "WHO pain ladder",
        "morphine",
        "tramadol",
        "paracetamol",
        "NSAID",
        "opioid"
      ],
      "related": [
        "opioid-overdose",
        "acetaminophen-overdose"
      ],
      "source": {
        "name": "WHO Pain Ladder (modified) + ACEP Acute Pain Guideline 2020",
        "year": 2020
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "antihypertensive-iv-ladder",
    "path": "/src/content/ladders/antihypertensive-iv-ladder.mdx",
    "frontmatter": {
      "id": "antihypertensive-iv-ladder",
      "title": "IV Antihypertensive Ladder (HT Emergency)",
      "titleTh": "ขั้นบันไดยาลดความดันฉีดในภาวะวิกฤต",
      "category": "ladder",
      "subcategory": "cardiac",
      "tags": [
        "antihypertensive",
        "HT emergency",
        "nicardipine",
        "labetalol",
        "ladder"
      ],
      "keywords": [
        "hypertensive emergency",
        "nicardipine",
        "labetalol",
        "esmolol",
        "nitroglycerin",
        "hydralazine",
        "IV antihypertensive"
      ],
      "related": [
        "ht-emergency",
        "aortic-dissection",
        "hypertensive-emergency-pregnancy",
        "nicardipine-vs-labetalol"
      ],
      "source": {
        "name": "AHA/ACC 2017 HT Guideline + JNC 8 + ESC 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "diuretic-ladder-chf",
    "path": "/src/content/ladders/diuretic-ladder-chf.mdx",
    "frontmatter": {
      "id": "diuretic-ladder-chf",
      "title": "Diuretic Ladder (ADHF, Refractory)",
      "titleTh": "ขั้นบันไดยาขับปัสสาวะในภาวะหัวใจล้มเหลว",
      "category": "ladder",
      "subcategory": "cardiac",
      "tags": [
        "furosemide",
        "diuretic",
        "ADHF",
        "loop",
        "ladder"
      ],
      "keywords": [
        "furosemide",
        "Lasix",
        "torsemide",
        "bumetanide",
        "thiazide",
        "metolazone",
        "loop diuretic",
        "refractory edema"
      ],
      "related": [
        "acute-heart-failure",
        "acute-pulmonary-edema",
        "acute-kidney-injury"
      ],
      "source": {
        "name": "DOSE trial NEJM 2011 + AHA HF 2022",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "sedation-agitation-ladder",
    "path": "/src/content/ladders/sedation-agitation-ladder.mdx",
    "frontmatter": {
      "id": "sedation-agitation-ladder",
      "title": "Sedation Ladder (Acute Agitation, ED)",
      "titleTh": "ขั้นบันไดยาสงบระงับในภาวะกระวนกระวาย",
      "category": "ladder",
      "subcategory": "neuro",
      "tags": [
        "sedation",
        "agitation",
        "haloperidol",
        "midazolam",
        "ketamine",
        "ladder"
      ],
      "keywords": [
        "sedation",
        "agitation",
        "haloperidol",
        "olanzapine",
        "lorazepam",
        "midazolam",
        "ketamine",
        "droperidol",
        "restraint"
      ],
      "related": [
        "acute-agitation",
        "alcohol-withdrawal",
        "status-epilepticus"
      ],
      "source": {
        "name": "ACEP Agitation Guideline 2017 + Project BETA",
        "year": 2017
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
      "title": "Acetaminophen (Paracetamol) Overdose",
      "titleTh": "พิษจากยาพาราเซตามอล",
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
    "id": "acs-nstemi",
    "path": "/src/content/protocols/acs-nstemi.mdx",
    "frontmatter": {
      "id": "acs-nstemi",
      "title": "ACS — NSTEMI / Unstable Angina",
      "titleTh": "กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (NSTEMI/UA)",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "ACS",
        "NSTEMI",
        "unstable angina",
        "troponin",
        "GRACE",
        "PCI"
      ],
      "keywords": [
        "NSTEMI",
        "unstable angina",
        "ACS",
        "troponin",
        "high-sensitivity troponin",
        "GRACE score",
        "dual antiplatelet",
        "heparin",
        "หัวใจขาดเลือด"
      ],
      "related": [
        "stemi",
        "heart-score",
        "chest-pain"
      ],
      "source": {
        "name": "ESC 2023 ACS Guidelines + AHA/ACC 2022",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "acute-agitation",
    "path": "/src/content/protocols/acute-agitation.mdx",
    "frontmatter": {
      "id": "acute-agitation",
      "title": "Acute Agitation (ED Psychiatric / Medical)",
      "titleTh": "ผู้ป่วยกระวนกระวายเฉียบพลัน",
      "category": "protocol",
      "subcategory": "psychiatric",
      "tags": [
        "agitation",
        "psychosis",
        "excited delirium",
        "chemical restraint",
        "haloperidol"
      ],
      "keywords": [
        "agitation",
        "acute psychosis",
        "excited delirium",
        "chemical restraint",
        "haloperidol",
        "ketamine",
        "midazolam",
        "กระวนกระวาย",
        "ควบคุมไม่ได้"
      ],
      "related": [
        "alcohol-withdrawal",
        "altered-mental-status"
      ],
      "source": {
        "name": "ACEP Behavioral Emergencies + Thai Psychiatric Emergency",
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
    "id": "acute-cholecystitis",
    "path": "/src/content/protocols/acute-cholecystitis.mdx",
    "frontmatter": {
      "id": "acute-cholecystitis",
      "title": "Acute Cholecystitis",
      "titleTh": "ถุงน้ำดีอักเสบเฉียบพลัน",
      "category": "protocol",
      "subcategory": "GI",
      "tags": [
        "cholecystitis",
        "gallstone",
        "Tokyo Guidelines",
        "Murphy sign",
        "cholecystectomy"
      ],
      "keywords": [
        "acute cholecystitis",
        "cholelithiasis",
        "gallstone",
        "Murphy sign",
        "Tokyo Guidelines",
        "TG18",
        "cholecystectomy",
        "ถุงน้ำดีอักเสบ"
      ],
      "related": [
        "acute-cholangitis",
        "acute-pancreatitis"
      ],
      "source": {
        "name": "Tokyo Guidelines 2018 + SAGES 2021",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "acute-heart-failure",
    "path": "/src/content/protocols/acute-heart-failure.mdx",
    "frontmatter": {
      "id": "acute-heart-failure",
      "title": "Acute Decompensated Heart Failure (ADHF)",
      "titleTh": "ภาวะหัวใจล้มเหลวเฉียบพลัน",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "heart failure",
        "ADHF",
        "pulmonary edema",
        "cardiogenic shock",
        "diuretic"
      ],
      "keywords": [
        "acute heart failure",
        "ADHF",
        "CHF exacerbation",
        "pulmonary edema",
        "cardiogenic shock",
        "furosemide",
        "BNP",
        "หัวใจล้มเหลว",
        "ปอดบวมน้ำ"
      ],
      "related": [
        "acute-pulmonary-edema",
        "stemi",
        "acs-nstemi"
      ],
      "source": {
        "name": "ESC 2021 Heart Failure Guidelines + AHA/ACC/HFSA 2022",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "acute-kidney-injury",
    "path": "/src/content/protocols/acute-kidney-injury.mdx",
    "frontmatter": {
      "id": "acute-kidney-injury",
      "title": "Acute Kidney Injury (AKI)",
      "titleTh": "ไตวายเฉียบพลัน",
      "category": "protocol",
      "subcategory": "renal",
      "tags": [
        "AKI",
        "KDIGO",
        "prerenal",
        "ATN",
        "contrast nephropathy"
      ],
      "keywords": [
        "acute kidney injury",
        "AKI",
        "KDIGO",
        "prerenal",
        "intrinsic",
        "postrenal",
        "ATN",
        "contrast nephropathy",
        "FENa",
        "ไตวาย",
        "ไตเฉียบพลัน"
      ],
      "related": [
        "hyperkalemia",
        "crrt",
        "rhabdomyolysis"
      ],
      "source": {
        "name": "KDIGO AKI Guidelines 2012 + updates",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
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
    "id": "acute-pancreatitis",
    "path": "/src/content/protocols/acute-pancreatitis.mdx",
    "frontmatter": {
      "id": "acute-pancreatitis",
      "title": "Acute Pancreatitis",
      "titleTh": "ตับอ่อนอักเสบเฉียบพลัน",
      "category": "protocol",
      "subcategory": "GI",
      "tags": [
        "pancreatitis",
        "lipase",
        "amylase",
        "gallstone pancreatitis",
        "necrotizing pancreatitis"
      ],
      "keywords": [
        "acute pancreatitis",
        "gallstone pancreatitis",
        "alcoholic pancreatitis",
        "lipase",
        "Atlanta classification",
        "BISAP",
        "necrotizing pancreatitis",
        "ตับอ่อนอักเสบ"
      ],
      "related": [
        "acute-cholangitis",
        "alcoholic-ketoacidosis",
        "septic-shock"
      ],
      "source": {
        "name": "ACG Guidelines 2018 + Revised Atlanta Classification",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
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
      "titleTh": "ต่อมหมวกไตวายเฉียบพลัน",
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
    "id": "alcohol-withdrawal",
    "path": "/src/content/protocols/alcohol-withdrawal.mdx",
    "frontmatter": {
      "id": "alcohol-withdrawal",
      "title": "Alcohol Withdrawal Syndrome",
      "titleTh": "ภาวะขาดสุรา",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "alcohol withdrawal",
        "DT",
        "delirium tremens",
        "CIWA",
        "benzodiazepine"
      ],
      "keywords": [
        "alcohol withdrawal",
        "delirium tremens",
        "DT",
        "CIWA-Ar",
        "thiamine",
        "Wernicke",
        "ลงแดง",
        "ถอนสุรา"
      ],
      "related": [
        "altered-mental-status",
        "status-epilepticus"
      ],
      "source": {
        "name": "ASAM Alcohol Withdrawal Management 2020",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
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
      "titleTh": "ภาวะแพ้รุนแรงเฉียบพลัน",
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
    "id": "ascites-fluid-analysis",
    "path": "/src/content/protocols/ascites-fluid-analysis.mdx",
    "frontmatter": {
      "id": "ascites-fluid-analysis",
      "title": "Ascites Fluid Analysis (Paracentesis)",
      "titleTh": "การวิเคราะห์น้ำในช่องท้อง",
      "category": "protocol",
      "subcategory": "GI",
      "tags": [
        "ascites",
        "paracentesis",
        "SAAG",
        "SBP",
        "cirrhosis"
      ],
      "keywords": [
        "ascites",
        "paracentesis",
        "SAAG",
        "spontaneous bacterial peritonitis",
        "SBP",
        "cirrhosis",
        "portal hypertension",
        "น้ำในช่องท้อง",
        "เจาะท้อง"
      ],
      "related": [
        "ugib-variceal",
        "septic-shock"
      ],
      "source": {
        "name": "AASLD Ascites Guidelines 2021 + EASL Cirrhosis 2018",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "asystole",
    "path": "/src/content/protocols/asystole.mdx",
    "frontmatter": {
      "id": "asystole",
      "title": "Asystole / PEA",
      "titleTh": "หัวใจหยุด / ไม่มีชีพจร",
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
    "id": "atrial-fibrillation",
    "path": "/src/content/protocols/atrial-fibrillation.mdx",
    "frontmatter": {
      "id": "atrial-fibrillation",
      "title": "Atrial Fibrillation / Flutter",
      "titleTh": "หัวใจห้องบนสั่นพลิ้ว",
      "category": "protocol",
      "subcategory": "cardiac",
      "tags": [
        "atrial fibrillation",
        "AFib",
        "anticoagulation",
        "CHA2DS2-VASc",
        "rate control",
        "cardioversion"
      ],
      "keywords": [
        "atrial fibrillation",
        "AF",
        "atrial flutter",
        "CHADS",
        "CHA2DS2-VASc",
        "HAS-BLED",
        "rate control",
        "rhythm control",
        "cardioversion",
        "หัวใจเต้นผิดจังหวะ",
        "หัวใจสั่น"
      ],
      "related": [
        "tachyarrhythmia-unstable",
        "svt",
        "stroke-pathway"
      ],
      "source": {
        "name": "AHA/ACC/ESC 2024 AFib Guidelines",
        "year": 2024
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "benzodiazepine-overdose",
    "path": "/src/content/protocols/benzodiazepine-overdose.mdx",
    "frontmatter": {
      "id": "benzodiazepine-overdose",
      "title": "Benzodiazepine Overdose",
      "titleTh": "พิษจากยากลุ่มเบนโซไดอะซีปีน",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "benzodiazepine",
        "flumazenil",
        "diazepam",
        "midazolam"
      ],
      "keywords": [
        "benzodiazepine overdose",
        "flumazenil",
        "diazepam",
        "alprazolam",
        "midazolam",
        "lorazepam",
        "พิษยานอนหลับ"
      ],
      "related": [
        "opioid-overdose",
        "altered-mental-status"
      ],
      "source": {
        "name": "ACMT + Goldfrank's Tox",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
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
    "id": "cellulitis",
    "path": "/src/content/protocols/cellulitis.mdx",
    "frontmatter": {
      "id": "cellulitis",
      "title": "Cellulitis / Erysipelas",
      "titleTh": "ผิวหนังอักเสบเฉียบพลัน",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "cellulitis",
        "erysipelas",
        "skin infection",
        "MRSA",
        "necrotizing fasciitis"
      ],
      "keywords": [
        "cellulitis",
        "erysipelas",
        "SSTI",
        "skin infection",
        "MRSA",
        "necrotizing fasciitis",
        "ผิวหนังอักเสบ",
        "แผลอักเสบ"
      ],
      "related": [
        "septic-shock",
        "diabetic-foot-infection"
      ],
      "source": {
        "name": "IDSA SSTI Guidelines 2014 + updates",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "community-acquired-pneumonia",
    "path": "/src/content/protocols/community-acquired-pneumonia.mdx",
    "frontmatter": {
      "id": "community-acquired-pneumonia",
      "title": "Community-Acquired Pneumonia (CAP)",
      "titleTh": "ปอดอักเสบที่ได้รับจากชุมชน",
      "category": "protocol",
      "subcategory": "pulmonary",
      "tags": [
        "pneumonia",
        "CAP",
        "CURB-65",
        "antibiotic"
      ],
      "keywords": [
        "community acquired pneumonia",
        "CAP",
        "CURB-65",
        "pneumonia severity index",
        "PSI",
        "HAP",
        "VAP",
        "ปอดอักเสบ",
        "ปอดบวม"
      ],
      "related": [
        "curb-65",
        "septic-shock",
        "dyspnea"
      ],
      "source": {
        "name": "IDSA/ATS 2019 CAP Guidelines + Thai CAP Consensus 2022",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "copd-exacerbation",
    "path": "/src/content/protocols/copd-exacerbation.mdx",
    "frontmatter": {
      "id": "copd-exacerbation",
      "title": "COPD Exacerbation",
      "titleTh": "ถุงลมโป่งพองกำเริบเฉียบพลัน",
      "category": "protocol",
      "subcategory": "pulmonary",
      "tags": [
        "COPD",
        "exacerbation",
        "NIV",
        "BiPAP",
        "bronchodilator"
      ],
      "keywords": [
        "COPD",
        "AECOPD",
        "chronic obstructive pulmonary disease",
        "BiPAP",
        "NIV",
        "ipratropium",
        "salbutamol",
        "ถุงลมโป่งพอง",
        "COPD กำเริบ"
      ],
      "related": [
        "severe-asthma",
        "acute-pulmonary-edema",
        "dyspnea"
      ],
      "source": {
        "name": "GOLD 2024 + ATS/ERS 2023",
        "year": 2024
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "crrt",
    "path": "/src/content/protocols/crrt.mdx",
    "frontmatter": {
      "id": "crrt",
      "title": "CRRT — Continuous Renal Replacement Therapy",
      "titleTh": "การบำบัดทดแทนไตแบบต่อเนื่อง",
      "category": "protocol",
      "subcategory": "renal",
      "tags": [
        "CRRT",
        "AKI",
        "hemodialysis",
        "ICU",
        "renal replacement"
      ],
      "keywords": [
        "CRRT",
        "CVVH",
        "CVVHD",
        "CVVHDF",
        "continuous renal replacement",
        "AKI",
        "acute kidney injury",
        "citrate",
        "anticoagulation",
        "ไตวายเฉียบพลัน",
        "ฟอกไต"
      ],
      "related": [
        "septic-shock",
        "hyperkalemia",
        "hyponatremia-symptomatic"
      ],
      "source": {
        "name": "KDIGO AKI Guidelines 2012 + STARRT-AKI Trial + Intensive Care Med 2022",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "dengue",
    "path": "/src/content/protocols/dengue.mdx",
    "frontmatter": {
      "id": "dengue",
      "title": "Dengue Fever",
      "titleTh": "ไข้เดงกี / ไข้เลือดออก",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "dengue",
        "DHF",
        "dengue hemorrhagic fever",
        "thrombocytopenia",
        "plasma leak",
        "Thailand endemic"
      ],
      "keywords": [
        "dengue",
        "DHF",
        "DSS",
        "dengue shock syndrome",
        "NS1",
        "dengue IgM",
        "tourniquet test",
        "ไข้เลือดออก",
        "dengue ประเทศไทย"
      ],
      "related": [
        "septic-shock",
        "fever",
        "rash"
      ],
      "source": {
        "name": "WHO Dengue Guidelines 2009 + Thailand MOPH Dengue Protocol 2023",
        "year": 2023
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
      "titleTh": "ภาวะกรดคีโตนในเบาหวาน",
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
    "id": "hiv-pep-prep",
    "path": "/src/content/protocols/hiv-pep-prep.mdx",
    "frontmatter": {
      "id": "hiv-pep-prep",
      "title": "HIV PEP / PrEP",
      "titleTh": "ยาป้องกัน HIV (PEP และ PrEP)",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "HIV",
        "PEP",
        "PrEP",
        "post-exposure prophylaxis",
        "pre-exposure prophylaxis",
        "antiretroviral"
      ],
      "keywords": [
        "PEP",
        "PrEP",
        "HIV prophylaxis",
        "nPEP",
        "needle stick",
        "sexual assault",
        "TDF/FTC",
        "Truvada",
        "ป้องกัน HIV",
        "ยาต้านไวรัส HIV"
      ],
      "related": [
        "septic-shock"
      ],
      "source": {
        "name": "Thai MOPH HIV PEP Guidelines 2023 + CDC 2021 PrEP Guidelines",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "ht-emergency",
    "path": "/src/content/protocols/ht-emergency.mdx",
    "frontmatter": {
      "id": "ht-emergency",
      "title": "Hypertensive Emergency",
      "titleTh": "ภาวะความดันโลหิตสูงวิกฤต",
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
      "titleTh": "ภาวะโพแทสเซียมในเลือดสูง",
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
      "titleTh": "ภาวะน้ำตาลในเลือดต่ำ",
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
    "id": "leptospirosis",
    "path": "/src/content/protocols/leptospirosis.mdx",
    "frontmatter": {
      "id": "leptospirosis",
      "title": "Leptospirosis",
      "titleTh": "ไข้ฉี่หนู (เลปโตสไปโรสิส)",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "leptospirosis",
        "Weil disease",
        "Thailand endemic",
        "Doxycycline",
        "Jarisch-Herxheimer"
      ],
      "keywords": [
        "leptospirosis",
        "Weil disease",
        "Weil syndrome",
        "ไข้ฉี่หนู",
        "เลปโต",
        "Leptospira",
        "rice farmer",
        "flooding",
        "doxycycline"
      ],
      "related": [
        "septic-shock",
        "dengue",
        "malaria"
      ],
      "source": {
        "name": "WHO Leptospirosis Guidelines + Thai MOPH 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "malaria",
    "path": "/src/content/protocols/malaria.mdx",
    "frontmatter": {
      "id": "malaria",
      "title": "Malaria",
      "titleTh": "มาลาเรีย",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "malaria",
        "Plasmodium falciparum",
        "Plasmodium vivax",
        "artesunate",
        "Thailand border"
      ],
      "keywords": [
        "malaria",
        "Plasmodium",
        "falciparum",
        "vivax",
        "ovale",
        "malariae",
        "knowlesi",
        "artemether",
        "artesunate",
        "มาลาเรีย",
        "ไข้มาลาเรีย"
      ],
      "related": [
        "dengue",
        "leptospirosis",
        "septic-shock"
      ],
      "source": {
        "name": "WHO Malaria 2023 + Thai MOPH Malaria Protocol",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "melioidosis",
    "path": "/src/content/protocols/melioidosis.mdx",
    "frontmatter": {
      "id": "melioidosis",
      "title": "Melioidosis",
      "titleTh": "เมลิออยด์ (โรคไม้ไผ่)",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "melioidosis",
        "Burkholderia pseudomallei",
        "Thailand endemic",
        "NE Thailand",
        "ceftazidime"
      ],
      "keywords": [
        "melioidosis",
        "Burkholderia pseudomallei",
        "Whitmore disease",
        "เมลิออยด์",
        "เมลิออยโดสิส",
        "โรคไม้ไผ่",
        "diabetic farmer",
        "ceftazidime",
        "meropenem"
      ],
      "related": [
        "septic-shock",
        "community-acquired-pneumonia"
      ],
      "source": {
        "name": "Thai MOPH + Darwin-Thailand Protocol (Melioidosis Research) 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "meningitis-empiric",
    "path": "/src/content/protocols/meningitis-empiric.mdx",
    "frontmatter": {
      "id": "meningitis-empiric",
      "title": "Bacterial Meningitis — Empiric Therapy",
      "titleTh": "เยื่อหุ้มสมองอักเสบ — รักษาเบื้องต้น",
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
    "id": "opioid-overdose",
    "path": "/src/content/protocols/opioid-overdose.mdx",
    "frontmatter": {
      "id": "opioid-overdose",
      "title": "Opioid Overdose",
      "titleTh": "พิษจากยาโอปิออยด์",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "opioid",
        "naloxone",
        "heroin",
        "fentanyl",
        "respiratory depression"
      ],
      "keywords": [
        "opioid overdose",
        "naloxone",
        "narcan",
        "morphine",
        "fentanyl",
        "heroin",
        "tramadol",
        "พิษมอร์ฟีน",
        "ทรามาดอล"
      ],
      "related": [
        "status-epilepticus",
        "altered-mental-status"
      ],
      "source": {
        "name": "ACMT + Thai Tox Reference",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "organophosphate-poisoning",
    "path": "/src/content/protocols/organophosphate-poisoning.mdx",
    "frontmatter": {
      "id": "organophosphate-poisoning",
      "title": "Organophosphate Poisoning",
      "titleTh": "พิษสารออร์กาโนฟอสเฟต (ยาฆ่าแมลง)",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "organophosphate",
        "cholinergic",
        "atropine",
        "pralidoxime",
        "insecticide",
        "Thailand"
      ],
      "keywords": [
        "organophosphate",
        "OP poisoning",
        "cholinergic toxidrome",
        "atropine",
        "pralidoxime",
        "2-PAM",
        "SLUDGE",
        "DUMBBELS",
        "ยาฆ่าแมลง",
        "พิษ OP"
      ],
      "related": [
        "status-epilepticus",
        "septic-shock"
      ],
      "source": {
        "name": "Goldfrank's Toxicologic Emergencies + WHO 2008 OP Guidelines",
        "year": 2023
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
    "id": "pleural-fluid-analysis",
    "path": "/src/content/protocols/pleural-fluid-analysis.mdx",
    "frontmatter": {
      "id": "pleural-fluid-analysis",
      "title": "Pleural Fluid Analysis",
      "titleTh": "การวิเคราะห์น้ำในช่องเยื่อหุ้มปอด",
      "category": "protocol",
      "subcategory": "pulmonary",
      "tags": [
        "pleural effusion",
        "thoracentesis",
        "Light's criteria",
        "exudate",
        "transudate"
      ],
      "keywords": [
        "pleural effusion",
        "thoracentesis",
        "Light criteria",
        "exudate",
        "transudate",
        "parapneumonic effusion",
        "empyema",
        "น้ำในช่องปอด",
        "เจาะน้ำปอด"
      ],
      "related": [
        "septic-shock",
        "pe-pathway"
      ],
      "source": {
        "name": "ACCP Evidence-Based Clinical Practice Guidelines 2018 + BTS Pleural Disease 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "pyelonephritis",
    "path": "/src/content/protocols/pyelonephritis.mdx",
    "frontmatter": {
      "id": "pyelonephritis",
      "title": "Acute Pyelonephritis",
      "titleTh": "กรวยไตอักเสบเฉียบพลัน",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "pyelonephritis",
        "UTI",
        "urinary tract infection",
        "E. coli",
        "ESBL"
      ],
      "keywords": [
        "pyelonephritis",
        "UTI",
        "complicated UTI",
        "urinary tract infection",
        "E. coli",
        "ESBL",
        "urosepsis",
        "กรวยไตอักเสบ",
        "กระเพาะปัสสาวะอักเสบ"
      ],
      "related": [
        "septic-shock",
        "urinary",
        "antibiotic-empirical-by-site"
      ],
      "source": {
        "name": "IDSA UTI Guidelines + EAU Urological Infections 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "rabies-pep",
    "path": "/src/content/protocols/rabies-pep.mdx",
    "frontmatter": {
      "id": "rabies-pep",
      "title": "Rabies Post-Exposure Prophylaxis (PEP)",
      "titleTh": "ป้องกันโรคพิษสุนัขบ้า (PEP)",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "rabies",
        "PEP",
        "animal bite",
        "HRIG",
        "vaccine"
      ],
      "keywords": [
        "rabies",
        "PEP",
        "animal bite",
        "dog bite",
        "cat bite",
        "HRIG",
        "rabies vaccine",
        "essen schedule",
        "zagreb",
        "พิษสุนัขบ้า",
        "สุนัขกัด"
      ],
      "related": [
        "snakebite",
        "cellulitis"
      ],
      "source": {
        "name": "WHO Rabies 2018 + Thai Red Cross Society + MOPH 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "rhabdomyolysis",
    "path": "/src/content/protocols/rhabdomyolysis.mdx",
    "frontmatter": {
      "id": "rhabdomyolysis",
      "title": "Rhabdomyolysis",
      "titleTh": "ภาวะกล้ามเนื้อลายสลาย",
      "category": "protocol",
      "subcategory": "renal",
      "tags": [
        "rhabdomyolysis",
        "CK",
        "myoglobinuria",
        "AKI",
        "compartment syndrome"
      ],
      "keywords": [
        "rhabdomyolysis",
        "CK",
        "creatine kinase",
        "myoglobin",
        "AKI",
        "compartment syndrome",
        "กล้ามเนื้อลายสลาย"
      ],
      "related": [
        "hyperkalemia",
        "acute-limb-ischemia"
      ],
      "source": {
        "name": "KDIGO + Rhabdomyolysis Review NEJM",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "scrub-typhus",
    "path": "/src/content/protocols/scrub-typhus.mdx",
    "frontmatter": {
      "id": "scrub-typhus",
      "title": "Scrub Typhus",
      "titleTh": "ไข้รากสาด (สครับไทฟัส)",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "scrub typhus",
        "Orientia tsutsugamushi",
        "eschar",
        "Thailand endemic",
        "doxycycline"
      ],
      "keywords": [
        "scrub typhus",
        "Orientia tsutsugamushi",
        "ไข้รากสาด",
        "สครับ",
        "eschar",
        "rickettsial",
        "doxycycline"
      ],
      "related": [
        "leptospirosis",
        "dengue",
        "malaria",
        "fever"
      ],
      "source": {
        "name": "Thai MOPH Rickettsial Diseases 2023 + CDC",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "septic-shock",
    "path": "/src/content/protocols/septic-shock.mdx",
    "frontmatter": {
      "id": "septic-shock",
      "title": "Septic Shock",
      "titleTh": "ภาวะช็อคจากการติดเชื้อ",
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
      "titleTh": "หืดกำเริบรุนแรง",
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
    "id": "snakebite",
    "path": "/src/content/protocols/snakebite.mdx",
    "frontmatter": {
      "id": "snakebite",
      "title": "Snakebite",
      "titleTh": "งูกัด",
      "category": "protocol",
      "subcategory": "toxicology",
      "tags": [
        "snakebite",
        "envenomation",
        "antivenom",
        "Thailand",
        "cobra",
        "pit viper"
      ],
      "keywords": [
        "snakebite",
        "งูกัด",
        "antivenom",
        "cobra",
        "king cobra",
        "pit viper",
        "Russell's viper",
        "banded krait",
        "งูเห่า",
        "งูกะปะ",
        "งูแมวเซา"
      ],
      "related": [
        "anaphylaxis",
        "septic-shock"
      ],
      "source": {
        "name": "WHO Snakebite Guidelines 2016 + Thai Red Cross Antivenom Reference",
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
      "titleTh": "ชักต่อเนื่อง",
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
      "titleTh": "กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน",
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
      "titleTh": "โรคหลอดเลือดสมองเฉียบพลัน",
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
      "titleTh": "หัวใจเต้นเร็วผิดจังหวะชนิด SVT",
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
    "id": "synovial-fluid-analysis",
    "path": "/src/content/protocols/synovial-fluid-analysis.mdx",
    "frontmatter": {
      "id": "synovial-fluid-analysis",
      "title": "Synovial Fluid Analysis (Arthrocentesis)",
      "titleTh": "การวิเคราะห์น้ำในข้อ",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "septic arthritis",
        "arthrocentesis",
        "crystal arthritis",
        "gout",
        "pseudogout"
      ],
      "keywords": [
        "synovial fluid",
        "septic arthritis",
        "gout",
        "pseudogout",
        "arthrocentesis",
        "monosodium urate",
        "CPPD",
        "น้ำในข้อ",
        "เจาะข้อ"
      ],
      "related": [
        "septic-shock",
        "diabetic-foot-infection"
      ],
      "source": {
        "name": "ACR Clinical Practice Guidelines + Rheumatology in Practice",
        "year": 2023
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
      "title": "Tricyclic Antidepressant (TCA) Overdose",
      "titleTh": "พิษจากยากลุ่ม TCA",
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
    "id": "tetanus-prophylaxis",
    "path": "/src/content/protocols/tetanus-prophylaxis.mdx",
    "frontmatter": {
      "id": "tetanus-prophylaxis",
      "title": "Tetanus Prophylaxis (Wound Care)",
      "titleTh": "การป้องกันบาดทะยักจากแผล",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "tetanus",
        "TIG",
        "Td",
        "Tdap",
        "wound"
      ],
      "keywords": [
        "tetanus",
        "tetanus prophylaxis",
        "Td",
        "Tdap",
        "TIG",
        "tetanus immunoglobulin",
        "wound care",
        "บาดทะยัก"
      ],
      "related": [
        "rabies-pep",
        "cellulitis"
      ],
      "source": {
        "name": "CDC + ACIP + Thai EPI Immunization Program",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "thyroid-storm",
    "path": "/src/content/protocols/thyroid-storm.mdx",
    "frontmatter": {
      "id": "thyroid-storm",
      "title": "Thyroid Storm",
      "titleTh": "ไทรอยด์เป็นพิษรุนแรง",
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
    "id": "tuberculosis",
    "path": "/src/content/protocols/tuberculosis.mdx",
    "frontmatter": {
      "id": "tuberculosis",
      "title": "Tuberculosis (Pulmonary + Extrapulmonary)",
      "titleTh": "วัณโรค (TB)",
      "category": "protocol",
      "subcategory": "infectious-disease",
      "tags": [
        "tuberculosis",
        "TB",
        "MDR-TB",
        "HRZE",
        "Thailand"
      ],
      "keywords": [
        "tuberculosis",
        "TB",
        "pulmonary TB",
        "HRZE",
        "isoniazid",
        "rifampicin",
        "MDR TB",
        "XDR TB",
        "TB meningitis",
        "Pott disease",
        "วัณโรค"
      ],
      "related": [
        "hiv-pep-prep",
        "meningitis-empiric"
      ],
      "source": {
        "name": "WHO TB Guidelines 2022 + Thai MOPH National TB Program",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "tumor-lysis-syndrome",
    "path": "/src/content/protocols/tumor-lysis-syndrome.mdx",
    "frontmatter": {
      "id": "tumor-lysis-syndrome",
      "title": "Tumor Lysis Syndrome (TLS)",
      "titleTh": "กลุ่มอาการเนื้องอกสลาย",
      "category": "protocol",
      "subcategory": "renal",
      "tags": [
        "TLS",
        "tumor lysis",
        "hyperuricemia",
        "rasburicase",
        "allopurinol"
      ],
      "keywords": [
        "tumor lysis syndrome",
        "TLS",
        "hyperuricemia",
        "hyperphosphatemia",
        "hyperkalemia",
        "allopurinol",
        "rasburicase",
        "เนื้องอกสลาย"
      ],
      "related": [
        "acute-kidney-injury",
        "hyperkalemia",
        "hypocalcemia-symptomatic"
      ],
      "source": {
        "name": "Cairo-Bishop Criteria + Hematology Guidelines",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "critical"
    }
  },
  {
    "id": "ugib-nonvariceal",
    "path": "/src/content/protocols/ugib-nonvariceal.mdx",
    "frontmatter": {
      "id": "ugib-nonvariceal",
      "title": "Non-Variceal Upper GI Bleeding",
      "titleTh": "เลือดออกทางเดินอาหารส่วนบน (ไม่ใช่จากหลอดเลือดขอด)",
      "category": "protocol",
      "subcategory": "GI",
      "tags": [
        "UGIB",
        "peptic ulcer bleed",
        "PUD",
        "PPI",
        "Glasgow-Blatchford"
      ],
      "keywords": [
        "UGIB",
        "upper GI bleed",
        "peptic ulcer bleed",
        "PPI infusion",
        "Glasgow-Blatchford",
        "GBS",
        "Rockall",
        "endoscopy",
        "เลือดออกทางเดินอาหาร",
        "กระเพาะเลือดออก"
      ],
      "related": [
        "ugib-variceal",
        "acute-cholangitis"
      ],
      "source": {
        "name": "ACG UGIB Guidelines 2021 + ESGE 2021",
        "year": 2022
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
      "titleTh": "เลือดออกจากหลอดเลือดขอดหลอดอาหาร",
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
      "titleTh": "หัวใจห้องล่างเต้นผิดจังหวะรุนแรง",
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
    "id": "acid-base-abg-interpretation",
    "path": "/src/content/reference/acid-base-abg-interpretation.mdx",
    "frontmatter": {
      "id": "acid-base-abg-interpretation",
      "title": "Acid-base / ABG interpretation",
      "titleTh": "การแปลผล ABG + acid-base",
      "category": "reference",
      "subcategory": "internal-medicine",
      "tags": [
        "ABG",
        "acid-base",
        "anion gap",
        "metabolic acidosis",
        "respiratory"
      ],
      "keywords": [
        "ABG",
        "acid-base",
        "anion gap",
        "metabolic acidosis",
        "respiratory acidosis",
        "Winter's formula",
        "compensation",
        "HAGMA",
        "NAGMA",
        "MUDPILES",
        "ABG",
        "กรด-ด่าง"
      ],
      "related": [
        "electrolyte-disturbance-quick-ref",
        "dka",
        "alcoholic-ketoacidosis",
        "toxic-alcohol-ingestion"
      ],
      "source": {
        "name": "Harrison's 21e + NEJM acid-base review",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "antibiotic-empirical-by-site",
    "path": "/src/content/reference/antibiotic-empirical-by-site.mdx",
    "frontmatter": {
      "id": "antibiotic-empirical-by-site",
      "title": "Empirical antibiotic by infection site",
      "titleTh": "ยา antibiotic เริ่มต้นตามอวัยวะ",
      "category": "reference",
      "subcategory": "ID",
      "tags": [
        "antibiotic",
        "empirical",
        "infection",
        "sepsis",
        "pneumonia",
        "UTI",
        "meningitis"
      ],
      "keywords": [
        "empirical antibiotic",
        "CAP",
        "HAP",
        "VAP",
        "pyelonephritis",
        "meningitis",
        "sepsis",
        "skin soft tissue",
        "intra-abdominal"
      ],
      "related": [
        "septic-shock",
        "diabetic-foot-infection",
        "acute-cholangitis"
      ],
      "source": {
        "name": "IDSA 2023 + Thai antibiogram + Sanford Guide",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "blood-product-indications",
    "path": "/src/content/reference/blood-product-indications.mdx",
    "frontmatter": {
      "id": "blood-product-indications",
      "title": "Blood product indications + transfusion reactions",
      "titleTh": "การให้เลือด + ภาวะแทรกซ้อน",
      "category": "reference",
      "subcategory": "hematology",
      "tags": [
        "transfusion",
        "PRBC",
        "platelets",
        "FFP",
        "cryoprecipitate",
        "TRALI",
        "TACO"
      ],
      "keywords": [
        "transfusion",
        "PRBC",
        "platelets",
        "FFP",
        "cryoprecipitate",
        "TRALI",
        "TACO",
        "transfusion reaction",
        "blood transfusion"
      ],
      "related": [
        "ugib"
      ],
      "source": {
        "name": "AABB 2018 + UpToDate",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "electrolyte-disturbance-quick-ref",
    "path": "/src/content/reference/electrolyte-disturbance-quick-ref.mdx",
    "frontmatter": {
      "id": "electrolyte-disturbance-quick-ref",
      "title": "Electrolyte disturbance quick reference",
      "titleTh": "ตารางแก้ไข electrolyte",
      "category": "reference",
      "subcategory": "internal-medicine",
      "tags": [
        "electrolyte",
        "sodium",
        "potassium",
        "calcium",
        "magnesium"
      ],
      "keywords": [
        "hyponatremia",
        "hypernatremia",
        "hypokalemia",
        "hyperkalemia",
        "hypocalcemia",
        "hypercalcemia",
        "hypomagnesemia",
        "hypophosphatemia",
        "SIADH",
        "คำนวณ electrolyte"
      ],
      "related": [
        "hyponatremia-symptomatic",
        "hypocalcemia-symptomatic",
        "acid-base-abg-interpretation"
      ],
      "source": {
        "name": "Harrison's 21e + UpToDate",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "headache-red-flags",
    "path": "/src/content/reference/headache-red-flags.mdx",
    "frontmatter": {
      "id": "headache-red-flags",
      "title": "Headache Red Flags (SNOOP10)",
      "titleTh": "สัญญาณอันตรายของอาการปวดศีรษะ",
      "category": "reference",
      "subcategory": "neurology",
      "tags": [
        "headache",
        "SNOOP",
        "thunderclap",
        "SAH",
        "red flags"
      ],
      "keywords": [
        "headache red flags",
        "SNOOP",
        "SNOOP10",
        "thunderclap headache",
        "subarachnoid hemorrhage",
        "SAH",
        "giant cell arteritis",
        "ปวดศีรษะ"
      ],
      "related": [
        "subarachnoid-hemorrhage",
        "stroke-pathway"
      ],
      "source": {
        "name": "AAN + ICHD-3 + AHS 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "mechanical-ventilation-quickref",
    "path": "/src/content/reference/mechanical-ventilation-quickref.mdx",
    "frontmatter": {
      "id": "mechanical-ventilation-quickref",
      "title": "Mechanical Ventilation — Quick Reference",
      "titleTh": "เครื่องช่วยหายใจ — อ้างอิงเร็ว",
      "category": "reference",
      "subcategory": "pulmonary",
      "tags": [
        "ventilator",
        "ARDS",
        "PEEP",
        "mechanical ventilation"
      ],
      "keywords": [
        "mechanical ventilation",
        "ventilator",
        "ARDS",
        "PEEP",
        "tidal volume",
        "IBW",
        "volume control",
        "pressure control",
        "APRV",
        "เครื่องช่วยหายใจ"
      ],
      "related": [
        "severe-asthma",
        "copd-exacerbation",
        "acid-base-abg-interpretation"
      ],
      "source": {
        "name": "ARDSNet + EMCrit + SCCM Mech Vent Guidelines",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "nicardipine-vs-labetalol",
    "path": "/src/content/reference/nicardipine-vs-labetalol.mdx",
    "frontmatter": {
      "id": "nicardipine-vs-labetalol",
      "title": "Nicardipine vs Labetalol — choosing IV antihypertensive",
      "titleTh": "เลือก Nicardipine vs Labetalol",
      "category": "reference",
      "subcategory": "pharmacology",
      "tags": [
        "nicardipine",
        "labetalol",
        "antihypertensive",
        "hypertensive emergency"
      ],
      "keywords": [
        "nicardipine",
        "labetalol",
        "hypertensive emergency",
        "stroke BP",
        "aortic dissection BP",
        "pregnancy BP"
      ],
      "related": [
        "severe-hypertension",
        "hypertensive-emergency-pregnancy",
        "stroke-pathway",
        "aortic-dissection"
      ],
      "source": {
        "name": "AHA/ACC + ESC guidelines",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "medium"
    }
  },
  {
    "id": "rsi-medications",
    "path": "/src/content/reference/rsi-medications.mdx",
    "frontmatter": {
      "id": "rsi-medications",
      "title": "RSI — Rapid Sequence Intubation Medications",
      "titleTh": "ยาในการใส่ท่อช่วยหายใจแบบ RSI",
      "category": "reference",
      "subcategory": "pharmacology",
      "tags": [
        "RSI",
        "intubation",
        "ketamine",
        "rocuronium",
        "succinylcholine",
        "etomidate"
      ],
      "keywords": [
        "RSI",
        "rapid sequence intubation",
        "induction",
        "paralytic",
        "ketamine",
        "etomidate",
        "propofol",
        "rocuronium",
        "succinylcholine",
        "ใส่ท่อช่วยหายใจ"
      ],
      "related": [
        "severe-asthma",
        "status-epilepticus"
      ],
      "source": {
        "name": "Scott Weingart EMCrit + Tintinalli's EM + Roberts & Hedges",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "seizure-quickref",
    "path": "/src/content/reference/seizure-quickref.mdx",
    "frontmatter": {
      "id": "seizure-quickref",
      "title": "Seizure Types — Quick Reference",
      "titleTh": "ประเภทของอาการชัก",
      "category": "reference",
      "subcategory": "neurology",
      "tags": [
        "seizure",
        "epilepsy",
        "ILAE"
      ],
      "keywords": [
        "seizure",
        "epilepsy",
        "focal",
        "generalized",
        "absence",
        "myoclonic",
        "psychogenic",
        "PNES",
        "ILAE",
        "อาการชัก"
      ],
      "related": [
        "status-epilepticus",
        "altered-mental-status"
      ],
      "source": {
        "name": "ILAE 2017 Classification + AES Guidelines",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "vertigo-workup",
    "path": "/src/content/reference/vertigo-workup.mdx",
    "frontmatter": {
      "id": "vertigo-workup",
      "title": "Vertigo — HINTS + Dix-Hallpike Workup",
      "titleTh": "การตรวจเวียนศีรษะ (HINTS + Dix-Hallpike)",
      "category": "reference",
      "subcategory": "neurology",
      "tags": [
        "vertigo",
        "HINTS",
        "BPPV",
        "Dix-Hallpike",
        "Epley"
      ],
      "keywords": [
        "vertigo",
        "dizziness",
        "HINTS",
        "head impulse",
        "nystagmus",
        "BPPV",
        "Dix-Hallpike",
        "Epley",
        "vestibular neuritis",
        "stroke",
        "เวียนศีรษะ",
        "ตะแคง"
      ],
      "related": [
        "stroke-pathway",
        "altered-mental-status"
      ],
      "source": {
        "name": "Kattah HINTS 2009 + Stroke in vertigo 2022",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high"
    }
  },
  {
    "id": "abcd2",
    "path": "/src/content/scores/abcd2.mdx",
    "frontmatter": {
      "id": "abcd2",
      "title": "ABCD² Score (TIA)",
      "titleTh": "ประเมินความเสี่ยง stroke หลัง TIA",
      "category": "score",
      "subcategory": "neuro",
      "tags": [
        "ABCD2",
        "TIA",
        "stroke risk",
        "neurology"
      ],
      "keywords": [
        "ABCD2 score",
        "TIA",
        "transient ischemic attack",
        "stroke risk",
        "2-day stroke",
        "เส้นเลือดสมอง",
        "TIA ไทย"
      ],
      "related": [
        "nihss",
        "wells-pe"
      ],
      "source": {
        "name": "Johnston SC et al. Lancet 2007; AHA/ASA TIA Guideline 2009",
        "year": 2009
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "TIA short-term stroke risk (2-day, 7-day) → early intervention priority",
      "clinicalContext": "ED — TIA diagnosis; ตัดสินใจ admit vs expedited OPD"
    }
  },
  {
    "id": "alvarado",
    "path": "/src/content/scores/alvarado.mdx",
    "frontmatter": {
      "id": "alvarado",
      "title": "Alvarado Score (Appendicitis)",
      "titleTh": "ประเมินความน่าจะเป็นของไส้ติ่งอักเสบ",
      "category": "score",
      "subcategory": "GI",
      "tags": [
        "Alvarado",
        "appendicitis",
        "abdominal pain",
        "RLQ"
      ],
      "keywords": [
        "Alvarado",
        "appendicitis",
        "MANTRELS",
        "RLQ pain",
        "McBurney",
        "ไส้ติ่ง"
      ],
      "related": [
        "abdominal-pain"
      ],
      "source": {
        "name": "Alvarado A. Ann Emerg Med 1986 + 2016 systematic review",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "medium",
      "severity": "high",
      "usedFor": "Appendicitis pre-test probability",
      "clinicalContext": "RLQ pain — ตัดสินใจ observe / US / CT / surgical consult"
    }
  },
  {
    "id": "bisap-score",
    "path": "/src/content/scores/bisap-score.mdx",
    "frontmatter": {
      "id": "bisap-score",
      "title": "BISAP Score",
      "titleTh": "ประเมินความรุนแรงตับอ่อนอักเสบ",
      "category": "score",
      "subcategory": "gi",
      "tags": [
        "BISAP",
        "pancreatitis",
        "severity"
      ],
      "keywords": [
        "BISAP",
        "acute pancreatitis",
        "severity",
        "ICU",
        "ตับอ่อนอักเสบ"
      ],
      "related": [
        "acute-pancreatitis"
      ],
      "source": {
        "name": "Wu BU et al. Arch Intern Med 2008",
        "year": 2008
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "Acute pancreatitis severity (simple, modern alternative to Ranson's)",
      "clinicalContext": "ED / admission — ตัดสินใจ ward vs ICU ภายใน 24 hr แรก"
    }
  },
  {
    "id": "cha2ds2-vasc",
    "path": "/src/content/scores/cha2ds2-vasc.mdx",
    "frontmatter": {
      "id": "cha2ds2-vasc",
      "title": "CHA₂DS₂-VASc Score",
      "titleTh": "ประเมินความเสี่ยง stroke ในภาวะหัวใจห้องบนสั่นพลิ้ว",
      "category": "score",
      "subcategory": "cardiac",
      "tags": [
        "CHA2DS2-VASc",
        "atrial fibrillation",
        "stroke",
        "anticoagulation"
      ],
      "keywords": [
        "CHA2DS2-VASc",
        "stroke risk",
        "atrial fibrillation",
        "AF",
        "anticoagulation",
        "DOAC",
        "warfarin"
      ],
      "related": [
        "atrial-fibrillation",
        "has-bled"
      ],
      "source": {
        "name": "ESC 2020 AF Guideline + AHA/ACC/HRS 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "AF stroke risk → OAC decision",
      "clinicalContext": "AF — ตัดสินใจให้ anticoagulation หรือไม่"
    }
  },
  {
    "id": "child-pugh",
    "path": "/src/content/scores/child-pugh.mdx",
    "frontmatter": {
      "id": "child-pugh",
      "title": "Child-Pugh Score",
      "titleTh": "ประเมินความรุนแรงของโรคตับแข็ง",
      "category": "score",
      "subcategory": "gi",
      "tags": [
        "Child-Pugh",
        "cirrhosis",
        "liver disease",
        "hepatic function"
      ],
      "keywords": [
        "Child-Pugh",
        "cirrhosis",
        "liver failure",
        "hepatic reserve",
        "portal hypertension",
        "ตับแข็ง"
      ],
      "related": [
        "liver-cirrhosis",
        "ugib-variceal"
      ],
      "source": {
        "name": "Child CG, Turcotte JG. Surgery and Portal Hypertension 1964; modified Pugh 1973",
        "year": 1973
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "Cirrhosis severity + surgical risk + prognosis; MELD complement",
      "clinicalContext": "Ward / OPD — ตับแข็ง; ใช้คู่กับ MELD ในการตัดสินใจ transplant / surgical risk"
    }
  },
  {
    "id": "ciwa-ar",
    "path": "/src/content/scores/ciwa-ar.mdx",
    "frontmatter": {
      "id": "ciwa-ar",
      "title": "CIWA-Ar Score",
      "titleTh": "ประเมินความรุนแรงของการถอนสุรา",
      "category": "score",
      "subcategory": "tox",
      "tags": [
        "CIWA",
        "alcohol withdrawal",
        "delirium tremens",
        "benzo"
      ],
      "keywords": [
        "CIWA-Ar",
        "alcohol withdrawal",
        "DT",
        "delirium tremens",
        "benzodiazepine",
        "ถอนเหล้า"
      ],
      "related": [
        "alcohol-withdrawal"
      ],
      "source": {
        "name": "Sullivan JT et al. Br J Addict 1989",
        "year": 1989
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "Alcohol withdrawal severity + benzodiazepine dosing guide",
      "clinicalContext": "ED / Ward / Detox — ตัดสินใจให้ benzo หรือไม่ + ขนาดยา"
    }
  },
  {
    "id": "curb-65",
    "path": "/src/content/scores/curb-65.mdx",
    "frontmatter": {
      "id": "curb-65",
      "title": "CURB-65 Score",
      "titleTh": "ประเมินความรุนแรงของปอดอักเสบ",
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
      "severity": "medium",
      "usedFor": "Severity of community-acquired pneumonia",
      "clinicalContext": "ผู้ป่วยปอดอักเสบ — ตัดสินใจ admit vs discharge vs ICU"
    }
  },
  {
    "id": "gcs",
    "path": "/src/content/scores/gcs.mdx",
    "frontmatter": {
      "id": "gcs",
      "title": "Glasgow Coma Scale (GCS)",
      "titleTh": "ประเมินระดับความรู้สึกตัว",
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
      "severity": "medium",
      "usedFor": "Consciousness level assessment",
      "clinicalContext": "ทุก case ที่มี altered consciousness, trauma, coma"
    }
  },
  {
    "id": "glasgow-blatchford",
    "path": "/src/content/scores/glasgow-blatchford.mdx",
    "frontmatter": {
      "id": "glasgow-blatchford",
      "title": "Glasgow-Blatchford Score (GBS)",
      "titleTh": "ประเมิน UGIB เพื่อตัดสินใจ admit",
      "category": "score",
      "subcategory": "gi",
      "tags": [
        "Glasgow-Blatchford",
        "GBS",
        "UGIB",
        "GI bleed"
      ],
      "keywords": [
        "Glasgow-Blatchford",
        "GBS",
        "UGIB",
        "upper GI bleeding",
        "discharge",
        "low risk"
      ],
      "related": [
        "ugib-nonvariceal",
        "ugib-variceal",
        "rockall-score"
      ],
      "source": {
        "name": "Blatchford O et al. Lancet 2000",
        "year": 2000
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "UGIB — ตัดสินใจ admit vs discharge ก่อน endoscopy",
      "clinicalContext": "ED — ก่อน scope; GBS 0 = discharge ได้ปลอดภัย"
    }
  },
  {
    "id": "heart-score",
    "path": "/src/content/scores/heart-score.mdx",
    "frontmatter": {
      "id": "heart-score",
      "title": "HEART Score",
      "titleTh": "ประเมินความเสี่ยงโรคหัวใจขาดเลือด",
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
      "severity": "medium",
      "usedFor": "ED chest pain low-risk stratification",
      "clinicalContext": "Chest pain ใน ER — ตัดสินใจ discharge หรือ observe"
    }
  },
  {
    "id": "hunt-hess",
    "path": "/src/content/scores/hunt-hess.mdx",
    "frontmatter": {
      "id": "hunt-hess",
      "title": "Hunt & Hess Grade (SAH)",
      "titleTh": "ประเมินความรุนแรง subarachnoid hemorrhage ทางคลินิก",
      "category": "score",
      "subcategory": "neuro",
      "tags": [
        "Hunt Hess",
        "SAH",
        "subarachnoid hemorrhage",
        "neurosurgery",
        "grading"
      ],
      "keywords": [
        "Hunt Hess",
        "subarachnoid hemorrhage",
        "SAH grading",
        "aneurysm",
        "vasospasm",
        "เลือดออกใต้เยื่อหุ้มสมอง"
      ],
      "related": [
        "nihss",
        "ich-score",
        "gcs"
      ],
      "source": {
        "name": "Hunt WE & Hess RM. J Neurosurg 1968; AHA/ASA SAH Guideline 2023",
        "year": 2023
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "SAH clinical severity grading — prognosis, surgical timing, ICU need",
      "clinicalContext": "ED/neurosurgery — SAH confirmed; ใช้ร่วมกับ WFNS + Fisher grade"
    }
  },
  {
    "id": "ich-score",
    "path": "/src/content/scores/ich-score.mdx",
    "frontmatter": {
      "id": "ich-score",
      "title": "ICH Score",
      "titleTh": "ประเมินความรุนแรงและการพยากรณ์โรค intracerebral hemorrhage",
      "category": "score",
      "subcategory": "neuro",
      "tags": [
        "ICH",
        "intracerebral hemorrhage",
        "stroke",
        "mortality"
      ],
      "keywords": [
        "ICH score",
        "intracerebral hemorrhage",
        "30-day mortality",
        "goals of care",
        "neurosurgery",
        "เลือดออกในสมอง"
      ],
      "related": [
        "nihss",
        "hunt-hess",
        "gcs"
      ],
      "source": {
        "name": "Hemphill JC et al. Stroke 2001; AHA/ASA ICH Guideline 2022",
        "year": 2022
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "ICH 30-day mortality prediction — guides ICU/comfort care discussion",
      "clinicalContext": "ED/ICU — ICH diagnosis; ประเมิน prognosis + goals of care"
    }
  },
  {
    "id": "lrinec-score",
    "path": "/src/content/scores/lrinec-score.mdx",
    "frontmatter": {
      "id": "lrinec-score",
      "title": "LRINEC Score",
      "titleTh": "ประเมิน necrotizing fasciitis จากผลแล็บ",
      "category": "score",
      "subcategory": "surgical",
      "tags": [
        "LRINEC",
        "necrotizing fasciitis",
        "soft tissue infection",
        "surgical emergency"
      ],
      "keywords": [
        "LRINEC",
        "necrotizing fasciitis",
        "NF",
        "flesh-eating disease",
        "surgical emergency",
        "fasciitis"
      ],
      "related": [
        "necrotizing-fasciitis"
      ],
      "source": {
        "name": "Wong CH et al. Crit Care Med 2004",
        "year": 2004
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "Necrotizing fasciitis — lab-based risk stratification (rule in, not rule out)",
      "clinicalContext": "ED / ward — ผู้ป่วย soft tissue infection ที่สงสัย NF; ไม่แทน clinical judgment"
    }
  },
  {
    "id": "meld-score",
    "path": "/src/content/scores/meld-score.mdx",
    "frontmatter": {
      "id": "meld-score",
      "title": "MELD Score (MELD-Na)",
      "titleTh": "ประเมินความรุนแรงโรคตับและลำดับ transplant",
      "category": "score",
      "subcategory": "gi",
      "tags": [
        "MELD",
        "liver",
        "cirrhosis",
        "transplant",
        "hepatology"
      ],
      "keywords": [
        "MELD score",
        "MELD-Na",
        "liver failure",
        "cirrhosis",
        "transplant priority",
        "ตับแข็ง",
        "ตับวาย"
      ],
      "related": [
        "child-pugh",
        "hepatorenal-syndrome"
      ],
      "source": {
        "name": "Kamath PS et al. Hepatology 2001; UNOS MELD-Na policy 2016",
        "year": 2016
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "Liver disease severity → transplant priority, short-term mortality",
      "clinicalContext": "Hepatology / ward — ตับแข็ง decompensated; ใช้คู่กับ Child-Pugh"
    }
  },
  {
    "id": "mews",
    "path": "/src/content/scores/mews.mdx",
    "frontmatter": {
      "id": "mews",
      "title": "Modified Early Warning Score (MEWS)",
      "titleTh": "คะแนนเตือนภัยล่วงหน้า",
      "category": "score",
      "subcategory": "general",
      "tags": [
        "MEWS",
        "early warning",
        "deterioration",
        "ward monitoring"
      ],
      "keywords": [
        "MEWS",
        "Modified Early Warning Score",
        "NEWS",
        "deterioration",
        "sepsis",
        "ward"
      ],
      "related": [
        "qsofa",
        "sofa",
        "septic-shock"
      ],
      "source": {
        "name": "Subbe CP et al. QJM 2001 + NEWS2 RCP 2017",
        "year": 2017
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "Early clinical deterioration detection",
      "clinicalContext": "Ward/ER — เตือนก่อน decompensate, เรียก MET call"
    }
  },
  {
    "id": "nihss",
    "path": "/src/content/scores/nihss.mdx",
    "frontmatter": {
      "id": "nihss",
      "title": "NIH Stroke Scale (NIHSS)",
      "titleTh": "ประเมินความรุนแรงของโรคหลอดเลือดสมอง",
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
      "severity": "high",
      "usedFor": "Stroke severity + tPA eligibility",
      "clinicalContext": "Acute stroke — baseline score + monitor หลัง treatment"
    }
  },
  {
    "id": "pesi",
    "path": "/src/content/scores/pesi.mdx",
    "frontmatter": {
      "id": "pesi",
      "title": "PESI / sPESI (Pulmonary Embolism)",
      "titleTh": "ประเมินความรุนแรงและการพยากรณ์ PE",
      "category": "score",
      "subcategory": "pulm",
      "tags": [
        "PESI",
        "sPESI",
        "pulmonary embolism",
        "PE",
        "mortality"
      ],
      "keywords": [
        "PESI score",
        "sPESI",
        "pulmonary embolism severity",
        "PE outpatient",
        "anticoagulation",
        "ลิ่มเลือดอุดปอด"
      ],
      "related": [
        "wells-pe",
        "psi-port"
      ],
      "source": {
        "name": "Aujesky D et al. Am J Respir Crit Care Med 2005; ESC PE Guideline 2019",
        "year": 2019
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "PE 30-day mortality → outpatient vs ICU disposition",
      "clinicalContext": "ED — PE confirmed (CT-PA); ตัดสิน low-risk discharge vs ICU"
    }
  },
  {
    "id": "qsofa",
    "path": "/src/content/scores/qsofa.mdx",
    "frontmatter": {
      "id": "qsofa",
      "title": "qSOFA Score",
      "titleTh": "คัดกรองภาวะติดเชื้อในกระแสเลือด",
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
      "severity": "medium",
      "usedFor": "Quick sepsis screening outside ICU",
      "clinicalContext": "สงสัย sepsis ใน ward/ER — triage เพื่อ escalate care"
    }
  },
  {
    "id": "rcri",
    "path": "/src/content/scores/rcri.mdx",
    "frontmatter": {
      "id": "rcri",
      "title": "RCRI — Revised Cardiac Risk Index",
      "titleTh": "ประเมินความเสี่ยงหัวใจก่อนผ่าตัด",
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
      "severity": "medium",
      "usedFor": "Pre-op cardiac risk (non-cardiac surgery)",
      "clinicalContext": "ประเมินก่อนผ่าตัด — ส่ง cardiology consult หรือไม่"
    }
  },
  {
    "id": "rockall-score",
    "path": "/src/content/scores/rockall-score.mdx",
    "frontmatter": {
      "id": "rockall-score",
      "title": "Rockall Score (UGIB)",
      "titleTh": "ประเมินความรุนแรงและการตายของ UGIB",
      "category": "score",
      "subcategory": "gi",
      "tags": [
        "Rockall",
        "UGIB",
        "GI bleed",
        "upper GI"
      ],
      "keywords": [
        "Rockall score",
        "UGIB",
        "upper GI bleeding",
        "mortality",
        "rebleed"
      ],
      "related": [
        "ugib-nonvariceal",
        "ugib-variceal"
      ],
      "source": {
        "name": "Rockall TA et al. Gut 1996",
        "year": 1996
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "UGIB mortality prediction + rebleed risk",
      "clinicalContext": "ED / Ward — ประเมินหลัง endoscopy; ตัดสินใจ discharge vs admit"
    }
  },
  {
    "id": "sirs-criteria",
    "path": "/src/content/scores/sirs-criteria.mdx",
    "frontmatter": {
      "id": "sirs-criteria",
      "title": "SIRS Criteria",
      "titleTh": "เกณฑ์การวินิจฉัย systemic inflammatory response syndrome",
      "category": "score",
      "subcategory": "id",
      "tags": [
        "SIRS",
        "sepsis",
        "systemic inflammation",
        "screening"
      ],
      "keywords": [
        "SIRS criteria",
        "systemic inflammatory response",
        "sepsis screening",
        "qSOFA",
        "SOFA",
        "ภาวะอักเสบทั่วร่างกาย"
      ],
      "related": [
        "qsofa",
        "sofa",
        "septic-shock"
      ],
      "source": {
        "name": "Bone RC et al. ACCP/SCCM Consensus Conference. Chest 1992",
        "year": 1992
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "SIRS identification — screen for sepsis; historical but still used clinically",
      "clinicalContext": "ED/ward — ผู้ป่วยมีสัญญาณ systemic inflammation; ใช้ร่วมกับ qSOFA/SOFA"
    }
  },
  {
    "id": "sofa",
    "path": "/src/content/scores/sofa.mdx",
    "frontmatter": {
      "id": "sofa",
      "title": "SOFA Score",
      "titleTh": "ประเมินอวัยวะล้มเหลวในภาวะวิกฤต",
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
      "severity": "medium",
      "usedFor": "ICU organ failure severity + sepsis definition",
      "clinicalContext": "Sepsis-3 diagnosis + ICU prognosis + monitoring"
    }
  },
  {
    "id": "timi",
    "path": "/src/content/scores/timi.mdx",
    "frontmatter": {
      "id": "timi",
      "title": "TIMI Risk Score (UA/NSTEMI)",
      "titleTh": "ประเมินความเสี่ยง UA/NSTEMI",
      "category": "score",
      "subcategory": "cardiac",
      "tags": [
        "TIMI",
        "NSTEMI",
        "UA",
        "ACS",
        "risk stratification"
      ],
      "keywords": [
        "TIMI",
        "TIMI risk score",
        "UA",
        "NSTEMI",
        "ACS",
        "risk stratification"
      ],
      "related": [
        "acs-nstemi",
        "heart-score",
        "stemi"
      ],
      "source": {
        "name": "Antman EM et al. JAMA 2000 + AHA/ACC NSTEMI 2014",
        "year": 2014
      },
      "last_reviewed": "2026-04",
      "confidence": "high",
      "severity": "high",
      "usedFor": "UA/NSTEMI 14-day risk stratification",
      "clinicalContext": "ACS ที่ไม่ใช่ STEMI — ตัดสินใจ early invasive vs conservative"
    }
  },
  {
    "id": "wells-pe",
    "path": "/src/content/scores/wells-pe.mdx",
    "frontmatter": {
      "id": "wells-pe",
      "title": "Wells Score for Pulmonary Embolism",
      "titleTh": "ประเมินความเสี่ยงลิ่มเลือดอุดปอด",
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
      "severity": "medium",
      "usedFor": "PE pre-test probability",
      "clinicalContext": "สงสัย PE — ตัดสินใจ D-dimer vs CTPA"
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
