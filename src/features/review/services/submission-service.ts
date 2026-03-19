import type { ParsedCampaign } from '../../../types/campaign';
import type { SubmissionResponse } from '../types';

const API_BASE = import.meta.env.VITE_SUBMISSION_API_URL || import.meta.env.VITE_MIA_API_URL;

export async function submitCampaign(data: ParsedCampaign, sessionId: string): Promise<SubmissionResponse> {
  const response = await fetch(`${API_BASE}/api/campaigns/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Submission failed');
  return response.json() as Promise<SubmissionResponse>;
}
