import type { CompleteOAuthResponse, GoogleAuthUrlResponse, SessionResponse } from '../types';

const API_BASE = import.meta.env.VITE_MIA_API_URL;
const SESSION_REQUEST_TIMEOUT_MS = 15000;

async function fetchWithTimeout(input: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SESSION_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Session validation timed out. Check the API endpoint, CORS, or production headers.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function createClientSessionId(): string {
  const randomSuffix = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `session_${Date.now()}_${randomSuffix}`;
}

export async function fetchGoogleAuthUrl(frontendOrigin: string): Promise<string> {
  const url = new URL(`${API_BASE}/api/oauth/google/auth-url`);
  url.searchParams.set('frontend_origin', frontendOrigin);
  const response = await fetchWithTimeout(url.toString(), { method: 'GET' });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Failed to start Google OAuth (${response.status})`);
  }

  const result = (await response.json()) as GoogleAuthUrlResponse;

  if (!result.auth_url) {
    throw new Error('OAuth start succeeded but no auth_url was returned.');
  }

  return result.auth_url;
}

export async function completeGoogleOAuth(userId: string, sessionId: string): Promise<CompleteOAuthResponse> {
  const url = new URL(`${API_BASE}/api/oauth/google/complete`);
  url.searchParams.set('user_id', userId);
  const response = await fetchWithTimeout(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
    },
    body: '{}',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `OAuth completion failed (${response.status})`);
  }

  return (await response.json()) as CompleteOAuthResponse;
}

export async function fetchSession(sessionId: string): Promise<SessionResponse> {
  const url = new URL(`${API_BASE}/api/session/validate`);
  url.searchParams.set('session_id', sessionId);
  const response = await fetchWithTimeout(url.toString(), { method: 'GET' });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Session validation failed (${response.status})`);
  }

  return (await response.json()) as SessionResponse;
}
