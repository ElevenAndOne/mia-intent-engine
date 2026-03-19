export type Workspace = {
  tenant_id: string;
  name: string;
  role: string;
};

export type WorkspacesResponse = {
  tenants: Workspace[];
};
