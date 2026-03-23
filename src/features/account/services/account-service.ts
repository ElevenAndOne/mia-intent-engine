import type { AccountsResponse } from '../types';

const API_BASE = import.meta.env.VITE_MIA_API_URL;

export async function fetchAccounts(sessionId: string): Promise<AccountsResponse> {
  const response = await fetch(`${API_BASE}/api/accounts/available`, {
    headers: { 'X-Session-ID': sessionId },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Failed to fetch accounts');
  }

  return response.json() as Promise<AccountsResponse>;
}
