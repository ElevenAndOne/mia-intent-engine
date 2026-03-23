export type Account = {
  id: string;
  name: string;
  google_ads_id?: string;
  tenant_id?: string;
};

export type AccountsResponse = {
  accounts: Account[];
};
