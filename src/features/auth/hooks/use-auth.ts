import { useState, useEffect, useCallback } from 'react';
import { createSession, validateSession } from '../services/auth-service';

const SESSION_KEY = 'mia_session_id';

export function useAuth() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      validateSession(stored)
        .then(valid => {
          if (valid) setSessionId(stored);
          else localStorage.removeItem(SESSION_KEY);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (idToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createSession(idToken);
      localStorage.setItem(SESSION_KEY, result.session_id);
      setSessionId(result.session_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    if (typeof google !== 'undefined') {
      google.accounts.id.disableAutoSelect();
    }
  }, []);

  return { sessionId, isAuthenticated: !!sessionId, isLoading, error, login, logout };
}
