import { useState, useEffect, useCallback } from 'react';
import type { Workspace } from '../types';
import { fetchWorkspaces } from '../services/workspace-service';

export function useWorkspaces(sessionId: string | null) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    fetchWorkspaces(sessionId)
      .then(data => {
        setWorkspaces(data.tenants);
        if (data.tenants.length === 1) {
          setSelectedWorkspace(data.tenants[0] ?? null);
        }
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load workspaces'))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  const selectWorkspace = useCallback((tenantId: string) => {
    const workspace = workspaces.find(w => w.tenant_id === tenantId) ?? null;
    setSelectedWorkspace(workspace);
  }, [workspaces]);

  return { workspaces, selectedWorkspace, isLoading, error, selectWorkspace };
}
