import type { WorkspacesResponse } from '../types';

const API_BASE = import.meta.env.VITE_MIA_API_URL;

export async function fetchWorkspaces(sessionId: string): Promise<WorkspacesResponse> {
  const response = await fetch(`${API_BASE}/api/tenants`, {
    headers: { 'X-Session-ID': sessionId },
  });

  if (!response.ok) throw new Error('Failed to fetch workspaces');
  return response.json() as Promise<WorkspacesResponse>;
}
