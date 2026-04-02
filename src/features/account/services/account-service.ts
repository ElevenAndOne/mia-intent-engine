import type { Account, AccountsResponse } from '../types';

const API_BASE = import.meta.env.VITE_MIA_API_URL;

type TenantsResponse = {
  tenants: { tenant_id: string; name: string }[];
};

export async function fetchAccounts(sessionId: string): Promise<AccountsResponse> {
  const response = await fetch(`${API_BASE}/api/tenants`, {
    headers: { 'X-Session-ID': sessionId },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Failed to fetch accounts');
  }

  const data = (await response.json()) as TenantsResponse;

  const accounts: Account[] = data.tenants.map(t => ({
    id: t.tenant_id,
    name: t.name,
  }));

  return { accounts };
}
