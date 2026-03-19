const API_BASE = import.meta.env.VITE_MIA_API_URL;

export async function createSession(idToken: string): Promise<{ session_id: string }> {
  const response = await fetch(`${API_BASE}/api/session/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) throw new Error('Session creation failed');
  return response.json() as Promise<{ session_id: string }>;
}

export async function validateSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/session/validate`, {
      method: 'POST',
      headers: { 'X-Session-ID': sessionId },
    });
    return response.ok;
  } catch {
    return false;
  }
}
