import { useCallback, useEffect, useState } from 'react';
import { completeGoogleOAuth, createClientSessionId, fetchGoogleAuthUrl, fetchSession } from '../services/auth-service';
import type { AuthUser, SessionResponse } from '../types';

const SESSION_KEY = 'mia_session_id';

function getFrontendOrigin(): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url.toString();
}

function clearOAuthParams(): void {
  const url = new URL(window.location.href);
  const hadOAuthParams = url.searchParams.has('oauth_complete') || url.searchParams.has('user_id');

  if (!hadOAuthParams) {
    return;
  }

  url.searchParams.delete('oauth_complete');
  url.searchParams.delete('user_id');
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
}

function resolveTenantId(session: SessionResponse): string | null {
  return session.tenant_id ?? null;
}

export function useAuth() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const applyAuthenticatedSession = (nextSessionId: string, session: SessionResponse, fallbackUser?: AuthUser | null) => {
      if (!isMounted) {
        return;
      }

      setSessionId(nextSessionId);
      setTenantId(resolveTenantId(session));
      setUser(session.user ?? fallbackUser ?? null);
    };

    const clearStoredSession = () => {
      localStorage.removeItem(SESSION_KEY);

      if (!isMounted) {
        return;
      }

      setSessionId(null);
      setTenantId(null);
      setUser(null);
    };

    const initializeAuth = async () => {
      const url = new URL(window.location.href);
      const oauthComplete = url.searchParams.get('oauth_complete');
      const userId = url.searchParams.get('user_id');

      if (oauthComplete === 'google' && userId) {
        try {
          const nextSessionId = createClientSessionId();
          const completion = await completeGoogleOAuth(userId, nextSessionId);
          const persistedSessionId = completion.session_id ?? nextSessionId;
          localStorage.setItem(SESSION_KEY, persistedSessionId);
          const session = await fetchSession(persistedSessionId);
          applyAuthenticatedSession(persistedSessionId, session, completion.user ?? null);
        } catch (err) {
          clearStoredSession();
          if (isMounted) {
            setError(err instanceof Error ? err.message : 'Login failed');
          }
        } finally {
          clearOAuthParams();
          if (isMounted) {
            setIsLoading(false);
          }
        }
        return;
      }

      const stored = localStorage.getItem(SESSION_KEY);

      if (!stored) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const session = await fetchSession(stored);
        applyAuthenticatedSession(stored, session);
      } catch {
        clearStoredSession();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authUrl = await fetchGoogleAuthUrl(getFrontendOrigin());
      window.location.assign(authUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    } finally {
      clearOAuthParams();
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setTenantId(null);
    setUser(null);
  }, []);

  return { sessionId, tenantId, user, isAuthenticated: !!sessionId, isLoading, error, login, logout };
}
