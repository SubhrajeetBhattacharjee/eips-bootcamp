const API_BASE = 'http://127.0.0.1:4000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('x-api-key', 'dev-secret-key');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}