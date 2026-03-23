import type { ParsedCampaign } from '../../../types/campaign';
import type { SubmissionResponse } from '../types';

const PARSER_URL = import.meta.env.VITE_PARSER_URL;
const PARSER_API_KEY = import.meta.env.VITE_PARSER_API_KEY;

function buildSampleSubmissionResponse(data: ParsedCampaign, tenantId: string, accountId: string): SubmissionResponse {
  return {
    success: true,
    tenant_id: tenantId,
    account_id: accountId,
    campaign_name: data.campaign.campaign_name,
    mia_import: {
      status: 'ok',
      campaign_id: 'sample-dutoit-apple-pie-day',
      campaign_name: data.campaign.campaign_name,
      phases_created: data.phases.length,
    },
  };
}

export async function submitCampaign(data: ParsedCampaign, tenantId: string, accountId: string, filename: string): Promise<SubmissionResponse> {
  if (!PARSER_URL) {
    return buildSampleSubmissionResponse(data, tenantId, accountId);
  }

  const response = await fetch(`${PARSER_URL}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': PARSER_API_KEY,
    },
    body: JSON.stringify({
      tenant_id: tenantId,
      account_id: accountId,
      parsed_data: data,
      filename,
    }),
  });

  if (!response.ok) throw new Error('Submission failed');
  return response.json() as Promise<SubmissionResponse>;
}
