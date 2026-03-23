export type SubmissionResponse = {
  success: boolean;
  tenant_id: string;
  account_id?: string;
  campaign_name: string;
  mia_import: {
    status: string;
    campaign_id: string;
    campaign_name: string;
    phases_created: number;
  };
};
