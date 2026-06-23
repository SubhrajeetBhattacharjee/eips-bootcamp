import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:4000";

const ALLOWED_PREFIXES = [
  '/referrals/leaderboard/all',
  '/cap/analytics/admin',
  '/cap/status/',
  '/users/clerk/',
];

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const path = url.searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  // Whitelist check to prevent arbitrary traversal
  const isAllowed = ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix));
  if (!isAllowed) {
    return NextResponse.json({ error: 'Forbidden path' }, { status: 403 });
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'x-api-key': process.env.INTERNAL_API_KEY || 'dev-secret-key' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API Proxy Error:", err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
