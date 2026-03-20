import { useState, useEffect, useCallback } from 'react';
import { LOCAL_TEST_SESSION_ID } from '../../../config/local-test-mode';

export function useAuth() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const error = null;

  useEffect(() => {
    setSessionId(LOCAL_TEST_SESSION_ID);
    setIsLoading(false);
  }, []);

  const login = useCallback(async () => {
    setSessionId(LOCAL_TEST_SESSION_ID);
  }, []);

  const logout = useCallback(() => {
    setSessionId(LOCAL_TEST_SESSION_ID);
  }, []);

  return { sessionId, isAuthenticated: !!sessionId, isLoading, error, login, logout };
}
