import type { Workspace } from '../features/workspace/types';

export const USE_LOCAL_TEST_MODE = true;
export const LOCAL_TEST_SESSION_ID = 'local-test-session';

export const LOCAL_TEST_WORKSPACES: Workspace[] = [
  { tenant_id: 'tn_abc123', name: 'Dutoit Agency', role: 'owner' },
  { tenant_id: 'tn_xyz789', name: 'Another Workspace', role: 'admin' },
];
