import type { ParsedCampaign } from '../../types/campaign';

export type ParseResponse = {
  success: boolean;
  campaign_name: string;
  client_name: string;
  phases_count: number;
  parsed_data: ParsedCampaign;
  source?: 'live' | 'sample';
  message?: string;
  mia_import: {
    status: string;
    campaign_id: string;
  };
};
