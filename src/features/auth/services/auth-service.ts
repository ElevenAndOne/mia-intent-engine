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

export async function createSession(idToken: string): Promise<{ session_id: string }> {
  const response = await fetchWithTimeout(`${API_BASE}/api/session/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Session creation failed (${response.status})`);
  }

  const result = (await response.json()) as { session_id?: string };

  if (!result.session_id) {
    throw new Error('Session creation succeeded but no session_id was returned.');
  }

  return { session_id: result.session_id };
}

export async function validateSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/api/session/validate`, {
      method: 'POST',
      headers: { 'X-Session-ID': sessionId },
    });
    return response.ok;
  } catch {
    return false;
  }
}
