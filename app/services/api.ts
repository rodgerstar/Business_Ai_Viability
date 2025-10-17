import axios from 'axios';
import { AnalyzeResponse } from '../types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000').replace(/\/$/, '');

// Updated payload type to include optional section/building
export const analyzeBusiness = async (payload: { 
  town: string; budget: number; businessType: string; 
  section?: string; building?: string;  // New optional
}): Promise<AnalyzeResponse> => {
  const res = await axios.post<AnalyzeResponse>(`${API_BASE}/api/analyze`, payload);
  return res.data;
};

export const sendFollowUp = async (payload: { originalContext: any; userQuestion: string; history: any[] }) => {
  const res = await axios.post<{ aiResponse: string }>(`${API_BASE}/api/followup`, payload);
  return res.data.aiResponse;
};

export const adoptOutcome = async (outcomeId: number, adopted: boolean) => {
  await axios.patch(`${API_BASE}/api/adopt`, { outcomeId, adopted });
};