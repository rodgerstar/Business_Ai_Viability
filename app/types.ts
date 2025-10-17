export interface ApiResponse {
  viability_score: number;
  summary: string;
  reasoning: string[];
  recommendations: string[];
  alternatives: { business: string; why: string }[];
  security_actions: string[];
  confidence_note?: string;
  outcomeId?: number;
}

// Updated: Handle new errors from backend (coming_soon, building_not_found)
export type AnalyzeResponse = ApiResponse | { error: 'coming_soon' | 'building_not_found' | string; message?: string };

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
}

export interface QuickQuestion {
  label: string;
  prompt: string;
}