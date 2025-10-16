// app/types.ts
export interface ApiResponse {
  viability_score: number;
  summary: string;
  reasoning: string[];
  recommendations: string[];
  alternatives: { business: string; why: string }[];
  security_actions: string[];
  confidence_note?: string;
  outcomeId?: number;  // Added for adoption
}

// New: Union type for /api/analyze responses (success or error)
export type AnalyzeResponse = ApiResponse | { error: string; message?: string };

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
}

// Quick question type (for chat)
export interface QuickQuestion {
  label: string;
  prompt: string;
}