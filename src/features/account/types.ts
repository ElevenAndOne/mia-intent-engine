export type Account = {
  id: string;
  name: string;
  google_ads_id?: string;
};

export type AccountsResponse = {
  accounts: Account[];
};
