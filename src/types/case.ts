export type Sex = 'M' | 'F' | 'unknown';

export type RenalFunction = {
  creatinine?: number;
  bun?: number;
  egfr?: number;
  ckdStage?: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | 'G5D';
  onDialysis?: boolean;
};

export type ToolSession = {
  toolId: string;
  toolName: string;
  summary: string;
  timestamp: number;
};

export type PatientCase = {
  id: string;
  name: string;
  age?: number;
  sex?: Sex;
  weight?: number;
  chiefComplaint?: string;
  renal?: RenalFunction;
  comorbidities?: string[];
  toolSessions: ToolSession[];
  createdAt: number;
  updatedAt: number;
};
