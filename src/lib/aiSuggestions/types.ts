export type AIStatus = 'idle' | 'loading' | 'done' | 'error';

export interface AIToolInput {
  /** Tool identifier for prompt routing */
  tool: string;
  /** Key-value pairs of the current tool state to include in the prompt */
  data: Record<string, string | number | null | undefined>;
  /** Patient body weight — defaults to 60 kg for standard dosing */
  bw?: number;
}
