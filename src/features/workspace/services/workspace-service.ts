import type { WorkspacesResponse } from '../types';
import { LOCAL_TEST_WORKSPACES } from '../../../config/local-test-mode';

export async function fetchWorkspaces(sessionId: string): Promise<WorkspacesResponse> {
  if (!sessionId) {
    throw new Error('Missing local test session');
  }

  return Promise.resolve({ tenants: LOCAL_TEST_WORKSPACES });
}
