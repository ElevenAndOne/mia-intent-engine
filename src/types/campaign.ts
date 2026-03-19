export type CampaignMeta = {
  source_file: string;
  parsed_at: string;
  figjam_version: string;
  schema_version: string;
};

export type Kpi = {
  kpi_name: string;
  target_value: string;
  target_numeric: number;
  unit: string;
};

export type Asset = {
  asset_name: string;
  asset_type: string;
  key_message?: string;
  cta?: string;
  details?: Record<string, string>;
};

export type ChannelAction = {
  channel: string;
  objective: string;
  strategy: string;
  assets: Asset[];
};

export type Phase = {
  phase_name: string;
  sort_order: number;
  objective: string;
  strategy: string;
  kpis: Kpi[];
  channel_actions: ChannelAction[];
};

export type Campaign = {
  client_name: string;
  campaign_name: string;
  start_date: string;
  end_date: string;
  budget_total: number;
  budget_monthly: number;
  budget_currency: string;
  status: string;
  channels: string[];
  objectives: string[];
};

export type ParsedCampaign = {
  meta: CampaignMeta;
  campaign: Campaign;
  phases: Phase[];
};
