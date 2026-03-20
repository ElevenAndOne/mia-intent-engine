import type { ParsedCampaign } from '../../types/campaign';

export type ParseResponse = {
  success: boolean;
  filename: string;
  tenant_id: string;
  campaign_name: string;
  client_name: string;
  phases_count: number;
  s3_raw?: string;
  s3_parsed?: string;
  parsed_data: ParsedCampaign;
  source?: 'live' | 'sample';
  message?: string;
};
