export interface APIResponse {
  predictions: {label: string, confidence: number}[];
};